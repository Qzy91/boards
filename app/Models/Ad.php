<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{

    protected $fillable = ['name', 'description', 'category_id', 'user_id', 'price', 'activation_date', 'city_id',];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function photos()
{
    return $this->hasMany(Photo::class);
}

public function category()
{
    return $this->belongsTo(Category::class);
}

public function city()
{
    return $this->belongsTo(City::class);
}

}
