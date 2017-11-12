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
 
    $scope.load_amigos = function(q,p,page){
        if(q == undefined){ 
            q = "";
        }  
        Services.Load_Amigos(q,p,page).then(function (response) {
            $scope.amigos = response.data;
            console.log($scope.amigos);
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
    
    $scope.load_amigos('',10,1);
    
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
        Load: function(q,id_serv,p,page){
            return $http.get(base_url +'/api/v1/locations?nombre='+q+'&id_serv='+id_serv+'&per_page='+p+'&page='+page).then(function (response){  
                return response.data;
            });
        },
        Load_Services: function(q,p,page){
            return $http.get(base_url +'/api/v1/services?nombre='+q+'&per_page='+p+'&page='+page).then(function (response){  
                return response.data;
            });
        },
        Load_Amigos: function(q,p,page){
            return $http.get(base_url +'/api/v1/amigos?nombre='+q+'&per_page='+p+'&page='+page).then(function (response){  
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzk0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVWJpY2FjaW9uZXNfRnJvbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xudmFyIG1vZGVsID0gYW5ndWxhci5tb2R1bGUoJ21vZGVsJywgXG4gICAgWydTZXJ2aWNlcycsXCJuZ1Nhbml0aXplXCIsXCJhbmd1bGFyLXV1aWRcIl0pO1xuXG52YXIgc2VsZXRlZFZhbHVlID0gMTU7XG5cbm1vZGVsLmNvbnRyb2xsZXIoJ0N0cmwnLCBcbiAgICBbJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAnJHRpbWVvdXQnLFxuICAgICdTZXJ2aWNlcycsICBcbiAgICAndXVpZCcsXG4gICAgZnVuY3Rpb24oXG4gICAgICAgICRzY29wZSxcbiAgICAgICAgJGh0dHAsXG4gICAgICAgICR0aW1lb3V0LFxuICAgICAgICBTZXJ2aWNlcyxcbiAgICAgICAgdXVpZClcbnsgIFxuICAgIHZhciBodG1sID0gZnVuY3Rpb24oaWQpIHsgXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7IFxuICAgIH07XG5cbiAgICAkc2NvcGUudGVtcCA9IFtdO1xuICAgICRzY29wZS5uZXdfbWFya2VyID0gW107XG4gICAgJHNjb3BlLmRhdGFfcmVhbCA9IFtdO1xuICAgICRzY29wZS5jYW50X3Jvd3MgPSBcIjEwXCI7XG4gICAgJHNjb3BlLm1hcGEgPSAnZnVsbCc7XG4gICAgJHNjb3BlLmhlYWRlcl9zZWFyY2ggPSB0cnVlO1xuICAgIFxuICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICBpZihxID09IHVuZGVmaW5lZCl7IFxuICAgICAgICAgICAgcSA9IFwiXCI7XG4gICAgICAgIH0gICBcbiAgICAgICAgU2VydmljZXMuTG9hZChxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWQgPSByZXNwb25zZS5kYXRhOyBcbiAgICAgICAgICAgIC8vICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7ICBcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVwZGF0ZV9mb3RvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZCk7XG4gICAgICAgICRzY29wZS50ZW1wX2RhdGEgPSBbXTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhX2xvYWQsIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGZvdG8gPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0cmVldHZpZXc/c2l6ZT02MDZ4NDAwJmxvY2F0aW9uPScrdmFsdWUubGF0KycsJyt2YWx1ZS5sbmcrJyZwaXRjaD0tMC43NiZrZXk9QUl6YVN5RFNKRzhKa05KM2k3cHlIWnoxZ0MxVFlWVWljbTNDM3NFJztcbiAgICAgICAgICAgIC8vIHZhciBpZCA9IHZhbHVlLmlkO1xuICAgICAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgICAgICBmb3RvIDogZm90byBcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gJHNjb3BlLnRlbXBfZGF0YS5wdXNoKG9iaik7XG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlX2Z1bGwodmFsdWUuaWQsb2JqKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbHVlLmlkLCBvYmopO1xuICAgICAgICB9KVxuICAgIH07XG5cbiAgICAkc2NvcGUudXBkYXRlX2Z1bGwgPSBmdW5jdGlvbihpZCxkYXRhKXsgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkLCBkYXRhKTtcbiAgICAgICAgU2VydmljZXMuVXBkYXRlX2ltZyhpZCxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgLy8gJCgnI2VkaXQnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLmluaXQoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUubG9hZF9zZXJ2aWNlcyA9IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgaWYocSA9PSB1bmRlZmluZWQpeyBcbiAgICAgICAgICAgIHEgPSBcIlwiO1xuICAgICAgICB9ICBcbiAgICAgICAgU2VydmljZXMuTG9hZF9TZXJ2aWNlcyhxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWRfc2VydmljZXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgJHNjb3BlLnRvID0gcmVzcG9uc2UudG87IFxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDsgXG4gICAgICAgICAgICBpZigkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gJHNjb3BlLnByZXZfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9ICRzY29wZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTsgXG4gICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRfc2VydmljZXMpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7IFxuICAgIH07XG4gXG4gICAgJHNjb3BlLmxvYWRfc2VydmljZXMoJycsMTAsMSk7XG4gXG4gICAgJHNjb3BlLmxvYWRfYW1pZ29zID0gZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICBpZihxID09IHVuZGVmaW5lZCl7IFxuICAgICAgICAgICAgcSA9IFwiXCI7XG4gICAgICAgIH0gIFxuICAgICAgICBTZXJ2aWNlcy5Mb2FkX0FtaWdvcyhxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5hbWlnb3MgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmFtaWdvcyk7XG4gICAgICAgICAgICAkc2NvcGUudG8gPSByZXNwb25zZS50bzsgXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSByZXNwb25zZS50b3RhbDtcbiAgICAgICAgICAgICRzY29wZS5sYXN0X3BhZ2UgPSByZXNwb25zZS5sYXN0X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudF9wYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSByZXNwb25zZS5uZXh0X3BhZ2VfdXJsO1xuICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSByZXNwb25zZS5wcmV2X3BhZ2VfdXJsOyBcbiAgICAgICAgICAgIGlmKCRzY29wZS5wcmV2X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSAkc2NvcGUucHJldl9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigkc2NvcGUubmV4dF9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gJHNjb3BlLm5leHRfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpOyBcbiAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZF9zZXJ2aWNlcyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTsgXG4gICAgfTsgICBcbiAgICBcbiAgICAkc2NvcGUubG9hZF9hbWlnb3MoJycsMTAsMSk7XG4gICAgXG4gICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyAkc2NvcGUubG9hZCgnJywyMDAsMSk7XG4gICAgfSAgIFxuICAgIFxuICAgICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTsgXG4gICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlO1xuICAgICRzY29wZS5kaXNhYmxlX2J1dHRvbiA9IGZhbHNlO1xuICAgIHZhciBtYXAsbWFwMixtYXJrZXIscGxhY2VzLGF1dG9jb21wbGV0ZSxpbmZvV2luZG93O1xuICAgIHZhciBtYXJrZXJzID0gW107XG4gICAgdmFyIGNyZWF0ZV9tYXJrZXIgPSBbXTtcbiAgICB2YXIgY291bnRyeVJlc3RyaWN0ID0geydjb3VudHJ5JzogJ3BlJ307XG4gICAgdmFyIE1BUktFUl9QQVRIID0gJ2h0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L2ltYWdlcy9tYXJrZXJfZ3JlZW4nO1xuICAgIHZhciBob3N0bmFtZVJlZ2V4cCA9IG5ldyBSZWdFeHAoJ15odHRwcz86Ly8uKz8vJyk7XG4gICAgLy8gaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7IFxuICAgIFxuICAgIHZhciBkaXJlY3Rpb25zRGlzcGxheSA9IG51bGw7XG4gICAgdmFyIGRpcmVjdGlvbnNTZXJ2aWNlID0gbnVsbDsgXG4gICAgLy8gdmFyIHN0eWxlID0gW3tcImZlYXR1cmVUeXBlXCI6XCJhZG1pbmlzdHJhdGl2ZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LmZpbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiMzMTQ2NmFcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInNhdHVyYXRpb25cIjpcIi0xM1wifSx7XCJsaWdodG5lc3NcIjpcIjZcIn0se1wiZ2FtbWFcIjpcIjEuODFcIn0se1wiY29sb3JcIjpcIiNjOWNjZDFcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzXCIsXCJzdHlsZXJzXCI6W3tcIndlaWdodFwiOlwiMS44MlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImxpZ2h0bmVzc1wiOlwiM1wifSx7XCJnYW1tYVwiOlwiMC4wMFwifSx7XCJzYXR1cmF0aW9uXCI6XCItMVwifSx7XCJ3ZWlnaHRcIjpcIjIuMzBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicG9pXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInNhdHVyYXRpb25cIjotMTAwfSx7XCJsaWdodG5lc3NcIjo0NX0se1widmlzaWJpbGl0eVwiOlwib25cIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5oaWdod2F5XCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcInNpbXBsaWZpZWRcIn0se1wic2F0dXJhdGlvblwiOlwiLTEwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJyb2FkLmFydGVyaWFsXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLmljb25cIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib2ZmXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwidHJhbnNpdFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvblwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcIndhdGVyXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjNTM3NWFjXCJ9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX1dO1xuICAgIHZhciBzdHlsZSA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlLmNvdW50cnlcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImh1ZVwiOiBcIiNmZjAwMDBcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicG9pLmF0dHJhY3Rpb25cIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5idXNpbmVzc1wiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIGNsb3NlSW5mb1dpbmRvdygpe1xuICAgICAgICAvLyBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTsgXG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICB9IFxuICAgIFxuICAgICRzY29wZS5JbmNpYWxpemFjaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBsaW1hID0ge2xhdDogLTExLjk4Nzc1MTksIGxuZzogLTc3LjA5MDczM307XG4gICAgICAgIC8vIHtsYXQ6IC0xMi4wNDY2MjksIGxuZzogLTc3LjAyMTQzMzd9XG5cbiAgICAgICAgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwYScpLCB7XG4gICAgICAgICAgICBjZW50ZXI6IGxpbWEsXG4gICAgICAgICAgICB6b29tOiAxMSxcbiAgICAgICAgICAgIG1pblpvb206IDUsXG4gICAgICAgICAgICBzdHlsZXMgOiBzdHlsZVxuICAgICAgICB9KTtcblxuICAgICAgICAvKiBwZXJtaXRlIG9jdWx0YXIgZWwgaW5mb3dpbmRvdyAqL1xuICAgICAgICBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTsgXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNsb3NlSW5mb1dpbmRvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG5cblxuICAgICAgICAkc2NvcGUuY2FyZ2FyX21hcmNhZG9yZXMoKTsgXG4gICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5ID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcigpO1xuICAgICAgICBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgICQoJyNpbnB1dF9zdGFydCcpLmZvY3VzKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIG1hcC5hZGRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBhZGRNYXJrZXIoZXZlbnQubGF0TG5nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pOyAgXG5cbiAgICAgICAgXG4gICAgfVxuICAgIFxuICAgICRzY29wZS5jYXJnYXJfbWFyY2Fkb3JlcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dG9jb21wbGV0ZV9zZWFyY2gnKTtcbiAgICAgICAgdmFyIHNlYXJjaEJveCA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuU2VhcmNoQm94KGlucHV0KTsgIFxuICAgICAgICBtYXAuYWRkTGlzdGVuZXIoJ2JvdW5kc19jaGFuZ2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VhcmNoQm94LnNldEJvdW5kcyhtYXAuZ2V0Qm91bmRzKCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2VhcmNoQm94LmFkZExpc3RlbmVyKCdwbGFjZXNfY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5wbGFjZXMuUGxhY2VzU2VydmljZShtYXApOyAgICAgICAgXG5cbiAgICAgICAgICAgIHZhciBwbGFjZXMgPSBzZWFyY2hCb3guZ2V0UGxhY2VzKCk7XG4gICAgICAgICAgICB2YXIgcGxhY2UgPSBwbGFjZXNbMF07XG4gICAgICAgICAgICB2YXIgcmFkaXVzID0gNTAwMDsgIFxuICAgICAgICAgICAgaWYgKHBsYWNlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiBcbiAgICAgICAgICAgIG1hcmtlcnMuZm9yRWFjaChmdW5jdGlvbihtYXJrZXIpIHtcbiAgICAgICAgICAgICAgICBtYXJrZXIuc2V0TWFwKG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtYXJrZXJzID0gW107XG4gICAgICAgICAgICAkc2NvcGUuZGF0YV9sb2FkID0gW107XG4gICAgICAgICAgICB2YXIgYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xuXG4gICAgICAgICAgICBpZihwbGFjZXMubGVuZ3RoID4gMSApe1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdlbnRyZScpO1xuICAgICAgICAgICAgICAgIC8vICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd19saXN0X21hcmtlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd19kZXRhaWxfbWFya2VyKCk7ICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGxhY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gdmFyIHBsYWNlID0gcGxhY2VzW2ldO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlc1tpXS5wbGFjZV9pZCk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2VzW2ldKTtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldERldGFpbHMoe3BsYWNlSWQ6IHBsYWNlc1tpXS5wbGFjZV9pZH0sIGZ1bmN0aW9uKHBsYWNlLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyAhPT0gZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2VTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZSlcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTWFya2VyKHBsYWNlKTsgXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGluZm9XaW5kb3cuc2V0Q29udGVudChtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpbmZvV2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBidWlsZElXQ29udGVudChwbGFjZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZGRSZXN1bHQocGxhY2VzW2ldLCBpKTtcblxuICAgICAgICAgICAgICAgIGlmIChwbGFjZXNbaV0uZ2VvbWV0cnkudmlld3BvcnQpIHtcbiAgICAgICAgICAgICAgICAgIC8vIE9ubHkgZ2VvY29kZXMgaGF2ZSB2aWV3cG9ydC5cbiAgICAgICAgICAgICAgICAgIGJvdW5kcy51bmlvbihwbGFjZXNbaV0uZ2VvbWV0cnkudmlld3BvcnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBib3VuZHMuZXh0ZW5kKHBsYWNlc1tpXS5nZW9tZXRyeS5sb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcbiAgICAgICAgfSk7IFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGxiYWNrKHJlc3VsdHMsIHN0YXR1cykge1xuICAgICAgICBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5wbGFjZXMuUGxhY2VzU2VydmljZVN0YXR1cy5PSykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlTWFya2VyKHJlc3VsdHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1hcmtlcihwbGFjZSkgeyBcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2UudHlwZXMpO1xuICAgICAgICBpZiAoIXBsYWNlLmdlb21ldHJ5KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHVybmVkIHBsYWNlIGNvbnRhaW5zIG5vIGdlb21ldHJ5XCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwbGFjZS50eXBlcyxmdW5jdGlvbih2YWx1ZSAsIGkpe1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codmFsdWUpO1xuICAgICAgICAgICAgaWYoIFxuICAgICAgICAgICAgICAgIHZhbHVlID09PSAnYmFuaycgfHwgdmFsdWUgPT09ICdmaW5hbmNlJ1xuICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICB2YXIgaWNvbiA9IHsgXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvYmFuY28tY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksIFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgIHBsYWNlLmljb25fbmV3ID0gaWNvbjsgXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgZWxzZSBpZihcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PT0gJ3BvbGljZSdcbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgdmFyIGljb24gPSB7IFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2NvbWlzYXJpYS1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICBwbGFjZS5pY29uX25ldyA9IGljb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKFxuICAgICAgICAgICAgICAgIHZhbHVlID09PSAnaG9zcGl0YWwnXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgIHZhciBpY29uID0geyBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9ob3NwaXRhbC1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICBwbGFjZS5pY29uX25ldyA9IGljb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKFxuICAgICAgICAgICAgICAgIHZhbHVlID09PSAnZmlyZV9zdGF0aW9uJ1xuICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICB2YXIgaWNvbiA9IHsgXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvYm9tYmVyb3MtY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICBwbGFjZS5pY29uX25ldyA9IGljb247IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJPY3VycmlvIHVuIGVycm9yIGluZXNwZXJhZG8gZW4gbG9zIElEIGRlIEVudGlkYWRlc1wiKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBcbiAgICAgICAgfSlcbiAgICAgICAgLy9yZ2IoNDksIDcwLCAxMDYpICM5ZTllOWVcbiAgICAgICAgLy8gdmFyIGljb24gPSB7XG4gICAgICAgIC8vICAgICB1cmw6IHBsYWNlLmljb24sXG4gICAgICAgIC8vICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLFxuICAgICAgICAvLyAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgIC8vICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgLy8gICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMClcbiAgICAgICAgLy8gfTsgXG4gICAgICAgIHZhciBwb3MgPSB7fTtcbiAgICAgICAgcG9zLmxhdCA9IHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uLmxhdCgpO1xuICAgICAgICBwb3MubG5nID0gcGxhY2UuZ2VvbWV0cnkubG9jYXRpb24ubG5nKCk7XG4gICAgICAgIGlmKCBwbGFjZS5waG90b3MgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICB2YXIgaW1nID0gcGxhY2UucGhvdG9zWzBdLmdldFVybCh7J21heFdpZHRoJzogNDAwLCAnbWF4SGVpZ2h0JzogNDAwfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBpbWcgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0cmVldHZpZXc/c2l6ZT02MDZ4NDAwJmxvY2F0aW9uPScrcG9zLmxhdCsnLCcrcG9zLmxuZysnJmtleT1BSXphU3lEU0pHOEprTkozaTdweUhaejFnQzFUWVZVaWNtM0Mzc0UnXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYWNlLmZvcm1hdHRlZF9hZGRyZXNzKSB7IFxuICAgICAgICAgIHZhciBkaXJlY2Npb24gPSBwbGFjZS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYWNlLnJhdGluZykge1xuICAgICAgICAgICAgdmFyIHJhdGluZ0h0bWwgPSAnJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJha2luZ19udW1iZXIgPSBwbGFjZS5yYXRpbmc7XG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlLnJhdGluZyA8IChpICsgMC41KSkge1xuICAgICAgICAgICAgICAgICAgICByYXRpbmdIdG1sICs9ICcmIzEwMDI1Oyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nSHRtbCArPSAnJiMxMDAyOTsnO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2V7IFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBsYWNlLndlYnNpdGUpIHtcbiAgICAgICAgICAgIHZhciBmdWxsVXJsID0gcGxhY2Uud2Vic2l0ZTtcbiAgICAgICAgICAgIHZhciB3ZWJzaXRlID0gaG9zdG5hbWVSZWdleHAuZXhlYyhwbGFjZS53ZWJzaXRlKTtcbiAgICAgICAgICAgIGlmICh3ZWJzaXRlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgd2Vic2l0ZSA9ICBwbGFjZS53ZWJzaXRlICsgJy8nO1xuICAgICAgICAgICAgICAgIGZ1bGxVcmwgPSBcIldlYjogPGEgaHJlZj1cIit3ZWJzaXRlK1wiIHRhcmdldD0nX2JsYW5rJz5cIit3ZWJzaXRlK1wiPC9hPlwiO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmdWxsVXJsID0gXCJcIjsgXG4gICAgICAgIH1cbiAgICAgICAgaWYocGxhY2UuZm9ybWF0dGVkX3Bob25lX251bWJlcil7XG4gICAgICAgICAgICB2YXIgdGVsZWZvbm8gPSBwbGFjZS5mb3JtYXR0ZWRfcGhvbmVfbnVtYmVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHBsYWNlLnJldmlld3MpeyBcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCggcGxhY2UucmV2aWV3cyxmdW5jdGlvbih2YWx1ZSxqKXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdmFyIHJhdGluZ0h0bWwgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmFraW5nX251bWJlciA9IHZhbHVlLnJhdGluZztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnJhdGluZyA8IChpICsgMC41KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW5nSHRtbCArPSAnJiMxMDAyNTsnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmF0aW5nSHRtbCArPSAnJiMxMDAyOTsnO1xuICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YWx1ZS5yYWtpbmcgPSByYXRpbmdIdG1sO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSBhIG1hcmtlciBmb3IgZWFjaCBwbGFjZS5cbiAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICBpY29uOiBwbGFjZS5pY29uX25ldyxcbiAgICAgICAgICAgIHRpdGxlOiBwbGFjZS5uYW1lLFxuICAgICAgICAgICAgcG9zaXRpb246IHBvcyxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXG4gICAgICAgICAgICBmb3RvOiBpbWcsXG4gICAgICAgICAgICBkaXJlY2Npb246IGRpcmVjY2lvbixcbiAgICAgICAgICAgIHVybDogZnVsbFVybCxcbiAgICAgICAgICAgIHJha2luZzogcmF0aW5nSHRtbCxcbiAgICAgICAgICAgIG51bWJlcl9yIDogcmFraW5nX251bWJlcixcbiAgICAgICAgICAgIHRlbGVmb25vOiB0ZWxlZm9ubyxcbiAgICAgICAgICAgIGNvbWVudGFyaW9zOiBwbGFjZS5yZXZpZXdzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG1hcmtlcnMucHVzaChtYXJrZXIpOyAgXG4gICAgICAgICRzY29wZS5kYXRhX2xvYWQucHVzaChtYXJrZXIpO1xuICAgICAgICAkc2NvcGUuZGV0YWxsZSA9IG1hcmtlcjtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGV0YWxsZSk7XG4gICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKXsgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihtYXJrZXIucG9zaXRpb24pOyAgXG4gICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4obWFwLCB0aGlzKTsgXG4gICAgICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNlbnRlciBnbG9ib191YmljYWNpb25cIj4nLCBcbiAgICAgICAgICAgICAgICAgICAgJzxpbWcgd2lkdGg9XCIxMDAlXCIgc3JjPVwiJyttYXJrZXIuZm90bysnXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJzxoNj4nK21hcmtlci50aXRsZSsnPC9oNj4nLCAgXG4gICAgICAgICAgICAgICAgICAgICc8cD4nK21hcmtlci5kaXJlY2Npb24rJzwvcD4nLCBcbiAgICAgICAgICAgICAgICAgICAgJzxwPiByYW5raW5nOiAnK21hcmtlci5yYWtpbmcgKycgICcrbWFya2VyLm51bWJlcl9yKyc8L3A+JywgIFxuICAgICAgICAgICAgICAgICAgICAnPHA+JyttYXJrZXIudXJsKyc8L3A+JywgICBcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgICAgICBdLmpvaW4oJycpXG4gICAgICAgICAgICApOyBcbiAgICAgICAgICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTsgIFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRNYXJrZXIobG9jYXRpb24pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjcmVhdGVfbWFya2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY3JlYXRlX21hcmtlcltpXSkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZV9tYXJrZXJbaV0uc2V0TWFwKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNyZWF0ZV9tYXJrZXIgPSBbXTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24ubGF0KCksIGxvY2F0aW9uLmxuZygpKTtcbiAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgIHBvc2l0aW9uOiBsb2NhdGlvbixcbiAgICAgICAgICBtYXA6IG1hcFxuICAgICAgICB9KTtcbiAgICAgICAgY3JlYXRlX21hcmtlci5wdXNoKG1hcmtlcik7XG4gICAgICAgICRzY29wZS5pbnB1dF9zdGFydCA9IGxvY2F0aW9uLmxhdCgpK1wiLFwiK2xvY2F0aW9uLmxuZygpO1xuICAgICAgICB2YXIgbGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsb2NhdGlvbi5sYXQoKSxsb2NhdGlvbi5sbmcoKSk7IFxuICAgICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcbiAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7J2xhdExuZyc6IGxhdGxuZ30sIGZ1bmN0aW9uKHJlc3VsdHMsIHN0YXR1cykge1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdHNbMF0pOyBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRleHRfc3RhcnQgPSByZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzOyBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluZGljYWNpb25lcygpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhbGVydCgnTm8gcmVzdWx0cyBmb3VuZCcpO1xuICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ0dlb2NvZGVyIGZhaWxlZCBkdWUgdG86ICcgKyBzdGF0dXMpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgfSlcbiAgICB9XG4gICAgZnVuY3Rpb24gb25QbGFjZUNoYW5nZWQocGxhY2UpIHtcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlKTtcbiAgICAgICAgaWYgKHBsYWNlWzBdLmdlb21ldHJ5KSB7XG4gICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBwbGFjZVswXS5nZW9tZXRyeS5sb2NhdGlvbjtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uKTtcbiAgICAgICAgICAgIG1hcC5wYW5Ubyhsb2NhdGlvbik7XG4gICAgICAgICAgICBtYXAuc2V0Wm9vbSgxNSk7XG4gICAgICAgICAgICAvLyBjcmVhdGVNYXJrZXIocGxhY2UpO1xuICAgICAgICAgICAgc2VhcmNoKGxvY2F0aW9uKTtcbiAgICAgICAgfSAgZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0b2NvbXBsZXRlX3NlYXJjaCcpLnBsYWNlaG9sZGVyID0gJ0VudGVyIGEgY2l0eSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZWFyY2ggZm9yIGhvdGVscyBpbiB0aGUgc2VsZWN0ZWQgY2l0eSwgd2l0aGluIHRoZSB2aWV3cG9ydCBvZiB0aGUgbWFwLlxuICAgIGZ1bmN0aW9uIHNlYXJjaChsb2NhdGlvbikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbik7XG4gICAgICAgIHZhciBwbGFjZXMgPSBuZXcgZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2UobWFwKTtcbiAgICAgICAgdmFyIHNlYXJjaCA9IHsgXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICAgICAgICByYWRpdXM6IDUwMCxcbiAgICAgICAgICAgIHR5cGVzOiBbJ2VzdGFibGlzaG1lbnQnXVxuICAgICAgICB9O1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZSk7XG4gICAgICAgIHBsYWNlcy5uZWFyYnlTZWFyY2goc2VhcmNoLCBmdW5jdGlvbihyZXN1bHRzLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdHMpO1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2VTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICBjbGVhclJlc3VsdHMoKTtcbiAgICAgICAgICAgICAgICBjbGVhck1hcmtlcnMoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlTWFya2VyKHJlc3VsdHNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbWFya2VyIGZvciBlYWNoIGhvdGVsIGZvdW5kLCBhbmRcbiAgICAgICAgICAgICAgICAvLyBhc3NpZ24gYSBsZXR0ZXIgb2YgdGhlIGFscGhhYmV0aWMgdG8gZWFjaCBtYXJrZXIgaWNvbi5cbiAgICAgICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIHZhciBtYXJrZXJMZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCdBJy5jaGFyQ29kZUF0KDApICsgKGkgJSAyNikpO1xuICAgICAgICAgICAgICAgIC8vIHZhciBtYXJrZXJJY29uID0gTUFSS0VSX1BBVEggKyBtYXJrZXJMZXR0ZXIgKyAnLnBuZyc7XG4gICAgICAgICAgICAgICAgLy8gVXNlIG1hcmtlciBhbmltYXRpb24gdG8gZHJvcCB0aGUgaWNvbnMgaW5jcmVtZW50YWxseSBvbiB0aGUgbWFwLlxuICAgICAgICAgICAgICAgIC8vIG1hcmtlcnNbaV0gPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAvLyAgICAgcG9zaXRpb246IHJlc3VsdHNbaV0uZ2VvbWV0cnkubG9jYXRpb24sXG4gICAgICAgICAgICAgICAgLy8gICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXG4gICAgICAgICAgICAgICAgLy8gICAgIGljb246IG1hcmtlckljb25cbiAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdXNlciBjbGlja3MgYSBob3RlbCBtYXJrZXIsIHNob3cgdGhlIGRldGFpbHMgb2YgdGhhdCBob3RlbFxuICAgICAgICAgICAgICAgIC8vIGluIGFuIGluZm8gd2luZG93LlxuICAgICAgICAgICAgICAgIC8vIG1hcmtlcnNbaV0ucGxhY2VSZXN1bHQgPSByZXN1bHRzW2ldO1xuICAgICAgICAgICAgICAgIC8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlcnNbaV0sICdjbGljaycsIHNob3dJbmZvV2luZG93KTtcbiAgICAgICAgICAgICAgICAvLyBzZXRUaW1lb3V0KGRyb3BNYXJrZXIoaSksIGkgKiAxMDApO1xuICAgICAgICAgICAgICAgIC8vIGFkZFJlc3VsdChyZXN1bHRzW2ldLCBpKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhZGRSZXN1bHQocmVzdWx0LCBpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIHZhciByZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdHMnKTtcbiAgICAgICAgdmFyIG1hcmtlckxldHRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoJ0EnLmNoYXJDb2RlQXQoMCkgKyAoaSAlIDI2KSk7XG4gICAgICAgIHZhciBtYXJrZXJJY29uID0gTUFSS0VSX1BBVEggKyBtYXJrZXJMZXR0ZXIgKyAnLnBuZyc7XG5cbiAgICAgICAgdmFyIHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICAgICAgdHIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKGkgJSAyID09PSAwID8gJyNGMEYwRjAnIDogJyNGRkZGRkYnKTtcbiAgICAgICAgdHIub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFya2Vyc1tpXSwgJ2NsaWNrJyk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgaWNvblRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgIHZhciBuYW1lVGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgICAgdmFyIGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgIGljb24uc3JjID0gbWFya2VySWNvbjtcbiAgICAgIGljb24uc2V0QXR0cmlidXRlKCdjbGFzcycsICdwbGFjZUljb24nKTtcbiAgICAgIGljb24uc2V0QXR0cmlidXRlKCdjbGFzc05hbWUnLCAncGxhY2VJY29uJyk7XG4gICAgICB2YXIgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlc3VsdC5uYW1lKTtcbiAgICAgIGljb25UZC5hcHBlbmRDaGlsZChpY29uKTtcbiAgICAgIG5hbWVUZC5hcHBlbmRDaGlsZChuYW1lKTtcbiAgICAgIHRyLmFwcGVuZENoaWxkKGljb25UZCk7XG4gICAgICB0ci5hcHBlbmRDaGlsZChuYW1lVGQpO1xuICAgICAgLy8gcmVzdWx0cy5hcHBlbmRDaGlsZCh0cik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRyb3BNYXJrZXIoaSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtYXJrZXJzW2ldLnNldE1hcChtYXApO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhck1hcmtlcnMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG1hcmtlcnNbaV0pIHtcbiAgICAgICAgICAgICAgICBtYXJrZXJzW2ldLnNldE1hcChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtYXJrZXJzID0gW107XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsZWFyUmVzdWx0cygpIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0cycpO1xuICAgICAgICB3aGlsZSAocmVzdWx0cy5jaGlsZE5vZGVzWzBdKSB7XG4gICAgICAgICAgICByZXN1bHRzLnJlbW92ZUNoaWxkKHJlc3VsdHMuY2hpbGROb2Rlc1swXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2hvd0luZm9XaW5kb3coKSB7XG4gICAgICAgIHZhciBtYXJrZXIgPSB0aGlzO1xuICAgICAgICBwbGFjZXMuZ2V0RGV0YWlscyh7cGxhY2VJZDogbWFya2VyLnBsYWNlUmVzdWx0LnBsYWNlX2lkfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKHBsYWNlLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzICE9PSBnb29nbGUubWFwcy5wbGFjZXMuUGxhY2VzU2VydmljZVN0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hcmtlcik7XG4gICAgICAgICAgICAgICAgLy8gaW5mb1dpbmRvdy5zZXRDb250ZW50KG1hcmtlcik7XG4gICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgICAgICBidWlsZElXQ29udGVudChwbGFjZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRJV0NvbnRlbnQocGxhY2UpIHtcbiAgICAgICAgY29uc29sZS5sb2cocGxhY2UpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctaWNvbicpLmlubmVySFRNTCA9ICc8aW1nIGNsYXNzPVwiaG90ZWxJY29uXCIgJyArICdzcmM9XCInICsgcGxhY2UuaWNvbiArICdcIi8+JztcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXVybCcpLmlubmVySFRNTCA9ICc8Yj48YSBocmVmPVwiJyArIHBsYWNlLnVybCArICdcIj4nICsgcGxhY2UubmFtZSArICc8L2E+PC9iPic7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy1hZGRyZXNzJykudGV4dENvbnRlbnQgPSBwbGFjZS52aWNpbml0eTtcblxuICAgICAgICBpZiAocGxhY2UuZm9ybWF0dGVkX3Bob25lX251bWJlcikge1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy1waG9uZS1yb3cnKS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXBob25lJykudGV4dENvbnRlbnQgPSBwbGFjZS5mb3JtYXR0ZWRfcGhvbmVfbnVtYmVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy1waG9uZS1yb3cnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXNzaWduIGEgZml2ZS1zdGFyIHJhdGluZyB0byB0aGUgaG90ZWwsIHVzaW5nIGEgYmxhY2sgc3RhciAoJyYjMTAwMjk7JylcbiAgICAgICAgLy8gdG8gaW5kaWNhdGUgdGhlIHJhdGluZyB0aGUgaG90ZWwgaGFzIGVhcm5lZCwgYW5kIGEgd2hpdGUgc3RhciAoJyYjMTAwMjU7JylcbiAgICAgICAgLy8gZm9yIHRoZSByYXRpbmcgcG9pbnRzIG5vdCBhY2hpZXZlZC5cbiAgICAgICAgaWYgKHBsYWNlLnJhdGluZykge1xuICAgICAgICAgIHZhciByYXRpbmdIdG1sID0gJyc7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwbGFjZS5yYXRpbmcgPCAoaSArIDAuNSkpIHtcbiAgICAgICAgICAgICAgcmF0aW5nSHRtbCArPSAnJiMxMDAyNTsnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmF0aW5nSHRtbCArPSAnJiMxMDAyOTsnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy1yYXRpbmctcm93Jykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy1yYXRpbmcnKS5pbm5lckhUTUwgPSByYXRpbmdIdG1sO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcmF0aW5nLXJvdycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgcmVnZXhwIGlzb2xhdGVzIHRoZSBmaXJzdCBwYXJ0IG9mIHRoZSBVUkwgKGRvbWFpbiBwbHVzIHN1YmRvbWFpbilcbiAgICAgICAgLy8gdG8gZ2l2ZSBhIHNob3J0IFVSTCBmb3IgZGlzcGxheWluZyBpbiB0aGUgaW5mbyB3aW5kb3cuXG4gICAgICAgIGlmIChwbGFjZS53ZWJzaXRlKSB7XG4gICAgICAgICAgdmFyIGZ1bGxVcmwgPSBwbGFjZS53ZWJzaXRlO1xuICAgICAgICAgIHZhciB3ZWJzaXRlID0gaG9zdG5hbWVSZWdleHAuZXhlYyhwbGFjZS53ZWJzaXRlKTtcbiAgICAgICAgICBpZiAod2Vic2l0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgd2Vic2l0ZSA9ICdodHRwOi8vJyArIHBsYWNlLndlYnNpdGUgKyAnLyc7XG4gICAgICAgICAgICBmdWxsVXJsID0gd2Vic2l0ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXdlYnNpdGUtcm93Jykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy13ZWJzaXRlJykudGV4dENvbnRlbnQgPSB3ZWJzaXRlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy13ZWJzaXRlLXJvdycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUuaW5pdE1hcCA9IGZ1bmN0aW9uKCkgeyBcbiAgICAgICAgLy8gJHNjb3BlLiR3YXRjaCgnc2VhcmNoX2VudGlkYWQnLCBmdW5jdGlvbihuKXsgXG4gICAgICAgICAgICBpZigkc2NvcGUuc2VhcmNoX2VudGlkYWQgIT0gdW5kZWZpbmVkICYmICRzY29wZS5zZWFyY2hfZW50aWRhZCAhPSAnJyl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWQoJHNjb3BlLnNlYXJjaF9lbnRpZGFkLDUsMSk7XG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9hZCgnJywnMCcsMSk7IFxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5tYXBhID0gJ2Z1bGwnOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgLy8gfSk7ICAgICAgICAgICBcbiAgICB9XG4gICAgJHNjb3BlLkluY2lhbGl6YWNpb24oKTtcbiAgICAvLyAkc2NvcGUuaW5pdE1hcCgpO1xuXG4gICAgJHNjb3BlLnJlc2l6ZSA9IGZ1bmN0aW9uKG1hcCl7XG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyT25jZShtYXAsICdib3VuZHNfY2hhbmdlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXAsICdyZXNpemUnKTtcbiAgICAgICAgICAgdmFyIGJvdW5kcyA9IG1hcC5nZXRCb3VuZHMoKTtcbiAgICAgICAgfSk7XG4gICAgfTsgXG5cbiAgICAkc2NvcGUuZ2V0S2lsb21ldHJvcyA9IGZ1bmN0aW9uKGxhdDEsbG9uMSxsYXQyLGxvbjIpe1xuICAgICAgICBmdW5jdGlvbiByYWQoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHggKiBNYXRoLlBJLzE4MDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgUiA9IDYzNzguMTM3OyAvL1JhZGlvIGRlIGxhIHRpZXJyYSBlbiBrbVxuICAgICAgICB2YXIgZExhdCA9IHJhZCggbGF0MiAtIGxhdDEgKTtcbiAgICAgICAgdmFyIGRMb25nID0gcmFkKCBsb24yIC0gbG9uMSApO1xuICAgICAgICB2YXIgYSA9IE1hdGguc2luKGRMYXQvMikgKiBNYXRoLnNpbihkTGF0LzIpICsgTWF0aC5jb3MocmFkKGxhdDEpKSAqIE1hdGguY29zKHJhZChsYXQyKSkgKiBNYXRoLnNpbihkTG9uZy8yKSAqIE1hdGguc2luKGRMb25nLzIpO1xuICAgICAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEtYSkpO1xuICAgICAgICB2YXIgZCA9IFIgKiBjO1xuICAgICAgICB2YXIgcmVzdWx0ID0gZC50b0ZpeGVkKDMpOyBcbiAgICAgICAgcmV0dXJuIHJlc3VsdDsgLy9SZXRvcm5hIHRyZXMgZGVjaW1hbGVzXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldE1pbkZyb21BcnJheSAoYXJyYXlfb2ZfdmFsdWVzKSB7XG4gICAgICAgIHZhciBtaW4gPSBNYXRoLm1pbi5hcHBseShudWxsLCBhcnJheV9vZl92YWx1ZXMpO1xuICAgICAgICByZXR1cm4gbWluOyAgIFxuICAgIH07XG5cbiAgICAvLyBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gICAgIGFsZXJ0KFwiY2xpY2tlZCBtYXJrZXJcIik7XG4gICAgLy8gfSk7XG5cbiAgICBcbiAgICAvLyAkc2NvcGUubG9jYXRpb24gPSBmdW5jdGlvbigpeyAgXG4gICAgICAgIC8vICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gICAgICAgIC8vICAgICAgICAgLy8gSU5JVCBSRVNJWkUgXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7IFxuICAgICAgICAvLyAgICAgICAgICRzY29wZS5kaXNhYmxlX2J1dHRvbiA9IHRydWU7IFxuICAgICAgICAvLyAgICAgICAgICRzY29wZS5kYXRhID0gW107XG5cbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuaW5pdE1hcCgpOyBcbiAgICAgICAgLy8gICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgIC8vICAgICAgICAgfSw1MDApO1xuICAgICAgICAvLyAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHsgICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICRzY29wZS5jcmVhdGVNYXJrZXIobWFwKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCA9IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICBsYXQ6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICBsbmc6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGVcbiAgICAgICAgLy8gICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgZ2VvY29kaW5nID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24/bGF0bG5nPScgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxhdCArICcsJyArICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nICsgJyZzZW5zb3I9ZmFsc2UnO1xuICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhnZW9jb2RpbmcpO1xuXG4gICAgICAgIC8vICAgICAgICAgICAgIHZhciBpbWFnZSA9IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHVybDogJy9hc3NldHMvYXBwL2ltYWdlcy9wb3NpdGlvbl9hY3R1YWwucG5nJywgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSg1MCwgNTApLCBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDQwKVxuICAgICAgICAvLyAgICAgICAgICAgICB9OyBcbiAgICAgICAgLy8gICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcG9zaXRpb246ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGljb246IGltYWdlXG4gICAgICAgIC8vICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vICAgICAgICAgICAgIHZhciBjaXJjbGUgPSBuZXcgZ29vZ2xlLm1hcHMuQ2lyY2xlKHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGNlbnRlcjogJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHJhZGl1czogMTAwMCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiAnIzM5NTI3YicsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBmaWxsT3BhY2l0eTogMCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnIzM5NTI3YicsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBzdHJva2VPcGFjaXR5OiAwLjJcbiAgICAgICAgLy8gICAgICAgICAgICAgfSk7ICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLnNlYXJjaF9lbnRpZGFkID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgIC8vICAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyAgICAgICAgICAgICBmb3IgKHZhciBpID0gJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGg7IGktLTspeyBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGlmKHBhcnNlRmxvYXQoICRzY29wZS5nZXRLaWxvbWV0cm9zKCAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxhdCwgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sbmcsICRzY29wZS5kYXRhX2xvYWRbaV0ubGF0LCAkc2NvcGUuZGF0YV9sb2FkW2ldLmxuZykpIDw9IDEpeyAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kYXRhX3JlYWwucHVzaCgkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9yZWFsKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBtaW4gPSBNYXRoLm1pbi5hcHBseShudWxsLCBhcnJheSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaSArJyBlbCBtaW5pbW8gZXM6ICcrIG1pbik7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBpZihpID09IDApe1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgc3RhcnQgPSBsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGVuZCA9ICRzY29wZS5kYXRhX2xvYWRbM10uZGlyZWNjaW9uO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYoIXN0YXJ0IHx8ICFlbmQpe1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGFsZXJ0KFwiU3RhcnQgYW5kIEVuZCBhZGRyZXNzZXMgYXJlIHJlcXVpcmVkXCIpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBvcmlnaW46IHN0YXJ0LFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkZXN0aW5hdGlvbjogZW5kLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB0cmF2ZWxNb2RlOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVHJhdmVsTW9kZVsnV0FMS0lORyddLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB1bml0U3lzdGVtOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVW5pdFN5c3RlbVsnTUVUUklDJ10sXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIHByb3ZpZGVSb3V0ZUFsdGVybmF0aXZlczogZmFsc2VcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH07XG5cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGRpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKCQoXCIjZGlyZWN0aW9uc19wYW5lbFwiKS5nZXQoMCkpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3BvbnNlKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSxzdGF0dXMpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBhbGVydChcIlRoZXJlIGlzIG5vIGRpcmVjdGlvbnMgYXZhaWxhYmxlIGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1wiKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZWxzZXsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRlbCgkc2NvcGUuZGF0YV9sb2FkLmluZGV4T2YoJHNjb3BlLmRhdGFfbG9hZFtpXSkpOyBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlcltpXS5zZXRNYXAobnVsbCk7ICBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpOyBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH0gXG4gICAgICAgIC8vICAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAgICAgICAgIG1hcC5zZXRab29tKDE4KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgbWFwLnBhblRvKG1hcmtlci5wb3NpdGlvbik7XG4gICAgICAgIC8vICAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoY2lyY2xlLmdldEJvdW5kcygpKTtcbiAgICAgICAgLy8gICAgICAgICB9LCBmdW5jdGlvbigpIHsgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IodHJ1ZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcbiAgICAgICAgLy8gICAgICAgICB9KTsgXG4gICAgICAgIC8vICAgICB9IGVsc2UgeyBcbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcihmYWxzZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcblxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAgXG4gICAgLy8gfVxuICAgIHZhciBhbGxfbWUgPSBbXTtcbiAgICAkc2NvcGUubG9jYXRpb24gPSBmdW5jdGlvbigpeyBcbiAgICAgICAgIFxuICAgICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7IFxuICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbihwb3NpdGlvbikgeyAgICBcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCA9IHtcbiAgICAgICAgICAgICAgICAgIGxhdDogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxuICAgICAgICAgICAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxfbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFsbF9tZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsX21lW2ldLnNldE1hcChudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhbGxfbWUgPSBbXTsgXG4gICAgICAgICAgICAgICAgJHNjb3BlLmlucHV0X3N0YXJ0ID0gJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sYXQrXCIsXCIrJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sbmc7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hc3NldHMvYXBwL2ltYWdlcy9wb3NpdGlvbl9hY3R1YWwucG5nJywgXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKVxuXG4gICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIHZhciBtZSA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJHNjb3BlLnBvc2ljaW9uX2FjdHVhbCxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgICAgIGljb246IGltYWdlXG4gICAgICAgICAgICAgICAgfSk7ICAgIFxuICAgICAgICAgICAgICAgIGFsbF9tZS5wdXNoKG1lKTsgXG5cbiAgICAgICAgICAgICAgICB2YXIgZ2VvY29kaW5nID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24/bGF0bG5nPScgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxhdCArICcsJyArICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nICsgJyZzZW5zb3I9ZmFsc2UnOyBcbiAgICAgICAgICAgICAgICAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7IFxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGV4dF9zdGFydCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7ICBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgICAgICB9KTsgIFxuICAgICAgICAgICAgICAgIG1hcC5zZXRab29tKDE2KTtcbiAgICAgICAgICAgICAgICBtYXAucGFuVG8obWUucG9zaXRpb24pOyBcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW5kaWNhY2lvbmVzKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWRfYWxsQm9tYmVyb3MoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLmNhcmdhcl9tYXJjYWRvcmVzKCk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpIHsgICBcbiAgICAgICAgICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcih0cnVlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuICAgICAgICAgICAgfSk7IFxuICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKGZhbHNlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuXG4gICAgICAgIH1cbiAgICAgICAgIFxuICAgIH1cbiAgICAvKiBwZXJtaXRlIG1vc3RyYSB5IG9jdWx0YXIgbG9zIG1hcmNhZG9yZXMgeSBhY3R1YWxpemFyIGVsIGxpc3RhZG8gKi9cbiAgICAkc2NvcGUuaWNvbl90cnVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmljb25fMSA9IHRydWU7XG4gICAgICAgICRzY29wZS5pY29uXzIgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaWNvbl8zID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmljb25fNCA9IHRydWU7XG4gICAgfVxuICAgICRzY29wZS5pY29uX3RydWUoKTtcblxuICAgICRzY29wZS50b2dnbGVfTWFya2VyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAkc2NvcGUuaWNvbl90cnVlKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG1hcmtlcnNbaV0pIHtcbiAgICAgICAgICAgICAgICBtYXJrZXJzW2ldLnNldE1hcChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtYXJrZXJzID0gW107XG4gICAgICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRvY29tcGxldGVfc2VhcmNoJyk7XG4gICAgICAgIGlmIChpZCA9PT0gMSkge1xuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBcImJhbmNvc1wiOyAgXG4gICAgICAgICAgICAkc2NvcGUuaWNvbl8xID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuaWNvbjEgPSBcIi9hc3NldHMvYXBwL2ltYWdlcy9iYW5jby1jb2xvci5zdmdcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGlkID09PSAyKXsgXG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IFwiY29taXNhcmlhc1wiOyBcbiAgICAgICAgICAgICRzY29wZS5pY29uXzIgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5pY29uMSA9IFwiL2Fzc2V0cy9hcHAvaW1hZ2VzL2NvbWlzYXJpYS1jb2xvci5zdmdcIjsgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihpZCA9PT0gMyl7IFxuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBcImhvc3BpdGFsZXNcIjsgXG4gICAgICAgICAgICAkc2NvcGUuaWNvbl8zID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuaWNvbjEgPSBcIi9hc3NldHMvYXBwL2ltYWdlcy9ob3NwaXRhbC1jb2xvci5zdmdcIjsgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihpZCA9PT0gNCl7XG4gICAgICAgICAgICBpbnB1dC52YWx1ZSA9IFwiYm9tYmVyb3NcIjtcbiAgICAgICAgICAgICRzY29wZS5pY29uXzQgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5pY29uMSA9IFwiL2Fzc2V0cy9hcHAvaW1hZ2VzL2JvbWJlcm9zLWNvbG9yLnN2Z1wiOyAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbnRyZVwiKTsgXG4gICAgICAgICAgICAvLyBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdib3VuZHNfY2hhbmdlZCcsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzY29wZS5sb2FkX2FsbEJvbWJlcm9zKCk7XG4gICAgICAgICAgICAvLyB9KTsgIFxuICAgICAgICAgICAgLy8gJHNjb3BlLmxpbWl0X2NoYW5nZWQoNCk7IFxuICAgICAgICB9XG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIoaW5wdXQsICdmb2N1cycpXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIoaW5wdXQsICdrZXlkb3duJywge1xuICAgICAgICAgICAga2V5Q29kZTogMTNcbiAgICAgICAgfSk7ICAgIFxuICAgIH1cbiAgICAvLyBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdib3VuZHNfY2hhbmdlZCcsJHNjb3BlLnRvZ2dsZV9NYXJrZXIoaWQpKTtcbiAgICAvLyAkc2NvcGUudG9nZ2xlX01hcmtlciA9IGZ1bmN0aW9uKGlkKXsgXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwiSW5ncmVzbyBlbCBJRDogXCIraWQpO1xuICAgIC8vICAgICAkc2NvcGUuaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7O1xuICAgIC8vICAgICAkc2NvcGUuaWQuY2hlY2tlZCA9ICEkc2NvcGUuaWQuY2hlY2tlZDsgXG4gICAgLy8gICAgIGlmKCQoJyMnK2lkKS5pcygnOmNoZWNrZWQnKSl7XG4gICAgLy8gICAgICAgICBmb3IodmFyIGkgPSAkc2NvcGUuZGF0YV9yZWFsLmxlbmd0aDsgaS0tOyl7IFxuICAgIC8vICAgICAgICAgICAgIGlmKCRzY29wZS5kYXRhX3JlYWxbaV0uaWRfc2VydmljZXMgPT09IGlkKXsgIFxuICAgIC8vICAgICAgICAgICAgICAgICB2YXIgdmFyaWFibGUgPSAnIycrJHNjb3BlLmRhdGFfcmVhbFtpXS5pZCsnLScraWQ7XG4gICAgLy8gICAgICAgICAgICAgICAgICQodmFyaWFibGUpLnNob3coKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLmRlbF90ZW1wKCRzY29wZS5kYXRhX3JlYWwuaW5kZXhPZigkc2NvcGUuZGF0YV9yZWFsW2ldKSk7ICAgXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIGVsc2V7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PVwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyk7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PVwiKTsgXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5uZXdfbWFya2VyLmxlbmd0aDsgaSsrKXtcbiAgICAvLyAgICAgICAgICAgICBpZigkc2NvcGUubmV3X21hcmtlcltpXS50eXBlID09PSBpZCl7IFxuICAgIC8vICAgICAgICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlcltpXS5zZXRWaXNpYmxlKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgZWxzZXtcbiAgICAvLyAgICAgICAgIGZvcih2YXIgaSA9ICRzY29wZS5kYXRhX3JlYWwubGVuZ3RoOyBpLS07KXsgXG4gICAgLy8gICAgICAgICAgICAgaWYoJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyA9PT0gaWQpeyBcbiAgICAvLyAgICAgICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gJyMnKyRzY29wZS5kYXRhX3JlYWxbaV0uaWQrJy0nK2lkO1xuICAgIC8vICAgICAgICAgICAgICAgICAkKHZhcmlhYmxlKS5oaWRlKCk7XG4gICAgLy8gICAgICAgICAgICAgICAgIC8vICRzY29wZS5kZWxfdGVtcCgkc2NvcGUuZGF0YV9yZWFsLmluZGV4T2YoJHNjb3BlLmRhdGFfcmVhbFtpXSkpOyAgIFxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICBlbHNle1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT09PT09PT1cIik7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX3JlYWxbaV0uaWRfc2VydmljZXMpO1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT09PT09PT1cIik7IFxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCAkc2NvcGUubmV3X21hcmtlci5sZW5ndGg7IGorKyl7XG4gICAgLy8gICAgICAgICAgICAgaWYoJHNjb3BlLm5ld19tYXJrZXJbal0udHlwZSA9PT0gaWQpeyBcbiAgICAvLyAgICAgICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbal0uc2V0VmlzaWJsZShmYWxzZSk7IFxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICBlbHNle1xuICAgIC8vICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi0tIG5vIHNlIGVsaW1pbm8gLS06IFwiKyRzY29wZS5kYXRhX3JlYWxbaV0uaWRfc2VydmljZXMpOyAgIFxuICAgIC8vICAgICAgICAgICAgIH0gXG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgLy8gJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAvLyB9XG5cbiAgICAkc2NvcGUuaW5kaWNhY2lvbmVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIGlmKCEkc2NvcGUuaW5wdXRfc3RhcnQgfHwgISRzY29wZS5pbnB1dF9lbmQpe1xuICAgICAgICAgICAgLy8gYWxlcnQoXCJTdGFydCBhbmQgRW5kIGFkZHJlc3NlcyBhcmUgcmVxdWlyZWRcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luOiAkc2NvcGUuaW5wdXRfc3RhcnQsXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5pbnB1dF9lbmQsXG4gICAgICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1RyYXZlbE1vZGVbJ0RSSVZJTkcnXSxcbiAgICAgICAgICAgICAgICB1bml0U3lzdGVtOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVW5pdFN5c3RlbVsnTUVUUklDJ10sXG4gICAgICAgICAgICAgICAgcHJvdmlkZVJvdXRlQWx0ZXJuYXRpdmVzOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIGRpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICAgICAgICAgICAgIC8vIGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKCQoXCIjZGlyZWN0aW9uc19wYW5lbFwiKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICRzY29wZS5vcmlnZW4gPSByZXNwb25zZS5yZXF1ZXN0Lm9yaWdpbjtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGVzdGlubyA9IHJlc3BvbnNlLnJlcXVlc3QuZGVzdGluYXRpb247XG4gICAgICAgICAgICAgICAgJHNjb3BlLmluZGljYWNpb25fZGV0YWxsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgJHNjb3BlLndhcm5pbmcgPSByZXNwb25zZS5yb3V0ZXNbMF0ud2FybmluZ3NbMF07XG4gICAgICAgICAgICAgICAgJHNjb3BlLmRpc3RhbmNpYSA9IHJlc3BvbnNlLnJvdXRlc1swXS5sZWdzWzBdLmRpc3RhbmNlLnRleHQ7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmR1cmFjaW9uID0gcmVzcG9uc2Uucm91dGVzWzBdLmxlZ3NbMF0uZHVyYXRpb24udGV4dDtcbiAgICAgICAgICAgICAgICAkc2NvcGUucnV0YV9nZW5lcmFsID0gcmVzcG9uc2Uucm91dGVzWzBdLnN1bW1hcnk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJ1dGFfZGV0YWxsZSA9IHJlc3BvbnNlLnJvdXRlc1swXS5sZWdzWzBdLnN0ZXBzO1xuICAgICAgICAgICAgICAgIC8vICRzY29wZS50aXR1bG8gPSAkKCcjZGV0YScpLmh0bWwocmVzcG9uc2Uucm91dGVzWzBdLmxlZ3NbMF0uc3RlcHNbMV0uaW5zdHJ1Y3Rpb25zKTtcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlLHN0YXR1cyk7XG4gICAgICAgICAgICAgICAgLy8gYWxlcnQoXCJUaGVyZSBpcyBubyBkaXJlY3Rpb25zIGF2YWlsYWJsZSBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyBcbiAgICB9XG5cbiAgICAkc2NvcGUuZ29fcG9zaXRpb24gPSBmdW5jdGlvbigpeyBcbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uKTtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgICAgICB2YXIgZW5kID0gJHNjb3BlLmRhdGFfbG9hZFszXS5kaXJlY2Npb247XG4gICAgICAgICAgICBpZighc3RhcnQgfHwgIWVuZCl7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJTdGFydCBhbmQgRW5kIGFkZHJlc3NlcyBhcmUgcmVxdWlyZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBlbmQsXG4gICAgICAgICAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNUcmF2ZWxNb2RlWydXQUxLSU5HJ10sXG4gICAgICAgICAgICAgICAgICAgIHVuaXRTeXN0ZW06IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNVbml0U3lzdGVtWydNRVRSSUMnXSxcbiAgICAgICAgICAgICAgICAgICAgcHJvdmlkZVJvdXRlQWx0ZXJuYXRpdmVzOiBmYWxzZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cykge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKCQoXCIjZGlyZWN0aW9uc19wYW5lbFwiKS5nZXQoMCkpO1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSxzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIlRoZXJlIGlzIG5vIGRpcmVjdGlvbnMgYXZhaWxhYmxlIGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkgXG4gICAgfVxuXG4gICAgLy8gRWxpbWluYSAxIHggMSBjYWRhIGRhdG8gcXVlIG5vIGVzdGEgZW4gZWwgcmFuZ29cbiAgICAkc2NvcGUuZGVsID0gZnVuY3Rpb24oaW5kZXgpeyAgXG4gICAgICAgICRzY29wZS5kYXRhX2xvYWQuc3BsaWNlKGluZGV4LDEpOyAgXG4gICAgfTtcbiAgICAkc2NvcGUuZGVsX3RlbXAgPSBmdW5jdGlvbihpbmRleCl7ICBcbiAgICAgICAgJHNjb3BlLmRhdGFfcmVhbC5zcGxpY2UoaW5kZXgsMSk7ICBcbiAgICB9O1xuICAgIC8vIEhhY2UgdW4gcmVjb3JyaWRvIGFsIGFycmF5IGRlIG1hcmNhZG9yZXNcbiAgICAkc2NvcGUuc2V0TWFwT25BbGwgPSBmdW5jdGlvbihtYXApIHtcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5uZXdfbWFya2VyLmxlbmd0aDsgaSsrKSB7IFxuICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbaV0uc2V0TWFwKG1hcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gbGltcGlhIHRvZG9zIGxvcyBtYXJjYWRvcmVzIGEgbnVsbFxuICAgICRzY29wZS5jbGVhck1hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnNldE1hcE9uQWxsKG51bGwpO1xuICAgIH1cbiAgICAvLyBmdW5jaW9uIGxsYW1hIGEgbGltcGlhciB0b2RvcyBsb3MgbWFyY2Fkb3Jlc1xuICAgICRzY29wZS5kZWxldGVNYXJrZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5jbGVhck1hcmtlcnMoKTtcbiAgICAgICAgJHNjb3BlLm5ld19tYXJrZXIgPSBbXTtcbiAgICB9IFxuXG4gICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3I9IGZ1bmN0aW9uKGJyb3dzZXJIYXNHZW9sb2NhdGlvbiwgaW5mb1dpbmRvdywgcG9zKSB7XG4gICAgICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KGJyb3dzZXJIYXNHZW9sb2NhdGlvbiA/XG4gICAgICAgICAgICAnRXJyb3I6IEVsIHNlcnZpY2lvIGRlIEdlb2xvY2FsaXphY2lvbiBGYWxsw7MuJyA6XG4gICAgICAgICAgICAnRXJyb3I6IFlvdXIgYnJvd3NlciBkb2VzblxcJ3Qgc3VwcG9ydCBnZW9sb2NhdGlvbi4nKTtcbiAgICB9IFxuXG4gICAgXG4gICAgXG4gICAgJHNjb3BlLmNyZWF0ZU1hcmtlciA9IGZ1bmN0aW9uKG1hcCkgeyAgXG4gICAgICAgIGlmKCRzY29wZS5kYXRhX2xvYWQgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmRhdGFfbG9hZC5sZW5ndGg7IGkrKykgeyAgXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFfdGVtcCA9ICRzY29wZS5kYXRhX2xvYWRbaV07IFxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSB7XG4gICAgICAgICAgICAgICAgICBsYXQ6IHBhcnNlRmxvYXQoZGF0YV90ZW1wLmxhdCksXG4gICAgICAgICAgICAgICAgICBsbmc6IHBhcnNlRmxvYXQoZGF0YV90ZW1wLmxuZylcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICBpZihkYXRhX3RlbXAuaWRfc2VydmljZXMgPT09IDEpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9iYW5jby1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNlIGlmKGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2NvbWlzYXJpYS1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyA9PT0gMyl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2hvc3BpdGFsLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZGF0YV90ZW1wLmlkX3NlcnZpY2VzID09PSA0KXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvYm9tYmVyb3MtY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiT2N1cnJpbyB1biBlcnJvciBpbmVzcGVyYWRvIGVuIGxvcyBJRCBcIitkYXRhX3RlbXAuaWRfc2VydmljZXMrXCIgZGUgRW50aWRhZGVzXCIpO1xuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCwgXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGljb246IGltYWdlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBkYXRhX3RlbXAuaWRfc2VydmljZXMsXG4gICAgICAgICAgICAgICAgICAgIGZvdG86IGRhdGFfdGVtcC5mb3RvLFxuICAgICAgICAgICAgICAgICAgICBub21icmVfZW1wcmVzYTogZGF0YV90ZW1wLm5vbWJyZV9lbXByZXNhLFxuICAgICAgICAgICAgICAgICAgICBkaXJlY2Npb246IGRhdGFfdGVtcC5kaXJlY2Npb25cblxuICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlci5wdXNoKG1hcmtlcik7IFxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5tYXJrZXJzX2hvdmVyKG1hcmtlcik7ICBcbiAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5vcGVuSW5mb1dpbmRvdyh0aGlzKTsgXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGFsZXJ0KCdPY3VycmlvIHVuIGVycm9yIGFsIGNhcmdhcicpO1xuXG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLm5ld19tYXJrZXIpO1xuICAgICAgICAvL2NpZXJyYSBlbCBpbmZvd2luZG93IHVuYSB2ZXogY2FtYmllXG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICB9IFxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlQm91bmNlKCkgeyBcbiAgICAgICAgLy8gbWFya2VyLnNldEFuaW1hdGlvbihnb29nbGUubWFwcy5BbmltYXRpb24uQk9VTkNFKTsgXG4gICAgfVxuICAgIFxuICAgIFxuICAgICRzY29wZS5tYXJrZXJzX2hvdmVyID0gZnVuY3Rpb24oZGF0YSl7IFxuICAgICAgICAkc2NvcGUucmV0dXJuX2xpc3QgPSB0cnVlO1xuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgICAgICRzY29wZS5zaG93X2RldGFpbF9tYXJrZXIoKTtcbiAgICAgICAgJHNjb3BlLmRldGFsbGUgPSBkYXRhOyBcbiAgICAgICAgLy8gY29uc29sZS5sb2coZGF0YSk7IFxuICAgICAgICB2YXIgcG9zID0ge307XG4gICAgICAgIHBvcy5sYXQgPSBkYXRhLnBvc2l0aW9uLmxhdCgpO1xuICAgICAgICBwb3MubG5nID0gZGF0YS5wb3NpdGlvbi5sbmcoKTtcbiAgICAgICAgLy8gaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHttYXA6IG1hcCxtYXhXaWR0aDogMjAwfSk7XG4gICAgICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTsgXG4gICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNlbnRlciBnbG9ib191YmljYWNpb25cIj4nLCBcbiAgICAgICAgICAgICAgICAnPGltZyB3aWR0aD1cIjEwMCVcIiBzcmM9XCInK2RhdGEuZm90bysnXCI+JyxcbiAgICAgICAgICAgICAgICAnPGg2PicrZGF0YS50aXRsZSsnPC9oNj4nLCBcbiAgICAgICAgICAgICAgICAnPHA+JytkYXRhLmRpcmVjY2lvbisnPC9wPicsIFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICBdLmpvaW4oJycpXG4gICAgICAgICk7IFxuICAgICAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzKCk7IFxuICAgICAgICBtYXAuc2V0Wm9vbSgxOCk7XG4gICAgICAgIG1hcC5wYW5Ubyhwb3MpO1xuICAgICAgICAkKCcjdWJpY2FjaW9uZXMnKS5hbmltYXRlKHtcbiAgICAgICAgICAgIHNjcm9sbFRvcDogJzBweCdcbiAgICAgICAgfSwgMCk7IFxuICAgICAgICAkKCcjdWJpY2FjaW9uZXMnKS5jc3MoJ2hlaWdodCcsJzEwMCUnKTtcblxuICAgIH0gXG5cbiAgICBcbiAgICAkc2NvcGUub3BlbkluZm9XaW5kb3cgPSBmdW5jdGlvbihtYXJrZXIpe1xuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7IFxuICAgICAgICBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe21hcDogbWFwLG1heFdpZHRoOiAyMDB9KTtcbiAgICAgICAgdmFyIHBvcyA9IG1hcmtlci5wb3NpdGlvbjsgXG4gICAgICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTsgXG4gICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNlbnRlciBnbG9ib191YmljYWNpb25cIj4nLCBcbiAgICAgICAgICAgICAgICAnPGltZyB3aWR0aD1cIjEwMCVcIiBzcmM9XCInK21hcmtlci5mb3RvKydcIj4nLFxuICAgICAgICAgICAgICAgICc8aDY+JyttYXJrZXIubm9tYnJlX2VtcHJlc2ErJzwvaDY+JywgXG4gICAgICAgICAgICAgICAgJzxwPicrbWFya2VyLmRpcmVjY2lvbisnPC9wPicsIFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICBdLmpvaW4oJycpXG4gICAgICAgICk7IFxuICAgICAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzKCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNldF9nb29nbGVfbWFwcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBpd091dGVyID0gJCgnLmdtLXN0eWxlLWl3Jyk7XG4gICAgICAgIHZhciBpd0Nsb3NlQnRuID0gaXdPdXRlci5uZXh0KCk7XG4gICAgICAgIHZhciBpd0JhY2tncm91bmQgPSBpd091dGVyLnByZXYoKTsgXG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSk7IFxuICAgICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoNCknKS5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pO1xuICAgICAgICAvLyBpd091dGVyLnBhcmVudCgpLnBhcmVudCgpLmNzcyh7bGVmdDogJzEwcHgnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnbGVmdDogNjBweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdsZWZ0OiA2MHB4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5maW5kKCdkaXYnKS5jaGlsZHJlbigpLmNzcyh7J2JveC1zaGFkb3cnOiAncmdiYSgwLCAwLCAwLCAwKSAwcHggMXB4IDZweCcsICd6LWluZGV4JyA6ICcxJ30pO1xuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5jaGlsZHJlbignOm50aC1jaGlsZCgxKScpLmZpbmQoJ2RpdicpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnaGVpZ2h0OiAyMXB4ICFpbXBvcnRhbnQ7Jysnd2lkdGg6IDEwcHggIWltcG9ydGFudDsnKydsZWZ0OiAtMTVweCAhaW1wb3J0YW50J30pO1xuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5jaGlsZHJlbignOm50aC1jaGlsZCgyKScpLmZpbmQoJ2RpdicpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnaGVpZ2h0OiAyNXB4ICFpbXBvcnRhbnQ7Jysnd2lkdGg6IDlweCAhaW1wb3J0YW50OycrJ2xlZnQ6IC0xNXB4ICFpbXBvcnRhbnQnfSk7XG4gICAgICAgIGl3Q2xvc2VCdG4uY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2hvd19tYXJrZXIgPSBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7IFxuICAgICAgICAkc2NvcGUuaGlkZV9zZWFyY2ggPSB0cnVlO1xuICAgICAgICAkc2NvcGUuYm90b25fc2VhcmNoX2dsb2JhbCA9IGZhbHNlO1xuICAgICAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmtlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyAgICAgbWFya2VyW2ldLnNldE1hcChudWxsKTtcbiAgICAgICAgLy8gfSAgXG4gICAgICAgIFxuICAgICAgICB2YXIgcG9zID0ge307XG4gICAgICAgIHBvcy5sYXQgPSBwYXJzZUZsb2F0KGRhdGEubGF0KTtcbiAgICAgICAgcG9zLmxuZyA9IHBhcnNlRmxvYXQoZGF0YS5sbmcpO1xuICAgICAgICBjb25zb2xlLmxvZyhwb3MpOyBcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IHRydWU7XG4gICAgICAgICRzY29wZS5kZXRhbGxlID0gZGF0YTtcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSBmYWxzZTtcbiAgICAgICAgLyogaGFjZSB6b29tIHkgcmVuZGVyaXphIGxhIHBvc2ljaW9uICovIFxuICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zLFxuICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLCBcbiAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsIFxuICAgICAgICAgICAgdHlwZTogZGF0YS5pZF9zZXJ2aWNlcyxcbiAgICAgICAgICAgIGZvdG86IGRhdGEuZm90byxcbiAgICAgICAgICAgIG5vbWJyZV9lbXByZXNhOiBkYXRhLm5vbWJyZV9lbXByZXNhLFxuICAgICAgICAgICAgZGlyZWNjaW9uOiBkYXRhLmRpcmVjY2lvbiBcbiAgICAgICAgfSk7ICBcbiAgICAgICAgXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgIH0sODAwKTtcbiAgICAgICAgbWFwLnNldFpvb20oMTcpO1xuICAgICAgICBtYXAucGFuVG8ocG9zKTsgXG4gICAgfTtcblxuICAgICRzY29wZS5zZWFyY2hfZ2xvYmFsID0gZnVuY3Rpb24oc2VhcmNoKXtcbiAgICAgICAgJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7IFxuICAgICAgICAkc2NvcGUuaGlkZV9zZWFyY2ggPSB0cnVlO1xuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7IFxuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7IFxuICAgICAgICAkc2NvcGUuYm90b25fc2VhcmNoX2dsb2JhbCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUubG9hZChzZWFyY2gsMTAsMSk7XG4gICAgICAgICRzY29wZS5jcmVhdGVNYXJrZXIobWFwKTtcblxuICAgIH1cbiAgICAkc2NvcGUucmV0dXJuID0gZnVuY3Rpb24oKXsgIFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7IFxuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCAgID0gdHJ1ZTsgIFxuICAgICAgICAkc2NvcGUucmV0dXJuX2xpc3QgPSBmYWxzZTsgXG4gICAgICAgICQoJyN1YmljYWNpb25lcycpLmNzcygnaGVpZ2h0JywnNjA1cHgnKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNvbW9fbGxlZ2FyID0gZnVuY3Rpb24obGF0LCBsbmcpeyBcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSAgICAgICAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5pbmRpY2FjaW9uX2RldGFsbGUgICA9IHRydWU7IFxuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCAgICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmhpZGVfc2VhcmNoICAgICAgICAgID0gdHJ1ZTsgXG4gICAgICAgICRzY29wZS5oZWFkZXJfc2VhcmNoICAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUucmV0dXJuX2xpc3QgICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmJvdG9uX3NlYXJjaF9nbG9iYWwgID0gZmFsc2U7ICBcbiAgICAgICAgLy8gbW9zdHJhciBlbCBoZWFkZXIgZGUgaW5kaWNhZG9yXG4gICAgICAgICRzY29wZS5pbnB1dF9lbmQgPSBsYXQrXCIsXCIrbG5nOyBcbiAgICAgICAgJHNjb3BlLmluZGljYWNpb25lcygpO1xuICAgICAgICB2YXIgZ2VvY29kaW5nID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24/bGF0bG5nPScgKyAkc2NvcGUuaW5wdXRfZW5kICsgJyZzZW5zb3I9ZmFsc2UnOyBcbiAgICAgICAgJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XG4gICAgICAgICAgICAkc2NvcGUudGV4dF9lbmQgPSBsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcblxuICAgICAgICB9KTsgXG5cbiAgICB9XG5cbiAgICAkc2NvcGUuc2hvd19kZXRhbGxlX2luZGljYWNpb25lcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5kZXRhbGxlX2Rpc3RhbmNpYSA9IHRydWU7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNob3dfbGlzdF9tYXJrZXIgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyAgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTsgICBcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXAsICdyZXNpemUnKTtcbiAgICAgICAgfSw1MDApO1xuICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgIH1cbiAgICAkc2NvcGUuc2hvd19kZXRhaWxfbWFya2VyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLnViaWNhY2lvbmVzJykuY3NzKCdwYWRkaW5nLXRvcCcsJzBweCcpO1xuICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgIFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gdHJ1ZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsID0gZmFsc2U7ICBcbiAgICB9XG5cbiAgICAkc2NvcGUuY2xvc2VfaW5kaWNhY2lvbiA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChudWxsKTtcbiAgICAgICAgJHNjb3BlLm1hcGEgICAgICAgICAgICAgICAgID0gJ2RldGFsbGUnO1xuICAgICAgICAkc2NvcGUuaW5wdXRfZW5kICAgICAgICAgICAgPSBcIlwiOyAgICBcbiAgICAgICAgJHNjb3BlLmhlYWRlcl9zZWFyY2ggICAgICAgID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmhpZGVfc2VhcmNoICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5pbmRpY2FjaW9uX2RldGFsbGUgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuYm90b25fc2VhcmNoX2dsb2JhbCAgPSBmYWxzZTsgIFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgICAgICAgICAgID0gdHJ1ZTtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXAsICdyZXNpemUnKTtcbiAgICAgICAgfSw1MDApO1xuICAgIH1cbiAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICd6b29tX2NoYW5nZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB6b29tID0gbWFwLmdldFpvb20oKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coem9vbSk7XG4gICAgICAgIC8vIGlmICh6b29tID09IDIxKSB7IG1hcmtlci5zZXRJY29uKG5ldyBnb29nbGUubWFwcy5NYXJrZXJJbWFnZSgnaW1hZ2VzL2ltZy5wbmcnLCBudWxsLCBudWxsLCBudWxsLCBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgxOTAwLCAxOTAwKSkpOyB9XG4gICAgfSk7IFxuICAgIC8vICRzY29wZS5saW1pdF9jaGFuZ2VkID0gZnVuY3Rpb24oaWQpeyBcbiAgICBcbiAgICAvLyB9XG4gICAgLy8gRVNURSBDT0RJR08gQ1JFQSBIT1NQSVRBTEVTXG4gICAgLy8gdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7IFxuICAgIC8vICRzY29wZS5jcmVhdGVfaG9zcGl0YWxlcyA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gICAgIFNlcnZpY2VzLmxvYWRfaG9zcGl0YWxlcygpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICAvLyAgICAgICAgICRzY29wZS50ZW1wX2RhdGEgPSBbXTtcbiAgICAvLyAgICAgICAgICRzY29wZS5yZXN1bHRzID0gcmVzcG9uc2UuZGF0YTsgXG4gICAgLy8gICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLnJlc3VsdHMsIGZ1bmN0aW9uKHZhbHVlKXtcblxuICAgIC8vICAgICAgICAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeyAnYWRkcmVzcyc6IHZhbHVlLmRpcmVjY2lvbn0sIGZ1bmN0aW9uIGdlb2NvZGVSZXN1bHQocmVzdWx0cywgc3RhdHVzKSB7IFxuICAgIC8vICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09ICdPSycpIHsgICAgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHRzWzBdKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHZhciBsYXQgPSByZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxhdDtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHZhciBsbmcgPSByZXN1bHRzWzBdLmdlb21ldHJ5LmxvY2F0aW9uLmxuZztcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hcmtlck9wdGlvbnMpO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBub21icmVfdGVtcCA6IFwiSE9TUElUQUwgXCIrdmFsdWUubm9tYnJlLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGlkX2ltYWdlIDogdXVpZC52NCgpLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIG5vbWJyZV9lbXByZXNhIDogdmFsdWUubm9tYnJlX2VtcHJlc2EsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWNjaW9uOiB2YWx1ZS5kaXJlY2Npb24sXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaG9yYXJpbzogJycsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgdGVsZWZvbm9fMTogdmFsdWUudGVsZWZvbm9fMSwgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVvOiB2YWx1ZS5jb3JyZW8sIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogbGF0LFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogbG5nLCBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBpZF9zZXJ2aWNlczogMyxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHZhbHVlLmxpbmtfd2ViXG5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzY29wZS50ZW1wX2RhdGEucHVzaChvYmopO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnRlbXBfZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vICRzY29wZS5ndWFyZGFyX2hvc3BpdGFsZXMob2JqKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIEVuIGNhc28gZGUgbm8gaGFiZXIgcmVzdWx0YWRvcyBvIHF1ZSBoYXlhIG9jdXJyaWRvIHVuIGVycm9yXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBsYW56YW1vcyB1biBtZW5zYWplIGNvbiBlbCBlcnJvclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJHZW9jb2Rpbmcgbm8gdHV2byDDqXhpdG8gZGViaWRvIGE6IFwiICsgc3RhdHVzKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgICAgICBcbiAgICAvLyAgICAgICAgIH0pIFxuICAgIC8vICAgICAgICAgLy8gJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTsgIFxuICAgIC8vICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfVxuICAgIC8vICRzY29wZS5ndWFyZGFyX2hvc3BpdGFsZXMgPSBmdW5jdGlvbiAoZGF0YSl7ICBcbiAgICAvLyAgICAgU2VydmljZXMuQ3JlYXRlKGRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgLy8gICAgICAgICAvLyAkc2NvcGUuaW5pdCgpO1xuICAgIC8vICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfTtcbiAgICAvLyAkc2NvcGUuY3JlYXRlX2hvc3BpdGFsZXMoKTtcbiAgICBcbn1dKTsgXG5tb2RlbC5kaXJlY3RpdmUoJ3Rvb2x0aXAnLCBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gb24gbW91c2VlbnRlclxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudG9vbHRpcCgnc2hvdycpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBvbiBtb3VzZWxlYXZlXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50b29sdGlwKCdoaWRlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbi8vIG1vZGVsLmZpbHRlcignc3RyTGltaXQnLCBbJyRmaWx0ZXInLCBmdW5jdGlvbigkZmlsdGVyKSB7XG4vLyAgICAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBsaW1pdCkge1xuLy8gICAgICAgaWYgKCEgaW5wdXQpIHJldHVybjtcbi8vICAgICAgIGlmIChpbnB1dC5sZW5ndGggPD0gbGltaXQpIHtcbi8vICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHJldHVybiAkZmlsdGVyKCdsaW1pdFRvJykoaW5wdXQsIGxpbWl0KSArICcuLi4nO1xuLy8gICAgfTtcbi8vIH1dKTtcblxufSkoKTtcblxuLyogXG4gICAgMS4gY3VhbmRvIGVsIHVzdWFyaW8gZXNjcmliYSBsZSBtdWVzdHJlIHVuIGxpc3RhZG8gZGUgZW50aWRhZGVzXG4gICAgMi4gY3VhbmRvIHNlIHViaWNhIG5vIGhheWEgbWFyY2Fkb3Jlc1xuICAgIDMuIGxpbWl0YWNpb25lczogdG9kb3MgbG9zIHVzdWFyaW9zIHRpZW5lbiBxdWUgY29udGFyIGNvbiB1biBzbWFydHBob25lIHF1ZSB0ZW5nYSBncHNcbiovIiwiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXIubW9kdWxlKCdTZXJ2aWNlcycsIFtdKVxuLmZhY3RvcnkoJ1NlcnZpY2VzJywgZnVuY3Rpb24oJGh0dHApIHtcbiAgICByZXR1cm4geyBcbiAgICAgICAgTG9hZDogZnVuY3Rpb24ocSxpZF9zZXJ2LHAscGFnZSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnM/bm9tYnJlPScrcSsnJmlkX3NlcnY9JytpZF9zZXJ2KycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIExvYWRfU2VydmljZXM6IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzP25vbWJyZT0nK3ErJyZwZXJfcGFnZT0nK3ArJyZwYWdlPScrcGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgTG9hZF9BbWlnb3M6IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL2FtaWdvcz9ub21icmU9JytxKycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIFVwZGF0ZV9pbWc6IGZ1bmN0aW9uKGlkLGRhdGEpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnB1dChiYXNlX3VybCArJy9hcGkvdjEvbG9jYXRpb25zLycraWQsZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxvYWRfaG9zcGl0YWxlczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly9ncnVwb2FpemVuLmNvbS9ob3NwaXRhbGVzLmpzb24nKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGFsbEJvbWJlcm9zOiBmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjLycraWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfbGltYV9jb21hbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIwNDAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfbGltYV9jb21wYTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2lhc0J5SWQvMjA0MDAwJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfY2FsbGFvX2NvbWFuOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DZEJ5SWQvMjA1MDAwJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfY2FsbGFvX2NvbXBhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMDUwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19saW1hX3N1cl9jb21hbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIyNDAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGJvbWJlcm9zX2xpbWFfc3VyX2NvbXBhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMjQwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGJvbWJlcm9zX2xpbWFfbm9ydGVfY29tYW46IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NkQnlJZC8yMjUwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19saW1hX25vcnRlX2NvbXBhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMjUwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9O1xufSk7IFxufSkoKTsiXX0=
