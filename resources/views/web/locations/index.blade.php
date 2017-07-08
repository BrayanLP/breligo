@extends('layouts.web')

@section('page-title')
    INDEX
@endsection

@section('body-tag')
    ng-app="model"
@endsection

@section('content')
<div ng-controller="Ctrl">
    <header class="site-header">
        <!-- /.jumbotron -->
        <div class="breadcrumb">
            <ol class="breadcrumb-tree">
                <li class="breadcrumb-item">
                    <a href="{{url()}}">
                        <span class="zmdi zmdi-home mr-1"></span>
                        <span>Home</span>
                    </a>
                </li>
                <li class="breadcrumb-item active">
                    <a href="#">Ubicaciones</a>
                </li>
            </ol>
            <ul class="breadcrumb-btns">
                <li class="">
                    <a href="#" class="btn btn-secondary btn-sm">
                        <i class="zmdi zmdi-upload mr-1 text-success"></i>
                        <span>Carga Masiva</span></a>
                </li>
                <li class="">
                    <a data-toggle="modal" data-target="#create" href="#" class="btn btn-primary btn-sm">
                        <i class="zmdi zmdi-plus mr-1 text-success"></i>
                        <span>Agregar</span>
                    </a>
                </li> 
                <a href="#!" ng-click="cargar_agentes()">Crear Agentes</a>
            </ul>
        </div>
        <!-- /.breadcrumb -->
    </header>
    <!-- /.site-header -->
    <section class="site-content pb-2 pt-4"> 
        <h3 class="mb-0 pull-left">Mantenimiento Ubicaciones</h3> 
        <div id="navbar-search" class="navbar-search pull-right mb-3">
            <div class="form-inline navbar-search-form ">
                <input class="form-control navbar-search-field" type="search" placeholder="Buscar: Nombre" ng-model="search_text">
                <button type="submit" class="navbar-search-submit">
                    <svg class="svg-search-icon">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{url()}}/assets/app/images/sprite.svg#search"></use>
                    </svg>
                </button>
                <button class="navbar-search-close" data-toggle="navbar-search"><i class="zmdi zmdi-close"></i></button>
            </div>
            <select class="custom-select ml-2" ng-model="cant_rows">
                <option selected>Registros</option>
                <option value="10">10</option>
                <option value="40">40</option>
                <option value="80">80</option> 
                <option value="100">100</option>
            </select>
            <div class="navbar-search-backdrop" data-toggle="navbar-search"></div>
        </div>
        
        <!-- <p>Página donde veremos todos los Ubicaciones que ofrecemo </p> -->

        <table class="table table-centered table-hover table-striped table-bordered">
            <thead>
                <tr>
                    <th width="1%">#</th> 
                    <th width="3%">Tipo</th>
                    <th width="10%">Nombre</th>
                    <!-- <th width="10%">Dirección</th> -->
                    <th width="3%">Telefono</th>
                    <!-- <th width="10%">Correo</th>  -->
                    <th width="2%">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="d in data_load">
                    <th scope="row"> 
                        <span ng-bind="$index + 1"></span>
                    </th>
                    <td ng-if="d.id_services == 1"> 
                        <img width="20px" ng-src="//localhost:3000/assets/app/images/banco.svg" src="//localhost:3000/assets/app/images/banco.svg">
                    </td>
                    <td ng-if="d.id_services == 4"> 
                        <img width="20px" ng-src="//localhost:3000/assets/app/images/bomberos.svg" src="//localhost:3000/assets/app/images/bomberos.svg">
                    </td>
                    <td>
                        <span ng-bind="d.nombre_empresa"></span>
                    </td>
                    <!-- <td>
                        <span ng-bind="d.direccion"></span>
                    </td> -->
                    <td>
                        <span ng-bind="d.telefono_1"></span>
                    </td>
                    <!-- <td>
                        <span ng-bind="d.correo"></span>
                    </td>  -->
                    <td>
                        <a href="#!" class="btn-sm" ng-click="show(d.id)"  data-toggle="modal" data-target="#see">
                            <span class="fa fa-eye"></span>
                        </a> 
                        <a href="#!" class="btn-sm" ng-click="show(d.id)"  data-toggle="modal" data-target="#edit">
                            <span class="fa fa-edit"></span>
                        </a>
                        <a href="#!" class="btn-sm" ng-click="delete(d.id)">    
                            <span class="fa fa-trash"></span>
                        </a>
                    </td>
                </tr>
            </tbody>

        </table>  
        <nav>
            <span ng-bind="to"></span> de <span ng-bind="total"></span> registros
            <ul class="pagination pull-right">
                <li class="page-item" ng-class="{'disabled': prev_page_url == null}" ng-disabled="prev_page_url != null">
                    <a class="page-link" href="#" aria-label="Previous" ng-click="load(search_text,cant_rows,prev_page_url)">
                        <span aria-hidden="true"> Anterior</span>
                    </a>
                </li> 
                <li class="page-item active"><a class="page-link" href="#" ng-bind="current_page"></a></li> 
                <li class="page-item" ng-class="{'disabled': next_page_url == null}" ng-disabled="next_page_url != null">
                    <a class="page-link" href="#" aria-label="Next" ng-click="load(search_text,cant_rows,next_page_url)">
                        <span aria-hidden="true">Siguiente </span>
                    </a>
                </li>
            </ul>
        </nav>
    </section> 
        
    @include('web.locations.modals.create')
    @include('web.locations.modals.edit')
    @include('web.locations.modals.see')
</div>
@endsection
@section('javascript')
<script src="{{ url() }}/assets/app/js/admin/angular-uuid.js"></script>
<script src="{{ url() }}/assets/app/js/angular/Ubicaciones.js"></script>
<!-- <script src="{{ url('') }}/assets/scripts/storeJs/Services/indexServices.js"></script> -->
 
@endsection