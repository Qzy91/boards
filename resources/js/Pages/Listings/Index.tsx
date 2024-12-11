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

const Index = () => {
    const { ads, filters, categories } = usePage<{
        ads: AdsResponse;
        filters: Filters;
        categories: ICategory[];
    }>().props;

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeout) clearTimeout(searchTimeout);

        setSearchTimeout(
            setTimeout(() => {
                router.get(
                    route("listings.index"),
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

    const handleSort = (field: string) => {
        const direction =
            sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(direction);

        router.get(
            route("listings.index"),
            { ...filters, sort: { field, direction } },
            { replace: true, preserveState: true }
        );
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > ads.meta.last_page) return;
        router.get(
            route("listings.index"),
            { ...filters, page },
            { replace: true, preserveState: true }
        );
    };

    const handleCategorySelect = (categoryId: number | null) => {
        setSelectedCategory(categoryId);

        router.get(
            route("listings.index"),
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

    const handleRowClick = (adId: number) => {
        router.get(route("listings.show", adId)); // Переход на страницу объявления
    };

    return (
        <Authenticated
            header={<h1 className="text-xl font-bold">Объявления</h1>}
        >
            {/* Компонент фильтрации по категориям */}
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory} // Передаём выбранную категорию
                onCategorySelect={handleCategorySelect}
            />

            {/* Фильтр */}
            <div className="flex items-center my-8 mx-28">
                <Input
                    placeholder="Фильтр по названию..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="max-w-sm bg-white"
                />
            </div>

            {/* Таблица */}
            <div className="mx-28">
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
                                    (sortDirection === "asc" ? "↑" : "↓")}
                            </TableHead>
                            <TableHead>Категория</TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => handleSort("price")}
                            >
                                Цена{" "}
                                {sortField === "price" &&
                                    (sortDirection === "asc" ? "↑" : "↓")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ads.data.map((ad) => (
                            <TableRow
                                key={ad.id}
                                className="hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleRowClick(ad.id)} // Добавляем обработчик клика
                            >
                                <TableCell>
                                    {ad.photos.length > 0 ? (
                                        <img
                                            src={`/storage/${ad.photos[0].path}`}
                                            alt="Фото"
                                            className="h-36  w-36 object-cover"
                                        />
                                    ) : (
                                        <p className="h-36 text-center w-36 object-cover">
                                            No Foto
                                        </p>
                                    )}
                                </TableCell>
                                <TableCell>{ad.name}</TableCell>
                                <TableCell>{ad.category}</TableCell>
                                <TableCell>
                                    {ad.price ? `${ad.price}` : "Нет данных"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-center mt-4 px-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() =>
                                    handlePageChange(ads.meta.current_page - 1)
                                }
                            />
                        </PaginationItem>
                        {Array.from(
                            { length: ads.meta.last_page },
                            (_, index) => index + 1
                        ).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href="#"
                                    isActive={page === ads.meta.current_page}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() =>
                                    handlePageChange(ads.meta.current_page + 1)
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </Authenticated>
    );
};

export default Index;
