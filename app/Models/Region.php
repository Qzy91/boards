<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    protected $table = 'regions';

    protected $fillable = [
        'name',
        // Если нужно хранить slug или дополнительные поля — добавьте их
    ];

    // Связь: Region -> many Cities
    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
