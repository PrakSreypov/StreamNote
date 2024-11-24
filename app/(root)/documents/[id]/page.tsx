import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/sign-in");

  const emailAddress = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!emailAddress) redirect("/");

  const room = await getDocument({
    roomId: id,
    userId: emailAddress,
  });

  if (!room) redirect("/");
  // if (!room || !room.usersAccesses || typeof room.usersAccesses !== "object") {
  //   console.log("Invalid room data or missing usersAccesses:", room);
  //   redirect("/");
  //   return null;
  // }


  const userIds = room?.usersAccesses ? Object.keys(room.usersAccesses) : [];
  console.log("💆‍♂️userIds", userIds);

  const users = await getClerkUsers({ userIds });
  console.log("💆‍♂️users", users);

  // const usersData = users.map((user: User) => ({
  //   ...user,
  //   userType: room.usersAccesses[user.email]?.includes('room:write')
  //     ? 'editor'
  //     : 'viewer'
  // }))

  const usersData = Array.isArray(users)
    ? users.map((user: User) => ({
        ...user,
        userType: room.usersAccesses[user.email]?.includes("room:write")
          ? "editor"
          : "viewer",
      }))
    : [];

  // const currentUserType = room.usersAccesses[
  //   clerkUser.emailAddresses[0].emailAddress
  // ]?.includes("room:write")
  //   ? "editor"
  //   : "viewer";

  const currentUserType = room.usersAccesses[emailAddress]?.includes(
    "room:write"
  )
    ? "editor"
    : "viewer";

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
