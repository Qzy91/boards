<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
    return [
        'name'        => 'required|string|max:255',
        'description' => 'required',
        'category'    => 'required|exists:categories,id',
        'price'       => 'required|numeric|min:0|max:999999999',
        'price' => 'required|numeric|min:0',
        'city_id' => 'nullable|exists:cities,id',
        'existing_photos' => 'nullable|array',
        'existing_photos.*' => 'integer',
        'photos'           => 'array',
        'photos.*'         => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ];
}
}
