import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

//Define bascially just tables
export default defineSchema({
  todos: defineTable({
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
  }),
});
