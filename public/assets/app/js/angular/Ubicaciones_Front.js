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
    $scope.cant_rows = "10";
    $scope.mapa = 'full';
    
    $scope.load = function(q,p,page){
        if(q == undefined){ 
            q = "";
        }   
        Services.Load(q,p,page).then(function (response) {
            $scope.data_load = response.data; 
            $scope.temp.push($scope.data_load);  
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
            $scope.setMarkers(map);
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
        // $scope.array = [''];
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
    } 
    
    $scope.location = function(){  
        if (navigator.geolocation) {
            // INIT RESIZE 
            $scope.mapa = 'detalle'; 
            $scope.disable_button = true;  
            // $scope.init();  
            navigator.geolocation.getCurrentPosition(function(position) {    
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
                    // icon: image
                });

                var circle = new google.maps.Circle({
                    center: $scope.posicion_actual,
                    radius: 40000,
                    map: map,
                    fillColor: '#39527b',
                    fillOpacity: 0.1,
                    strokeColor: '#39527b',
                    strokeOpacity: 0.2
                });  


                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch({
                    location: $scope.posicion_actual,
                    radius: 40000,
                    type: ['police']
                }, processResults); 
                // 'bank','police','pharmacy','fire_station',
                // for (var i = $scope.data_load.length; i--;){
                //     if(parseFloat( $scope.getKilometros( $scope.posicion_actual.lat, $scope.posicion_actual.lng, $scope.data_load[i].lat, $scope.data_load[i].lng)) <= 0.3){  
                //         // console.log($scope.data_load[i]);
                //     } 
                //     else{ 
                //         // console.log("Eliminado: "+$scope.data_load[i]);
                //         $scope.del($scope.data_load.indexOf($scope.data_load[i]));  
                //     }
                // }   

                map.setZoom(18);
                map.panTo(marker.position);
                map.fitBounds(circle.getBounds()); 
                console.log($scope.new_data);

            }, function() {  
                $scope.handleLocationError(true, infoWindow, map.getCenter());
            }); 
        } else { 
            $scope.handleLocationError(false, infoWindow, map.getCenter());

        }
         
    };

    function processResults (results, status, pagination) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return;
        }   
        else {
            console.log('Inicia vacia: '+ $scope.new_data);
            $scope.createMarkers(results); 
            console.log($scope.new_data);
            if (pagination.hasNextPage) {
                sleep:4;
                pagination.nextPage();
                // var moreButton = document.getElementById('more');

                // moreButton.disabled = false;

                // moreButton.addEventListener('click', function() {
                //     moreButton.disabled = true;
                //     pagination.nextPage();
                // });
            }
        }
    };


    
    $scope.new_data = [];
    $scope.createMarkers = function(places) {
        // var bounds = new google.maps.LatLngBounds();  
            for (var i = 0, place; place = places[i]; i++) { 
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                }; 

                $scope.marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location,
                    photo: typeof 
                        place.photos !== 'undefined' ? 
                        place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}) : 'nophoto.jpg'
                });

                $scope.new_data.push($scope.marker); 


                // bounds.extend(place.geometry.location); 
            } 
            console.log($scope.new_data.length); 
            // return $scope.new_data;
        // map.fitBounds(bounds);
    };  

    $scope.del = function(index){  
        $scope.data_load.splice(index,1);  
    };
    // $scope.location();

    $scope.handleLocationError= function(browserHasGeolocation, infoWindow, pos) {
        // infoWindow.setPosition(pos);
        // infoWindow.setContent(browserHasGeolocation ?
            // 'Error: El servicio de Geolocalizacion Falló.' :
            // 'Error: Your browser doesn\'t support geolocation.');
    } 
    infoWindow = new google.maps.InfoWindow(); 
    $scope.setMarkers = function(map) { 
        // var infoWindow = new google.maps.InfoWindow({map: map});
        // console.log($scope.data_load.length);
        for (var i = 0; i < $scope.data_load.length; i++) {  
            var beach = $scope.data_load[i];
            var pos = {
              lat: parseFloat(beach.lat),
              lng: parseFloat(beach.lng)
            };
            var image = { 
                //url:  beach.icon, 
                scaledSize: new google.maps.Size(20, 20), 
                origin: new google.maps.Point(0, 0), 
                anchor: new google.maps.Point(0, 0),
                scale: 1
            }; 
            // console.log(image);
            // if(beach.id_services === 1){
            //     var image = { 
            //         url: '//localhost:3000/assets/app/images/banco.svg', 
            //         scaledSize: new google.maps.Size(20, 20), 
            //         origin: new google.maps.Point(0, 0), 
            //         anchor: new google.maps.Point(0, 0),
            //         scale: 1
            //     };  
            // } 
            // else if(beach.id_services === 2){
            //     var image = { 
            //         url: '//localhost:3000/assets/app/images/comisaria.svg', 
            //         scaledSize: new google.maps.Size(20, 20),  
            //         origin: new google.maps.Point(0, 0), 
            //         anchor: new google.maps.Point(0, 0),
            //         scale: 1
            //     };  
            // }
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                animation: google.maps.Animation.DROP, 
                draggable: false,
                //icon: image,
                type: beach.id_services,

            });
            // console.log(beach);
            // google.maps.event.addListener(marker, 'click', function(){
                // infoWindow.setContent(
                //     [
                //         '<div class="center globo_ubicacion">', 
                //         '<img width="100%" src="'+foto+'">',
                //         '<h6>'+titulo+'</h6>', 
                //         '<p>'+direccion+'</p>', 
                //         '</div>'
                //     ].join('')
                // );
                // infoWindow.open(map, marker);
            // });
            // console.log(marker);
            // $scope.markers_hover(marker);
            // marker.addListener('click', toggleBounce);
        }
    }
    function toggleBounce() { 
        // marker.setAnimation(google.maps.Animation.BOUNCE); 
    }
    
    $scope.markers_hover = function(lat, lng,foto,titulo,direccion,data){ 
        var pos = {};
        pos.lat = parseFloat(lat);
        pos.lng = parseFloat(lng); 
        // infoWindow.close();
        // infoWindow = new google.maps.InfoWindow({map: map,maxWidth: 200});
        // infoWindow.setPosition(pos); 
        // infoWindow.setContent(
        //     [
        //         '<div class="center globo_ubicacion">', 
        //         '<img width="100%" src="'+foto+'">',
        //         '<h6>'+titulo+'</h6>', 
        //         '<p>'+direccion+'</p>', 
        //         '</div>'
        //     ].join('')
        // );
        // map.setCenter(new google.maps.LatLng(pos));
        map.panTo(pos);
        map.setZoom(17);    
        // $scope.set_google_maps();
        
        
        // console.log(lat,lng)
    } 
    $scope.set_google_maps = function(){
        // var iwOuter = $('.gm-style-iw');
        // var iwCloseBtn = iwOuter.next();
        // var iwBackground = iwOuter.prev(); 
        // iwBackground.children(':nth-child(2)').css({'display' : 'none'}); 
        // iwBackground.children(':nth-child(4)').css({'display' : 'none'});
        // iwOuter.parent().parent().css({left: '40px'});
        // iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
        // iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 84px !important;'});
        // iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 0, 0, 0) 0px 1px 6px', 'z-index' : '1'});
        // iwBackground.children(':nth-child(3)').children(':nth-child(1)').find('div').attr('style', function(i,s){ return s + 'height: 21px !important;'+'width: 10px !important;'+'left:7px !important;'});
        // iwBackground.children(':nth-child(3)').children(':nth-child(2)').find('div').attr('style', function(i,s){ return s + 'height: 25px !important;'+'width: 9px !important;'});
        // iwCloseBtn.css({'display': 'none'});
    }
    $scope.show_marker = function(data){
        $scope.show_detalle = true;
        console.log(data);
        $scope.detalle = data;
        $scope.show_panel = false;
    }
    $scope.return = function(){
        $scope.show_detalle = false; 
        $scope.show_panel = true;
    }
    $scope.clearMarkers = function() {
        for (var i = 0; i < marker.length; i++) {
          marker[i].setMap(null);
        }
        marker = [];
      }
 
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVWJpY2FjaW9uZXNfRnJvbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xudmFyIG1vZGVsID0gYW5ndWxhci5tb2R1bGUoJ21vZGVsJywgXG4gICAgWydTZXJ2aWNlcyddKTtcblxudmFyIHNlbGV0ZWRWYWx1ZSA9IDE1O1xuXG5tb2RlbC5jb250cm9sbGVyKCdDdHJsJywgXG4gICAgWyckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnU2VydmljZXMnLCAgXG4gICAgZnVuY3Rpb24oXG4gICAgICAgICRzY29wZSxcbiAgICAgICAgJGh0dHAsXG4gICAgICAgICR0aW1lb3V0LFxuICAgICAgICBTZXJ2aWNlcylcbnsgIFxuICAgIHZhciBodG1sID0gZnVuY3Rpb24oaWQpIHsgXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7IFxuICAgIH07XG5cbiAgICAkc2NvcGUudGVtcCA9IFtdO1xuICAgICRzY29wZS5jYW50X3Jvd3MgPSBcIjEwXCI7XG4gICAgJHNjb3BlLm1hcGEgPSAnZnVsbCc7XG4gICAgXG4gICAgJHNjb3BlLmxvYWQgPSBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgIGlmKHEgPT0gdW5kZWZpbmVkKXsgXG4gICAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfSAgIFxuICAgICAgICBTZXJ2aWNlcy5Mb2FkKHEscCxwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZCA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgICAgJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTsgIFxuICAgICAgICAgICAgJHNjb3BlLnRvID0gcmVzcG9uc2UudG87IFxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDsgXG4gICAgICAgICAgICBpZigkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gJHNjb3BlLnByZXZfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9ICRzY29wZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgJHNjb3BlLnNldE1hcmtlcnMobWFwKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pOyBcbiAgICB9IFxuXG4gICAgJHNjb3BlLmxvYWRfc2VydmljZXMgPSBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgIGlmKHEgPT0gdW5kZWZpbmVkKXsgXG4gICAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfSAgXG4gICAgICAgIFNlcnZpY2VzLkxvYWRfU2VydmljZXMocSxwLHBhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YV9sb2FkX3NlcnZpY2VzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkX3NlcnZpY2VzKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLmxvYWRfc2VydmljZXMoJycsMTAsMSk7XG5cblxuICAgIFxuICAgIFxuICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmxvYWQoJycsMjAwLDEpO1xuICAgIH0gICBcblxuICAgICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTtcbiAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7XG4gICAgJHNjb3BlLmRpc2FibGVfYnV0dG9uID0gZmFsc2U7XG4gICAgdmFyIG1hcCxtYXAyLG1hcmtlcjtcbiAgICB2YXIgaW5mb1dpbmRvdyA9IG51bGw7IFxuICAgIHZhciBkaXJlY3Rpb25zRGlzcGxheSA9IG51bGw7XG4gICAgdmFyIGRpcmVjdGlvbnNTZXJ2aWNlID0gbnVsbDsgXG4gICAgLy8gdmFyIHN0eWxlID0gW3tcImZlYXR1cmVUeXBlXCI6XCJhZG1pbmlzdHJhdGl2ZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LmZpbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiMzMTQ2NmFcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInNhdHVyYXRpb25cIjpcIi0xM1wifSx7XCJsaWdodG5lc3NcIjpcIjZcIn0se1wiZ2FtbWFcIjpcIjEuODFcIn0se1wiY29sb3JcIjpcIiNjOWNjZDFcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzXCIsXCJzdHlsZXJzXCI6W3tcIndlaWdodFwiOlwiMS44MlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImxpZ2h0bmVzc1wiOlwiM1wifSx7XCJnYW1tYVwiOlwiMC4wMFwifSx7XCJzYXR1cmF0aW9uXCI6XCItMVwifSx7XCJ3ZWlnaHRcIjpcIjIuMzBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicG9pXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInNhdHVyYXRpb25cIjotMTAwfSx7XCJsaWdodG5lc3NcIjo0NX0se1widmlzaWJpbGl0eVwiOlwib25cIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5oaWdod2F5XCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcInNpbXBsaWZpZWRcIn0se1wic2F0dXJhdGlvblwiOlwiLTEwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmFydGVyaWFsXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLmljb25cIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwidHJhbnNpdFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvblwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcIndhdGVyXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjNTM3NWFjXCJ9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX1dO1xuICAgIHZhciBzdHlsZSA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlLmNvdW50cnlcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImh1ZVwiOiBcIiNmZjAwMDBcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLmF0dHJhY3Rpb25cIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5idXNpbmVzc1wiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIGNsb3NlSW5mb1dpbmRvdygpe1xuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgfSBcbiAgICBcbiAgICAkc2NvcGUuTWFwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcGEnKSwge1xuICAgICAgICAgICAgY2VudGVyOiB7bGF0OiAtMTIuMDQ2NjI5LCBsbmc6IC03Ny4wMjE0MzM3fSxcbiAgICAgICAgICAgIHpvb206IDExLFxuICAgICAgICAgICAgc3R5bGVzIDogc3R5bGVcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGRpcmVjdGlvbnNEaXNwbGF5ID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcigpO1xuICAgICAgICAvLyBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xuICAgICAgICBcbiAgICB9XG4gICAgJHNjb3BlLk1hcCgpOyBcblxuICAgICRzY29wZS5pbml0TWFwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICRzY29wZS5hcnJheSA9IFsnJ107XG4gICAgICAgICRzY29wZS4kd2F0Y2goJ3NlYXJjaF90ZXh0JywgZnVuY3Rpb24obil7IFxuICAgICAgICAgICAgaWYobiAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkKCRzY29wZS5zZWFyY2hfdGV4dCwxMCwxKTsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkKCcnLCRzY29wZS5jYW50X3Jvd3MsMSk7IFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgICBcbiAgICAgICAgXG4gICAgfVxuICAgICRzY29wZS5yZXNpemUgPSBmdW5jdGlvbihtYXApe1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCAnYm91bmRzX2NoYW5nZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgICAgIHZhciBib3VuZHMgPSBtYXAuZ2V0Qm91bmRzKCk7XG4gICAgICAgIH0pO1xuICAgIH07IFxuXG4gICAgJHNjb3BlLmdldEtpbG9tZXRyb3MgPSBmdW5jdGlvbihsYXQxLGxvbjEsbGF0Mixsb24yKXtcbiAgICAgICAgZnVuY3Rpb24gcmFkKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogTWF0aC5QSS8xODA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIFIgPSA2Mzc4LjEzNzsgLy9SYWRpbyBkZSBsYSB0aWVycmEgZW4ga21cbiAgICAgICAgdmFyIGRMYXQgPSByYWQoIGxhdDIgLSBsYXQxICk7XG4gICAgICAgIHZhciBkTG9uZyA9IHJhZCggbG9uMiAtIGxvbjEgKTtcbiAgICAgICAgdmFyIGEgPSBNYXRoLnNpbihkTGF0LzIpICogTWF0aC5zaW4oZExhdC8yKSArIE1hdGguY29zKHJhZChsYXQxKSkgKiBNYXRoLmNvcyhyYWQobGF0MikpICogTWF0aC5zaW4oZExvbmcvMikgKiBNYXRoLnNpbihkTG9uZy8yKTtcbiAgICAgICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxLWEpKTtcbiAgICAgICAgdmFyIGQgPSBSICogYztcbiAgICAgICAgdmFyIHJlc3VsdCA9IGQudG9GaXhlZCgzKTsgXG4gICAgICAgIHJldHVybiByZXN1bHQ7IC8vUmV0b3JuYSB0cmVzIGRlY2ltYWxlc1xuICAgIH0gXG4gICAgXG4gICAgJHNjb3BlLmxvY2F0aW9uID0gZnVuY3Rpb24oKXsgIFxuICAgICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgICAgICAgICAvLyBJTklUIFJFU0laRSBcbiAgICAgICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgICAgICRzY29wZS5kaXNhYmxlX2J1dHRvbiA9IHRydWU7ICBcbiAgICAgICAgICAgIC8vICRzY29wZS5pbml0KCk7ICBcbiAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHsgICAgXG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCA9IHtcbiAgICAgICAgICAgICAgICAgIGxhdDogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgICAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsIFxuICAgICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg1MCwgNTApLCBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCA0MClcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgLy8gaWNvbjogaW1hZ2VcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBjaXJjbGUgPSBuZXcgZ29vZ2xlLm1hcHMuQ2lyY2xlKHtcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDQwMDAwLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiAnIzM5NTI3YicsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjEsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnIzM5NTI3YicsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZU9wYWNpdHk6IDAuMlxuICAgICAgICAgICAgICAgIH0pOyAgXG5cblxuICAgICAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlKG1hcCk7XG4gICAgICAgICAgICAgICAgc2VydmljZS5uZWFyYnlTZWFyY2goe1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA0MDAwMCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogWydwb2xpY2UnXVxuICAgICAgICAgICAgICAgIH0sIHByb2Nlc3NSZXN1bHRzKTsgXG4gICAgICAgICAgICAgICAgLy8gJ2JhbmsnLCdwb2xpY2UnLCdwaGFybWFjeScsJ2ZpcmVfc3RhdGlvbicsXG4gICAgICAgICAgICAgICAgLy8gZm9yICh2YXIgaSA9ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpLS07KXtcbiAgICAgICAgICAgICAgICAvLyAgICAgaWYocGFyc2VGbG9hdCggJHNjb3BlLmdldEtpbG9tZXRyb3MoICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubGF0LCAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxuZywgJHNjb3BlLmRhdGFfbG9hZFtpXS5sYXQsICRzY29wZS5kYXRhX2xvYWRbaV0ubG5nKSkgPD0gMC4zKXsgIFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgICAgICAgICAgLy8gICAgIH0gXG4gICAgICAgICAgICAgICAgLy8gICAgIGVsc2V7IFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2coXCJFbGltaW5hZG86IFwiKyRzY29wZS5kYXRhX2xvYWRbaV0pO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJHNjb3BlLmRlbCgkc2NvcGUuZGF0YV9sb2FkLmluZGV4T2YoJHNjb3BlLmRhdGFfbG9hZFtpXSkpOyAgXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9ICAgXG5cbiAgICAgICAgICAgICAgICBtYXAuc2V0Wm9vbSgxOCk7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhjaXJjbGUuZ2V0Qm91bmRzKCkpOyBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUubmV3X2RhdGEpO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHsgIFxuICAgICAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKHRydWUsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG4gICAgICAgICAgICB9KTsgXG4gICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IoZmFsc2UsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG5cbiAgICAgICAgfVxuICAgICAgICAgXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NSZXN1bHRzIChyZXN1bHRzLCBzdGF0dXMsIHBhZ2luYXRpb24pIHtcbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2VTdGF0dXMuT0spIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAgIFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJbmljaWEgdmFjaWE6ICcrICRzY29wZS5uZXdfZGF0YSk7XG4gICAgICAgICAgICAkc2NvcGUuY3JlYXRlTWFya2VycyhyZXN1bHRzKTsgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUubmV3X2RhdGEpO1xuICAgICAgICAgICAgaWYgKHBhZ2luYXRpb24uaGFzTmV4dFBhZ2UpIHtcbiAgICAgICAgICAgICAgICBzbGVlcDo0O1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb24ubmV4dFBhZ2UoKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgbW9yZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3JlJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBtb3JlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBtb3JlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIG1vcmVCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vICAgICBwYWdpbmF0aW9uLm5leHRQYWdlKCk7XG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICBcbiAgICAkc2NvcGUubmV3X2RhdGEgPSBbXTtcbiAgICAkc2NvcGUuY3JlYXRlTWFya2VycyA9IGZ1bmN0aW9uKHBsYWNlcykge1xuICAgICAgICAvLyB2YXIgYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpOyAgXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgcGxhY2U7IHBsYWNlID0gcGxhY2VzW2ldOyBpKyspIHsgXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHBsYWNlLmljb24sXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDcxLCA3MSksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgxNywgMzQpLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyNSwgMjUpXG4gICAgICAgICAgICAgICAgfTsgXG5cbiAgICAgICAgICAgICAgICAkc2NvcGUubWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZSxcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHBsYWNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwbGFjZS5nZW9tZXRyeS5sb2NhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgcGhvdG86IHR5cGVvZiBcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlLnBob3RvcyAhPT0gJ3VuZGVmaW5lZCcgPyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlLnBob3Rvc1swXS5nZXRVcmwoeydtYXhXaWR0aCc6IDEwMCwgJ21heEhlaWdodCc6IDEwMH0pIDogJ25vcGhvdG8uanBnJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5ld19kYXRhLnB1c2goJHNjb3BlLm1hcmtlcik7IFxuXG5cbiAgICAgICAgICAgICAgICAvLyBib3VuZHMuZXh0ZW5kKHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uKTsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLm5ld19kYXRhLmxlbmd0aCk7IFxuICAgICAgICAgICAgLy8gcmV0dXJuICRzY29wZS5uZXdfZGF0YTtcbiAgICAgICAgLy8gbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xuICAgIH07ICBcblxuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbihpbmRleCl7ICBcbiAgICAgICAgJHNjb3BlLmRhdGFfbG9hZC5zcGxpY2UoaW5kZXgsMSk7ICBcbiAgICB9O1xuICAgIC8vICRzY29wZS5sb2NhdGlvbigpO1xuXG4gICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3I9IGZ1bmN0aW9uKGJyb3dzZXJIYXNHZW9sb2NhdGlvbiwgaW5mb1dpbmRvdywgcG9zKSB7XG4gICAgICAgIC8vIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRDb250ZW50KGJyb3dzZXJIYXNHZW9sb2NhdGlvbiA/XG4gICAgICAgICAgICAvLyAnRXJyb3I6IEVsIHNlcnZpY2lvIGRlIEdlb2xvY2FsaXphY2lvbiBGYWxsw7MuJyA6XG4gICAgICAgICAgICAvLyAnRXJyb3I6IFlvdXIgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBnZW9sb2NhdGlvbi4nKTtcbiAgICB9IFxuICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICAkc2NvcGUuc2V0TWFya2VycyA9IGZ1bmN0aW9uKG1hcCkgeyBcbiAgICAgICAgLy8gdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXB9KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpKyspIHsgIFxuICAgICAgICAgICAgdmFyIGJlYWNoID0gJHNjb3BlLmRhdGFfbG9hZFtpXTtcbiAgICAgICAgICAgIHZhciBwb3MgPSB7XG4gICAgICAgICAgICAgIGxhdDogcGFyc2VGbG9hdChiZWFjaC5sYXQpLFxuICAgICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQoYmVhY2gubG5nKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgLy91cmw6ICBiZWFjaC5pY29uLCBcbiAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCBcbiAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaW1hZ2UpO1xuICAgICAgICAgICAgLy8gaWYoYmVhY2guaWRfc2VydmljZXMgPT09IDEpe1xuICAgICAgICAgICAgLy8gICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAvLyAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjMwMDAvYXNzZXRzL2FwcC9pbWFnZXMvYmFuY28uc3ZnJywgXG4gICAgICAgICAgICAvLyAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksIFxuICAgICAgICAgICAgLy8gICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAvLyAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgLy8gICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgLy8gICAgIH07ICBcbiAgICAgICAgICAgIC8vIH0gXG4gICAgICAgICAgICAvLyBlbHNlIGlmKGJlYWNoLmlkX3NlcnZpY2VzID09PSAyKXtcbiAgICAgICAgICAgIC8vICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgLy8gICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDozMDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2NvbWlzYXJpYS5zdmcnLCBcbiAgICAgICAgICAgIC8vICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgLy8gICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAvLyAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgLy8gICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgLy8gICAgIH07ICBcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zLFxuICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsIFxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgLy9pY29uOiBpbWFnZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBiZWFjaC5pZF9zZXJ2aWNlcyxcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhiZWFjaCk7XG4gICAgICAgICAgICAvLyBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgICAgICAgICAgICAgIC8vICAgICBbXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnPGRpdiBjbGFzcz1cImNlbnRlciBnbG9ib191YmljYWNpb25cIj4nLCBcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrZm90bysnXCI+JyxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICc8aDY+Jyt0aXR1bG8rJzwvaDY+JywgXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnPHA+JytkaXJlY2Npb24rJzwvcD4nLCBcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAgICAgLy8gICAgIF0uam9pbignJylcbiAgICAgICAgICAgICAgICAvLyApO1xuICAgICAgICAgICAgICAgIC8vIGluZm9XaW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hcmtlcik7XG4gICAgICAgICAgICAvLyAkc2NvcGUubWFya2Vyc19ob3ZlcihtYXJrZXIpO1xuICAgICAgICAgICAgLy8gbWFya2VyLmFkZExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUJvdW5jZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gdG9nZ2xlQm91bmNlKCkgeyBcbiAgICAgICAgLy8gbWFya2VyLnNldEFuaW1hdGlvbihnb29nbGUubWFwcy5BbmltYXRpb24uQk9VTkNFKTsgXG4gICAgfVxuICAgIFxuICAgICRzY29wZS5tYXJrZXJzX2hvdmVyID0gZnVuY3Rpb24obGF0LCBsbmcsZm90byx0aXR1bG8sZGlyZWNjaW9uLGRhdGEpeyBcbiAgICAgICAgdmFyIHBvcyA9IHt9O1xuICAgICAgICBwb3MubGF0ID0gcGFyc2VGbG9hdChsYXQpO1xuICAgICAgICBwb3MubG5nID0gcGFyc2VGbG9hdChsbmcpOyBcbiAgICAgICAgLy8gaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgICAgICAvLyBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe21hcDogbWFwLG1heFdpZHRoOiAyMDB9KTtcbiAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpOyBcbiAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgICAgICAvLyAgICAgW1xuICAgICAgICAvLyAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2VudGVyIGdsb2JvX3ViaWNhY2lvblwiPicsIFxuICAgICAgICAvLyAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrZm90bysnXCI+JyxcbiAgICAgICAgLy8gICAgICAgICAnPGg2PicrdGl0dWxvKyc8L2g2PicsIFxuICAgICAgICAvLyAgICAgICAgICc8cD4nK2RpcmVjY2lvbisnPC9wPicsIFxuICAgICAgICAvLyAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgIC8vICAgICBdLmpvaW4oJycpXG4gICAgICAgIC8vICk7XG4gICAgICAgIC8vIG1hcC5zZXRDZW50ZXIobmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3MpKTtcbiAgICAgICAgbWFwLnBhblRvKHBvcyk7XG4gICAgICAgIG1hcC5zZXRab29tKDE3KTsgICAgXG4gICAgICAgIC8vICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhsYXQsbG5nKVxuICAgIH0gXG4gICAgJHNjb3BlLnNldF9nb29nbGVfbWFwcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIHZhciBpd091dGVyID0gJCgnLmdtLXN0eWxlLWl3Jyk7XG4gICAgICAgIC8vIHZhciBpd0Nsb3NlQnRuID0gaXdPdXRlci5uZXh0KCk7XG4gICAgICAgIC8vIHZhciBpd0JhY2tncm91bmQgPSBpd091dGVyLnByZXYoKTsgXG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSk7IFxuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoNCknKS5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pO1xuICAgICAgICAvLyBpd091dGVyLnBhcmVudCgpLnBhcmVudCgpLmNzcyh7bGVmdDogJzQwcHgnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnbGVmdDogODRweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdsZWZ0OiA4NHB4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5maW5kKCdkaXYnKS5jaGlsZHJlbigpLmNzcyh7J2JveC1zaGFkb3cnOiAncmdiYSgwLCAwLCAwLCAwKSAwcHggMXB4IDZweCcsICd6LWluZGV4JyA6ICcxJ30pO1xuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpLmZpbmQoJ2RpdicpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnaGVpZ2h0OiAyMXB4ICFpbXBvcnRhbnQ7Jysnd2lkdGg6IDEwcHggIWltcG9ydGFudDsnKydsZWZ0OjdweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKS5maW5kKCdkaXYnKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2hlaWdodDogMjVweCAhaW1wb3J0YW50OycrJ3dpZHRoOiA5cHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIC8vIGl3Q2xvc2VCdG4uY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xuICAgIH1cbiAgICAkc2NvcGUuc2hvd19tYXJrZXIgPSBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAkc2NvcGUuZGV0YWxsZSA9IGRhdGE7XG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsID0gZmFsc2U7XG4gICAgfVxuICAgICRzY29wZS5yZXR1cm4gPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7IFxuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7XG4gICAgfVxuICAgICRzY29wZS5jbGVhck1hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXJrZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBtYXJrZXJbaV0uc2V0TWFwKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIG1hcmtlciA9IFtdO1xuICAgICAgfVxuIFxufV0pOyBcbm1vZGVsLmRpcmVjdGl2ZSgndG9vbHRpcCcsIGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICQoZWxlbWVudCkuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBvbiBtb3VzZWVudGVyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50b29sdGlwKCdzaG93Jyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIG9uIG1vdXNlbGVhdmVcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRvb2x0aXAoJ2hpZGUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4ndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnU2VydmljZXMnLCBbXSlcbi5mYWN0b3J5KCdTZXJ2aWNlcycsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgcmV0dXJuIHsgXG4gICAgICAgIExvYWQ6IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucz9ub21icmU9JytxKycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIExvYWRfU2VydmljZXM6IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzP25vbWJyZT0nK3ErJyZwZXJfcGFnZT0nK3ArJyZwYWdlPScrcGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTsgXG59KSgpOyJdfQ==
