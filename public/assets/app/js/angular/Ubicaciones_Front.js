(function () {
'use strict';
var model = angular.module('model', 
    ['Services']);

var seletedValue = 15;

model.controller('Ctrl', 
    ['$scope',
    '$http',
    '$timeout',
    'Services',  
    function(
        $scope,
        $http,
        $timeout,
        Services)
{  
    var html = function(id) { 
        return document.getElementById(id); 
    };

    $scope.temp = [];
    $scope.new_marker = [];
    $scope.data_real = [];
    $scope.cant_rows = "10";
    $scope.mapa = 'full';
    
    $scope.load = function(q,p,page){
        if(q == undefined){ 
            q = "";
        }   
        Services.Load(q,p,page).then(function (response) {
            $scope.data_load = response.data; 
            // $scope.temp.push($scope.data_load);  
            $scope.to = response.to; 
            $scope.total = response.total;
            $scope.last_page = response.last_page;
            $scope.current_page = response.current_page;
            $scope.next_page_url = response.next_page_url;
            $scope.prev_page_url = response.prev_page_url; 
            if($scope.prev_page_url !== null) {
                $scope.prev_page_url = $scope.prev_page_url.replace("?page=","");
            }
            if($scope.next_page_url !== null) {
                $scope.next_page_url = $scope.next_page_url.replace("?page=",""); 
            } 
        }, function (response) {
        }); 
    } 

    $scope.load_services = function(q,p,page){
        if(q == undefined){ 
            q = "";
        }  
        Services.Load_Services(q,p,page).then(function (response) {
            $scope.data_load_services = response.data;
            $scope.to = response.to; 
            $scope.total = response.total;
            $scope.last_page = response.last_page;
            $scope.current_page = response.current_page;
            $scope.next_page_url = response.next_page_url;
            $scope.prev_page_url = response.prev_page_url; 
            if($scope.prev_page_url !== null) {
                $scope.prev_page_url = $scope.prev_page_url.replace("?page=","");
            }
            if($scope.next_page_url !== null) {
                $scope.next_page_url = $scope.next_page_url.replace("?page=",""); 
            }  
            // console.log($scope.data_load_services);
        }, function (response) {
        }); 
    };

    $scope.load_services('',10,1);


    
    
    $scope.init = function(){
        $scope.load('',200,1);
    }   

    $scope.show_panel = true;
    $scope.show_detalle = false;
    $scope.disable_button = false;
    var map,map2,marker;
    var infoWindow = null;
    infoWindow = new google.maps.InfoWindow(); 
    
    var directionsDisplay = null;
    var directionsService = null; 
    // var style = [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#31466a"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":"-13"},{"lightness":"6"},{"gamma":"1.81"},{"color":"#c9ccd1"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"weight":"1.82"}]},{"featureType":"landscape","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"lightness":"3"},{"gamma":"0.00"},{"saturation":"-1"},{"weight":"2.30"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"on"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"},{"saturation":"-100"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"on"},{"saturation":"-100"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#5375ac"},{"visibility":"on"}]}];
    var style = [
        {
            "featureType": "administrative.country",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "hue": "#ff0000"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.attraction",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.business",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ];

    function closeInfoWindow(){
        infoWindow = new google.maps.InfoWindow(); 
        infoWindow.close();
    } 
    
    $scope.Map = function() {
        map = new google.maps.Map(document.getElementById('mapa'), {
            center: {lat: -12.046629, lng: -77.0214337},
            zoom: 11,
            styles : style
        });
        // directionsDisplay = new google.maps.DirectionsRenderer();
        // directionsService = new google.maps.DirectionsService();
        
    }
    $scope.Map(); 


    $scope.initMap = function() { 
        $scope.$watch('search_text', function(n){ 
            if(n != undefined){
                $scope.load($scope.search_text,10,1); 
            }
            else{
                $scope.load('',$scope.cant_rows,1); 
            }
        });           
    }

    $scope.resize = function(map){
        google.maps.event.addListenerOnce(map, 'bounds_changed', function () {
           google.maps.event.trigger(map, 'resize');
           var bounds = map.getBounds();
        });
    }; 

    $scope.getKilometros = function(lat1,lon1,lat2,lon2){
        function rad(x) {
            return x * Math.PI/180;
        }
        var R = 6378.137; //Radio de la tierra en km
        var dLat = rad( lat2 - lat1 );
        var dLong = rad( lon2 - lon1 );
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        var result = d.toFixed(3); 
        return result; //Retorna tres decimales
    };

    function getMinFromArray (array_of_values) {
        var min = Math.min.apply(null, array_of_values);
        return min;   
    };

    // google.maps.event.addListener(marker, 'click', function (e) {
    //     alert("clicked marker");
    // });

    
    $scope.location = function(){  
        if (navigator.geolocation) {
            // INIT RESIZE 
            $scope.mapa = 'detalle'; 
            $scope.disable_button = true; 
            $scope.data = [];

            $scope.init(); 
            navigator.geolocation.getCurrentPosition(function(position) {    
                $scope.createMarker(map);
                $scope.posicion_actual = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }; 
                var image = {
                    url: '/assets/app/images/position_actual.png', 
                    size: new google.maps.Size(50, 50), 
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 40)
                }; 
                var marker = new google.maps.Marker({
                    position: $scope.posicion_actual,
                    map: map,
                    icon: image
                });

                var circle = new google.maps.Circle({
                    center: $scope.posicion_actual,
                    radius: 1000,
                    map: map,
                    fillColor: '#39527b',
                    fillOpacity: 0.1,
                    strokeColor: '#39527b',
                    strokeOpacity: 0.2
                });   
                
                for (var i = $scope.data_load.length; i--;){ 
                    if(parseFloat( $scope.getKilometros( $scope.posicion_actual.lat, $scope.posicion_actual.lng, $scope.data_load[i].lat, $scope.data_load[i].lng)) <= 1){   
                        $scope.data_real.push($scope.data_load[i]);
                        console.log($scope.data_real);
                        $scope.$digest();
                        // var min = Math.min.apply(null, array);
                        // console.log(i +' el minimo es: '+ min);
                        // console.log(result);
                        // console.log($scope.data_load[i]);
                        // if(i == 0){
                        //     console.log($scope.data_load[i]);
                        //     $.getJSON(geocoding).done(function(location) {
                        //         // console.log(location);
                        //         var start = location.results[0].formatted_address;
                        //         var end = $scope.data_load[3].direccion;
                        //         if(!start || !end){
                        //             alert("Start and End addresses are required");
                        //             return;
                        //         }
                        //         var request = {
                        //                 origin: start,
                        //                 destination: end,
                        //                 travelMode: google.maps.DirectionsTravelMode['WALKING'],
                        //                 unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
                        //                 provideRouteAlternatives: false
                        //         };

                        //         directionsService.route(request, function(response, status) {
                        //             if (status == google.maps.DirectionsStatus.OK) {
                        //                 directionsDisplay.setMap(map);
                        //                 directionsDisplay.setPanel($("#directions_panel").get(0));
                        //                 directionsDisplay.setDirections(response);
                        //             } else {
                        //                 console.log(response,status);
                        //                 alert("There is no directions available between these two points");
                        //             }
                        //         });
                        //     })
                        // }
                        
                    } 
                    else{ 
                        $scope.del($scope.data_load.indexOf($scope.data_load[i])); 
                        $scope.new_marker[i].setMap(null);  
                        $scope.$digest(); 
                    } 
                } 

                
                map.setZoom(18);
                map.panTo(marker.position);
                map.fitBounds(circle.getBounds());
            }, function() {   
                $scope.handleLocationError(true, infoWindow, map.getCenter());
            }); 
        } else { 
            $scope.handleLocationError(false, infoWindow, map.getCenter());

        }
         
    }
    $scope.toggle_Marker = function(id){ 
        console.log(id);
        $scope.id = document.getElementById(id);;
        $scope.id.checked = !$scope.id.checked; 
        if($('#'+id).is(':checked')){
            for(var i = 0; i < $scope.new_marker.length; i++){
                if($scope.new_marker[i].type === id){ 
                    $scope.new_marker[i].setVisible(true);
                    
                }
            }
        }
        else{
            for(var i = 0; i < $scope.new_marker.length; i++){
                if($scope.new_marker[i].type === id){ 
                    $scope.new_marker[i].setVisible(false);
                    
                }
            }
        }
    }
    // Elimina 1 x 1 cada dato que no esta en el rango
    $scope.del = function(index){  
        $scope.data_load.splice(index,1);  
    };
    // Hace un recorrido al array de marcadores
    $scope.setMapOnAll = function(map) {
        for(var i = 0; i < $scope.new_marker.length; i++) { 
            $scope.new_marker[i].setMap(map);
        }
    }
    // limpia todos los marcadores a null
    $scope.clearMarkers = function() {
        $scope.setMapOnAll(null);
    }
    // funcion llama a limpiar todos los marcadores
    $scope.deleteMarkers = function() {
        $scope.clearMarkers();
        $scope.new_marker = [];
    } 

    $scope.handleLocationError= function(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: El servicio de Geolocalizacion Falló.' :
            'Error: Your browser doesn\'t support geolocation.');
    } 

    
    
    $scope.createMarker = function(map) {  
        for (var i = 0; i < $scope.data_load.length; i++) {  
            var beach = $scope.data_load[i]; 
            var pos = {
              lat: parseFloat(beach.lat),
              lng: parseFloat(beach.lng)
            }; 
            if(beach.id_services === 1){
                var image = { 
                    url: '//localhost:3000/assets/app/images/banco.svg', 
                    scaledSize: new google.maps.Size(20, 20), 
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0),
                    scale: 1
                };  
            } 
            else if(beach.id_services === 2){
                var image = { 
                    url: '//localhost:3000/assets/app/images/comisaria.svg', 
                    scaledSize: new google.maps.Size(20, 20),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0),
                    scale: 1
                };  
            }
            else if(beach.id_services === 3){
                var image = { 
                    url: '//localhost:3000/assets/app/images/hospital.svg', 
                    scaledSize: new google.maps.Size(20, 20),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0),
                    scale: 1
                };  
            }
            else if(beach.id_services === 4){
                var image = { 
                    url: '//localhost:3000/assets/app/images/comisaria.svg', 
                    scaledSize: new google.maps.Size(20, 20),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0),
                    scale: 1
                };  
            }
            else if(beach.id_services === 5){
                var image = { 
                    url: '//localhost:3000/assets/app/images/comisaria.svg', 
                    scaledSize: new google.maps.Size(20, 20),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0),
                    scale: 1
                };  
            }
            else{
                console.log("Ocurrio un error inesperado en los ID "+beach.id_services+" de Entidades");
            } 
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                animation: google.maps.Animation.DROP, 
                draggable: false,
                icon: image,
                type: beach.id_services,

            }); 
            $scope.new_marker.push(marker); 
            $scope.markers_hover(marker); 
        }
        console.log($scope.new_marker);
        //cierra el infowindow una vez cambie
        infoWindow.close();
    } 

    function toggleBounce() { 
        // marker.setAnimation(google.maps.Animation.BOUNCE); 
    }
    
    
    $scope.markers_hover = function(lat, lng,foto,titulo,direccion,data){ 
        
        var pos = {};
        pos.lat = parseFloat(lat);
        pos.lng = parseFloat(lng); 
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({map: map,maxWidth: 200});
        infoWindow.setPosition(pos); 
        infoWindow.setContent(
            [
                '<div class="center globo_ubicacion">', 
                '<img width="100%" src="'+foto+'">',
                '<h6>'+titulo+'</h6>', 
                '<p>'+direccion+'</p>', 
                '</div>'
            ].join('')
        ); 
        $scope.set_google_maps(); 
    } 
    $scope.set_google_maps = function(){
        var iwOuter = $('.gm-style-iw');
        var iwCloseBtn = iwOuter.next();
        var iwBackground = iwOuter.prev(); 
        iwBackground.children(':nth-child(2)').css({'display' : 'none'}); 
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});
        iwOuter.parent().parent().css({left: '40px'});
        iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
        iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
        iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 0, 0, 0) 0px 1px 6px', 'z-index' : '1'});
        iwBackground.children(':nth-child(3)').children(':nth-child(1)').find('div').attr('style', function(i,s){ return s + 'height: 21px !important;'+'width: 10px !important;'+'left:7px !important;'});
        iwBackground.children(':nth-child(3)').children(':nth-child(2)').find('div').attr('style', function(i,s){ return s + 'height: 25px !important;'+'width: 9px !important;'});
        iwCloseBtn.css({'display': 'none'});
    };

    $scope.show_marker = function(data){
        $scope.show_detalle = true;
        // console.log(data);
        $scope.detalle = data;
        $scope.show_panel = false;
    };

    $scope.return = function(){
        $scope.show_detalle = false; 
        $scope.show_panel = true;
    };
 
}]); 
model.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});
})();
(function () {
'use strict';
angular.module('Services', [])
.factory('Services', function($http) {
    return { 
        Load: function(q,p,page){
            return $http.get(base_url +'/api/v1/locations?nombre='+q+'&per_page='+p+'&page='+page).then(function (response){  
                return response.data;
            });
        },
        Load_Services: function(q,p,page){
            return $http.get(base_url +'/api/v1/services?nombre='+q+'&per_page='+p+'&page='+page).then(function (response){  
                return response.data;
            });
        }
    };
}); 
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVWJpY2FjaW9uZXNfRnJvbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xudmFyIG1vZGVsID0gYW5ndWxhci5tb2R1bGUoJ21vZGVsJywgXG4gICAgWydTZXJ2aWNlcyddKTtcblxudmFyIHNlbGV0ZWRWYWx1ZSA9IDE1O1xuXG5tb2RlbC5jb250cm9sbGVyKCdDdHJsJywgXG4gICAgWyckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnU2VydmljZXMnLCAgXG4gICAgZnVuY3Rpb24oXG4gICAgICAgICRzY29wZSxcbiAgICAgICAgJGh0dHAsXG4gICAgICAgICR0aW1lb3V0LFxuICAgICAgICBTZXJ2aWNlcylcbnsgIFxuICAgIHZhciBodG1sID0gZnVuY3Rpb24oaWQpIHsgXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7IFxuICAgIH07XG5cbiAgICAkc2NvcGUudGVtcCA9IFtdO1xuICAgICRzY29wZS5uZXdfbWFya2VyID0gW107XG4gICAgJHNjb3BlLmRhdGFfcmVhbCA9IFtdO1xuICAgICRzY29wZS5jYW50X3Jvd3MgPSBcIjEwXCI7XG4gICAgJHNjb3BlLm1hcGEgPSAnZnVsbCc7XG4gICAgXG4gICAgJHNjb3BlLmxvYWQgPSBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgIGlmKHEgPT0gdW5kZWZpbmVkKXsgXG4gICAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfSAgIFxuICAgICAgICBTZXJ2aWNlcy5Mb2FkKHEscCxwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZCA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgICAgLy8gJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTsgIFxuICAgICAgICAgICAgJHNjb3BlLnRvID0gcmVzcG9uc2UudG87IFxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDsgXG4gICAgICAgICAgICBpZigkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gJHNjb3BlLnByZXZfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9ICRzY29wZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7IFxuICAgIH0gXG5cbiAgICAkc2NvcGUubG9hZF9zZXJ2aWNlcyA9IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgaWYocSA9PSB1bmRlZmluZWQpeyBcbiAgICAgICAgICAgIHEgPSBcIlwiO1xuICAgICAgICB9ICBcbiAgICAgICAgU2VydmljZXMuTG9hZF9TZXJ2aWNlcyhxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWRfc2VydmljZXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgJHNjb3BlLnRvID0gcmVzcG9uc2UudG87IFxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDsgXG4gICAgICAgICAgICBpZigkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gJHNjb3BlLnByZXZfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9ICRzY29wZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTsgXG4gICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRfc2VydmljZXMpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7IFxuICAgIH07XG5cbiAgICAkc2NvcGUubG9hZF9zZXJ2aWNlcygnJywxMCwxKTtcblxuXG4gICAgXG4gICAgXG4gICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubG9hZCgnJywyMDAsMSk7XG4gICAgfSAgIFxuXG4gICAgJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlO1xuICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTtcbiAgICAkc2NvcGUuZGlzYWJsZV9idXR0b24gPSBmYWxzZTtcbiAgICB2YXIgbWFwLG1hcDIsbWFya2VyO1xuICAgIHZhciBpbmZvV2luZG93ID0gbnVsbDtcbiAgICBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTsgXG4gICAgXG4gICAgdmFyIGRpcmVjdGlvbnNEaXNwbGF5ID0gbnVsbDtcbiAgICB2YXIgZGlyZWN0aW9uc1NlcnZpY2UgPSBudWxsOyBcbiAgICAvLyB2YXIgc3R5bGUgPSBbe1wiZmVhdHVyZVR5cGVcIjpcImFkbWluaXN0cmF0aXZlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzMxNDY2YVwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOlwiLTEzXCJ9LHtcImxpZ2h0bmVzc1wiOlwiNlwifSx7XCJnYW1tYVwiOlwiMS44MVwifSx7XCJjb2xvclwiOlwiI2M5Y2NkMVwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHNcIixcInN0eWxlcnNcIjpbe1wid2VpZ2h0XCI6XCIxLjgyXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0XCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LmZpbGxcIixcInN0eWxlcnNcIjpbe1wibGlnaHRuZXNzXCI6XCIzXCJ9LHtcImdhbW1hXCI6XCIwLjAwXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xXCJ9LHtcIndlaWdodFwiOlwiMi4zMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJwb2lcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOi0xMDB9LHtcImxpZ2h0bmVzc1wiOjQ1fSx7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmhpZ2h3YXlcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuYXJ0ZXJpYWxcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMuaWNvblwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn0se1wic2F0dXJhdGlvblwiOlwiLTEwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ0cmFuc2l0XCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9uXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwid2F0ZXJcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiM1Mzc1YWNcIn0se1widmlzaWJpbGl0eVwiOlwib25cIn1dfV07XG4gICAgdmFyIHN0eWxlID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUuY291bnRyeVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaHVlXCI6IFwiI2ZmMDAwMFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuYXR0cmFjdGlvblwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLmJ1c2luZXNzXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gY2xvc2VJbmZvV2luZG93KCl7XG4gICAgICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgIH0gXG4gICAgXG4gICAgJHNjb3BlLk1hcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBhJyksIHtcbiAgICAgICAgICAgIGNlbnRlcjoge2xhdDogLTEyLjA0NjYyOSwgbG5nOiAtNzcuMDIxNDMzN30sXG4gICAgICAgICAgICB6b29tOiAxMSxcbiAgICAgICAgICAgIHN0eWxlcyA6IHN0eWxlXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoKTtcbiAgICAgICAgLy8gZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbiAgICAgICAgXG4gICAgfVxuICAgICRzY29wZS5NYXAoKTsgXG5cblxuICAgICRzY29wZS5pbml0TWFwID0gZnVuY3Rpb24oKSB7IFxuICAgICAgICAkc2NvcGUuJHdhdGNoKCdzZWFyY2hfdGV4dCcsIGZ1bmN0aW9uKG4peyBcbiAgICAgICAgICAgIGlmKG4gIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZCgkc2NvcGUuc2VhcmNoX3RleHQsMTAsMSk7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZCgnJywkc2NvcGUuY2FudF9yb3dzLDEpOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7ICAgICAgICAgICBcbiAgICB9XG5cbiAgICAkc2NvcGUucmVzaXplID0gZnVuY3Rpb24obWFwKXtcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKG1hcCwgJ2JvdW5kc19jaGFuZ2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICAgICB2YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpO1xuICAgICAgICB9KTtcbiAgICB9OyBcblxuICAgICRzY29wZS5nZXRLaWxvbWV0cm9zID0gZnVuY3Rpb24obGF0MSxsb24xLGxhdDIsbG9uMil7XG4gICAgICAgIGZ1bmN0aW9uIHJhZCh4KSB7XG4gICAgICAgICAgICByZXR1cm4geCAqIE1hdGguUEkvMTgwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBSID0gNjM3OC4xMzc7IC8vUmFkaW8gZGUgbGEgdGllcnJhIGVuIGttXG4gICAgICAgIHZhciBkTGF0ID0gcmFkKCBsYXQyIC0gbGF0MSApO1xuICAgICAgICB2YXIgZExvbmcgPSByYWQoIGxvbjIgLSBsb24xICk7XG4gICAgICAgIHZhciBhID0gTWF0aC5zaW4oZExhdC8yKSAqIE1hdGguc2luKGRMYXQvMikgKyBNYXRoLmNvcyhyYWQobGF0MSkpICogTWF0aC5jb3MocmFkKGxhdDIpKSAqIE1hdGguc2luKGRMb25nLzIpICogTWF0aC5zaW4oZExvbmcvMik7XG4gICAgICAgIHZhciBjID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMS1hKSk7XG4gICAgICAgIHZhciBkID0gUiAqIGM7XG4gICAgICAgIHZhciByZXN1bHQgPSBkLnRvRml4ZWQoMyk7IFxuICAgICAgICByZXR1cm4gcmVzdWx0OyAvL1JldG9ybmEgdHJlcyBkZWNpbWFsZXNcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0TWluRnJvbUFycmF5IChhcnJheV9vZl92YWx1ZXMpIHtcbiAgICAgICAgdmFyIG1pbiA9IE1hdGgubWluLmFwcGx5KG51bGwsIGFycmF5X29mX3ZhbHVlcyk7XG4gICAgICAgIHJldHVybiBtaW47ICAgXG4gICAgfTtcblxuICAgIC8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyAgICAgYWxlcnQoXCJjbGlja2VkIG1hcmtlclwiKTtcbiAgICAvLyB9KTtcblxuICAgIFxuICAgICRzY29wZS5sb2NhdGlvbiA9IGZ1bmN0aW9uKCl7ICBcbiAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgICAgICAgICAgLy8gSU5JVCBSRVNJWkUgXG4gICAgICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICAgICAkc2NvcGUuZGlzYWJsZV9idXR0b24gPSB0cnVlOyBcbiAgICAgICAgICAgICRzY29wZS5kYXRhID0gW107XG5cbiAgICAgICAgICAgICRzY29wZS5pbml0KCk7IFxuICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbikgeyAgICBcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3JlYXRlTWFya2VyKG1hcCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCA9IHtcbiAgICAgICAgICAgICAgICAgIGxhdDogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgICAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsIFxuICAgICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg1MCwgNTApLCBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCA0MClcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogaW1hZ2VcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBjaXJjbGUgPSBuZXcgZ29vZ2xlLm1hcHMuQ2lyY2xlKHtcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6ICcjMzk1MjdiJyxcbiAgICAgICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAuMSxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6ICcjMzk1MjdiJyxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlT3BhY2l0eTogMC4yXG4gICAgICAgICAgICAgICAgfSk7ICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpLS07KXsgXG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcnNlRmxvYXQoICRzY29wZS5nZXRLaWxvbWV0cm9zKCAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxhdCwgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sbmcsICRzY29wZS5kYXRhX2xvYWRbaV0ubGF0LCAkc2NvcGUuZGF0YV9sb2FkW2ldLmxuZykpIDw9IDEpeyAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFfcmVhbC5wdXNoKCRzY29wZS5kYXRhX2xvYWRbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfcmVhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIG1pbiA9IE1hdGgubWluLmFwcGx5KG51bGwsIGFycmF5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkgKycgZWwgbWluaW1vIGVzOiAnKyBtaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaSA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFyIHN0YXJ0ID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFyIGVuZCA9ICRzY29wZS5kYXRhX2xvYWRbM10uZGlyZWNjaW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBpZighc3RhcnQgfHwgIWVuZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBhbGVydChcIlN0YXJ0IGFuZCBFbmQgYWRkcmVzc2VzIGFyZSByZXF1aXJlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBvcmlnaW46IHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBlbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1RyYXZlbE1vZGVbJ1dBTEtJTkcnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB1bml0U3lzdGVtOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVW5pdFN5c3RlbVsnTUVUUklDJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgcHJvdmlkZVJvdXRlQWx0ZXJuYXRpdmVzOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGRpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKCQoXCIjZGlyZWN0aW9uc19wYW5lbFwiKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSxzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlcmUgaXMgbm8gZGlyZWN0aW9ucyBhdmFpbGFibGUgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgIGVsc2V7IFxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlbCgkc2NvcGUuZGF0YV9sb2FkLmluZGV4T2YoJHNjb3BlLmRhdGFfbG9hZFtpXSkpOyBcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyW2ldLnNldE1hcChudWxsKTsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTsgXG4gICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG1hcC5zZXRab29tKDE4KTtcbiAgICAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBtYXAuZml0Qm91bmRzKGNpcmNsZS5nZXRCb3VuZHMoKSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHsgICBcbiAgICAgICAgICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcih0cnVlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuICAgICAgICAgICAgfSk7IFxuICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKGZhbHNlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuXG4gICAgICAgIH1cbiAgICAgICAgIFxuICAgIH1cbiAgICAkc2NvcGUudG9nZ2xlX01hcmtlciA9IGZ1bmN0aW9uKGlkKXsgXG4gICAgICAgIGNvbnNvbGUubG9nKGlkKTtcbiAgICAgICAgJHNjb3BlLmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpOztcbiAgICAgICAgJHNjb3BlLmlkLmNoZWNrZWQgPSAhJHNjb3BlLmlkLmNoZWNrZWQ7IFxuICAgICAgICBpZigkKCcjJytpZCkuaXMoJzpjaGVja2VkJykpe1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5uZXdfbWFya2VyLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBpZigkc2NvcGUubmV3X21hcmtlcltpXS50eXBlID09PSBpZCl7IFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlcltpXS5zZXRWaXNpYmxlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUubmV3X21hcmtlci5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaWYoJHNjb3BlLm5ld19tYXJrZXJbaV0udHlwZSA9PT0gaWQpeyBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbaV0uc2V0VmlzaWJsZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBFbGltaW5hIDEgeCAxIGNhZGEgZGF0byBxdWUgbm8gZXN0YSBlbiBlbCByYW5nb1xuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbihpbmRleCl7ICBcbiAgICAgICAgJHNjb3BlLmRhdGFfbG9hZC5zcGxpY2UoaW5kZXgsMSk7ICBcbiAgICB9O1xuICAgIC8vIEhhY2UgdW4gcmVjb3JyaWRvIGFsIGFycmF5IGRlIG1hcmNhZG9yZXNcbiAgICAkc2NvcGUuc2V0TWFwT25BbGwgPSBmdW5jdGlvbihtYXApIHtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5uZXdfbWFya2VyLmxlbmd0aDsgaSsrKSB7IFxuICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbaV0uc2V0TWFwKG1hcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gbGltcGlhIHRvZG9zIGxvcyBtYXJjYWRvcmVzIGEgbnVsbFxuICAgICRzY29wZS5jbGVhck1hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnNldE1hcE9uQWxsKG51bGwpO1xuICAgIH1cbiAgICAvLyBmdW5jaW9uIGxsYW1hIGEgbGltcGlhciB0b2RvcyBsb3MgbWFyY2Fkb3Jlc1xuICAgICRzY29wZS5kZWxldGVNYXJrZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5jbGVhck1hcmtlcnMoKTtcbiAgICAgICAgJHNjb3BlLm5ld19tYXJrZXIgPSBbXTtcbiAgICB9IFxuXG4gICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3I9IGZ1bmN0aW9uKGJyb3dzZXJIYXNHZW9sb2NhdGlvbiwgaW5mb1dpbmRvdywgcG9zKSB7XG4gICAgICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KGJyb3dzZXJIYXNHZW9sb2NhdGlvbiA/XG4gICAgICAgICAgICAnRXJyb3I6IEVsIHNlcnZpY2lvIGRlIEdlb2xvY2FsaXphY2lvbiBGYWxsw7MuJyA6XG4gICAgICAgICAgICAnRXJyb3I6IFlvdXIgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBnZW9sb2NhdGlvbi4nKTtcbiAgICB9IFxuXG4gICAgXG4gICAgXG4gICAgJHNjb3BlLmNyZWF0ZU1hcmtlciA9IGZ1bmN0aW9uKG1hcCkgeyAgXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGg7IGkrKykgeyAgXG4gICAgICAgICAgICB2YXIgYmVhY2ggPSAkc2NvcGUuZGF0YV9sb2FkW2ldOyBcbiAgICAgICAgICAgIHZhciBwb3MgPSB7XG4gICAgICAgICAgICAgIGxhdDogcGFyc2VGbG9hdChiZWFjaC5sYXQpLFxuICAgICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQoYmVhY2gubG5nKVxuICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICBpZihiZWFjaC5pZF9zZXJ2aWNlcyA9PT0gMSl7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6MzAwMC9hc3NldHMvYXBwL2ltYWdlcy9iYW5jby5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGVsc2UgaWYoYmVhY2guaWRfc2VydmljZXMgPT09IDIpe1xuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjMwMDAvYXNzZXRzL2FwcC9pbWFnZXMvY29taXNhcmlhLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihiZWFjaC5pZF9zZXJ2aWNlcyA9PT0gMyl7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6MzAwMC9hc3NldHMvYXBwL2ltYWdlcy9ob3NwaXRhbC5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoYmVhY2guaWRfc2VydmljZXMgPT09IDQpe1xuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjMwMDAvYXNzZXRzL2FwcC9pbWFnZXMvY29taXNhcmlhLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihiZWFjaC5pZF9zZXJ2aWNlcyA9PT0gNSl7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6MzAwMC9hc3NldHMvYXBwL2ltYWdlcy9jb21pc2FyaWEuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT2N1cnJpbyB1biBlcnJvciBpbmVzcGVyYWRvIGVuIGxvcyBJRCBcIitiZWFjaC5pZF9zZXJ2aWNlcytcIiBkZSBFbnRpZGFkZXNcIik7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCwgXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBpY29uOiBpbWFnZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBiZWFjaC5pZF9zZXJ2aWNlcyxcblxuICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXIucHVzaChtYXJrZXIpOyBcbiAgICAgICAgICAgICRzY29wZS5tYXJrZXJzX2hvdmVyKG1hcmtlcik7IFxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5uZXdfbWFya2VyKTtcbiAgICAgICAgLy9jaWVycmEgZWwgaW5mb3dpbmRvdyB1bmEgdmV6IGNhbWJpZVxuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgfSBcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUJvdW5jZSgpIHsgXG4gICAgICAgIC8vIG1hcmtlci5zZXRBbmltYXRpb24oZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkJPVU5DRSk7IFxuICAgIH1cbiAgICBcbiAgICBcbiAgICAkc2NvcGUubWFya2Vyc19ob3ZlciA9IGZ1bmN0aW9uKGxhdCwgbG5nLGZvdG8sdGl0dWxvLGRpcmVjY2lvbixkYXRhKXsgXG4gICAgICAgIFxuICAgICAgICB2YXIgcG9zID0ge307XG4gICAgICAgIHBvcy5sYXQgPSBwYXJzZUZsb2F0KGxhdCk7XG4gICAgICAgIHBvcy5sbmcgPSBwYXJzZUZsb2F0KGxuZyk7IFxuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXAsbWF4V2lkdGg6IDIwMH0pO1xuICAgICAgICBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7IFxuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjZW50ZXIgZ2xvYm9fdWJpY2FjaW9uXCI+JywgXG4gICAgICAgICAgICAgICAgJzxpbWcgd2lkdGg9XCIxMDAlXCIgc3JjPVwiJytmb3RvKydcIj4nLFxuICAgICAgICAgICAgICAgICc8aDY+Jyt0aXR1bG8rJzwvaDY+JywgXG4gICAgICAgICAgICAgICAgJzxwPicrZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIF0uam9pbignJylcbiAgICAgICAgKTsgXG4gICAgICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTsgXG4gICAgfSBcbiAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGl3T3V0ZXIgPSAkKCcuZ20tc3R5bGUtaXcnKTtcbiAgICAgICAgdmFyIGl3Q2xvc2VCdG4gPSBpd091dGVyLm5leHQoKTtcbiAgICAgICAgdmFyIGl3QmFja2dyb3VuZCA9IGl3T3V0ZXIucHJldigpOyBcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTsgXG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCg0KScpLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSk7XG4gICAgICAgIGl3T3V0ZXIucGFyZW50KCkucGFyZW50KCkuY3NzKHtsZWZ0OiAnNDBweCd9KTtcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdsZWZ0OiA4NHB4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDg0cHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmZpbmQoJ2RpdicpLmNoaWxkcmVuKCkuY3NzKHsnYm94LXNoYWRvdyc6ICdyZ2JhKDAsIDAsIDAsIDApIDBweCAxcHggNnB4JywgJ3otaW5kZXgnIDogJzEnfSk7XG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDIxcHggIWltcG9ydGFudDsnKyd3aWR0aDogMTBweCAhaW1wb3J0YW50OycrJ2xlZnQ6N3B4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpLmZpbmQoJ2RpdicpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnaGVpZ2h0OiAyNXB4ICFpbXBvcnRhbnQ7Jysnd2lkdGg6IDlweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgICAgaXdDbG9zZUJ0bi5jc3MoeydkaXNwbGF5JzogJ25vbmUnfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaG93X21hcmtlciA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gdHJ1ZTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICRzY29wZS5kZXRhbGxlID0gZGF0YTtcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJldHVybiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTtcbiAgICB9O1xuIFxufV0pOyBcbm1vZGVsLmRpcmVjdGl2ZSgndG9vbHRpcCcsIGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICQoZWxlbWVudCkuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBvbiBtb3VzZWVudGVyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50b29sdGlwKCdzaG93Jyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIG9uIG1vdXNlbGVhdmVcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRvb2x0aXAoJ2hpZGUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ1NlcnZpY2VzJywgW10pXG4uZmFjdG9yeSgnU2VydmljZXMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHJldHVybiB7IFxuICAgICAgICBMb2FkOiBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnM/bm9tYnJlPScrcSsnJnBlcl9wYWdlPScrcCsnJnBhZ2U9JytwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBMb2FkX1NlcnZpY2VzOiBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9zZXJ2aWNlcz9ub21icmU9JytxKycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7IFxufSkoKTsiXX0=
