import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import Task from "../models/Task.js";

const model = new ChatGoogleGenerativeAI({
  apiKey: "AIzaSyCcD0jhpp6smtliL1ceA4puMHq5OwbciUs",
  model: "gemini-1.5-flash",
});


// Utility: clean Gemini output (remove markdown fences)
function cleanJsonOutput(output) {
    if (!output) return "";
    return output.replace(/```json|```/g, "").trim();
  }
  
  // Utility: fuzzy match task by title (case-insensitive)
  async function findTaskByTitle(title) {
    if (!title) return null;
    return await Task.findOne({ title: new RegExp(title, "i") });
  }
  
  export const handleUserMessage = async (message) => {
    try {
      const response = await model.invoke([
        {
          role: "system",
          content: `You are a task management agent. 
  Always respond ONLY in valid JSON. 
  Format:
  {
    "action": "create" | "update" | "delete" | "list" | "none",
    "task": {
      "id": "<if update/delete, else empty>",
      "title": "<string>",
      "description": "<string>",
      "status": "<pending|done>",
      "due_date": "<YYYY-MM-DD or empty>",
      "priority": "<low|medium|high>"
    }
  }
  
  Rules:
  - Do NOT invent numeric IDs. Use title if ID not known.
  - For "create", ignore "id" (Mongo generates _id).
  - For "list", you may include filters (priority, status, due_date).
  - Output only JSON, no extra text.`,
        },
        { role: "user", content: message },
      ]);
  
      let   parsed;
      try {
        const clean = cleanJsonOutput(response.content);
        parsed = JSON.parse(clean);
      } catch (err) {
        console.error("❌ JSON parse failed:", response.content);
        return { reply: "⚠️ I couldn’t parse that request.", tasks: [] };
      }
  
      let reply = "";
      let tasks = [];
  
      if (parsed.action === "create") {
        // ✅ ignore id, Mongo generates _id
        const { id, ...taskData } = parsed.task || {};
        const task = await Task.create(taskData);
        reply = `✅ Task created: ${task.title}`;
      } 
      
      else if (parsed.action === "update") {
        let task = null;
        if (parsed.task?.id && /^[0-9a-fA-F]{24}$/.test(parsed.task.id)) {
          task = await Task.findByIdAndUpdate(parsed.task.id, parsed.task, { new: true });
        } else if (parsed.task?.title) {
          task = await Task.findOneAndUpdate(
            { title: new RegExp(parsed.task.title, "i") },
            parsed.task,
            { new: true }
          );
        }
        reply = task ? `✏️ Task updated: ${task.title}` : "⚠️ Task not found.";
      } 
      
      else if (parsed.action === "delete") {
        console.log("🗑️ Delete action triggered. Parsed task:", parsed.task);
      
        let result = null;
      
        if (parsed.task?.id) {
            console.log("➡️ Trying delete by title (fuzzy match):", parsed.task.title);
            result = await Task.findOneAndDelete({
              title: { $regex: parsed.task.id, $options: "i" }
            });
            console.log("🔍 Delete by title result:", result);
        }
      
            
        if (!result) {
          console.log("❌ Task not found with provided info:", parsed.task);
        }
      
        reply = result
          ? `🗑️ Task deleted: ${result.title}`
          : "⚠️ Task not found.";
      }
      
      
      
      else if (parsed.action === "list") {
        let query = {};
        if (parsed.task?.priority) query.priority = parsed.task.priority;
        if (parsed.task?.status) query.status = parsed.task.status;
        if (parsed.task?.due_date) query.due_date = new Date(parsed.task.due_date);
      
        tasks = await Task.find(query).sort({ createdAt: -1 });
        reply = tasks.length
          ? `📋 Found ${tasks.length} task(s).`
          : "⚠️ No tasks found.";
        return { reply, tasks };
      }
      
      
      else {
        reply = "🤔 Not sure what to do.";
      }
  
      // Always return updated task list
      tasks = await Task.find().sort({ createdAt: -1 });
      return { reply, tasks };
  
    } catch (err) {
      console.error("Gemini error:", err);
      return { reply: "⚠️ AI agent failed.", tasks: [] };
    }
  };