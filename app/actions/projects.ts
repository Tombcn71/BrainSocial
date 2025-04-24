"use server";

import sql from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      console.error("User not authenticated or missing ID");
      return { success: false, error: "Not authenticated", projects: [] };
    }

    console.log("Fetching projects for user ID:", user.id);

    // Controleer of de gebruikers-ID een geldige UUID is
    let userId = user.id;
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        userId
      )
    ) {
      console.warn("User ID is not a valid UUID format:", userId);

      // Als het geen geldige UUID is, probeer de gebruiker te vinden op basis van email
      if (user.email) {
        const userResult = await sql`
          SELECT id FROM users WHERE email = ${user.email}
        `;

        // Fix for TypeScript error: Property 'length' does not exist on type 'FullQueryResults<boolean>'
        // Use type assertion to tell TypeScript this has a length property
        const userArray = userResult as any[];
        if (userArray.length > 0) {
          userId = userArray[0].id;
          console.log("Found user ID by email:", userId);
        } else {
          console.error("Could not find user by email:", user.email);
          return { success: false, error: "User not found", projects: [] };
        }
      } else {
        console.error("No email available to find user");
        return {
          success: false,
          error: "Invalid user ID and no email available",
          projects: [],
        };
      }
    }

    const projectsResult = await sql`
      SELECT * FROM projects 
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
    `;

    // Fix for TypeScript error: Property 'length' does not exist on type 'FullQueryResults<boolean>'
    // Use type assertion to tell TypeScript this has a length property
    const projects = projectsResult as any[];
    console.log(`Found ${projects.length} projects for user ID:`, userId);

    return { success: true, projects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      error:
        "Failed to fetch projects: " +
        (error instanceof Error ? error.message : String(error)),
      projects: [],
    };
  }
}

export async function getProject(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const projects = await sql`
      SELECT * FROM projects 
      WHERE id = ${id} AND user_id = ${user.id}
    `;

    if ((projects as any[]).length === 0) {
      return { success: false, error: "Project not found" };
    }

    return { success: true, project: (projects as any[])[0] };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { success: false, error: "Failed to fetch project" };
  }
}

export async function createProject(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const clientName = formData.get("clientName") as string;

  if (!name) {
    return { success: false, error: "Project name is required" };
  }

  try {
    const id = uuidv4();

    await sql`
      INSERT INTO projects (id, user_id, name, description, client_name)
      VALUES (${id}, ${user.id}, ${name}, ${description}, ${clientName})
    `;

    revalidatePath("/dashboard/projects");

    return { success: true, projectId: id };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const clientName = formData.get("clientName") as string;
  const status = formData.get("status") as string;

  if (!name) {
    return { success: false, error: "Project name is required" };
  }

  try {
    await sql`
      UPDATE projects
      SET name = ${name}, description = ${description}, client_name = ${clientName}, status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND user_id = ${user.id}
    `;

    revalidatePath(`/dashboard/projects/${id}`);
    revalidatePath("/dashboard/projects");

    return { success: true };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await sql`
      DELETE FROM projects
      WHERE id = ${id} AND user_id = ${user.id}
    `;

    revalidatePath("/dashboard/projects");

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
