import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import sql, { safeArray } from "@/lib/db";
import { cache } from "react";

// Add this line to make the route dynamic
export const dynamic = "force-dynamic";

// Use cache to prevent multiple calls to the same function
export const getSession = cache(async () => {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
});

export async function getCurrentUser() {
  try {
    // Probeer eerst de gebruiker via NextAuth te krijgen
    const session = await getSession();

    if (session?.user) {
      // Gebruik de email om de gebruiker te vinden
      const email = session.user.email;
      console.log("User email from session:", email);

      if (email) {
        // Zoek de gebruiker op basis van email
        const usersResult = await sql`
          SELECT id FROM users WHERE email = ${email}
        `;
        // Use type assertion to tell TypeScript that safeArray always returns an array
        const users = safeArray(usersResult) as any[];

        if (users.length > 0) {
          console.log("User found by email:", users[0].id);
          return {
            id: users[0].id,
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
          };
        } else {
          console.log("No user found with email:", email);
        }
      }
    }

    // Als fallback, probeer de auth cookie te gebruiken
    const authCookie = (await cookies()).get("auth")?.value;

    if (authCookie) {
      console.log("User found via auth cookie:", authCookie);
      return { id: authCookie };
    }

    console.log("No authenticated user found");
    return null;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}
