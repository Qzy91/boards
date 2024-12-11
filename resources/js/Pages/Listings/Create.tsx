import React from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"; // Импортируем Select
import { Label } from "@/Components/ui/label";

interface CreateProps {
    auth: any;
    categories: ICategory[];
}

export default function Create({ auth, categories }: CreateProps) {
    const { data, setData, post, processing, errors } =
        useForm<CreateAdFormData>({
            name: "",
            description: "",
            category: "",
            photos: null,
            price: "",
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("price", data.price);

        if (data.photos) {
            Array.from(data.photos).forEach((photo, index) => {
                formData.append(`photos[${index}]`, photo);
            });
        }

        post("/listings", {
            data: formData,
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length <= 10) {
            setData("photos", e.target.files);
        } else {
            alert("Можно загрузить не более 10 фотографий.");
            e.target.value = "";
        }
    };

    return (
        <Authenticated
            header={
                <h2 className="text-xl font-semibold">Создать объявление</h2>
            }
        >
            <Head title="Создать объявление" />

            <div className="max-w-2xl mx-auto mt-10">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Название
                        </label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Описание
                        </label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="mt-1 block w-full"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Категория
                        </Label>
                        <Select
                            onValueChange={(value) =>
                                setData("category", value)
                            }
                        >
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id.toString()}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.category}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Цена
                        </label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            max="999999999"
                            step="1"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="mt-1 block w-full"
                        />
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="photos"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Фотографии (до 10)
                        </label>
                        <Input
                            id="photos"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*"
                            className="mt-1 block w-full"
                        />
                        {errors.photos && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.photos}
                            </p>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Создать
                    </Button>
                </form>
            </div>
        </Authenticated>
    );
}
