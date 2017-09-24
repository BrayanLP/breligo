(function () {
'use strict';
var model = angular.module('model', 
    ['Services',"ngSanitize","angular-uuid"]);

var seletedValue = 15;

model.controller('Ctrl', 
    ['$scope',
    '$http',
    '$timeout',
    'Services',  
    'uuid',
    function(
        $scope,
        $http,
        $timeout,
        Services,
        uuid)
{  
    var html = function(id) { 
        return document.getElementById(id); 
    };

    $scope.temp = [];
    $scope.new_marker = [];
    $scope.data_real = [];
    $scope.cant_rows = "10";
    $scope.mapa = 'full';
    $scope.header_search = true;
    
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
    };

    $scope.update_foto = function(){
        console.log($scope.data_load);
        $scope.temp_data = [];
        angular.forEach($scope.data_load, function(value){
            
            var foto = 'https://maps.googleapis.com/maps/api/streetview?size=606x400&location='+value.lat+','+value.lng+'&pitch=-0.76&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE';
            // var id = value.id;
            var obj = {
                foto : foto 

            }
            // $scope.temp_data.push(obj);
            $scope.update_full(value.id,obj);
            // console.log(value.id, obj);
        })
    };

    $scope.update_full = function(id,data){ 
        // console.log(id, data);
        Services.Update_img(id,data).then(function (response) {
            console.log(response);
            // $('#edit').modal('hide');
            // $scope.init();
        }, function (response) {
        });
    };

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
        // $scope.load('',200,1);
    }   
    
    $scope.show_panel = true; 
    $scope.show_detalle = false;
    $scope.disable_button = false;
    var map,map2,marker,places,autocomplete,infoWindow;
    var markers = [];
    var create_marker = [];
    var countryRestrict = {'country': 'pe'};
    var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
    var hostnameRegexp = new RegExp('^https?://.+?/');
    // infoWindow = new google.maps.InfoWindow(); 
    
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
        // infoWindow = new google.maps.InfoWindow(); 
        infoWindow.close();
    } 
    
    $scope.Incializacion = function() {
        var lima = {lat: -11.9877519, lng: -77.090733};
        // {lat: -12.046629, lng: -77.0214337}

        map = new google.maps.Map(document.getElementById('mapa'), {
            center: lima,
            zoom: 11,
            minZoom: 5,
            styles : style
        });

        /* permite ocultar el infowindow */
        infoWindow = new google.maps.InfoWindow(); 
        google.maps.event.addListener(map, 'click', function(){
            closeInfoWindow();
        });
        


        $scope.cargar_marcadores(); 
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsService = new google.maps.DirectionsService();
        
        
        $('#input_start').focus(function(event){
            map.addListener('click', function(event) {
                // console.log(event);
                addMarker(event.latLng);
            })
        });  

        
    }
    
    $scope.cargar_marcadores = function(){
            
        var input = document.getElementById('autocomplete_search');
        var searchBox = new google.maps.places.SearchBox(input);  
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
        searchBox.addListener('places_changed', function() {
            
            var service = new google.maps.places.PlacesService(map);        

            var places = searchBox.getPlaces();
            var place = places[0];
            var radius = 5000;  
            if (places.length == 0) {
                return;
            }
 
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];
            $scope.data_load = [];
            var bounds = new google.maps.LatLngBounds();

            if(places.length > 1 ){
                // console.log('entre');
                // $scope.mapa = 'detalle'; 
                $scope.show_list_marker();
            }
            else{
                $scope.show_detail_marker();   
            }
            // console.log(places.length);
            for (var i = 0; i < places.length; i++) {
                // var place = places[i];
                // console.log(places[i].place_id);
                // console.log(places[i]);
                service.getDetails({placeId: places[i].place_id}, function(place, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        return;
                    }
                    // console.log(place)
                    createMarker(place); 
                    // console.log(marker);
                    // infoWindow.setContent(marker);
                    // infoWindow.open(map, marker);
                    // buildIWContent(place);
                });

                // addResult(places[i], i);

                if (places[i].geometry.viewport) {
                  // Only geocodes have viewport.
                  bounds.union(places[i].geometry.viewport);
                } else {
                  bounds.extend(places[i].geometry.location);
                }
            } 
            map.fitBounds(bounds);
        }); 
    }

    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }
    function createMarker(place) { 
        // console.log(place.types);
        if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
        }
        else{

        }

        angular.forEach(place.types,function(value , i){
            // console.log(value);
            if( 
                value === 'bank' || value === 'finance'
            ){
                var icon = { 
                    url: '//localhost:8000/assets/app/images/banco-color.svg', 
                    scaledSize: new google.maps.Size(20, 20), 
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0),
                    scale: 1
                }; 
                place.icon_new = icon; 
            } 
            else if(
                value === 'police'
            ){
                var icon = { 
                    url: '//localhost:8000/assets/app/images/comisaria-color.svg', 
                    scaledSize: new google.maps.Size(20, 20),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0),
                    scale: 1
                };  
                place.icon_new = icon;
            }
            else if(
                value === 'hospital'
            ){
                var icon = { 
                    url: '//localhost:8000/assets/app/images/hospital-color.svg', 
                    scaledSize: new google.maps.Size(20, 20),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0),
                    scale: 1
                };  
                place.icon_new = icon;
            }
            else if(
                value === 'fire_station'
            ){
                var icon = { 
                    url: '//localhost:8000/assets/app/images/bomberos-color.svg', 
                    scaledSize: new google.maps.Size(20, 20),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0),
                    scale: 1
                }; 
                place.icon_new = icon; 
            } 
            else{
                // console.log("Ocurrio un error inesperado en los ID de Entidades");
            } 
            
        })
        //rgb(49, 70, 106) #9e9e9e
        // var icon = {
        //     url: place.icon,
        //     size: new google.maps.Size(20, 20),
        //     origin: new google.maps.Point(0, 0),
        //     anchor: new google.maps.Point(0, 0),
        //     scaledSize: new google.maps.Size(20, 20)
        // }; 
        var pos = {};
        pos.lat = place.geometry.location.lat();
        pos.lng = place.geometry.location.lng();
        if( place.photos !== undefined){
            var img = place.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400});
        }
        else{
            var img = 'https://maps.googleapis.com/maps/api/streetview?size=606x400&location='+pos.lat+','+pos.lng+'&key=AIzaSyDSJG8JkNJ3i7pyHZz1gC1TYVUicm3C3sE'
        }
        if (place.formatted_address) { 
          var direccion = place.formatted_address;
        } else { 
        }
        if (place.rating) {
            var ratingHtml = '';
            for (var i = 0; i < 5; i++) {
                var raking_number = place.rating;
                if (place.rating < (i + 0.5)) {
                    ratingHtml += '&#10025;';
                } else {
                    ratingHtml += '&#10029;';
                } 
            }
        } 
        else{ 
        }

        if (place.website) {
            var fullUrl = place.website;
            var website = hostnameRegexp.exec(place.website);
            if (website === null) {
                website =  place.website + '/';
                fullUrl = "Web: <a href="+website+" target='_blank'>"+website+"</a>";
            } 
        } 
        else {
            fullUrl = ""; 
        }
        if(place.formatted_phone_number){
            var telefono = place.formatted_phone_number;
        }
        else{

        }

        if(place.reviews){ 
            angular.forEach( place.reviews,function(value,j){
                // console.log(value);
                var ratingHtml = '';
                for (var i = 0; i < 5; i++) {
                    var raking_number = value.rating;
                    if (value.rating < (i + 0.5)) {
                        ratingHtml += '&#10025;';
                    } else {
                        ratingHtml += '&#10029;';
                    } 
                }
                value.raking = ratingHtml;

            })
        }
        // Create a marker for each place.
        var marker = new google.maps.Marker({
            map: map,
            icon: place.icon_new,
            title: place.name,
            position: pos,
            animation: google.maps.Animation.DROP,
            foto: img,
            direccion: direccion,
            url: fullUrl,
            raking: ratingHtml,
            number_r : raking_number,
            telefono: telefono,
            comentarios: place.reviews
        });

        markers.push(marker);  
        $scope.data_load.push(marker);
        $scope.detalle = marker;

        // console.log($scope.detalle);
        $scope.$digest();
        google.maps.event.addListener(marker, 'click', function(){ 
            
            
            infoWindow.setPosition(marker.position);  
            infoWindow.open(map, this); 
            infoWindow.setContent(
                [
                    '<div class="center globo_ubicacion">', 
                    '<img width="100%" src="'+marker.foto+'">',
                    '<h6>'+marker.title+'</h6>',  
                    '<p>'+marker.direccion+'</p>', 
                    '<p> ranking: '+marker.raking +'  '+marker.number_r+'</p>',  
                    '<p>'+marker.url+'</p>',   
                    '</div>'
                ].join('')
            ); 
            $scope.set_google_maps();  
        });
    }

    function addMarker(location) {
        for (var i = 0; i < create_marker.length; i++) {
            if (create_marker[i]) {
                create_marker[i].setMap(null);
            }
        }
        create_marker = [];
        // console.log(location.lat(), location.lng());
        var marker = new google.maps.Marker({
          position: location,
          map: map
        });
        create_marker.push(marker);
        $scope.input_start = location.lat()+","+location.lng();
        var latlng = new google.maps.LatLng(location.lat(),location.lng()); 
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    // console.log(results[0]); 
                    $scope.text_start = results[0].formatted_address; 
                    $scope.indicaciones();
                    $scope.$digest();
                } else {
                  alert('No results found');
                }  
            }
            else {
                alert('Geocoder failed due to: ' + status);
            } 
        })
    }
    function onPlaceChanged(place) {
        
        // console.log(place);
        if (place[0].geometry) {
            var location = place[0].geometry.location;
            // console.log(location);
            map.panTo(location);
            map.setZoom(15);
            // createMarker(place);
            search(location);
        }  else {
            document.getElementById('autocomplete_search').placeholder = 'Enter a city';
        }
    }

    // Search for hotels in the selected city, within the viewport of the map.
    function search(location) {
        // console.log(location);
        var places = new google.maps.places.PlacesService(map);
        var search = { 
            location: location,
            radius: 500,
            types: ['establishment']
        };
        // console.log(place);
        places.nearbySearch(search, function(results, status) {
            // console.log(results);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                clearResults();
                clearMarkers();
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
            }
            // if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Create a marker for each hotel found, and
                // assign a letter of the alphabetic to each marker icon.
            // for (var i = 0; i < results.length; i++) {
                // var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
                // var markerIcon = MARKER_PATH + markerLetter + '.png';
                // Use marker animation to drop the icons incrementally on the map.
                // markers[i] = new google.maps.Marker({
                //     position: results[i].geometry.location,
                //     animation: google.maps.Animation.DROP,
                //     icon: markerIcon
                // });
                // If the user clicks a hotel marker, show the details of that hotel
                // in an info window.
                // markers[i].placeResult = results[i];
                // google.maps.event.addListener(markers[i], 'click', showInfoWindow);
                // setTimeout(dropMarker(i), i * 100);
                // addResult(results[i], i);
                // }
            // }
        });
    }
    function addResult(result, i) {
        console.log(result);
        var results = document.getElementById('results');
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';

        var tr = document.createElement('tr');
        tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
        tr.onclick = function() {
          google.maps.event.trigger(markers[i], 'click');
      };

      var iconTd = document.createElement('td');
      var nameTd = document.createElement('td');
      var icon = document.createElement('img');
      icon.src = markerIcon;
      icon.setAttribute('class', 'placeIcon');
      icon.setAttribute('className', 'placeIcon');
      var name = document.createTextNode(result.name);
      iconTd.appendChild(icon);
      nameTd.appendChild(name);
      tr.appendChild(iconTd);
      tr.appendChild(nameTd);
      // results.appendChild(tr);
    }
    function dropMarker(i) {
        return function() {
            markers[i].setMap(map);
        };
    }
    function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i]) {
                markers[i].setMap(null);
            }
        }
        markers = [];
    }
    function clearResults() {
        var results = document.getElementById('results');
        while (results.childNodes[0]) {
            results.removeChild(results.childNodes[0]);
        }
    }
    function showInfoWindow() {
        var marker = this;
        places.getDetails({placeId: marker.placeResult.place_id},
            function(place, status) {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    return;
                }
                // console.log(marker);
                // infoWindow.setContent(marker);
                infoWindow.open(map, marker);
                buildIWContent(place);
            });
    }
    function buildIWContent(place) {
        console.log(place);
        document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
        document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url + '">' + place.name + '</a></b>';
        document.getElementById('iw-address').textContent = place.vicinity;

        if (place.formatted_phone_number) {
          document.getElementById('iw-phone-row').style.display = '';
          document.getElementById('iw-phone').textContent = place.formatted_phone_number;
        } else {
          document.getElementById('iw-phone-row').style.display = 'none';
        }

        // Assign a five-star rating to the hotel, using a black star ('&#10029;')
        // to indicate the rating the hotel has earned, and a white star ('&#10025;')
        // for the rating points not achieved.
        if (place.rating) {
          var ratingHtml = '';
          for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 0.5)) {
              ratingHtml += '&#10025;';
            } else {
              ratingHtml += '&#10029;';
            }
          document.getElementById('iw-rating-row').style.display = '';
          document.getElementById('iw-rating').innerHTML = ratingHtml;
          }
        } else {
          document.getElementById('iw-rating-row').style.display = 'none';
        }

        // The regexp isolates the first part of the URL (domain plus subdomain)
        // to give a short URL for displaying in the info window.
        if (place.website) {
          var fullUrl = place.website;
          var website = hostnameRegexp.exec(place.website);
          if (website === null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
          }
          document.getElementById('iw-website-row').style.display = '';
          document.getElementById('iw-website').textContent = website;
        } else {
          document.getElementById('iw-website-row').style.display = 'none';
        }
    }

    $scope.initMap = function() { 
        // $scope.$watch('search_entidad', function(n){ 
            if($scope.search_entidad != undefined && $scope.search_entidad != ''){
                $scope.load($scope.search_entidad,5,1);
                // $scope.mapa = 'detalle'; 
            }
            else{
                $scope.load('','0',1); 
                // $scope.mapa = 'full'; 
            }
        // });           
    }
    $scope.Incializacion();
    // $scope.initMap();

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

    
    // $scope.location = function(){  
        //     if (navigator.geolocation) {
        //         // INIT RESIZE 
        //         $scope.mapa = 'detalle'; 
        //         $scope.disable_button = true; 
        //         $scope.data = [];

        //         $scope.initMap(); 
        //         window.setTimeout(function() {
        //           google.maps.event.trigger(map, 'resize');
        //         },500);
        //         navigator.geolocation.getCurrentPosition(function(position) {    
        //             $scope.createMarker(map);
        //             $scope.posicion_actual = {
        //               lat: position.coords.latitude,
        //               lng: position.coords.longitude
        //             }; 
                    
        //             var geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.posicion_actual.lat + ',' + $scope.posicion_actual.lng + '&sensor=false';
        //             console.log(geocoding);

        //             var image = {
        //                 url: '/assets/app/images/position_actual.png', 
        //                 size: new google.maps.Size(50, 50), 
        //                 origin: new google.maps.Point(0, 0), 
        //                 anchor: new google.maps.Point(0, 40)
        //             }; 
        //             var marker = new google.maps.Marker({
        //                 position: $scope.posicion_actual,
        //                 map: map,
        //                 icon: image
        //             });

        //             var circle = new google.maps.Circle({
        //                 center: $scope.posicion_actual,
        //                 radius: 1000,
        //                 map: map,
        //                 fillColor: '#39527b',
        //                 fillOpacity: 0,
        //                 strokeColor: '#39527b',
        //                 strokeOpacity: 0.2
        //             });   
        //             $.getJSON(geocoding).done(function(location) {
        //                 // console.log(location.results[0].formatted_address);
        //                 // $scope.search_entidad = location.results[0].formatted_address;
        //                 // $scope.$digest();
        //             });
        //             for (var i = $scope.data_load.length; i--;){ 
        //                 if(parseFloat( $scope.getKilometros( $scope.posicion_actual.lat, $scope.posicion_actual.lng, $scope.data_load[i].lat, $scope.data_load[i].lng)) <= 1){   
        //                     $scope.data_real.push($scope.data_load[i]);
        //                     // console.log($scope.data_real);
        //                     $scope.$digest();
        //                     // var min = Math.min.apply(null, array);
        //                     // console.log(i +' el minimo es: '+ min);
        //                     // console.log(result);
        //                     // console.log($scope.data_load[i]);
        //                     // if(i == 0){
        //                         // console.log($scope.data_load[i]);
        //                         // $.getJSON(geocoding).done(function(location) {
        //                             // console.log(location.results[0].formatted_address);
        //                         //     var start = location.results[0].formatted_address;
        //                         //     var end = $scope.data_load[3].direccion;
        //                         //     if(!start || !end){
        //                         //         alert("Start and End addresses are required");
        //                         //         return;
        //                         //     }
        //                         //     var request = {
        //                         //             origin: start,
        //                         //             destination: end,
        //                         //             travelMode: google.maps.DirectionsTravelMode['WALKING'],
        //                         //             unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
        //                         //             provideRouteAlternatives: false
        //                         //     };

        //                         //     directionsService.route(request, function(response, status) {
        //                         //         if (status == google.maps.DirectionsStatus.OK) {
        //                         //             directionsDisplay.setMap(map);
        //                         //             directionsDisplay.setPanel($("#directions_panel").get(0));
        //                         //             directionsDisplay.setDirections(response);
        //                         //         } else {
        //                         //             console.log(response,status);
        //                         //             alert("There is no directions available between these two points");
        //                         //         }
        //                         //     });
        //                         // })
        //                     // }
                            
        //                 } 
        //                 else{ 
        //                     $scope.del($scope.data_load.indexOf($scope.data_load[i])); 
        //                     $scope.new_marker[i].setMap(null);  
        //                     $scope.$digest(); 
        //                 } 
        //             } 

                    
        //             map.setZoom(18);
        //             map.panTo(marker.position);
        //             map.fitBounds(circle.getBounds());
        //         }, function() {   
        //             $scope.handleLocationError(true, infoWindow, map.getCenter());
        //         }); 
        //     } else { 
        //         $scope.handleLocationError(false, infoWindow, map.getCenter());

        //     }
         
    // }
    var all_me = [];
    $scope.location = function(){ 
         
        if (navigator.geolocation) { 
            navigator.geolocation.getCurrentPosition(function(position) {    
                // console.log(position);
                $scope.posicion_actual = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }; 
                console.log($scope.posicion_actual);
                for (var i = 0; i < all_me.length; i++) {
                    if (all_me[i]) {
                        all_me[i].setMap(null);
                    }
                }
                all_me = []; 
                $scope.input_start = $scope.posicion_actual.lat+","+$scope.posicion_actual.lng;

                var image = {
                    url: '/assets/app/images/position_actual.png', 
                    size: new google.maps.Size(20, 20),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 0),
                    scaledSize: new google.maps.Size(20, 20)

                };  
                var me = new google.maps.Marker({
                    position: $scope.posicion_actual,
                    map: map,
                    icon: image
                });    
                all_me.push(me); 

                var geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.posicion_actual.lat + ',' + $scope.posicion_actual.lng + '&sensor=false'; 
                $.getJSON(geocoding).done(function(location) { 
                    $scope.text_start = location.results[0].formatted_address;  
                    $scope.$digest();
                });  
                map.setZoom(16);
                map.panTo(me.position); 
                $scope.indicaciones();
                $scope.load_allBomberos();
                $scope.$digest();

                // $scope.cargar_marcadores();
            }, function() {   
                $scope.handleLocationError(true, infoWindow, map.getCenter());
            }); 
        } else { 
            $scope.handleLocationError(false, infoWindow, map.getCenter());

        }
         
    }
    /* permite mostra y ocultar los marcadores y actualizar el listado */
    $scope.icon_true = function(){
        $scope.icon_1 = true;
        $scope.icon_2 = true;
        $scope.icon_3 = true;
        $scope.icon_4 = true;
    }
    $scope.icon_true();

    $scope.toggle_Marker = function(id){
        $scope.icon_true();
        for (var i = 0; i < markers.length; i++) {
            if (markers[i]) {
                markers[i].setMap(null);
            }
        }
        markers = [];
        var input = document.getElementById('autocomplete_search');
        if (id === 1) {
            input.value = "bancos";  
            $scope.icon_1 = false;
            $scope.icon1 = "/assets/app/images/banco-color.svg";
        }
        else if(id === 2){ 
            input.value = "comisarias"; 
            $scope.icon_2 = false;
            $scope.icon1 = "/assets/app/images/comisaria-color.svg"; 
        }
        else if(id === 3){ 
            input.value = "hospitales"; 
            $scope.icon_3 = false;
            $scope.icon1 = "/assets/app/images/hospital-color.svg"; 
        }
        else if(id === 4){
            input.value = "bomberos";
            $scope.icon_4 = false;
            $scope.icon1 = "/assets/app/images/bomberos-color.svg";   
            console.log("entre"); 
            // google.maps.event.addListener(map, 'bounds_changed',function(){
            $scope.load_allBomberos();
            // });  
            // $scope.limit_changed(4); 
        }
        google.maps.event.trigger(input, 'focus')
        google.maps.event.trigger(input, 'keydown', {
            keyCode: 13
        });    
    }
    // google.maps.event.addListener(map, 'bounds_changed',$scope.toggle_Marker(id));
    // $scope.toggle_Marker = function(id){ 
    //     console.log("Ingreso el ID: "+id);
    //     $scope.id = document.getElementById(id);;
    //     $scope.id.checked = !$scope.id.checked; 
    //     if($('#'+id).is(':checked')){
    //         for(var i = $scope.data_real.length; i--;){ 
    //             if($scope.data_real[i].id_services === id){  
    //                 var variable = '#'+$scope.data_real[i].id+'-'+id;
    //                 $(variable).show();
    //                 // $scope.del_temp($scope.data_real.indexOf($scope.data_real[i]));   
    //             }
    //             else{
    //                 console.log("=============");
    //                 console.log($scope.data_real[i].id_services);
    //                 console.log("============="); 
    //             }
    //         }
    //         for(var i = 0; i < $scope.new_marker.length; i++){
    //             if($scope.new_marker[i].type === id){ 
    //                 $scope.new_marker[i].setVisible(true);
                    
    //             }
    //         }
    //     }
    //     else{
    //         for(var i = $scope.data_real.length; i--;){ 
    //             if($scope.data_real[i].id_services === id){ 
    //                 var variable = '#'+$scope.data_real[i].id+'-'+id;
    //                 $(variable).hide();
    //                 // $scope.del_temp($scope.data_real.indexOf($scope.data_real[i]));   
    //             }
    //             else{
    //                 console.log("=============");
    //                 console.log($scope.data_real[i].id_services);
    //                 console.log("============="); 
    //             }
    //         }
    //         for(var j = 0; j < $scope.new_marker.length; j++){
    //             if($scope.new_marker[j].type === id){ 
    //                 $scope.new_marker[j].setVisible(false); 
    //             }
    //             else{
    //                 // console.log("-- no se elimino --: "+$scope.data_real[i].id_services);   
    //             } 
    //         }
    //     }
    //     // $scope.$digest();
    // }

    $scope.indicaciones = function(){
        
        if(!$scope.input_start || !$scope.input_end){
            // alert("Start and End addresses are required");
            return;
        }
        var request = {
                origin: $scope.input_start,
                destination: $scope.input_end,
                travelMode: google.maps.DirectionsTravelMode['DRIVING'],
                unitSystem: google.maps.DirectionsUnitSystem['METRIC'],
                provideRouteAlternatives: false
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                // directionsDisplay.setPanel($("#directions_panel").get(0));
                directionsDisplay.setDirections(response);
                $scope.origen = response.request.origin;
                $scope.destino = response.request.destination;
                $scope.indicacion_detalle = true;
                $scope.warning = response.routes[0].warnings[0];
                $scope.distancia = response.routes[0].legs[0].distance.text;
                $scope.duracion = response.routes[0].legs[0].duration.text;
                $scope.ruta_general = response.routes[0].summary;
                $scope.ruta_detalle = response.routes[0].legs[0].steps;
                // $scope.titulo = $('#deta').html(response.routes[0].legs[0].steps[1].instructions);
                 
                // console.log(response);
                $scope.$digest();
            } else {
                // console.log(response,status);
                // alert("There is no directions available between these two points");
            }
        }); 
    }

    $scope.go_position = function(){ 
        // console.log($scope.data_load[i]);
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
                // console.log(response);
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(map);
                    directionsDisplay.setPanel($("#directions_panel").get(0));
                    directionsDisplay.setDirections(response);
                } else {
                    // console.log(response,status);
                    alert("There is no directions available between these two points");
                }
            });
        }) 
    }

    // Elimina 1 x 1 cada dato que no esta en el rango
    $scope.del = function(index){  
        $scope.data_load.splice(index,1);  
    };
    $scope.del_temp = function(index){  
        $scope.data_real.splice(index,1);  
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
        if($scope.data_load != undefined){
            for (var i = 0; i < $scope.data_load.length; i++) {  
                var data_temp = $scope.data_load[i]; 
                var pos = {
                  lat: parseFloat(data_temp.lat),
                  lng: parseFloat(data_temp.lng)
                }; 
                if(data_temp.id_services === 1){
                    var image = { 
                        url: '//localhost:8000/assets/app/images/banco-color.svg', 
                        scaledSize: new google.maps.Size(20, 20), 
                        origin: new google.maps.Point(0, 0), 
                        anchor: new google.maps.Point(0, 0),
                        scale: 1
                    };  
                } 
                else if(data_temp.id_services === 2){
                    var image = { 
                        url: '//localhost:8000/assets/app/images/comisaria-color.svg', 
                        scaledSize: new google.maps.Size(20, 20),  
                        origin: new google.maps.Point(0, 0), 
                        anchor: new google.maps.Point(0, 0),
                        scale: 1
                    };  
                }
                else if(data_temp.id_services === 3){
                    var image = { 
                        url: '//localhost:8000/assets/app/images/hospital-color.svg', 
                        scaledSize: new google.maps.Size(20, 20),  
                        origin: new google.maps.Point(0, 0), 
                        anchor: new google.maps.Point(0, 0),
                        scale: 1
                    };  
                }
                else if(data_temp.id_services === 4){
                    var image = { 
                        url: '//localhost:8000/assets/app/images/bomberos-color.svg', 
                        scaledSize: new google.maps.Size(20, 20),  
                        origin: new google.maps.Point(0, 0), 
                        anchor: new google.maps.Point(0, 0),
                        scale: 1
                    };  
                } 
                else{
                    console.log("Ocurrio un error inesperado en los ID "+data_temp.id_services+" de Entidades");
                } 
                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    animation: google.maps.Animation.DROP, 
                    draggable: false,
                    icon: image,
                    type: data_temp.id_services,
                    foto: data_temp.foto,
                    nombre_empresa: data_temp.nombre_empresa,
                    direccion: data_temp.direccion

                }); 
                $scope.new_marker.push(marker); 
                // $scope.markers_hover(marker);  
                google.maps.event.addListener(marker, 'click', function(){
                    $scope.openInfoWindow(this); 
                });
            }
        }
        else{
            alert('Ocurrio un error al cargar');

        }
        // console.log($scope.new_marker);
        //cierra el infowindow una vez cambie
        infoWindow.close();
    } 

    function toggleBounce() { 
        // marker.setAnimation(google.maps.Animation.BOUNCE); 
    }
    
    
    $scope.markers_hover = function(data){ 
        $scope.return_list = true;
        infoWindow.close();
        $scope.show_detail_marker();
        $scope.detalle = data; 
        // console.log(data); 
        var pos = {};
        pos.lat = data.position.lat();
        pos.lng = data.position.lng();
        // infoWindow = new google.maps.InfoWindow({map: map,maxWidth: 200});
        infoWindow.setPosition(pos); 
        infoWindow.setContent(
            [
                '<div class="center globo_ubicacion">', 
                '<img width="100%" src="'+data.foto+'">',
                '<h6>'+data.title+'</h6>', 
                '<p>'+data.direccion+'</p>', 
                '</div>'
            ].join('')
        ); 
        $scope.set_google_maps(); 
        map.setZoom(18);
        map.panTo(pos);
        $('#ubicaciones').animate({
            scrollTop: '0px'
        }, 0); 
        $('#ubicaciones').css('height','100%');

    } 

    
    $scope.openInfoWindow = function(marker){
        infoWindow.close(); 
        infoWindow = new google.maps.InfoWindow({map: map,maxWidth: 200});
        var pos = marker.position; 
        infoWindow.setPosition(pos); 
        infoWindow.setContent(
            [
                '<div class="center globo_ubicacion">', 
                '<img width="100%" src="'+marker.foto+'">',
                '<h6>'+marker.nombre_empresa+'</h6>', 
                '<p>'+marker.direccion+'</p>', 
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
        // iwOuter.parent().parent().css({left: '10px'});
        // iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 60px !important;'});
        // iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 60px !important;'});
        // iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 0, 0, 0) 0px 1px 6px', 'z-index' : '1'});
        // iwBackground.children(':nth-child(3)').children(':nth-child(1)').find('div').attr('style', function(i,s){ return s + 'height: 21px !important;'+'width: 10px !important;'+'left: -15px !important'});
        // iwBackground.children(':nth-child(3)').children(':nth-child(2)').find('div').attr('style', function(i,s){ return s + 'height: 25px !important;'+'width: 9px !important;'+'left: -15px !important'});
        iwCloseBtn.css({'display': 'none'});
    };

    $scope.show_marker = function(data){
        $scope.mapa = 'detalle'; 
        $scope.hide_search = true;
        $scope.boton_search_global = false;
        // for (var i = 0; i < marker.length; i++) {
        //     marker[i].setMap(null);
        // }  
        
        var pos = {};
        pos.lat = parseFloat(data.lat);
        pos.lng = parseFloat(data.lng);
        console.log(pos); 
        $scope.show_detalle = true;
        $scope.detalle = data;
        $scope.show_panel = false;
        /* hace zoom y renderiza la posicion */ 
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            animation: google.maps.Animation.DROP, 
            draggable: false, 
            type: data.id_services,
            foto: data.foto,
            nombre_empresa: data.nombre_empresa,
            direccion: data.direccion 
        });  
        
        window.setTimeout(function() {
          google.maps.event.trigger(map, 'resize');
        },800);
        map.setZoom(17);
        map.panTo(pos); 
    };

    $scope.search_global = function(search){
        $scope.mapa = 'detalle'; 
        $scope.hide_search = true;
        $scope.show_detalle = false; 
        $scope.show_panel = true; 
        $scope.boton_search_global = false;
        $scope.load(search,10,1);
        $scope.createMarker(map);

    }
    $scope.return = function(){  
        $scope.show_detalle = false; 
        $scope.show_panel   = true;  
        $scope.return_list = false; 
        $('#ubicaciones').css('height','605px');
    };

    $scope.como_llegar = function(lat, lng){ 
        $scope.show_detalle         = false;
        $scope.indicacion_detalle   = true; 
        $scope.show_panel           = false;
        $scope.hide_search          = true; 
        $scope.header_search        = false;
        $scope.return_list          = false;
        $scope.boton_search_global  = false;  
        // mostrar el header de indicador
        $scope.input_end = lat+","+lng; 
        $scope.indicaciones();
        var geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.input_end + '&sensor=false'; 
        $.getJSON(geocoding).done(function(location) {
            console.log(location.results[0].formatted_address);
            $scope.text_end = location.results[0].formatted_address;
            $scope.$digest();

        }); 

    }

    $scope.show_detalle_indicaciones = function(){
        $scope.detalle_distancia = true;
    }

    $scope.show_list_marker = function(){

        $scope.mapa = 'detalle';  
        $scope.show_detalle = false; 
        $scope.show_panel = true;   
        window.setTimeout(function() {
          google.maps.event.trigger(map, 'resize');
        },500);
        $scope.$digest();
    }
    $scope.show_detail_marker = function(){
        $('.ubicaciones').css('padding-top','0px');
        $scope.mapa = 'detalle';  
        $scope.show_detalle = true; 
        $scope.show_panel = false;  
    }

    $scope.close_indicacion = function(){
        directionsDisplay.setMap(null);
        $scope.mapa                 = 'detalle';
        $scope.input_end            = "";    
        $scope.header_search        = true;
        $scope.hide_search          = false;
        $scope.indicacion_detalle   = false;
        $scope.boton_search_global  = false;  
        $scope.show_detalle         = false;
        $scope.show_panel           = true;
        window.setTimeout(function() {
          google.maps.event.trigger(map, 'resize');
        },500);
    }
    google.maps.event.addListener(map, 'zoom_changed', function () {
        var zoom = map.getZoom();
        // console.log(zoom);
        // if (zoom == 21) { marker.setIcon(new google.maps.MarkerImage('images/img.png', null, null, null, new google.maps.Size(1900, 1900))); }
    }); 
    // $scope.limit_changed = function(id){ 
    
    // }
    // ESTE CODIGO CREA HOSPITALES
    // var geocoder = new google.maps.Geocoder(); 
    // $scope.create_hospitales = function(){
    //     Services.load_hospitales().then(function (response) {
    //         console.log(response.data);
    //         $scope.temp_data = [];
    //         $scope.results = response.data; 
    //         angular.forEach($scope.results, function(value){

    //             geocoder.geocode({ 'address': value.direccion}, function geocodeResult(results, status) { 
    //                 if (status == 'OK') {    
    //                     // console.log(results[0]);
    //                     var lat = results[0].geometry.location.lat;
    //                     var lng = results[0].geometry.location.lng;
    //                     // console.log(markerOptions);
    //                     var obj = {
    //                         nombre_temp : "HOSPITAL "+value.nombre,
    //                         id_image : uuid.v4(),
    //                         nombre_empresa : value.nombre_empresa,
    //                         direccion: value.direccion,
    //                         horario: '',
    //                         telefono_1: value.telefono_1, 
    //                         correo: value.correo, 
    //                         lat: lat,
    //                         lng: lng, 
    //                         id_services: 3,
    //                         url: value.link_web

    //                     }
    //                     $scope.temp_data.push(obj);
    //                     console.log($scope.temp_data);
                        
    //                     // $scope.guardar_hospitales(obj);
    //                 } else {
    //                     // En caso de no haber resultados o que haya ocurrido un error
    //                     // lanzamos un mensaje con el error
    //                     alert("Geocoding no tuvo éxito debido a: " + status);
    //                 }
    //             }); 
                
    //         }) 
    //         // $scope.temp.push($scope.data_load);  
    //     }, function (response) {
    //     });
    // }
    // $scope.guardar_hospitales = function (data){  
    //     Services.Create(data).then(function (response) {
    //         console.log(response);
    //         // $scope.init();
    //     }, function (response) {
    //     });
    // };
    // $scope.create_hospitales();
    
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
// model.filter('strLimit', ['$filter', function($filter) {
//     return function(input, limit) {
//       if (! input) return;
//       if (input.length <= limit) {
//           return input;
//       }

