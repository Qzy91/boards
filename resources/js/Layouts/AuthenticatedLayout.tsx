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

interface PageProps<T = {}> {
    auth: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    [key: string]: any;
}

export default function Authenticated({
    header,
    children,
}: React.PropsWithChildren<{ header?: React.ReactNode }>) {
    const { auth } = usePage<PageProps<{ auth: { user?: User } }>>().props;

    return (
        <div className="min-h-screen mb-4 bg-gray-100">
            {/* Навигационная панель */}
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Логотип или название */}
                        <div className="flex items-center">
                            <h1 className="text-lg font-semibold text-gray-800">
                                <Link href={route("home")}>Boards</Link>
                            </h1>
                        </div>

                        <div className="hidden sm:flex sm:items-center">
                            {auth.user ? (
                                <>
                                    <Button
                                        asChild
                                        variant="default"
                                        className="mx-3"
                                    >
                                        <Link href={route("listings.create")}>
                                            Create Ad
                                        </Link>
                                    </Button>
                                    <Menubar>
                                        <MenubarMenu>
                                            <MenubarTrigger>
                                                {auth.user.name}
                                            </MenubarTrigger>
                                            <MenubarContent>
                                                <MenubarItem>
                                                    <Link
                                                        href={route(
                                                            "profile.edit"
                                                        )}
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
                                                        href={route(
                                                            "listings.my"
                                                        )}
                                                    >
                                                        My Ads
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
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
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
