<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $table = 'cities';

    protected $fillable = [
        'name',
        'region_id',
        'type',
    ];

    // Связь: City -> belongsTo Region
    public function region()
    {
        return $this->belongsTo(Region::class);
    }
}
