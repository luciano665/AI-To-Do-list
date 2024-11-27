import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./helper";

//Function query: pulls data form DB
export const listTodos = query({
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return await ctx.db
      .query("todos")
      .withIndex("by_user_id", (q) => q.eq("userId", user.tokenIdentifier))
      .collect(); // get all todos from DB filtering by userId specifig such that we do not leak info to other users todos, indexing the queries
  },
});

//CreateTodo function: using mutation to autaticaaly handles when a todo is added to the todo's list
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      completed: false,
      userId: user.tokenIdentifier,
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
    const user = await requireUser(ctx);
    const todo = await ctx.db.get(args.id);
    if (todo?.userId !== user.tokenIdentifier) {
      throw new Error("Unauthorized");
    }
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
    const user = await requireUser(ctx);
    const todo = await ctx.db.get(args.id);
    if (todo?.userId !== user.tokenIdentifier) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.id);
  },
});

//createManyTodos: for the actions call from the LLM response to user query.
//internalMutation -> can only be call from another action, query or mutation.
export const createManyTodos = internalMutation({
  args: {
    userId: v.string(),
    todos: v.array(v.object({ title: v.string(), description: v.string() })),
  },
  handler: async (ctx, args) => {
    for (const todo of args.todos) {
      await ctx.db.insert("todos", {
        title: todo.title,
        description: todo.description,
        completed: false,
        userId: args.userId,
      });
    }
  },
});
