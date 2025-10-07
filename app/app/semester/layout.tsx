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
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {id, suid} = useParams();

  const { semesters: semestersCollection, subjects: subjectsCollection } = useCollections();

  const { data: semesters } = useLiveQuery(
    (q) =>
      q
        .from({ semesters: semestersCollection })
        .where(({ semesters }) => eq(semesters.id, id)),
    [id]
  );

  const { data: subjects } = useLiveQuery(
    (q) =>
      q
        .from({ subject: subjectsCollection })
        .where(({ subject }) => eq(subject.id, suid)),
    [suid]
  );

  const crumbs: {
    label: string;
    href: string;
    as?: string;
  }[] = [{ label: "Semesters", href: "/app/semester" }];

  if (semesters && semesters.at(0)) {
    crumbs.push({
      label: semesters.at(0)!.name,
      href: `/app/semester/${semesters.at(0)!.id}`,
    });
  }

  if (subjects && subjects.at(0)) {
    crumbs.push({
      label: subjects.at(0)!.name,
      href: `/app/semester/${id}/subject/${subjects.at(0)!.id}`,
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
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.label}</Link>
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
