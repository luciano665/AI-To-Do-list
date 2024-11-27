import { action } from "./_generated/server";
import { internal } from "./_generated/api"; // -> how we reference other functions within out convex API
import { v } from "convex/values";
import OpenAI from "openai";
import { requireUser } from "./helper";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const generateTodos = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate a list of 3 to 5 to-dos based on the given prompt. Make sure to include a title and description. Also make sure to return a JSON object in the following format: { todos: [{title: string, description:string}] }",
        },
        {
          role: "user",
          content: `Prompt: ${args.prompt}`,
        },
      ],
      //Feature to specify desired format of response, which also requires to specify schema -> we did that on the system prompt-content above.
      response_format: { type: "json_object" },
    });
    //Get the actual content of the response
    const content = JSON.parse(response.choices[0].message.content!) as {
      todos: { title: string; description: string }[]; // -> returns array of title-string and description string, in the front-end when calling the generateTodos
    };
    await ctx.runMutation(internal.functions.createManyTodos, {
      todos: content.todos,
      userId: user.tokenIdentifier,
    });
    return content;
  },
});
