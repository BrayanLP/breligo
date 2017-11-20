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
    
    $scope.load = function(q,id_serv,p,page){
        if(q == undefined){ 
            q = "";
        }   
        Services.Load(q,id_serv,p,page).then(function (response) {
            $scope.data_load = response.data; 
            // $scope.temp.push($scope.data_load);  
            console.log($scope.data_load);
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
    var style = 
    [
        {
            "featureType": "administrative.land_parcel",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#f49935"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#fad959"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#a1cdfc"
                },
                {
                    "saturation": 30
                },
                {
                    "lightness": 49
                }
            ]
        }
    ]

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
            // console.log(places);
            var place = places[0];
            var radius = 15000;  
            if (places.length == 0) {
                return;
            }
 
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];
            $scope.data_temporal = [];
            $scope.data_load = [];

            var s = document.getElementById("array");
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
                service.getDetails({placeId: places[i].place_id}, function(place, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        return;
                    }
                    var obj = {
                        nombre: place.name, 
                        direccion: place.formatted_address,
                        telefonos:	place.international_phone_number,
                        link_web:	place.website,
                        correo	: null,
                        desc	: null,
                        Lat	:   place.geometry.location.lat(),
                        Long	:place.geometry.location.lng(),
                        abrev	: null,
                        codbom	: null,
                        fecha_fundacion	: null,
                        dr	: null,
                        cargo:	null,
                        codidenest: null,
                        ubigeo: null
                    }
                    if(place.opening_hours != undefined){
                        obj["horario"] =  place.opening_hours

                    }
                    else{
                        obj["horario"] =  null
                    }
                    $scope.data_temporal.push(obj);
                    // s.innerHTML = JSON.stringify($scope.data_temporal); 
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
                    url: '//localhost:8000/assets/app/images/banco.png', 
                    size: new google.maps.Size(30, 30),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0) ,
                    scaledSize: new google.maps.Size(30, 30)
                }; 
                place.icon_new = icon; 
            } 
            else if(
                value === 'police'
            ){
                var icon = { 
                    url: '//localhost:8000/assets/app/images/comisaria.png', 
                    size: new google.maps.Size(30, 30),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0) ,
                    scaledSize: new google.maps.Size(30, 30)
                };  
                place.icon_new = icon;
            }
            else if(
                value === 'hospital'
            ){
                var icon = { 
                    url: '//localhost:8000/assets/app/images/hospital.png', 
                    size: new google.maps.Size(30, 30),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0) ,
                    scaledSize: new google.maps.Size(30, 30)
                };  
                place.icon_new = icon;
            }
            else if(
                value === 'fire_station'
            ){
                var icon = { 
                    url: '//localhost:8000/assets/app/images/bomberos.png', 
                    size: new google.maps.Size(30, 30),  
                    origin: new google.maps.Point(0, 0), 
                    anchor: new google.maps.Point(0, 0) ,
                    scaledSize: new google.maps.Size(30, 30)
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
                // $scope.load_allBomberos();
                $scope.$digest();

                // $scope.cargar_marcadores();
            }, function() {   
                $scope.handleLocationError(true, infoWindow, map.getCenter());
            }); 
        } else { 
            $scope.handleLocationError(false, infoWindow, map.getCenter());

        }
         
    }
    $scope.locationMarkers = function(text,id_serv,per_page, page){
        $scope.load(text,id_serv,per_page,page);
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
            $scope.icon1 = "/assets/app/images/banco.png";
        }
        else if(id === 2){ 
            input.value = "comisarias"; 
            $scope.icon_2 = false;
            $scope.icon1 = "/assets/app/images/comisaria.png"; 
        }
        else if(id === 3){ 
            input.value = "hospitales"; 
            $scope.icon_3 = false;
            $scope.icon1 = "/assets/app/images/hospital.png"; 
        }
        else if(id === 4){
            input.value = "bomberos";
            $scope.icon_4 = false;
            $scope.icon1 = "/assets/app/images/bomberos.png";    
            // google.maps.event.addListener(map, 'bounds_changed',function(){
            
            // $scope.locationMarkers('',id,10,1);
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
        // $('#ubicaciones').css('height','605px');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1L0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlViaWNhY2lvbmVzX0Zyb250LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbnZhciBtb2RlbCA9IGFuZ3VsYXIubW9kdWxlKCdtb2RlbCcsIFxuICAgIFsnU2VydmljZXMnLFwibmdTYW5pdGl6ZVwiLFwiYW5ndWxhci11dWlkXCJdKTtcblxudmFyIHNlbGV0ZWRWYWx1ZSA9IDE1O1xuXG5tb2RlbC5jb250cm9sbGVyKCdDdHJsJywgXG4gICAgWyckc2NvcGUnLFxuICAgICckaHR0cCcsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnU2VydmljZXMnLCAgXG4gICAgJ3V1aWQnLFxuICAgIGZ1bmN0aW9uKFxuICAgICAgICAkc2NvcGUsXG4gICAgICAgICRodHRwLFxuICAgICAgICAkdGltZW91dCxcbiAgICAgICAgU2VydmljZXMsXG4gICAgICAgIHV1aWQpXG57ICBcbiAgICB2YXIgaHRtbCA9IGZ1bmN0aW9uKGlkKSB7IFxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnRlbXAgPSBbXTtcbiAgICAkc2NvcGUubmV3X21hcmtlciA9IFtdO1xuICAgICRzY29wZS5kYXRhX3JlYWwgPSBbXTtcbiAgICAkc2NvcGUuY2FudF9yb3dzID0gXCIxMFwiO1xuICAgICRzY29wZS5tYXBhID0gJ2Z1bGwnO1xuICAgICRzY29wZS5oZWFkZXJfc2VhcmNoID0gdHJ1ZTtcbiAgICBcbiAgICAkc2NvcGUubG9hZCA9IGZ1bmN0aW9uKHEsaWRfc2VydixwLHBhZ2Upe1xuICAgICAgICBpZihxID09IHVuZGVmaW5lZCl7IFxuICAgICAgICAgICAgcSA9IFwiXCI7XG4gICAgICAgIH0gICBcbiAgICAgICAgU2VydmljZXMuTG9hZChxLGlkX3NlcnYscCxwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZCA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgICAgLy8gJHNjb3BlLnRlbXAucHVzaCgkc2NvcGUuZGF0YV9sb2FkKTsgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZCk7XG4gICAgICAgICAgICAkc2NvcGUudG8gPSByZXNwb25zZS50bzsgXG4gICAgICAgICAgICAkc2NvcGUudG90YWwgPSByZXNwb25zZS50b3RhbDtcbiAgICAgICAgICAgICRzY29wZS5sYXN0X3BhZ2UgPSByZXNwb25zZS5sYXN0X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUuY3VycmVudF9wYWdlID0gcmVzcG9uc2UuY3VycmVudF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSByZXNwb25zZS5uZXh0X3BhZ2VfdXJsO1xuICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSByZXNwb25zZS5wcmV2X3BhZ2VfdXJsOyBcbiAgICAgICAgICAgIGlmKCRzY29wZS5wcmV2X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnByZXZfcGFnZV91cmwgPSAkc2NvcGUucHJldl9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZigkc2NvcGUubmV4dF9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gJHNjb3BlLm5leHRfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTsgXG4gICAgfTtcblxuICAgICRzY29wZS51cGRhdGVfZm90byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWQpO1xuICAgICAgICAkc2NvcGUudGVtcF9kYXRhID0gW107XG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZGF0YV9sb2FkLCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBmb3RvID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdHJlZXR2aWV3P3NpemU9NjA2eDQwMCZsb2NhdGlvbj0nK3ZhbHVlLmxhdCsnLCcrdmFsdWUubG5nKycmcGl0Y2g9LTAuNzYma2V5PUFJemFTeURTSkc4SmtOSjNpN3B5SFp6MWdDMVRZVlVpY20zQzNzRSc7XG4gICAgICAgICAgICAvLyB2YXIgaWQgPSB2YWx1ZS5pZDtcbiAgICAgICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICAgICAgZm90byA6IGZvdG8gXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICRzY29wZS50ZW1wX2RhdGEucHVzaChvYmopO1xuICAgICAgICAgICAgJHNjb3BlLnVwZGF0ZV9mdWxsKHZhbHVlLmlkLG9iaik7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh2YWx1ZS5pZCwgb2JqKTtcbiAgICAgICAgfSlcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVwZGF0ZV9mdWxsID0gZnVuY3Rpb24oaWQsZGF0YSl7IFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhpZCwgZGF0YSk7XG4gICAgICAgIFNlcnZpY2VzLlVwZGF0ZV9pbWcoaWQsZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIC8vICQoJyNlZGl0JykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgIC8vICRzY29wZS5pbml0KCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmxvYWRfc2VydmljZXMgPSBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgIGlmKHEgPT0gdW5kZWZpbmVkKXsgXG4gICAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfSAgXG4gICAgICAgIFNlcnZpY2VzLkxvYWRfU2VydmljZXMocSxwLHBhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YV9sb2FkX3NlcnZpY2VzID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkX3NlcnZpY2VzKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pOyBcbiAgICB9O1xuIFxuICAgICRzY29wZS5sb2FkX3NlcnZpY2VzKCcnLDEwLDEpO1xuIFxuICAgICRzY29wZS5sb2FkX2FtaWdvcyA9IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgaWYocSA9PSB1bmRlZmluZWQpeyBcbiAgICAgICAgICAgIHEgPSBcIlwiO1xuICAgICAgICB9ICBcbiAgICAgICAgU2VydmljZXMuTG9hZF9BbWlnb3MocSxwLHBhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuYW1pZ29zID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5hbWlnb3MpO1xuICAgICAgICAgICAgJHNjb3BlLnRvID0gcmVzcG9uc2UudG87IFxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDsgXG4gICAgICAgICAgICBpZigkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gJHNjb3BlLnByZXZfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9ICRzY29wZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTsgXG4gICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRfc2VydmljZXMpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7IFxuICAgIH07ICAgXG4gICAgXG4gICAgJHNjb3BlLmxvYWRfYW1pZ29zKCcnLDEwLDEpO1xuICAgIFxuICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gJHNjb3BlLmxvYWQoJycsMjAwLDEpO1xuICAgIH0gICBcbiAgICBcbiAgICAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7IFxuICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTtcbiAgICAkc2NvcGUuZGlzYWJsZV9idXR0b24gPSBmYWxzZTtcbiAgICB2YXIgbWFwLG1hcDIsbWFya2VyLHBsYWNlcyxhdXRvY29tcGxldGUsaW5mb1dpbmRvdztcbiAgICB2YXIgbWFya2VycyA9IFtdO1xuICAgIHZhciBjcmVhdGVfbWFya2VyID0gW107XG4gICAgdmFyIGNvdW50cnlSZXN0cmljdCA9IHsnY291bnRyeSc6ICdwZSd9O1xuICAgIHZhciBNQVJLRVJfUEFUSCA9ICdodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9pbWFnZXMvbWFya2VyX2dyZWVuJztcbiAgICB2YXIgaG9zdG5hbWVSZWdleHAgPSBuZXcgUmVnRXhwKCdeaHR0cHM/Oi8vLis/LycpO1xuICAgIC8vIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICBcbiAgICB2YXIgZGlyZWN0aW9uc0Rpc3BsYXkgPSBudWxsO1xuICAgIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG51bGw7IFxuICAgIC8vIHZhciBzdHlsZSA9IFt7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjMzE0NjZhXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6XCItMTNcIn0se1wibGlnaHRuZXNzXCI6XCI2XCJ9LHtcImdhbW1hXCI6XCIxLjgxXCJ9LHtcImNvbG9yXCI6XCIjYzljY2QxXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVsc1wiLFwic3R5bGVyc1wiOlt7XCJ3ZWlnaHRcIjpcIjEuODJcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHRcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib25cIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJsaWdodG5lc3NcIjpcIjNcIn0se1wiZ2FtbWFcIjpcIjAuMDBcIn0se1wic2F0dXJhdGlvblwiOlwiLTFcIn0se1wid2VpZ2h0XCI6XCIyLjMwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInBvaVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6LTEwMH0se1wibGlnaHRuZXNzXCI6NDV9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuaGlnaHdheVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJzaW1wbGlmaWVkXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5hcnRlcmlhbFwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy5pY29uXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInRyYW5zaXRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib25cIn0se1wic2F0dXJhdGlvblwiOlwiLTEwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ3YXRlclwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzUzNzVhY1wifSx7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19XTtcbiAgICB2YXIgc3R5bGUgPSBcbiAgICBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5sYW5kX3BhcmNlbFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlLm1hbl9tYWRlXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHNcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWRcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHNcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodG5lc3NcIjogMjBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXlcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiaHVlXCI6IFwiI2Y0OTkzNVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5oaWdod2F5XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJodWVcIjogXCIjZmFkOTU5XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmFydGVyaWFsXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmxvY2FsXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmxvY2FsXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwidHJhbnNpdFwiLFxuICAgICAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuICAgICAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImh1ZVwiOiBcIiNhMWNkZmNcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInNhdHVyYXRpb25cIjogMzBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJsaWdodG5lc3NcIjogNDlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdXG5cbiAgICBmdW5jdGlvbiBjbG9zZUluZm9XaW5kb3coKXtcbiAgICAgICAgLy8gaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7IFxuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgfSBcbiAgICBcbiAgICAkc2NvcGUuSW5jaWFsaXphY2lvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbGltYSA9IHtsYXQ6IC0xMS45ODc3NTE5LCBsbmc6IC03Ny4wOTA3MzN9O1xuICAgICAgICAvLyB7bGF0OiAtMTIuMDQ2NjI5LCBsbmc6IC03Ny4wMjE0MzM3fVxuXG4gICAgICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcGEnKSwge1xuICAgICAgICAgICAgY2VudGVyOiBsaW1hLFxuICAgICAgICAgICAgem9vbTogMTEsXG4gICAgICAgICAgICBtaW5ab29tOiA1LFxuICAgICAgICAgICAgc3R5bGVzIDogc3R5bGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyogcGVybWl0ZSBvY3VsdGFyIGVsIGluZm93aW5kb3cgKi9cbiAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7IFxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjbG9zZUluZm9XaW5kb3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuXG5cbiAgICAgICAgJHNjb3BlLmNhcmdhcl9tYXJjYWRvcmVzKCk7IFxuICAgICAgICBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoKTtcbiAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAkKCcjaW5wdXRfc3RhcnQnKS5mb2N1cyhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBtYXAuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICAgICAgICAgICAgYWRkTWFya2VyKGV2ZW50LmxhdExuZyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTsgIFxuXG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICAkc2NvcGUuY2FyZ2FyX21hcmNhZG9yZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRvY29tcGxldGVfc2VhcmNoJyk7XG4gICAgICAgIHZhciBzZWFyY2hCb3ggPSBuZXcgZ29vZ2xlLm1hcHMucGxhY2VzLlNlYXJjaEJveChpbnB1dCk7ICBcbiAgICAgICAgbWFwLmFkZExpc3RlbmVyKCdib3VuZHNfY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlYXJjaEJveC5zZXRCb3VuZHMobWFwLmdldEJvdW5kcygpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNlYXJjaEJveC5hZGRMaXN0ZW5lcigncGxhY2VzX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2UobWFwKTsgICAgICAgIFxuXG4gICAgICAgICAgICB2YXIgcGxhY2VzID0gc2VhcmNoQm94LmdldFBsYWNlcygpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2VzKTtcbiAgICAgICAgICAgIHZhciBwbGFjZSA9IHBsYWNlc1swXTtcbiAgICAgICAgICAgIHZhciByYWRpdXMgPSAxNTAwMDsgIFxuICAgICAgICAgICAgaWYgKHBsYWNlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiBcbiAgICAgICAgICAgIG1hcmtlcnMuZm9yRWFjaChmdW5jdGlvbihtYXJrZXIpIHtcbiAgICAgICAgICAgICAgICBtYXJrZXIuc2V0TWFwKG51bGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtYXJrZXJzID0gW107XG4gICAgICAgICAgICAkc2NvcGUuZGF0YV90ZW1wb3JhbCA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZCA9IFtdO1xuXG4gICAgICAgICAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJyYXlcIik7XG4gICAgICAgICAgICB2YXIgYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xuXG4gICAgICAgICAgICBpZihwbGFjZXMubGVuZ3RoID4gMSApe1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdlbnRyZScpO1xuICAgICAgICAgICAgICAgIC8vICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd19saXN0X21hcmtlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd19kZXRhaWxfbWFya2VyKCk7ICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZXMubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGxhY2VzLmxlbmd0aDsgaSsrKSB7ICBcbiAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldERldGFpbHMoe3BsYWNlSWQ6IHBsYWNlc1tpXS5wbGFjZV9pZH0sIGZ1bmN0aW9uKHBsYWNlLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyAhPT0gZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2VTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9tYnJlOiBwbGFjZS5uYW1lLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjY2lvbjogcGxhY2UuZm9ybWF0dGVkX2FkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWxlZm9ub3M6XHRwbGFjZS5pbnRlcm5hdGlvbmFsX3Bob25lX251bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmtfd2ViOlx0cGxhY2Uud2Vic2l0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcnJlb1x0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY1x0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgTGF0XHQ6ICAgcGxhY2UuZ2VvbWV0cnkubG9jYXRpb24ubGF0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICBMb25nXHQ6cGxhY2UuZ2VvbWV0cnkubG9jYXRpb24ubG5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBhYnJldlx0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kYm9tXHQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWNoYV9mdW5kYWNpb25cdDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyXHQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJnbzpcdG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RpZGVuZXN0OiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdWJpZ2VvOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYocGxhY2Uub3BlbmluZ19ob3VycyAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW1wiaG9yYXJpb1wiXSA9ICBwbGFjZS5vcGVuaW5nX2hvdXJzXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW1wiaG9yYXJpb1wiXSA9ICBudWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmRhdGFfdGVtcG9yYWwucHVzaChvYmopO1xuICAgICAgICAgICAgICAgICAgICAvLyBzLmlubmVySFRNTCA9IEpTT04uc3RyaW5naWZ5KCRzY29wZS5kYXRhX3RlbXBvcmFsKTsgXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1hcmtlcihwbGFjZSk7IFxuICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGluZm9XaW5kb3cuc2V0Q29udGVudChtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpbmZvV2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBidWlsZElXQ29udGVudChwbGFjZSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhZGRSZXN1bHQocGxhY2VzW2ldLCBpKTtcblxuICAgICAgICAgICAgICAgIGlmIChwbGFjZXNbaV0uZ2VvbWV0cnkudmlld3BvcnQpIHtcbiAgICAgICAgICAgICAgICAgIC8vIE9ubHkgZ2VvY29kZXMgaGF2ZSB2aWV3cG9ydC5cbiAgICAgICAgICAgICAgICAgIGJvdW5kcy51bmlvbihwbGFjZXNbaV0uZ2VvbWV0cnkudmlld3BvcnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBib3VuZHMuZXh0ZW5kKHBsYWNlc1tpXS5nZW9tZXRyeS5sb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcbiAgICAgICAgfSk7IFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGxiYWNrKHJlc3VsdHMsIHN0YXR1cykge1xuICAgICAgICBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5wbGFjZXMuUGxhY2VzU2VydmljZVN0YXR1cy5PSykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlTWFya2VyKHJlc3VsdHNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1hcmtlcihwbGFjZSkgeyBcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2UudHlwZXMpO1xuICAgICAgICBpZiAoIXBsYWNlLmdlb21ldHJ5KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJldHVybmVkIHBsYWNlIGNvbnRhaW5zIG5vIGdlb21ldHJ5XCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChwbGFjZS50eXBlcyxmdW5jdGlvbih2YWx1ZSAsIGkpe1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codmFsdWUpO1xuICAgICAgICAgICAgaWYoIFxuICAgICAgICAgICAgICAgIHZhbHVlID09PSAnYmFuaycgfHwgdmFsdWUgPT09ICdmaW5hbmNlJ1xuICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICB2YXIgaWNvbiA9IHsgXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvYmFuY28ucG5nJywgXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDMwLCAzMCksICBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSAsXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDMwLCAzMClcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICBwbGFjZS5pY29uX25ldyA9IGljb247IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGVsc2UgaWYoXG4gICAgICAgICAgICAgICAgdmFsdWUgPT09ICdwb2xpY2UnXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgIHZhciBpY29uID0geyBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9jb21pc2FyaWEucG5nJywgXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDMwLCAzMCksICBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSAsXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDMwLCAzMClcbiAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgcGxhY2UuaWNvbl9uZXcgPSBpY29uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PT0gJ2hvc3BpdGFsJ1xuICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICB2YXIgaWNvbiA9IHsgXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvaG9zcGl0YWwucG5nJywgXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDMwLCAzMCksICBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSAsXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDMwLCAzMClcbiAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgcGxhY2UuaWNvbl9uZXcgPSBpY29uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PT0gJ2ZpcmVfc3RhdGlvbidcbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgdmFyIGljb24gPSB7IFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2JvbWJlcm9zLnBuZycsIFxuICAgICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgzMCwgMzApLCAgXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCkgLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgzMCwgMzApXG4gICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgcGxhY2UuaWNvbl9uZXcgPSBpY29uOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiT2N1cnJpbyB1biBlcnJvciBpbmVzcGVyYWRvIGVuIGxvcyBJRCBkZSBFbnRpZGFkZXNcIik7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgXG4gICAgICAgIH0pXG4gICAgICAgIC8vcmdiKDQ5LCA3MCwgMTA2KSAjOWU5ZTllXG4gICAgICAgIC8vIHZhciBpY29uID0ge1xuICAgICAgICAvLyAgICAgdXJsOiBwbGFjZS5pY29uLFxuICAgICAgICAvLyAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSxcbiAgICAgICAgLy8gICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAvLyAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgIC8vICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApXG4gICAgICAgIC8vIH07IFxuICAgICAgICB2YXIgcG9zID0ge307XG4gICAgICAgIHBvcy5sYXQgPSBwbGFjZS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKTtcbiAgICAgICAgcG9zLmxuZyA9IHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uLmxuZygpO1xuICAgICAgICBpZiggcGxhY2UucGhvdG9zICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdmFyIGltZyA9IHBsYWNlLnBob3Rvc1swXS5nZXRVcmwoeydtYXhXaWR0aCc6IDQwMCwgJ21heEhlaWdodCc6IDQwMH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2YXIgaW1nID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdHJlZXR2aWV3P3NpemU9NjA2eDQwMCZsb2NhdGlvbj0nK3Bvcy5sYXQrJywnK3Bvcy5sbmcrJyZrZXk9QUl6YVN5RFNKRzhKa05KM2k3cHlIWnoxZ0MxVFlWVWljbTNDM3NFJ1xuICAgICAgICB9XG4gICAgICAgIGlmIChwbGFjZS5mb3JtYXR0ZWRfYWRkcmVzcykgeyBcbiAgICAgICAgICB2YXIgZGlyZWNjaW9uID0gcGxhY2UuZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgIH0gZWxzZSB7IFxuICAgICAgICB9XG4gICAgICAgIGlmIChwbGFjZS5yYXRpbmcpIHtcbiAgICAgICAgICAgIHZhciByYXRpbmdIdG1sID0gJyc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciByYWtpbmdfbnVtYmVyID0gcGxhY2UucmF0aW5nO1xuICAgICAgICAgICAgICAgIGlmIChwbGFjZS5yYXRpbmcgPCAoaSArIDAuNSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nSHRtbCArPSAnJiMxMDAyNTsnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjk7JztcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICBlbHNleyBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGFjZS53ZWJzaXRlKSB7XG4gICAgICAgICAgICB2YXIgZnVsbFVybCA9IHBsYWNlLndlYnNpdGU7XG4gICAgICAgICAgICB2YXIgd2Vic2l0ZSA9IGhvc3RuYW1lUmVnZXhwLmV4ZWMocGxhY2Uud2Vic2l0ZSk7XG4gICAgICAgICAgICBpZiAod2Vic2l0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHdlYnNpdGUgPSAgcGxhY2Uud2Vic2l0ZSArICcvJztcbiAgICAgICAgICAgICAgICBmdWxsVXJsID0gXCJXZWI6IDxhIGhyZWY9XCIrd2Vic2l0ZStcIiB0YXJnZXQ9J19ibGFuayc+XCIrd2Vic2l0ZStcIjwvYT5cIjtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZnVsbFVybCA9IFwiXCI7IFxuICAgICAgICB9XG4gICAgICAgIGlmKHBsYWNlLmZvcm1hdHRlZF9waG9uZV9udW1iZXIpe1xuICAgICAgICAgICAgdmFyIHRlbGVmb25vID0gcGxhY2UuZm9ybWF0dGVkX3Bob25lX251bWJlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgIH1cblxuICAgICAgICBpZihwbGFjZS5yZXZpZXdzKXsgXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goIHBsYWNlLnJldmlld3MsZnVuY3Rpb24odmFsdWUsail7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciByYXRpbmdIdG1sID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJha2luZ19udW1iZXIgPSB2YWx1ZS5yYXRpbmc7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5yYXRpbmcgPCAoaSArIDAuNSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjU7JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjk7JztcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUucmFraW5nID0gcmF0aW5nSHRtbDtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgYSBtYXJrZXIgZm9yIGVhY2ggcGxhY2UuXG4gICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgaWNvbjogcGxhY2UuaWNvbl9uZXcsXG4gICAgICAgICAgICB0aXRsZTogcGxhY2UubmFtZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICAgICAgZm90bzogaW1nLFxuICAgICAgICAgICAgZGlyZWNjaW9uOiBkaXJlY2Npb24sXG4gICAgICAgICAgICB1cmw6IGZ1bGxVcmwsXG4gICAgICAgICAgICByYWtpbmc6IHJhdGluZ0h0bWwsXG4gICAgICAgICAgICBudW1iZXJfciA6IHJha2luZ19udW1iZXIsXG4gICAgICAgICAgICB0ZWxlZm9ubzogdGVsZWZvbm8sXG4gICAgICAgICAgICBjb21lbnRhcmlvczogcGxhY2UucmV2aWV3c1xuICAgICAgICB9KTtcblxuICAgICAgICBtYXJrZXJzLnB1c2gobWFya2VyKTsgIFxuICAgICAgICAkc2NvcGUuZGF0YV9sb2FkLnB1c2gobWFya2VyKTtcbiAgICAgICAgJHNjb3BlLmRldGFsbGUgPSBtYXJrZXI7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRldGFsbGUpO1xuICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCl7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24obWFya2VyLnBvc2l0aW9uKTsgIFxuICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKG1hcCwgdGhpcyk7IFxuICAgICAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjZW50ZXIgZ2xvYm9fdWJpY2FjaW9uXCI+JywgXG4gICAgICAgICAgICAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrbWFya2VyLmZvdG8rJ1wiPicsXG4gICAgICAgICAgICAgICAgICAgICc8aDY+JyttYXJrZXIudGl0bGUrJzwvaDY+JywgIFxuICAgICAgICAgICAgICAgICAgICAnPHA+JyttYXJrZXIuZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgICAgICc8cD4gcmFua2luZzogJyttYXJrZXIucmFraW5nICsnICAnK21hcmtlci5udW1iZXJfcisnPC9wPicsICBcbiAgICAgICAgICAgICAgICAgICAgJzxwPicrbWFya2VyLnVybCsnPC9wPicsICAgXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAgICAgXS5qb2luKCcnKVxuICAgICAgICAgICAgKTsgXG4gICAgICAgICAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzKCk7ICBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkTWFya2VyKGxvY2F0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3JlYXRlX21hcmtlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNyZWF0ZV9tYXJrZXJbaV0pIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVfbWFya2VyW2ldLnNldE1hcChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjcmVhdGVfbWFya2VyID0gW107XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uLmxhdCgpLCBsb2NhdGlvbi5sbmcoKSk7XG4gICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXG4gICAgICAgICAgbWFwOiBtYXBcbiAgICAgICAgfSk7XG4gICAgICAgIGNyZWF0ZV9tYXJrZXIucHVzaChtYXJrZXIpO1xuICAgICAgICAkc2NvcGUuaW5wdXRfc3RhcnQgPSBsb2NhdGlvbi5sYXQoKStcIixcIitsb2NhdGlvbi5sbmcoKTtcbiAgICAgICAgdmFyIGxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobG9jYXRpb24ubGF0KCksbG9jYXRpb24ubG5nKCkpOyBcbiAgICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XG4gICAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeydsYXRMbmcnOiBsYXRsbmd9LCBmdW5jdGlvbihyZXN1bHRzLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1swXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHRzWzBdKTsgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50ZXh0X3N0YXJ0ID0gcmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzczsgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmRpY2FjaW9uZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYWxlcnQoJ05vIHJlc3VsdHMgZm91bmQnKTtcbiAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdHZW9jb2RlciBmYWlsZWQgZHVlIHRvOiAnICsgc3RhdHVzKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uUGxhY2VDaGFuZ2VkKHBsYWNlKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZSk7XG4gICAgICAgIGlmIChwbGFjZVswXS5nZW9tZXRyeSkge1xuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gcGxhY2VbMF0uZ2VvbWV0cnkubG9jYXRpb247XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbik7XG4gICAgICAgICAgICBtYXAucGFuVG8obG9jYXRpb24pO1xuICAgICAgICAgICAgbWFwLnNldFpvb20oMTUpO1xuICAgICAgICAgICAgLy8gY3JlYXRlTWFya2VyKHBsYWNlKTtcbiAgICAgICAgICAgIHNlYXJjaChsb2NhdGlvbik7XG4gICAgICAgIH0gIGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dG9jb21wbGV0ZV9zZWFyY2gnKS5wbGFjZWhvbGRlciA9ICdFbnRlciBhIGNpdHknO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2VhcmNoIGZvciBob3RlbHMgaW4gdGhlIHNlbGVjdGVkIGNpdHksIHdpdGhpbiB0aGUgdmlld3BvcnQgb2YgdGhlIG1hcC5cbiAgICBmdW5jdGlvbiBzZWFyY2gobG9jYXRpb24pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24pO1xuICAgICAgICB2YXIgcGxhY2VzID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlKG1hcCk7XG4gICAgICAgIHZhciBzZWFyY2ggPSB7IFxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgICAgICAgcmFkaXVzOiA1MDAsXG4gICAgICAgICAgICB0eXBlczogWydlc3RhYmxpc2htZW50J11cbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2UpO1xuICAgICAgICBwbGFjZXMubmVhcmJ5U2VhcmNoKHNlYXJjaCwgZnVuY3Rpb24ocmVzdWx0cywgc3RhdHVzKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHRzKTtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJSZXN1bHRzKCk7XG4gICAgICAgICAgICAgICAgY2xlYXJNYXJrZXJzKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1hcmtlcihyZXN1bHRzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5wbGFjZXMuUGxhY2VzU2VydmljZVN0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIG1hcmtlciBmb3IgZWFjaCBob3RlbCBmb3VuZCwgYW5kXG4gICAgICAgICAgICAgICAgLy8gYXNzaWduIGEgbGV0dGVyIG9mIHRoZSBhbHBoYWJldGljIHRvIGVhY2ggbWFya2VyIGljb24uXG4gICAgICAgICAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvLyB2YXIgbWFya2VyTGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZSgnQScuY2hhckNvZGVBdCgwKSArIChpICUgMjYpKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgbWFya2VySWNvbiA9IE1BUktFUl9QQVRIICsgbWFya2VyTGV0dGVyICsgJy5wbmcnO1xuICAgICAgICAgICAgICAgIC8vIFVzZSBtYXJrZXIgYW5pbWF0aW9uIHRvIGRyb3AgdGhlIGljb25zIGluY3JlbWVudGFsbHkgb24gdGhlIG1hcC5cbiAgICAgICAgICAgICAgICAvLyBtYXJrZXJzW2ldID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgLy8gICAgIHBvc2l0aW9uOiByZXN1bHRzW2ldLmdlb21ldHJ5LmxvY2F0aW9uLFxuICAgICAgICAgICAgICAgIC8vICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiBtYXJrZXJJY29uXG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgY2xpY2tzIGEgaG90ZWwgbWFya2VyLCBzaG93IHRoZSBkZXRhaWxzIG9mIHRoYXQgaG90ZWxcbiAgICAgICAgICAgICAgICAvLyBpbiBhbiBpbmZvIHdpbmRvdy5cbiAgICAgICAgICAgICAgICAvLyBtYXJrZXJzW2ldLnBsYWNlUmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgICAgICAvLyBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXJzW2ldLCAnY2xpY2snLCBzaG93SW5mb1dpbmRvdyk7XG4gICAgICAgICAgICAgICAgLy8gc2V0VGltZW91dChkcm9wTWFya2VyKGkpLCBpICogMTAwKTtcbiAgICAgICAgICAgICAgICAvLyBhZGRSZXN1bHQocmVzdWx0c1tpXSwgaSk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYWRkUmVzdWx0KHJlc3VsdCwgaSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICB2YXIgcmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyk7XG4gICAgICAgIHZhciBtYXJrZXJMZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCdBJy5jaGFyQ29kZUF0KDApICsgKGkgJSAyNikpO1xuICAgICAgICB2YXIgbWFya2VySWNvbiA9IE1BUktFUl9QQVRIICsgbWFya2VyTGV0dGVyICsgJy5wbmcnO1xuXG4gICAgICAgIHZhciB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIHRyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IChpICUgMiA9PT0gMCA/ICcjRjBGMEYwJyA6ICcjRkZGRkZGJyk7XG4gICAgICAgIHRyLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcmtlcnNbaV0sICdjbGljaycpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGljb25UZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICB2YXIgbmFtZVRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgIHZhciBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICBpY29uLnNyYyA9IG1hcmtlckljb247XG4gICAgICBpY29uLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncGxhY2VJY29uJyk7XG4gICAgICBpY29uLnNldEF0dHJpYnV0ZSgnY2xhc3NOYW1lJywgJ3BsYWNlSWNvbicpO1xuICAgICAgdmFyIG5hbWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXN1bHQubmFtZSk7XG4gICAgICBpY29uVGQuYXBwZW5kQ2hpbGQoaWNvbik7XG4gICAgICBuYW1lVGQuYXBwZW5kQ2hpbGQobmFtZSk7XG4gICAgICB0ci5hcHBlbmRDaGlsZChpY29uVGQpO1xuICAgICAgdHIuYXBwZW5kQ2hpbGQobmFtZVRkKTtcbiAgICAgIC8vIHJlc3VsdHMuYXBwZW5kQ2hpbGQodHIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkcm9wTWFya2VyKGkpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbWFya2Vyc1tpXS5zZXRNYXAobWFwKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYXJNYXJrZXJzKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChtYXJrZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgbWFya2Vyc1tpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWFya2VycyA9IFtdO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhclJlc3VsdHMoKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdHMnKTtcbiAgICAgICAgd2hpbGUgKHJlc3VsdHMuY2hpbGROb2Rlc1swXSkge1xuICAgICAgICAgICAgcmVzdWx0cy5yZW1vdmVDaGlsZChyZXN1bHRzLmNoaWxkTm9kZXNbMF0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNob3dJbmZvV2luZG93KCkge1xuICAgICAgICB2YXIgbWFya2VyID0gdGhpcztcbiAgICAgICAgcGxhY2VzLmdldERldGFpbHMoe3BsYWNlSWQ6IG1hcmtlci5wbGFjZVJlc3VsdC5wbGFjZV9pZH0sXG4gICAgICAgICAgICBmdW5jdGlvbihwbGFjZSwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyAhPT0gZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2VTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXJrZXIpO1xuICAgICAgICAgICAgICAgIC8vIGluZm9XaW5kb3cuc2V0Q29udGVudChtYXJrZXIpO1xuICAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICAgICAgYnVpbGRJV0NvbnRlbnQocGxhY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkSVdDb250ZW50KHBsYWNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBsYWNlKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LWljb24nKS5pbm5lckhUTUwgPSAnPGltZyBjbGFzcz1cImhvdGVsSWNvblwiICcgKyAnc3JjPVwiJyArIHBsYWNlLmljb24gKyAnXCIvPic7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy11cmwnKS5pbm5lckhUTUwgPSAnPGI+PGEgaHJlZj1cIicgKyBwbGFjZS51cmwgKyAnXCI+JyArIHBsYWNlLm5hbWUgKyAnPC9hPjwvYj4nO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctYWRkcmVzcycpLnRleHRDb250ZW50ID0gcGxhY2UudmljaW5pdHk7XG5cbiAgICAgICAgaWYgKHBsYWNlLmZvcm1hdHRlZF9waG9uZV9udW1iZXIpIHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcGhvbmUtcm93Jykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy1waG9uZScpLnRleHRDb250ZW50ID0gcGxhY2UuZm9ybWF0dGVkX3Bob25lX251bWJlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcGhvbmUtcm93Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFzc2lnbiBhIGZpdmUtc3RhciByYXRpbmcgdG8gdGhlIGhvdGVsLCB1c2luZyBhIGJsYWNrIHN0YXIgKCcmIzEwMDI5OycpXG4gICAgICAgIC8vIHRvIGluZGljYXRlIHRoZSByYXRpbmcgdGhlIGhvdGVsIGhhcyBlYXJuZWQsIGFuZCBhIHdoaXRlIHN0YXIgKCcmIzEwMDI1OycpXG4gICAgICAgIC8vIGZvciB0aGUgcmF0aW5nIHBvaW50cyBub3QgYWNoaWV2ZWQuXG4gICAgICAgIGlmIChwbGFjZS5yYXRpbmcpIHtcbiAgICAgICAgICB2YXIgcmF0aW5nSHRtbCA9ICcnO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocGxhY2UucmF0aW5nIDwgKGkgKyAwLjUpKSB7XG4gICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjU7JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjk7JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcmF0aW5nLXJvdycpLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcmF0aW5nJykuaW5uZXJIVE1MID0gcmF0aW5nSHRtbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXJhdGluZy1yb3cnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHJlZ2V4cCBpc29sYXRlcyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgVVJMIChkb21haW4gcGx1cyBzdWJkb21haW4pXG4gICAgICAgIC8vIHRvIGdpdmUgYSBzaG9ydCBVUkwgZm9yIGRpc3BsYXlpbmcgaW4gdGhlIGluZm8gd2luZG93LlxuICAgICAgICBpZiAocGxhY2Uud2Vic2l0ZSkge1xuICAgICAgICAgIHZhciBmdWxsVXJsID0gcGxhY2Uud2Vic2l0ZTtcbiAgICAgICAgICB2YXIgd2Vic2l0ZSA9IGhvc3RuYW1lUmVnZXhwLmV4ZWMocGxhY2Uud2Vic2l0ZSk7XG4gICAgICAgICAgaWYgKHdlYnNpdGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHdlYnNpdGUgPSAnaHR0cDovLycgKyBwbGFjZS53ZWJzaXRlICsgJy8nO1xuICAgICAgICAgICAgZnVsbFVybCA9IHdlYnNpdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy13ZWJzaXRlLXJvdycpLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctd2Vic2l0ZScpLnRleHRDb250ZW50ID0gd2Vic2l0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctd2Vic2l0ZS1yb3cnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLmluaXRNYXAgPSBmdW5jdGlvbigpIHsgXG4gICAgICAgIC8vICRzY29wZS4kd2F0Y2goJ3NlYXJjaF9lbnRpZGFkJywgZnVuY3Rpb24obil7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnNlYXJjaF9lbnRpZGFkICE9IHVuZGVmaW5lZCAmJiAkc2NvcGUuc2VhcmNoX2VudGlkYWQgIT0gJycpe1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkKCRzY29wZS5zZWFyY2hfZW50aWRhZCw1LDEpO1xuICAgICAgICAgICAgICAgIC8vICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWQoJycsJzAnLDEpOyBcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubWFwYSA9ICdmdWxsJzsgXG4gICAgICAgICAgICB9XG4gICAgICAgIC8vIH0pOyAgICAgICAgICAgXG4gICAgfVxuICAgICRzY29wZS5JbmNpYWxpemFjaW9uKCk7XG4gICAgLy8gJHNjb3BlLmluaXRNYXAoKTtcblxuICAgICRzY29wZS5yZXNpemUgPSBmdW5jdGlvbihtYXApe1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCAnYm91bmRzX2NoYW5nZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgICAgIHZhciBib3VuZHMgPSBtYXAuZ2V0Qm91bmRzKCk7XG4gICAgICAgIH0pO1xuICAgIH07IFxuXG4gICAgJHNjb3BlLmdldEtpbG9tZXRyb3MgPSBmdW5jdGlvbihsYXQxLGxvbjEsbGF0Mixsb24yKXtcbiAgICAgICAgZnVuY3Rpb24gcmFkKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogTWF0aC5QSS8xODA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIFIgPSA2Mzc4LjEzNzsgLy9SYWRpbyBkZSBsYSB0aWVycmEgZW4ga21cbiAgICAgICAgdmFyIGRMYXQgPSByYWQoIGxhdDIgLSBsYXQxICk7XG4gICAgICAgIHZhciBkTG9uZyA9IHJhZCggbG9uMiAtIGxvbjEgKTtcbiAgICAgICAgdmFyIGEgPSBNYXRoLnNpbihkTGF0LzIpICogTWF0aC5zaW4oZExhdC8yKSArIE1hdGguY29zKHJhZChsYXQxKSkgKiBNYXRoLmNvcyhyYWQobGF0MikpICogTWF0aC5zaW4oZExvbmcvMikgKiBNYXRoLnNpbihkTG9uZy8yKTtcbiAgICAgICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxLWEpKTtcbiAgICAgICAgdmFyIGQgPSBSICogYztcbiAgICAgICAgdmFyIHJlc3VsdCA9IGQudG9GaXhlZCgzKTsgXG4gICAgICAgIHJldHVybiByZXN1bHQ7IC8vUmV0b3JuYSB0cmVzIGRlY2ltYWxlc1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNaW5Gcm9tQXJyYXkgKGFycmF5X29mX3ZhbHVlcykge1xuICAgICAgICB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgYXJyYXlfb2ZfdmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIG1pbjsgICBcbiAgICB9O1xuXG4gICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIC8vICAgICBhbGVydChcImNsaWNrZWQgbWFya2VyXCIpO1xuICAgIC8vIH0pO1xuXG4gICAgXG4gICAgLy8gJHNjb3BlLmxvY2F0aW9uID0gZnVuY3Rpb24oKXsgIFxuICAgICAgICAvLyAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgICAgICAvLyAgICAgICAgIC8vIElOSVQgUkVTSVpFIFxuICAgICAgICAvLyAgICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuZGlzYWJsZV9idXR0b24gPSB0cnVlOyBcbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuZGF0YSA9IFtdO1xuXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLmluaXRNYXAoKTsgXG4gICAgICAgIC8vICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICAvLyAgICAgICAgIH0sNTAwKTtcbiAgICAgICAgLy8gICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7ICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAkc2NvcGUuY3JlYXRlTWFya2VyKG1hcCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICRzY29wZS5wb3NpY2lvbl9hY3R1YWwgPSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgbGF0OiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICAgIC8vICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgdmFyIGdlb2NvZGluZyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sYXQgKyAnLCcgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxuZyArICcmc2Vuc29yPWZhbHNlJztcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coZ2VvY29kaW5nKTtcblxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNTAsIDUwKSwgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCA0MClcbiAgICAgICAgLy8gICAgICAgICAgICAgfTsgXG4gICAgICAgIC8vICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZVxuICAgICAgICAvLyAgICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgY2lyY2xlID0gbmV3IGdvb2dsZS5tYXBzLkNpcmNsZSh7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBjZW50ZXI6ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICByYWRpdXM6IDEwMDAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogJyMzOTUyN2InLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogJyMzOTUyN2InLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgc3Ryb2tlT3BhY2l0eTogMC4yXG4gICAgICAgIC8vICAgICAgICAgICAgIH0pOyAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vICRzY29wZS5zZWFyY2hfZW50aWRhZCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgZm9yICh2YXIgaSA9ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpLS07KXsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpZihwYXJzZUZsb2F0KCAkc2NvcGUuZ2V0S2lsb21ldHJvcyggJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sYXQsICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nLCAkc2NvcGUuZGF0YV9sb2FkW2ldLmxhdCwgJHNjb3BlLmRhdGFfbG9hZFtpXS5sbmcpKSA8PSAxKXsgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YV9yZWFsLnB1c2goJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfcmVhbCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgYXJyYXkpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkgKycgZWwgbWluaW1vIGVzOiAnKyBtaW4pO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaSA9PSAwKXtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIHN0YXJ0ID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBlbmQgPSAkc2NvcGUuZGF0YV9sb2FkWzNdLmRpcmVjY2lvbjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGlmKCFzdGFydCB8fCAhZW5kKXtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBhbGVydChcIlN0YXJ0IGFuZCBFbmQgYWRkcmVzc2VzIGFyZSByZXF1aXJlZFwiKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm47XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgb3JpZ2luOiBzdGFydCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGVzdGluYXRpb246IGVuZCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1RyYXZlbE1vZGVbJ1dBTEtJTkcnXSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdW5pdFN5c3RlbTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1VuaXRTeXN0ZW1bJ01FVFJJQyddLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBwcm92aWRlUm91dGVBbHRlcm5hdGl2ZXM6IGZhbHNlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9O1xuXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRQYW5lbCgkKFwiI2RpcmVjdGlvbnNfcGFuZWxcIikuZ2V0KDApKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Usc3RhdHVzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYWxlcnQoXCJUaGVyZSBpcyBubyBkaXJlY3Rpb25zIGF2YWlsYWJsZSBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcIik7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGVsc2V7IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWwoJHNjb3BlLmRhdGFfbG9hZC5pbmRleE9mKCRzY29wZS5kYXRhX2xvYWRbaV0pKTsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbaV0uc2V0TWFwKG51bGwpOyAgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAvLyAgICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICBtYXAuc2V0Wm9vbSgxOCk7XG4gICAgICAgIC8vICAgICAgICAgICAgIG1hcC5wYW5UbyhtYXJrZXIucG9zaXRpb24pO1xuICAgICAgICAvLyAgICAgICAgICAgICBtYXAuZml0Qm91bmRzKGNpcmNsZS5nZXRCb3VuZHMoKSk7XG4gICAgICAgIC8vICAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKHRydWUsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG4gICAgICAgIC8vICAgICAgICAgfSk7IFxuICAgICAgICAvLyAgICAgfSBlbHNlIHsgXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IoZmFsc2UsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG5cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgIFxuICAgIC8vIH1cbiAgICB2YXIgYWxsX21lID0gW107XG4gICAgJHNjb3BlLmxvY2F0aW9uID0gZnVuY3Rpb24oKXsgXG4gICAgICAgICBcbiAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikgeyBcbiAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHsgICAgXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICRzY29wZS5wb3NpY2lvbl9hY3R1YWwgPSB7XG4gICAgICAgICAgICAgICAgICBsYXQ6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICAgIGxuZzogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZVxuICAgICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5wb3NpY2lvbl9hY3R1YWwpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsX21lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxfbWVbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbF9tZVtpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWxsX21lID0gW107IFxuICAgICAgICAgICAgICAgICRzY29wZS5pbnB1dF9zdGFydCA9ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubGF0K1wiLFwiKyRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nO1xuXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsIFxuICAgICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMClcblxuICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB2YXIgbWUgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZVxuICAgICAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgICAgICAgICBhbGxfbWUucHVzaChtZSk7IFxuXG4gICAgICAgICAgICAgICAgdmFyIGdlb2NvZGluZyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sYXQgKyAnLCcgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxuZyArICcmc2Vuc29yPWZhbHNlJzsgXG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikgeyBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRleHRfc3RhcnQgPSBsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzOyAgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgICAgICAgfSk7ICBcbiAgICAgICAgICAgICAgICBtYXAuc2V0Wm9vbSgxNik7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKG1lLnBvc2l0aW9uKTsgXG4gICAgICAgICAgICAgICAgJHNjb3BlLmluZGljYWNpb25lcygpO1xuICAgICAgICAgICAgICAgIC8vICRzY29wZS5sb2FkX2FsbEJvbWJlcm9zKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcblxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5jYXJnYXJfbWFyY2Fkb3JlcygpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAgXG4gICAgICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IodHJ1ZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcbiAgICAgICAgICAgIH0pOyBcbiAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcihmYWxzZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcblxuICAgICAgICB9XG4gICAgICAgICBcbiAgICB9XG4gICAgJHNjb3BlLmxvY2F0aW9uTWFya2VycyA9IGZ1bmN0aW9uKHRleHQsaWRfc2VydixwZXJfcGFnZSwgcGFnZSl7XG4gICAgICAgICRzY29wZS5sb2FkKHRleHQsaWRfc2VydixwZXJfcGFnZSxwYWdlKTtcbiAgICB9XG4gICAgLyogcGVybWl0ZSBtb3N0cmEgeSBvY3VsdGFyIGxvcyBtYXJjYWRvcmVzIHkgYWN0dWFsaXphciBlbCBsaXN0YWRvICovXG4gICAgJHNjb3BlLmljb25fdHJ1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5pY29uXzEgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaWNvbl8yID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmljb25fMyA9IHRydWU7XG4gICAgICAgICRzY29wZS5pY29uXzQgPSB0cnVlO1xuICAgIH1cbiAgICAkc2NvcGUuaWNvbl90cnVlKCk7XG5cbiAgICAkc2NvcGUudG9nZ2xlX01hcmtlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgJHNjb3BlLmljb25fdHJ1ZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChtYXJrZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgbWFya2Vyc1tpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWFya2VycyA9IFtdO1xuICAgICAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0b2NvbXBsZXRlX3NlYXJjaCcpO1xuICAgICAgICBpZiAoaWQgPT09IDEpIHtcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gXCJiYW5jb3NcIjsgIFxuICAgICAgICAgICAgJHNjb3BlLmljb25fMSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmljb24xID0gXCIvYXNzZXRzL2FwcC9pbWFnZXMvYmFuY28ucG5nXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihpZCA9PT0gMil7IFxuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBcImNvbWlzYXJpYXNcIjsgXG4gICAgICAgICAgICAkc2NvcGUuaWNvbl8yID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuaWNvbjEgPSBcIi9hc3NldHMvYXBwL2ltYWdlcy9jb21pc2FyaWEucG5nXCI7IFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoaWQgPT09IDMpeyBcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gXCJob3NwaXRhbGVzXCI7IFxuICAgICAgICAgICAgJHNjb3BlLmljb25fMyA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmljb24xID0gXCIvYXNzZXRzL2FwcC9pbWFnZXMvaG9zcGl0YWwucG5nXCI7IFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoaWQgPT09IDQpe1xuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBcImJvbWJlcm9zXCI7XG4gICAgICAgICAgICAkc2NvcGUuaWNvbl80ID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuaWNvbjEgPSBcIi9hc3NldHMvYXBwL2ltYWdlcy9ib21iZXJvcy5wbmdcIjsgICAgXG4gICAgICAgICAgICAvLyBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdib3VuZHNfY2hhbmdlZCcsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gJHNjb3BlLmxvY2F0aW9uTWFya2VycygnJyxpZCwxMCwxKTtcbiAgICAgICAgICAgIC8vIH0pOyAgXG4gICAgICAgICAgICAvLyAkc2NvcGUubGltaXRfY2hhbmdlZCg0KTsgXG4gICAgICAgIH1cbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihpbnB1dCwgJ2ZvY3VzJylcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihpbnB1dCwgJ2tleWRvd24nLCB7XG4gICAgICAgICAgICBrZXlDb2RlOiAxM1xuICAgICAgICB9KTsgICAgXG4gICAgfVxuICAgIC8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ2JvdW5kc19jaGFuZ2VkJywkc2NvcGUudG9nZ2xlX01hcmtlcihpZCkpO1xuICAgIC8vICRzY29wZS50b2dnbGVfTWFya2VyID0gZnVuY3Rpb24oaWQpeyBcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJJbmdyZXNvIGVsIElEOiBcIitpZCk7XG4gICAgLy8gICAgICRzY29wZS5pZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTs7XG4gICAgLy8gICAgICRzY29wZS5pZC5jaGVja2VkID0gISRzY29wZS5pZC5jaGVja2VkOyBcbiAgICAvLyAgICAgaWYoJCgnIycraWQpLmlzKCc6Y2hlY2tlZCcpKXtcbiAgICAvLyAgICAgICAgIGZvcih2YXIgaSA9ICRzY29wZS5kYXRhX3JlYWwubGVuZ3RoOyBpLS07KXsgXG4gICAgLy8gICAgICAgICAgICAgaWYoJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyA9PT0gaWQpeyAgXG4gICAgLy8gICAgICAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9ICcjJyskc2NvcGUuZGF0YV9yZWFsW2ldLmlkKyctJytpZDtcbiAgICAvLyAgICAgICAgICAgICAgICAgJCh2YXJpYWJsZSkuc2hvdygpO1xuICAgIC8vICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZGVsX3RlbXAoJHNjb3BlLmRhdGFfcmVhbC5pbmRleE9mKCRzY29wZS5kYXRhX3JlYWxbaV0pKTsgICBcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgZWxzZXtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpO1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpOyBcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm5ld19tYXJrZXIubGVuZ3RoOyBpKyspe1xuICAgIC8vICAgICAgICAgICAgIGlmKCRzY29wZS5uZXdfbWFya2VyW2ldLnR5cGUgPT09IGlkKXsgXG4gICAgLy8gICAgICAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyW2ldLnNldFZpc2libGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBlbHNle1xuICAgIC8vICAgICAgICAgZm9yKHZhciBpID0gJHNjb3BlLmRhdGFfcmVhbC5sZW5ndGg7IGktLTspeyBcbiAgICAvLyAgICAgICAgICAgICBpZigkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzID09PSBpZCl7IFxuICAgIC8vICAgICAgICAgICAgICAgICB2YXIgdmFyaWFibGUgPSAnIycrJHNjb3BlLmRhdGFfcmVhbFtpXS5pZCsnLScraWQ7XG4gICAgLy8gICAgICAgICAgICAgICAgICQodmFyaWFibGUpLmhpZGUoKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLmRlbF90ZW1wKCRzY29wZS5kYXRhX3JlYWwuaW5kZXhPZigkc2NvcGUuZGF0YV9yZWFsW2ldKSk7ICAgXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIGVsc2V7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PVwiKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyk7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PVwiKTsgXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8ICRzY29wZS5uZXdfbWFya2VyLmxlbmd0aDsgaisrKXtcbiAgICAvLyAgICAgICAgICAgICBpZigkc2NvcGUubmV3X21hcmtlcltqXS50eXBlID09PSBpZCl7IFxuICAgIC8vICAgICAgICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlcltqXS5zZXRWaXNpYmxlKGZhbHNlKTsgXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIGVsc2V7XG4gICAgLy8gICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLS0gbm8gc2UgZWxpbWlubyAtLTogXCIrJHNjb3BlLmRhdGFfcmVhbFtpXS5pZF9zZXJ2aWNlcyk7ICAgXG4gICAgLy8gICAgICAgICAgICAgfSBcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgfVxuICAgIC8vICAgICAvLyAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgIC8vIH1cblxuICAgICRzY29wZS5pbmRpY2FjaW9uZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgaWYoISRzY29wZS5pbnB1dF9zdGFydCB8fCAhJHNjb3BlLmlucHV0X2VuZCl7XG4gICAgICAgICAgICAvLyBhbGVydChcIlN0YXJ0IGFuZCBFbmQgYWRkcmVzc2VzIGFyZSByZXF1aXJlZFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICBvcmlnaW46ICRzY29wZS5pbnB1dF9zdGFydCxcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLmlucHV0X2VuZCxcbiAgICAgICAgICAgICAgICB0cmF2ZWxNb2RlOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVHJhdmVsTW9kZVsnRFJJVklORyddLFxuICAgICAgICAgICAgICAgIHVuaXRTeXN0ZW06IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNVbml0U3lzdGVtWydNRVRSSUMnXSxcbiAgICAgICAgICAgICAgICBwcm92aWRlUm91dGVBbHRlcm5hdGl2ZXM6IGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cykge1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0aW9uc0Rpc3BsYXkuc2V0UGFuZWwoJChcIiNkaXJlY3Rpb25zX3BhbmVsXCIpLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm9yaWdlbiA9IHJlc3BvbnNlLnJlcXVlc3Qub3JpZ2luO1xuICAgICAgICAgICAgICAgICRzY29wZS5kZXN0aW5vID0gcmVzcG9uc2UucmVxdWVzdC5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW5kaWNhY2lvbl9kZXRhbGxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUud2FybmluZyA9IHJlc3BvbnNlLnJvdXRlc1swXS53YXJuaW5nc1swXTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGlzdGFuY2lhID0gcmVzcG9uc2Uucm91dGVzWzBdLmxlZ3NbMF0uZGlzdGFuY2UudGV4dDtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZHVyYWNpb24gPSByZXNwb25zZS5yb3V0ZXNbMF0ubGVnc1swXS5kdXJhdGlvbi50ZXh0O1xuICAgICAgICAgICAgICAgICRzY29wZS5ydXRhX2dlbmVyYWwgPSByZXNwb25zZS5yb3V0ZXNbMF0uc3VtbWFyeTtcbiAgICAgICAgICAgICAgICAkc2NvcGUucnV0YV9kZXRhbGxlID0gcmVzcG9uc2Uucm91dGVzWzBdLmxlZ3NbMF0uc3RlcHM7XG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLnRpdHVsbyA9ICQoJyNkZXRhJykuaHRtbChyZXNwb25zZS5yb3V0ZXNbMF0ubGVnc1swXS5zdGVwc1sxXS5pbnN0cnVjdGlvbnMpO1xuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2Usc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAvLyBhbGVydChcIlRoZXJlIGlzIG5vIGRpcmVjdGlvbnMgYXZhaWxhYmxlIGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7IFxuICAgIH1cblxuICAgICRzY29wZS5nb19wb3NpdGlvbiA9IGZ1bmN0aW9uKCl7IFxuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9sb2FkW2ldKTtcbiAgICAgICAgJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24pO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgICAgIHZhciBlbmQgPSAkc2NvcGUuZGF0YV9sb2FkWzNdLmRpcmVjY2lvbjtcbiAgICAgICAgICAgIGlmKCFzdGFydCB8fCAhZW5kKXtcbiAgICAgICAgICAgICAgICBhbGVydChcIlN0YXJ0IGFuZCBFbmQgYWRkcmVzc2VzIGFyZSByZXF1aXJlZFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBzdGFydCxcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb246IGVuZCxcbiAgICAgICAgICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1RyYXZlbE1vZGVbJ1dBTEtJTkcnXSxcbiAgICAgICAgICAgICAgICAgICAgdW5pdFN5c3RlbTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1VuaXRTeXN0ZW1bJ01FVFJJQyddLFxuICAgICAgICAgICAgICAgICAgICBwcm92aWRlUm91dGVBbHRlcm5hdGl2ZXM6IGZhbHNlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRNYXAobWFwKTtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0UGFuZWwoJChcIiNkaXJlY3Rpb25zX3BhbmVsXCIpLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlLHN0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVGhlcmUgaXMgbm8gZGlyZWN0aW9ucyBhdmFpbGFibGUgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSBcbiAgICB9XG5cbiAgICAvLyBFbGltaW5hIDEgeCAxIGNhZGEgZGF0byBxdWUgbm8gZXN0YSBlbiBlbCByYW5nb1xuICAgICRzY29wZS5kZWwgPSBmdW5jdGlvbihpbmRleCl7ICBcbiAgICAgICAgJHNjb3BlLmRhdGFfbG9hZC5zcGxpY2UoaW5kZXgsMSk7ICBcbiAgICB9O1xuICAgICRzY29wZS5kZWxfdGVtcCA9IGZ1bmN0aW9uKGluZGV4KXsgIFxuICAgICAgICAkc2NvcGUuZGF0YV9yZWFsLnNwbGljZShpbmRleCwxKTsgIFxuICAgIH07XG4gICAgLy8gSGFjZSB1biByZWNvcnJpZG8gYWwgYXJyYXkgZGUgbWFyY2Fkb3Jlc1xuICAgICRzY29wZS5zZXRNYXBPbkFsbCA9IGZ1bmN0aW9uKG1hcCkge1xuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLm5ld19tYXJrZXIubGVuZ3RoOyBpKyspIHsgXG4gICAgICAgICAgICAkc2NvcGUubmV3X21hcmtlcltpXS5zZXRNYXAobWFwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBsaW1waWEgdG9kb3MgbG9zIG1hcmNhZG9yZXMgYSBudWxsXG4gICAgJHNjb3BlLmNsZWFyTWFya2VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuc2V0TWFwT25BbGwobnVsbCk7XG4gICAgfVxuICAgIC8vIGZ1bmNpb24gbGxhbWEgYSBsaW1waWFyIHRvZG9zIGxvcyBtYXJjYWRvcmVzXG4gICAgJHNjb3BlLmRlbGV0ZU1hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmNsZWFyTWFya2VycygpO1xuICAgICAgICAkc2NvcGUubmV3X21hcmtlciA9IFtdO1xuICAgIH0gXG5cbiAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcj0gZnVuY3Rpb24oYnJvd3Nlckhhc0dlb2xvY2F0aW9uLCBpbmZvV2luZG93LCBwb3MpIHtcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpO1xuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoYnJvd3Nlckhhc0dlb2xvY2F0aW9uID9cbiAgICAgICAgICAgICdFcnJvcjogRWwgc2VydmljaW8gZGUgR2VvbG9jYWxpemFjaW9uIEZhbGzDsy4nIDpcbiAgICAgICAgICAgICdFcnJvcjogWW91ciBicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IGdlb2xvY2F0aW9uLicpO1xuICAgIH0gXG5cbiAgICBcbiAgICBcbiAgICAkc2NvcGUuY3JlYXRlTWFya2VyID0gZnVuY3Rpb24obWFwKSB7ICBcbiAgICAgICAgaWYoJHNjb3BlLmRhdGFfbG9hZCAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZGF0YV9sb2FkLmxlbmd0aDsgaSsrKSB7ICBcbiAgICAgICAgICAgICAgICB2YXIgZGF0YV90ZW1wID0gJHNjb3BlLmRhdGFfbG9hZFtpXTsgXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IHtcbiAgICAgICAgICAgICAgICAgIGxhdDogcGFyc2VGbG9hdChkYXRhX3RlbXAubGF0KSxcbiAgICAgICAgICAgICAgICAgIGxuZzogcGFyc2VGbG9hdChkYXRhX3RlbXAubG5nKVxuICAgICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgIGlmKGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyA9PT0gMSl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2JhbmNvLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZGF0YV90ZW1wLmlkX3NlcnZpY2VzID09PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvY29taXNhcmlhLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoZGF0YV90ZW1wLmlkX3NlcnZpY2VzID09PSAzKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvaG9zcGl0YWwtY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihkYXRhX3RlbXAuaWRfc2VydmljZXMgPT09IDQpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9ib21iZXJvcy1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJPY3VycmlvIHVuIGVycm9yIGluZXNwZXJhZG8gZW4gbG9zIElEIFwiK2RhdGFfdGVtcC5pZF9zZXJ2aWNlcytcIiBkZSBFbnRpZGFkZXNcIik7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLCBcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogaW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyxcbiAgICAgICAgICAgICAgICAgICAgZm90bzogZGF0YV90ZW1wLmZvdG8sXG4gICAgICAgICAgICAgICAgICAgIG5vbWJyZV9lbXByZXNhOiBkYXRhX3RlbXAubm9tYnJlX2VtcHJlc2EsXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjY2lvbjogZGF0YV90ZW1wLmRpcmVjY2lvblxuXG4gICAgICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyLnB1c2gobWFya2VyKTsgXG4gICAgICAgICAgICAgICAgLy8gJHNjb3BlLm1hcmtlcnNfaG92ZXIobWFya2VyKTsgIFxuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm9wZW5JbmZvV2luZG93KHRoaXMpOyBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgYWxlcnQoJ09jdXJyaW8gdW4gZXJyb3IgYWwgY2FyZ2FyJyk7XG5cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZygkc2NvcGUubmV3X21hcmtlcik7XG4gICAgICAgIC8vY2llcnJhIGVsIGluZm93aW5kb3cgdW5hIHZleiBjYW1iaWVcbiAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgIH0gXG5cbiAgICBmdW5jdGlvbiB0b2dnbGVCb3VuY2UoKSB7IFxuICAgICAgICAvLyBtYXJrZXIuc2V0QW5pbWF0aW9uKGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5CT1VOQ0UpOyBcbiAgICB9XG4gICAgXG4gICAgXG4gICAgJHNjb3BlLm1hcmtlcnNfaG92ZXIgPSBmdW5jdGlvbihkYXRhKXsgXG4gICAgICAgICRzY29wZS5yZXR1cm5fbGlzdCA9IHRydWU7XG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWlsX21hcmtlcigpO1xuICAgICAgICAkc2NvcGUuZGV0YWxsZSA9IGRhdGE7IFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTsgXG4gICAgICAgIHZhciBwb3MgPSB7fTtcbiAgICAgICAgcG9zLmxhdCA9IGRhdGEucG9zaXRpb24ubGF0KCk7XG4gICAgICAgIHBvcy5sbmcgPSBkYXRhLnBvc2l0aW9uLmxuZygpO1xuICAgICAgICAvLyBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe21hcDogbWFwLG1heFdpZHRoOiAyMDB9KTtcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpOyBcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2VudGVyIGdsb2JvX3ViaWNhY2lvblwiPicsIFxuICAgICAgICAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrZGF0YS5mb3RvKydcIj4nLFxuICAgICAgICAgICAgICAgICc8aDY+JytkYXRhLnRpdGxlKyc8L2g2PicsIFxuICAgICAgICAgICAgICAgICc8cD4nK2RhdGEuZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIF0uam9pbignJylcbiAgICAgICAgKTsgXG4gICAgICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTsgXG4gICAgICAgIG1hcC5zZXRab29tKDE4KTtcbiAgICAgICAgbWFwLnBhblRvKHBvcyk7XG4gICAgICAgICQoJyN1YmljYWNpb25lcycpLmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiAnMHB4J1xuICAgICAgICB9LCAwKTsgXG4gICAgICAgICQoJyN1YmljYWNpb25lcycpLmNzcygnaGVpZ2h0JywnMTAwJScpO1xuXG4gICAgfSBcblxuICAgIFxuICAgICRzY29wZS5vcGVuSW5mb1dpbmRvdyA9IGZ1bmN0aW9uKG1hcmtlcil7XG4gICAgICAgIGluZm9XaW5kb3cuY2xvc2UoKTsgXG4gICAgICAgIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXAsbWF4V2lkdGg6IDIwMH0pO1xuICAgICAgICB2YXIgcG9zID0gbWFya2VyLnBvc2l0aW9uOyBcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRQb3NpdGlvbihwb3MpOyBcbiAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2VudGVyIGdsb2JvX3ViaWNhY2lvblwiPicsIFxuICAgICAgICAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrbWFya2VyLmZvdG8rJ1wiPicsXG4gICAgICAgICAgICAgICAgJzxoNj4nK21hcmtlci5ub21icmVfZW1wcmVzYSsnPC9oNj4nLCBcbiAgICAgICAgICAgICAgICAnPHA+JyttYXJrZXIuZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgIF0uam9pbignJylcbiAgICAgICAgKTsgXG4gICAgICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMoKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGl3T3V0ZXIgPSAkKCcuZ20tc3R5bGUtaXcnKTtcbiAgICAgICAgdmFyIGl3Q2xvc2VCdG4gPSBpd091dGVyLm5leHQoKTtcbiAgICAgICAgdmFyIGl3QmFja2dyb3VuZCA9IGl3T3V0ZXIucHJldigpOyBcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTsgXG4gICAgICAgIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCg0KScpLmNzcyh7J2Rpc3BsYXknIDogJ25vbmUnfSk7XG4gICAgICAgIC8vIGl3T3V0ZXIucGFyZW50KCkucGFyZW50KCkuY3NzKHtsZWZ0OiAnMTBweCd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdsZWZ0OiA2MHB4ICFpbXBvcnRhbnQ7J30pO1xuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMyknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDYwcHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmZpbmQoJ2RpdicpLmNoaWxkcmVuKCkuY3NzKHsnYm94LXNoYWRvdyc6ICdyZ2JhKDAsIDAsIDAsIDApIDBweCAxcHggNnB4JywgJ3otaW5kZXgnIDogJzEnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDEpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDIxcHggIWltcG9ydGFudDsnKyd3aWR0aDogMTBweCAhaW1wb3J0YW50OycrJ2xlZnQ6IC0xNXB4ICFpbXBvcnRhbnQnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDIpJykuZmluZCgnZGl2JykuYXR0cignc3R5bGUnLCBmdW5jdGlvbihpLHMpeyByZXR1cm4gcyArICdoZWlnaHQ6IDI1cHggIWltcG9ydGFudDsnKyd3aWR0aDogOXB4ICFpbXBvcnRhbnQ7JysnbGVmdDogLTE1cHggIWltcG9ydGFudCd9KTtcbiAgICAgICAgaXdDbG9zZUJ0bi5jc3MoeydkaXNwbGF5JzogJ25vbmUnfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaG93X21hcmtlciA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCA9IHRydWU7XG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsID0gZmFsc2U7XG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vICAgICBtYXJrZXJbaV0uc2V0TWFwKG51bGwpO1xuICAgICAgICAvLyB9ICBcbiAgICAgICAgXG4gICAgICAgIHZhciBwb3MgPSB7fTtcbiAgICAgICAgcG9zLmxhdCA9IHBhcnNlRmxvYXQoZGF0YS5sYXQpO1xuICAgICAgICBwb3MubG5nID0gcGFyc2VGbG9hdChkYXRhLmxuZyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHBvcyk7IFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmRldGFsbGUgPSBkYXRhO1xuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IGZhbHNlO1xuICAgICAgICAvKiBoYWNlIHpvb20geSByZW5kZXJpemEgbGEgcG9zaWNpb24gKi8gXG4gICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsIFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSwgXG4gICAgICAgICAgICB0eXBlOiBkYXRhLmlkX3NlcnZpY2VzLFxuICAgICAgICAgICAgZm90bzogZGF0YS5mb3RvLFxuICAgICAgICAgICAgbm9tYnJlX2VtcHJlc2E6IGRhdGEubm9tYnJlX2VtcHJlc2EsXG4gICAgICAgICAgICBkaXJlY2Npb246IGRhdGEuZGlyZWNjaW9uIFxuICAgICAgICB9KTsgIFxuICAgICAgICBcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcihtYXAsICdyZXNpemUnKTtcbiAgICAgICAgfSw4MDApO1xuICAgICAgICBtYXAuc2V0Wm9vbSgxNyk7XG4gICAgICAgIG1hcC5wYW5Ubyhwb3MpOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNlYXJjaF9nbG9iYWwgPSBmdW5jdGlvbihzZWFyY2gpe1xuICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCA9IHRydWU7XG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsID0gdHJ1ZTsgXG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5sb2FkKHNlYXJjaCwxMCwxKTtcbiAgICAgICAgJHNjb3BlLmNyZWF0ZU1hcmtlcihtYXApO1xuXG4gICAgfVxuICAgICRzY29wZS5yZXR1cm4gPSBmdW5jdGlvbigpeyAgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsICAgPSB0cnVlOyAgXG4gICAgICAgICRzY29wZS5yZXR1cm5fbGlzdCA9IGZhbHNlOyBcbiAgICAgICAgLy8gJCgnI3ViaWNhY2lvbmVzJykuY3NzKCdoZWlnaHQnLCc2MDVweCcpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY29tb19sbGVnYXIgPSBmdW5jdGlvbihsYXQsIGxuZyl7IFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmluZGljYWNpb25fZGV0YWxsZSAgID0gdHJ1ZTsgXG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsICAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaGlkZV9zZWFyY2ggICAgICAgICAgPSB0cnVlOyBcbiAgICAgICAgJHNjb3BlLmhlYWRlcl9zZWFyY2ggICAgICAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5yZXR1cm5fbGlzdCAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuYm90b25fc2VhcmNoX2dsb2JhbCAgPSBmYWxzZTsgIFxuICAgICAgICAvLyBtb3N0cmFyIGVsIGhlYWRlciBkZSBpbmRpY2Fkb3JcbiAgICAgICAgJHNjb3BlLmlucHV0X2VuZCA9IGxhdCtcIixcIitsbmc7IFxuICAgICAgICAkc2NvcGUuaW5kaWNhY2lvbmVzKCk7XG4gICAgICAgIHZhciBnZW9jb2RpbmcgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9JyArICRzY29wZS5pbnB1dF9lbmQgKyAnJnNlbnNvcj1mYWxzZSc7IFxuICAgICAgICAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcbiAgICAgICAgICAgICRzY29wZS50ZXh0X2VuZCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuXG4gICAgICAgIH0pOyBcblxuICAgIH1cblxuICAgICRzY29wZS5zaG93X2RldGFsbGVfaW5kaWNhY2lvbmVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLmRldGFsbGVfZGlzdGFuY2lhID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2hvd19saXN0X21hcmtlciA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7ICBcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlOyBcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlOyAgIFxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICB9LDUwMCk7XG4gICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgfVxuICAgICRzY29wZS5zaG93X2RldGFpbF9tYXJrZXIgPSBmdW5jdGlvbigpe1xuICAgICAgICAkKCcudWJpY2FjaW9uZXMnKS5jc3MoJ3BhZGRpbmctdG9wJywnMHB4Jyk7XG4gICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyAgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSB0cnVlOyBcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSBmYWxzZTsgIFxuICAgIH1cblxuICAgICRzY29wZS5jbG9zZV9pbmRpY2FjaW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG51bGwpO1xuICAgICAgICAkc2NvcGUubWFwYSAgICAgICAgICAgICAgICAgPSAnZGV0YWxsZSc7XG4gICAgICAgICRzY29wZS5pbnB1dF9lbmQgICAgICAgICAgICA9IFwiXCI7ICAgIFxuICAgICAgICAkc2NvcGUuaGVhZGVyX3NlYXJjaCAgICAgICAgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaGlkZV9zZWFyY2ggICAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmluZGljYWNpb25fZGV0YWxsZSAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsICA9IGZhbHNlOyAgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgICAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCAgICAgICAgICAgPSB0cnVlO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICB9LDUwMCk7XG4gICAgfVxuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcCwgJ3pvb21fY2hhbmdlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHpvb20gPSBtYXAuZ2V0Wm9vbSgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh6b29tKTtcbiAgICAgICAgLy8gaWYgKHpvb20gPT0gMjEpIHsgbWFya2VyLnNldEljb24obmV3IGdvb2dsZS5tYXBzLk1hcmtlckltYWdlKCdpbWFnZXMvaW1nLnBuZycsIG51bGwsIG51bGwsIG51bGwsIG5ldyBnb29nbGUubWFwcy5TaXplKDE5MDAsIDE5MDApKSk7IH1cbiAgICB9KTsgXG4gICAgLy8gJHNjb3BlLmxpbWl0X2NoYW5nZWQgPSBmdW5jdGlvbihpZCl7IFxuICAgIFxuICAgIC8vIH1cbiAgICAvLyBFU1RFIENPRElHTyBDUkVBIEhPU1BJVEFMRVNcbiAgICAvLyB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTsgXG4gICAgLy8gJHNjb3BlLmNyZWF0ZV9ob3NwaXRhbGVzID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgU2VydmljZXMubG9hZF9ob3NwaXRhbGVzKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgIC8vICAgICAgICAgJHNjb3BlLnRlbXBfZGF0YSA9IFtdO1xuICAgIC8vICAgICAgICAgJHNjb3BlLnJlc3VsdHMgPSByZXNwb25zZS5kYXRhOyBcbiAgICAvLyAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUucmVzdWx0cywgZnVuY3Rpb24odmFsdWUpe1xuXG4gICAgLy8gICAgICAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7ICdhZGRyZXNzJzogdmFsdWUuZGlyZWNjaW9ufSwgZnVuY3Rpb24gZ2VvY29kZVJlc3VsdChyZXN1bHRzLCBzdGF0dXMpIHsgXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gJ09LJykgeyAgICBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdHNbMF0pO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdmFyIGxhdCA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubGF0O1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgdmFyIGxuZyA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nO1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobWFya2VyT3B0aW9ucyk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIG5vbWJyZV90ZW1wIDogXCJIT1NQSVRBTCBcIit2YWx1ZS5ub21icmUsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWRfaW1hZ2UgOiB1dWlkLnY0KCksXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbm9tYnJlX2VtcHJlc2EgOiB2YWx1ZS5ub21icmVfZW1wcmVzYSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY2Npb246IHZhbHVlLmRpcmVjY2lvbixcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBob3JhcmlvOiAnJyxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB0ZWxlZm9ub18xOiB2YWx1ZS50ZWxlZm9ub18xLCBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBjb3JyZW86IHZhbHVlLmNvcnJlbywgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBsYXQsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbG5nOiBsbmcsIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3NlcnZpY2VzOiAzLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogdmFsdWUubGlua193ZWJcblxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRlbXBfZGF0YS5wdXNoKG9iaik7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUudGVtcF9kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gJHNjb3BlLmd1YXJkYXJfaG9zcGl0YWxlcyhvYmopO1xuICAgIC8vICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gRW4gY2FzbyBkZSBubyBoYWJlciByZXN1bHRhZG9zIG8gcXVlIGhheWEgb2N1cnJpZG8gdW4gZXJyb3JcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGxhbnphbW9zIHVuIG1lbnNhamUgY29uIGVsIGVycm9yXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBhbGVydChcIkdlb2NvZGluZyBubyB0dXZvIMOpeGl0byBkZWJpZG8gYTogXCIgKyBzdGF0dXMpO1xuICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgfSk7IFxuICAgICAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgfSkgXG4gICAgLy8gICAgICAgICAvLyAkc2NvcGUudGVtcC5wdXNoKCRzY29wZS5kYXRhX2xvYWQpOyAgXG4gICAgLy8gICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9XG4gICAgLy8gJHNjb3BlLmd1YXJkYXJfaG9zcGl0YWxlcyA9IGZ1bmN0aW9uIChkYXRhKXsgIFxuICAgIC8vICAgICBTZXJ2aWNlcy5DcmVhdGUoZGF0YSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAvLyAgICAgICAgIC8vICRzY29wZS5pbml0KCk7XG4gICAgLy8gICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICB9KTtcbiAgICAvLyB9O1xuICAgIC8vICRzY29wZS5jcmVhdGVfaG9zcGl0YWxlcygpO1xuICAgIFxufV0pOyBcbm1vZGVsLmRpcmVjdGl2ZSgndG9vbHRpcCcsIGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKXtcbiAgICAgICAgICAgICQoZWxlbWVudCkuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvLyBvbiBtb3VzZWVudGVyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS50b29sdGlwKCdzaG93Jyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIG9uIG1vdXNlbGVhdmVcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRvb2x0aXAoJ2hpZGUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn0pO1xuLy8gbW9kZWwuZmlsdGVyKCdzdHJMaW1pdCcsIFsnJGZpbHRlcicsIGZ1bmN0aW9uKCRmaWx0ZXIpIHtcbi8vICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQsIGxpbWl0KSB7XG4vLyAgICAgICBpZiAoISBpbnB1dCkgcmV0dXJuO1xuLy8gICAgICAgaWYgKGlucHV0Lmxlbmd0aCA8PSBsaW1pdCkge1xuLy8gICAgICAgICAgIHJldHVybiBpbnB1dDtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcmV0dXJuICRmaWx0ZXIoJ2xpbWl0VG8nKShpbnB1dCwgbGltaXQpICsgJy4uLic7XG4vLyAgICB9O1xuLy8gfV0pO1xuXG59KSgpO1xuXG4vKiBcbiAgICAxLiBjdWFuZG8gZWwgdXN1YXJpbyBlc2NyaWJhIGxlIG11ZXN0cmUgdW4gbGlzdGFkbyBkZSBlbnRpZGFkZXNcbiAgICAyLiBjdWFuZG8gc2UgdWJpY2Egbm8gaGF5YSBtYXJjYWRvcmVzXG4gICAgMy4gbGltaXRhY2lvbmVzOiB0b2RvcyBsb3MgdXN1YXJpb3MgdGllbmVuIHF1ZSBjb250YXIgY29uIHVuIHNtYXJ0cGhvbmUgcXVlIHRlbmdhIGdwc1xuKi8iLCIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xuYW5ndWxhci5tb2R1bGUoJ1NlcnZpY2VzJywgW10pXG4uZmFjdG9yeSgnU2VydmljZXMnLCBmdW5jdGlvbigkaHR0cCkge1xuICAgIHJldHVybiB7IFxuICAgICAgICBMb2FkOiBmdW5jdGlvbihxLGlkX3NlcnYscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucz9ub21icmU9JytxKycmaWRfc2Vydj0nK2lkX3NlcnYrJyZwZXJfcGFnZT0nK3ArJyZwYWdlPScrcGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgTG9hZF9TZXJ2aWNlczogZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlX3VybCArJy9hcGkvdjEvc2VydmljZXM/bm9tYnJlPScrcSsnJnBlcl9wYWdlPScrcCsnJnBhZ2U9JytwYWdlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7ICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBMb2FkX0FtaWdvczogZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldChiYXNlX3VybCArJy9hcGkvdjEvYW1pZ29zP25vbWJyZT0nK3ErJyZwZXJfcGFnZT0nK3ArJyZwYWdlPScrcGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgVXBkYXRlX2ltZzogZnVuY3Rpb24oaWQsZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZF9ob3NwaXRhbGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2dydXBvYWl6ZW4uY29tL2hvc3BpdGFsZXMuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYWxsQm9tYmVyb3M6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvJytpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19saW1hX2NvbWFuOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DZEJ5SWQvMjA0MDAwJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19saW1hX2NvbXBhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMDQwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19jYWxsYW9fY29tYW46IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NkQnlJZC8yMDUwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19jYWxsYW9fY29tcGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NpYXNCeUlkLzIwNTAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGJvbWJlcm9zX2xpbWFfc3VyX2NvbWFuOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DZEJ5SWQvMjI0MDAwJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfbGltYV9zdXJfY29tcGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NpYXNCeUlkLzIyNDAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfbGltYV9ub3J0ZV9jb21hbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIyNTAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGJvbWJlcm9zX2xpbWFfbm9ydGVfY29tcGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NpYXNCeUlkLzIyNTAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH07XG59KTsgXG59KSgpOyJdfQ==
