import React, { useMemo, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

const Index = () => {
    const { ads, filters, categories, regions } = usePage<{
        ads: AdsResponse;
        filters: Filters;
        categories: ICategory[];
        regions: Region[];
    }>().props;
    const [searchTerm, setSearchTerm] = useState(filters.filters?.name || "");
    //category
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        filters.filters?.category_id || null
    );
    //sort
    const [sortField, setSortField] = useState(
        filters.sort?.field || "created_at"
    );
    const [sortDirection, setSortDirection] = useState(
        filters.sort?.direction || "desc"
    );
    //filters
    const [regionId, setRegionId] = useState<number | null>(
        filters.filters?.region_id ? Number(filters.filters.region_id) : null
    );
    const [cityId, setCityId] = useState<number | null>(
        filters.filters?.city_id ? Number(filters.filters.city_id) : null
    );

    const filteredCities = useMemo(() => {
        if (!regionId) return [];
        const reg = regions.find((r) => r.id === regionId);
        return reg ? reg.cities : [];
    }, [regionId, regions]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handleSearch = () => {
        console.log(searchTerm);
        router.get(
            route("listings.index"),
            {
                ...filters,
                filters: {
                    ...filters.filters,
                    name: searchTerm,
                    region_id: regionId ?? undefined,
                    city_id: cityId ?? undefined,
                },
                page: 1,
            },
            { replace: true, preserveState: true }
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
        router.get(route("listings.show", adId));
    };

    const handleRegionChange = (value: string) => {
        if (value === "all") {
            setRegionId(null);
            setCityId(null); // сбрасываем город
        } else {
            setRegionId(Number(value));
            setCityId(null);
        }
    };

    const handleCityChange = (value: string) => {
        if (value === "all") {
            setCityId(null);
        } else {
            setCityId(Number(value));
        }
    };

    return (
        <Authenticated
            header={
                <div className="flex w-100  gap-2 items-center justify-center">
                    <div>
                        <Input
                            placeholder="Що хочете знайти?"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-80  bg-white"
                        />
                    </div>

                    <Select
                        value={regionId ? regionId.toString() : ""}
                        onValueChange={handleRegionChange}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Все регионы" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все регионы</SelectItem>
                            {regions.map((reg) => (
                                <SelectItem key={reg.id} value={String(reg.id)}>
                                    {reg.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={cityId ? cityId.toString() : ""}
                        onValueChange={handleCityChange}
                        disabled={!regionId}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Все города" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все города</SelectItem>
                            {filteredCities.map((city) => (
                                <SelectItem
                                    key={city.id}
                                    value={String(city.id)}
                                >
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="default"
                        className=""
                        onClick={() => handleSearch()}
                    >
                        Пошук
                    </Button>
                </div>
            }
        >
            {/* Компонент фильтрации по категориям */}
            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory} // Передаём выбранную категорию
                onCategorySelect={handleCategorySelect}
            />

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
