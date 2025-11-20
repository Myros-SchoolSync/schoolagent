"use client"
import { useState } from "react"

export default function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])

  async function sendMessage() {
    if (!input.trim()) return

    const userMsg = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    })

    const data = await res.json()
    const agentMsg = { role: "assistant", content: data.reply }

    setMessages(prev => [...prev, agentMsg])
    setInput("")
  }

  return (
    <main style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, padding: 8 }}
          placeholder="Ask something"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  )
}
