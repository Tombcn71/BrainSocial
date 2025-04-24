"use server";

import sql from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { fixLength } from "@/lib/db-utils";

export async function findOrCreateUserByOAuthId(
  oauthId: string,
  email: string,
  name?: string,
  image?: string
) {
  try {
    // Zoek eerst op OAuth ID
    const usersByOAuthIdResult = await sql`
      SELECT id FROM users WHERE oauth_id = ${oauthId}
    `;

    // Use fixLength to get an array that definitely has a length property
    const usersByOAuthId = fixLength(usersByOAuthIdResult);
    if (usersByOAuthId.length > 0) {
      return { success: true, userId: usersByOAuthId[0].id };
    }

    // Zoek op email
    const usersByEmailResult = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    // Use fixLength to get an array that definitely has a length property
    const usersByEmail = fixLength(usersByEmailResult);
    if (usersByEmail.length > 0) {
      // Update de bestaande gebruiker met de OAuth ID
      await sql`
        UPDATE users 
        SET oauth_id = ${oauthId}, 
            name = COALESCE(${name}, name),
            image = COALESCE(${image}, image)
        WHERE id = ${usersByEmail[0].id}
      `;
      return { success: true, userId: usersByEmail[0].id };
    }

    // Maak een nieuwe gebruiker aan
    const userId = uuidv4();
    await sql`
      INSERT INTO users (id, name, email, image, oauth_id) 
      VALUES (${userId}, ${name || email.split("@")[0]}, ${email}, ${
      image || null
    }, ${oauthId})
    `;

    // Maak een abonnement aan
    await sql`
      INSERT INTO subscriptions (user_id, plan, status) 
      VALUES (${userId}, 'starter', 'active')
    `;

    return { success: true, userId };
  } catch (error) {
    console.error("Error finding or creating user:", error);
    return { success: false, error: "Failed to find or create user" };
  }
}
