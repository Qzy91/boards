import React, { useState, useEffect, useRef, useMemo } from "react";
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
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";

interface CreateProps {
    auth: any;
    categories: ICategory[];
    regions: Region[];
    initLocation: {
        city_id: number | null;
        region_id: number | null;
    };
}

interface Photo {
    id: string;
    file: File;
    preview: string;
}

export default function Create({
    auth,
    categories,
    regions,
    initLocation,
}: CreateProps) {
    // console.log(auth, categories);
    const { data, setData, post, processing, errors } =
        useForm<CreateAdFormData>({
            name: "",
            description: "",
            category: "",
            price: "",
            city_id: initLocation.city_id ? String(initLocation.city_id) : "",
            photos: [] as File[],
        });

    const [regionId, setRegionId] = useState<string>(
        initLocation.region_id ? String(initLocation.region_id) : ""
    );

    const [photos, setPhotos] = useState<Photo[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleRegionChange = (value: string) => {
        setRegionId(value);
        // Город обнуляем в useForm
        setData("city_id", "");
    };

    // Когда пользователь выбирает город, пишем city_id
    const handleCityChange = (value: string) => {
        setData("city_id", value);
        console.log(data);
    };

    // Фильтруем города по текущему regionId
    const filteredCities = useMemo(() => {
        if (!regionId) return [];
        const reg = regions.find((r) => r.id === Number(regionId));
        return reg ? reg.cities : [];
    }, [regionId, regions]);

    // Очистка URL превью при размонтировании
    useEffect(() => {
        return () => {
            photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
        };
    }, [photos]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const availableSlots = 10 - photos.length;
            if (availableSlots <= 0) {
                alert("Достигнуто максимальное количество фотографий (10).");
                return;
            }
            // Берём только столько файлов, сколько осталось по лимиту
            const filesToAdd = filesArray.slice(0, availableSlots);
            // Формируем объекты для превью с уникальным id
            const newPhotos = filesToAdd.map((file, idx) => ({
                id: `${Date.now()}-${idx}`,
                file,
                preview: URL.createObjectURL(file),
            }));
            // Обновляем локальный стейт для превью
            setPhotos((prev) => [...prev, ...newPhotos]);
            // И синхронизируем файлы в useForm (поле photos)
            setData("photos", [...data.photos, ...filesToAdd]);
            // Очищаем input, чтобы можно было снова выбрать те же файлы
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // При удалении нужно удалить и из локального стейта превью, и из useForm
    const removePhoto = (id: string) => {
        setPhotos((prevPhotos) => {
            const removed = prevPhotos.find((photo) => photo.id === id);
            const updatedPhotos = prevPhotos.filter((photo) => {
                if (photo.id === id) {
                    URL.revokeObjectURL(photo.preview);
                    return false;
                }
                return true;
            });
            if (removed) {
                setData(
                    "photos",
                    data.photos.filter((file) => file !== removed.file)
                );
            }
            return updatedPhotos;
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting data:", data);

        post("/listings", {
            data: data,
            forceFormData: true,
        });
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

                    {/* Region Select */}
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">
                            Регион
                        </Label>
                        <Select
                            value={regionId}
                            onValueChange={handleRegionChange}
                        >
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Выберите регион" />
                            </SelectTrigger>
                            <SelectContent>
                                {regions.map((region) => (
                                    <SelectItem
                                        key={region.id}
                                        value={String(region.id)}
                                    >
                                        {region.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City Select */}
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">
                            Город
                        </Label>
                        <Select
                            value={data.city_id}
                            onValueChange={handleCityChange}
                            disabled={!regionId}
                        >
                            <SelectTrigger className="mt-1 w-full">
                                <SelectValue placeholder="Выберите город" />
                            </SelectTrigger>
                            <SelectContent>
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
                        {errors.city_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.city_id}
                            </p>
                        )}
                    </div>

                    <div>
                        {/* Render photo previews */}
                        {photos.length > 0 && (
                            <div className="flex flex-wrap gap-4 mb-4">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="relative">
                                        <img
                                            src={photo.preview}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removePhoto(photo.id)
                                            }
                                            className="absolute top-0 h-6 w-6 right-0 bg-red-500 text-white rounded-full"
                                        >
                                            х
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            ref={fileInputRef}
                        />
                        {errors.photos && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.photos as string}
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
