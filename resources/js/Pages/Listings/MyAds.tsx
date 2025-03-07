import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import CategoryFilter from "@/Components/CategoryFilter";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Добавляем импорт Tabs из shadcn

// Интерфейсы могут быть здесь или в отдельных файлах
// interface AdsResponse {...}
// interface Filters {...}
// interface ICategory {...}

const MyAds = () => {
    // Здесь мы ожидаем, что на бэкенд передаются два набора объявлений:
    // 'activeAds' и 'inactiveAds' вместо 'ads'.
    // Это главный отличие в пропсах:
    const { activeAds, inactiveAds, filters, categories } = usePage<{
        activeAds: AdsResponse; // Активные объявления
        inactiveAds: AdsResponse; // Неактивные объявления
        filters: Filters;
        categories: ICategory[];
    }>().props;

    // Состояния фильтра/сортировки
    const [searchTerm, setSearchTerm] = useState(filters.filters?.name || "");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        filters.filters?.category_id || null
    );
    const [sortField, setSortField] = useState(
        filters.sort?.field || "created_at"
    );
    const [sortDirection, setSortDirection] = useState(
        filters.sort?.direction || "desc"
    );
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
        null
    );

    // Фильтр по названию
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeout) clearTimeout(searchTimeout);

        setSearchTimeout(
            setTimeout(() => {
                router.get(
                    route("listings.my"),
                    {
                        ...filters,
                        filters: { ...filters.filters, name: value },
                        page: 1,
                    },
                    { replace: true, preserveState: true }
                );
            }, 500)
        );
    };

    // Сортировка
    const handleSort = (field: string) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("listings.my"),
            { ...filters, sort: { field, direction } },
            { replace: true, preserveState: true }
        );
    };

    // Пагинация (пример для активных / неактивных)
    // Можно сделать отдельные handlePageChangeActive / handlePageChangeInactive
    // для разных вкладок, если нужно.
    const handlePageChangeActive = (page: number) => {
        if (page < 1 || page > activeAds.meta.last_page) return;
        router.get(
            route("listings.my"),
            { ...filters, page }, // меняем страницу
            { replace: true, preserveState: true }
        );
    };

    const handleDisactivate = (adId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Вы действительно хотите деактивировать объявление?")) {
            router.patch(route("listings.disactivate", adId));
        }
    };

    const handlePageChangeInactive = (page: number) => {
        if (page < 1 || page > inactiveAds.meta.last_page) return;
        router.get(
            route("listings.my"),
            { ...filters, page }, // меняем страницу
            { replace: true, preserveState: true }
        );
    };

    // Фильтр по категории
    const handleCategorySelect = (categoryId: number | null) => {
        setSelectedCategory(categoryId);
        router.get(
            route("listings.my"),
            {
                ...filters,
                filters: {
                    ...filters.filters,
                    category_id: categoryId || undefined,
                },
                page: 1,
            },
            { replace: true, preserveState: true }
        );
    };

    // Удаление
    const handleDelete = (adId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Вы хотите удалить объявление?")) {
            router.delete(route("listings.destroy", adId));
        }
    };

    // Редактирование
    const handleEdit = (adId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        router.get(route("listings.edit", adId));
    };

    return (
        <Authenticated
            header={<h1 className="text-xl font-bold">Мои объявления</h1>}
        >
            {/* Фильтр по категориям */}
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
            />

            {/* Фильтр по названию */}
            <div className="flex items-center my-8 mx-28">
                <Input
                    placeholder="Фильтр по названию..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="max-w-sm bg-white"
                />
            </div>

            {/*
         ВАЖНО: добавляем Tabs из shadcn.
         Две вкладки: "Активные" и "Неактивные"
      */}
            <div className="mx-28">
                <Tabs defaultValue="active">
                    {/* Список вкладок */}
                    <TabsList>
                        <TabsTrigger value="active">Активные</TabsTrigger>
                        <TabsTrigger value="inactive">Неактивные</TabsTrigger>
                    </TabsList>

                    {/* Вкладка 1: активные */}
                    <TabsContent value="active">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Фото</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort("name")}
                                    >
                                        Название{" "}
                                        {sortField === "name" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </TableHead>
                                    <TableHead>Категория</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort("price")}
                                    >
                                        Цена{" "}
                                        {sortField === "price" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </TableHead>
                                    <TableHead>Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeAds.data.map((ad) => (
                                    <TableRow
                                        key={ad.id}
                                        className="hover:bg-gray-200 cursor-pointer"
                                        onClick={() =>
                                            router.get(
                                                route("listings.show", ad.id)
                                            )
                                        }
                                    >
                                        <TableCell>
                                            {ad.photos.length > 0 ? (
                                                <img
                                                    src={`/storage/${ad.photos[0].path}`}
                                                    alt="Фото"
                                                    className="h-36 w-36 object-cover"
                                                />
                                            ) : (
                                                <p className="h-36 text-center w-36 object-cover">
                                                    Нет фото
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>{ad.name}</TableCell>
                                        <TableCell>{ad.category}</TableCell>
                                        <TableCell>
                                            {ad.price || "Нет данных"}
                                        </TableCell>
                                        <TableCell
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="outline"
                                                onClick={(e) =>
                                                    handleEdit(ad.id, e)
                                                }
                                                className="mr-2"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="text-red-500 hover:text-red-500"
                                                onClick={(e) =>
                                                    handleDisactivate(ad.id, e)
                                                }
                                            >
                                                Disactivate
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* Пагинация для активных объявлений */}
                        <div className="flex justify-center mt-4 px-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={() =>
                                                handlePageChangeActive(
                                                    activeAds.meta
                                                        .current_page - 1
                                                )
                                            }
                                        />
                                    </PaginationItem>
                                    {Array.from(
                                        { length: activeAds.meta.last_page },
                                        (_, index) => index + 1
                                    ).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                isActive={
                                                    page ===
                                                    activeAds.meta.current_page
                                                }
                                                onClick={() =>
                                                    handlePageChangeActive(page)
                                                }
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={() =>
                                                handlePageChangeActive(
                                                    activeAds.meta
                                                        .current_page + 1
                                                )
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </TabsContent>

                    {/* Вкладка 2: неактивные */}
                    <TabsContent value="inactive">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Фото</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort("name")}
                                    >
                                        Название{" "}
                                        {sortField === "name" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </TableHead>
                                    <TableHead>Категория</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort("price")}
                                    >
                                        Цена{" "}
                                        {sortField === "price" &&
                                            (sortDirection === "asc"
                                                ? "↑"
                                                : "↓")}
                                    </TableHead>
                                    <TableHead>Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inactiveAds.data.map((ad) => (
                                    <TableRow
                                        key={ad.id}
                                        className="hover:bg-gray-200 cursor-pointer"
                                        onClick={() =>
                                            router.get(
                                                route("listings.show", ad.id)
                                            )
                                        }
                                    >
                                        <TableCell>
                                            {ad.photos.length > 0 ? (
                                                <img
                                                    src={`/storage/${ad.photos[0].path}`}
                                                    alt="Фото"
                                                    className="h-36 w-36 object-cover"
                                                />
                                            ) : (
                                                <p className="h-36 text-center w-36 object-cover">
                                                    Нет фото
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell>{ad.name}</TableCell>
                                        <TableCell>{ad.category}</TableCell>
                                        <TableCell>
                                            {ad.price || "Нет данных"}
                                        </TableCell>
                                        <TableCell
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                className="mr-2 text-green-500 hover:text-green-500"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (
                                                        confirm(
                                                            "Активировать объявление?"
                                                        )
                                                    ) {
                                                        router.patch(
                                                            route(
                                                                "listings.activate",
                                                                ad.id
                                                            )
                                                        );
                                                    }
                                                }}
                                            >
                                                Activate
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={(e) =>
                                                    handleEdit(ad.id, e)
                                                }
                                                className="mr-2"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={(e) =>
                                                    handleDelete(ad.id, e)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* Пагинация для неактивных объявлений */}
                        <div className="flex justify-center mt-4 px-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={() =>
                                                handlePageChangeInactive(
                                                    inactiveAds.meta
                                                        .current_page - 1
                                                )
                                            }
                                        />
                                    </PaginationItem>
                                    {Array.from(
                                        { length: inactiveAds.meta.last_page },
                                        (_, index) => index + 1
                                    ).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                isActive={
                                                    page ===
                                                    inactiveAds.meta
                                                        .current_page
                                                }
                                                onClick={() =>
                                                    handlePageChangeInactive(
                                                        page
                                                    )
                                                }
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={() =>
                                                handlePageChangeInactive(
                                                    inactiveAds.meta
                                                        .current_page + 1
                                                )
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Authenticated>
    );
};

export default MyAds;
