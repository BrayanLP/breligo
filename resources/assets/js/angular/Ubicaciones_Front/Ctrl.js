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