<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Locations extends Model
{
    protected $table = 'Locations';
    protected $fillable = ['nombre_empresa','nombre_temp','direccion','horario','telefono_1','telefono_2','correo','descripcion','lat','lng','foto','extract','id_serv'];
    public function scopeName($query, $name){
        if(trim($name) != ""){ 
            // dd('scope: '.$name);
            $query->where('nombre_temp','LIKE',"%$name%");       
    	}
    }
    // debe ser si o si de 2 a mas personas ??
    //porque crees que no seria bueno usar scrum si estoy solo en el proyecto?
    //como hago si yo solo trabajo 4 horas diarias el proyecto
    //Tengo que poner todos esos datos verdaderos o tengo que mentir
    
    //preguntas al profe
    //=======================
    //configuracion del sistema
    //informe de restrospectiva
    public function scopeType($query, $type){ 
        $types = [
        	1 => 'bancos',
        	2 => 'comisarias',
        	4 => 'bomberos',
        	5 => 'hospitales'
        ];
        // dd($type);
        if($type != "" && isset($types[$type])){
        	// dd($type);
        	$query->where('id_serv',$type);
        }
    }
    public function category(){
        return $this->belongsTo('App\Services');
    }
}
