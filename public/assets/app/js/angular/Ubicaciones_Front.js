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
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsService = new google.maps.DirectionsService();
        
    }
    $scope.Map();


    function getDirections(){
        var start = $('#start').val();
        var end = $('#end').val();
        if(!start || !end){
            alert("Start and End addresses are required");
            return;
        }
        var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.DirectionsTravelMode[$('#travelMode').val()],
                unitSystem: google.maps.DirectionsUnitSystem[$('#unitSystem').val()],
                provideRouteAlternatives: true
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                directionsDisplay.setPanel($("#directions_panel").get(0));
                directionsDisplay.setDirections(response);
            } else {
                alert("There is no directions available between these two points");
            }
        });
    }


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
        
        // $scope.infoWindow = new google.maps.InfoWindow();
        // google.maps.event.addListener(map, 'click', $scope.closeInfoWindow());

        // var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        // $scope.location();
        
    }
    $scope.resize = function(map){
        google.maps.event.addListenerOnce(map, 'bounds_changed', function () {
           google.maps.event.trigger(map, 'resize');
           var bounds = map.getBounds();
        });
    };

    var array = [];
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
        array.push(result);
        return result; //Retorna tres decimales
    }
    function getMinFromArray (array_of_values) {
        var min = Math.min.apply(null, array_of_values);
        return min;   
    };
    
    $scope.location = function(){  
        if (navigator.geolocation) {
            // INIT RESIZE 
            $scope.mapa = 'detalle'; 
            $scope.disable_button = true; 
            $scope.data = [];

            $scope.init(); 
            navigator.geolocation.getCurrentPosition(function(position) {   
                console.log(position);
                $scope.posicion_actual = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                var geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.posicion_actual.lat + ',' + $scope.posicion_actual.lng + '&sensor=false';
                console.log(geocoding);
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
                    radius: 10000,
                    map: map,
                    fillColor: '#39527b',
                    fillOpacity: 0.1,
                    strokeColor: '#39527b',
                    strokeOpacity: 0.2
                });  



                for (var i = $scope.data_load.length; i--;){
                    if(parseFloat( $scope.getKilometros( $scope.posicion_actual.lat, $scope.posicion_actual.lng, $scope.data_load[i].lat, $scope.data_load[i].lng)) <= 10){ 
                        var min = Math.min.apply(null, array);
                        console.log(i +' el minimo es: '+ min);
                        // console.log(result);
                        // console.log($scope.data_load[i]);
                        if(i == 0){
                            console.log($scope.data_load[i]);
                            $.getJSON(geocoding).done(function(location) {
                                // console.log(location);
                                var start = location.results[0].formatted_address;
                                var end = $scope.data_load[3].direccion;
                                if(!start || !end){
                                    alert("Start and End addresses are required");
                                    return;
                                }
                                var request = {
                                        origin: start,
                                        destination: end,
                                        travelMode: google.maps.DirectionsTravelMode['WALKING'],
                                        unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
                                        provideRouteAlternatives: false
                                };

                                directionsService.route(request, function(response, status) {
                                    if (status == google.maps.DirectionsStatus.OK) {
                                        directionsDisplay.setMap(map);
                                        directionsDisplay.setPanel($("#directions_panel").get(0));
                                        directionsDisplay.setDirections(response);
                                    } else {
                                        console.log(response,status);
                                        alert("There is no directions available between these two points");
                                    }
                                });
                            })
                        }
                    } 
                    else{ 
                        $scope.del($scope.data_load.indexOf($scope.data_load[i])); 
                        // $scope.data_load[i].setMap(null);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlViaWNhY2lvbmVzX0Zyb250LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbnZhciBtb2RlbCA9IGFuZ3VsYXIubW9kdWxlKCdtb2RlbCcsIFxuICAgIFsnU2VydmljZXMnXSk7XG5cbnZhciBzZWxldGVkVmFsdWUgPSAxNTtcblxubW9kZWwuY29udHJvbGxlcignQ3RybCcsIFxuICAgIFsnJHNjb3BlJyxcbiAgICAnJGh0dHAnLFxuICAgICckdGltZW91dCcsXG4gICAgJ1NlcnZpY2VzJywgIFxuICAgIGZ1bmN0aW9uKFxuICAgICAgICAkc2NvcGUsXG4gICAgICAgICRodHRwLFxuICAgICAgICAkdGltZW91dCxcbiAgICAgICAgU2VydmljZXMpXG57ICBcbiAgICB2YXIgaHRtbCA9IGZ1bmN0aW9uKGlkKSB7IFxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnRlbXAgPSBbXTtcbiAgICAkc2NvcGUuY2FudF9yb3dzID0gXCIxMFwiO1xuICAgICRzY29wZS5tYXBhID0gJ2Z1bGwnO1xuICAgIFxuICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICBpZihxID09IHVuZGVmaW5lZCl7IFxuICAgICAgICAgICAgcSA9IFwiXCI7XG4gICAgICAgIH0gICBcbiAgICAgICAgU2VydmljZXMuTG9hZChxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWQgPSByZXNwb25zZS5kYXRhOyBcbiAgICAgICAgICAgICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7ICBcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICRzY29wZS5zZXRNYXJrZXJzKG1hcCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTsgXG4gICAgfSBcblxuICAgICRzY29wZS5sb2FkX3NlcnZpY2VzID0gZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICBpZihxID09IHVuZGVmaW5lZCl7IFxuICAgICAgICAgICAgcSA9IFwiXCI7XG4gICAgICAgIH0gIFxuICAgICAgICBTZXJ2aWNlcy5Mb2FkX1NlcnZpY2VzKHEscCxwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZF9zZXJ2aWNlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAkc2NvcGUudG8gPSByZXNwb25zZS50bzsgXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSByZXNwb25zZS50b3RhbDtcbiAgICAgICAgICAgICRzY29wZS5sYXN0X3BhZ2UgPSByZXNwb25zZS5sYXN0X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudF9wYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSByZXNwb25zZS5uZXh0X3BhZ2VfdXJsO1xuICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSByZXNwb25zZS5wcmV2X3BhZ2VfdXJsOyBcbiAgICAgICAgICAgIGlmKCRzY29wZS5wcmV2X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSAkc2NvcGUucHJldl9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigkc2NvcGUubmV4dF9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gJHNjb3BlLm5leHRfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpOyBcbiAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZF9zZXJ2aWNlcyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTsgXG4gICAgfTtcblxuICAgICRzY29wZS5sb2FkX3NlcnZpY2VzKCcnLDEwLDEpO1xuXG5cbiAgICBcbiAgICBcbiAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5sb2FkKCcnLDIwMCwxKTtcbiAgICB9ICAgXG5cbiAgICAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7XG4gICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlO1xuICAgICRzY29wZS5kaXNhYmxlX2J1dHRvbiA9IGZhbHNlO1xuICAgIHZhciBtYXAsbWFwMixtYXJrZXI7XG4gICAgdmFyIGluZm9XaW5kb3cgPSBudWxsOyBcbiAgICB2YXIgZGlyZWN0aW9uc0Rpc3BsYXkgPSBudWxsO1xuICAgIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG51bGw7IFxuICAgIC8vIHZhciBzdHlsZSA9IFt7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjMzE0NjZhXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6XCItMTNcIn0se1wibGlnaHRuZXNzXCI6XCI2XCJ9LHtcImdhbW1hXCI6XCIxLjgxXCJ9LHtcImNvbG9yXCI6XCIjYzljY2QxXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVsc1wiLFwic3R5bGVyc1wiOlt7XCJ3ZWlnaHRcIjpcIjEuODJcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHRcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib25cIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJsaWdodG5lc3NcIjpcIjNcIn0se1wiZ2FtbWFcIjpcIjAuMDBcIn0se1wic2F0dXJhdGlvblwiOlwiLTFcIn0se1wid2VpZ2h0XCI6XCIyLjMwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInBvaVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6LTEwMH0se1wibGlnaHRuZXNzXCI6NDV9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuaGlnaHdheVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJzaW1wbGlmaWVkXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5hcnRlcmlhbFwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy5pY29uXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInRyYW5zaXRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib25cIn0se1wic2F0dXJhdGlvblwiOlwiLTEwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ3YXRlclwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzUzNzVhY1wifSx7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19XTtcbiAgICB2YXIgc3R5bGUgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5jb3VudHJ5XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJodWVcIjogXCIjZmYwMDAwXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5hdHRyYWN0aW9uXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuYnVzaW5lc3NcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICBmdW5jdGlvbiBjbG9zZUluZm9XaW5kb3coKXtcbiAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgIH0gXG4gICAgXG4gICAgJHNjb3BlLk1hcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBhJyksIHtcbiAgICAgICAgICAgIGNlbnRlcjoge2xhdDogLTEyLjA0NjYyOSwgbG5nOiAtNzcuMDIxNDMzN30sXG4gICAgICAgICAgICB6b29tOiAxMSxcbiAgICAgICAgICAgIHN0eWxlcyA6IHN0eWxlXG4gICAgICAgIH0pO1xuICAgICAgICBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoKTtcbiAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbiAgICAgICAgXG4gICAgfVxuICAgICRzY29wZS5NYXAoKTtcblxuXG4gICAgZnVuY3Rpb24gZ2V0RGlyZWN0aW9ucygpe1xuICAgICAgICB2YXIgc3RhcnQgPSAkKCcjc3RhcnQnKS52YWwoKTtcbiAgICAgICAgdmFyIGVuZCA9ICQoJyNlbmQnKS52YWwoKTtcbiAgICAgICAgaWYoIXN0YXJ0IHx8ICFlbmQpe1xuICAgICAgICAgICAgYWxlcnQoXCJTdGFydCBhbmQgRW5kIGFkZHJlc3NlcyBhcmUgcmVxdWlyZWRcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICDCoCDCoCDCoCDCoG9yaWdpbjogc3RhcnQsXG4gICAgICAgICDCoCDCoCDCoCDCoGRlc3RpbmF0aW9uOiBlbmQsXG4gICAgICAgICDCoCDCoCDCoCDCoHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNUcmF2ZWxNb2RlWyQoJyN0cmF2ZWxNb2RlJykudmFsKCldLFxuICAgICAgICAgwqAgwqAgwqAgwqB1bml0U3lzdGVtOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVW5pdFN5c3RlbVskKCcjdW5pdFN5c3RlbScpLnZhbCgpXSxcbiAgICAgICAgIMKgIMKgIMKgIMKgcHJvdmlkZVJvdXRlQWx0ZXJuYXRpdmVzOiB0cnVlXG4gICAgIMKgIMKgfTtcbiAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cykge1xuICAgICDCoCDCoCDCoCDCoGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICDCoCDCoCDCoCDCoCDCoCDCoGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICDCoCDCoCDCoCDCoCDCoCDCoGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKCQoXCIjZGlyZWN0aW9uc19wYW5lbFwiKS5nZXQoMCkpO1xuICAgICDCoCDCoCDCoCDCoCDCoCDCoGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICDCoCDCoCDCoCDCoH0gZWxzZSB7XG4gICAgIMKgIMKgIMKgIMKgIMKgIMKgYWxlcnQoXCJUaGVyZSBpcyBubyBkaXJlY3Rpb25zIGF2YWlsYWJsZSBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcIik7XG4gICAgIMKgIMKgIMKgIMKgfVxuICAgICDCoCDCoH0pO1xuICAgIH1cblxuXG4gICAgJHNjb3BlLmluaXRNYXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gJHNjb3BlLmFycmF5ID0gWycnXTtcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgnc2VhcmNoX3RleHQnLCBmdW5jdGlvbihuKXsgXG4gICAgICAgICAgICBpZihuICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWQoJHNjb3BlLnNlYXJjaF90ZXh0LDEwLDEpOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWQoJycsJHNjb3BlLmNhbnRfcm93cywxKTsgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyAgXG4gICAgICAgIFxuICAgICAgICAvLyAkc2NvcGUuaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG4gICAgICAgIC8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgJHNjb3BlLmNsb3NlSW5mb1dpbmRvdygpKTtcblxuICAgICAgICAvLyB2YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHttYXA6IG1hcH0pO1xuXG4gICAgICAgIC8vIFRyeSBIVE1MNSBnZW9sb2NhdGlvbi5cbiAgICAgICAgLy8gJHNjb3BlLmxvY2F0aW9uKCk7XG4gICAgICAgIFxuICAgIH1cbiAgICAkc2NvcGUucmVzaXplID0gZnVuY3Rpb24obWFwKXtcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKG1hcCwgJ2JvdW5kc19jaGFuZ2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICAgICB2YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgJHNjb3BlLmdldEtpbG9tZXRyb3MgPSBmdW5jdGlvbihsYXQxLGxvbjEsbGF0Mixsb24yKXtcbiAgICAgICAgZnVuY3Rpb24gcmFkKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogTWF0aC5QSS8xODA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIFIgPSA2Mzc4LjEzNzsgLy9SYWRpbyBkZSBsYSB0aWVycmEgZW4ga21cbiAgICAgICAgdmFyIGRMYXQgPSByYWQoIGxhdDIgLSBsYXQxICk7XG4gICAgICAgIHZhciBkTG9uZyA9IHJhZCggbG9uMiAtIGxvbjEgKTtcbiAgICAgICAgdmFyIGEgPSBNYXRoLnNpbihkTGF0LzIpICogTWF0aC5zaW4oZExhdC8yKSArIE1hdGguY29zKHJhZChsYXQxKSkgKiBNYXRoLmNvcyhyYWQobGF0MikpICogTWF0aC5zaW4oZExvbmcvMikgKiBNYXRoLnNpbihkTG9uZy8yKTtcbiAgICAgICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxLWEpKTtcbiAgICAgICAgdmFyIGQgPSBSICogYztcbiAgICAgICAgdmFyIHJlc3VsdCA9IGQudG9GaXhlZCgzKTtcbiAgICAgICAgYXJyYXkucHVzaChyZXN1bHQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0OyAvL1JldG9ybmEgdHJlcyBkZWNpbWFsZXNcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0TWluRnJvbUFycmF5IChhcnJheV9vZl92YWx1ZXMpIHtcbiAgICAgICAgdmFyIG1pbiA9IE1hdGgubWluLmFwcGx5KG51bGwsIGFycmF5X29mX3ZhbHVlcyk7XG4gICAgICAgIHJldHVybiBtaW47ICAgXG4gICAgfTtcbiAgICBcbiAgICAkc2NvcGUubG9jYXRpb24gPSBmdW5jdGlvbigpeyAgXG4gICAgICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgICAgICAgIC8vIElOSVQgUkVTSVpFIFxuICAgICAgICAgICAgJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7IFxuICAgICAgICAgICAgJHNjb3BlLmRpc2FibGVfYnV0dG9uID0gdHJ1ZTsgXG4gICAgICAgICAgICAkc2NvcGUuZGF0YSA9IFtdO1xuXG4gICAgICAgICAgICAkc2NvcGUuaW5pdCgpOyBcbiAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHsgICBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCA9IHtcbiAgICAgICAgICAgICAgICAgIGxhdDogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgICAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgZ2VvY29kaW5nID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24/bGF0bG5nPScgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxhdCArICcsJyArICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nICsgJyZzZW5zb3I9ZmFsc2UnO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGdlb2NvZGluZyk7XG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsIFxuICAgICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg1MCwgNTApLCBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCA0MClcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgLy8gaWNvbjogaW1hZ2VcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBjaXJjbGUgPSBuZXcgZ29vZ2xlLm1hcHMuQ2lyY2xlKHtcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDEwMDAwLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiAnIzM5NTI3YicsXG4gICAgICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLjEsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnIzM5NTI3YicsXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZU9wYWNpdHk6IDAuMlxuICAgICAgICAgICAgICAgIH0pOyAgXG5cblxuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpLS07KXtcbiAgICAgICAgICAgICAgICAgICAgaWYocGFyc2VGbG9hdCggJHNjb3BlLmdldEtpbG9tZXRyb3MoICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubGF0LCAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxuZywgJHNjb3BlLmRhdGFfbG9hZFtpXS5sYXQsICRzY29wZS5kYXRhX2xvYWRbaV0ubG5nKSkgPD0gMTApeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtaW4gPSBNYXRoLm1pbi5hcHBseShudWxsLCBhcnJheSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpICsnIGVsIG1pbmltbyBlczogJysgbWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGkgPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzdGFydCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmQgPSAkc2NvcGUuZGF0YV9sb2FkWzNdLmRpcmVjY2lvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXN0YXJ0IHx8ICFlbmQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJTdGFydCBhbmQgRW5kIGFkZHJlc3NlcyBhcmUgcmVxdWlyZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoCDCoCDCoG9yaWdpbjogc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoCDCoCDCoGRlc3RpbmF0aW9uOiBlbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoCDCoCDCoHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNUcmF2ZWxNb2RlWydXQUxLSU5HJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoCDCoCDCoHVuaXRTeXN0ZW06IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNVbml0U3lzdGVtWydNRVRSSUMnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIMKgIMKgIMKgIMKgcHJvdmlkZVJvdXRlQWx0ZXJuYXRpdmVzOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoCDCoCDCoGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoCDCoCDCoCDCoCDCoGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoCDCoCDCoCDCoCDCoGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKCQoXCIjZGlyZWN0aW9uc19wYW5lbFwiKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoCDCoCDCoCDCoCDCoGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICDCoCDCoCDCoCDCoH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Usc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgwqAgwqAgwqAgwqAgwqAgwqBhbGVydChcIlRoZXJlIGlzIG5vIGRpcmVjdGlvbnMgYXZhaWxhYmxlIGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgwqAgwqAgwqAgwqB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIMKgIMKgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgZWxzZXsgXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVsKCRzY29wZS5kYXRhX2xvYWQuaW5kZXhPZigkc2NvcGUuZGF0YV9sb2FkW2ldKSk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLmRhdGFfbG9hZFtpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9ICAgXG5cbiAgICAgICAgICAgICAgICBtYXAuc2V0Wm9vbSgxOCk7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhjaXJjbGUuZ2V0Qm91bmRzKCkpOyBcblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICBcbiAgICAgICAgICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcih0cnVlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuICAgICAgICAgICAgfSk7IFxuICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKGZhbHNlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuXG4gICAgICAgIH1cbiAgICAgICAgIFxuICAgIH1cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24oaW5kZXgpeyAgXG4gICAgICAgICRzY29wZS5kYXRhX2xvYWQuc3BsaWNlKGluZGV4LDEpOyAgXG4gICAgfTtcbiAgICAvLyAkc2NvcGUubG9jYXRpb24oKTtcblxuICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yPSBmdW5jdGlvbihicm93c2VySGFzR2VvbG9jYXRpb24sIGluZm9XaW5kb3csIHBvcykge1xuICAgICAgICAvLyBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7XG4gICAgICAgIC8vIGluZm9XaW5kb3cuc2V0Q29udGVudChicm93c2VySGFzR2VvbG9jYXRpb24gP1xuICAgICAgICAgICAgLy8gJ0Vycm9yOiBFbCBzZXJ2aWNpbyBkZSBHZW9sb2NhbGl6YWNpb24gRmFsbMOzLicgOlxuICAgICAgICAgICAgLy8gJ0Vycm9yOiBZb3VyIGJyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgZ2VvbG9jYXRpb24uJyk7XG4gICAgfSBcbiAgICBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTsgXG4gICAgJHNjb3BlLnNldE1hcmtlcnMgPSBmdW5jdGlvbihtYXApIHsgXG4gICAgICAgIC8vIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe21hcDogbWFwfSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWQubGVuZ3RoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZGF0YV9sb2FkLmxlbmd0aDsgaSsrKSB7ICBcbiAgICAgICAgICAgIHZhciBiZWFjaCA9ICRzY29wZS5kYXRhX2xvYWRbaV07XG4gICAgICAgICAgICB2YXIgcG9zID0ge1xuICAgICAgICAgICAgICBsYXQ6IHBhcnNlRmxvYXQoYmVhY2gubGF0KSxcbiAgICAgICAgICAgICAgbG5nOiBwYXJzZUZsb2F0KGJlYWNoLmxuZylcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgICAgIC8vdXJsOiAgYmVhY2guaWNvbiwgXG4gICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgXG4gICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICB9OyBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGltYWdlKTtcbiAgICAgICAgICAgIC8vIGlmKGJlYWNoLmlkX3NlcnZpY2VzID09PSAxKXtcbiAgICAgICAgICAgIC8vICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgLy8gICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDozMDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2JhbmNvLnN2ZycsIFxuICAgICAgICAgICAgLy8gICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCBcbiAgICAgICAgICAgIC8vICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgLy8gICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgIC8vICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgIC8vICAgICB9OyAgXG4gICAgICAgICAgICAvLyB9IFxuICAgICAgICAgICAgLy8gZWxzZSBpZihiZWFjaC5pZF9zZXJ2aWNlcyA9PT0gMil7XG4gICAgICAgICAgICAvLyAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgIC8vICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6MzAwMC9hc3NldHMvYXBwL2ltYWdlcy9jb21pc2FyaWEuc3ZnJywgXG4gICAgICAgICAgICAvLyAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgIC8vICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgLy8gICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgIC8vICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgIC8vICAgICB9OyAgXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHBvcyxcbiAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLCBcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8vaWNvbjogaW1hZ2UsXG4gICAgICAgICAgICAgICAgdHlwZTogYmVhY2guaWRfc2VydmljZXMsXG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYmVhY2gpO1xuICAgICAgICAgICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIGluZm9XaW5kb3cuc2V0Q29udGVudChcbiAgICAgICAgICAgICAgICAvLyAgICAgW1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJzxkaXYgY2xhc3M9XCJjZW50ZXIgZ2xvYm9fdWJpY2FjaW9uXCI+JywgXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnPGltZyB3aWR0aD1cIjEwMCVcIiBzcmM9XCInK2ZvdG8rJ1wiPicsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnPGg2PicrdGl0dWxvKyc8L2g2PicsIFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJzxwPicrZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgICAgIC8vICAgICBdLmpvaW4oJycpXG4gICAgICAgICAgICAgICAgLy8gKTtcbiAgICAgICAgICAgICAgICAvLyBpbmZvV2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXJrZXIpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLm1hcmtlcnNfaG92ZXIobWFya2VyKTtcbiAgICAgICAgICAgIC8vIG1hcmtlci5hZGRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVCb3VuY2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRvZ2dsZUJvdW5jZSgpIHsgXG4gICAgICAgIC8vIG1hcmtlci5zZXRBbmltYXRpb24oZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkJPVU5DRSk7IFxuICAgIH1cbiAgICBcbiAgICAkc2NvcGUubWFya2Vyc19ob3ZlciA9IGZ1bmN0aW9uKGxhdCwgbG5nLGZvdG8sdGl0dWxvLGRpcmVjY2lvbixkYXRhKXsgXG4gICAgICAgIHZhciBwb3MgPSB7fTtcbiAgICAgICAgcG9zLmxhdCA9IHBhcnNlRmxvYXQobGF0KTtcbiAgICAgICAgcG9zLmxuZyA9IHBhcnNlRmxvYXQobG5nKTsgXG4gICAgICAgIC8vIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgLy8gaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHttYXA6IG1hcCxtYXhXaWR0aDogMjAwfSk7XG4gICAgICAgIC8vIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTsgXG4gICAgICAgIC8vIGluZm9XaW5kb3cuc2V0Q29udGVudChcbiAgICAgICAgLy8gICAgIFtcbiAgICAgICAgLy8gICAgICAgICAnPGRpdiBjbGFzcz1cImNlbnRlciBnbG9ib191YmljYWNpb25cIj4nLCBcbiAgICAgICAgLy8gICAgICAgICAnPGltZyB3aWR0aD1cIjEwMCVcIiBzcmM9XCInK2ZvdG8rJ1wiPicsXG4gICAgICAgIC8vICAgICAgICAgJzxoNj4nK3RpdHVsbysnPC9oNj4nLCBcbiAgICAgICAgLy8gICAgICAgICAnPHA+JytkaXJlY2Npb24rJzwvcD4nLCBcbiAgICAgICAgLy8gICAgICAgICAnPC9kaXY+J1xuICAgICAgICAvLyAgICAgXS5qb2luKCcnKVxuICAgICAgICAvLyApO1xuICAgICAgICAvLyBtYXAuc2V0Q2VudGVyKG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zKSk7XG4gICAgICAgIG1hcC5wYW5Ubyhwb3MpO1xuICAgICAgICBtYXAuc2V0Wm9vbSgxNyk7ICAgIFxuICAgICAgICAvLyAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzKCk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgLy8gY29uc29sZS5sb2cobGF0LGxuZylcbiAgICB9IFxuICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyB2YXIgaXdPdXRlciA9ICQoJy5nbS1zdHlsZS1pdycpO1xuICAgICAgICAvLyB2YXIgaXdDbG9zZUJ0biA9IGl3T3V0ZXIubmV4dCgpO1xuICAgICAgICAvLyB2YXIgaXdCYWNrZ3JvdW5kID0gaXdPdXRlci5wcmV2KCk7IFxuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKS5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pOyBcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDQpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTtcbiAgICAgICAgLy8gaXdPdXRlci5wYXJlbnQoKS5wYXJlbnQoKS5jc3Moe2xlZnQ6ICc0MHB4J30pO1xuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDg0cHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnbGVmdDogODRweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuZmluZCgnZGl2JykuY2hpbGRyZW4oKS5jc3Moeydib3gtc2hhZG93JzogJ3JnYmEoMCwgMCwgMCwgMCkgMHB4IDFweCA2cHgnLCAnei1pbmRleCcgOiAnMSd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKS5maW5kKCdkaXYnKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2hlaWdodDogMjFweCAhaW1wb3J0YW50OycrJ3dpZHRoOiAxMHB4ICFpbXBvcnRhbnQ7JysnbGVmdDo3cHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDI1cHggIWltcG9ydGFudDsnKyd3aWR0aDogOXB4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICAvLyBpd0Nsb3NlQnRuLmNzcyh7J2Rpc3BsYXknOiAnbm9uZSd9KTtcbiAgICB9XG4gICAgJHNjb3BlLnNob3dfbWFya2VyID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgJHNjb3BlLmRldGFsbGUgPSBkYXRhO1xuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IGZhbHNlO1xuICAgIH1cbiAgICAkc2NvcGUucmV0dXJuID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlOyBcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlO1xuICAgIH1cbiAgICAkc2NvcGUuY2xlYXJNYXJrZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbWFya2VyW2ldLnNldE1hcChudWxsKTtcbiAgICAgICAgfVxuICAgICAgICBtYXJrZXIgPSBbXTtcbiAgICAgIH1cbiBcbn1dKTsgXG5tb2RlbC5kaXJlY3RpdmUoJ3Rvb2x0aXAnLCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gb24gbW91c2VlbnRlclxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudG9vbHRpcCgnc2hvdycpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBvbiBtb3VzZWxlYXZlXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50b29sdGlwKCdoaWRlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ1NlcnZpY2VzJywgW10pXG4uZmFjdG9yeSgnU2VydmljZXMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHJldHVybiB7IFxuICAgICAgICBMb2FkOiBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnM/bm9tYnJlPScrcSsnJnBlcl9wYWdlPScrcCsnJnBhZ2U9JytwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBMb2FkX1NlcnZpY2VzOiBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9zZXJ2aWNlcz9ub21icmU9JytxKycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7IFxufSkoKTsiXX0=
