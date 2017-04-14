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
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime
            ],
            [
                'id' => 2,
                'nombre' => 'Comisarias',
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime 
            ],
            [
                'id' => 3,
                'nombre' => 'Colegios',
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime
            ]
        );

        Services::insert($data);
    }
}
