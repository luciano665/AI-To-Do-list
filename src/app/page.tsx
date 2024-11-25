"use client";
import { useState } from "react";
import { NewToDoForm } from "./components/new-todo-form";
import { title } from "process";

type ToDoItem = {
  title: string;
  description: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<ToDoItem[]>([]); // -> ToDo item type of type Array and set that to empty array

  return (
    <div className="max-w-screen-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">To-Do List</h1>
      <ul className="space-y-2">
        {todos.map(({ title, description, completed }, index) => (
          <ToDoItem
            title={title}
            description={description}
            completed={completed}
            onCompleteChanged={(newValue) => {
              setTodos((prev) => {
                const newToDos = [...prev];
                newToDos[index].completed = newValue;
                return newToDos;
              });
            }}
            onRemove={() => {
              setTodos((prev) => {
                const newToDos = [...prev].filter((_, i) => i !== index); // we want evertything to be includes except for that specific index
                return newToDos;
              });
            }}
          />
        ))}
      </ul>
      <NewToDoForm
        onCreate={(title, description) => {
          setTodos((prev) => {
            const newToDos = [...prev];
            newToDos.push({ title, description, completed: false });
            return newToDos;
          });
        }}
      />
    </div>
  );
}

function ToDoItem({
  title,
  description,
  completed,
  onCompleteChanged,
  onRemove,
}: {
  title: string;
  description: string;
  completed: boolean;
  onCompleteChanged: (newValue: boolean) => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex gap-2 border rounded p-2">
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => onCompleteChanged(e.target.checked)}
      />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="tex-sm text-grey-600">{description}</p>
      </div>
      <div>
        <button
          type="button"
          className="text-red-500"
          onClick={() => onRemove()}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
