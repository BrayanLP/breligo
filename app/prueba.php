<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class prueba extends Model
{
    public function scopeName($query,$name){
        // dd('scope: '.$name);
        if(trim($name) != ""){
        	$query->where('nombre','LIKE',"%$name%");
    	} 
    }
    public function setPathAttribute($path){
    	$name = Carbon::now()->second.$path->getClientOriginalName();
    	$this->attributes['path'] = Carbon::now()->second.$path->getClientOriginalName();
    	\Storage::disk('local')->put($name,\File::get($path));
    }
}
