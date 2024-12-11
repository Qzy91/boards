import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { usePage } from "@inertiajs/react";

export default function EditCategory() {
    const {
        category,
    }: { category: { id: number; name: string; img: string | null } } =
        usePage().props;

    const [name, setName] = useState(category.name);
    const [img, setImg] = useState<File | null>(null);

    const { put, processing, errors } = useForm({
        name: category.name,
        img: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/categories/${category.id}`, { name, img });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Edit Category</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category Name"
                    />
                    {errors.name && (
                        <p className="text-red-500">{errors.name}</p>
                    )}
                </div>
                <div>
                    <Input
                        type="file"
                        onChange={(e) =>
                            setImg(e.target.files ? e.target.files[0] : null)
                        }
                    />
                    {errors.img && <p className="text-red-500">{errors.img}</p>}
                </div>
                <Button type="submit" disabled={processing}>
                    Update Category
                </Button>
            </form>
        </div>
    );
}
