import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

//Define basically just table format of how we will store out data
export default defineSchema({
  todos: defineTable({
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
    userId: v.string(),
  }).index("by_user_id", ["userId"]),
});
