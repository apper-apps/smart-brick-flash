import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  hover = false,
  className, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "card",
        hover && "card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;