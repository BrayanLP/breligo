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
            $table->text('descripcion');
            $table->integer('telefono_1');
            $table->integer('telefono_2');
            $table->string('correo',100); 
            $table->decimal('lat', 18, 14);
            $table->decimal('lng', 18, 14);
            $table->string('foto',300);
            $table->string('direccion',255);
            $table->string('nombre_direccion',150);  
            $table->string('extract',150); 
            $table->boolean('visible');
            $table->boolean('status');
            $table->integer('id_services')->unsigned();
            $table->foreign('id_services')->references('id')->on('services')->onDelete('cascade'); 
            $table->timestamps();
            $table->rememberToken();
        });
    }

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
