import React, { useState } from "react";
import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
} from "@/Components/ui/menubar";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";

export default function Authenticated({
    header,
    children,
}: React.PropsWithChildren<{ header?: React.ReactNode }>) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen mb-4 bg-gray-100">
            {/* Навигационная панель */}
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Логотип или название */}
                        <div className="flex items-center">
                            <h1 className="text-lg font-semibold text-gray-800">
                                <Link href={route("listings.index")}>
                                    Boards
                                </Link>
                            </h1>
                        </div>

                        <div className="hidden sm:flex sm:items-center">
                            <Button asChild variant="default">
                                <Link href={route("listings.create")}>
                                    Create Ad
                                </Link>
                            </Button>
                            <div className="relative ms-3">
                                <Menubar>
                                    <MenubarMenu>
                                        <MenubarTrigger>
                                            {user.name}
                                        </MenubarTrigger>
                                        <MenubarContent>
                                            <MenubarItem>
                                                <Link
                                                    href={route("profile.edit")}
                                                >
                                                    Profile
                                                </Link>
                                            </MenubarItem>
                                            <MenubarItem>
                                                <Link
                                                    href={route(
                                                        "categories.index"
                                                    )}
                                                >
                                                    Categories
                                                </Link>
                                            </MenubarItem>
                                            <MenubarItem>
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                >
                                                    Log Out
                                                </Link>
                                            </MenubarItem>
                                        </MenubarContent>
                                    </MenubarMenu>
                                </Menubar>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Заголовок страницы */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Основной контент */}
            <main>{children}</main>
        </div>
    );
}
