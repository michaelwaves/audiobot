"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { revalidatePath } from "next/cache";

export async function getUserSettings() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await db
    .selectFrom("users")
    .where("email", "=", session.user.email)
    .selectAll()
    .executeTakeFirst();

  if (!user) {
    throw new Error("User not found");
  }

  const settings = await db
    .selectFrom("settings")
    .where("user_id", "=", user.id)
    .selectAll()
    .executeTakeFirst();

  return settings || null;
}

export async function updateUserSettings(updates: {
  category_ids?: number[];
  language?: string;
  length?: number;
  delivery_method?: string;
  frequency?: string;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await db
    .selectFrom("users")
    .where("email", "=", session.user.email)
    .selectAll()
    .executeTakeFirst();

  if (!user) {
    throw new Error("User not found");
  }

  const existingSettings = await db
    .selectFrom("settings")
    .where("user_id", "=", user.id)
    .selectAll()
    .executeTakeFirst();

  const updateData: any = {
    ...updates,
    updated_at: new Date(),
  };

  if (existingSettings) {
    await db
      .updateTable("settings")
      .set(updateData)
      .where("user_id", "=", user.id)
      .execute();
  } else {
    await db
      .insertInto("settings")
      .values({
        user_id: user.id,
        ...updates,
      })
      .execute();
  }

  revalidatePath("/d");
  return { success: true };
}

export async function updateUserTopics(categoryIds: number[]) {
  return updateUserSettings({ category_ids: categoryIds });
}

export async function updateUserLanguage(language: string) {
  return updateUserSettings({ language });
}

export async function updateUserLength(length: number) {
  return updateUserSettings({ length });
}

export async function updateUserDelivery(deliveryMethod: string, frequency: string) {
  return updateUserSettings({
    delivery_method: deliveryMethod,
    frequency
  });
}

export async function getCategories() {
  const categories = await db
    .selectFrom("categories")
    .selectAll()
    .orderBy("name", "asc")
    .execute();

  return categories;
}

export async function getUserId() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const user = await db
    .selectFrom("users")
    .where("email", "=", session.user.email)
    .select("id")
    .executeTakeFirst();

  return user?.id || null;
}

export async function ensureUserSettings() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }

  const user = await db
    .selectFrom("users")
    .where("email", "=", session.user.email)
    .selectAll()
    .executeTakeFirst();

  if (!user) {
    return null;
  }

  const existingSettings = await db
    .selectFrom("settings")
    .where("user_id", "=", user.id)
    .selectAll()
    .executeTakeFirst();

  if (!existingSettings) {
    await db
      .insertInto("settings")
      .values({
        user_id: user.id,
        category_ids: [],
        language: "English",
        length: 10,
        delivery_method: "spotify",
        frequency: "daily",
      })
      .execute();

    return db
      .selectFrom("settings")
      .where("user_id", "=", user.id)
      .selectAll()
      .executeTakeFirst();
  }

  return existingSettings;
}
