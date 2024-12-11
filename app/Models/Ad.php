<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{

    protected $fillable = ['name', 'description', 'category_id', 'user_id', 'price'];

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

}
