@extends('layouts.user')

@section('page-title')
    INDEX
@endsection

@section('body-tag')
    ng-app="model"
@endsection
    <style>
     
    </style>
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
                        <a href="javascript:void(0);" ng-click="location()" class="btn btn-secondary btn-ms mb-1 pl-2 pr-2 pt-1 pb-1 mr-3" title="Localizame" ng-if="disable_button == false" disabled><img width="40px" src="{{url()}}/assets/app/images/position_actual.svg"></a>
                        <a href="javascript:void(0);" class="btn btn-secondary btn-ms mb-1 pl-2 pr-2 pt-1 pb-1 mr-3" title="Localizame" ng-if="disable_button == true" disabled><img width="40px" src="{{url()}}/assets/app/images/position_actual_color.svg"></a>
                    </li>
                    <!-- <li>
                        
                        <a href="#!" class="btn btn-secondary btn-ms mb-1 pl-2 pr-2 pt-1 pb-1 mr-3" ng-click="showPolice(1)">
                            H
                        </a>
                    </li> -->
                    <!-- <a href="" class="btn" for="1" ng-click="toggle_Marker(1)"> Hospitales</a> -->
                    <li ng-repeat="serv in data_load_services">
                        <a href="#!" class="btn btn-secondary btn-ms mb-1 pl-2 pr-2 pt-1 pb-1 mr-1" ng-click="toggle_Marker(serv.id)" title="@{{serv.nombre}}" >
                            <img ng-show="icon_@{{serv.id}}" width="40px" ng-src="@{{ serv.icon }}" >
                            <img ng-hide="icon_@{{serv.id}}" width="40px" ng-src="@{{ icon1 }}" >
                        </a>  
                        <input class="hidden" type="checkbox" id="@{{serv.id}}" ng-click="toggle_Marker(serv.id)" checked>
                    
                    </li> 
                    <!-- <div class="ui-block-a">
                        <label for="1">Hospital</label>
                            <input type="checkbox" id="3" ng-click="toggleGroup(2)" checked>
                        <label for="5">Banco</label>
                            <input type="checkbox" id="5" ng-click="toggleGroup(1)" checked>
                    </div> -->
                </ul>
            </div>
        </div>
        <div class="cont-direc" ng-class="{'hide-sidebar': mapa == 'full','show-sidebar': mapa == 'detalle'}">
            @if (Auth::guest())
                <!-- <li><a href="{{route('auth/login')}}">Login</a></li>
                <li><a href="{{route('auth/register')}}">Register</a></li> -->
            @else 
                <!-- <li><a href="{{route('auth/logout')}}">Logout</a></li> 
                <div class="cont-user">
                    <a class="nav-link site-user dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img class="nav-img" src="{{url()}}/assets/app/images/user.png" alt=""> 
                        <span class="nav-text hidden-sm-down ml-2">{{ Auth::user()->name }}</span> 
                        <i class="nav-caret hidden-sm-down zmdi zmdi-hc-sm zmdi-chevron-down"></i>
                    </a>
                </div> -->
            @endif
            <div class="cont-search">
                <!-- <div class="cont-info" ng-show="header_search"> -->
                    <!-- <div class="row"> -->
                        <!-- <div class="col-lg-12 p0"> -->
                            <input id="autocomplete_search" class="form-control navbar-search-field search_lp" type="hidden" />
                            <!-- <input class="form-control navbar-search-field search_lp" type="text" placeholder="Buscar en Encuentralo Ya" ng-model="search_entidad" ng-change="initMap()"> -->
                        <!-- </div> -->
                        <!-- <div class="col-lg-4 p0">
                            <a href="" class="line-horizontal"><span class="fa fa-search"></span></a>
                            <a href=""><span class="fa fa-close"></span></a>
                        </div>  -->
                    <!-- </div>  -->
                    <ul class="lista_resultados" >
                        <!-- <li>
                            <a href="#!" ng-if="search_entidad.length > 0 && data_load.length > 0" ng-hide="boton_search_global == false" ng-click="search_global(search_entidad)">
                                <i class="fa  fa-search"></i> <span  ng-bind-template="ver todo las: @{{search_entidad}} "></span>  
                            </a>
                        </li>
                        <li ng-repeat="d in data_load" ng-if="search_entidad.length > 0" ng-hide="hide_search">
                            <a href="javascript:void(0);" ng-click="show_marker(d)">
                                <i class="fa fa-map-marker"></i><span ng-bind="d.nombre_empresa"></span>
                            </a>
                        </li> -->
                        <li ng-if="return_list == true">
                            <a href="javascript:void(0);" ng-click="return()"><span class="fa fa-chevron-left"></span> Volver a los resultados</a>
                        </li>
                    </ul>
                <!-- </div> -->
                <div class="cont-header-search" ng-hide="header_search">
                    <div class="row indicador">

                        <div class="col-lg-10">
                            <ul> 
                                <li>
                                    <span class="fa fa-level-down"></span>
                                </li>
                                <li>
                                    <span class="fa fa-car"></span>
                                </li>
                                <li>
                                    <span class="fa fa-train"></span>
                                </li>
                                <li>
                                    <span class="fa fa-male"></span>
                                </li>
                                <li>
                                    <span class="fa fa-bicycle"></span>
                                </li>
                                <li>
                                    <span class="fa fa-plane"></span>
                                </li> 
                            </ul>
                        </div>
                        <div class="col-lg-2">
                            <a href="javascript:void(0)" ng-click="close_indicacion()"><span class="fa fa-close "></span></a>
                        </div>
                        <div class="col-lg-2">
                            <!-- <a href=""><span class="fa fa-level-down fa-rotate-270"></span></a> -->
                        </div>
                        <div class="col-lg-8">
                            <input class="form-control" type="text" id="input_start" ng-model="text_start" ng-change="indicaciones()">
                            <input class="form-control" type="text" ng-model="text_end" ng-change="indicaciones()">
                        </div> 
                        <div class="col-lg-2">
                            <!-- <a href="javascript:void(0)" ng-click="location()"><span class="fa fa-location-arrow"></span></a> -->
                        </div>
                    </div>
                </div>
                <!-- <input class="form-control navbar-search-field search_lp" type="search" placeholder="Elegir Destino" ng-model="search_destino"> -->
            </div>
        </div>
        <div class="slide_sidebar"  ng-class="{'hide-sidebar': mapa == 'full','show-sidebar': mapa == 'detalle'}">
            <!-- <div class="cont-user">
                <a class="nav-link site-user dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img class="nav-img" src="{{url()}}/assets/app/images/user.png" alt=""> 
                    <span class="nav-text hidden-sm-down ml-2">Brayan</span> 
                    <i class="nav-caret hidden-sm-down zmdi zmdi-hc-sm zmdi-chevron-down"></i>
                </a>
            </div>
            <div class="cont-search">
                <input class="form-control navbar-search-field search_lp" type="search" placeholder="Buscar: Entidad" ng-model="search_entidad">
                <input class="form-control navbar-search-field search_lp" type="search" placeholder="Elegir Destino" ng-model="search_destino">
            </div> -->
             
            <div class="ubicaciones" id="ubicaciones">
                <!-- <h4 class="text-ubicacion" ng-if="show_panel == true">Ubicaciones</h4>  -->
                <section class="detalle" ng-if="show_detalle == true">
                    <!-- @{{detalle}} -->
                    <!-- <ul class="lista_resultados" > 
                        <li ng-show="header_search">
                            <a href="#!" ng-click="return()">Volver a los resultados</a>
                        </li>
                    </ul> -->
                    <div class="cont-img">
                        <img width="100%" ng-src="@{{detalle.foto}}">
                    </div>
                    <div class="header_detalle ">
                        <div class="row">
                            <div class="col-sm-8 col-md-8 col-lg-8">
                                <h4 ng-bind="detalle.title"></h4>
                                <div class="ranking">
                                    <span ng-bind="@{{detalle.number_r}}"></span>
                                    <span ng-bind-html="detalle.raking"></span>
                                </div>
                            </div>
                            <div class="col-sm-4 col-md-4 col-lg-4 p0">
                                <div class="text-center">
                                    <a href="javascript:void(0);" ng-click="como_llegar(detalle.position.lat(), detalle.position.lng())" class="btn btn-rounded"><span class="fa fa-share-alt"></span></a>
                                    <span>Cómo llegar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="body_detalle">
                        <h2>
                            Información:
                        </h2>
                        <p ng-bind="detalle.descripcion" ng-if="detalle.descripcion != null && detalle.descripcion != ''"></p>
                        <ul> 
                            <li ng-if="detalle.direccion != undefined &&  detalle.direccion != ''">
                                <span class="fa fa-map-marker"></span>
                                <p ng-bind="detalle.direccion"></p>

                            </li>
                            <li ng-if="detalle.telefono != undefined &&  detalle.telefono != ''">
                                <span class="fa fa-phone"></span>
                                <p ng-bind="detalle.telefono"></p>

                            </li>
                            <li ng-if="detalle.horario != undefined &&  detalle.horario != ''">
                                <span class="fa fa-clock-o"></span>
                                <p ng-bind="detalle.horario"></p>

                            </li>
                            <li ng-if="detalle.correo != undefined &&  detalle.correo != ''">
                                <span class="fa fa-envelope-o"></span>
                                <p ng-bind="detalle.correo"></p>

                            </li> 
                            <li ng-if="detalle.url != undefined &&  detalle.url != ''">
                                <span class="fa fa-globe"></span>
                                <p ng-bind="detalle.url"></p>

                            </li> 
                        </ul>
                        <section id="comentarios">
                        <!-- 111 --> 
                            <!-- @{{detalle.comentarios}} -->
                            <h2>
                                Comentarios:
                            </h2>
                            <div class="row">
                                <div class="col-lg-12 col-md-6" ng-repeat="d in detalle.comentarios" id="@{{d.id}}-@{{d.id_services}}">  
                                    <div class="card p-1 pl-3 pr-3 bg-faded mb-2 cont-ubicacion">
                                        <a  href="@{{d.author_url}}" target="_blank">
                                            <div class="media p-2">
                                                <img class="avatar avatar-md" ng-src="@{{d.profile_photo_url}}" alt="">
                                                <div class="media-body">
                                                    <h6 ng-bind="d.author_name"></h6>
                                                    <p class="mb-0 pb-0">
                                                        <span ng-bind-html="d.raking "></span>
                                                        <span ng-bind-html="d.relative_time_description"></span>
                                                    </p> 
                                                   <div ng-init="limitText=100">
                                                       <p>@{{ d.text | limitTo: limitText }} 
                                                           <a href="javascript:void(0)" 
                                                               ng-hide="d.text.length < limitText" 
                                                               ng-click="limitText = d.text.length + 1" class="btn-flat-more" > ver más..
                                                           </a>
                                                       </p>
                                                    </div>
                                                    <hr>
                                                </div> 
                                            </div>
                                        </a> 
                                    </div>
                                </div>
                            </div>
                        </section>

                         
                    </div>

                </section>  
                <div id="directions_panel" ng-show="indicacion_detalle">
                    <div class="row">
                        <div class="col-lg-2">
                            <span class="fa fa-car"></span>
                        </div>
                        <div class="col-lg-8">
                            <h4>Por @{{ruta_general}}</h4>
                            <h5>La ruta más rápida, el tráfico habitual</h5>
                            <a href="javascript:void(0);" ng-click="show_detalle_indicaciones()">Detalles</a>
                        </div>
                        <div class="col-lg-2">
                            <h4>@{{duracion}}</h4>
                            <h5>@{{distancia}}</h5>        
                        </div> 
                        <section id="detalle_distancia" ng-show="detalle_distancia">
                            <div class="row">
                                <div class="col-lg-2">
                                    <a href="javascript:void(0);" ng-click="return_indicaciones()">
                                        <span class="fa fa fa-arrow-left"></span>
                                    </a>
                                </div>

                                <div class="col-lg-10">
                                    <h6><b>Desde</b> @{{text_start}}</h6>
                                    <h6><b>Hasta</b> @{{text_end}}</h6>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <h3>@{{duracion}}(@{{distancia}})</h3>
                                    <h4>Por @{{ruta_general}}</h4>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <h6>@{{text_start}}</h6> 
                                </div>
                            </div>
                            <div ng-repeat="deta in ruta_detalle">
                                <div class="row">
                                    <div class="col-lg-9">
                                        <h4 ng-bind-html="deta.instructions"></h4>
                                    </div>
                                    <div class="col-lg-3">
                                        @{{deta.distance.text}}<br>
                                        @{{deta.duration.text}}
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <h6>@{{text_end}}</h6> 
                                </div> 
                            </div> 
                            

                        </section>
                    </div> 
                    
                </div>
                 <!-- <code id="array"></code> -->
                <div class="col-lg-12 col-md-6 listado" ng-repeat="d in data_load" ng-if="show_panel == true" id="@{{d.id}}-@{{d.id_services}}"> 
                    <div class="card  bg-faded  cont-ubicacion">
                        <a href="javascript:void(0)" ng-click="markers_hover(d)">
                            <div class="media "><img class="avatar avatar-md" ng-src="@{{d.foto}}" alt="">
                                <div class="media-body">
                                    <h6 ng-bind="d.title"></h6>
                                    <p class="mb-0 pb-0">
                                        <span ng-bind="d.number_r"></span>
                                        <span  ng-bind-html="d.raking"></span>
                                    </p>
                                    <p class="mb-0 pb-0 direccion" ng-bind="d.direccion"></p>
                                </div> 
                            </div>
                        </a> 
                    </div> 
                </div> 
                <!-- <button id="more">More results</button> -->
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
<!-- 
    <div id="listing">
      <table id="resultsTable">
        <tbody id="results"></tbody>
      </table>
    </div>

    <div style="">
      <div id="info-content">
        <table>
          <tr id="iw-url-row" class="iw_table_row">
            <td id="iw-icon" class="iw_table_icon"></td>
            <td id="iw-url"></td>
          </tr>
          <tr id="iw-address-row" class="iw_table_row">
            <td class="iw_attribute_name">Address:</td>
            <td id="iw-address"></td>
          </tr>
          <tr id="iw-phone-row" class="iw_table_row">
            <td class="iw_attribute_name">Telephone:</td>
            <td id="iw-phone"></td>
          </tr>
          <tr id="iw-rating-row" class="iw_table_row">
            <td class="iw_attribute_name">Rating:</td>
            <td id="iw-rating"></td>
          </tr>
          <tr id="iw-website-row" class="iw_table_row">
            <td class="iw_attribute_name">Website:</td>
            <td id="iw-website"></td>
          </tr>
        </table>
      </div>
    </div> -->

         
    </section> 
        
    @include('web.services.modals.create')
    @include('web.services.modals.edit')
    @include('web.services.modals.see')
</div>
@endsection
@section('javascript')
<script src="https://maps.googleapis.com/maps/api/js?sensor=false?key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE&callback&libraries=places" ></script>
<script src="{{ url() }}/assets/app/js/admin/angular-uuid.js"></script>
<script src="{{ url() }}/assets/app/js/angular/Ubicaciones_Front.js"></script>

<!-- <script src="{{ url('') }}/assets/scripts/storeJs/Services/indexServices.js"></script> -->

<script type="text/javascript">
  // AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE  
// https://maps.googleapis.com/maps/api/streetview?size=606x400&location=-11.9573,-77.0539&pitch=-0.76&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE
</script> 
 
@endsection