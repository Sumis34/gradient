import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-5">
      <header className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-5xl sm:text-6xl font-serif capitalize text-center">
          Grades made brutally and clear.
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-lg text-center w-full">
          See what{"'"}s killing your average, where to fight back, and what you
          can safely ignore.
        </p>
        <div className="w-full flex justify-center mt-4">
          <Link
            href="/app"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "mt-4 w-full sm:w-fit !text-lg",
            })}
          >
            Use App in the Browser
          </Link>
        </div>
      </header>
    </div>
  );
}
