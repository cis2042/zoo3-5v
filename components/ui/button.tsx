import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-lion-orange text-white hover:bg-lion-orange-dark shadow-md hover:shadow-lg transition-all duration-200",
        destructive: "bg-lion-red text-white hover:bg-lion-red-dark shadow-md",
        outline: "border-2 border-lion-orange bg-transparent text-lion-orange hover:bg-lion-orange/10",
        secondary: "bg-lion-teal text-white hover:bg-lion-teal-dark shadow-md",
        ghost: "hover:bg-lion-face hover:text-lion-accent",
        link: "text-lion-orange underline-offset-4 hover:underline",
        teal: "bg-lion-teal text-white hover:bg-lion-teal-dark shadow-md hover:shadow-lg transition-all duration-200",
        orange:
          "bg-gradient-to-r from-lion-orange to-lion-red text-white hover:from-lion-orange-dark hover:to-lion-red-dark shadow-md hover:shadow-lg transition-all duration-200",
        face: "bg-lion-face text-lion-accent hover:bg-lion-face-dark shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
