<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::get('/', function(){
	return view('welcome');
});
Route::get('/servicios', function(){
	return view('web.services.index');
});
Route::get('/ubicaciones', function(){
	return view('web.locations.index');
});
// Route::get('/', 'Web\Services\ServicesController@index');
// Route::get('/', 'Web\Locations\LocationsController@index');

// Authentication routes...
Route::get('auth/login', ['as' => 'auth/login','uses'=>'Auth\AuthController@getLogin']);
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', ['as' => 'auth/logout','uses'=>'Auth\AuthController@getLogout']);

// Registration routes...
Route::get('auth/register', ['as' => 'auth/register','uses'=>'Auth\AuthController@getRegister']);
Route::post('auth/register', 'Auth\AuthController@postRegister');

Route::group(['prefix' => 'api/v1/'], function () {
    Route::group(['prefix' => 'services'], function(){
	    Route::get('/','Web\Services\ServicesController@index');
	    Route::get('/{id}','Web\Services\ServicesController@show');
	    Route::post('/','Web\Services\ServicesController@store');
	    Route::post('/uploadFile','Web\Services\ServicesController@uploadFile');
	    Route::put('/{id}','Web\Services\ServicesController@update');
	    Route::delete('/{id}','Web\Services\ServicesController@destroy');
    }); 
    Route::group(['prefix' => 'locations'], function(){
	    Route::get('/','Web\Locations\LocationsController@index');
	    Route::get('/{id}','Web\Locations\LocationsController@show');
	    Route::post('/','Web\Locations\LocationsController@store');
	    Route::put('/{id}','Web\Locations\LocationsController@update');
	    Route::delete('/{id}','Web\Locations\LocationsController@destroy');
    }); 
});