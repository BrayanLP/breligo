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
            // $table->char('id', 36)->unique();
            $table->string('id_image');
            $table->integer('id_services')->unsigned();
            $table->string('nombre_empresa',150);
            $table->string('nombre_temp',150); 
            $table->string('direccion',255);
            $table->string('telefono_1',50);
            $table->string('horario',255)->nullable();
            $table->string('telefono_2',50)->nullable();
            $table->string('correo',100)->nullable();
            $table->string('url',100)->nullable(); 
            $table->string('descripcion',255)->nullable();
            $table->string('lat')->nullable();
            $table->string('lng')->nullable();
            $table->string('foto',300)->nullable();
            $table->string('extract',60)->nullable(); 
            $table->foreign('id_services')->references('id')->on('services')->onDelete('cascade'); 
            $table->timestamps();
            $table->rememberToken();
            // $table->primary('id');
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
