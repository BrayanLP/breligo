<?php

namespace App\Http\Controllers\Web\Services;

use Illuminate\Http\Request;
use Validator;
use Input; 

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
// use App\Services;
class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(){   
        $search     = \Request::get('nombre'); 
        $per_page   = \Request::get('per_page') ?: 100; 
        $services   = \App\Services::name($search)
        ->orderBy('id','DESC')
        ->paginate($per_page);
        $services->setPath('');  
     
        // $services  = \App\Services::paginate(10,['*'],'pag'); 
        
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
            'nombre' => 'required|unique:services',
            'icon' => 'required'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json([ 
                'message'  => $validator->errors()->all(),
                'status' => 202
            ]);
        }
        else{
            $services  = new \App\Services(); 
            $services->nombre = $request->nombre; 
            $nombre_serv = $request->nombre;
            $file = $request->file('icon');
            $nombre_file = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            Storage::disk('local')->put($nombre_serv.'_'.$nombre_file,  File::get($file)); 

            $icono = '/images/'.$nombre_serv.'_'.$nombre_file;
            $services->icon = $icono;            
            $services->save();
            return response()->json([
                'message'       =>'Registro Agregado correctamente',
                'id'   => $services->id,
                'status'=> 200
            ],200
            );

        }
    }

    public function uploadFile(Request $request)
    {
        $file = $request->file('icon');
        $nombre_file = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        Storage::disk('local')->put($nombre_serv.'_'.$nombre_file,  File::get($file)); 
        return response()->json([
            'message' => 'Archivo Almacenado correctamente'
        ]);
        // $icono = '/images/'.$nombre_serv.'_'.$nombre_file;   
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
                'errors'  => $validator->errors()->all(),
                'status' => 202
            ]);
        }
        else{
            $services  = \App\Services::find($id);
            $services->nombre = $request->nombre;   
            // $nombre_serv = $request->nombre_edit;
            // $file = $request->file('icon_edit');
            // if($file !== null){
            //     $nombre_file = $file->getClientOriginalName();
            //     $extension = $file->getClientOriginalExtension();
            //     Storage::disk('local')->put($nombre_serv.'_'.$nombre_file,  File::get($file)); 
            //     $icono = '/images/'.$nombre_serv.'_'.$nombre_file;
            //     $services->icon = $icono;
            // }
            // else{
            //     $services->icon = $request->$icono;   
            // }

            $services->save();
            return response()->json([
                'message'       =>'Registro Actualizado correctamente',
                'id'   => $services->id,
                'status'=> 200
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
            'id'   => $services->id,
            'status'   => 200
        ],200
        ); 
    }

    
}
