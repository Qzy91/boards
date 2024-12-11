import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/Components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ButtonProps, "size"> &
    React.ComponentProps<"a">;

const PaginationLink = ({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) => (
    <a
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "outline" : "ghost",
                size,
            }),
            className
        )}
        {...props}
    />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn("gap-1 pl-2.5", className)}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
    </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("gap-1 pr-2.5", className)}
        {...props}
    >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<"span">) => (
    <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

import { Link } from "@inertiajs/react"; // Импорт Inertia Link

const PaginationPreviousC = ({
    className,
    disabled = false, // Добавляем поддержку `disabled`
    href = "#",
    ...props
}: React.ComponentProps<typeof Link> & { disabled?: boolean }) => (
    <Link
        aria-label="Go to previous page"
        aria-disabled={disabled} // ARIA-атрибут для доступности
        className={cn(
            "gap-1 px-2.5 flex items-center",
            disabled ? "pointer-events-none opacity-50" : "", // Если `disabled`, блокируем взаимодействие
            className
        )}
        href={disabled ? "#" : href} // Если `disabled`, убираем `href`
        {...(disabled ? {} : props)} // Убираем действия при `disabled`
    >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
    </Link>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNextC = ({
    className,
    disabled = false, // Добавляем поддержку `disabled`
    href = "#",
    ...props
}: React.ComponentProps<typeof Link> & { disabled?: boolean }) => (
    <Link
        aria-label="Go to next page"
        aria-disabled={disabled} // ARIA-атрибут для доступности
        className={cn(
            "gap-1 px-2.5 flex items-center",
            disabled ? "pointer-events-none opacity-50" : "", // Если `disabled`, блокируем взаимодействие
            className
        )}
        href={disabled ? "#" : href} // Если `disabled`, убираем `href`
        {...(disabled ? {} : props)} // Убираем действия при `disabled`
    >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
    </Link>
);
PaginationNext.displayName = "PaginationNext";

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationPreviousC,
    PaginationNextC,
    PaginationNext,
    PaginationEllipsis,
};
