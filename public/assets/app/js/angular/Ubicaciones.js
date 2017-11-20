(function() {
  "use strict";
  var model = angular.module("model", ["Services", "angular-uuid"]);

  var seletedValue = 15;

  model.controller("Ctrl", [
    "$scope",
    "$http",
    "$timeout",
    "Services",
    "uuid",
    function($scope, $http, $timeout, Services, uuid) {
      var html = function(id) {
        return document.getElementById(id);
      };

      $scope.temp = [];
      $scope.cant_rows = "10";
      console.log("ubicaciones");
      // var hash = uuid.v4();
      // console.log(hash);
      $scope.load = function(q, p, page) {
        if (q == undefined) {
          q = "";
        }
        Services.Load(q, "", p, page).then(
          function(response) {
            $scope.data_load = response.data;
            $scope.temp.push($scope.data_load);
            $scope.to = response.to;
            $scope.total = response.total;
            $scope.last_page = response.last_page;
            $scope.current_page = response.current_page;
            $scope.next_page_url = response.next_page_url;
            $scope.prev_page_url = response.prev_page_url;
            if ($scope.prev_page_url !== null) {
              $scope.prev_page_url = $scope.prev_page_url.replace("?page=", "");
            }
            if ($scope.next_page_url !== null) {
              $scope.next_page_url = $scope.next_page_url.replace("?page=", "");
            }
          },
          function(response) {}
        );
      };

      $scope.array = ["cant_rows", "search_text"];
      $scope.$watchGroup($scope.array, function(n) {
        // console.log(n);
        if (n != undefined) {
          $scope.load($scope.search_text, $scope.cant_rows, 1);
        } else {
          $scope.load("", $scope.cant_rows, 1);
        }
      });

      $scope.init = function() {
        $scope.load("", $scope.cant_rows, 1);
      };

      $scope.show = function(id) {
        $scope.edit_copia = {};
        Services.Edit(id).then(
          function(response) {
            $scope.edit = response;
            $scope.edit_copia.n = response.nombre;
            $scope.edit_copia.d = response.descripcion;
          },
          function(response) {}
        );
      };
      $scope.create = function() {
        $scope.edit_copia = {};
        var store;
        store = {
          nombre: $scope.create.nombre,
          descripcion: $scope.create.descripcion
        };
        Services.Create(store).then(
          function(response) {
            console.log(response);
            $("#create").modal("hide");
            $scope.init();
          },
          function(response) {}
        );
      };
      $scope.update = function(id) {
        $scope.edit_copia = {};
        var update;
        update = {
          nombre: $scope.edit.nombre,
          descripcion: $scope.edit.descripcion
        };
        Services.Update(id, update).then(
          function(response) {
            console.log(response);
            $("#edit").modal("hide");
            $scope.init();
          },
          function(response) {}
        );
      };
      $scope.delete = function(id) {
        Services.Delete(id).then(
          function(response) {
            console.log(response);
            $scope.init();
          },
          function(response) {}
        );
      };
      // $scope.show_panel = true;
      // $scope.show_detalle = false;
      // var map;
      // var infoWindow = null;

      // function closeInfoWindow(){
      //     infoWindow.close();
      // }

      // $scope.Map = function() {
      //     map = new google.maps.Map(document.getElementById('mapa'), {
      //         center: {lat: -12.046629, lng: -77.0214337},
      //         zoom: 11
      //     });

      // }

      // $scope.initMap = function() {
      //     $scope.Map();
      //     $scope.setMarkers(map);
      //     // $scope.infoWindow = new google.maps.InfoWindow();
      //     // google.maps.event.addListener(map, 'click', $scope.closeInfoWindow());

      //     // var infoWindow = new google.maps.InfoWindow({map: map});

      //     // Try HTML5 geolocation.
      //     // $scope.location();

      // }
      // $scope.location = function(){
      //     $scope.initMap();
      //     if (navigator.geolocation) {
      //         navigator.geolocation.getCurrentPosition(function(position) {
      //             $scope.posicion_actual = {
      //               lat: position.coords.latitude,
      //               lng: position.coords.longitude
      //             };
      //             var image = {
      //                 url: '/assets/app/images/position_actual.png',
      //                 size: new google.maps.Size(50, 50),
      //                 origin: new google.maps.Point(0, 0),
      //                 anchor: new google.maps.Point(0, 40)
      //             };
      //             var marker = new google.maps.Marker({
      //                 position: $scope.posicion_actual,
      //                 map: map,
      //                 icon: image,
      //                 zoom: 11
      //             });
      //             // infoWindow.setPosition(pos);
      //             // infoWindow.setContent('Location found.');
      //             map.setCenter($scope.posicion_actual);
      //         }, function() {
      //             $scope.handleLocationError(true, infoWindow, map.getCenter());
      //         });
      //     } else {
      //         // Browser doesn't support Geolocation
      //         $scope.handleLocationError(false, infoWindow, map.getCenter());

      //     }
      // }

      // $scope.handleLocationError= function(browserHasGeolocation, infoWindow, pos) {
      //     // infoWindow.setPosition(pos);
      //     // infoWindow.setContent(browserHasGeolocation ?
      //         // 'Error: El servicio de Geolocalizacion Falló.' :
      //         // 'Error: Your browser doesn\'t support geolocation.');
      // }

      // $scope.setMarkers = function(map) {
      //     var image = {
      //         url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      //         size: new google.maps.Size(20, 32),
      //         origin: new google.maps.Point(0, 0),
      //         anchor: new google.maps.Point(0, 0)
      //     };
      //     // var infoWindow = new google.maps.InfoWindow({map: map});
      //     // console.log($scope.data_load.length);
      //     for (var i = 0; i < $scope.data_load.length; i++) {
      //         var beach = $scope.data_load[i];
      //         var pos = {
      //           lat: parseFloat(beach.lat),
      //           lng: parseFloat(beach.lng)
      //         };
      //         var marker = new google.maps.Marker({
      //             position: pos,
      //             map: map,
      //             animation: google.maps.Animation.DROP,
      //             draggable: false,
      //             icon: image

      //         });
      //         // console.log(marker);
      //         // $scope.markers_hover(marker);
      //     }
      // }
      // infoWindow = new google.maps.InfoWindow();
      // $scope.markers_hover = function(lat, lng,foto,titulo,direccion,data){
      //     var pos = {};
      //     pos.lat = parseFloat(lat);
      //     pos.lng = parseFloat(lng);
      //     infoWindow.close();
      //     infoWindow = new google.maps.InfoWindow({map: map,maxWidth: 200});
      //     infoWindow.setPosition(pos);
      //     infoWindow.setContent(
      //         [
      //             '<div class="center globo_ubicacion">',
      //             '<img width="100%" src="'+foto+'">',
      //             '<h6>'+titulo+'</h6>',
      //             '<p>'+direccion+'</p>',
      //             '<a href="#!" ng-click="show_marker('+data+')" class="btn pull-right">Ver</a>',
      //             '</div>'
      //         ].join('')
      //     );
      //     map.setCenter(new google.maps.LatLng(pos));
      //     map.setZoom(15);
      //     $scope.set_google_maps();

      //     // console.log(lat,lng)
      // }
      // $scope.set_google_maps = function(){
      //     var iwOuter = $('.gm-style-iw');
      //     var iwCloseBtn = iwOuter.next();
      //     var iwBackground = iwOuter.prev();
      //     iwBackground.children(':nth-child(2)').css({'display' : 'none'});
      //     iwBackground.children(':nth-child(4)').css({'display' : 'none'});
      //     iwOuter.parent().parent().css({left: '40px'});
      //     iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
      //     iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
      //     iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 0, 0, 0) 0px 1px 6px', 'z-index' : '1'});
      //     iwBackground.children(':nth-child(3)').children(':nth-child(1)').find('div').attr('style', function(i,s){ return s + 'height: 21px !important;'+'width: 10px !important;'+'left:7px !important;'});
      //     iwBackground.children(':nth-child(3)').children(':nth-child(2)').find('div').attr('style', function(i,s){ return s + 'height: 25px !important;'+'width: 9px !important;'});
      //     iwCloseBtn.css({'display': 'none'});
      // }
      // $scope.show_marker = function(data){
      //     $scope.show_detalle = true;
      //     console.log(data);
      //     $scope.detalle = data;
      //     $scope.show_panel = false;
      // }
      // $scope.return = function(){
      //     $scope.show_detalle = false;
      //     $scope.show_panel = true;
      // }
      $scope.guardar = function(data) {
        Services.Create(data).then(
          function(response) {
            console.log(response);
            // $scope.init();
          },
          function(response) {}
        );
      };
      $scope.create_bomberos = function() {
        Services.load_bomberos().then(
          function(response) {
            console.log(response);
            $scope.temp_data = [];
            $scope.results = response;
            angular.forEach($scope.results, function(value) {
              var obj = {
                nombre_temp: "Bomberos " + value.nombre,
                id_image: uuid.v4(),
                nombre_empresa: value.nombre,
                direccion: value.direccion,
                horario: "Las 24 horas",
                telefono_1: value.telefonos,
                correo: value.correo,
                lat: value.Lat,
                lng: value.Long,
                id_services: 4,
                url: value.link_web
              };
              $scope.temp_data.push(obj);
              $scope.guardar(obj);
            });
            console.log($scope.temp_data);
            // $scope.temp.push($scope.data_load);
          },
          function(response) {}
        );
      };

      $scope.cargar_agentes = function() {
        Services.load_agentes().then(
          function(response) {
            // console.log(response);
            $scope.temp_data = [];
            $scope.results = response.data;
            angular.forEach($scope.results, function(value) {
              var foto =
                "https://maps.googleapis.com/maps/api/streetview?size=606x400&location=" +
                value._lat +
                "," +
                value._lng +
                "&pitch=-0.76&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE";
              var obj = {
                nombre_temp:
                  "Agentes Agente Banco de la Nación - " +
                  value._establecimiento,
                id_image: uuid.v4(),
                nombre_empresa: value._establecimiento,
                direccion: value._dir,
                horario: "Sujeto a horario del local",
                telefono_1: "",
                foto: foto,
                correo: value.correo,
                lat: value._lat,
                lng: value._lng,
                id_services: 1,
                url: value.link_web
              };
              $scope.temp_data.push(obj);
              // $scope.guardar(obj);
            });
            console.log($scope.temp_data);
            // $scope.temp.push($scope.data_load);
          },
          function(response) {}
        );
      };
      // $scope.cargar_agentes();

      $scope.banco = function() {
        Services.banco().then(function(response) {
          console.log(response.data);
        });
      };
      $scope.agentes = function() {
        Services.agentes().then(function(response) {
          console.log(response.data);
        });
      };
      $scope.cajero = function() {
        Services.cajero().then(function(response) {
          console.log(response);
        });
      };

      var obj_bomberos = [
        { id: "http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CdById/204000" },
        { id: "http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/204000" },
        { id: "http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CdById/205000" },
        { id: "http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/205000" },
        { id: "http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CdById/224000" },
        { id: "http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/224000" },
        { id: "http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CdById/225000" },
        { id: "http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/223000" },
        { id: "http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/225000" }
      ];
      $scope.jsonConvert = function(id_servicio) {
        Services.Load("", "", 300, 1).then(function(response) {
          $scope.data_load = response.data; 
          var create_marker = [];
          if ($scope.data_load != undefined && $scope.data_load.length > 0) {
            if(id_servicio === 1){
              $scope.logicaGuardarData(obj_bancos,1);
            }
            else if(id_servicio === 2){
              $scope.logicaGuardarData(obj_comisarias,2);
            }
            else if(id_servicio === 3){
              $scope.logicaGuardarData(obj_hospitales,3);
            }
            else if(id_servicio === 4){
              $scope.logicaGuardarData(obj_bomberos,4);
            }
            else if(id_servicio === 5){
              $scope.logicaGuardarData(obj_municipalidades,5);
            }
          } else {
            for (var j = 0; j < obj.length; j++) {
              Services.createDataToJson(obj[j].id).then(function(response) {
                $scope.result = response.data;
                var count = 0;
                for (var i = 0; i < $scope.result.length; i++) {
                  var lat = $scope.result[i].Lat;
                  var lng = $scope.result[i].Long;
                  var foto =
                    "https://maps.googleapis.com/maps/api/streetview?size=606x400&location=" +
                    lat +
                    "," +
                    lng +
                    "&pitch=-0.76&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE";
                  var obj = {
                    id_img: uuid.v4(),
                    id_serv: id_servicio,
                    nomb: $scope.result[i].nombre,
                    direc: $scope.result[i].direccion,
                    tel_1: $scope.result[i].telefonos,
                    hor: "Siempre Abierto",
                    tel_2: null,
                    cor: $scope.result[i].correo,
                    url: $scope.result[i].link_web,
                    desc: null,
                    lat: $scope.result[i].Lat,
                    lng: $scope.result[i].Long,
                    foto: foto,
                    abrev: $scope.result[i].abrev,
                    cod: $scope.result[i].codbom,
                    f_funda: $scope.result[i].fecha_fundacion,
                    dr: $scope.result[i].dr,
                    codidenest: $scope.result[i].codidenest,
                    ubig: $scope.result[i].ubigeo
                  };
                  $scope.guardar(obj);
                }
              });
            }
          }
        });
      };

      $scope.logicaGuardarData = function(tipo,id){
        for (var j = 0; j < tipo.length; j++) {
          console.log(tipo);
          Services.createDataToJson(tipo[j].id).then(function(response) {
            $scope.result = response.data; 
            var count = 0;
            if ($scope.result.length != undefined) {
              if(id === 1){

              }
              else if(id === 2){

              }
              else if(id === 3){

              }
              else if(id === 4){
                $scope.result.filter(obj => {
                  const exists = $scope.data_load.some(
                    obj2 => obj.codbom === obj2.cod
                  ); 
                  if (!exists) {
                    var lat = obj.Lat;
                    var lng = obj.Long;
                    var foto =
                      "https://maps.googleapis.com/maps/api/streetview?size=606x400&location=" +
                      lat + "," + lng +
                      "&pitch=-0.76&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE";
                    var temp = {
                      id_img: uuid.v4(),
                      id_serv: id_servicio,
                      nomb: obj.nombre,
                      direc: obj.direccion,
                      tel_1: obj.telefonos,
                      hor: obj.horario,
                      tel_2: obj.telefonos2,
                      cor: obj.correo,
                      url: obj.link_web,
                      desc: obj.desc,
                      lat: obj.Lat,
                      lng: obj.Long,
                      foto: foto,
                      abrev: obj.abrev,
                      cod: obj.codbom,
                      f_funda: obj.fecha_fundacion,
                      dr: obj.dr,
                      cargo: obj.cargo,
                      codidenest: obj.codidenest,
                      ubig: obj.ubigeo
                    }; 
                    $scope.guardar(temp);
                    return temp;
                  } else {
                    console.log("No hubo cambios");
                  }
                });
              }
              else if(id === 5){
                
              }
              
            }
          });
        }
      }
      // $scope.load_allBomberos();

      // function geocodeResult(results, status) {
      //     if (status == 'OK') {
      //         var markerOptions = results[0].geometry.location;
      //     } else {
      //         // En caso de no haber resultados o que haya ocurrido un error
      //         // lanzamos un mensaje con el error
      //         alert("Geocoding no tuvo éxito debido a: " + status);
      //     }
      // }
      // $scope.cajero();
      // $scope.create_bomberos();
    }
  ]);
})();

