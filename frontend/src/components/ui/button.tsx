import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Definição das variantes de botão
const buttonVariants = cva(
  // Classes base comuns a todos os botões
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Estilos para diferentes variantes de botão
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-sky-500 dark:text-slate-50 text-primary-foreground shadow-sm hover:bg-sky-500/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        delete: "bg-red-500 dark:text-slate-50 text-primary-foreground shadow hover:bg-red-500/90",
        upload: "bg-green-600 dark:text-slate-50 text-primary-foreground shadow hover:bg-green-600/90",
      },
      size: {
        // Estilos para diferentes tamanhos de botão
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Interface das propriedades do componente Button
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  disableButton?: boolean;
}

// Componente funcional Button
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, disableButton, ...props },
    ref
  ) => {
    // Decide qual componente renderizar com base em asChild
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        disabled={disableButton}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button"; // Define o nome do componente para exibição em ferramentas de desenvolvedor
export { Button, buttonVariants }; // Exporta o componente Button e as variantes de botão
