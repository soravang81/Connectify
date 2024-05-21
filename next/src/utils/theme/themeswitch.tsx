"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/src/utils/utils";

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, checkedIcon, uncheckedIcon, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer relative inline-flex h-10 w-20 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary",
      className
    )}
    {...props}
    ref={ref}
  >
    <div
      className={cn(
        "absolute left-1 flex items-center justify-center h-8 w-8 transition-transform",
        "z-0"
      )}
    >
      {uncheckedIcon}
    </div>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none relative block h-8 w-8 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-10 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-white data-[state=unchecked]:white"
      )}
    />
    <div
      className={cn(
        "absolute right-1 flex items-center justify-center h-8 w-8 transition-transform data-[state=checked]:bg-black data=[state=checked]:z-10"
      )}
    >
      <div >
        {checkedIcon}
      </div>
    </div>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
