<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdRequest;
use App\Http\Resources\AdResource;
use App\Models\Ad;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdController extends Controller
{
    public function index(Request $request)
    {
        $query = Ad::with(['photos', 'user', 'category']);

        // Фильтры
        if ($request->has('filters')) {
            $filters = $request->input('filters');
            if (isset($filters['name'])) {
                $query->where('name', 'like', '%' . $filters['name'] . '%');
            }
            if (isset($filters['category_id'])) {
                $query->where('category_id', $filters['category_id']); // Фильтрация по категории
            }
        }

        // Сортировка
        if ($request->has('sort') && !empty($request->input('sort.field'))) {
            $sort = $request->input('sort');
            $query->orderBy($sort['field'], $sort['direction']);
        } else {
            $query->orderBy('created_at', 'desc'); // Fallback сортировка
        }

        // Пагинация
        $perPage = $request->input('per_page', 10);
        $ads = AdResource::collection($query->paginate($perPage));
        $categories = Category::all(['id', 'name', 'img']);
        $filters= [
            'filters' => $request->input('filters', []),
            'sort' => $request->input('sort', ['field' => 'created_at', 'direction' => 'desc']),
            'page' => $request->input('page', 1),
            'per_page' => $request->input('per_page', 10),
        ];
        // dd($request);
        return Inertia::render('Listings/Index', [
            'ads' => $ads,
            'categories' => $categories, // Передаём категории на фронтенд
            'filters' => [
                'filters' => $request->input('filters', []),
                'sort' => $request->input('sort', ['field' => 'created_at', 'direction' => 'desc']),
                'page' => $request->input('page', 1),
                'per_page' => $request->input('per_page', 10),
            ],
        ]);
    }

public function create()
{
    $categories = Category::all(['id', 'name']);
    return Inertia::render('Listings/Create', [
        'categories' => $categories,
    ]);
}

public function store(StoreAdRequest $request)
{
    $ad = $request->user()->ads()->create([
        'name' => $request->name,
        'description' => $request->description,
        'category_id' => $request->category,
        'price' => $request->price,
    ]);

    if ($request->hasFile('photos')) {
        foreach ($request->file('photos') as $photo) {
            $path = $photo->store('photos', 'public');
            $ad->photos()->create(['path' => $path]);
        }
    }

    return redirect()->route('listings.index')->with('success', 'Ad created successfully.');
}

public function show(Ad $listing)
{
    $listing->load(['photos', 'user', 'category']); // Загружаем связанные данные
    return Inertia::render('Listings/Show', [
        'ad' => new AdResource($listing),
    ]);
}

}
