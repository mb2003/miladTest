import React from "react";




function Button(props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
    <>
      <button {...props}>{props.children}</button>
    </>
  );
}

export default Button;
