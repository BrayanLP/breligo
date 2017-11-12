<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AmigosLocation extends Model
{
    public function scopeName($query,$name){
        // dd('scope: '.$name);
        if(trim($name) != ""){
        	$query->where('nombre','LIKE',"%$name%");
    	} 
    } 
}
