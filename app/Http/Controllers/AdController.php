<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdRequest;
use App\Http\Resources\AdResource;
use App\Models\Ad;
use App\Models\Category;
use App\Models\City;
use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdController extends Controller
{
    public function index(Request $request)
    {
        $query = Ad::with(['photos', 'user', 'category'])
        ->whereNotNull('activation_date')
        ->where('activation_date', '>=', now()->subDays(7));

        // Фильтры
        if ($request->has('filters')) {
            $filters = $request->input('filters');
            if (isset($filters['name'])) {
                $query->where('name', 'like', '%' . $filters['name'] . '%');
            }
            if (isset($filters['category_id'])) {
                $query->where('category_id', $filters['category_id']);
            }
            // region
            if (isset($filters['region_id'])) {
                // find all cities that belong to the region
                $cityIds = \App\Models\City::where('region_id', $filters['region_id'])
                    ->pluck('id');
                // update city_id if it belongs to region
                $query->whereIn('city_id', $cityIds);
            }

            // city
            if (isset($filters['city_id'])) {
                $query->where('city_id', $filters['city_id']);
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

        $regions = \App\Models\Region::with('cities')->get();
        return Inertia::render('Listings/Index', [
            'ads' => $ads,
            'categories' => $categories,
            'regions' => $regions,
            'filters' => [
                'filters' => $request->input('filters', []),
                'sort' => $request->input('sort', ['field' => 'created_at', 'direction' => 'desc']),
                'page' => $request->input('page', 1),
                'per_page' => $request->input('per_page', 10),
            ],
        ]);
    }

public function create(Request $request)
{

    $user = $request->user();
    $regions = Region::with('cities')->get();
    $regionId = null;
    if ($user->city_id) {
        $city = City::find($user->city_id);
        if ($city) {
            $regionId = $city->region_id;
        }
    }

    $categories = Category::all(['id', 'name']);
    return Inertia::render('Listings/Create', [
        'categories' => $categories,
        'regions' => $regions,
        'initLocation' => [
            'city_id' => $user->city_id,
            'region_id' => $regionId,
        ],
    ]);
}

public function store(StoreAdRequest $request)
{
    $ad = $request->user()->ads()->create([
        'name' => $request->name,
        'description' => $request->description,
        'category_id' => $request->category,
        'city_id' => $request->city_id,
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
    $listing->load(['photos', 'user', 'city.region', 'category']);
    // return($listing);
    return Inertia::render('Listings/Show', [
        'ad' => new AdResource($listing),
    ]);
}

public function myAds(Request $request)
{
    $user = $request->user();

    // Базовый запрос: фильтр по пользователю + подгрузка связей
    $baseQuery = Ad::with(['photos','user','category'])
        ->where('user_id', $user->id);

    // Применяем фильтры (название, категория)
    if ($request->has('filters')) {
        $filters = $request->input('filters');
        if (isset($filters['name'])) {
            $baseQuery->where('name', 'like', '%' . $filters['name'] . '%');
        }
        if (isset($filters['category_id'])) {
            $baseQuery->where('category_id', $filters['category_id']);
        }
    }

    // Сортировка
    if ($request->has('sort') && !empty($request->input('sort.field'))) {
        $sort = $request->input('sort');
        $baseQuery->orderBy($sort['field'], $sort['direction']);
    } else {
        $baseQuery->orderBy('created_at', 'desc');
    }

    // Клонируем запрос для активных и неактивных
    $activeQuery = clone $baseQuery;
    $inactiveQuery = clone $baseQuery;

    // Активные: activation_date >= now - 30 дней
    // Объявление активно, если его activation_date не null и новее 30 дней
    $activeQuery->whereNotNull('activation_date')
        ->where('activation_date', '>=', now()->subDays(30));

    // Неактивные: либо null, либо старше 30 дней
    $inactiveQuery->where(function($q){
        $q->whereNull('activation_date')
          ->orWhere('activation_date','<', now()->subDays(30));
    });

    // Можно сделать пагинацию для каждого списка отдельно
    $activeAds   = AdResource::collection($activeQuery->paginate(10, ['*'], 'pageActive'));
    $inactiveAds = AdResource::collection($inactiveQuery->paginate(10, ['*'], 'pageInactive'));

    $categories = Category::all(['id','name','img']);

    return Inertia::render('Listings/MyAds', [
        'activeAds'   => $activeAds,
        'inactiveAds' => $inactiveAds,
        'categories'  => $categories,
        'filters'     => [
            'filters' => $request->input('filters', []),
            'sort'    => $request->input('sort', [
                           'field' => 'created_at',
                           'direction' => 'desc'
                        ]),
            'page'     => $request->input('page',1),
            'per_page' => $request->input('per_page',10),
        ],
    ]);
}


// public function myAds(Request $request)
// {
//     $query = Ad::with(['photos', 'user', 'category'])
//         ->where('user_id', $request->user()->id); // Фильтр по текущему пользователю

//     // Фильтры
//     if ($request->has('filters')) {
//         $filters = $request->input('filters');
//         if (isset($filters['name'])) {
//             $query->where('name', 'like', '%' . $filters['name'] . '%');
//         }
//         if (isset($filters['category_id'])) {
//             $query->where('category_id', $filters['category_id']);
//         }
//     }

//     // Сортировка
//     if ($request->has('sort') && !empty($request->input('sort.field'))) {
//         $sort = $request->input('sort');
//         $query->orderBy($sort['field'], $sort['direction']);
//     } else {
//         $query->orderBy('created_at', 'desc'); // Fallback сортировка
//     }

//     // Пагинация
//     $perPage = $request->input('per_page', 10);
//     $ads = AdResource::collection($query->paginate($perPage));
//     $categories = Category::all(['id', 'name', 'img']);

//     return Inertia::render('Listings/MyAds', [
//         'ads' => $ads,
//         'categories' => $categories,
//         'filters' => [
//             'filters' => $request->input('filters', []),
//             'sort' => $request->input('sort', ['field' => 'created_at', 'direction' => 'desc']),
//             'page' => $request->input('page', 1),
//             'per_page' => $request->input('per_page', 10),
//         ],
//     ]);
// }

public function edit(Ad $listing, Request $request)
{
    $user = $request->user();
    if ($user === null || $listing->user_id !== $user->id) {
        abort(403, 'Unauthorized');
    }

    $regions = Region::with('cities')->get();

    $regionId = null;
    if ($listing->city_id) {
        $city = City::find($listing->city_id);
        if ($city) {
            $regionId = $city->region_id;
        }
    }

    $listing->load(['photos']); // загружаем связанные фото
    $categories = Category::all(['id', 'name']);
    return Inertia::render('Listings/Edit', [
        'ad' => new AdResource($listing),
        'categories' => $categories,
        'regions' => $regions,
        'initLocation' => [
            'city_id' => $listing->city_id,
            'region_id' => $regionId,
        ],
    ]);
}

public function update(StoreAdRequest $request, Ad $listing)
{
    // dd($request->all());
    $user = $request->user();
    if ($user === null || $listing->user_id !== $user->id) {
        abort(403, 'Unauthorized');
    }

    // Обновляем основные поля объявления.
    $listing->update([
        'name'         => $request->name,
        'description'  => $request->description,
        'category_id'  => $request->category,
        'price'        => $request->price,
        'city_id'      => $request->city_id,
    ]);

    // dd($request->has('existing_photos'));
    // Удаляем фото, которых больше нет в списке оставшихся
    if ($request->has('existing_photos')) {
        $remaining = array_map('intval', $request->existing_photos);
        // dd($remaining);
        $listing->photos()->whereNotIn('id', $remaining)->delete();
    }

    // Добавляем новые фотографии, если они переданы.
    if ($request->hasFile('photos')) {
        foreach ($request->file('photos') as $photo) {
            // dd($photo);
            $path = $photo->store('photos', 'public');
            $listing->photos()->create(['path' => $path]);
        }
    }

    return redirect()->route('listings.my')->with('success', 'Объявление обновлено.');
}



public function destroy(Ad $listing, Request $request)
{
    $user = $request->user();
    if ($user === null || $listing->user_id !== $user->id) {
        abort(403, 'Unauthorized');
    }

    $listing->delete();
    return redirect()->route('listings.my')->with('success', 'Объявление удалено.');
}


public function activate(Request $request, Ad $listing)
{
    if ($listing->user_id !== $request->user()->id) {
        abort(403, 'Unauthorized');
    }
    // Устанавливаем дату активации = сейчас
    $listing->update([
        'activation_date' => now(),
    ]);

    return redirect()->route('listings.my')->with('success', 'Объявление активировано.');
}

public function disactivate(Request $request, Ad $listing)
{
    if ($listing->user_id !== $request->user()->id) {
        abort(403, 'Unauthorized');
    }

    // "Выключаем" объявление, убирая дату активации
    $listing->update([
        'activation_date' => null,
    ]);

    return redirect()->route('listings.my')->with('success', 'Объявление деактивировано.');
}

}
