<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'description' => $this->description,
        'category' => $this->category->name ?? null,
        'price' => $this->price,
        'photos' => $this->photos->map(fn ($photo) => [
            'id' => $photo->id,
            'path' => $photo->path,
        ]),
        'user' => [
            'id' => $this->user->id,
            'name' => $this->user->name,
            'email' => $this->user->email,
            'city' => $this->user->city ?? 'Не указано',
            'phone' => $this->user->phone ?? 'Не указано',
        ],
    ];
}
}
