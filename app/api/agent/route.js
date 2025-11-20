import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { supabase } from "@/lib/supabase"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function POST(req) {
  try {
    const { message } = await req.json()

    const { data: tasks } = await supabase.from("tasks").select("*").limit(5)

    const prompt = `
You are a helpful agent.
User asked: "${message}"
These are some items in the tasks table:
${JSON.stringify(tasks)}
    `

    const result = await model.generateContent(prompt)
    const reply = result.response.text()

    await supabase.from("logs").insert({
      user_message: message,
      agent_reply: reply
    })

    return NextResponse.json({ reply })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
