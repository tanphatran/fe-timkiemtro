import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, value = [0, 100], onValueChange, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    value={value} // Giá trị dạng [min, max]
    onValueChange={onValueChange} // Hàm callback khi giá trị thay đổi
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    {/* Đường trượt (Track) */}
    <SliderPrimitive.Track
      className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/50 dark:bg-stone-50/20"
    >
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary to-secondary dark:bg-stone-50" />
    </SliderPrimitive.Track>
    {/* Nút kéo thứ nhất */}
    <SliderPrimitive.Thumb
      className="block h-4 w-4 rounded-full border border-stone-200 border-stone-900/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50 dark:border-stone-800 dark:border-stone-50/50 dark:bg-stone-950 dark:focus-visible:ring-stone-300"
    />
    {/* Nút kéo thứ hai */}
    <SliderPrimitive.Thumb
      className="block h-4 w-4 rounded-full border border-stone-200 border-stone-900/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50 dark:border-stone-800 dark:border-stone-50/50 dark:bg-stone-950 dark:focus-visible:ring-stone-300"
    />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
