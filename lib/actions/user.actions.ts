// "use server";

// import { clerkClient } from "@clerk/nextjs/server";
// import { parseStringify } from "../utils";

// export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
//   try {
//     const { data } = await clerkClient.users.getUserList({
//       EmailAddress: userIds,
//     });

//     const users = data.map((user) => ({
//       id: user.id,
//       name: `${user.firstName} ${user.lastName}`,
//       email: user.emailAddresses[0].EmailAddress,
//       avatar: user.avatarUrl,
//     }));

//     console.log('🤷‍♀️users from server: ', users)

//     const sortedUsers = userIds.map((email) =>
//       users.find((user) => user.email === email)
//     );

//     return parseStringify(sortedUsers);
//   } catch (error) {
//     console.log(`Error fetching users: ${error}`);
//   }
// };

"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    // Make sure to use the correct method for fetching users based on email
    const { users } = await clerkClient.users.getUserList({
      emailAddress: userIds, // Correct field name for email address
    });

    // Transform users to match the expected data structure
    const userData = users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      avatar: user.avatarUrl,
    }));

    console.log("🤷‍♀️users from server: ", userData);

    // Sort users to match the order of userIds
    const sortedUsers = userIds.map((email) =>
      userData.find((user) => user.email === email)
    );

    return parseStringify(sortedUsers);
  } catch (error) {
    console.log(`Error fetching users: ${error}`);
    return []; // Return an empty array in case of error
  }
};
