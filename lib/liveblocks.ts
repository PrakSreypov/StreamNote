import { Liveblocks } from "@liveblocks/node";

console.log("❌LIVEBLOCKS_SECRET_KEY:", process.env.LIVEBLOCKS_SECRET_KEY);

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});
