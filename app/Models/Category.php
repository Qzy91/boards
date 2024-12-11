<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'img'];

    public function ads()
    {
        return $this->hasMany(Ad::class);
    }

    public function getImgUrlAttribute()
{
    return $this->img ? asset('storage/' . $this->img) : null;
}
}
