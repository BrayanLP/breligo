@extends('layouts.user')

@section('page-title')
    INDEX
@endsection

@section('body-tag')
    ng-app="model"
@endsection

@section('content')
<div ng-controller="Ctrl"> 
    <!-- /.site-header -->
    <section class="site-content pb-0 pt-0 pl-0 pr-0"> 
        <div class="">
            <div id="mapa"  ng-class="{'mapa-90': mapa == 'full','mapa-60': mapa == 'detalle'}">
            </div>
            <div class="buttons" ng-class="{'right-auto': mapa == 'full','right-move': mapa == 'detalle'}">
                <ul>
                    <li>
                        <a href="#!" ng-click="location()" class="btn btn-secondary btn-ms mb-1 pl-2 pr-2 pt-1 pb-1 mr-3" title="Localizame" ng-if="disable_button == false" disabled><img width="20px" src="{{url()}}/assets/app/images/geo_me.svg"></a>
                        <a href="#!" class="btn btn-secondary btn-ms mb-1 pl-2 pr-2 pt-1 pb-1 mr-3" title="Localizame" ng-if="disable_button == true" disabled><img width="20px" src="{{url()}}/assets/app/images/position_actual.png"></a>
                    </li>
                    <li ng-repeat="serv in data_load_services">
                        <a href="#!" class="btn btn-secondary btn-ms mb-1 pl-2 pr-2 pt-1 pb-1 mr-1" ng-click="return_services(serv.id)" title="@{{serv.nombre}}" ><img width="20px" ng-src="@{{ serv.icon }}" ></a>
                    </li> 
                </ul>
            </div>
        </div>
        <div class="slide_sidebar"  ng-class="{'hide-sidebar': mapa == 'full','show-sidebar': mapa == 'detalle'}">
            <div class="cont-user">
                <a class="nav-link site-user dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img class="nav-img" src="{{url()}}/assets/app/images/user.png" alt=""> 
                    <span class="nav-text hidden-sm-down ml-2">Brayan</span> 
                    <i class="nav-caret hidden-sm-down zmdi zmdi-hc-sm zmdi-chevron-down"></i>
                </a>
            </div>
            <div class="cont-search">
                <input class="form-control navbar-search-field search_lp" type="search" placeholder="Buscar: Nombre" ng-model="search_text">
            </div>
            <div class="ubicaciones">
                <!-- <h4 class="text-ubicacion" ng-if="show_panel == true">Ubicaciones</h4>  -->
                <section class="detalle" ng-if="show_detalle == true">
                    <!-- @{{detalle}} -->
                    <a href="#!" ng-click="return()"><span class="zmdi  zmdi-hc-md zmdi-chevron-left pr-1"></span> Volver a los resultados</a>
                    <img width="100%" ng-src="@{{detalle.foto}}">
                    <div class="header_detalle ">
                        <div class="row">
                            <div class="col-sm-8 col-md-8 col-lg-8">
                                <h4 ng-bind="detalle.nombre_empresa"></h4>
                                <div class="ranking">
                                    <span class="fa fa-star"></span>
                                    <span class="fa fa-star"></span> 
                                    <span class="fa fa-star"></span>
                                    <span class="fa fa-star-half-empty"></span>
                                    <span class="fa fa-star-o"></span>
                                </div>
                            </div>
                            <div class="col-sm-4 col-md-4 col-lg-4">
                                <div class="text-center">
                                    <a href="#!" class="btn btn-rounded"><span class="fa fa-share-alt"></span></a>
                                    <span>Compartir</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="body_detalle">
                        <p ng-bind="detalle.descripcion" ng-if="detalle.descripcion != null && detalle.descripcion != ''"></p>
                        <div class="p-1 wizard" id=wizard-basic-demo>
                            <ul class="keep-prefix-suffix nav nav-tabs" role=tablist>
                                <li class="nav-item visited">
                                    <a class="nav-link active" data-toggle=tab href=#ex6-step-1 role=tab aria-expanded=true>Información</a>
                                </li>
                                <li class="nav-item visited">
                                    <a class=nav-link data-toggle=tab href=#ex6-step-2 role=tab aria-expanded=false>Deja un Comentario</a> 
                                </li>
                            </ul>
                            <div class=tab-content>
                                <div class="tab-pane active" id=ex6-step-1 role=tabpanel aria-expanded=true>
                                    <div class="">
                                        <ul>
                                            <li ng-if="detalle.direccion != null">
                                                <span class="fa fa-map-marker"></span>
                                                <p ng-bind="detalle.direccion"></p>

                                            </li>
                                            <li ng-if="detalle.horario != null">
                                                <span class="fa fa-clock-o"></span>
                                                <p ng-bind="detalle.horario"></p>

                                            </li>
                                            <li ng-if="detalle.telefono_1 != null">
                                                <span class="fa fa-phone"></span>
                                                <p ng-bind="detalle.telefono_1"></p>

                                            </li>
                                            <li ng-if="detalle.correo != null">
                                                <span class="fa fa-envelope-o"></span>
                                                <p ng-bind="detalle.correo"></p>

                                            </li> 
                                        </ul>
                                    </div>
                                </div>
                                <div class="tab-pane fade disabled" disabled id=ex6-step-2 role=tabpanel aria-expanded=false>
                                    <!-- <div class="form-group"><label for="exampleInputEmail1">Email address</label><input aria-describedby="emailHelp" class="form-control" id="exampleInputEmail1" placeholder="Enter email" type="email"> <small class="form-text text-muted" id="emailHelp">We'll never share your email with anyone else.</small></div> -->
                                </div>  
                            </div>
                        </div>
                    </div>

                </section>  
                <div id="directions_panel" style="float:right; overflow: auto; width:100%; height: 100%;"></div>
                <div class="col-lg-12 col-md-6 pl-0 pr-0" ng-repeat="d in data_load" ng-if="show_panel == true"> 
                    <div class="card p-1 pl-3 pr-3 bg-faded mb-2">
                        <a href="javascript:void(0)" ng-mouseover="markers_hover(d.lat,d.lng,d.foto,d.nombre_empresa,d.direccion)" ng-click="show_marker(d)">
                            <div class="media p-2"><img class="avatar avatar-md" ng-src="@{{d.foto}}" alt="">
                                <div class="media-body">
                                    <h6 ng-bind="d.nombre_empresa"></h6>
                                    <p class="mb-0 pb-0" ng-bind="d.direccion"></p>
                                </div>
                                <!-- /.media-body --> 
                            </div>
                        </a>
                        <!-- /.media -->
                    </div>
                    <!-- /.card -->
                </div>

            </div>
        </div>
        <div class="collapse navbar-collapse" id="site-navbar-collapse"> 
            <ul class="navbar-nav"> 
                <li class="nav-item dropdown">
                    <div class="dropdown-menu dropdown-menu-right p-0" data-plugin="dropdownCaret"><a class="dropdown-item dropdown-menu-cap">Daniel Alexander</a>
                        <a class="dropdown-item" href="#">
                            <svg class="svg-user-sm-icon mr-2">
                                <use xlink:href="{{url()}}/assets/app/images/sprite.svg#user-sm" />
                            </svg>
                            <span>My Profile</span>
                        </a> 
                        <a class="dropdown-item" href="#">
                            <svg class="svg-logout-icon mr-2">
                                <use xlink:href="{{url()}}/assets/app/images/sprite.svg#logout" />
                            </svg>
                            <span>Logout</span>
                        </a>
                    </div>
                </li>
            </ul> 
        </div> 
        <div class="row">  
            <!-- <div class="" ng-class="{'col-lg-12': mapa == 'full','col-lg-8': mapa == 'detalle'}">
            </div> -->
            <!-- <div class="col-lg-4 p-0 m-0">
                <div class="ubicaciones" ng-class="{'ubicaciones_hide': mapa == 'full','ubicaciones_show': mapa == 'detalle'}">
                    <h4 class="text-ubicacion" ng-if="show_panel == true">Ubicaciones</h4> 
                    
                    <section class="detalle" ng-if="show_detalle == true"> 
                        <a href="#!" ng-click="return()"><span class="zmdi  zmdi-hc-md zmdi-chevron-left pr-1"></span> Volver a los resultados</a>
                        <img width="100%" ng-src="@{{detalle.foto}}">
                        <div class="header_detalle ">
                            <div class="row">
                                <div class="col-sm-8 col-md-8 col-lg-8">
                                    <h4 ng-bind="detalle.nombre_empresa"></h4>
                                    <div class="ranking">
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star"></span> 
                                        <span class="fa fa-star"></span>
                                        <span class="fa fa-star-half-empty"></span>
                                        <span class="fa fa-star-o"></span>
                                    </div>
                                </div>
                                <div class="col-sm-4 col-md-4 col-lg-4">
                                    <div class="text-center">
                                        <a href="#!" class="btn btn-rounded"><span class="fa fa-share-alt"></span></a>
                                        <span>Compartir</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="body_detalle">
                            <p ng-bind="detalle.descripcion" ng-if="detalle.descripcion != null"></p>
                            <div class="p-1 wizard" id=wizard-basic-demo>
                                <ul class="keep-prefix-suffix nav nav-tabs" role=tablist>
                                    <li class="nav-item visited">
                                        <a class="nav-link active" data-toggle=tab href=#ex6-step-1 role=tab aria-expanded=true>Información</a>
                                    </li>
                                    <li class="nav-item visited">
                                        <a class=nav-link data-toggle=tab href=#ex6-step-2 role=tab aria-expanded=false>Deja un Comentario</a> 
                                    </li>
                                </ul>
                                <div class=tab-content>
                                    <div class="tab-pane active" id=ex6-step-1 role=tabpanel aria-expanded=true>
                                        <div class="">
                                            <ul>
                                                <li ng-if="detalle.direccion != null">
                                                    <span class="fa fa-map-marker"></span>
                                                    <p ng-bind="detalle.direccion"></p>
                                                    
                                                </li>
                                                <li ng-if="detalle.horario != null">
                                                    <span class="fa fa-clock-o"></span>
                                                    <p ng-bind="detalle.horario"></p>
                                                    
                                                </li>
                                                <li ng-if="detalle.telefono_1 != null">
                                                    <span class="fa fa-phone"></span>
                                                    <p ng-bind="detalle.telefono_1"></p>
                                                    
                                                </li>
                                                <li ng-if="detalle.correo != null">
                                                    <span class="fa fa-envelope-o"></span>
                                                    <p ng-bind="detalle.correo"></p>
                                                    
                                                </li> 
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade disabled" disabled id=ex6-step-2 role=tabpanel aria-expanded=false> 
                                    </div>  
                                </div>
                            </div>
                        </div>
                        
                    </section>
                    <div class="col-lg-12 col-md-6" ng-repeat="d in data_load" ng-if="show_panel == true"> 
                        <div class="card p-1 bg-faded mb-2">
                            <a href="javascript:void(0)" ng-mouseover="markers_hover(d.lat,d.lng,d.foto,d.nombre_empresa,d.direccion)" ng-click="show_marker(d)">
                                <div class="media p-2"><img class="avatar avatar-md" ng-src="@{{d.foto}}" alt="">
                                    <div class="media-body">
                                        <h6 ng-bind="d.nombre_empresa"></h6>
                                        <p class="mb-0 pb-0" ng-bind="d.direccion"></p>
                                    </div> 
                                </div>
                            </a> 
                        </div> 
                    </div>
                    
                </div>
            </div> --> 
        </div> 
         
    </section> 
        
    @include('web.services.modals.create')
    @include('web.services.modals.edit')
    @include('web.services.modals.see')
</div>
@endsection
@section('javascript')
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE&callback"></script>
<script src="{{ url() }}/assets/app/js/angular/Ubicaciones_Front.js"></script>
<!-- <script src="{{ url('') }}/assets/scripts/storeJs/Services/indexServices.js"></script> -->

<script type="text/javascript">
  // AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE  

</script> 
 
@endsection