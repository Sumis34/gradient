import { cn } from "@/lib/utils";
import { CloudOff } from "lucide-react";

export default function SyncState({
  state,
}: {
  state: "no-sync" | "synced" | "error";
}) {
  return (
    <div
      className={cn(
        state === "no-sync" && "bg-muted text-muted-foreground",
        "px-3 py-2 rounded-md text-sm flex items-center gap-1 relative overflow-hidden border",
      )}
    >
      <div>
        {state === "no-sync" && <CloudOff className="mr-2 size-4" />}
        {state === "synced" && <p>Sync complete</p>}
        {state === "error" && <p>Sync error occurred</p>}
      </div>
      <p>
        {state === "no-sync" && "No Sync Enabled"}
        {state === "synced" && "All changes are synced"}
        {state === "error" && "There was an error syncing data"}
      </p>
    </div>
  );
}
