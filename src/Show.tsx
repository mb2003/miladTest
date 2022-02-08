import { jsx } from "@emotion/react";
import React from "react";


interface show{
    state: boolean
}

function Show(props: show) {
  if (props.state === true) {
    return (
      <>
        <h1>It is on!</h1>
      </>
    );
  } else {
    return (
      <>
        <h1>It is off</h1>
      </>
    );
  }
}

export default Show;
