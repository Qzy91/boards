<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitiesTableSeeder extends Seeder
{
    public function run()
    {
        // Сопоставляем названия регионов из RegionsTableSeeder
        $rPraha           = DB::table('regions')->where('name', 'Hlavní město Praha')->first();
        $rStredocesky     = DB::table('regions')->where('name', 'Středočeský kraj')->first();
        $rJihocesky       = DB::table('regions')->where('name', 'Jihočeský kraj')->first();
        $rPlzensky        = DB::table('regions')->where('name', 'Plzeňský kraj')->first();
        $rKarlovarsky     = DB::table('regions')->where('name', 'Karlovarský kraj')->first();
        $rUstecky         = DB::table('regions')->where('name', 'Ústecký kraj')->first();
        $rLiberecky       = DB::table('regions')->where('name', 'Liberecký kraj')->first();
        $rKralovehradecky = DB::table('regions')->where('name', 'Královéhradecký kraj')->first();
        $rPardubicky      = DB::table('regions')->where('name', 'Pardubický kraj')->first();
        $rVysocina        = DB::table('regions')->where('name', 'Kraj Vysočina')->first();
        $rJihomoravsky    = DB::table('regions')->where('name', 'Jihomoravský kraj')->first();
        $rOlomoucky       = DB::table('regions')->where('name', 'Olomoucký kraj')->first();
        $rZlinsky         = DB::table('regions')->where('name', 'Zlínský kraj')->first();
        $rMoravskoslezsky = DB::table('regions')->where('name', 'Moravskoslezský kraj')->first();

        // Список 100 населённых пунктов (преимущественно города), названия на чешском
        // Поле 'type' — "město". При необходимости указывайте другой тип.
        $cities = [
            // 1–10
            ['name' => 'Praha',               'region_id' => $rPraha->id,           'type' => 'město'],
            ['name' => 'Brno',                'region_id' => $rJihomoravsky->id,    'type' => 'město'],
            ['name' => 'Ostrava',             'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Plzeň',               'region_id' => $rPlzensky->id,        'type' => 'město'],
            ['name' => 'Liberec',            'region_id' => $rLiberecky->id,       'type' => 'město'],
            ['name' => 'Olomouc',            'region_id' => $rOlomoucky->id,       'type' => 'město'],
            ['name' => 'České Budějovice',   'region_id' => $rJihocesky->id,       'type' => 'město'],
            ['name' => 'Hradec Králové',     'region_id' => $rKralovehradecky->id, 'type' => 'město'],
            ['name' => 'Ústí nad Labem',     'region_id' => $rUstecky->id,         'type' => 'město'],
            ['name' => 'Pardubice',          'region_id' => $rPardubicky->id,      'type' => 'město'],

            // 11–20
            ['name' => 'Havířov',            'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Zlín',               'region_id' => $rZlinsky->id,         'type' => 'město'],
            ['name' => 'Kladno',             'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Most',               'region_id' => $rUstecky->id,         'type' => 'město'],
            ['name' => 'Karviná',            'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Opava',              'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Frýdek-Místek',      'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Karlovy Vary',       'region_id' => $rKarlovarsky->id,     'type' => 'město'],
            ['name' => 'Jihlava',            'region_id' => $rVysocina->id,        'type' => 'město'],
            ['name' => 'Teplice',            'region_id' => $rUstecky->id,         'type' => 'město'],

            // 21–30
            ['name' => 'Děčín',              'region_id' => $rUstecky->id,         'type' => 'město'],
            ['name' => 'Chomutov',           'region_id' => $rUstecky->id,         'type' => 'město'],
            ['name' => 'Jablonec nad Nisou', 'region_id' => $rLiberecky->id,       'type' => 'město'],
            ['name' => 'Mladá Boleslav',     'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Prostějov',          'region_id' => $rOlomoucky->id,       'type' => 'město'],
            ['name' => 'Třebíč',             'region_id' => $rVysocina->id,        'type' => 'město'],
            ['name' => 'Tábor',              'region_id' => $rJihocesky->id,       'type' => 'město'],
            ['name' => 'Znojmo',             'region_id' => $rJihomoravsky->id,    'type' => 'město'],
            ['name' => 'Přerov',             'region_id' => $rOlomoucky->id,       'type' => 'město'],
            ['name' => 'Příbram',            'region_id' => $rStredocesky->id,     'type' => 'město'],

            // 31–40
            ['name' => 'Cheb',               'region_id' => $rKarlovarsky->id,     'type' => 'město'],
            ['name' => 'Orlová',             'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Trutnov',            'region_id' => $rKralovehradecky->id, 'type' => 'město'],
            ['name' => 'Kolín',              'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Kralupy nad Vltavou','region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Rakovník',           'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Kutná Hora',         'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Litvínov',           'region_id' => $rUstecky->id,         'type' => 'město'],
            ['name' => 'Šumperk',            'region_id' => $rOlomoucky->id,       'type' => 'město'],
            ['name' => 'Uherské Hradiště',   'region_id' => $rZlinsky->id,         'type' => 'město'],

            // 41–50
            ['name' => 'Břeclav',            'region_id' => $rJihomoravsky->id,    'type' => 'město'],
            ['name' => 'Krnov',              'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Svitavy',            'region_id' => $rPardubicky->id,      'type' => 'město'],
            ['name' => 'Veselí nad Moravou', 'region_id' => $rJihomoravsky->id,    'type' => 'město'],
            ['name' => 'Boskovice',          'region_id' => $rJihomoravsky->id,    'type' => 'město'],
            ['name' => 'Blansko',            'region_id' => $rJihomoravsky->id,    'type' => 'město'],
            ['name' => 'Hodonín',            'region_id' => $rJihomoravsky->id,    'type' => 'město'],
            ['name' => 'Kroměříž',           'region_id' => $rZlinsky->id,         'type' => 'město'],
            ['name' => 'Vyškov',             'region_id' => $rJihomoravsky->id,    'type' => 'město'],
            ['name' => 'Nový Jičín',         'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],

            // 51–60
            ['name' => 'Vsetín',             'region_id' => $rZlinsky->id,         'type' => 'město'],
            ['name' => 'Litoměřice',         'region_id' => $rUstecky->id,         'type' => 'město'],
            ['name' => 'Louny',              'region_id' => $rUstecky->id,         'type' => 'město'],
            ['name' => 'Sokolov',            'region_id' => $rKarlovarsky->id,     'type' => 'město'],
            ['name' => 'Jindřichův Hradec',  'region_id' => $rJihocesky->id,       'type' => 'město'],
            ['name' => 'Písek',              'region_id' => $rJihocesky->id,       'type' => 'město'],
            ['name' => 'Strakonice',         'region_id' => $rJihocesky->id,       'type' => 'město'],
            ['name' => 'Rokycany',           'region_id' => $rPlzensky->id,        'type' => 'město'],
            ['name' => 'Klatovy',            'region_id' => $rPlzensky->id,        'type' => 'město'],
            ['name' => 'Domažlice',          'region_id' => $rPlzensky->id,        'type' => 'město'],

            // 61–70
            ['name' => 'Tachov',             'region_id' => $rPlzensky->id,        'type' => 'město'],
            ['name' => 'Beroun',             'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Brandýs nad Labem-Stará Boleslav','region_id' => $rStredocesky->id, 'type' => 'město'],
            ['name' => 'Čáslav',             'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Vlašim',             'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Benešov',            'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Říčany',             'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Nymburk',            'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Poděbrady',          'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Mnichovo Hradiště',  'region_id' => $rStredocesky->id,     'type' => 'město'],

            // 71–80
            ['name' => 'Havlíčkův Brod',     'region_id' => $rVysocina->id,        'type' => 'město'],
            ['name' => 'Pelhřimov',          'region_id' => $rVysocina->id,        'type' => 'město'],
            ['name' => 'Žďár nad Sázavou',   'region_id' => $rVysocina->id,        'type' => 'město'],
            ['name' => 'Žatec',              'region_id' => $rUstecky->id,         'type' => 'město'],
            ['name' => 'Bohumín',            'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Česká Lípa',         'region_id' => $rLiberecky->id,       'type' => 'město'],
            ['name' => 'Kopřivnice',         'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Hranice',            'region_id' => $rOlomoucky->id,       'type' => 'město'],
            ['name' => 'Mělník',             'region_id' => $rStredocesky->id,     'type' => 'město'],
            ['name' => 'Klášterec nad Ohří', 'region_id' => $rUstecky->id,         'type' => 'město'],

            // 81–90
            ['name' => 'Kadaň',              'region_id' => $rUstecky->id,         'type' => 'město'],
            ['name' => 'Český Těšín',        'region_id' => $rMoravskoslezsky->id, 'type' => 'město'],
            ['name' => 'Náchod',             'region_id' => $rKralovehradecky->id, 'type' => 'město'],
            ['name' => 'Jičín',              'region_id' => $rKralovehradecky->id, 'type' => 'město'],
            ['name' => 'Vrchlabí',           'region_id' => $rKralovehradecky->id, 'type' => 'město'],
            ['name' => 'Rychnov nad Kněžnou','region_id' => $rKralovehradecky->id, 'type' => 'město'],
            ['name' => 'Chrudim',            'region_id' => $rPardubicky->id,      'type' => 'město'],
            ['name' => 'Moravská Třebová',   'region_id' => $rPardubicky->id,      'type' => 'město'],
            ['name' => 'Polička',            'region_id' => $rPardubicky->id,      'type' => 'město'],
            ['name' => 'Vysoké Mýto',        'region_id' => $rPardubicky->id,      'type' => 'město'],

            // 91–100
            ['name' => 'Ústí nad Orlicí',    'region_id' => $rPardubicky->id,      'type' => 'město'],
            ['name' => 'Žamberk',            'region_id' => $rPardubicky->id,      'type' => 'město'],
            ['name' => 'Holešov',           'region_id' => $rZlinsky->id,         'type' => 'město'],
            ['name' => 'Uherský Brod',       'region_id' => $rZlinsky->id,         'type' => 'město'],
            ['name' => 'Koryčany',           'region_id' => $rZlinsky->id,         'type' => 'město'],
            ['name' => 'Vizovice',           'region_id' => $rZlinsky->id,         'type' => 'město'],
            ['name' => 'Jeseník',            'region_id' => $rOlomoucky->id,       'type' => 'město'],
        ];

        DB::table('cities')->insert($cities);
    }
}
