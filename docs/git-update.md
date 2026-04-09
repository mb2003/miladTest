# git-update.sh

`git-update.sh` ist ein kleines Hilfsscript, um Preview-Branches auf den aktuellen Stand des Default-Branches von `origin` zu ziehen.

Es prüft zuerst, ob du in einem Git-Repo bist und ob dein Working Tree sauber ist. Danach holt es die neuesten Remote-Daten, erkennt automatisch den Default-Branch, rebased passende Preview-Branches darauf und legt fehlende Preview-Branches bei Bedarf neu an.

## Aufruf

```bash
./git-update.sh
./git-update.sh preview=a,b
./git-update.sh preview=a,b --main-wins
```

## Was die Optionen machen

- Ohne `preview=...` werden alle im Script hinterlegten Preview-Ziele bearbeitet.
- Mit `preview=a,b` werden nur diese Previews berücksichtigt.
- Mit `--main-wins` werden Rebase-Konflikte zugunsten des Basis-Branches aufgelöst.

## Gut zu wissen

Das Script wechselt während des Laufs zwischen Branches. Deshalb sollte vorher nichts Uncommittetes im Working Tree liegen.

Fehlende Preview-Branches werden neu erzeugt und gepusht. Bereits vorhandene Branches werden rebased, aber dabei nicht automatisch zurück auf den Remote gepusht.
