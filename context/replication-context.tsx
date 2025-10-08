"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { type RxSupabaseReplicationState } from "rxdb/plugins/replication-supabase";
import { usePersistence } from "./persistence-context";
import { assignUserId } from "../lib/local-database/utils";
import { startReplication } from "@/lib/local-database/replication";

type ReplicationState = "disabled" | "idle" | "syncing" | "in_sync" | "error";

const ReplicationContext = createContext<RxSupabaseReplicationState<any>[]>([]);

let replicationPromise: Promise<RxSupabaseReplicationState<any>[]> | null =
  null;

function getReplicationPromise(
  db: any,
  userId: string
): Promise<RxSupabaseReplicationState<any>[]> {
  if (replicationPromise) return replicationPromise;

  replicationPromise = (async () => {
    console.log("[Replication] Starting replication...");
    const { replications } = startReplication(db);

    await assignUserId(db, userId);

    for (const [index, replication] of replications.entries()) {
      console.log(
        `Waiting for initial replication... [${index + 1} of ${
          replications.length
        }]`
      );
      await replication.awaitInSync();
    }

    console.log("[Replication] All replications initialized.");
    return replications;
  })();

  return replicationPromise;
}

export function ReplicationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const db = usePersistence();
  const [replications, setReplications] = useState<
    RxSupabaseReplicationState<any>[]
  >([]);

  useEffect(() => {
    if (!user || !db) {
      if (replications.length > 0) {
        for (const r of replications) {
          r.cancel();
        }
      }
      return;
    }

    (async () => {
      const reps = await getReplicationPromise(db, user.id);

      setReplications(reps);
    })();
  }, [user, db]);

  return (
    <ReplicationContext.Provider value={replications}>
      {children}
    </ReplicationContext.Provider>
  );
}

export const useReplication = () => {
  const ctx = useContext(ReplicationContext);
  if (!ctx)
    throw new Error("useReplication must be used inside ReplicationProvider");
  return ctx;
};