"use server";

import { db } from "@/db/drizzle";
import { quizRooms } from "@/db/schema";
import { nanoid } from "nanoid";

export async function createQuizRoom(userId: string) {
  const roomId = nanoid(6);
  await db.insert(quizRooms).values({ roomId, userId: userId });
  return roomId;
}