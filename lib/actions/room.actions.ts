"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";
import { CreateDocumentParams, RoomAccesses } from "@/types";

interface CreateDocumentParams {
  userId: string;
  email: string;
}

type RoomAccesses = {
  [email: string]: string[];
};

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    console.log("🔴user access from action", usersAccesses);

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.error(
      `Error happened while creating a room: ${
        error instanceof Error ? error.message : error
      }`
    );
    throw new Error("Failed to create room");
  }
};

// export const getDocument = async ({
//     roomId,
//     userId,
// }: {
//     roomId: string;
//     userId: string;
// }) => {
//     try {
//         const room = await liveblocks.getRoom(roomId);

//         //TODO: Brind this back

//         // const hasAccess = Object.keys(room.usersAccesses).includes(userId);

//         // if (!hasAccess) {
//         //     throw new Error("You don't have access to this room");
//         // }

//         return parseStringify(room);
//     } catch (error) {
//         console.log(`Error happened while getting a room: ${error}`);
//     }
// };

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    console.log("🧮roommmm ffrooom sserwere", room);

    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error("You do not have access to this document");
    }

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while getting a room: ${error}`);
  }
};
export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happend while updating a room: ${error}`);
  }
};

export const getDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });

    console.log("📍room from server", rooms);

    return parseStringify(rooms);
  } catch (error) {
    console.log(`Error happened while getting rooms: ${error}`);
  }
};
