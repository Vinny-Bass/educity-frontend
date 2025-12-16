import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-normal font-baloo transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#9056F5] text-white hover:bg-[#9056F5]/90 disabled:bg-[#C8B4F6]",
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50",
        ghost: "hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
        link: "text-primary underline-offset-4 hover:underline disabled:opacity-50",
        gray: "bg-[#474250] text-white hover:bg-[#474250]/90 disabled:bg-[#C8B4F6]",
        locked: "bg-[#DCDBDE] text-white hover:bg-[#DCDBDE]/90 cursor-not-allowed",
        underline: "text-[#474250] text-[22px] underline hover:text-[#474250]/90",
      },
      size: {
        default: "rounded-[10px] px-5 py-2 text-[16px]",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        wide: "h-[54px] rounded-[10px] px-8 md:px-[163px] py-[9px] text-[16px]",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	)
}

export { Button, buttonVariants };

