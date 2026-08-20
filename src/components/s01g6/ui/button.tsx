import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/s01g6/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border border-transparent bg-clip-padding text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-all outline-none select-none focus-visible:border-s01g6-ring focus-visible:ring-2 focus-visible:ring-s01g6-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-s01g6-destructive aria-invalid:ring-2 aria-invalid:ring-s01g6-destructive/20 dark:aria-invalid:border-s01g6-destructive/50 dark:aria-invalid:ring-s01g6-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-s01g6-primary text-s01g6-primary-foreground hover:bg-s01g6-primary/80",
        outline:
          "border-s01g6-border bg-transparent hover:bg-s01g6-muted hover:text-s01g6-foreground aria-expanded:bg-s01g6-muted aria-expanded:text-s01g6-foreground dark:hover:bg-s01g6-input/30",
        secondary:
          "bg-s01g6-secondary text-s01g6-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-s01g6-secondary aria-expanded:text-s01g6-secondary-foreground",
        ghost:
          "hover:bg-s01g6-muted hover:text-s01g6-foreground aria-expanded:bg-s01g6-muted aria-expanded:text-s01g6-foreground dark:hover:bg-s01g6-muted/50",
        destructive:
          "bg-s01g6-destructive/10 text-s01g6-destructive hover:bg-s01g6-destructive/20 focus-visible:border-s01g6-destructive/40 focus-visible:ring-s01g6-destructive/20 dark:bg-s01g6-destructive/20 dark:hover:bg-s01g6-destructive/30 dark:focus-visible:ring-s01g6-destructive/40",
        link: "text-s01g6-primary underline underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-6 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-11 gap-1.5 px-8 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
