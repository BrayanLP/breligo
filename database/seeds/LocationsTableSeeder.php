<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model; 
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
        $data = array(
            [
                'id' => 1,
                'nombre_empresa' => 'BCP Elio',
                'descripcion' => 'lorem ',
                'telefono_1' => 98676246,
                'telefono_2' => 90987788,
                'correo' => 'brayanlp@g.com',
                'lat' => -12.0548137,
                'lng' => -77.0715767,
                'foto' => 'https://lh3.googleusercontent.com/proxy/5990VOipyECLF2nnQy9pooaAPDrjGXfyi8s8JvSEaxiVR6iOzGay0OK4MKn2NgFWTn9qK1jhxREVRlkkP3jPikkHUyAwNO62Q5Db-8XVRpMvI2m8Kgf5CKGcj5A6LEVko9HjAXGIyh50OwwtzT51zl2SFw=w408-h229-k-no',
                'direccion' => 'Roberto Thorndike Galup 1408, Distrito de Lima 15081',
                'nombre_direccion' => 'BCP Elio',
                'extract' => 'lorem',
                'visible' => true,
                'status' => true,
                'id_services' => 1,
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime 
            ],
            [
                'id' => 2,
                'nombre_empresa' => 'Universidad Nacional Mayor de San Marcos',
                'descripcion' => 'lorem',
                'telefono_1' => 999999999,
                'telefono_2' => 888888888,
                'correo' => 'san@g.com',
                'lat' => -12.0568231,
                'lng' => -77.08709,
                'foto' => 'https://lh4.googleusercontent.com/proxy/btioFLJLSJDD9DV7IUiKjwemL3Zz6FjvLu2X7VuS4GQQmXOMdHMLbC6zhIwd6zO9bUW4g3QI_8tPBOBJQi27dyA64Sl4HW-mUkZ38z78jXphvjTDJnbP_MOKIYDYSWIfJbpsWW3JsqdhS1fhYpc-xBfiPCg9dQ=w408-h408-k-no',
                'direccion' => 'Distrito de Lima 15081',
                'nombre_direccion' => 'Universidad Nacional Mayor de San Marcos',
                'extract' => 'lorem',
                'visible' => true,
                'status' => true,
                'id_services' => 2,
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime 
            ],
            [
                'id' => 3,
                'nombre_empresa' => 'Comisaría de Palomino',
                'descripcion' => 'loren',
                'telefono_1' => 5641290,
                'telefono_2' => 999999999,
                'correo' => 'comisaria@gmail.com',
                'lat' => -12.0567386,
                'lng' => -77.08709,
                'foto' => 'https://lh3.googleusercontent.com/-PqFgsp_EgEY/WM7No0GahrI/AAAAAAAADwQ/2VKUzPAeER8Z02gtITmIQmYl7z84jnuygCLIB/w408-h229-k-no/',
                'direccion' => 'Jr. Santa Agustina Cdr. 7, Distrito de Lima 15088',
                'nombre_direccion' => 'Comisaría de Palomino',
                'extract' => 'lorem',
                'visible' => true,
                'status' => true,
                'id_services' => 3,
                'created_at'=> new DateTime,
                'updated_at'=> new DateTime 
            ] 
        );

        Locations::insert($data);
    }
}
