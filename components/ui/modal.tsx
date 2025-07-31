import * as React from "react";

import { cn } from "@/lib/utils";

const Modal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col rounded-sm border bg-card text-card-foreground shadow h-30",
      className,
    )}
    {...props}
  />
));
Modal.displayName = "Modal";

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex justify-between w-full bg-blue-500 p-6 rounded-t-sm", className)}
        {...props}
    />
));
ModalHeader.displayName = "ModalHeader";

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    {...props}
  />
));
ModalBody.displayName = "ModalBody";

const ModalFooter = React.forwardRef<
  HTMLDivElement,

  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex justify-end w-full p-3 rounded-b-sm border-t", className)}
        {...props}
    />
));
ModalFooter.displayName = "ModalFooter";

export { 
    Modal, 
    ModalHeader,
    ModalBody, 
    ModalFooter
}