<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre_empresa',150); 
            $table->string('direccion',255);
            $table->string('horario',255);
            $table->string('telefono_1',50);
            $table->string('telefono_2',50);
            $table->string('correo',100); 
            $table->string('descripcion',255);
            $table->string('lat');
            $table->string('lng');
            $table->string('foto',300);  
            $table->string('extract',60);  
            $table->integer('id_services')->unsigned();
            $table->foreign('id_services')->references('id')->on('services')->onDelete('cascade'); 
            $table->timestamps();
            $table->rememberToken();
        });
    }
//marco teorico, atencendentes
//spectrum 
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('locations');
    }
}
