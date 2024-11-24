import { useContext } from "react";
import { LiveblocksContext } from "@liveblocks/react-lexical";

// Hook to get the current editor status
export const useEditorStatus = () => {
  const context = useContext(LiveblocksContext);

  if (!context) {
    console.error("LiveblocksContext is not initialized!");
    return undefined;
  }

  return context.getYjsProvider?.status || "not-loaded"; // Return status or default value
};
