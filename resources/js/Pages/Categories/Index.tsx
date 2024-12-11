import React, { useState } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";

const CategoriesIndex = () => {
    const { categories } = usePage<{ categories: { data: Category[] } }>()
        .props;

    // Хук для формы создания
    const {
        data: createData,
        setData: setCreateData,
        post,
        processing: creating,
        errors: createErrors,
    } = useForm({
        name: "",
        img: null as File | null,
    });

    // Хук для формы редактирования
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editing,
        errors: editErrors,
    } = useForm({
        name: "",
        img: null as File | null,
    });

    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );

    // Обработчик для формы создания
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/categories", {
            forceFormData: true,
            onSuccess: () => setCreateData({ name: "", img: null }),
        });
    };

    // Открытие диалога редактирования
    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setEditData({
            name: category.name,
            img: null,
        });
    };

    // Обработчик для формы редактирования
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        put(`/categories/${editingCategory.id}`, {
            forceFormData: true,
            onSuccess: () => setEditingCategory(null),
        });
    };

    const handleDeleteCategory = (category: number) => {
        if (!window.confirm("Are you sure you want to delete the project?")) {
            return;
        }
        router.delete(`/categories/${category}`);
    };

    return (
        <Authenticated
            header={<h1 className="text-xl font-bold">Categories</h1>}
        >
            {/* Форма создания */}
            <div className="max-w-2xl mx-28 mt-6">
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={createData.name}
                            onChange={(e) =>
                                setCreateData("name", e.target.value)
                            }
                        />
                        {createErrors.name && <p>{createErrors.name}</p>}
                    </div>
                    <div>
                        <Label>Image</Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setCreateData(
                                    "img",
                                    e.target.files ? e.target.files[0] : null
                                )
                            }
                        />
                        {createErrors.img && (
                            <p className="text-red-500">{createErrors.img}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={creating}>
                        Create Category
                    </Button>
                </form>
            </div>

            {/* Таблица категорий */}
            <div className="mt-10 px-28">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.data.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>
                                    {category.img ? (
                                        <img
                                            src={`${category.img}`}
                                            alt="Category"
                                            className="h-12 w-12 object-cover"
                                        />
                                    ) : (
                                        "No Image"
                                    )}
                                </TableCell>
                                <TableCell className="flex space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    openEditDialog(category)
                                                }
                                            >
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Edit Category
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Update category details
                                                    below.
                                                </DialogDescription>
                                            </DialogHeader>
                                            {editingCategory && (
                                                <form
                                                    onSubmit={handleEditSubmit}
                                                    className="space-y-4"
                                                >
                                                    <div>
                                                        <Label>Name</Label>
                                                        <Input
                                                            value={
                                                                editData.name
                                                            }
                                                            onChange={(e) =>
                                                                setEditData(
                                                                    "name",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                        {editErrors.name && (
                                                            <p className="text-red-500">
                                                                {
                                                                    editErrors.name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Label>Image</Label>
                                                        <Input
                                                            type="file"
                                                            onChange={(e) =>
                                                                setEditData(
                                                                    "img",
                                                                    e.target
                                                                        .files
                                                                        ? e
                                                                              .target
                                                                              .files[0]
                                                                        : null
                                                                )
                                                            }
                                                        />
                                                        {editErrors.img && (
                                                            <p className="text-red-500">
                                                                {editErrors.img}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            type="submit"
                                                            disabled={editing}
                                                        >
                                                            Save
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            router.delete(
                                                `/categories/${category.id}`
                                            );
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Authenticated>
    );
};

export default CategoriesIndex;
