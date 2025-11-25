import { CircleIcon, Cloud, Phone, Smartphone } from "lucide-react";
import { Label } from "./ui/label";
import { RadioGroup } from "./ui/radio-group";
import { Indicator, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupForm({ onComplete }: { onComplete?: () => void }) {
  const [choice, setChoice] = useState<string>("sync");

  const router = useRouter();

  return (
    <div>
      <div className="text-center p-10">
        <h2 className="text-3xl">Choose How Your Grades Are Saved</h2>
        <p className="text-muted-foreground">
          Choose whether to back up your grades across all your devices or keep
          everything safely on this one.
        </p>
      </div>
      <RadioGroup
        defaultValue="sync"
        onValueChange={(value) => setChoice(value)}
        className="border divide-y rounded-lg gap-0"
      >
        <RadioGroupItem
          value="sync"
          className="flex items-center space-x-5 p-4 text-left"
        >
          <div className="border p-3 bg-card rounded-lg">
            <Cloud className="mx-auto size-6 text-muted-foreground" />
          </div>
          <div>
            <Label htmlFor="option-two" className="mb-1">
              Sync across devices{" "}
              <span className="rounded-sm bg-primary/10 text-primary px-2 py-0.5 text-xs border border-primary">
                Recommended
              </span>
            </Label>
            <p className="text-muted-foreground text-sm">
              Your grades are saved to your account and synced across devices.
            </p>
          </div>
          <data className="border-input text-primary flex items-center justify-center aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50">
            <Indicator className="flex items-center justify-center">
              <CircleIcon className="fill-primary size-2" />
            </Indicator>
          </data>
        </RadioGroupItem>
        <RadioGroupItem
          value="local"
          className="flex items-center space-x-5 p-4 text-left"
        >
          <div className="border p-3 bg-card rounded-lg">
            <Smartphone className="mx-auto size-6 text-muted-foreground" />
          </div>
          <div>
            <Label htmlFor="option-two" className="mb-1">
              On this device only
            </Label>
            <p className="text-muted-foreground text-sm">
              All your data is stored locally on this device and will not be
              synced. No login required.
            </p>
          </div>
          <data className="border-input text-primary flex items-center justify-center aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50">
            <Indicator className="flex items-center justify-center">
              <CircleIcon className="fill-primary size-2" />
            </Indicator>
          </data>
        </RadioGroupItem>
      </RadioGroup>
      <Button
        className="mt-6 w-full"
        onClick={() => {
          if (choice === "sync") {
            router.push("/login");
          }

          if (choice === "local") {
            router.push("/app");
          }

          localStorage.setItem("settings/storage", choice);
          onComplete?.();
        }}
      >
        Continue
      </Button>
    </div>
  );
}
