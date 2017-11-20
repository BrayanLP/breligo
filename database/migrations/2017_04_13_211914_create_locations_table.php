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
            $table->string('id_img');
            $table->integer('id_serv')->unsigned();
            $table->string('nomb',150);
            // $table->string('nombre_temp',150); 
            $table->string('direc',255);
            $table->string('tel_1',10)->nullable();
            $table->string('hor',255)->nullable();
            $table->string('tel_2',10)->nullable();
            $table->string('cor',100)->nullable();
            $table->string('url',100)->nullable(); 
            $table->string('desc',255)->nullable();
            $table->string('lat')->nullable();
            $table->string('lng')->nullable();
            $table->string('foto',300)->nullable();

            $table->string('abrev',10)->nullable();
            $table->string('cod',10)->nullable();
            $table->string('f_funda',20)->nullable();
            $table->string('dr',50)->nullable();
            $table->string('codidenest',10)->nullable();
            $table->string('ubig',10)->nullable();
            $table->string('cargo',20)->nullable();

            // $table->string('ext',60)->nullable(); 
            $table->foreign('id_serv')->references('id')->on('services')->onDelete('cascade'); 
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
