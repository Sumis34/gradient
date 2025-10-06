"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useCollections } from "@/context/collection-context";
import { useLiveQuery, eq } from "@tanstack/react-db";
import { equal } from "assert";
import Link from "next/dist/client/link";
import { useParams } from "next/navigation";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();

  const { semesters: semestersCollection } = useCollections();

  const { data: semesters } = useLiveQuery((q) =>
    q
      .from({ semesters: semestersCollection })
      .where(({ semesters }) => eq(semesters.id, params.id))
  );

  const crumbs = [{ label: "Semesters", href: "/app/semester" }];

  if (semesters && semesters.at(0)) {
    crumbs.push({
      label: semesters.at(0)!.name,
      href: `/app/semester/${semesters.at(0)!.id}`,
    });
  }

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;

                return (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {isLast && <BreadcrumbPage>{crumb.label}</BreadcrumbPage>}
                      {!isLast && (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {children}
    </div>
  );
}
