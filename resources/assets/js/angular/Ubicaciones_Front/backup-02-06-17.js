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