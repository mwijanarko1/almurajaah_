"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}>({});

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    type?: "single" | "multiple";
  }
>(({ className, children, defaultValue, value, onValueChange, type = "single", ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    defaultValue || (type === "multiple" ? [] : "")
  );

  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = React.useCallback(
    (newValue: string | string[]) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [value, onValueChange]
  );

  return (
    <AccordionContext.Provider
      value={{
        value: Array.isArray(currentValue) ? currentValue[0] : currentValue,
        onValueChange: handleValueChange,
        type,
        defaultValue,
      }}
    >
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    value: string;
  }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  const isOpen = context.value === value;

  const handleToggle = () => {
    if (context.onValueChange) {
      if (context.type === "multiple") {
        // For multiple type, toggle this item
        const currentValues = Array.isArray(context.value)
          ? context.value
          : (context.value ? [context.value] : []);
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        context.onValueChange(newValues);
      } else {
        // For single type, set this item or close if already open
        context.onValueChange(isOpen ? "" : value);
      }
    }
  };

  return (
    <div ref={ref} className={cn("border rounded-lg", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === AccordionHeader) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: handleToggle,
            isOpen,
          });
        }
        if (React.isValidElement(child) && child.type === AccordionPanel) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen,
          });
        }
        return child;
      })}
    </div>
  );
});
AccordionItem.displayName = "AccordionItem";

const AccordionHeader = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & {
    onClick?: () => void;
    isOpen?: boolean;
    chevronPosition?: "left" | "right";
  }
>(({ className, children, onClick, isOpen, chevronPosition = "right", ...props }, ref) => {
  const chevron = (
    <motion.div
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </motion.div>
  );

  return (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center px-4 py-3 text-left font-medium transition-all hover:bg-muted/50",
        chevronPosition === "left" ? "justify-between" : "justify-between",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {chevronPosition === "left" && chevron}
      {children}
      {chevronPosition === "right" && chevron}
    </button>
  );
});
AccordionHeader.displayName = "AccordionHeader";

const AccordionPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    isOpen?: boolean;
  }
>(({ className, children, isOpen, ...props }, ref) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("overflow-hidden", className)}
        >
          <div ref={ref} className="px-4 pb-3 pt-0" {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
AccordionPanel.displayName = "AccordionPanel";

const AccordionContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
});
AccordionContainer.displayName = "AccordionContainer";

const AccordionWrapper = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});
AccordionWrapper.displayName = "AccordionWrapper";

export {
  Accordion,
  AccordionContainer,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionWrapper,
};