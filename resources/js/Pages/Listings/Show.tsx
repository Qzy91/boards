import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

const Show = () => {
    const { ad } = usePage<{ ad: { data: Ad } }>().props;

    if (!ad || !ad.data) {
        return (
            <Authenticated
                header={<h1 className="text-xl font-bold">Объявление</h1>}
            >
                <div className="container mx-auto p-6 text-center">
                    <p className="text-gray-500">
                        Данные объявления не найдены.
                    </p>
                </div>
            </Authenticated>
        );
    }

    const adData = ad.data;

    // Добавляем состояние для API карусели
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [totalSlides, setTotalSlides] = useState(0);

    // Отслеживаем изменения API карусели
    useEffect(() => {
        if (!carouselApi) return;

        setTotalSlides(carouselApi.scrollSnapList().length);
        setCurrentSlide(carouselApi.selectedScrollSnap() + 1);

        carouselApi.on("select", () => {
            setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
        });
    }, [carouselApi]);

    return (
        <Authenticated
            header={<h1 className="text-xl font-bold">{adData.name}</h1>}
        >
            <div className="container mx-auto p-6">
                {/* Название и цена */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">{adData.name}</h2>
                    <p className="text-lg text-gray-700">
                        {adData.price ? adData.price : "0"} грн
                    </p>
                </div>

                {/* Категория */}
                <div className="mb-6">
                    <span className="text-sm font-medium text-gray-600">
                        Категория: {adData.category || "Не указана"}
                    </span>
                </div>

                {/* Карусель фотографий */}
                <div className="mb-4">
                    {adData.photos && adData.photos.length > 0 ? (
                        <>
                            <Carousel
                                setApi={setCarouselApi}
                                className="w-full max-h-lg max-w-lg mx-auto"
                            >
                                <CarouselContent>
                                    {adData.photos.map((photo) => (
                                        <CarouselItem
                                            key={photo.id}
                                            className="flex aspect-square items-center justify-center"
                                        >
                                            <img
                                                src={`/storage/${photo.path}`}
                                                alt={`Фото ${adData.name}`}
                                                className="w-full h-96 object-cover"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                            <div className="py-2 text-center text-sm text-muted-foreground">
                                Слайд {currentSlide} из {totalSlides}
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Нет фотографий</p>
                    )}
                </div>

                {/* Описание */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold">Описание</h3>
                    <p className="text-gray-700">{adData.description}</p>
                </div>

                {/* Данные пользователя */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-bold">Контактная информация</h3>
                    <ul className="text-gray-700">
                        <li>
                            <strong>Имя:</strong> {adData.user.name}
                        </li>
                        <li>
                            <strong>Email:</strong> {adData.user.email}
                        </li>
                        <li>
                            <strong>Город:</strong>{" "}
                            {adData.user.city || "Не указан"}
                        </li>
                        <li>
                            <strong>Телефон:</strong>{" "}
                            {adData.user.phone || "Не указан"}
                        </li>
                    </ul>
                </div>
            </div>
        </Authenticated>
    );
};

export default Show;
