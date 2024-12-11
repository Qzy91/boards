"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";
import { Ad } from "@/types";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNextC,
    PaginationPreviousC,
} from "@/Components/ui/pagination";

interface DataTableProps {
    columns: ColumnDef<Ad, unknown>[]; // Определение структуры колонок
    data: Ad[]; // Данные для отображения
    pagination: {
        currentPage: number; // Текущая страница
        lastPage: number; // Последняя страница
        perPage: number; // Количество элементов на странице
        total: number; // Общее количество элементов
    };
    filters: {
        filters: Record<string, string>; // Фильтры
        sort: { field: string; direction: "asc" | "desc" }; // Сортировка
        page: number; // Номер страницы
        per_page: number; // Элементов на странице
    };
}

export function DataTable({
    columns,
    data,
    pagination,
    filters,
}: DataTableProps) {
    // Форма управления состоянием
    const {
        data: formData,
        setData,
        get,
    } = useForm({
        filters: filters.filters || {},
        sort: filters.sort?.field
            ? filters.sort
            : { field: "created_at", direction: "desc" },
        page: filters.page || 1,
        per_page: filters.per_page || 10,
    });

    // Настройка таблицы
    const table = useReactTable({
        data, // Данные для отображения
        columns, // Колонки
        state: {},
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount: pagination.lastPage,
    });

    /**
     * Обработчик изменения сортировки
     */
    const handleSortChange = (sortField: string, sortDirection: boolean) => {
        setData("sort", {
            field: sortField,
            direction: sortDirection ? "desc" : "asc",
        });
        get(route("listings.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    /**
     * Обработчик изменения фильтров
     */
    const handleFilterChange = (field: string, value: string) => {
        const updatedFilters = { ...formData.filters, [field]: value };
        setData("filters", updatedFilters);
        get(route("listings.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    /**
     * Обработчик изменения страницы
     */
    const handlePageChange = (page: number) => {
        setData("page", page);
        get(route("listings.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    /**
     * Обработчик изменения количества элементов на странице
     */
    const handlePerPageChange = (perPage: number) => {
        setData("per_page", perPage);
        get(route("listings.index"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div>
            {/* Поле ввода для фильтрации */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Фильтр по названию..."
                    value={formData.filters.name || ""}
                    onChange={(event) =>
                        handleFilterChange("name", event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                {/* Таблица */}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Нет результатов.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between py-4">
                {/* Пагинация */}
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPreviousC
                                href={route("listings.index", {
                                    page: Math.max(
                                        1,
                                        pagination.currentPage - 1
                                    ),
                                })}
                                disabled={pagination.currentPage === 1}
                                onClick={() =>
                                    handlePageChange(
                                        Math.max(1, pagination.currentPage - 1)
                                    )
                                }
                            />
                        </PaginationItem>
                        {Array.from(
                            { length: pagination.lastPage },
                            (_, index) => index + 1
                        ).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    href={route("listings.index", { page })}
                                    isActive={page === pagination.currentPage}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNextC
                                href={route("listings.index", {
                                    page: Math.min(
                                        pagination.lastPage,
                                        pagination.currentPage + 1
                                    ),
                                })}
                                disabled={
                                    pagination.currentPage ===
                                    pagination.lastPage
                                }
                                onClick={() =>
                                    handlePageChange(
                                        Math.min(
                                            pagination.lastPage,
                                            pagination.currentPage + 1
                                        )
                                    )
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
