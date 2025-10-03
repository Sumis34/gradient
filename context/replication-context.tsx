"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { type RxSupabaseReplicationState } from "rxdb/plugins/replication-supabase";
import { usePersistence } from "./persistence-context";
import { enableSync } from "../lib/local-database/utils";

const ReplicationContext = createContext<RxSupabaseReplicationState<any>[] | null>(null);

export function ReplicationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const db = usePersistence();
  const [replications, setReplications] = useState<RxSupabaseReplicationState<any>[]>([]);

  useEffect(() => {
    let active: RxSupabaseReplicationState<any>[] = [];

    (async () => {
      if (user) {
        const { replications } = await enableSync(db, user.id);
        active = replications;

        for (const [index, replication] of active.entries()) {
          console.log(`Waiting for initial replication... [${index + 1} of ${active.length}]`);
          await replication.awaitInitialReplication();
        }

        setReplications(active);
      }
    })();

    return () => {
      for (const r of active) {
        r.cancel();
      }
    };
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
