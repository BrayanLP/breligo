<?php

namespace App\Http\Controllers\Web\Locations;

use Illuminate\Http\Request;
use Validator;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class LocationsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){ 
        $locations  = \App\Locations::get();
        return response()->json(
            $locations->toArray()
        );  
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {    
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = array( 
            'nombre_empresa' => 'required|unique:locations',
            'descripcion' => 'required',
            'telefono_1' => 'required|AlphaDash|Max:9|Min:9',
            'telefono_2' => 'required|AlphaDash|Max:9|Min:9',
            'correo' => 'required|Email',
            'lat' => 'required',
            'lng' => 'required',
            'foto' => 'required',
            'direccion' => 'required',
            'nombre_direccion' => 'required|unique:locations',
            'extract' => 'required|Max:60',
            'visible' => 'Accepted',
            'status' => 'Accepted',
            'id_services' => 'required'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([ 
                'errors'  => $validator->errors()->all()
            ]);
        }
        else{
            $location  = new \App\Locations();
            $location->nombre_empresa = $request->nombre_empresa;
            $location->descripcion = $request->descripcion;
            $location->telefono_1 = $request->telefono_1;
            $location->telefono_2 = $request->telefono_2;
            $location->correo = $request->correo;
            $location->lat = $request->lat;
            $location->lng = $request->lng;
            $location->foto = $request->foto;   
            $location->direccion = $request->direccion;
            $location->nombre_direccion = $request->nombre_direccion;
            $location->extract = $request->extract;
            $location->visible = $request->visible;
            $location->status = $request->status;
            $location->id_services = $request->id_services;
            $location->created_at = $request->created_at;
            $location->updated_at = $request->updated_at; 


            $location->save();
            return response()->json([
                'message'       =>'Registro Agregado correctamente',
                'id'   => $location->id
            ],200
            );

        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $location  = \App\Locations::find($id);
        return response()->json(
            $location
        );
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $rules = array( 
            'nombre_empresa' => 'required|unique:locations',
            'descripcion' => 'required',
            'telefono_1' => 'required|AlphaDash|Max:9|Min:9',
            'telefono_2' => 'required|AlphaDash|Max:9|Min:9',
            'correo' => 'required|Email',
            'lat' => 'required',
            'lng' => 'required',
            'foto' => 'required',
            'direccion' => 'required',
            'nombre_direccion' => 'required|unique:locations',
            'extract' => 'required|Max:60',
            'visible' => 'Accepted',
            'status' => 'Accepted',
            'id_services' => 'required'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([ 
                'errors'  => $validator->errors()->all()
            ]);
        }
        else{
            $location  = \App\Locations::find($id);
            $location->nombre_empresa = $request->nombre_empresa;
            $location->descripcion = $request->descripcion;
            $location->telefono_1 = $request->telefono_1;
            $location->telefono_2 = $request->telefono_2;
            $location->correo = $request->correo;
            $location->lat = $request->lat;
            $location->lng = $request->lng;
            $location->foto = $request->foto;   
            $location->direccion = $request->direccion;
            $location->nombre_direccion = $request->nombre_direccion;
            $location->extract = $request->extract;
            $location->visible = $request->visible;
            $location->status = $request->status;
            $location->id_services = $request->id_services;
            $location->created_at = $request->created_at;
            $location->updated_at = $request->updated_at; 


            $location->save();
            return response()->json([
                'message'       =>'Registro Actualizado correctamente',
                'id'   => $location->id
            ],200
            );

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $location  = \App\Locations::find($id);
            $location->delete();
            return response()->json([
                'message'       =>'Registro Eliminado correctamente',
                'id'   => $location->id
            ],200
            ); 
        }
        catch (Exception $e) { 
          return response()->json([ 
                'errors'  => $e->errors()->all()
            ]);
        }
    }
}
