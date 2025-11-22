"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";

export async function generatePodcast(params?: {
  limit?: number;
  similarity_threshold?: number;
  voice_id?: string;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await db
    .selectFrom("users")
    .where("email", "=", session.user.email)
    .select("id")
    .executeTakeFirst();

  if (!user) {
    throw new Error("User not found");
  }

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("BACKEND_URL not configured");
  }

  const requestBody = {
    user_id: user.id,
    limit: params?.limit || 10,
    similarity_threshold: params?.similarity_threshold || 0.9,
    voice_id: params?.voice_id || "21m00Tcm4TlvDq8ikWAM"
  };

  try {
    const response = await fetch(`${backendUrl}/podcast/generate/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate podcast: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error generating podcast:", error);
    throw error;
  }
}
