<?php

namespace App\Http\Controllers\Web\Services;

use Illuminate\Http\Request;
use Validator;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $services  = \App\Services::get();
        return response()->json(
            $services->toArray()
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
            'nombre' => 'required|unique:services'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([ 
                'errors'  => $validator->errors()->all()
            ]);
        }
        else{
            $services  = new \App\Services();
            $services->nombre = $request->nombre;   
            $services->save();
            return response()->json([
                'message'       =>'Registro Agregado correctamente',
                'id'   => $services->id
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
        $services  = \App\Services::find($id);
        return response()->json(
            $services
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
    public function update(Request $request, $id){
        $rules = array( 
            'nombre' => 'required|unique:services'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([ 
                'errors'  => $validator->errors()->all()
            ]);
        }
        else{
            $services  = \App\Services::find($id);
            $services->nombre = $request->nombre;   
            $services->save();
            return response()->json([
                'message'       =>'Registro Actualizado correctamente',
                'id'   => $services->id
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
    public function destroy($id){

        $services  = \App\Services::find($id);
        $services->delete();
        return response()->json([
            'message'       =>'Registro Eliminado correctamente',
            'id'   => $services->id
        ],200
        ); 
    }
}
