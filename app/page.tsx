import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="px-5">
      <header className="min-h-screen w-screen relative overflow-x-hidden">
        <div className="invert inset-0 absolute overflow-hidden">
          <div className="dither-2xl w-screen h-screen relative z-10 mix-blend-difference">
            <Image
              src="/simone-pellegrini-L3QG_OBluT0-unsplash.jpg"
              fill
              objectFit="cover"
              alt="Gradient Logo"
            />
          </div>
        </div>
        <div className="relative">
          <h1 className="text-5xl sm:text-6xl font-serif capitalize text-center">
            Grades made brutally and clear.
          </h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-lg font-semibold text-center w-full">
            See what{"'"}s killing your average, where to fight back, and what
            you can safely ignore.
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
        </div>
      </header>
    </div>
  );
}
