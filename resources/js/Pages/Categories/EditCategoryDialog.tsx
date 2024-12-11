import React from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";

interface EditCategoryDialogProps {
    category: Category;
    isOpen: boolean;
    onClose: () => void;
}

const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
    category,
    isOpen,
    onClose,
}) => {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        img: null as File | null,
    });

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/categories/${category.id}`, {
            forceFormData: true,
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Update category details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-red-500">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <Label>Image</Label>
                        <Input
                            type="file"
                            onChange={(e) =>
                                setData(
                                    "img",
                                    e.target.files ? e.target.files[0] : null
                                )
                            }
                        />
                        {errors.img && (
                            <p className="text-red-500">{errors.img}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCategoryDialog;
