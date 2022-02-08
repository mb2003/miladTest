import React, { useState } from "react";
import "./App.css";
import Row from "./Row";
import Button from "./Button";
import Show from "./Show";
export interface Task {
  id: number;
  text: string;
}

function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [on, setOn] = useState(true);
  const onSubmit = () => {
    const newTask = { text: input, id: Math.floor(Math.random() * 1000) };
    const Regex = /^(?!\s*$).+/;

    if (Regex.test(input)) {
      setTasks([...tasks, newTask]);
      setInput("");
    } else {
      alert("Sie müssen eine Aufgabe eingeben");
    }
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    setInput(e.target.value);
  };

  const handleOnKeypress:
    | React.KeyboardEventHandler<HTMLInputElement>
    | undefined = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const handleDelete = (taskToDelete: string): void => {
    setTasks(
      tasks.filter((task) => {
        return task.text != taskToDelete;
      })
    );
  };

  const changeShow = () =>{
    if (on === true) {
      setOn(false);
    }
    else{
      setOn(true);
    }
  }

  return (
    
    <div>
      <Show state={on}/>
      <button onClick={changeShow}>ON/OFF</button>
    <br />
      <Button onClick={onSubmit}>Add Task</Button>
      <input
        type="text"
        value={input}
        onChange={handleInput}
        onKeyPress={handleOnKeypress}
        placeholder="Task eingeben"
      />
      <h1>Tasks:</h1>
      <table>
        <Row tasks={tasks} handleDelete={handleDelete} />
      </table>
    
    </div>
  );
}
export default App;