//       return $filter('limitTo')(input, limit) + '...';
//    };
// }]);

})();

/* 
    1. cuando el usuario escriba le muestre un listado de entidades
    2. cuando se ubica no haya marcadores
    3. limitaciones: todos los usuarios tienen que contar con un smartphone que tenga gps
*/
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
        },
        Update_img: function(id,data){
            return $http.put(base_url +'/api/v1/locations/'+id,data).then(function (response){
                return response.data;
            });
        },
        load_hospitales: function(){
            return $http.get('http://grupoaizen.com/hospitales.json').then(function (response){   
                return response;
            });
        },
        allBomberos: function(id){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/'+id).then(function(response){
                return response
            })
        },
        bomberos_lima_coman: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CdById/204000').then(function(response){
                return response
            })
        },
        bomberos_lima_compa: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/204000').then(function(response){
                return response;
            })
        },
        bomberos_callao_coman: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CdById/205000').then(function(response){
                return response;
            })
        },
        bomberos_callao_compa: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/205000').then(function(response){
                return response;
            })
        },
        bomberos_lima_sur_coman: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CdById/224000').then(function(response){
                return response;
            })
        },
        bomberos_lima_sur_compa: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/224000').then(function(response){
                return response
            })
        },
        bomberos_lima_norte_coman: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CdById/225000').then(function(response){
                return response;
            })
        },
        bomberos_lima_norte_compa: function(){
            return $http.get('http://www.bomberosperu.gob.pe/WcfServiceForInsert/CdService.svc/CiasById/225000').then(function(response){
                return response;
            })
        }

    };
}); 
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdjNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlViaWNhY2lvbmVzX0Zyb250LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbnZhciBtb2RlbCA9IGFuZ3VsYXIubW9kdWxlKCdtb2RlbCcsIFxuICAgIFsnU2VydmljZXMnLFwibmdTYW5pdGl6ZVwiLFwiYW5ndWxhci11dWlkXCJdKTtcblxudmFyIHNlbGV0ZWRWYWx1ZSA9IDE1O1xuXG5tb2RlbC5jb250cm9sbGVyKCdDdHJsJywgXG4gICAgWyckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnU2VydmljZXMnLCAgXG4gICAgJ3V1aWQnLFxuICAgIGZ1bmN0aW9uKFxuICAgICAgICAkc2NvcGUsXG4gICAgICAgICRodHRwLFxuICAgICAgICAkdGltZW91dCxcbiAgICAgICAgU2VydmljZXMsXG4gICAgICAgIHV1aWQpXG57ICBcbiAgICB2YXIgaHRtbCA9IGZ1bmN0aW9uKGlkKSB7IFxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnRlbXAgPSBbXTtcbiAgICAkc2NvcGUubmV3X21hcmtlciA9IFtdO1xuICAgICRzY29wZS5kYXRhX3JlYWwgPSBbXTtcbiAgICAkc2NvcGUuY2FudF9yb3dzID0gXCIxMFwiO1xuICAgICRzY29wZS5tYXBhID0gJ2Z1bGwnO1xuICAgICRzY29wZS5oZWFkZXJfc2VhcmNoID0gdHJ1ZTtcbiAgICBcbiAgICAkc2NvcGUubG9hZCA9IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgaWYocSA9PSB1bmRlZmluZWQpeyBcbiAgICAgICAgICAgIHEgPSBcIlwiO1xuICAgICAgICB9ICAgXG4gICAgICAgIFNlcnZpY2VzLkxvYWQocSxwLHBhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YV9sb2FkID0gcmVzcG9uc2UuZGF0YTsgXG4gICAgICAgICAgICAvLyAkc2NvcGUudGVtcC5wdXNoKCRzY29wZS5kYXRhX2xvYWQpOyAgXG4gICAgICAgICAgICAkc2NvcGUudG8gPSByZXNwb25zZS50bzsgXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSByZXNwb25zZS50b3RhbDtcbiAgICAgICAgICAgICRzY29wZS5sYXN0X3BhZ2UgPSByZXNwb25zZS5sYXN0X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudF9wYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSByZXNwb25zZS5uZXh0X3BhZ2VfdXJsO1xuICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSByZXNwb25zZS5wcmV2X3BhZ2VfdXJsOyBcbiAgICAgICAgICAgIGlmKCRzY29wZS5wcmV2X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSAkc2NvcGUucHJldl9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigkc2NvcGUubmV4dF9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gJHNjb3BlLm5leHRfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTsgXG4gICAgfTtcblxuICAgICRzY29wZS51cGRhdGVfZm90byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWQpO1xuICAgICAgICAkc2NvcGUudGVtcF9kYXRhID0gW107XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YV9sb2FkLCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBmb3RvID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdHJlZXR2aWV3P3NpemU9NjA2eDQwMCZsb2NhdGlvbj0nK3ZhbHVlLmxhdCsnLCcrdmFsdWUubG5nKycmcGl0Y2g9LTAuNzYma2V5PUFJemFTeURTSkc4SmtOSjNpN3B5SFp6MWdDMVRZVlVpY20zQzNzRSc7XG4gICAgICAgICAgICAvLyB2YXIgaWQgPSB2YWx1ZS5pZDtcbiAgICAgICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICAgICAgZm90byA6IGZvdG8gXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICRzY29wZS50ZW1wX2RhdGEucHVzaChvYmopO1xuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZV9mdWxsKHZhbHVlLmlkLG9iaik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWx1ZS5pZCwgb2JqKTtcbiAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVwZGF0ZV9mdWxsID0gZnVuY3Rpb24oaWQsZGF0YSl7IFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpZCwgZGF0YSk7XG4gICAgICAgIFNlcnZpY2VzLlVwZGF0ZV9pbWcoaWQsZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIC8vICQoJyNlZGl0JykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgIC8vICRzY29wZS5pbml0KCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmxvYWRfc2VydmljZXMgPSBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgIGlmKHEgPT0gdW5kZWZpbmVkKXsgXG4gICAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfSAgXG4gICAgICAgIFNlcnZpY2VzLkxvYWRfU2VydmljZXMocSxwLHBhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YV9sb2FkX3NlcnZpY2VzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkX3NlcnZpY2VzKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pOyBcbiAgICB9O1xuIFxuICAgICRzY29wZS5sb2FkX3NlcnZpY2VzKCcnLDEwLDEpO1xuXG5cbiAgICBcbiAgICBcbiAgICAkc2NvcGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICRzY29wZS5sb2FkKCcnLDIwMCwxKTtcbiAgICB9ICAgXG4gICAgXG4gICAgJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlOyBcbiAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7XG4gICAgJHNjb3BlLmRpc2FibGVfYnV0dG9uID0gZmFsc2U7XG4gICAgdmFyIG1hcCxtYXAyLG1hcmtlcixwbGFjZXMsYXV0b2NvbXBsZXRlLGluZm9XaW5kb3c7XG4gICAgdmFyIG1hcmtlcnMgPSBbXTtcbiAgICB2YXIgY3JlYXRlX21hcmtlciA9IFtdO1xuICAgIHZhciBjb3VudHJ5UmVzdHJpY3QgPSB7J2NvdW50cnknOiAncGUnfTtcbiAgICB2YXIgTUFSS0VSX1BBVEggPSAnaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvaW1hZ2VzL21hcmtlcl9ncmVlbic7XG4gICAgdmFyIGhvc3RuYW1lUmVnZXhwID0gbmV3IFJlZ0V4cCgnXmh0dHBzPzovLy4rPy8nKTtcbiAgICAvLyBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTsgXG4gICAgXG4gICAgdmFyIGRpcmVjdGlvbnNEaXNwbGF5ID0gbnVsbDtcbiAgICB2YXIgZGlyZWN0aW9uc1NlcnZpY2UgPSBudWxsOyBcbiAgICAvLyB2YXIgc3R5bGUgPSBbe1wiZmVhdHVyZVR5cGVcIjpcImFkbWluaXN0cmF0aXZlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzMxNDY2YVwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOlwiLTEzXCJ9LHtcImxpZ2h0bmVzc1wiOlwiNlwifSx7XCJnYW1tYVwiOlwiMS44MVwifSx7XCJjb2xvclwiOlwiI2M5Y2NkMVwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHNcIixcInN0eWxlcnNcIjpbe1wid2VpZ2h0XCI6XCIxLjgyXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0XCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LmZpbGxcIixcInN0eWxlcnNcIjpbe1wibGlnaHRuZXNzXCI6XCIzXCJ9LHtcImdhbW1hXCI6XCIwLjAwXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xXCJ9LHtcIndlaWdodFwiOlwiMi4zMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJwb2lcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wic2F0dXJhdGlvblwiOi0xMDB9LHtcImxpZ2h0bmVzc1wiOjQ1fSx7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmhpZ2h3YXlcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwic2ltcGxpZmllZFwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuYXJ0ZXJpYWxcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMuaWNvblwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn0se1wic2F0dXJhdGlvblwiOlwiLTEwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ0cmFuc2l0XCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9uXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwid2F0ZXJcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiM1Mzc1YWNcIn0se1widmlzaWJpbGl0eVwiOlwib25cIn1dfV07XG4gICAgdmFyIHN0eWxlID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmUuY291bnRyeVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaHVlXCI6IFwiI2ZmMDAwMFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuYXR0cmFjdGlvblwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLmJ1c2luZXNzXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gY2xvc2VJbmZvV2luZG93KCl7XG4gICAgICAgIC8vIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgIH0gXG4gICAgXG4gICAgJHNjb3BlLkluY2lhbGl6YWNpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGxpbWEgPSB7bGF0OiAtMTEuOTg3NzUxOSwgbG5nOiAtNzcuMDkwNzMzfTtcbiAgICAgICAgLy8ge2xhdDogLTEyLjA0NjYyOSwgbG5nOiAtNzcuMDIxNDMzN31cblxuICAgICAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBhJyksIHtcbiAgICAgICAgICAgIGNlbnRlcjogbGltYSxcbiAgICAgICAgICAgIHpvb206IDExLFxuICAgICAgICAgICAgbWluWm9vbTogNSxcbiAgICAgICAgICAgIHN0eWxlcyA6IHN0eWxlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIHBlcm1pdGUgb2N1bHRhciBlbCBpbmZvd2luZG93ICovXG4gICAgICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgY2xvc2VJbmZvV2luZG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBcblxuXG4gICAgICAgICRzY29wZS5jYXJnYXJfbWFyY2Fkb3JlcygpOyBcbiAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyKCk7XG4gICAgICAgIGRpcmVjdGlvbnNTZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTZXJ2aWNlKCk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgJCgnI2lucHV0X3N0YXJ0JykuZm9jdXMoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgbWFwLmFkZExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgICAgICAgICAgIGFkZE1hcmtlcihldmVudC5sYXRMbmcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7ICBcblxuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgJHNjb3BlLmNhcmdhcl9tYXJjYWRvcmVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0b2NvbXBsZXRlX3NlYXJjaCcpO1xuICAgICAgICB2YXIgc2VhcmNoQm94ID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5TZWFyY2hCb3goaW5wdXQpOyAgXG4gICAgICAgIG1hcC5hZGRMaXN0ZW5lcignYm91bmRzX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWFyY2hCb3guc2V0Qm91bmRzKG1hcC5nZXRCb3VuZHMoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZWFyY2hCb3guYWRkTGlzdGVuZXIoJ3BsYWNlc19jaGFuZ2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlKG1hcCk7ICAgICAgICBcblxuICAgICAgICAgICAgdmFyIHBsYWNlcyA9IHNlYXJjaEJveC5nZXRQbGFjZXMoKTtcbiAgICAgICAgICAgIHZhciBwbGFjZSA9IHBsYWNlc1swXTtcbiAgICAgICAgICAgIHZhciByYWRpdXMgPSA1MDAwOyAgXG4gICAgICAgICAgICBpZiAocGxhY2VzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuIFxuICAgICAgICAgICAgbWFya2Vycy5mb3JFYWNoKGZ1bmN0aW9uKG1hcmtlcikge1xuICAgICAgICAgICAgICAgIG1hcmtlci5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG1hcmtlcnMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWQgPSBbXTtcbiAgICAgICAgICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG5cbiAgICAgICAgICAgIGlmKHBsYWNlcy5sZW5ndGggPiAxICl7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2VudHJlJyk7XG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7IFxuICAgICAgICAgICAgICAgICRzY29wZS5zaG93X2xpc3RfbWFya2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICRzY29wZS5zaG93X2RldGFpbF9tYXJrZXIoKTsgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlcy5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbGFjZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvLyB2YXIgcGxhY2UgPSBwbGFjZXNbaV07XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2VzW2ldLnBsYWNlX2lkKTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZXNbaV0pO1xuICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0RGV0YWlscyh7cGxhY2VJZDogcGxhY2VzW2ldLnBsYWNlX2lkfSwgZnVuY3Rpb24ocGxhY2UsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzICE9PSBnb29nbGUubWFwcy5wbGFjZXMuUGxhY2VzU2VydmljZVN0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlKVxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVNYXJrZXIocGxhY2UpOyBcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRDb250ZW50KG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGluZm9XaW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJ1aWxkSVdDb250ZW50KHBsYWNlKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIGFkZFJlc3VsdChwbGFjZXNbaV0sIGkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlc1tpXS5nZW9tZXRyeS52aWV3cG9ydCkge1xuICAgICAgICAgICAgICAgICAgLy8gT25seSBnZW9jb2RlcyBoYXZlIHZpZXdwb3J0LlxuICAgICAgICAgICAgICAgICAgYm91bmRzLnVuaW9uKHBsYWNlc1tpXS5nZW9tZXRyeS52aWV3cG9ydCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGJvdW5kcy5leHRlbmQocGxhY2VzW2ldLmdlb21ldHJ5LmxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhib3VuZHMpO1xuICAgICAgICB9KTsgXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsbGJhY2socmVzdWx0cywgc3RhdHVzKSB7XG4gICAgICAgIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVNYXJrZXIocmVzdWx0c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTWFya2VyKHBsYWNlKSB7IFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZS50eXBlcyk7XG4gICAgICAgIGlmICghcGxhY2UuZ2VvbWV0cnkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmV0dXJuZWQgcGxhY2UgY29udGFpbnMgbm8gZ2VvbWV0cnlcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICB9XG5cbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKHBsYWNlLnR5cGVzLGZ1bmN0aW9uKHZhbHVlICwgaSl7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gICAgICAgICAgICBpZiggXG4gICAgICAgICAgICAgICAgdmFsdWUgPT09ICdiYW5rJyB8fCB2YWx1ZSA9PT0gJ2ZpbmFuY2UnXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgIHZhciBpY29uID0geyBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9iYW5jby1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgcGxhY2UuaWNvbl9uZXcgPSBpY29uOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBlbHNlIGlmKFxuICAgICAgICAgICAgICAgIHZhbHVlID09PSAncG9saWNlJ1xuICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICB2YXIgaWNvbiA9IHsgXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvY29taXNhcmlhLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIHBsYWNlLmljb25fbmV3ID0gaWNvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoXG4gICAgICAgICAgICAgICAgdmFsdWUgPT09ICdob3NwaXRhbCdcbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgdmFyIGljb24gPSB7IFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2hvc3BpdGFsLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIHBsYWNlLmljb25fbmV3ID0gaWNvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoXG4gICAgICAgICAgICAgICAgdmFsdWUgPT09ICdmaXJlX3N0YXRpb24nXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgIHZhciBpY29uID0geyBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9ib21iZXJvcy1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgIHBsYWNlLmljb25fbmV3ID0gaWNvbjsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk9jdXJyaW8gdW4gZXJyb3IgaW5lc3BlcmFkbyBlbiBsb3MgSUQgZGUgRW50aWRhZGVzXCIpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIFxuICAgICAgICB9KVxuICAgICAgICAvL3JnYig0OSwgNzAsIDEwNikgIzllOWU5ZVxuICAgICAgICAvLyB2YXIgaWNvbiA9IHtcbiAgICAgICAgLy8gICAgIHVybDogcGxhY2UuaWNvbixcbiAgICAgICAgLy8gICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksXG4gICAgICAgIC8vICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgLy8gICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAvLyAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKVxuICAgICAgICAvLyB9OyBcbiAgICAgICAgdmFyIHBvcyA9IHt9O1xuICAgICAgICBwb3MubGF0ID0gcGxhY2UuZ2VvbWV0cnkubG9jYXRpb24ubGF0KCk7XG4gICAgICAgIHBvcy5sbmcgPSBwbGFjZS5nZW9tZXRyeS5sb2NhdGlvbi5sbmcoKTtcbiAgICAgICAgaWYoIHBsYWNlLnBob3RvcyAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHZhciBpbWcgPSBwbGFjZS5waG90b3NbMF0uZ2V0VXJsKHsnbWF4V2lkdGgnOiA0MDAsICdtYXhIZWlnaHQnOiA0MDB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIGltZyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvc3RyZWV0dmlldz9zaXplPTYwNng0MDAmbG9jYXRpb249Jytwb3MubGF0KycsJytwb3MubG5nKycma2V5PUFJemFTeURTSkc4SmtOSjNpN3B5SFp6MWdDMVRZVlVpY20zQzNzRSdcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxhY2UuZm9ybWF0dGVkX2FkZHJlc3MpIHsgXG4gICAgICAgICAgdmFyIGRpcmVjY2lvbiA9IHBsYWNlLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxhY2UucmF0aW5nKSB7XG4gICAgICAgICAgICB2YXIgcmF0aW5nSHRtbCA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcmFraW5nX251bWJlciA9IHBsYWNlLnJhdGluZztcbiAgICAgICAgICAgICAgICBpZiAocGxhY2UucmF0aW5nIDwgKGkgKyAwLjUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjU7JztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByYXRpbmdIdG1sICs9ICcmIzEwMDI5Oyc7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgZWxzZXsgXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGxhY2Uud2Vic2l0ZSkge1xuICAgICAgICAgICAgdmFyIGZ1bGxVcmwgPSBwbGFjZS53ZWJzaXRlO1xuICAgICAgICAgICAgdmFyIHdlYnNpdGUgPSBob3N0bmFtZVJlZ2V4cC5leGVjKHBsYWNlLndlYnNpdGUpO1xuICAgICAgICAgICAgaWYgKHdlYnNpdGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB3ZWJzaXRlID0gIHBsYWNlLndlYnNpdGUgKyAnLyc7XG4gICAgICAgICAgICAgICAgZnVsbFVybCA9IFwiV2ViOiA8YSBocmVmPVwiK3dlYnNpdGUrXCIgdGFyZ2V0PSdfYmxhbmsnPlwiK3dlYnNpdGUrXCI8L2E+XCI7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZ1bGxVcmwgPSBcIlwiOyBcbiAgICAgICAgfVxuICAgICAgICBpZihwbGFjZS5mb3JtYXR0ZWRfcGhvbmVfbnVtYmVyKXtcbiAgICAgICAgICAgIHZhciB0ZWxlZm9ubyA9IHBsYWNlLmZvcm1hdHRlZF9waG9uZV9udW1iZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYocGxhY2UucmV2aWV3cyl7IFxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCBwbGFjZS5yZXZpZXdzLGZ1bmN0aW9uKHZhbHVlLGope1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB2YXIgcmF0aW5nSHRtbCA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByYWtpbmdfbnVtYmVyID0gdmFsdWUucmF0aW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUucmF0aW5nIDwgKGkgKyAwLjUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYXRpbmdIdG1sICs9ICcmIzEwMDI1Oyc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYXRpbmdIdG1sICs9ICcmIzEwMDI5Oyc7XG4gICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhbHVlLnJha2luZyA9IHJhdGluZ0h0bWw7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGEgbWFya2VyIGZvciBlYWNoIHBsYWNlLlxuICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgIGljb246IHBsYWNlLmljb25fbmV3LFxuICAgICAgICAgICAgdGl0bGU6IHBsYWNlLm5hbWUsXG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICAgICAgICAgIGZvdG86IGltZyxcbiAgICAgICAgICAgIGRpcmVjY2lvbjogZGlyZWNjaW9uLFxuICAgICAgICAgICAgdXJsOiBmdWxsVXJsLFxuICAgICAgICAgICAgcmFraW5nOiByYXRpbmdIdG1sLFxuICAgICAgICAgICAgbnVtYmVyX3IgOiByYWtpbmdfbnVtYmVyLFxuICAgICAgICAgICAgdGVsZWZvbm86IHRlbGVmb25vLFxuICAgICAgICAgICAgY29tZW50YXJpb3M6IHBsYWNlLnJldmlld3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWFya2Vycy5wdXNoKG1hcmtlcik7ICBcbiAgICAgICAgJHNjb3BlLmRhdGFfbG9hZC5wdXNoKG1hcmtlcik7XG4gICAgICAgICRzY29wZS5kZXRhbGxlID0gbWFya2VyO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kZXRhbGxlKTtcbiAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbigpeyBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpbmZvV2luZG93LnNldFBvc2l0aW9uKG1hcmtlci5wb3NpdGlvbik7ICBcbiAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbihtYXAsIHRoaXMpOyBcbiAgICAgICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2VudGVyIGdsb2JvX3ViaWNhY2lvblwiPicsIFxuICAgICAgICAgICAgICAgICAgICAnPGltZyB3aWR0aD1cIjEwMCVcIiBzcmM9XCInK21hcmtlci5mb3RvKydcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPGg2PicrbWFya2VyLnRpdGxlKyc8L2g2PicsICBcbiAgICAgICAgICAgICAgICAgICAgJzxwPicrbWFya2VyLmRpcmVjY2lvbisnPC9wPicsIFxuICAgICAgICAgICAgICAgICAgICAnPHA+IHJhbmtpbmc6ICcrbWFya2VyLnJha2luZyArJyAgJyttYXJrZXIubnVtYmVyX3IrJzwvcD4nLCAgXG4gICAgICAgICAgICAgICAgICAgICc8cD4nK21hcmtlci51cmwrJzwvcD4nLCAgIFxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgICAgIF0uam9pbignJylcbiAgICAgICAgICAgICk7IFxuICAgICAgICAgICAgJHNjb3BlLnNldF9nb29nbGVfbWFwcygpOyAgXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE1hcmtlcihsb2NhdGlvbikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNyZWF0ZV9tYXJrZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChjcmVhdGVfbWFya2VyW2ldKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlX21hcmtlcltpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3JlYXRlX21hcmtlciA9IFtdO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbi5sYXQoKSwgbG9jYXRpb24ubG5nKCkpO1xuICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgcG9zaXRpb246IGxvY2F0aW9uLFxuICAgICAgICAgIG1hcDogbWFwXG4gICAgICAgIH0pO1xuICAgICAgICBjcmVhdGVfbWFya2VyLnB1c2gobWFya2VyKTtcbiAgICAgICAgJHNjb3BlLmlucHV0X3N0YXJ0ID0gbG9jYXRpb24ubGF0KCkrXCIsXCIrbG9jYXRpb24ubG5nKCk7XG4gICAgICAgIHZhciBsYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxvY2F0aW9uLmxhdCgpLGxvY2F0aW9uLmxuZygpKTsgXG4gICAgICAgIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xuICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHsnbGF0TG5nJzogbGF0bG5nfSwgZnVuY3Rpb24ocmVzdWx0cywgc3RhdHVzKSB7XG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkdlb2NvZGVyU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0c1swXSk7IFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGV4dF9zdGFydCA9IHJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7IFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5kaWNhY2lvbmVzKCk7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KCdObyByZXN1bHRzIGZvdW5kJyk7XG4gICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbGVydCgnR2VvY29kZXIgZmFpbGVkIGR1ZSB0bzogJyArIHN0YXR1cyk7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9KVxuICAgIH1cbiAgICBmdW5jdGlvbiBvblBsYWNlQ2hhbmdlZChwbGFjZSkge1xuICAgICAgICBcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2UpO1xuICAgICAgICBpZiAocGxhY2VbMF0uZ2VvbWV0cnkpIHtcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IHBsYWNlWzBdLmdlb21ldHJ5LmxvY2F0aW9uO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24pO1xuICAgICAgICAgICAgbWFwLnBhblRvKGxvY2F0aW9uKTtcbiAgICAgICAgICAgIG1hcC5zZXRab29tKDE1KTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZU1hcmtlcihwbGFjZSk7XG4gICAgICAgICAgICBzZWFyY2gobG9jYXRpb24pO1xuICAgICAgICB9ICBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRvY29tcGxldGVfc2VhcmNoJykucGxhY2Vob2xkZXIgPSAnRW50ZXIgYSBjaXR5JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNlYXJjaCBmb3IgaG90ZWxzIGluIHRoZSBzZWxlY3RlZCBjaXR5LCB3aXRoaW4gdGhlIHZpZXdwb3J0IG9mIHRoZSBtYXAuXG4gICAgZnVuY3Rpb24gc2VhcmNoKGxvY2F0aW9uKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uKTtcbiAgICAgICAgdmFyIHBsYWNlcyA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuUGxhY2VzU2VydmljZShtYXApO1xuICAgICAgICB2YXIgc2VhcmNoID0geyBcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICAgICAgICAgIHJhZGl1czogNTAwLFxuICAgICAgICAgICAgdHlwZXM6IFsnZXN0YWJsaXNobWVudCddXG4gICAgICAgIH07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlKTtcbiAgICAgICAgcGxhY2VzLm5lYXJieVNlYXJjaChzZWFyY2gsIGZ1bmN0aW9uKHJlc3VsdHMsIHN0YXR1cykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0cyk7XG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5wbGFjZXMuUGxhY2VzU2VydmljZVN0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgIGNsZWFyUmVzdWx0cygpO1xuICAgICAgICAgICAgICAgIGNsZWFyTWFya2VycygpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVNYXJrZXIocmVzdWx0c1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgKHN0YXR1cyA9PT0gZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2VTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBtYXJrZXIgZm9yIGVhY2ggaG90ZWwgZm91bmQsIGFuZFxuICAgICAgICAgICAgICAgIC8vIGFzc2lnbiBhIGxldHRlciBvZiB0aGUgYWxwaGFiZXRpYyB0byBlYWNoIG1hcmtlciBpY29uLlxuICAgICAgICAgICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gdmFyIG1hcmtlckxldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoJ0EnLmNoYXJDb2RlQXQoMCkgKyAoaSAlIDI2KSk7XG4gICAgICAgICAgICAgICAgLy8gdmFyIG1hcmtlckljb24gPSBNQVJLRVJfUEFUSCArIG1hcmtlckxldHRlciArICcucG5nJztcbiAgICAgICAgICAgICAgICAvLyBVc2UgbWFya2VyIGFuaW1hdGlvbiB0byBkcm9wIHRoZSBpY29ucyBpbmNyZW1lbnRhbGx5IG9uIHRoZSBtYXAuXG4gICAgICAgICAgICAgICAgLy8gbWFya2Vyc1tpXSA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjogcmVzdWx0c1tpXS5nZW9tZXRyeS5sb2NhdGlvbixcbiAgICAgICAgICAgICAgICAvLyAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICAgICAgICAgICAgICAvLyAgICAgaWNvbjogbWFya2VySWNvblxuICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyIGNsaWNrcyBhIGhvdGVsIG1hcmtlciwgc2hvdyB0aGUgZGV0YWlscyBvZiB0aGF0IGhvdGVsXG4gICAgICAgICAgICAgICAgLy8gaW4gYW4gaW5mbyB3aW5kb3cuXG4gICAgICAgICAgICAgICAgLy8gbWFya2Vyc1tpXS5wbGFjZVJlc3VsdCA9IHJlc3VsdHNbaV07XG4gICAgICAgICAgICAgICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2Vyc1tpXSwgJ2NsaWNrJywgc2hvd0luZm9XaW5kb3cpO1xuICAgICAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoZHJvcE1hcmtlcihpKSwgaSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgLy8gYWRkUmVzdWx0KHJlc3VsdHNbaV0sIGkpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFkZFJlc3VsdChyZXN1bHQsIGkpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0cycpO1xuICAgICAgICB2YXIgbWFya2VyTGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZSgnQScuY2hhckNvZGVBdCgwKSArIChpICUgMjYpKTtcbiAgICAgICAgdmFyIG1hcmtlckljb24gPSBNQVJLRVJfUEFUSCArIG1hcmtlckxldHRlciArICcucG5nJztcblxuICAgICAgICB2YXIgdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgICAgICB0ci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAoaSAlIDIgPT09IDAgPyAnI0YwRjBGMCcgOiAnI0ZGRkZGRicpO1xuICAgICAgICB0ci5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXJrZXJzW2ldLCAnY2xpY2snKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBpY29uVGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgdmFyIG5hbWVUZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICB2YXIgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgaWNvbi5zcmMgPSBtYXJrZXJJY29uO1xuICAgICAgaWNvbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3BsYWNlSWNvbicpO1xuICAgICAgaWNvbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzTmFtZScsICdwbGFjZUljb24nKTtcbiAgICAgIHZhciBuYW1lID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocmVzdWx0Lm5hbWUpO1xuICAgICAgaWNvblRkLmFwcGVuZENoaWxkKGljb24pO1xuICAgICAgbmFtZVRkLmFwcGVuZENoaWxkKG5hbWUpO1xuICAgICAgdHIuYXBwZW5kQ2hpbGQoaWNvblRkKTtcbiAgICAgIHRyLmFwcGVuZENoaWxkKG5hbWVUZCk7XG4gICAgICAvLyByZXN1bHRzLmFwcGVuZENoaWxkKHRyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZHJvcE1hcmtlcihpKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG1hcmtlcnNbaV0uc2V0TWFwKG1hcCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsZWFyTWFya2VycygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobWFya2Vyc1tpXSkge1xuICAgICAgICAgICAgICAgIG1hcmtlcnNbaV0uc2V0TWFwKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG1hcmtlcnMgPSBbXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYXJSZXN1bHRzKCkge1xuICAgICAgICB2YXIgcmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyk7XG4gICAgICAgIHdoaWxlIChyZXN1bHRzLmNoaWxkTm9kZXNbMF0pIHtcbiAgICAgICAgICAgIHJlc3VsdHMucmVtb3ZlQ2hpbGQocmVzdWx0cy5jaGlsZE5vZGVzWzBdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzaG93SW5mb1dpbmRvdygpIHtcbiAgICAgICAgdmFyIG1hcmtlciA9IHRoaXM7XG4gICAgICAgIHBsYWNlcy5nZXREZXRhaWxzKHtwbGFjZUlkOiBtYXJrZXIucGxhY2VSZXN1bHQucGxhY2VfaWR9LFxuICAgICAgICAgICAgZnVuY3Rpb24ocGxhY2UsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgIT09IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobWFya2VyKTtcbiAgICAgICAgICAgICAgICAvLyBpbmZvV2luZG93LnNldENvbnRlbnQobWFya2VyKTtcbiAgICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuICAgICAgICAgICAgICAgIGJ1aWxkSVdDb250ZW50KHBsYWNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZElXQ29udGVudChwbGFjZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhwbGFjZSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy1pY29uJykuaW5uZXJIVE1MID0gJzxpbWcgY2xhc3M9XCJob3RlbEljb25cIiAnICsgJ3NyYz1cIicgKyBwbGFjZS5pY29uICsgJ1wiLz4nO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctdXJsJykuaW5uZXJIVE1MID0gJzxiPjxhIGhyZWY9XCInICsgcGxhY2UudXJsICsgJ1wiPicgKyBwbGFjZS5uYW1lICsgJzwvYT48L2I+JztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LWFkZHJlc3MnKS50ZXh0Q29udGVudCA9IHBsYWNlLnZpY2luaXR5O1xuXG4gICAgICAgIGlmIChwbGFjZS5mb3JtYXR0ZWRfcGhvbmVfbnVtYmVyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXBob25lLXJvdycpLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcGhvbmUnKS50ZXh0Q29udGVudCA9IHBsYWNlLmZvcm1hdHRlZF9waG9uZV9udW1iZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXBob25lLXJvdycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBc3NpZ24gYSBmaXZlLXN0YXIgcmF0aW5nIHRvIHRoZSBob3RlbCwgdXNpbmcgYSBibGFjayBzdGFyICgnJiMxMDAyOTsnKVxuICAgICAgICAvLyB0byBpbmRpY2F0ZSB0aGUgcmF0aW5nIHRoZSBob3RlbCBoYXMgZWFybmVkLCBhbmQgYSB3aGl0ZSBzdGFyICgnJiMxMDAyNTsnKVxuICAgICAgICAvLyBmb3IgdGhlIHJhdGluZyBwb2ludHMgbm90IGFjaGlldmVkLlxuICAgICAgICBpZiAocGxhY2UucmF0aW5nKSB7XG4gICAgICAgICAgdmFyIHJhdGluZ0h0bWwgPSAnJztcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBsYWNlLnJhdGluZyA8IChpICsgMC41KSkge1xuICAgICAgICAgICAgICByYXRpbmdIdG1sICs9ICcmIzEwMDI1Oyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByYXRpbmdIdG1sICs9ICcmIzEwMDI5Oyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXJhdGluZy1yb3cnKS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXJhdGluZycpLmlubmVySFRNTCA9IHJhdGluZ0h0bWw7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy1yYXRpbmctcm93Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSByZWdleHAgaXNvbGF0ZXMgdGhlIGZpcnN0IHBhcnQgb2YgdGhlIFVSTCAoZG9tYWluIHBsdXMgc3ViZG9tYWluKVxuICAgICAgICAvLyB0byBnaXZlIGEgc2hvcnQgVVJMIGZvciBkaXNwbGF5aW5nIGluIHRoZSBpbmZvIHdpbmRvdy5cbiAgICAgICAgaWYgKHBsYWNlLndlYnNpdGUpIHtcbiAgICAgICAgICB2YXIgZnVsbFVybCA9IHBsYWNlLndlYnNpdGU7XG4gICAgICAgICAgdmFyIHdlYnNpdGUgPSBob3N0bmFtZVJlZ2V4cC5leGVjKHBsYWNlLndlYnNpdGUpO1xuICAgICAgICAgIGlmICh3ZWJzaXRlID09PSBudWxsKSB7XG4gICAgICAgICAgICB3ZWJzaXRlID0gJ2h0dHA6Ly8nICsgcGxhY2Uud2Vic2l0ZSArICcvJztcbiAgICAgICAgICAgIGZ1bGxVcmwgPSB3ZWJzaXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctd2Vic2l0ZS1yb3cnKS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXdlYnNpdGUnKS50ZXh0Q29udGVudCA9IHdlYnNpdGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXdlYnNpdGUtcm93Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgICRzY29wZS5pbml0TWFwID0gZnVuY3Rpb24oKSB7IFxuICAgICAgICAvLyAkc2NvcGUuJHdhdGNoKCdzZWFyY2hfZW50aWRhZCcsIGZ1bmN0aW9uKG4peyBcbiAgICAgICAgICAgIGlmKCRzY29wZS5zZWFyY2hfZW50aWRhZCAhPSB1bmRlZmluZWQgJiYgJHNjb3BlLnNlYXJjaF9lbnRpZGFkICE9ICcnKXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZCgkc2NvcGUuc2VhcmNoX2VudGlkYWQsNSwxKTtcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkKCcnLCcwJywxKTsgXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLm1hcGEgPSAnZnVsbCc7IFxuICAgICAgICAgICAgfVxuICAgICAgICAvLyB9KTsgICAgICAgICAgIFxuICAgIH1cbiAgICAkc2NvcGUuSW5jaWFsaXphY2lvbigpO1xuICAgIC8vICRzY29wZS5pbml0TWFwKCk7XG5cbiAgICAkc2NvcGUucmVzaXplID0gZnVuY3Rpb24obWFwKXtcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKG1hcCwgJ2JvdW5kc19jaGFuZ2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICAgICB2YXIgYm91bmRzID0gbWFwLmdldEJvdW5kcygpO1xuICAgICAgICB9KTtcbiAgICB9OyBcblxuICAgICRzY29wZS5nZXRLaWxvbWV0cm9zID0gZnVuY3Rpb24obGF0MSxsb24xLGxhdDIsbG9uMil7XG4gICAgICAgIGZ1bmN0aW9uIHJhZCh4KSB7XG4gICAgICAgICAgICByZXR1cm4geCAqIE1hdGguUEkvMTgwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBSID0gNjM3OC4xMzc7IC8vUmFkaW8gZGUgbGEgdGllcnJhIGVuIGttXG4gICAgICAgIHZhciBkTGF0ID0gcmFkKCBsYXQyIC0gbGF0MSApO1xuICAgICAgICB2YXIgZExvbmcgPSByYWQoIGxvbjIgLSBsb24xICk7XG4gICAgICAgIHZhciBhID0gTWF0aC5zaW4oZExhdC8yKSAqIE1hdGguc2luKGRMYXQvMikgKyBNYXRoLmNvcyhyYWQobGF0MSkpICogTWF0aC5jb3MocmFkKGxhdDIpKSAqIE1hdGguc2luKGRMb25nLzIpICogTWF0aC5zaW4oZExvbmcvMik7XG4gICAgICAgIHZhciBjID0gMiAqIE1hdGguYXRhbjIoTWF0aC5zcXJ0KGEpLCBNYXRoLnNxcnQoMS1hKSk7XG4gICAgICAgIHZhciBkID0gUiAqIGM7XG4gICAgICAgIHZhciByZXN1bHQgPSBkLnRvRml4ZWQoMyk7IFxuICAgICAgICByZXR1cm4gcmVzdWx0OyAvL1JldG9ybmEgdHJlcyBkZWNpbWFsZXNcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0TWluRnJvbUFycmF5IChhcnJheV9vZl92YWx1ZXMpIHtcbiAgICAgICAgdmFyIG1pbiA9IE1hdGgubWluLmFwcGx5KG51bGwsIGFycmF5X29mX3ZhbHVlcyk7XG4gICAgICAgIHJldHVybiBtaW47ICAgXG4gICAgfTtcblxuICAgIC8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyAgICAgYWxlcnQoXCJjbGlja2VkIG1hcmtlclwiKTtcbiAgICAvLyB9KTtcblxuICAgIFxuICAgIC8vICRzY29wZS5sb2NhdGlvbiA9IGZ1bmN0aW9uKCl7ICBcbiAgICAgICAgLy8gICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgICAgLy8gICAgICAgICAvLyBJTklUIFJFU0laRSBcbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLmRpc2FibGVfYnV0dG9uID0gdHJ1ZTsgXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLmRhdGEgPSBbXTtcblxuICAgICAgICAvLyAgICAgICAgICRzY29wZS5pbml0TWFwKCk7IFxuICAgICAgICAvLyAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXAsICdyZXNpemUnKTtcbiAgICAgICAgLy8gICAgICAgICB9LDUwMCk7XG4gICAgICAgIC8vICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbikgeyAgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgJHNjb3BlLmNyZWF0ZU1hcmtlcihtYXApO1xuICAgICAgICAvLyAgICAgICAgICAgICAkc2NvcGUucG9zaWNpb25fYWN0dWFsID0ge1xuICAgICAgICAvLyAgICAgICAgICAgICAgIGxhdDogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAvLyAgICAgICAgICAgICAgIGxuZzogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZVxuICAgICAgICAvLyAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAgICAgICAgIHZhciBnZW9jb2RpbmcgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9JyArICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubGF0ICsgJywnICsgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sbmcgKyAnJnNlbnNvcj1mYWxzZSc7XG4gICAgICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKGdlb2NvZGluZyk7XG5cbiAgICAgICAgLy8gICAgICAgICAgICAgdmFyIGltYWdlID0ge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgdXJsOiAnL2Fzc2V0cy9hcHAvaW1hZ2VzL3Bvc2l0aW9uX2FjdHVhbC5wbmcnLCBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDUwLCA1MCksIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgNDApXG4gICAgICAgIC8vICAgICAgICAgICAgIH07IFxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgaWNvbjogaW1hZ2VcbiAgICAgICAgLy8gICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gICAgICAgICAgICAgdmFyIGNpcmNsZSA9IG5ldyBnb29nbGUubWFwcy5DaXJjbGUoe1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgY2VudGVyOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcmFkaXVzOiAxMDAwLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6ICcjMzk1MjdiJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgc3Ryb2tlQ29sb3I6ICcjMzk1MjdiJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHN0cm9rZU9wYWNpdHk6IDAuMlxuICAgICAgICAvLyAgICAgICAgICAgICB9KTsgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuc2VhcmNoX2VudGlkYWQgPSBsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICAgICAgICAgIGZvciAodmFyIGkgPSAkc2NvcGUuZGF0YV9sb2FkLmxlbmd0aDsgaS0tOyl7IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgaWYocGFyc2VGbG9hdCggJHNjb3BlLmdldEtpbG9tZXRyb3MoICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubGF0LCAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxuZywgJHNjb3BlLmRhdGFfbG9hZFtpXS5sYXQsICRzY29wZS5kYXRhX2xvYWRbaV0ubG5nKSkgPD0gMSl7ICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFfcmVhbC5wdXNoKCRzY29wZS5kYXRhX2xvYWRbaV0pO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX3JlYWwpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIG1pbiA9IE1hdGgubWluLmFwcGx5KG51bGwsIGFycmF5KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpICsnIGVsIG1pbmltbyBlczogJysgbWluKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRbaV0pO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGkgPT0gMCl7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRbaV0pO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBzdGFydCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgZW5kID0gJHNjb3BlLmRhdGFfbG9hZFszXS5kaXJlY2Npb247XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpZighc3RhcnQgfHwgIWVuZCl7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgYWxlcnQoXCJTdGFydCBhbmQgRW5kIGFkZHJlc3NlcyBhcmUgcmVxdWlyZWRcIik7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIG9yaWdpbjogc3RhcnQsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBlbmQsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNUcmF2ZWxNb2RlWydXQUxLSU5HJ10sXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHVuaXRTeXN0ZW06IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNVbml0U3lzdGVtWydNRVRSSUMnXSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgcHJvdmlkZVJvdXRlQWx0ZXJuYXRpdmVzOiBmYWxzZVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfTtcblxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cykge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRNYXAobWFwKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0UGFuZWwoJChcIiNkaXJlY3Rpb25zX3BhbmVsXCIpLmdldCgwKSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLHN0YXR1cyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGFsZXJ0KFwiVGhlcmUgaXMgbm8gZGlyZWN0aW9ucyBhdmFpbGFibGUgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXCIpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9KVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH0gXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBlbHNleyBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGVsKCRzY29wZS5kYXRhX2xvYWQuaW5kZXhPZigkc2NvcGUuZGF0YV9sb2FkW2ldKSk7IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyW2ldLnNldE1hcChudWxsKTsgIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgLy8gICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgbWFwLnNldFpvb20oMTgpO1xuICAgICAgICAvLyAgICAgICAgICAgICBtYXAucGFuVG8obWFya2VyLnBvc2l0aW9uKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgbWFwLmZpdEJvdW5kcyhjaXJjbGUuZ2V0Qm91bmRzKCkpO1xuICAgICAgICAvLyAgICAgICAgIH0sIGZ1bmN0aW9uKCkgeyAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcih0cnVlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuICAgICAgICAvLyAgICAgICAgIH0pOyBcbiAgICAgICAgLy8gICAgIH0gZWxzZSB7IFxuICAgICAgICAvLyAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKGZhbHNlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgICBcbiAgICAvLyB9XG4gICAgdmFyIGFsbF9tZSA9IFtdO1xuICAgICRzY29wZS5sb2NhdGlvbiA9IGZ1bmN0aW9uKCl7IFxuICAgICAgICAgXG4gICAgICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHsgXG4gICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7ICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUucG9zaWNpb25fYWN0dWFsID0ge1xuICAgICAgICAgICAgICAgICAgbGF0OiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgICAgICAgICAgICBsbmc6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUucG9zaWNpb25fYWN0dWFsKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbF9tZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWxsX21lW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGxfbWVbaV0uc2V0TWFwKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFsbF9tZSA9IFtdOyBcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW5wdXRfc3RhcnQgPSAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxhdCtcIixcIiskc2NvcGUucG9zaWNpb25fYWN0dWFsLmxuZztcblxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2Fzc2V0cy9hcHAvaW1hZ2VzL3Bvc2l0aW9uX2FjdHVhbC5wbmcnLCBcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApXG5cbiAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgdmFyIG1lID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogaW1hZ2VcbiAgICAgICAgICAgICAgICB9KTsgICAgXG4gICAgICAgICAgICAgICAgYWxsX21lLnB1c2gobWUpOyBcblxuICAgICAgICAgICAgICAgIHZhciBnZW9jb2RpbmcgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9JyArICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubGF0ICsgJywnICsgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sbmcgKyAnJnNlbnNvcj1mYWxzZSc7IFxuICAgICAgICAgICAgICAgICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHsgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50ZXh0X3N0YXJ0ID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzczsgIFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgICAgIH0pOyAgXG4gICAgICAgICAgICAgICAgbWFwLnNldFpvb20oMTYpO1xuICAgICAgICAgICAgICAgIG1hcC5wYW5UbyhtZS5wb3NpdGlvbik7IFxuICAgICAgICAgICAgICAgICRzY29wZS5pbmRpY2FjaW9uZXMoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZF9hbGxCb21iZXJvcygpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUuY2FyZ2FyX21hcmNhZG9yZXMoKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkgeyAgIFxuICAgICAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKHRydWUsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG4gICAgICAgICAgICB9KTsgXG4gICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IoZmFsc2UsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG5cbiAgICAgICAgfVxuICAgICAgICAgXG4gICAgfVxuICAgIC8qIHBlcm1pdGUgbW9zdHJhIHkgb2N1bHRhciBsb3MgbWFyY2Fkb3JlcyB5IGFjdHVhbGl6YXIgZWwgbGlzdGFkbyAqL1xuICAgICRzY29wZS5pY29uX3RydWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuaWNvbl8xID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmljb25fMiA9IHRydWU7XG4gICAgICAgICRzY29wZS5pY29uXzMgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaWNvbl80ID0gdHJ1ZTtcbiAgICB9XG4gICAgJHNjb3BlLmljb25fdHJ1ZSgpO1xuXG4gICAgJHNjb3BlLnRvZ2dsZV9NYXJrZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICAgICRzY29wZS5pY29uX3RydWUoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobWFya2Vyc1tpXSkge1xuICAgICAgICAgICAgICAgIG1hcmtlcnNbaV0uc2V0TWFwKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG1hcmtlcnMgPSBbXTtcbiAgICAgICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dG9jb21wbGV0ZV9zZWFyY2gnKTtcbiAgICAgICAgaWYgKGlkID09PSAxKSB7XG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IFwiYmFuY29zXCI7ICBcbiAgICAgICAgICAgICRzY29wZS5pY29uXzEgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5pY29uMSA9IFwiL2Fzc2V0cy9hcHAvaW1hZ2VzL2JhbmNvLWNvbG9yLnN2Z1wiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoaWQgPT09IDIpeyBcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gXCJjb21pc2FyaWFzXCI7IFxuICAgICAgICAgICAgJHNjb3BlLmljb25fMiA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmljb24xID0gXCIvYXNzZXRzL2FwcC9pbWFnZXMvY29taXNhcmlhLWNvbG9yLnN2Z1wiOyBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGlkID09PSAzKXsgXG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IFwiaG9zcGl0YWxlc1wiOyBcbiAgICAgICAgICAgICRzY29wZS5pY29uXzMgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5pY29uMSA9IFwiL2Fzc2V0cy9hcHAvaW1hZ2VzL2hvc3BpdGFsLWNvbG9yLnN2Z1wiOyBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGlkID09PSA0KXtcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gXCJib21iZXJvc1wiO1xuICAgICAgICAgICAgJHNjb3BlLmljb25fNCA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmljb24xID0gXCIvYXNzZXRzL2FwcC9pbWFnZXMvYm9tYmVyb3MtY29sb3Iuc3ZnXCI7ICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImVudHJlXCIpOyBcbiAgICAgICAgICAgIC8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2JvdW5kc19jaGFuZ2VkJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgJHNjb3BlLmxvYWRfYWxsQm9tYmVyb3MoKTtcbiAgICAgICAgICAgIC8vIH0pOyAgXG4gICAgICAgICAgICAvLyAkc2NvcGUubGltaXRfY2hhbmdlZCg0KTsgXG4gICAgICAgIH1cbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihpbnB1dCwgJ2ZvY3VzJylcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihpbnB1dCwgJ2tleWRvd24nLCB7XG4gICAgICAgICAgICBrZXlDb2RlOiAxM1xuICAgICAgICB9KTsgICAgXG4gICAgfVxuICAgIC8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2JvdW5kc19jaGFuZ2VkJywkc2NvcGUudG9nZ2xlX01hcmtlcihpZCkpO1xuICAgIC8vICRzY29wZS50b2dnbGVfTWFya2VyID0gZnVuY3Rpb24oaWQpeyBcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJJbmdyZXNvIGVsIElEOiBcIitpZCk7XG4gICAgLy8gICAgICRzY29wZS5pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTs7XG4gICAgLy8gICAgICRzY29wZS5pZC5jaGVja2VkID0gISRzY29wZS5pZC5jaGVja2VkOyBcbiAgICAvLyAgICAgaWYoJCgnIycraWQpLmlzKCc6Y2hlY2tlZCcpKXtcbiAgICAvLyAgICAgICAgIGZvcih2YXIgaSA9ICRzY29wZS5kYXRhX3JlYWwubGVuZ3RoOyBpLS07KXsgXG4gICAgLy8gICAgICAgICAgICAgaWYoJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyA9PT0gaWQpeyAgXG4gICAgLy8gICAgICAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9ICcjJyskc2NvcGUuZGF0YV9yZWFsW2ldLmlkKyctJytpZDtcbiAgICAvLyAgICAgICAgICAgICAgICAgJCh2YXJpYWJsZSkuc2hvdygpO1xuICAgIC8vICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZGVsX3RlbXAoJHNjb3BlLmRhdGFfcmVhbC5pbmRleE9mKCRzY29wZS5kYXRhX3JlYWxbaV0pKTsgICBcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgZWxzZXtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpO1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpOyBcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm5ld19tYXJrZXIubGVuZ3RoOyBpKyspe1xuICAgIC8vICAgICAgICAgICAgIGlmKCRzY29wZS5uZXdfbWFya2VyW2ldLnR5cGUgPT09IGlkKXsgXG4gICAgLy8gICAgICAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyW2ldLnNldFZpc2libGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBlbHNle1xuICAgIC8vICAgICAgICAgZm9yKHZhciBpID0gJHNjb3BlLmRhdGFfcmVhbC5sZW5ndGg7IGktLTspeyBcbiAgICAvLyAgICAgICAgICAgICBpZigkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzID09PSBpZCl7IFxuICAgIC8vICAgICAgICAgICAgICAgICB2YXIgdmFyaWFibGUgPSAnIycrJHNjb3BlLmRhdGFfcmVhbFtpXS5pZCsnLScraWQ7XG4gICAgLy8gICAgICAgICAgICAgICAgICQodmFyaWFibGUpLmhpZGUoKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLmRlbF90ZW1wKCRzY29wZS5kYXRhX3JlYWwuaW5kZXhPZigkc2NvcGUuZGF0YV9yZWFsW2ldKSk7ICAgXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIGVsc2V7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PVwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyk7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PVwiKTsgXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8ICRzY29wZS5uZXdfbWFya2VyLmxlbmd0aDsgaisrKXtcbiAgICAvLyAgICAgICAgICAgICBpZigkc2NvcGUubmV3X21hcmtlcltqXS50eXBlID09PSBpZCl7IFxuICAgIC8vICAgICAgICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlcltqXS5zZXRWaXNpYmxlKGZhbHNlKTsgXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIGVsc2V7XG4gICAgLy8gICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0gbm8gc2UgZWxpbWlubyAtLTogXCIrJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyk7ICAgXG4gICAgLy8gICAgICAgICAgICAgfSBcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgICAvLyAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgIC8vIH1cblxuICAgICRzY29wZS5pbmRpY2FjaW9uZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgaWYoISRzY29wZS5pbnB1dF9zdGFydCB8fCAhJHNjb3BlLmlucHV0X2VuZCl7XG4gICAgICAgICAgICAvLyBhbGVydChcIlN0YXJ0IGFuZCBFbmQgYWRkcmVzc2VzIGFyZSByZXF1aXJlZFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICBvcmlnaW46ICRzY29wZS5pbnB1dF9zdGFydCxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLmlucHV0X2VuZCxcbiAgICAgICAgICAgICAgICB0cmF2ZWxNb2RlOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVHJhdmVsTW9kZVsnRFJJVklORyddLFxuICAgICAgICAgICAgICAgIHVuaXRTeXN0ZW06IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNVbml0U3lzdGVtWydNRVRSSUMnXSxcbiAgICAgICAgICAgICAgICBwcm92aWRlUm91dGVBbHRlcm5hdGl2ZXM6IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cykge1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0aW9uc0Rpc3BsYXkuc2V0UGFuZWwoJChcIiNkaXJlY3Rpb25zX3BhbmVsXCIpLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm9yaWdlbiA9IHJlc3BvbnNlLnJlcXVlc3Qub3JpZ2luO1xuICAgICAgICAgICAgICAgICRzY29wZS5kZXN0aW5vID0gcmVzcG9uc2UucmVxdWVzdC5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW5kaWNhY2lvbl9kZXRhbGxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUud2FybmluZyA9IHJlc3BvbnNlLnJvdXRlc1swXS53YXJuaW5nc1swXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGlzdGFuY2lhID0gcmVzcG9uc2Uucm91dGVzWzBdLmxlZ3NbMF0uZGlzdGFuY2UudGV4dDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZHVyYWNpb24gPSByZXNwb25zZS5yb3V0ZXNbMF0ubGVnc1swXS5kdXJhdGlvbi50ZXh0O1xuICAgICAgICAgICAgICAgICRzY29wZS5ydXRhX2dlbmVyYWwgPSByZXNwb25zZS5yb3V0ZXNbMF0uc3VtbWFyeTtcbiAgICAgICAgICAgICAgICAkc2NvcGUucnV0YV9kZXRhbGxlID0gcmVzcG9uc2Uucm91dGVzWzBdLmxlZ3NbMF0uc3RlcHM7XG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRpdHVsbyA9ICQoJyNkZXRhJykuaHRtbChyZXNwb25zZS5yb3V0ZXNbMF0ubGVnc1swXS5zdGVwc1sxXS5pbnN0cnVjdGlvbnMpO1xuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2Usc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAvLyBhbGVydChcIlRoZXJlIGlzIG5vIGRpcmVjdGlvbnMgYXZhaWxhYmxlIGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7IFxuICAgIH1cblxuICAgICRzY29wZS5nb19wb3NpdGlvbiA9IGZ1bmN0aW9uKCl7IFxuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24pO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgICAgIHZhciBlbmQgPSAkc2NvcGUuZGF0YV9sb2FkWzNdLmRpcmVjY2lvbjtcbiAgICAgICAgICAgIGlmKCFzdGFydCB8fCAhZW5kKXtcbiAgICAgICAgICAgICAgICBhbGVydChcIlN0YXJ0IGFuZCBFbmQgYWRkcmVzc2VzIGFyZSByZXF1aXJlZFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBzdGFydCxcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb246IGVuZCxcbiAgICAgICAgICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1RyYXZlbE1vZGVbJ1dBTEtJTkcnXSxcbiAgICAgICAgICAgICAgICAgICAgdW5pdFN5c3RlbTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1VuaXRTeXN0ZW1bJ01FVFJJQyddLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlUm91dGVBbHRlcm5hdGl2ZXM6IGZhbHNlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRNYXAobWFwKTtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0UGFuZWwoJChcIiNkaXJlY3Rpb25zX3BhbmVsXCIpLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlLHN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlcmUgaXMgbm8gZGlyZWN0aW9ucyBhdmFpbGFibGUgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSBcbiAgICB9XG5cbiAgICAvLyBFbGltaW5hIDEgeCAxIGNhZGEgZGF0byBxdWUgbm8gZXN0YSBlbiBlbCByYW5nb1xuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbihpbmRleCl7ICBcbiAgICAgICAgJHNjb3BlLmRhdGFfbG9hZC5zcGxpY2UoaW5kZXgsMSk7ICBcbiAgICB9O1xuICAgICRzY29wZS5kZWxfdGVtcCA9IGZ1bmN0aW9uKGluZGV4KXsgIFxuICAgICAgICAkc2NvcGUuZGF0YV9yZWFsLnNwbGljZShpbmRleCwxKTsgIFxuICAgIH07XG4gICAgLy8gSGFjZSB1biByZWNvcnJpZG8gYWwgYXJyYXkgZGUgbWFyY2Fkb3Jlc1xuICAgICRzY29wZS5zZXRNYXBPbkFsbCA9IGZ1bmN0aW9uKG1hcCkge1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm5ld19tYXJrZXIubGVuZ3RoOyBpKyspIHsgXG4gICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlcltpXS5zZXRNYXAobWFwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBsaW1waWEgdG9kb3MgbG9zIG1hcmNhZG9yZXMgYSBudWxsXG4gICAgJHNjb3BlLmNsZWFyTWFya2VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuc2V0TWFwT25BbGwobnVsbCk7XG4gICAgfVxuICAgIC8vIGZ1bmNpb24gbGxhbWEgYSBsaW1waWFyIHRvZG9zIGxvcyBtYXJjYWRvcmVzXG4gICAgJHNjb3BlLmRlbGV0ZU1hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmNsZWFyTWFya2VycygpO1xuICAgICAgICAkc2NvcGUubmV3X21hcmtlciA9IFtdO1xuICAgIH0gXG5cbiAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcj0gZnVuY3Rpb24oYnJvd3Nlckhhc0dlb2xvY2F0aW9uLCBpbmZvV2luZG93LCBwb3MpIHtcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpO1xuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoYnJvd3Nlckhhc0dlb2xvY2F0aW9uID9cbiAgICAgICAgICAgICdFcnJvcjogRWwgc2VydmljaW8gZGUgR2VvbG9jYWxpemFjaW9uIEZhbGzDsy4nIDpcbiAgICAgICAgICAgICdFcnJvcjogWW91ciBicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IGdlb2xvY2F0aW9uLicpO1xuICAgIH0gXG5cbiAgICBcbiAgICBcbiAgICAkc2NvcGUuY3JlYXRlTWFya2VyID0gZnVuY3Rpb24obWFwKSB7ICBcbiAgICAgICAgaWYoJHNjb3BlLmRhdGFfbG9hZCAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZGF0YV9sb2FkLmxlbmd0aDsgaSsrKSB7ICBcbiAgICAgICAgICAgICAgICB2YXIgZGF0YV90ZW1wID0gJHNjb3BlLmRhdGFfbG9hZFtpXTsgXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IHtcbiAgICAgICAgICAgICAgICAgIGxhdDogcGFyc2VGbG9hdChkYXRhX3RlbXAubGF0KSxcbiAgICAgICAgICAgICAgICAgIGxuZzogcGFyc2VGbG9hdChkYXRhX3RlbXAubG5nKVxuICAgICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgIGlmKGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyA9PT0gMSl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2JhbmNvLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZGF0YV90ZW1wLmlkX3NlcnZpY2VzID09PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvY29taXNhcmlhLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZGF0YV90ZW1wLmlkX3NlcnZpY2VzID09PSAzKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvaG9zcGl0YWwtY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihkYXRhX3RlbXAuaWRfc2VydmljZXMgPT09IDQpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9ib21iZXJvcy1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJPY3VycmlvIHVuIGVycm9yIGluZXNwZXJhZG8gZW4gbG9zIElEIFwiK2RhdGFfdGVtcC5pZF9zZXJ2aWNlcytcIiBkZSBFbnRpZGFkZXNcIik7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLCBcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogaW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyxcbiAgICAgICAgICAgICAgICAgICAgZm90bzogZGF0YV90ZW1wLmZvdG8sXG4gICAgICAgICAgICAgICAgICAgIG5vbWJyZV9lbXByZXNhOiBkYXRhX3RlbXAubm9tYnJlX2VtcHJlc2EsXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjY2lvbjogZGF0YV90ZW1wLmRpcmVjY2lvblxuXG4gICAgICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyLnB1c2gobWFya2VyKTsgXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLm1hcmtlcnNfaG92ZXIobWFya2VyKTsgIFxuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wZW5JbmZvV2luZG93KHRoaXMpOyBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgYWxlcnQoJ09jdXJyaW8gdW4gZXJyb3IgYWwgY2FyZ2FyJyk7XG5cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUubmV3X21hcmtlcik7XG4gICAgICAgIC8vY2llcnJhIGVsIGluZm93aW5kb3cgdW5hIHZleiBjYW1iaWVcbiAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgIH0gXG5cbiAgICBmdW5jdGlvbiB0b2dnbGVCb3VuY2UoKSB7IFxuICAgICAgICAvLyBtYXJrZXIuc2V0QW5pbWF0aW9uKGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5CT1VOQ0UpOyBcbiAgICB9XG4gICAgXG4gICAgXG4gICAgJHNjb3BlLm1hcmtlcnNfaG92ZXIgPSBmdW5jdGlvbihkYXRhKXsgXG4gICAgICAgICRzY29wZS5yZXR1cm5fbGlzdCA9IHRydWU7XG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWlsX21hcmtlcigpO1xuICAgICAgICAkc2NvcGUuZGV0YWxsZSA9IGRhdGE7IFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTsgXG4gICAgICAgIHZhciBwb3MgPSB7fTtcbiAgICAgICAgcG9zLmxhdCA9IGRhdGEucG9zaXRpb24ubGF0KCk7XG4gICAgICAgIHBvcy5sbmcgPSBkYXRhLnBvc2l0aW9uLmxuZygpO1xuICAgICAgICAvLyBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe21hcDogbWFwLG1heFdpZHRoOiAyMDB9KTtcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpOyBcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2VudGVyIGdsb2JvX3ViaWNhY2lvblwiPicsIFxuICAgICAgICAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrZGF0YS5mb3RvKydcIj4nLFxuICAgICAgICAgICAgICAgICc8aDY+JytkYXRhLnRpdGxlKyc8L2g2PicsIFxuICAgICAgICAgICAgICAgICc8cD4nK2RhdGEuZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIF0uam9pbignJylcbiAgICAgICAgKTsgXG4gICAgICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTsgXG4gICAgICAgIG1hcC5zZXRab29tKDE4KTtcbiAgICAgICAgbWFwLnBhblRvKHBvcyk7XG4gICAgICAgICQoJyN1YmljYWNpb25lcycpLmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiAnMHB4J1xuICAgICAgICB9LCAwKTsgXG4gICAgICAgICQoJyN1YmljYWNpb25lcycpLmNzcygnaGVpZ2h0JywnMTAwJScpO1xuXG4gICAgfSBcblxuICAgIFxuICAgICRzY29wZS5vcGVuSW5mb1dpbmRvdyA9IGZ1bmN0aW9uKG1hcmtlcil7XG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTsgXG4gICAgICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXAsbWF4V2lkdGg6IDIwMH0pO1xuICAgICAgICB2YXIgcG9zID0gbWFya2VyLnBvc2l0aW9uOyBcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpOyBcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2VudGVyIGdsb2JvX3ViaWNhY2lvblwiPicsIFxuICAgICAgICAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrbWFya2VyLmZvdG8rJ1wiPicsXG4gICAgICAgICAgICAgICAgJzxoNj4nK21hcmtlci5ub21icmVfZW1wcmVzYSsnPC9oNj4nLCBcbiAgICAgICAgICAgICAgICAnPHA+JyttYXJrZXIuZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIF0uam9pbignJylcbiAgICAgICAgKTsgXG4gICAgICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGl3T3V0ZXIgPSAkKCcuZ20tc3R5bGUtaXcnKTtcbiAgICAgICAgdmFyIGl3Q2xvc2VCdG4gPSBpd091dGVyLm5leHQoKTtcbiAgICAgICAgdmFyIGl3QmFja2dyb3VuZCA9IGl3T3V0ZXIucHJldigpOyBcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTsgXG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCg0KScpLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSk7XG4gICAgICAgIC8vIGl3T3V0ZXIucGFyZW50KCkucGFyZW50KCkuY3NzKHtsZWZ0OiAnMTBweCd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdsZWZ0OiA2MHB4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDYwcHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmZpbmQoJ2RpdicpLmNoaWxkcmVuKCkuY3NzKHsnYm94LXNoYWRvdyc6ICdyZ2JhKDAsIDAsIDAsIDApIDBweCAxcHggNnB4JywgJ3otaW5kZXgnIDogJzEnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDIxcHggIWltcG9ydGFudDsnKyd3aWR0aDogMTBweCAhaW1wb3J0YW50OycrJ2xlZnQ6IC0xNXB4ICFpbXBvcnRhbnQnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDI1cHggIWltcG9ydGFudDsnKyd3aWR0aDogOXB4ICFpbXBvcnRhbnQ7JysnbGVmdDogLTE1cHggIWltcG9ydGFudCd9KTtcbiAgICAgICAgaXdDbG9zZUJ0bi5jc3MoeydkaXNwbGF5JzogJ25vbmUnfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaG93X21hcmtlciA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCA9IHRydWU7XG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsID0gZmFsc2U7XG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBtYXJrZXJbaV0uc2V0TWFwKG51bGwpO1xuICAgICAgICAvLyB9ICBcbiAgICAgICAgXG4gICAgICAgIHZhciBwb3MgPSB7fTtcbiAgICAgICAgcG9zLmxhdCA9IHBhcnNlRmxvYXQoZGF0YS5sYXQpO1xuICAgICAgICBwb3MubG5nID0gcGFyc2VGbG9hdChkYXRhLmxuZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHBvcyk7IFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmRldGFsbGUgPSBkYXRhO1xuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IGZhbHNlO1xuICAgICAgICAvKiBoYWNlIHpvb20geSByZW5kZXJpemEgbGEgcG9zaWNpb24gKi8gXG4gICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsIFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSwgXG4gICAgICAgICAgICB0eXBlOiBkYXRhLmlkX3NlcnZpY2VzLFxuICAgICAgICAgICAgZm90bzogZGF0YS5mb3RvLFxuICAgICAgICAgICAgbm9tYnJlX2VtcHJlc2E6IGRhdGEubm9tYnJlX2VtcHJlc2EsXG4gICAgICAgICAgICBkaXJlY2Npb246IGRhdGEuZGlyZWNjaW9uIFxuICAgICAgICB9KTsgIFxuICAgICAgICBcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXAsICdyZXNpemUnKTtcbiAgICAgICAgfSw4MDApO1xuICAgICAgICBtYXAuc2V0Wm9vbSgxNyk7XG4gICAgICAgIG1hcC5wYW5Ubyhwb3MpOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNlYXJjaF9nbG9iYWwgPSBmdW5jdGlvbihzZWFyY2gpe1xuICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCA9IHRydWU7XG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTsgXG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5sb2FkKHNlYXJjaCwxMCwxKTtcbiAgICAgICAgJHNjb3BlLmNyZWF0ZU1hcmtlcihtYXApO1xuXG4gICAgfVxuICAgICRzY29wZS5yZXR1cm4gPSBmdW5jdGlvbigpeyAgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsICAgPSB0cnVlOyAgXG4gICAgICAgICRzY29wZS5yZXR1cm5fbGlzdCA9IGZhbHNlOyBcbiAgICAgICAgJCgnI3ViaWNhY2lvbmVzJykuY3NzKCdoZWlnaHQnLCc2MDVweCcpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY29tb19sbGVnYXIgPSBmdW5jdGlvbihsYXQsIGxuZyl7IFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmluZGljYWNpb25fZGV0YWxsZSAgID0gdHJ1ZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaGlkZV9zZWFyY2ggICAgICAgICAgPSB0cnVlOyBcbiAgICAgICAgJHNjb3BlLmhlYWRlcl9zZWFyY2ggICAgICAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5yZXR1cm5fbGlzdCAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuYm90b25fc2VhcmNoX2dsb2JhbCAgPSBmYWxzZTsgIFxuICAgICAgICAvLyBtb3N0cmFyIGVsIGhlYWRlciBkZSBpbmRpY2Fkb3JcbiAgICAgICAgJHNjb3BlLmlucHV0X2VuZCA9IGxhdCtcIixcIitsbmc7IFxuICAgICAgICAkc2NvcGUuaW5kaWNhY2lvbmVzKCk7XG4gICAgICAgIHZhciBnZW9jb2RpbmcgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9JyArICRzY29wZS5pbnB1dF9lbmQgKyAnJnNlbnNvcj1mYWxzZSc7IFxuICAgICAgICAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcbiAgICAgICAgICAgICRzY29wZS50ZXh0X2VuZCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuXG4gICAgICAgIH0pOyBcblxuICAgIH1cblxuICAgICRzY29wZS5zaG93X2RldGFsbGVfaW5kaWNhY2lvbmVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmRldGFsbGVfZGlzdGFuY2lhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2hvd19saXN0X21hcmtlciA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7ICBcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlOyBcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlOyAgIFxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICB9LDUwMCk7XG4gICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgfVxuICAgICRzY29wZS5zaG93X2RldGFpbF9tYXJrZXIgPSBmdW5jdGlvbigpe1xuICAgICAgICAkKCcudWJpY2FjaW9uZXMnKS5jc3MoJ3BhZGRpbmctdG9wJywnMHB4Jyk7XG4gICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyAgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSB0cnVlOyBcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSBmYWxzZTsgIFxuICAgIH1cblxuICAgICRzY29wZS5jbG9zZV9pbmRpY2FjaW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG51bGwpO1xuICAgICAgICAkc2NvcGUubWFwYSAgICAgICAgICAgICAgICAgPSAnZGV0YWxsZSc7XG4gICAgICAgICRzY29wZS5pbnB1dF9lbmQgICAgICAgICAgICA9IFwiXCI7ICAgIFxuICAgICAgICAkc2NvcGUuaGVhZGVyX3NlYXJjaCAgICAgICAgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaGlkZV9zZWFyY2ggICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmluZGljYWNpb25fZGV0YWxsZSAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsICA9IGZhbHNlOyAgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgICAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCAgICAgICAgICAgPSB0cnVlO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICB9LDUwMCk7XG4gICAgfVxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ3pvb21fY2hhbmdlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHpvb20gPSBtYXAuZ2V0Wm9vbSgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh6b29tKTtcbiAgICAgICAgLy8gaWYgKHpvb20gPT0gMjEpIHsgbWFya2VyLnNldEljb24obmV3IGdvb2dsZS5tYXBzLk1hcmtlckltYWdlKCdpbWFnZXMvaW1nLnBuZycsIG51bGwsIG51bGwsIG51bGwsIG5ldyBnb29nbGUubWFwcy5TaXplKDE5MDAsIDE5MDApKSk7IH1cbiAgICB9KTsgXG4gICAgLy8gJHNjb3BlLmxpbWl0X2NoYW5nZWQgPSBmdW5jdGlvbihpZCl7IFxuICAgIFxuICAgIC8vIH1cbiAgICAvLyBFU1RFIENPRElHTyBDUkVBIEhPU1BJVEFMRVNcbiAgICAvLyB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTsgXG4gICAgLy8gJHNjb3BlLmNyZWF0ZV9ob3NwaXRhbGVzID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgU2VydmljZXMubG9hZF9ob3NwaXRhbGVzKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgIC8vICAgICAgICAgJHNjb3BlLnRlbXBfZGF0YSA9IFtdO1xuICAgIC8vICAgICAgICAgJHNjb3BlLnJlc3VsdHMgPSByZXNwb25zZS5kYXRhOyBcbiAgICAvLyAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUucmVzdWx0cywgZnVuY3Rpb24odmFsdWUpe1xuXG4gICAgLy8gICAgICAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7ICdhZGRyZXNzJzogdmFsdWUuZGlyZWNjaW9ufSwgZnVuY3Rpb24gZ2VvY29kZVJlc3VsdChyZXN1bHRzLCBzdGF0dXMpIHsgXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gJ09LJykgeyAgICBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdHNbMF0pO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdmFyIGxhdCA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubGF0O1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdmFyIGxuZyA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobWFya2VyT3B0aW9ucyk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIG5vbWJyZV90ZW1wIDogXCJIT1NQSVRBTCBcIit2YWx1ZS5ub21icmUsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWRfaW1hZ2UgOiB1dWlkLnY0KCksXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbm9tYnJlX2VtcHJlc2EgOiB2YWx1ZS5ub21icmVfZW1wcmVzYSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY2Npb246IHZhbHVlLmRpcmVjY2lvbixcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBob3JhcmlvOiAnJyxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB0ZWxlZm9ub18xOiB2YWx1ZS50ZWxlZm9ub18xLCBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBjb3JyZW86IHZhbHVlLmNvcnJlbywgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBsYXQsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbG5nOiBsbmcsIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3NlcnZpY2VzOiAzLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdmFsdWUubGlua193ZWJcblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRlbXBfZGF0YS5wdXNoKG9iaik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudGVtcF9kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLmd1YXJkYXJfaG9zcGl0YWxlcyhvYmopO1xuICAgIC8vICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gRW4gY2FzbyBkZSBubyBoYWJlciByZXN1bHRhZG9zIG8gcXVlIGhheWEgb2N1cnJpZG8gdW4gZXJyb3JcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGxhbnphbW9zIHVuIG1lbnNhamUgY29uIGVsIGVycm9yXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBhbGVydChcIkdlb2NvZGluZyBubyB0dXZvIMOpeGl0byBkZWJpZG8gYTogXCIgKyBzdGF0dXMpO1xuICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgfSkgXG4gICAgLy8gICAgICAgICAvLyAkc2NvcGUudGVtcC5wdXNoKCRzY29wZS5kYXRhX2xvYWQpOyAgXG4gICAgLy8gICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9XG4gICAgLy8gJHNjb3BlLmd1YXJkYXJfaG9zcGl0YWxlcyA9IGZ1bmN0aW9uIChkYXRhKXsgIFxuICAgIC8vICAgICBTZXJ2aWNlcy5DcmVhdGUoZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAvLyAgICAgICAgIC8vICRzY29wZS5pbml0KCk7XG4gICAgLy8gICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9O1xuICAgIC8vICRzY29wZS5jcmVhdGVfaG9zcGl0YWxlcygpO1xuICAgIFxufV0pOyBcbm1vZGVsLmRpcmVjdGl2ZSgndG9vbHRpcCcsIGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICQoZWxlbWVudCkuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBvbiBtb3VzZWVudGVyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50b29sdGlwKCdzaG93Jyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIG9uIG1vdXNlbGVhdmVcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRvb2x0aXAoJ2hpZGUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuLy8gbW9kZWwuZmlsdGVyKCdzdHJMaW1pdCcsIFsnJGZpbHRlcicsIGZ1bmN0aW9uKCRmaWx0ZXIpIHtcbi8vICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGxpbWl0KSB7XG4vLyAgICAgICBpZiAoISBpbnB1dCkgcmV0dXJuO1xuLy8gICAgICAgaWYgKGlucHV0Lmxlbmd0aCA8PSBsaW1pdCkge1xuLy8gICAgICAgICAgIHJldHVybiBpbnB1dDtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcmV0dXJuICRmaWx0ZXIoJ2xpbWl0VG8nKShpbnB1dCwgbGltaXQpICsgJy4uLic7XG4vLyAgICB9O1xuLy8gfV0pO1xuXG59KSgpO1xuXG4vKiBcbiAgICAxLiBjdWFuZG8gZWwgdXN1YXJpbyBlc2NyaWJhIGxlIG11ZXN0cmUgdW4gbGlzdGFkbyBkZSBlbnRpZGFkZXNcbiAgICAyLiBjdWFuZG8gc2UgdWJpY2Egbm8gaGF5YSBtYXJjYWRvcmVzXG4gICAgMy4gbGltaXRhY2lvbmVzOiB0b2RvcyBsb3MgdXN1YXJpb3MgdGllbmVuIHF1ZSBjb250YXIgY29uIHVuIHNtYXJ0cGhvbmUgcXVlIHRlbmdhIGdwc1xuKi8iLCIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ1NlcnZpY2VzJywgW10pXG4uZmFjdG9yeSgnU2VydmljZXMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHJldHVybiB7IFxuICAgICAgICBMb2FkOiBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnM/bm9tYnJlPScrcSsnJnBlcl9wYWdlPScrcCsnJnBhZ2U9JytwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBMb2FkX1NlcnZpY2VzOiBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9zZXJ2aWNlcz9ub21icmU9JytxKycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIFVwZGF0ZV9pbWc6IGZ1bmN0aW9uKGlkLGRhdGEpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zLycraWQsZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxvYWRfaG9zcGl0YWxlczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9ncnVwb2FpemVuLmNvbS9ob3NwaXRhbGVzLmpzb24nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGFsbEJvbWJlcm9zOiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjLycraWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfbGltYV9jb21hbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIwNDAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfbGltYV9jb21wYTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2lhc0J5SWQvMjA0MDAwJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfY2FsbGFvX2NvbWFuOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DZEJ5SWQvMjA1MDAwJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfY2FsbGFvX2NvbXBhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMDUwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19saW1hX3N1cl9jb21hbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIyNDAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGJvbWJlcm9zX2xpbWFfc3VyX2NvbXBhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMjQwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGJvbWJlcm9zX2xpbWFfbm9ydGVfY29tYW46IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NkQnlJZC8yMjUwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19saW1hX25vcnRlX2NvbXBhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMjUwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9O1xufSk7IFxufSkoKTsiXX0=
