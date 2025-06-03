import { cn } from "@web/lib/utils"
import * as React from "react"

interface ContainerProps extends React.ComponentProps<"div"> {
  size?: number | "xs" | "sm" | "md" | "lg" | "xl" | "fluid"
}

function Container({ className, size = "md", ...props }: ContainerProps) {
  let maxWidth = ""

  if (typeof size === "number") {
    maxWidth = `max-w-[${size}px]`
  } else {
    const sizeClasses = {
      xs: "max-w-md",     // 448px
      sm: "max-w-lg",     // 512px  
      md: "max-w-3xl",    // 768px
      lg: "max-w-4xl",    // 896px
      xl: "max-w-6xl",    // 1152px
      fluid: "max-w-none"
    }
    maxWidth = sizeClasses[size] || sizeClasses.md
  }

  return (
    <div
      className={cn("mx-auto px-4 sm:px-6 lg:px-8", maxWidth, className)}
      {...props}
    />
  )
}

export { Container }
