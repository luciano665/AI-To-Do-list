"use client";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { NewToDoForm } from "./components/new-todo-form";
import { ToDoList } from "./components/to-do-list";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export default function Home() {
  return (
    <div className="max-w-screen-md mx-auto p-4 space-y-4">
      <Authenticated>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">To-Do List</h1>
          <UserButton />
        </div>
        <ToDoList />
        <NewToDoForm />
      </Authenticated>
      <Unauthenticated>
        <p className="text-gray-500">Please sign in to continue</p>
        <SignInButton>
          <button className="p-1 bg-blue-300 text-white rounded">
            Sign in
          </button>
        </SignInButton>
      </Unauthenticated>
      <AuthLoading>
        <p>Loading....</p>
      </AuthLoading>
    </div>
  );
}
