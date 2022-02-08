import React, { useState } from "react";
import { Task } from "./App";
import Button from "./Button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from '@mui/material/IconButton';

interface RowProps {
  tasks: Task[];
  handleDelete(TaskName: string): void;
}

function Row({ tasks, handleDelete }: RowProps) {
  function deleteItem() {}

  return (
    <>
      {tasks.map((task) => (
        <tr key={task.id} className={String(task.id)}>
          <td>{task.text}</td>
          <td>
            <IconButton onClick={() => handleDelete(task.text)}><DeleteForeverIcon/></IconButton>
          </td>
        </tr>
      ))}
    </>
  );
}

export default Row;
