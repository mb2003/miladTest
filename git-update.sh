#!/usr/bin/env bash
set -Eeuo pipefail

REMOTE="origin"
NEW_BRANCH_PREFIX="chore/EVOPXL-Git-Branch-Update-"
ALL_SUFFIXES=("preview-a" "preview-b" "preview-c" "preview-d", "preview-e")
SUFFIXES=("${ALL_SUFFIXES[@]}")
MAIN_WINS_ON_CONFLICTS=false

die() {
  echo "ERROR: $*" >&2
  exit 1
}

info() {
  echo "==> $*"
}

warn() {
  echo "WARN: $*" >&2
}

usage() {
  cat <<'EOF'
Usage:
  ./git-update.sh
  ./git-update.sh preview=a,b
  ./git-update.sh --main-wins
  ./git-update.sh preview=a,b --main-wins

Examples:
  ./git-update.sh preview=a,b
  ./git-update.sh preview=preview-a,preview-c
  ./git-update.sh preview=a,b --main-wins

When no preview filter is provided, all configured previews are updated.
`--main-wins` auto-resolves rebase conflicts in favor of the base branch.
EOF
}

is_known_suffix() {
  local candidate="$1"
  local suffix

  for suffix in "${ALL_SUFFIXES[@]}"; do
    [[ "${suffix}" == "${candidate}" ]] && return 0
  done

  return 1
}

parse_preview_filter() {
  local raw_value="$1"
  local token=""
  local normalized=""
  local selected=()
  local seen=" "

  [[ -n "${raw_value}" ]] || die "The preview filter is empty. Example: preview=a,b"

  IFS=',' read -r -a requested_previews <<< "${raw_value}"

  for token in "${requested_previews[@]}"; do
    token="${token//[[:space:]]/}"
    [[ -n "${token}" ]] || continue

    if [[ "${token}" == "all" ]]; then
      SUFFIXES=("${ALL_SUFFIXES[@]}")
      return 0
    fi

    normalized="${token#preview-}"
    normalized="preview-${normalized}"

    is_known_suffix "${normalized}" || die "Unknown preview '${token}'. Allowed values: a,b,c,d"

    if [[ "${seen}" != *" ${normalized} "* ]]; then
      selected+=("${normalized}")
      seen+="${normalized} "
    fi
  done

  (( ${#selected[@]} > 0 )) || die "No valid previews were provided. Example: preview=a,b"
  SUFFIXES=("${selected[@]}")
}

parse_args() {
  local arg

  for arg in "$@"; do
    case "${arg}" in
      preview=*)
        parse_preview_filter "${arg#preview=}"
        ;;
      --main-wins)
        MAIN_WINS_ON_CONFLICTS=true
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        die "Unknown argument '${arg}'. Use --help for usage."
        ;;
    esac
  done
}

parse_args "$@"

# Ensure we are inside a git repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Not inside a git repository."

# Ensure remote exists
git remote get-url "$REMOTE" >/dev/null 2>&1 || die "Remote '$REMOTE' does not exist."

# Require clean working tree to avoid branch switch / rebase issues
if ! git diff --quiet || ! git diff --cached --quiet; then
  die "Working tree is not clean. Commit or stash your changes first."
fi

# Remember current ref
CURRENT_REF="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || git rev-parse --short HEAD)"

info "Fetching all remotes..."
git fetch --all --prune

# Detect remote default branch
DEFAULT_BRANCH="$(git symbolic-ref --quiet --short "refs/remotes/${REMOTE}/HEAD" 2>/dev/null | sed "s#^${REMOTE}/##" || true)"

if [[ -z "${DEFAULT_BRANCH}" ]]; then
  DEFAULT_BRANCH="$(git remote show "$REMOTE" | awk '/HEAD branch/ {print $NF}')"
fi

[[ -n "${DEFAULT_BRANCH}" ]] || die "Could not determine default branch for remote '$REMOTE'."

BASE_REF="${REMOTE}/${DEFAULT_BRANCH}"
info "Default branch detected: ${BASE_REF}"
info "Target previews: ${SUFFIXES[*]}"
if [[ "${MAIN_WINS_ON_CONFLICTS}" == "true" ]]; then
  info "Conflict strategy: base branch wins for conflicting hunks during rebase"
fi

FAILED_REBASES=()

find_matching_remote_branches() {
  local suffix="$1"

  git for-each-ref --format='%(refname:short)' "refs/remotes/${REMOTE}" \
    | grep -E "${suffix}$" || true
}

rebase_remote_branch() {
  local remote_branch="$1"
  local local_branch="${remote_branch#${REMOTE}/}"
  local rebase_cmd=(git rebase)

  info "Rebasing ${remote_branch} onto ${BASE_REF}..."

  # Create/reset local branch to match remote branch
  git checkout -B "${local_branch}" "${remote_branch}"

  if [[ "${MAIN_WINS_ON_CONFLICTS}" == "true" ]]; then
    rebase_cmd+=(--merge -X ours)
  fi

  rebase_cmd+=("${BASE_REF}")

  if ! "${rebase_cmd[@]}"; then
    warn "Rebase failed for ${remote_branch}. Aborting only this rebase."
    git rebase --abort || true
    FAILED_REBASES+=("${remote_branch}")
    git checkout "${CURRENT_REF}" >/dev/null 2>&1 || true
    return 1
  fi

  info "Rebase succeeded for ${remote_branch}"

  git checkout "${CURRENT_REF}" >/dev/null 2>&1 || true
  return 0
}

create_and_push_branch() {
  local suffix="$1"
  local new_branch="${NEW_BRANCH_PREFIX}${suffix}"

  info "Creating missing branch ${new_branch} from ${BASE_REF}..."
  git checkout -B "${new_branch}" "${BASE_REF}"
  git push -u "${REMOTE}" "${new_branch}"
  git checkout "${CURRENT_REF}" >/dev/null 2>&1 || true
  info "Pushed ${new_branch}"
}

for suffix in "${SUFFIXES[@]}"; do
  matches=()
  while IFS= read -r remote_branch; do
    [[ -n "${remote_branch}" ]] || continue
    matches+=("${remote_branch}")
  done < <(find_matching_remote_branches "${suffix}")

  if (( ${#matches[@]} > 0 )); then
    for remote_branch in "${matches[@]}"; do
      rebase_remote_branch "${remote_branch}" || true
    done
  else
    create_and_push_branch "${suffix}"
  fi
done

info "Switching back to ${CURRENT_REF}..."
git checkout "${CURRENT_REF}"

if (( ${#FAILED_REBASES[@]} > 0 )); then
  warn "Completed with rebase failures on these branches:"
  for branch in "${FAILED_REBASES[@]}"; do
    warn "  - ${branch}"
  done
  exit 1
fi

info "Done."
