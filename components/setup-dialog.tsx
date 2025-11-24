import { CircleIcon, Cloud, Phone, Smartphone } from "lucide-react";
import { Label } from "./ui/label";
import { RadioGroup } from "./ui/radio-group";
import {
  Indicator,
  RadioGroupIndicator,
  RadioGroupItem,
} from "@radix-ui/react-radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "./ui/field";
import { Button } from "./ui/button";

export default function SetupForm() {
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
        defaultValue="option-one"
        className="border divide-y rounded-lg gap-0"
      >
        <RadioGroupItem
          value="option-one"
          className="flex items-center space-x-5 p-4 text-left"
        >
          <div className="border p-3 bg-card rounded-lg">
            <Cloud className="mx-auto size-6 text-muted-foreground" />
          </div>
          <div>
            <Label htmlFor="option-two" className="mb-1">
              Sync across devices
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
          value="option-two"
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
              synced.
            </p>
          </div>
          <data className="border-input text-primary flex items-center justify-center aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50">
            <Indicator className="flex items-center justify-center">
              <CircleIcon className="fill-primary size-2" />
            </Indicator>
          </data>
        </RadioGroupItem>
      </RadioGroup>
      <Button className="mt-6 w-full">Continue</Button>
    </div>
  );
}
