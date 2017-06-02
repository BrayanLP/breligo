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
        <div class="breadcrumb">
            <ol class="breadcrumb-tree">
                <li class="breadcrumb-item">
                    <a href="javascript:void(0);">
                        <span class="zmdi zmdi-home mr-1"></span>
                        <span>Home</span>
                    </a>
                </li>
                <li class="breadcrumb-item active">
                    <a href="javascript:void(0);">Servicios</a>
                </li>
            </ol>
            <ul class="breadcrumb-btns">
                <li class="">
                    <a href="#" class="btn btn-secondary btn-sm">
                        <i class="zmdi zmdi-upload mr-1 text-success"></i>
                        <span>Carga Masiva</span></a>
                </li>
                <li class="">
                    <a ng-click="clear_input()" href="javascript:void(0);" data-toggle="modal" data-target="#create" class="btn btn-primary btn-sm">
                        <i class="zmdi zmdi-plus mr-1 text-success"></i>
                        <span>Agregar</span>
                    </a>
                </li>
            </ul>
        </div> 
    </header> 
    <section class="site-content pb-2 pt-4"> 
        <h3 class="mb-0 pull-left">Mantenimiento Entidades</h3> 
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
        
        <!-- <p>Página donde veremos todos los servicios que ofrecemo </p> -->

        <table class="table table-centered table-hover table-striped table-bordered">
            <thead>
                <tr>
                    <th width="5%">#</th> 
                    <th width="30%">Nombre</th>
                    <th width="5%">Icono</th>  
                    <th width="10%">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr ng-repeat="d in data_load">
                    <th scope="row"> 
                        <span ng-bind="$index + 1"></span>
                    </th>
                    <td>
                        <span ng-bind="d.nombre"></span>
                    </td>
                    <td>
                        <img width="20px" ng-src="@{{d.icon}}">
                    </td> 
                    <td>
                        <a href="javascript:void(0);" class="btn-sm" ng-click="show(d.id)"  data-toggle="modal" data-target="#see">
                            <span class="fa fa-eye"></span>
                        </a> 
                        <a href="javascript:void(0);" class="btn-sm" ng-click="show(d.id)"  data-toggle="modal" data-target="#edit">
                            <span class="fa fa-edit"></span>
                        </a>
                        <a href="javascript:void(0);" class="btn-sm" ng-click="delete(d.id)">    
                            <span class="fa fa-trash"></span>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>  
        <div class="data" ng-if="data_load.length <= 0" ng-init="mensaje = 'No existen coincedencias con la busqueda: '">
            <b><span ng-bind="mensaje"></span> <span ng-bind="search_text"></span></b>
        </div>
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

    @include('web.services.modals.create')
    @include('web.services.modals.edit')
    @include('web.services.modals.see')
        
</div>
@endsection
@section('javascript')
<script src="{{ url() }}/assets/app/js/angular/Servicios.js"></script>
<!-- <script src="{{ url('') }}/assets/scripts/storeJs/Services/indexServices.js"></script> -->
<script type="text/javascript">
    angular.module("model").constant("CSRF_TOKEN", '{!! csrf_token() !!}');
</script> 
 
@endsection