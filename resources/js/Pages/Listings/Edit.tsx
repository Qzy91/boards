import React from "react";
import { Head, useForm } from "@inertiajs/react";

interface EditAdFormData {
    name: string;
    description: string;
    category: string;
    photos: FileList | null;
}

interface Props {
    ad: {
        id: number;
        name: string;
        description: string;
        category: string;
        photos: {
            id: number;
            path: string;
        }[];
    };
}

export default function Edit({ ad }: Props) {
    const { data, setData, put, processing, errors } = useForm<EditAdFormData>({
        name: ad.name,
        description: ad.description,
        category: ad.category,
        photos: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);

        if (data.photos) {
            Array.from(data.photos).forEach((photo, index) => {
                formData.append(`photos[${index}]`, photo);
            });
        }

        put(`/ads/${ad.id}`, {
            data: formData,
            forceFormData: true,
            onError: () => {},
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
        <>
            <Head title="Редактировать объявление" />

            <form onSubmit={submit}>
                {/* Поля для name, description, category аналогично компоненту Create.tsx */}

                <div>
                    <label htmlFor="photos">Добавить фотографии (до 10)</label>
                    <input
                        id="photos"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {errors.photos && <div>{errors.photos}</div>}
                </div>

                <button type="submit" disabled={processing}>
                    Сохранить изменения
                </button>
            </form>

            {/* Отобрази существующие фотографии и возможность их удалить */}
            <div>
                <h3>Существующие фотографии</h3>
                {ad.photos.map((photo) => (
                    <div key={photo.id}>
                        <img
                            src={`/storage/${photo.path}`}
                            alt={`Фото ${photo.id}`}
                        />
                        {/* Добавь кнопку для удаления фотографии */}
                    </div>
                ))}
            </div>
        </>
    );
}
