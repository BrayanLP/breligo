<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model; 
use Faker\Factory as Faker;
use App\Locations;

class LocationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        for ($i = 0; $i < 100; $i++) { 
            
            $data = array(
                [
                    'id' => $i+1,
                    'nombre_empresa' => $faker->unique()->company(),
                    'descripcion' => $faker->paragraph($nbSentences = 3),
                    'horario' => $faker->paragraph($nbSentences = 1),
                    'telefono_1' => 987675+$i,
                    'telefono_2' => 987674+$i,
                    'correo' => $faker->unique()->email(),
                    'lat' => -12.0552172+(0.0000010+$faker->seed(1234)),
                    'lng' => -77.0802424+(0.0000010+$faker->seed(1234)),
                    'foto' => '//localhost:3000/assets/app/images/img.jpeg',
                    'direccion' => $faker->unique()->address(), 
                    'extract' => $faker->paragraph($nbSentences = 1), 
                    'id_services' => 1,
                    'created_at'=> new DateTime,
                    'updated_at'=> new DateTime 
                ]
            );
        Locations::insert($data);
        }

    }
}
