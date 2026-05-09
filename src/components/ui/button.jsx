import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-crimson-accent-DEFAULT text-white hover:bg-crimson-accent-dark shadow-crimson-sm hover:shadow-lg active:scale-95 transition-all",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-apple active:scale-95",
        outline:
          "border border-border bg-background text-foreground hover:border-crimson-accent-DEFAULT hover:bg-crimson-accent-light/5 transition-premium",
        secondary:
          "bg-secondary text-foreground hover:bg-secondary/80 transition-premium",
        ghost: "hover:bg-secondary/50 text-foreground transition-premium hover:text-crimson-accent-DEFAULT",
        link: "text-crimson-accent-DEFAULT underline-offset-4 hover:underline hover:text-crimson-accent-dark",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs font-medium",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }