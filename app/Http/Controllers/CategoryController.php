<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::paginate(10);

        return Inertia::render('Categories/Index', [
            'categories' => CategoryResource::collection($categories),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('img')) {
            $data['img'] = $request->file('img')->store('categories', 'public');
        }

        Category::create($data);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');
    }

    public function update(StoreCategoryRequest $request, Category $category)
    {
        Log::info($request->all());
        $validated = $request->validated();


        if ($request->hasFile('img')) {
            if ($category->img) {
                Storage::disk('public')->delete($category->img);
            }
            $validated['img'] = $request->file('img')->store('categories', 'public');
        }

        $category->update($validated);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $name = $category->name;
        if ($category->ads()->exists()) {
            return redirect()->route('categories.index')->withErrors(['message' => "Cannot delete a category \"$name\" with associated ads."]);
        }

        if ($category->img) {
            Storage::disk('public')->delete($category->img);
        }

        $category->delete();

        return redirect()->route('categories.index')->with('success', "Category \"$name\" deleted successfully.");
    }
}
