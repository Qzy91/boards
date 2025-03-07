<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionsTableSeeder extends Seeder
{
    public function run()
    {
        $regions = [
            ['name' => 'Hlavní město Praha'],
            ['name' => 'Středočeský kraj'],
            ['name' => 'Jihočeský kraj'],
            ['name' => 'Plzeňský kraj'],
            ['name' => 'Karlovarský kraj'],
            ['name' => 'Ústecký kraj'],
            ['name' => 'Liberecký kraj'],
            ['name' => 'Královéhradecký kraj'],
            ['name' => 'Pardubický kraj'],
            ['name' => 'Kraj Vysočina'],
            ['name' => 'Jihomoravský kraj'],
            ['name' => 'Olomoucký kraj'],
            ['name' => 'Zlínský kraj'],
            ['name' => 'Moravskoslezský kraj'],
        ];

        DB::table('regions')->insert($regions);
    }
}
