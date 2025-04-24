import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { name, email, password, plan = "starter" } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Naam, email en wachtwoord zijn verplicht" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [email])

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: "Email is al in gebruik" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate UUID
    const userId = uuidv4()

    // Create user
    await query("INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)", [
      userId,
      name,
      email,
      hashedPassword,
    ])

    // Create subscription
    await query("INSERT INTO subscriptions (user_id, plan, status) VALUES ($1, $2, $3)", [userId, plan, "active"])

    return NextResponse.json({ success: true, userId }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Er is een fout opgetreden bij het registreren" }, { status: 500 })
  }
}
