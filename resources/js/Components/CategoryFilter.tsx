import React from "react";

interface CategoryFilterProps {
    categories: ICategory[];
    selectedCategory: number | null;
    onCategorySelect: (categoryId: number | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onCategorySelect,
}) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 my-8">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() =>
                        onCategorySelect(
                            selectedCategory === category.id
                                ? null
                                : category.id
                        )
                    } // Снимаем фильтр, если нажата выбранная категория
                    className={`flex flex-col items-center p-4 bg-gray-300 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-200 ease-in-out ${
                        selectedCategory === category.id
                            ? "border-2 border-blue-400"
                            : ""
                    }`} // Добавляем бордер для выбранной категории
                >
                    {category.img && (
                        <img
                            src={`/storage/${category.img}`}
                            alt={category.name}
                            className="w-20 h-20 object-cover rounded-full"
                        />
                    )}
                    <span className="mt-2 text-sm font-medium">
                        {category.name}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
