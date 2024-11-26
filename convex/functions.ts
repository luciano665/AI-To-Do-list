import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

//Function query: pulls data form DB
export const listTodos = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").collect(); // get all todos from DB
  },
});

//CreateTodo function: using mutation to autaticaaly handles when a todo is added to the todo's list
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      completed: false,
    });
  },
});

//UpdateTodo: is the replacement of the onChange we had before
export const updateTodo = mutation({
  args: {
    id: v.id("todos"), //string id locked-on the specific table
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      completed: args.completed,
    });
  },
});

//DeleteTodo: replacement of onRemove() call we had before
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
