"use server";

import sql from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function seedDatabase() {
  try {
    // Create test user
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash("password123", 10);

    await sql`
      INSERT INTO users (id, name, email, password) 
      VALUES (${userId}, 'Test User', 'test@example.com', ${hashedPassword}) 
      ON CONFLICT (email) DO NOTHING
    `;

    // Create subscription
    await sql`
      INSERT INTO subscriptions (user_id, plan, status) 
      VALUES (${userId}, 'pro', 'active') 
      ON CONFLICT (user_id) 
      DO UPDATE SET plan = 'pro', status = 'active'
    `;

    // Create social accounts
    const linkedinId = uuidv4();
    const twitterId = uuidv4();

    await sql`
      INSERT INTO social_accounts 
      (id, user_id, platform, account_id, account_name, access_token) 
      VALUES (${linkedinId}, ${userId}, 'linkedin', 'linkedin123', 'Test User', 'mock_token') 
      ON CONFLICT (user_id, platform, account_id) 
      DO UPDATE SET account_name = 'Test User', access_token = 'mock_token'
    `;

    await sql`
      INSERT INTO social_accounts 
      (id, user_id, platform, account_id, account_name, access_token) 
      VALUES (${twitterId}, ${userId}, 'twitter', 'twitter123', '@testuser', 'mock_token') 
      ON CONFLICT (user_id, platform, account_id) 
      DO UPDATE SET account_name = '@testuser', access_token = 'mock_token'
    `;

    // Create content
    const contentId1 = uuidv4();
    const contentId2 = uuidv4();

    await sql`
      INSERT INTO content 
      (id, user_id, title, content, platform, content_type) 
      VALUES (
        ${contentId1},
        ${userId},
        'Nieuwe productlancering',
        'Wij zijn verheugd om ons nieuwste product aan te kondigen! #innovatie #nieuw',
        'linkedin',
        'post'
      )
    `;

    await sql`
      INSERT INTO content 
      (id, user_id, title, content, platform, content_type) 
      VALUES (
        ${contentId2},
        ${userId},
        'Zomercampagne',
        'Onze zomercampagne gaat van start! Bekijk onze speciale aanbiedingen. #zomer #aanbieding',
        'twitter',
        'tweet'
      )
    `;

    // Create scheduled posts
    const scheduledPostId1 = uuidv4();
    const scheduledPostId2 = uuidv4();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    await sql`
      INSERT INTO scheduled_posts 
      (id, user_id, content_id, scheduled_for, status) 
      VALUES (${scheduledPostId1}, ${userId}, ${contentId1}, ${tomorrow.toISOString()}, 'scheduled')
    `;

    await sql`
      INSERT INTO scheduled_posts 
      (id, user_id, content_id, scheduled_for, status) 
      VALUES (${scheduledPostId2}, ${userId}, ${contentId2}, ${nextWeek.toISOString()}, 'scheduled')
    `;

    return { success: true, message: "Database seeded successfully" };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, error: "Failed to seed database" };
  }
}
