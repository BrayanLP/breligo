<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Services;

class ServicesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = array(
            [
                'id' => 1,
                'nombre' => 'Bancos',
                'icon' => '//localhost:3000/assets/app/images/banco.svg',
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime
            ],
            [
                'id' => 2,
                'nombre' => 'Comisarias',
                'icon' => '//localhost:3000/assets/app/images/comisaria.svg',
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime 
            ],
            [
                'id' => 3,
                'nombre' => 'Hospitales',
                'icon' => '//localhost:3000/assets/app/images/hospital.svg',
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime
            ],
            [
                'id' => 4,
                'nombre' => 'Bomberos',
                'icon' => '//localhost:3000/assets/app/images/bomberos.svg',
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime
            ]
        );

        Services::insert($data);
    }
}
