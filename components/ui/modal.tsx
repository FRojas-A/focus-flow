import * as React from "react";

import { cn } from "@/lib/utils";

const Modal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col rounded-sm bg-card text-card-foreground shadow h-30",
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
        className={cn("flex justify-between w-full bg-blue-500 p-4 rounded-t-sm", className)}
        {...props}
    />
));
ModalHeader.displayName = "ModalHeader";

const ModalError = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("bg-red-400 border border-red-600 w-full h-16 border-4 flex items-center px-6", className)}
    {...props}
  />
));
ModalError.displayName = "ModalError";

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
        className={cn("flex w-full p-3 rounded-b-sm border-t", className)}
        {...props}
    />
));
ModalFooter.displayName = "ModalFooter";

export { 
    Modal, 
    ModalHeader,
    ModalBody, 
    ModalFooter,
    ModalError
}