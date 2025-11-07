import { cn } from "@/lib/utils";
import { Cloud, CloudCheck, CloudOff } from "lucide-react";

export default function SyncState({
  state,
}: {
  state: "no-sync" | "synced" | "error";
}) {
  return (
    <div
      className={cn(
        state === "no-sync" && "",
        "px-3 py-2 rounded-md text-sm flex items-center gap-1 relative overflow-hidden border bg-muted text-muted-foreground"
      )}
    >
      <div>
        {state === "no-sync" && <CloudOff className="mr-2 size-4" />}
        {state === "synced" && (
          <CloudCheck className="mr-2 size-4 stroke-green-300" />
        )}
        {state === "error" && <p>Sync error occurred</p>}
      </div>
      <p>
        {state === "no-sync" && "No Sync Enabled"}
        {state === "synced" && "All changes saved to cloud"}
        {state === "error" && "There was an error syncing data"}
      </p>
      {state === "synced" && (
        <div className="absolute -bottom-2 left-0 w-6 h-6 bg-green-300 rounded-full blur-xl"></div>
      )}
    </div>
  );
}
