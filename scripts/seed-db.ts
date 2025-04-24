import { query } from "@/lib/db"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

async function seedDatabase() {
  try {
    // Create test user
    const userId = uuidv4()
    const hashedPassword = await bcrypt.hash("password123", 10)

    await query(
      "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING",
      [userId, "Test User", "test@example.com", hashedPassword],
    )

    // Create subscription
    await query(
      "INSERT INTO subscriptions (user_id, plan, status) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO NOTHING",
      [userId, "pro", "active"],
    )

    // Create social accounts
    const linkedinId = uuidv4()
    const twitterId = uuidv4()

    await query(
      `INSERT INTO social_accounts 
       (id, user_id, platform, account_id, account_name, access_token) 
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (user_id, platform, account_id) DO NOTHING`,
      [linkedinId, userId, "linkedin", "linkedin123", "Test User", "mock_token"],
    )

    await query(
      `INSERT INTO social_accounts 
       (id, user_id, platform, account_id, account_name, access_token) 
       VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (user_id, platform, account_id) DO NOTHING`,
      [twitterId, userId, "twitter", "twitter123", "@testuser", "mock_token"],
    )

    // Create content
    const contentId1 = uuidv4()
    const contentId2 = uuidv4()

    await query(
      `INSERT INTO content 
       (id, user_id, title, content, platform, content_type) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        contentId1,
        userId,
        "Nieuwe productlancering",
        "Wij zijn verheugd om ons nieuwste product aan te kondigen! #innovatie #nieuw",
        "linkedin",
        "post",
      ],
    )

    await query(
      `INSERT INTO content 
       (id, user_id, title, content, platform, content_type) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        contentId2,
        userId,
        "Zomercampagne",
        "Onze zomercampagne gaat van start! Bekijk onze speciale aanbiedingen. #zomer #aanbieding",
        "twitter",
        "tweet",
      ],
    )

    // Create scheduled posts
    const scheduledPostId1 = uuidv4()
    const scheduledPostId2 = uuidv4()

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)

    await query(
      `INSERT INTO scheduled_posts 
       (id, user_id, content_id, scheduled_for, status) 
       VALUES ($1, $2, $3, $4, $5)`,
      [scheduledPostId1, userId, contentId1, tomorrow.toISOString(), "scheduled"],
    )

    await query(
      `INSERT INTO scheduled_posts 
       (id, user_id, content_id, scheduled_for, status) 
       VALUES ($1, $2, $3, $4, $5)`,
      [scheduledPostId2, userId, contentId2, nextWeek.toISOString(), "scheduled"],
    )

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

seedDatabase()