(function () {
'use strict';
angular.module('Services', [])
.factory('Services', function($http) {
    return { 
        Load: function(q,id_serv,p,page){
            return $http.get(base_url +'/api/v1/locations?nombre='+q+'&id_serv='+id_serv+'&per_page='+p+'&page='+page).then(function (response){   
                return response.data;
            });
        },
        See: function(id){
            return $http.get(base_url +'/api/v1/locations/'+id).then(function (response){
                return response.data;
            });
        },
        Edit: function(id){
            return $http.get(base_url +'/api/v1/locations/'+id).then(function (response){
                return response.data;
            });
        }, 
        Update: function(id,data){
            return $http.put(base_url +'/api/v1/locations/'+id,data).then(function (response){
                return response.data;
            });
        },
        Create: function(data){
            return $http.post(base_url +'/api/v1/locations',data).then(function (response){
                return response.data;
            });
        },
        Delete: function(id){
            return  b$http.delete(base_url +'/api/v1/locations/'+id).then(function (response){
                return response.data;
            });
        } ,
        load_bomberos: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/225000').then(function (response){  
                console.log(response.data);
                return response.data;
            });
        },
        // agencia: function(){
        //     return $http.get('http://www.bn.com.pe/canales-atencion/base-datos/agencias.asp').then(function (response){  
        //         // console.log(response);
        //         return response;
        //     });
        // },
        cajero: function(){
            return $http.get('http://www.bn.com.pe/canales-atencion/base-datos/cajeros.asp').then(function (response){  
                console.log(response);
                return response;
            });
        }

        // , 
        // agentes: function(){
        //     return $http.get('http://www.bn.com.pe/canales-atencion/base-datos/agentes.asp').then(function (response){  
        //         // console.log(response);
        //         return response;
        //     });
        // }
        ,
        load_hospitales: function(){
            return $http.get('http://grupoaizen.com/hospitales.json').then(function (response){  
                console.log(response);
                return response;
            });
        },
        load_agentes: function(){
            return $http.get('http://grupoaizen.com/banco_nacion_agentes.json').then(function (response){  
                console.log(response);
                return response;
            });
        }, 
        createDataToJson: function(url){
            return $http.get(url).then(function(response){
                return response
            });
        }
        
        
        
        
    };
}); 
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlViaWNhY2lvbmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIG1vZGVsID0gYW5ndWxhci5tb2R1bGUoXCJtb2RlbFwiLCBbXCJTZXJ2aWNlc1wiLCBcImFuZ3VsYXItdXVpZFwiXSk7XG5cbiAgdmFyIHNlbGV0ZWRWYWx1ZSA9IDE1O1xuXG4gIG1vZGVsLmNvbnRyb2xsZXIoXCJDdHJsXCIsIFtcbiAgICBcIiRzY29wZVwiLFxuICAgIFwiJGh0dHBcIixcbiAgICBcIiR0aW1lb3V0XCIsXG4gICAgXCJTZXJ2aWNlc1wiLFxuICAgIFwidXVpZFwiLFxuICAgIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICR0aW1lb3V0LCBTZXJ2aWNlcywgdXVpZCkge1xuICAgICAgdmFyIGh0bWwgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLnRlbXAgPSBbXTtcbiAgICAgICRzY29wZS5jYW50X3Jvd3MgPSBcIjEwXCI7XG4gICAgICBjb25zb2xlLmxvZyhcInViaWNhY2lvbmVzXCIpO1xuICAgICAgLy8gdmFyIGhhc2ggPSB1dWlkLnY0KCk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhoYXNoKTtcbiAgICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24ocSwgcCwgcGFnZSkge1xuICAgICAgICBpZiAocSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBTZXJ2aWNlcy5Mb2FkKHEsIFwiXCIsIHAsIHBhZ2UpLnRoZW4oXG4gICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWQgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTtcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvO1xuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDtcbiAgICAgICAgICAgIGlmICgkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIiwgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHt9XG4gICAgICAgICk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuYXJyYXkgPSBbXCJjYW50X3Jvd3NcIiwgXCJzZWFyY2hfdGV4dFwiXTtcbiAgICAgICRzY29wZS4kd2F0Y2hHcm91cCgkc2NvcGUuYXJyYXksIGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobik7XG4gICAgICAgIGlmIChuICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICRzY29wZS5sb2FkKCRzY29wZS5zZWFyY2hfdGV4dCwgJHNjb3BlLmNhbnRfcm93cywgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJHNjb3BlLmxvYWQoXCJcIiwgJHNjb3BlLmNhbnRfcm93cywgMSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUubG9hZChcIlwiLCAkc2NvcGUuY2FudF9yb3dzLCAxKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgJHNjb3BlLmVkaXRfY29waWEgPSB7fTtcbiAgICAgICAgU2VydmljZXMuRWRpdChpZCkudGhlbihcbiAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmVkaXQgPSByZXNwb25zZTtcbiAgICAgICAgICAgICRzY29wZS5lZGl0X2NvcGlhLm4gPSByZXNwb25zZS5ub21icmU7XG4gICAgICAgICAgICAkc2NvcGUuZWRpdF9jb3BpYS5kID0gcmVzcG9uc2UuZGVzY3JpcGNpb247XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge31cbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5lZGl0X2NvcGlhID0ge307XG4gICAgICAgIHZhciBzdG9yZTtcbiAgICAgICAgc3RvcmUgPSB7XG4gICAgICAgICAgbm9tYnJlOiAkc2NvcGUuY3JlYXRlLm5vbWJyZSxcbiAgICAgICAgICBkZXNjcmlwY2lvbjogJHNjb3BlLmNyZWF0ZS5kZXNjcmlwY2lvblxuICAgICAgICB9O1xuICAgICAgICBTZXJ2aWNlcy5DcmVhdGUoc3RvcmUpLnRoZW4oXG4gICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICQoXCIjY3JlYXRlXCIpLm1vZGFsKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICRzY29wZS5pbml0KCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge31cbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgJHNjb3BlLmVkaXRfY29waWEgPSB7fTtcbiAgICAgICAgdmFyIHVwZGF0ZTtcbiAgICAgICAgdXBkYXRlID0ge1xuICAgICAgICAgIG5vbWJyZTogJHNjb3BlLmVkaXQubm9tYnJlLFxuICAgICAgICAgIGRlc2NyaXBjaW9uOiAkc2NvcGUuZWRpdC5kZXNjcmlwY2lvblxuICAgICAgICB9O1xuICAgICAgICBTZXJ2aWNlcy5VcGRhdGUoaWQsIHVwZGF0ZSkudGhlbihcbiAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgJChcIiNlZGl0XCIpLm1vZGFsKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICRzY29wZS5pbml0KCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge31cbiAgICAgICAgKTtcbiAgICAgIH07XG4gICAgICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgU2VydmljZXMuRGVsZXRlKGlkKS50aGVuKFxuICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHt9XG4gICAgICAgICk7XG4gICAgICB9O1xuICAgICAgLy8gJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlO1xuICAgICAgLy8gJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlO1xuICAgICAgLy8gdmFyIG1hcDtcbiAgICAgIC8vIHZhciBpbmZvV2luZG93ID0gbnVsbDtcblxuICAgICAgLy8gZnVuY3Rpb24gY2xvc2VJbmZvV2luZG93KCl7XG4gICAgICAvLyAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgICAgLy8gfVxuXG4gICAgICAvLyAkc2NvcGUuTWFwID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyAgICAgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwYScpLCB7XG4gICAgICAvLyAgICAgICAgIGNlbnRlcjoge2xhdDogLTEyLjA0NjYyOSwgbG5nOiAtNzcuMDIxNDMzN30sXG4gICAgICAvLyAgICAgICAgIHpvb206IDExXG4gICAgICAvLyAgICAgfSk7XG5cbiAgICAgIC8vIH1cblxuICAgICAgLy8gJHNjb3BlLmluaXRNYXAgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vICAgICAkc2NvcGUuTWFwKCk7XG4gICAgICAvLyAgICAgJHNjb3BlLnNldE1hcmtlcnMobWFwKTtcbiAgICAgIC8vICAgICAvLyAkc2NvcGUuaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG4gICAgICAvLyAgICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCAkc2NvcGUuY2xvc2VJbmZvV2luZG93KCkpO1xuXG4gICAgICAvLyAgICAgLy8gdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXB9KTtcblxuICAgICAgLy8gICAgIC8vIFRyeSBIVE1MNSBnZW9sb2NhdGlvbi5cbiAgICAgIC8vICAgICAvLyAkc2NvcGUubG9jYXRpb24oKTtcblxuICAgICAgLy8gfVxuICAgICAgLy8gJHNjb3BlLmxvY2F0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgIC8vICAgICAkc2NvcGUuaW5pdE1hcCgpO1xuICAgICAgLy8gICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgIC8vICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbikge1xuICAgICAgLy8gICAgICAgICAgICAgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCA9IHtcbiAgICAgIC8vICAgICAgICAgICAgICAgbGF0OiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAvLyAgICAgICAgICAgICAgIGxuZzogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZVxuICAgICAgLy8gICAgICAgICAgICAgfTtcbiAgICAgIC8vICAgICAgICAgICAgIHZhciBpbWFnZSA9IHtcbiAgICAgIC8vICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsXG4gICAgICAvLyAgICAgICAgICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNTAsIDUwKSxcbiAgICAgIC8vICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgIC8vICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCA0MClcbiAgICAgIC8vICAgICAgICAgICAgIH07XG4gICAgICAvLyAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAvLyAgICAgICAgICAgICAgICAgcG9zaXRpb246ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgICAvLyAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAvLyAgICAgICAgICAgICAgICAgaWNvbjogaW1hZ2UsXG4gICAgICAvLyAgICAgICAgICAgICAgICAgem9vbTogMTFcbiAgICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgICAgLy8gICAgICAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpO1xuICAgICAgLy8gICAgICAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRDb250ZW50KCdMb2NhdGlvbiBmb3VuZC4nKTtcbiAgICAgIC8vICAgICAgICAgICAgIG1hcC5zZXRDZW50ZXIoJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCk7XG4gICAgICAvLyAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IodHJ1ZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcbiAgICAgIC8vICAgICAgICAgfSk7XG4gICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICAgICAgLy8gQnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgR2VvbG9jYXRpb25cbiAgICAgIC8vICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IoZmFsc2UsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG5cbiAgICAgIC8vICAgICB9XG4gICAgICAvLyB9XG5cbiAgICAgIC8vICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yPSBmdW5jdGlvbihicm93c2VySGFzR2VvbG9jYXRpb24sIGluZm9XaW5kb3csIHBvcykge1xuICAgICAgLy8gICAgIC8vIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAgIC8vICAgICAvLyBpbmZvV2luZG93LnNldENvbnRlbnQoYnJvd3Nlckhhc0dlb2xvY2F0aW9uID9cbiAgICAgIC8vICAgICAgICAgLy8gJ0Vycm9yOiBFbCBzZXJ2aWNpbyBkZSBHZW9sb2NhbGl6YWNpb24gRmFsbMOzLicgOlxuICAgICAgLy8gICAgICAgICAvLyAnRXJyb3I6IFlvdXIgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBnZW9sb2NhdGlvbi4nKTtcbiAgICAgIC8vIH1cblxuICAgICAgLy8gJHNjb3BlLnNldE1hcmtlcnMgPSBmdW5jdGlvbihtYXApIHtcbiAgICAgIC8vICAgICB2YXIgaW1hZ2UgPSB7XG4gICAgICAvLyAgICAgICAgIHVybDogJ2h0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L2V4YW1wbGVzL2Z1bGwvaW1hZ2VzL2JlYWNoZmxhZy5wbmcnLFxuICAgICAgLy8gICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMzIpLFxuICAgICAgLy8gICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgIC8vICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMClcbiAgICAgIC8vICAgICB9O1xuICAgICAgLy8gICAgIC8vIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe21hcDogbWFwfSk7XG4gICAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGgpO1xuICAgICAgLy8gICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gICAgICAgICB2YXIgYmVhY2ggPSAkc2NvcGUuZGF0YV9sb2FkW2ldO1xuICAgICAgLy8gICAgICAgICB2YXIgcG9zID0ge1xuICAgICAgLy8gICAgICAgICAgIGxhdDogcGFyc2VGbG9hdChiZWFjaC5sYXQpLFxuICAgICAgLy8gICAgICAgICAgIGxuZzogcGFyc2VGbG9hdChiZWFjaC5sbmcpXG4gICAgICAvLyAgICAgICAgIH07XG4gICAgICAvLyAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgIC8vICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAvLyAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgIC8vICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXG4gICAgICAvLyAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxuICAgICAgLy8gICAgICAgICAgICAgaWNvbjogaW1hZ2VcblxuICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cobWFya2VyKTtcbiAgICAgIC8vICAgICAgICAgLy8gJHNjb3BlLm1hcmtlcnNfaG92ZXIobWFya2VyKTtcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyB9XG4gICAgICAvLyBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcbiAgICAgIC8vICRzY29wZS5tYXJrZXJzX2hvdmVyID0gZnVuY3Rpb24obGF0LCBsbmcsZm90byx0aXR1bG8sZGlyZWNjaW9uLGRhdGEpe1xuICAgICAgLy8gICAgIHZhciBwb3MgPSB7fTtcbiAgICAgIC8vICAgICBwb3MubGF0ID0gcGFyc2VGbG9hdChsYXQpO1xuICAgICAgLy8gICAgIHBvcy5sbmcgPSBwYXJzZUZsb2F0KGxuZyk7XG4gICAgICAvLyAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgICAgLy8gICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXAsbWF4V2lkdGg6IDIwMH0pO1xuICAgICAgLy8gICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAgIC8vICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoXG4gICAgICAvLyAgICAgICAgIFtcbiAgICAgIC8vICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2VudGVyIGdsb2JvX3ViaWNhY2lvblwiPicsXG4gICAgICAvLyAgICAgICAgICAgICAnPGltZyB3aWR0aD1cIjEwMCVcIiBzcmM9XCInK2ZvdG8rJ1wiPicsXG4gICAgICAvLyAgICAgICAgICAgICAnPGg2PicrdGl0dWxvKyc8L2g2PicsXG4gICAgICAvLyAgICAgICAgICAgICAnPHA+JytkaXJlY2Npb24rJzwvcD4nLFxuICAgICAgLy8gICAgICAgICAgICAgJzxhIGhyZWY9XCIjIVwiIG5nLWNsaWNrPVwic2hvd19tYXJrZXIoJytkYXRhKycpXCIgY2xhc3M9XCJidG4gcHVsbC1yaWdodFwiPlZlcjwvYT4nLFxuICAgICAgLy8gICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgIC8vICAgICAgICAgXS5qb2luKCcnKVxuICAgICAgLy8gICAgICk7XG4gICAgICAvLyAgICAgbWFwLnNldENlbnRlcihuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHBvcykpO1xuICAgICAgLy8gICAgIG1hcC5zZXRab29tKDE1KTtcbiAgICAgIC8vICAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzKCk7XG5cbiAgICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhsYXQsbG5nKVxuICAgICAgLy8gfVxuICAgICAgLy8gJHNjb3BlLnNldF9nb29nbGVfbWFwcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAvLyAgICAgdmFyIGl3T3V0ZXIgPSAkKCcuZ20tc3R5bGUtaXcnKTtcbiAgICAgIC8vICAgICB2YXIgaXdDbG9zZUJ0biA9IGl3T3V0ZXIubmV4dCgpO1xuICAgICAgLy8gICAgIHZhciBpd0JhY2tncm91bmQgPSBpd091dGVyLnByZXYoKTtcbiAgICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKS5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pO1xuICAgICAgLy8gICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCg0KScpLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSk7XG4gICAgICAvLyAgICAgaXdPdXRlci5wYXJlbnQoKS5wYXJlbnQoKS5jc3Moe2xlZnQ6ICc0MHB4J30pO1xuICAgICAgLy8gICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnbGVmdDogODRweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDg0cHggIWltcG9ydGFudDsnfSk7XG4gICAgICAvLyAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuZmluZCgnZGl2JykuY2hpbGRyZW4oKS5jc3Moeydib3gtc2hhZG93JzogJ3JnYmEoMCwgMCwgMCwgMCkgMHB4IDFweCA2cHgnLCAnei1pbmRleCcgOiAnMSd9KTtcbiAgICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpLmZpbmQoJ2RpdicpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnaGVpZ2h0OiAyMXB4ICFpbXBvcnRhbnQ7Jysnd2lkdGg6IDEwcHggIWltcG9ydGFudDsnKydsZWZ0OjdweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgIC8vICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpLmZpbmQoJ2RpdicpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnaGVpZ2h0OiAyNXB4ICFpbXBvcnRhbnQ7Jysnd2lkdGg6IDlweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgIC8vICAgICBpd0Nsb3NlQnRuLmNzcyh7J2Rpc3BsYXknOiAnbm9uZSd9KTtcbiAgICAgIC8vIH1cbiAgICAgIC8vICRzY29wZS5zaG93X21hcmtlciA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgLy8gICAgICRzY29wZS5zaG93X2RldGFsbGUgPSB0cnVlO1xuICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgLy8gICAgICRzY29wZS5kZXRhbGxlID0gZGF0YTtcbiAgICAgIC8vICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IGZhbHNlO1xuICAgICAgLy8gfVxuICAgICAgLy8gJHNjb3BlLnJldHVybiA9IGZ1bmN0aW9uKCl7XG4gICAgICAvLyAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlO1xuICAgICAgLy8gICAgICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTtcbiAgICAgIC8vIH1cbiAgICAgICRzY29wZS5ndWFyZGFyID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBTZXJ2aWNlcy5DcmVhdGUoZGF0YSkudGhlbihcbiAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLmluaXQoKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7fVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5jcmVhdGVfYm9tYmVyb3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgU2VydmljZXMubG9hZF9ib21iZXJvcygpLnRoZW4oXG4gICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICRzY29wZS50ZW1wX2RhdGEgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5yZXN1bHRzID0gcmVzcG9uc2U7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLnJlc3VsdHMsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICAgICAgbm9tYnJlX3RlbXA6IFwiQm9tYmVyb3MgXCIgKyB2YWx1ZS5ub21icmUsXG4gICAgICAgICAgICAgICAgaWRfaW1hZ2U6IHV1aWQudjQoKSxcbiAgICAgICAgICAgICAgICBub21icmVfZW1wcmVzYTogdmFsdWUubm9tYnJlLFxuICAgICAgICAgICAgICAgIGRpcmVjY2lvbjogdmFsdWUuZGlyZWNjaW9uLFxuICAgICAgICAgICAgICAgIGhvcmFyaW86IFwiTGFzIDI0IGhvcmFzXCIsXG4gICAgICAgICAgICAgICAgdGVsZWZvbm9fMTogdmFsdWUudGVsZWZvbm9zLFxuICAgICAgICAgICAgICAgIGNvcnJlbzogdmFsdWUuY29ycmVvLFxuICAgICAgICAgICAgICAgIGxhdDogdmFsdWUuTGF0LFxuICAgICAgICAgICAgICAgIGxuZzogdmFsdWUuTG9uZyxcbiAgICAgICAgICAgICAgICBpZF9zZXJ2aWNlczogNCxcbiAgICAgICAgICAgICAgICB1cmw6IHZhbHVlLmxpbmtfd2ViXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICRzY29wZS50ZW1wX2RhdGEucHVzaChvYmopO1xuICAgICAgICAgICAgICAkc2NvcGUuZ3VhcmRhcihvYmopO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudGVtcF9kYXRhKTtcbiAgICAgICAgICAgIC8vICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge31cbiAgICAgICAgKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS5jYXJnYXJfYWdlbnRlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBTZXJ2aWNlcy5sb2FkX2FnZW50ZXMoKS50aGVuKFxuICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAkc2NvcGUudGVtcF9kYXRhID0gW107XG4gICAgICAgICAgICAkc2NvcGUucmVzdWx0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLnJlc3VsdHMsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHZhciBmb3RvID1cbiAgICAgICAgICAgICAgICBcImh0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdHJlZXR2aWV3P3NpemU9NjA2eDQwMCZsb2NhdGlvbj1cIiArXG4gICAgICAgICAgICAgICAgdmFsdWUuX2xhdCArXG4gICAgICAgICAgICAgICAgXCIsXCIgK1xuICAgICAgICAgICAgICAgIHZhbHVlLl9sbmcgK1xuICAgICAgICAgICAgICAgIFwiJnBpdGNoPS0wLjc2JmtleT1BSXphU3lEU0pHOEprTkozaTdweUhaejFnQzFUWVZVaWNtM0Mzc0VcIjtcbiAgICAgICAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgICAgICBub21icmVfdGVtcDpcbiAgICAgICAgICAgICAgICAgIFwiQWdlbnRlcyBBZ2VudGUgQmFuY28gZGUgbGEgTmFjacOzbiAtIFwiICtcbiAgICAgICAgICAgICAgICAgIHZhbHVlLl9lc3RhYmxlY2ltaWVudG8sXG4gICAgICAgICAgICAgICAgaWRfaW1hZ2U6IHV1aWQudjQoKSxcbiAgICAgICAgICAgICAgICBub21icmVfZW1wcmVzYTogdmFsdWUuX2VzdGFibGVjaW1pZW50byxcbiAgICAgICAgICAgICAgICBkaXJlY2Npb246IHZhbHVlLl9kaXIsXG4gICAgICAgICAgICAgICAgaG9yYXJpbzogXCJTdWpldG8gYSBob3JhcmlvIGRlbCBsb2NhbFwiLFxuICAgICAgICAgICAgICAgIHRlbGVmb25vXzE6IFwiXCIsXG4gICAgICAgICAgICAgICAgZm90bzogZm90byxcbiAgICAgICAgICAgICAgICBjb3JyZW86IHZhbHVlLmNvcnJlbyxcbiAgICAgICAgICAgICAgICBsYXQ6IHZhbHVlLl9sYXQsXG4gICAgICAgICAgICAgICAgbG5nOiB2YWx1ZS5fbG5nLFxuICAgICAgICAgICAgICAgIGlkX3NlcnZpY2VzOiAxLFxuICAgICAgICAgICAgICAgIHVybDogdmFsdWUubGlua193ZWJcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgJHNjb3BlLnRlbXBfZGF0YS5wdXNoKG9iaik7XG4gICAgICAgICAgICAgIC8vICRzY29wZS5ndWFyZGFyKG9iaik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS50ZW1wX2RhdGEpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7fVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICAgIC8vICRzY29wZS5jYXJnYXJfYWdlbnRlcygpO1xuXG4gICAgICAkc2NvcGUuYmFuY28gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgU2VydmljZXMuYmFuY28oKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5hZ2VudGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFNlcnZpY2VzLmFnZW50ZXMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgICRzY29wZS5jYWplcm8gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgU2VydmljZXMuY2FqZXJvKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgb2JqX2JvbWJlcm9zID0gW1xuICAgICAgICB7IGlkOiBcImh0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIwNDAwMFwiIH0sXG4gICAgICAgIHsgaWQ6IFwiaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMDQwMDBcIiB9LFxuICAgICAgICB7IGlkOiBcImh0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIwNTAwMFwiIH0sXG4gICAgICAgIHsgaWQ6IFwiaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMDUwMDBcIiB9LFxuICAgICAgICB7IGlkOiBcImh0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIyNDAwMFwiIH0sXG4gICAgICAgIHsgaWQ6IFwiaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMjQwMDBcIiB9LFxuICAgICAgICB7IGlkOiBcImh0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIyNTAwMFwiIH0sXG4gICAgICAgIHsgaWQ6IFwiaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMjMwMDBcIiB9LFxuICAgICAgICB7IGlkOiBcImh0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2lhc0J5SWQvMjI1MDAwXCIgfVxuICAgICAgXTtcbiAgICAgICRzY29wZS5qc29uQ29udmVydCA9IGZ1bmN0aW9uKGlkX3NlcnZpY2lvKSB7XG4gICAgICAgIFNlcnZpY2VzLkxvYWQoXCJcIiwgXCJcIiwgMzAwLCAxKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZCA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgIHZhciBjcmVhdGVfbWFya2VyID0gW107XG4gICAgICAgICAgaWYgKCRzY29wZS5kYXRhX2xvYWQgIT0gdW5kZWZpbmVkICYmICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYoaWRfc2VydmljaW8gPT09IDEpe1xuICAgICAgICAgICAgICAkc2NvcGUubG9naWNhR3VhcmRhckRhdGEob2JqX2JhbmNvcywxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoaWRfc2VydmljaW8gPT09IDIpe1xuICAgICAgICAgICAgICAkc2NvcGUubG9naWNhR3VhcmRhckRhdGEob2JqX2NvbWlzYXJpYXMsMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGlkX3NlcnZpY2lvID09PSAzKXtcbiAgICAgICAgICAgICAgJHNjb3BlLmxvZ2ljYUd1YXJkYXJEYXRhKG9ial9ob3NwaXRhbGVzLDMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihpZF9zZXJ2aWNpbyA9PT0gNCl7XG4gICAgICAgICAgICAgICRzY29wZS5sb2dpY2FHdWFyZGFyRGF0YShvYmpfYm9tYmVyb3MsNCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGlkX3NlcnZpY2lvID09PSA1KXtcbiAgICAgICAgICAgICAgJHNjb3BlLmxvZ2ljYUd1YXJkYXJEYXRhKG9ial9tdW5pY2lwYWxpZGFkZXMsNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb2JqLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgIFNlcnZpY2VzLmNyZWF0ZURhdGFUb0pzb24ob2JqW2pdLmlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdCA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5yZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIHZhciBsYXQgPSAkc2NvcGUucmVzdWx0W2ldLkxhdDtcbiAgICAgICAgICAgICAgICAgIHZhciBsbmcgPSAkc2NvcGUucmVzdWx0W2ldLkxvbmc7XG4gICAgICAgICAgICAgICAgICB2YXIgZm90byA9XG4gICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0cmVldHZpZXc/c2l6ZT02MDZ4NDAwJmxvY2F0aW9uPVwiICtcbiAgICAgICAgICAgICAgICAgICAgbGF0ICtcbiAgICAgICAgICAgICAgICAgICAgXCIsXCIgK1xuICAgICAgICAgICAgICAgICAgICBsbmcgK1xuICAgICAgICAgICAgICAgICAgICBcIiZwaXRjaD0tMC43NiZrZXk9QUl6YVN5RFNKRzhKa05KM2k3cHlIWnoxZ0MxVFlWVWljbTNDM3NFXCI7XG4gICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgICAgICAgICAgICBpZF9pbWc6IHV1aWQudjQoKSxcbiAgICAgICAgICAgICAgICAgICAgaWRfc2VydjogaWRfc2VydmljaW8sXG4gICAgICAgICAgICAgICAgICAgIG5vbWI6ICRzY29wZS5yZXN1bHRbaV0ubm9tYnJlLFxuICAgICAgICAgICAgICAgICAgICBkaXJlYzogJHNjb3BlLnJlc3VsdFtpXS5kaXJlY2Npb24sXG4gICAgICAgICAgICAgICAgICAgIHRlbF8xOiAkc2NvcGUucmVzdWx0W2ldLnRlbGVmb25vcyxcbiAgICAgICAgICAgICAgICAgICAgaG9yOiBcIlNpZW1wcmUgQWJpZXJ0b1wiLFxuICAgICAgICAgICAgICAgICAgICB0ZWxfMjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgY29yOiAkc2NvcGUucmVzdWx0W2ldLmNvcnJlbyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAkc2NvcGUucmVzdWx0W2ldLmxpbmtfd2ViLFxuICAgICAgICAgICAgICAgICAgICBkZXNjOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBsYXQ6ICRzY29wZS5yZXN1bHRbaV0uTGF0LFxuICAgICAgICAgICAgICAgICAgICBsbmc6ICRzY29wZS5yZXN1bHRbaV0uTG9uZyxcbiAgICAgICAgICAgICAgICAgICAgZm90bzogZm90byxcbiAgICAgICAgICAgICAgICAgICAgYWJyZXY6ICRzY29wZS5yZXN1bHRbaV0uYWJyZXYsXG4gICAgICAgICAgICAgICAgICAgIGNvZDogJHNjb3BlLnJlc3VsdFtpXS5jb2Rib20sXG4gICAgICAgICAgICAgICAgICAgIGZfZnVuZGE6ICRzY29wZS5yZXN1bHRbaV0uZmVjaGFfZnVuZGFjaW9uLFxuICAgICAgICAgICAgICAgICAgICBkcjogJHNjb3BlLnJlc3VsdFtpXS5kcixcbiAgICAgICAgICAgICAgICAgICAgY29kaWRlbmVzdDogJHNjb3BlLnJlc3VsdFtpXS5jb2RpZGVuZXN0LFxuICAgICAgICAgICAgICAgICAgICB1YmlnOiAkc2NvcGUucmVzdWx0W2ldLnViaWdlb1xuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICRzY29wZS5ndWFyZGFyKG9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLmxvZ2ljYUd1YXJkYXJEYXRhID0gZnVuY3Rpb24odGlwbyxpZCl7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGlwby5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRpcG8pO1xuICAgICAgICAgIFNlcnZpY2VzLmNyZWF0ZURhdGFUb0pzb24odGlwb1tqXS5pZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLnJlc3VsdCA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICAgIGlmICgkc2NvcGUucmVzdWx0Lmxlbmd0aCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgaWYoaWQgPT09IDEpe1xuXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSBpZihpZCA9PT0gMil7XG5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIGlmKGlkID09PSAzKXtcblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2UgaWYoaWQgPT09IDQpe1xuICAgICAgICAgICAgICAgICRzY29wZS5yZXN1bHQuZmlsdGVyKG9iaiA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBleGlzdHMgPSAkc2NvcGUuZGF0YV9sb2FkLnNvbWUoXG4gICAgICAgICAgICAgICAgICAgIG9iajIgPT4gb2JqLmNvZGJvbSA9PT0gb2JqMi5jb2RcbiAgICAgICAgICAgICAgICAgICk7IFxuICAgICAgICAgICAgICAgICAgaWYgKCFleGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhdCA9IG9iai5MYXQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsbmcgPSBvYmouTG9uZztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdG8gPVxuICAgICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0cmVldHZpZXc/c2l6ZT02MDZ4NDAwJmxvY2F0aW9uPVwiICtcbiAgICAgICAgICAgICAgICAgICAgICBsYXQgKyBcIixcIiArIGxuZyArXG4gICAgICAgICAgICAgICAgICAgICAgXCImcGl0Y2g9LTAuNzYma2V5PUFJemFTeURTSkc4SmtOSjNpN3B5SFp6MWdDMVRZVlVpY20zQzNzRVwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICBpZF9pbWc6IHV1aWQudjQoKSxcbiAgICAgICAgICAgICAgICAgICAgICBpZF9zZXJ2OiBpZF9zZXJ2aWNpbyxcbiAgICAgICAgICAgICAgICAgICAgICBub21iOiBvYmoubm9tYnJlLFxuICAgICAgICAgICAgICAgICAgICAgIGRpcmVjOiBvYmouZGlyZWNjaW9uLFxuICAgICAgICAgICAgICAgICAgICAgIHRlbF8xOiBvYmoudGVsZWZvbm9zLFxuICAgICAgICAgICAgICAgICAgICAgIGhvcjogb2JqLmhvcmFyaW8sXG4gICAgICAgICAgICAgICAgICAgICAgdGVsXzI6IG9iai50ZWxlZm9ub3MyLFxuICAgICAgICAgICAgICAgICAgICAgIGNvcjogb2JqLmNvcnJlbyxcbiAgICAgICAgICAgICAgICAgICAgICB1cmw6IG9iai5saW5rX3dlYixcbiAgICAgICAgICAgICAgICAgICAgICBkZXNjOiBvYmouZGVzYyxcbiAgICAgICAgICAgICAgICAgICAgICBsYXQ6IG9iai5MYXQsXG4gICAgICAgICAgICAgICAgICAgICAgbG5nOiBvYmouTG9uZyxcbiAgICAgICAgICAgICAgICAgICAgICBmb3RvOiBmb3RvLFxuICAgICAgICAgICAgICAgICAgICAgIGFicmV2OiBvYmouYWJyZXYsXG4gICAgICAgICAgICAgICAgICAgICAgY29kOiBvYmouY29kYm9tLFxuICAgICAgICAgICAgICAgICAgICAgIGZfZnVuZGE6IG9iai5mZWNoYV9mdW5kYWNpb24sXG4gICAgICAgICAgICAgICAgICAgICAgZHI6IG9iai5kcixcbiAgICAgICAgICAgICAgICAgICAgICBjYXJnbzogb2JqLmNhcmdvLFxuICAgICAgICAgICAgICAgICAgICAgIGNvZGlkZW5lc3Q6IG9iai5jb2RpZGVuZXN0LFxuICAgICAgICAgICAgICAgICAgICAgIHViaWc6IG9iai51YmlnZW9cbiAgICAgICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5ndWFyZGFyKHRlbXApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcDtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gaHVibyBjYW1iaW9zXCIpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2UgaWYoaWQgPT09IDUpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyAkc2NvcGUubG9hZF9hbGxCb21iZXJvcygpO1xuXG4gICAgICAvLyBmdW5jdGlvbiBnZW9jb2RlUmVzdWx0KHJlc3VsdHMsIHN0YXR1cykge1xuICAgICAgLy8gICAgIGlmIChzdGF0dXMgPT0gJ09LJykge1xuICAgICAgLy8gICAgICAgICB2YXIgbWFya2VyT3B0aW9ucyA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb247XG4gICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICAgICAgLy8gRW4gY2FzbyBkZSBubyBoYWJlciByZXN1bHRhZG9zIG8gcXVlIGhheWEgb2N1cnJpZG8gdW4gZXJyb3JcbiAgICAgIC8vICAgICAgICAgLy8gbGFuemFtb3MgdW4gbWVuc2FqZSBjb24gZWwgZXJyb3JcbiAgICAgIC8vICAgICAgICAgYWxlcnQoXCJHZW9jb2Rpbmcgbm8gdHV2byDDqXhpdG8gZGViaWRvIGE6IFwiICsgc3RhdHVzKTtcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyB9XG4gICAgICAvLyAkc2NvcGUuY2FqZXJvKCk7XG4gICAgICAvLyAkc2NvcGUuY3JlYXRlX2JvbWJlcm9zKCk7XG4gICAgfVxuICBdKTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ1NlcnZpY2VzJywgW10pXG4uZmFjdG9yeSgnU2VydmljZXMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHJldHVybiB7IFxuICAgICAgICBMb2FkOiBmdW5jdGlvbihxLGlkX3NlcnYscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucz9ub21icmU9JytxKycmaWRfc2Vydj0nK2lkX3NlcnYrJyZwZXJfcGFnZT0nK3ArJyZwYWdlPScrcGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIFNlZTogZnVuY3Rpb24oaWQpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zLycraWQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBFZGl0OiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIFxuICAgICAgICBVcGRhdGU6IGZ1bmN0aW9uKGlkLGRhdGEpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zLycraWQsZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIENyZWF0ZTogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zJyxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgRGVsZXRlOiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gIGIkaHR0cC5kZWxldGUoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucy8nK2lkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSAsXG4gICAgICAgIGxvYWRfYm9tYmVyb3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NpYXNCeUlkLzIyNTAwMCcpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIGFnZW5jaWE6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJuLmNvbS5wZS9jYW5hbGVzLWF0ZW5jaW9uL2Jhc2UtZGF0b3MvYWdlbmNpYXMuYXNwJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9LFxuICAgICAgICBjYWplcm86IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJuLmNvbS5wZS9jYW5hbGVzLWF0ZW5jaW9uL2Jhc2UtZGF0b3MvY2FqZXJvcy5hc3AnKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAsIFxuICAgICAgICAvLyBhZ2VudGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAvLyAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ibi5jb20ucGUvY2FuYWxlcy1hdGVuY2lvbi9iYXNlLWRhdG9zL2FnZW50ZXMuYXNwJykudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAvLyAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyB9XG4gICAgICAgICxcbiAgICAgICAgbG9hZF9ob3NwaXRhbGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2dydXBvYWl6ZW4uY29tL2hvc3BpdGFsZXMuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZF9hZ2VudGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2dydXBvYWl6ZW4uY29tL2JhbmNvX25hY2lvbl9hZ2VudGVzLmpzb24nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIFxuICAgICAgICBjcmVhdGVEYXRhVG9Kc29uOiBmdW5jdGlvbih1cmwpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCh1cmwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgXG4gICAgfTtcbn0pOyBcbn0pKCk7Il19
