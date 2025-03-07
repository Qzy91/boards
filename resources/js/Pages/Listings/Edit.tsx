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
import { Inertia, Method } from "@inertiajs/inertia";

interface AdData {
    id: number;
    name: string;
    description: string;
    category_id: number;
    price: string;
    photos: { id: number; path: string }[];
    city_id?: number | null;
}

interface EditProps {
    auth: any;
    categories: ICategory[];
    ad: {
        data: AdData;
    };
    regions: Region[];
    initLocation: {
        region_id: number | null;
        city_id: number | null;
    };
}

interface Photo {
    id: string;
    file?: File; // для новых файлов
    preview: string;
}

export default function Edit({
    auth,
    categories,
    ad,
    regions,
    initLocation,
}: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: ad.data.name,
        description: ad.data.description,
        category: ad.data.category_id.toString(),
        price: ad.data.price,
        photos: [] as File[],
    });

    const [newPhotos, setNewPhotos] = useState<Photo[]>([]);
    const [existingPhotos, setExistingPhotos] = useState<Photo[]>(
        ad.data.photos.map((p) => ({
            id: p.id.toString(),
            preview: `/storage/${p.path}`,
        }))
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [regionId, setRegionId] = useState<number | null>(
        initLocation.region_id
    );
    const [cityId, setCityId] = useState<number | null>(initLocation.city_id);

    const filteredCities = useMemo(() => {
        if (!regionId) return [];
        const reg = regions.find((r) => r.id === regionId);
        return reg ? reg.cities : [];
    }, [regionId, regions]);

    // Очистка URL для новых фото при размонтировании
    useEffect(() => {
        return () => {
            newPhotos.forEach((photo) => {
                if (photo.file) URL.revokeObjectURL(photo.preview);
            });
        };
    }, [newPhotos]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            // Ограничиваем общее число фото (существующих + новых)
            const availableSlots =
                10 - existingPhotos.length - newPhotos.length;
            if (availableSlots <= 0) {
                alert("Достигнуто максимальное количество фотографий (10).");
                return;
            }
            const filesToAdd = filesArray.slice(0, availableSlots);
            const addedPhotos = filesToAdd.map((file, idx) => ({
                id: `${Date.now()}-${idx}`,
                file,
                preview: URL.createObjectURL(file),
            }));
            setNewPhotos((prev) => [...prev, ...addedPhotos]);
            setData("photos", [...data.photos, ...filesToAdd]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Удаление фото:
    // Если фото из существующего набора, просто удаляем из отображения (можно дополнительно передать список удалённых id на сервер)
    // Если новое, удаляем и из useForm (фильтруем по имени файла)
    const removePhoto = (id: string, isExisting: boolean) => {
        if (isExisting) {
            setExistingPhotos((prev) =>
                prev.filter((photo) => photo.id !== id)
            );
            // Здесь можно сохранить удалённые id для удаления на сервере
        } else {
            setNewPhotos((prev) => {
                const removed = prev.find((photo) => photo.id === id);
                if (removed && removed.file)
                    URL.revokeObjectURL(removed.preview);
                return prev.filter((photo) => photo.id !== id);
            });
            setData(
                "photos",
                data.photos.filter(
                    (file) =>
                        file.name !==
                        newPhotos.find((photo) => photo.id === id)?.file?.name
                )
            );
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("price", data.price);
        formData.append("city_id", cityId ? String(cityId) : "");
        formData.append("_method", "post");

        existingPhotos.forEach((p) =>
            formData.append("existing_photos[]", p.id)
        );
        data.photos.forEach((file) => formData.append("photos[]", file));

        Inertia.visit(route("listings.update", ad.data.id), {
            method: "post" as Method,
            data: formData,
            onError: (errors) => {
                console.log("Validation errors:", errors);
            },
        });
    };

    return (
        <Authenticated
            header={
                <h2 className="text-xl font-semibold">
                    Редактировать объявление
                </h2>
            }
        >
            <Head title="Редактировать объявление" />
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
                            value={data.category}
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

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <Label>Регион</Label>
                            <Select
                                value={
                                    regionId !== null ? String(regionId) : "all"
                                }
                                onValueChange={(val) => {
                                    if (val === "all") {
                                        setRegionId(null);
                                        setCityId(null);
                                    } else {
                                        setRegionId(Number(val));
                                        setCityId(null);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Все регионы" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Все регионы
                                    </SelectItem>
                                    {regions.map((reg) => (
                                        <SelectItem
                                            key={reg.id}
                                            value={String(reg.id)}
                                        >
                                            {reg.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-1/2">
                            <Label>Город</Label>
                            <Select
                                value={cityId !== null ? String(cityId) : "all"}
                                onValueChange={(val) => {
                                    if (val === "all") setCityId(null);
                                    else setCityId(Number(val));
                                }}
                                disabled={!regionId}
                            >
                                <SelectTrigger className="w-full mt-1">
                                    <SelectValue placeholder="Все города" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Все города
                                    </SelectItem>
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
                        </div>
                    </div>

                    <div>
                        {/* Отображаем существующие фото */}
                        {existingPhotos.length > 0 && (
                            <div className="flex flex-wrap gap-4 mb-4">
                                {existingPhotos.map((photo) => (
                                    <div key={photo.id} className="relative">
                                        <img
                                            src={photo.preview}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removePhoto(photo.id, true)
                                            }
                                            className="absolute top-0 h-6 w-6 right-0 bg-red-500 text-white rounded-full"
                                        >
                                            х
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Отображаем новые загруженные фото */}
                        {newPhotos.length > 0 && (
                            <div className="flex flex-wrap gap-4 mb-4">
                                {newPhotos.map((photo) => (
                                    <div key={photo.id} className="relative">
                                        <img
                                            src={photo.preview}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removePhoto(photo.id, false)
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
                        Обновить
                    </Button>
                </form>
            </div>
        </Authenticated>
    );
}
