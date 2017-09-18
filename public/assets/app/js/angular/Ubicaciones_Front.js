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

    var obj = [
        {id: 'CdById/204000'},
        {id: 'CiasById/204000'},
        {id: 'CdById/205000'},
        {id: 'CiasById/205000'},
        {id: 'CdById/224000'},
        {id: 'CiasById/224000'},
        {id: 'CdById/225000'},
        {id: 'CiasById/225000'} 
    ];
    $scope.load_allBomberos = function(){
        // $scope.new_marker = [];
        // console.log(create_marker);
        var bounds = map.getBounds();
        var northEast = bounds.getNorthEast();
        var southWest = bounds.getSouthWest(); 

        for (var i = 0; i < create_marker.length; i++) {
            if (create_marker[i]) {
                create_marker[i].setMap(null);
            }
        }
        create_marker = [];
        
        for (var j = 0; j < obj.length; j++) {  
            Services.allBomberos(obj[j].id).then(function(response){
                $scope.result = response.data; 
                // console.log($scope.result);
                // console.log("=====================");
                
                // console.log(southWest.lat(),southWest.lng(), northEast.lat(), northEast.lng());
                // var rectangle = new google.maps.Rectangle({
                //     strokeColor: '#FF0000',
                //     strokeOpacity: 0.4,
                //     strokeWeight: 2,
                //     // fillColor: '#FF0000',
                //     fillOpacity: 0,
                //     map: map,
                //     bounds: {
                //         north: northEast.lat(),
                //         south: southWest.lat(),
                //         east: northEast.lng(),
                //         west: southWest.lng()
                //       }
                //   });
                // north :  norte
                // east :   este 
                // south :  sur
                // west :   oeste
                

                for (var i = 0; i < $scope.result.length; i++) {  
                    for (var x = 0; x < create_marker.length; x++) {
                        var element = x; 
                        if(
                            (parseFloat($scope.result[i].Lat) === create_marker[x].lat) &&
                            (parseFloat($scope.result[i].Long) === create_marker[x].lng)

                        ){
                            console.log("son iguales", $scope.result[i]);
                        } 
                        
                    } 
                    var lat = $scope.result[i].Lat;
                    var lng = $scope.result[i].Long;
                    if(
                        northEast.lat() >= lat && 
                        southWest.lat() <= lat && 
                        northEast.lng() >= lng && 
                        southWest.lng() <= lng
                    ){
                        var pos = {
                            lat: parseFloat(lat),
                            lng: parseFloat(lng)
                        }; 
                        // if()
                        marker = new google.maps.Marker({
                            position: pos,
                            map: map,
                            lat: pos.lat,
                            lng: pos.lng,
                            // animation: google.maps.Animation.DROP,
                            draggable: true 
                        }); 
                        create_marker.push(marker);  
                        
                    }    
                    else{  
                    }   
                }
                var markerCluster = new MarkerClusterer(
                    map, 
                    create_marker,
                    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                }); 
            })
        }
        
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkN0cmwuanMiLCJTZXJ2aWNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiVWJpY2FjaW9uZXNfRnJvbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuJ3VzZSBzdHJpY3QnO1xudmFyIG1vZGVsID0gYW5ndWxhci5tb2R1bGUoJ21vZGVsJywgXG4gICAgWydTZXJ2aWNlcycsXCJuZ1Nhbml0aXplXCIsXCJhbmd1bGFyLXV1aWRcIl0pO1xuXG52YXIgc2VsZXRlZFZhbHVlID0gMTU7XG5cbm1vZGVsLmNvbnRyb2xsZXIoJ0N0cmwnLCBcbiAgICBbJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAnJHRpbWVvdXQnLFxuICAgICdTZXJ2aWNlcycsICBcbiAgICAndXVpZCcsXG4gICAgZnVuY3Rpb24oXG4gICAgICAgICRzY29wZSxcbiAgICAgICAgJGh0dHAsXG4gICAgICAgICR0aW1lb3V0LFxuICAgICAgICBTZXJ2aWNlcyxcbiAgICAgICAgdXVpZClcbnsgIFxuICAgIHZhciBodG1sID0gZnVuY3Rpb24oaWQpIHsgXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7IFxuICAgIH07XG5cbiAgICAkc2NvcGUudGVtcCA9IFtdO1xuICAgICRzY29wZS5uZXdfbWFya2VyID0gW107XG4gICAgJHNjb3BlLmRhdGFfcmVhbCA9IFtdO1xuICAgICRzY29wZS5jYW50X3Jvd3MgPSBcIjEwXCI7XG4gICAgJHNjb3BlLm1hcGEgPSAnZnVsbCc7XG4gICAgJHNjb3BlLmhlYWRlcl9zZWFyY2ggPSB0cnVlO1xuICAgIFxuICAgICRzY29wZS5sb2FkID0gZnVuY3Rpb24ocSxwLHBhZ2Upe1xuICAgICAgICBpZihxID09IHVuZGVmaW5lZCl7IFxuICAgICAgICAgICAgcSA9IFwiXCI7XG4gICAgICAgIH0gICBcbiAgICAgICAgU2VydmljZXMuTG9hZChxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWQgPSByZXNwb25zZS5kYXRhOyBcbiAgICAgICAgICAgIC8vICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7ICBcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pOyBcbiAgICB9O1xuXG4gICAgJHNjb3BlLnVwZGF0ZV9mb3RvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZCk7XG4gICAgICAgICRzY29wZS50ZW1wX2RhdGEgPSBbXTtcbiAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5kYXRhX2xvYWQsIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGZvdG8gPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL3N0cmVldHZpZXc/c2l6ZT02MDZ4NDAwJmxvY2F0aW9uPScrdmFsdWUubGF0KycsJyt2YWx1ZS5sbmcrJyZwaXRjaD0tMC43NiZrZXk9QUl6YVN5RFNKRzhKa05KM2k3cHlIWnoxZ0MxVFlWVWljbTNDM3NFJztcbiAgICAgICAgICAgIC8vIHZhciBpZCA9IHZhbHVlLmlkO1xuICAgICAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgICAgICBmb3RvIDogZm90byBcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gJHNjb3BlLnRlbXBfZGF0YS5wdXNoKG9iaik7XG4gICAgICAgICAgICAkc2NvcGUudXBkYXRlX2Z1bGwodmFsdWUuaWQsb2JqKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbHVlLmlkLCBvYmopO1xuICAgICAgICB9KVxuICAgIH07XG5cbiAgICAkc2NvcGUudXBkYXRlX2Z1bGwgPSBmdW5jdGlvbihpZCxkYXRhKXsgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGlkLCBkYXRhKTtcbiAgICAgICAgU2VydmljZXMuVXBkYXRlX2ltZyhpZCxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgLy8gJCgnI2VkaXQnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgLy8gJHNjb3BlLmluaXQoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUubG9hZF9zZXJ2aWNlcyA9IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgaWYocSA9PSB1bmRlZmluZWQpeyBcbiAgICAgICAgICAgIHEgPSBcIlwiO1xuICAgICAgICB9ICBcbiAgICAgICAgU2VydmljZXMuTG9hZF9TZXJ2aWNlcyhxLHAscGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5kYXRhX2xvYWRfc2VydmljZXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgJHNjb3BlLnRvID0gcmVzcG9uc2UudG87IFxuICAgICAgICAgICAgJHNjb3BlLnRvdGFsID0gcmVzcG9uc2UudG90YWw7XG4gICAgICAgICAgICAkc2NvcGUubGFzdF9wYWdlID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRfcGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5uZXh0X3BhZ2VfdXJsID0gcmVzcG9uc2UubmV4dF9wYWdlX3VybDtcbiAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gcmVzcG9uc2UucHJldl9wYWdlX3VybDsgXG4gICAgICAgICAgICBpZigkc2NvcGUucHJldl9wYWdlX3VybCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICRzY29wZS5wcmV2X3BhZ2VfdXJsID0gJHNjb3BlLnByZXZfcGFnZV91cmwucmVwbGFjZShcIj9wYWdlPVwiLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoJHNjb3BlLm5leHRfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9ICRzY29wZS5uZXh0X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTsgXG4gICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRfc2VydmljZXMpO1xuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7IFxuICAgIH07XG5cbiAgICB2YXIgb2JqID0gW1xuICAgICAgICB7aWQ6ICdDZEJ5SWQvMjA0MDAwJ30sXG4gICAgICAgIHtpZDogJ0NpYXNCeUlkLzIwNDAwMCd9LFxuICAgICAgICB7aWQ6ICdDZEJ5SWQvMjA1MDAwJ30sXG4gICAgICAgIHtpZDogJ0NpYXNCeUlkLzIwNTAwMCd9LFxuICAgICAgICB7aWQ6ICdDZEJ5SWQvMjI0MDAwJ30sXG4gICAgICAgIHtpZDogJ0NpYXNCeUlkLzIyNDAwMCd9LFxuICAgICAgICB7aWQ6ICdDZEJ5SWQvMjI1MDAwJ30sXG4gICAgICAgIHtpZDogJ0NpYXNCeUlkLzIyNTAwMCd9IFxuICAgIF07XG4gICAgJHNjb3BlLmxvYWRfYWxsQm9tYmVyb3MgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyAkc2NvcGUubmV3X21hcmtlciA9IFtdO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhjcmVhdGVfbWFya2VyKTtcbiAgICAgICAgdmFyIGJvdW5kcyA9IG1hcC5nZXRCb3VuZHMoKTtcbiAgICAgICAgdmFyIG5vcnRoRWFzdCA9IGJvdW5kcy5nZXROb3J0aEVhc3QoKTtcbiAgICAgICAgdmFyIHNvdXRoV2VzdCA9IGJvdW5kcy5nZXRTb3V0aFdlc3QoKTsgXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjcmVhdGVfbWFya2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY3JlYXRlX21hcmtlcltpXSkge1xuICAgICAgICAgICAgICAgIGNyZWF0ZV9tYXJrZXJbaV0uc2V0TWFwKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNyZWF0ZV9tYXJrZXIgPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb2JqLmxlbmd0aDsgaisrKSB7ICBcbiAgICAgICAgICAgIFNlcnZpY2VzLmFsbEJvbWJlcm9zKG9ialtqXS5pZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJlc3VsdCA9IHJlc3BvbnNlLmRhdGE7IFxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5yZXN1bHQpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiPT09PT09PT09PT09PT09PT09PT09XCIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNvdXRoV2VzdC5sYXQoKSxzb3V0aFdlc3QubG5nKCksIG5vcnRoRWFzdC5sYXQoKSwgbm9ydGhFYXN0LmxuZygpKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgcmVjdGFuZ2xlID0gbmV3IGdvb2dsZS5tYXBzLlJlY3RhbmdsZSh7XG4gICAgICAgICAgICAgICAgLy8gICAgIHN0cm9rZUNvbG9yOiAnI0ZGMDAwMCcsXG4gICAgICAgICAgICAgICAgLy8gICAgIHN0cm9rZU9wYWNpdHk6IDAuNCxcbiAgICAgICAgICAgICAgICAvLyAgICAgc3Ryb2tlV2VpZ2h0OiAyLFxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBmaWxsQ29sb3I6ICcjRkYwMDAwJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgZmlsbE9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgLy8gICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgIC8vICAgICBib3VuZHM6IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIG5vcnRoOiBub3J0aEVhc3QubGF0KCksXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzb3V0aDogc291dGhXZXN0LmxhdCgpLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZWFzdDogbm9ydGhFYXN0LmxuZygpLFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgd2VzdDogc291dGhXZXN0LmxuZygpXG4gICAgICAgICAgICAgICAgLy8gICAgICAgfVxuICAgICAgICAgICAgICAgIC8vICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gbm9ydGggOiAgbm9ydGVcbiAgICAgICAgICAgICAgICAvLyBlYXN0IDogICBlc3RlIFxuICAgICAgICAgICAgICAgIC8vIHNvdXRoIDogIHN1clxuICAgICAgICAgICAgICAgIC8vIHdlc3QgOiAgIG9lc3RlXG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5yZXN1bHQubGVuZ3RoOyBpKyspIHsgIFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNyZWF0ZV9tYXJrZXIubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0geDsgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocGFyc2VGbG9hdCgkc2NvcGUucmVzdWx0W2ldLkxhdCkgPT09IGNyZWF0ZV9tYXJrZXJbeF0ubGF0KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChwYXJzZUZsb2F0KCRzY29wZS5yZXN1bHRbaV0uTG9uZykgPT09IGNyZWF0ZV9tYXJrZXJbeF0ubG5nKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic29uIGlndWFsZXNcIiwgJHNjb3BlLnJlc3VsdFtpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXQgPSAkc2NvcGUucmVzdWx0W2ldLkxhdDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxuZyA9ICRzY29wZS5yZXN1bHRbaV0uTG9uZztcbiAgICAgICAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgICAgICAgICBub3J0aEVhc3QubGF0KCkgPj0gbGF0ICYmIFxuICAgICAgICAgICAgICAgICAgICAgICAgc291dGhXZXN0LmxhdCgpIDw9IGxhdCAmJiBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcnRoRWFzdC5sbmcoKSA+PSBsbmcgJiYgXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3V0aFdlc3QubG5nKCkgPD0gbG5nXG4gICAgICAgICAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogcGFyc2VGbG9hdChsYXQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogcGFyc2VGbG9hdChsbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKClcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBwb3MubGF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogcG9zLmxuZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZV9tYXJrZXIucHVzaChtYXJrZXIpOyAgXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgZWxzZXsgIFxuICAgICAgICAgICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXJDbHVzdGVyID0gbmV3IE1hcmtlckNsdXN0ZXJlcihcbiAgICAgICAgICAgICAgICAgICAgbWFwLCBcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlX21hcmtlcixcbiAgICAgICAgICAgICAgICAgICAge2ltYWdlUGF0aDogJ2h0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L2V4YW1wbGVzL21hcmtlcmNsdXN0ZXJlci9tJ1xuICAgICAgICAgICAgICAgIH0pOyBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfTtcbiAgICAgXG4gICAgJHNjb3BlLmxvYWRfc2VydmljZXMoJycsMTAsMSk7XG5cblxuICAgIFxuICAgIFxuICAgICRzY29wZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gJHNjb3BlLmxvYWQoJycsMjAwLDEpO1xuICAgIH0gICBcbiAgICBcbiAgICAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7IFxuICAgICRzY29wZS5zaG93X2RldGFsbGUgPSBmYWxzZTtcbiAgICAkc2NvcGUuZGlzYWJsZV9idXR0b24gPSBmYWxzZTtcbiAgICB2YXIgbWFwLG1hcDIsbWFya2VyLHBsYWNlcyxhdXRvY29tcGxldGUsaW5mb1dpbmRvdztcbiAgICB2YXIgbWFya2VycyA9IFtdO1xuICAgIHZhciBjcmVhdGVfbWFya2VyID0gW107XG4gICAgdmFyIGNvdW50cnlSZXN0cmljdCA9IHsnY291bnRyeSc6ICdwZSd9O1xuICAgIHZhciBNQVJLRVJfUEFUSCA9ICdodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9pbWFnZXMvbWFya2VyX2dyZWVuJztcbiAgICB2YXIgaG9zdG5hbWVSZWdleHAgPSBuZXcgUmVnRXhwKCdeaHR0cHM/Oi8vLis/LycpO1xuICAgIC8vIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpOyBcbiAgICBcbiAgICB2YXIgZGlyZWN0aW9uc0Rpc3BsYXkgPSBudWxsO1xuICAgIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG51bGw7IFxuICAgIC8vIHZhciBzdHlsZSA9IFt7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmVcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMudGV4dC5maWxsXCIsXCJzdHlsZXJzXCI6W3tcImNvbG9yXCI6XCIjMzE0NjZhXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6XCItMTNcIn0se1wibGlnaHRuZXNzXCI6XCI2XCJ9LHtcImdhbW1hXCI6XCIxLjgxXCJ9LHtcImNvbG9yXCI6XCIjYzljY2QxXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVsc1wiLFwic3R5bGVyc1wiOlt7XCJ3ZWlnaHRcIjpcIjEuODJcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHRcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib25cIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwibGFuZHNjYXBlXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuZmlsbFwiLFwic3R5bGVyc1wiOlt7XCJsaWdodG5lc3NcIjpcIjNcIn0se1wiZ2FtbWFcIjpcIjAuMDBcIn0se1wic2F0dXJhdGlvblwiOlwiLTFcIn0se1wid2VpZ2h0XCI6XCIyLjMwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInBvaVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6LTEwMH0se1wibGlnaHRuZXNzXCI6NDV9LHtcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuaGlnaHdheVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJzaW1wbGlmaWVkXCJ9LHtcInNhdHVyYXRpb25cIjpcIi0xMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZC5hcnRlcmlhbFwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy5pY29uXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9mZlwifSx7XCJzYXR1cmF0aW9uXCI6XCItMTAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInRyYW5zaXRcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1widmlzaWJpbGl0eVwiOlwib25cIn0se1wic2F0dXJhdGlvblwiOlwiLTEwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJ3YXRlclwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiIzUzNzVhY1wifSx7XCJ2aXNpYmlsaXR5XCI6XCJvblwifV19XTtcbiAgICB2YXIgc3R5bGUgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZS5jb3VudHJ5XCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJodWVcIjogXCIjZmYwMDAwXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5hdHRyYWN0aW9uXCIsXG4gICAgICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJwb2kuYnVzaW5lc3NcIixcbiAgICAgICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcbiAgICAgICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICBmdW5jdGlvbiBjbG9zZUluZm9XaW5kb3coKXtcbiAgICAgICAgLy8gaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7IFxuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgfSBcbiAgICBcbiAgICAkc2NvcGUuSW5jaWFsaXphY2lvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbGltYSA9IHtsYXQ6IC0xMS45ODc3NTE5LCBsbmc6IC03Ny4wOTA3MzN9O1xuICAgICAgICAvLyB7bGF0OiAtMTIuMDQ2NjI5LCBsbmc6IC03Ny4wMjE0MzM3fVxuXG4gICAgICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcGEnKSwge1xuICAgICAgICAgICAgY2VudGVyOiBsaW1hLFxuICAgICAgICAgICAgem9vbTogMTEsXG4gICAgICAgICAgICBtaW5ab29tOiA1LFxuICAgICAgICAgICAgc3R5bGVzIDogc3R5bGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyogcGVybWl0ZSBvY3VsdGFyIGVsIGluZm93aW5kb3cgKi9cbiAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7IFxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjbG9zZUluZm9XaW5kb3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuXG5cbiAgICAgICAgJHNjb3BlLmNhcmdhcl9tYXJjYWRvcmVzKCk7IFxuICAgICAgICBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoKTtcbiAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAkKCcjaW5wdXRfc3RhcnQnKS5mb2N1cyhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBtYXAuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICAgICAgICAgICAgYWRkTWFya2VyKGV2ZW50LmxhdExuZyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTsgIFxuXG4gICAgICAgIFxuICAgIH1cbiAgICBcbiAgICAkc2NvcGUuY2FyZ2FyX21hcmNhZG9yZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgIHZhciBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhdXRvY29tcGxldGVfc2VhcmNoJyk7XG4gICAgICAgIHZhciBzZWFyY2hCb3ggPSBuZXcgZ29vZ2xlLm1hcHMucGxhY2VzLlNlYXJjaEJveChpbnB1dCk7ICBcbiAgICAgICAgbWFwLmFkZExpc3RlbmVyKCdib3VuZHNfY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlYXJjaEJveC5zZXRCb3VuZHMobWFwLmdldEJvdW5kcygpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNlYXJjaEJveC5hZGRMaXN0ZW5lcigncGxhY2VzX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2UobWFwKTsgICAgICAgIFxuXG4gICAgICAgICAgICB2YXIgcGxhY2VzID0gc2VhcmNoQm94LmdldFBsYWNlcygpO1xuICAgICAgICAgICAgdmFyIHBsYWNlID0gcGxhY2VzWzBdO1xuICAgICAgICAgICAgdmFyIHJhZGl1cyA9IDUwMDA7ICBcbiAgICAgICAgICAgIGlmIChwbGFjZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gXG4gICAgICAgICAgICBtYXJrZXJzLmZvckVhY2goZnVuY3Rpb24obWFya2VyKSB7XG4gICAgICAgICAgICAgICAgbWFya2VyLnNldE1hcChudWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWFya2VycyA9IFtdO1xuICAgICAgICAgICAgJHNjb3BlLmRhdGFfbG9hZCA9IFtdO1xuICAgICAgICAgICAgdmFyIGJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcblxuICAgICAgICAgICAgaWYocGxhY2VzLmxlbmd0aCA+IDEgKXtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZW50cmUnKTtcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgXG4gICAgICAgICAgICAgICAgJHNjb3BlLnNob3dfbGlzdF9tYXJrZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnNob3dfZGV0YWlsX21hcmtlcigpOyAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2VzLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBsYWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIHZhciBwbGFjZSA9IHBsYWNlc1tpXTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZXNbaV0ucGxhY2VfaWQpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlc1tpXSk7XG4gICAgICAgICAgICAgICAgc2VydmljZS5nZXREZXRhaWxzKHtwbGFjZUlkOiBwbGFjZXNbaV0ucGxhY2VfaWR9LCBmdW5jdGlvbihwbGFjZSwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgIT09IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2UpXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1hcmtlcihwbGFjZSk7IFxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpbmZvV2luZG93LnNldENvbnRlbnQobWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5mb1dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVpbGRJV0NvbnRlbnQocGxhY2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gYWRkUmVzdWx0KHBsYWNlc1tpXSwgaSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGxhY2VzW2ldLmdlb21ldHJ5LnZpZXdwb3J0KSB7XG4gICAgICAgICAgICAgICAgICAvLyBPbmx5IGdlb2NvZGVzIGhhdmUgdmlld3BvcnQuXG4gICAgICAgICAgICAgICAgICBib3VuZHMudW5pb24ocGxhY2VzW2ldLmdlb21ldHJ5LnZpZXdwb3J0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYm91bmRzLmV4dGVuZChwbGFjZXNbaV0uZ2VvbWV0cnkubG9jYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBtYXAuZml0Qm91bmRzKGJvdW5kcyk7XG4gICAgICAgIH0pOyBcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxsYmFjayhyZXN1bHRzLCBzdGF0dXMpIHtcbiAgICAgICAgaWYgKHN0YXR1cyA9PT0gZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2VTdGF0dXMuT0spIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNyZWF0ZU1hcmtlcihyZXN1bHRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVNYXJrZXIocGxhY2UpIHsgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYWNlLnR5cGVzKTtcbiAgICAgICAgaWYgKCFwbGFjZS5nZW9tZXRyeSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXR1cm5lZCBwbGFjZSBjb250YWlucyBubyBnZW9tZXRyeVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgIH1cblxuICAgICAgICBhbmd1bGFyLmZvckVhY2gocGxhY2UudHlwZXMsZnVuY3Rpb24odmFsdWUgLCBpKXtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgICAgIGlmKCBcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PT0gJ2JhbmsnIHx8IHZhbHVlID09PSAnZmluYW5jZSdcbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgdmFyIGljb24gPSB7IFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2JhbmNvLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICB9OyBcbiAgICAgICAgICAgICAgICBwbGFjZS5pY29uX25ldyA9IGljb247IFxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIGVsc2UgaWYoXG4gICAgICAgICAgICAgICAgdmFsdWUgPT09ICdwb2xpY2UnXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgIHZhciBpY29uID0geyBcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9jb21pc2FyaWEtY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgcGxhY2UuaWNvbl9uZXcgPSBpY29uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PT0gJ2hvc3BpdGFsJ1xuICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICB2YXIgaWNvbiA9IHsgXG4gICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvaG9zcGl0YWwtY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgcGxhY2UuaWNvbl9uZXcgPSBpY29uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihcbiAgICAgICAgICAgICAgICB2YWx1ZSA9PT0gJ2ZpcmVfc3RhdGlvbidcbiAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgdmFyIGljb24gPSB7IFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2JvbWJlcm9zLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgcGxhY2UuaWNvbl9uZXcgPSBpY29uOyBcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiT2N1cnJpbyB1biBlcnJvciBpbmVzcGVyYWRvIGVuIGxvcyBJRCBkZSBFbnRpZGFkZXNcIik7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgXG4gICAgICAgIH0pXG4gICAgICAgIC8vcmdiKDQ5LCA3MCwgMTA2KSAjOWU5ZTllXG4gICAgICAgIC8vIHZhciBpY29uID0ge1xuICAgICAgICAvLyAgICAgdXJsOiBwbGFjZS5pY29uLFxuICAgICAgICAvLyAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSxcbiAgICAgICAgLy8gICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAvLyAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgIC8vICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApXG4gICAgICAgIC8vIH07IFxuICAgICAgICB2YXIgcG9zID0ge307XG4gICAgICAgIHBvcy5sYXQgPSBwbGFjZS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKTtcbiAgICAgICAgcG9zLmxuZyA9IHBsYWNlLmdlb21ldHJ5LmxvY2F0aW9uLmxuZygpO1xuICAgICAgICBpZiggcGxhY2UucGhvdG9zICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgdmFyIGltZyA9IHBsYWNlLnBob3Rvc1swXS5nZXRVcmwoeydtYXhXaWR0aCc6IDQwMCwgJ21heEhlaWdodCc6IDQwMH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2YXIgaW1nID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9zdHJlZXR2aWV3P3NpemU9NjA2eDQwMCZsb2NhdGlvbj0nK3Bvcy5sYXQrJywnK3Bvcy5sbmcrJyZrZXk9QUl6YVN5RFNKRzhKa05KM2k3cHlIWnoxZ0MxVFlWVWljbTNDM3NFJ1xuICAgICAgICB9XG4gICAgICAgIGlmIChwbGFjZS5mb3JtYXR0ZWRfYWRkcmVzcykgeyBcbiAgICAgICAgICB2YXIgZGlyZWNjaW9uID0gcGxhY2UuZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgIH0gZWxzZSB7IFxuICAgICAgICB9XG4gICAgICAgIGlmIChwbGFjZS5yYXRpbmcpIHtcbiAgICAgICAgICAgIHZhciByYXRpbmdIdG1sID0gJyc7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDU7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciByYWtpbmdfbnVtYmVyID0gcGxhY2UucmF0aW5nO1xuICAgICAgICAgICAgICAgIGlmIChwbGFjZS5yYXRpbmcgPCAoaSArIDAuNSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nSHRtbCArPSAnJiMxMDAyNTsnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjk7JztcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICBlbHNleyBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGFjZS53ZWJzaXRlKSB7XG4gICAgICAgICAgICB2YXIgZnVsbFVybCA9IHBsYWNlLndlYnNpdGU7XG4gICAgICAgICAgICB2YXIgd2Vic2l0ZSA9IGhvc3RuYW1lUmVnZXhwLmV4ZWMocGxhY2Uud2Vic2l0ZSk7XG4gICAgICAgICAgICBpZiAod2Vic2l0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHdlYnNpdGUgPSAgcGxhY2Uud2Vic2l0ZSArICcvJztcbiAgICAgICAgICAgICAgICBmdWxsVXJsID0gXCJXZWI6IDxhIGhyZWY9XCIrd2Vic2l0ZStcIiB0YXJnZXQ9J19ibGFuayc+XCIrd2Vic2l0ZStcIjwvYT5cIjtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZnVsbFVybCA9IFwiXCI7IFxuICAgICAgICB9XG4gICAgICAgIGlmKHBsYWNlLmZvcm1hdHRlZF9waG9uZV9udW1iZXIpe1xuICAgICAgICAgICAgdmFyIHRlbGVmb25vID0gcGxhY2UuZm9ybWF0dGVkX3Bob25lX251bWJlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuXG4gICAgICAgIH1cblxuICAgICAgICBpZihwbGFjZS5yZXZpZXdzKXsgXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goIHBsYWNlLnJldmlld3MsZnVuY3Rpb24odmFsdWUsail7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciByYXRpbmdIdG1sID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJha2luZ19udW1iZXIgPSB2YWx1ZS5yYXRpbmc7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5yYXRpbmcgPCAoaSArIDAuNSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjU7JztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjk7JztcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFsdWUucmFraW5nID0gcmF0aW5nSHRtbDtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgYSBtYXJrZXIgZm9yIGVhY2ggcGxhY2UuXG4gICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgaWNvbjogcGxhY2UuaWNvbl9uZXcsXG4gICAgICAgICAgICB0aXRsZTogcGxhY2UubmFtZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3MsXG4gICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICAgICAgZm90bzogaW1nLFxuICAgICAgICAgICAgZGlyZWNjaW9uOiBkaXJlY2Npb24sXG4gICAgICAgICAgICB1cmw6IGZ1bGxVcmwsXG4gICAgICAgICAgICByYWtpbmc6IHJhdGluZ0h0bWwsXG4gICAgICAgICAgICBudW1iZXJfciA6IHJha2luZ19udW1iZXIsXG4gICAgICAgICAgICB0ZWxlZm9ubzogdGVsZWZvbm8sXG4gICAgICAgICAgICBjb21lbnRhcmlvczogcGxhY2UucmV2aWV3c1xuICAgICAgICB9KTtcblxuICAgICAgICBtYXJrZXJzLnB1c2gobWFya2VyKTsgIFxuICAgICAgICAkc2NvcGUuZGF0YV9sb2FkLnB1c2gobWFya2VyKTtcbiAgICAgICAgJHNjb3BlLmRldGFsbGUgPSBtYXJrZXI7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRldGFsbGUpO1xuICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCl7IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24obWFya2VyLnBvc2l0aW9uKTsgIFxuICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKG1hcCwgdGhpcyk7IFxuICAgICAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjZW50ZXIgZ2xvYm9fdWJpY2FjaW9uXCI+JywgXG4gICAgICAgICAgICAgICAgICAgICc8aW1nIHdpZHRoPVwiMTAwJVwiIHNyYz1cIicrbWFya2VyLmZvdG8rJ1wiPicsXG4gICAgICAgICAgICAgICAgICAgICc8aDY+JyttYXJrZXIudGl0bGUrJzwvaDY+JywgIFxuICAgICAgICAgICAgICAgICAgICAnPHA+JyttYXJrZXIuZGlyZWNjaW9uKyc8L3A+JywgXG4gICAgICAgICAgICAgICAgICAgICc8cD4gcmFua2luZzogJyttYXJrZXIucmFraW5nICsnICAnK21hcmtlci5udW1iZXJfcisnPC9wPicsICBcbiAgICAgICAgICAgICAgICAgICAgJzxwPicrbWFya2VyLnVybCsnPC9wPicsICAgXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgICAgICAgICAgXS5qb2luKCcnKVxuICAgICAgICAgICAgKTsgXG4gICAgICAgICAgICAkc2NvcGUuc2V0X2dvb2dsZV9tYXBzKCk7ICBcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkTWFya2VyKGxvY2F0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3JlYXRlX21hcmtlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNyZWF0ZV9tYXJrZXJbaV0pIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVfbWFya2VyW2ldLnNldE1hcChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjcmVhdGVfbWFya2VyID0gW107XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uLmxhdCgpLCBsb2NhdGlvbi5sbmcoKSk7XG4gICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXG4gICAgICAgICAgbWFwOiBtYXBcbiAgICAgICAgfSk7XG4gICAgICAgIGNyZWF0ZV9tYXJrZXIucHVzaChtYXJrZXIpO1xuICAgICAgICAkc2NvcGUuaW5wdXRfc3RhcnQgPSBsb2NhdGlvbi5sYXQoKStcIixcIitsb2NhdGlvbi5sbmcoKTtcbiAgICAgICAgdmFyIGxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobG9jYXRpb24ubGF0KCksbG9jYXRpb24ubG5nKCkpOyBcbiAgICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XG4gICAgICAgIGdlb2NvZGVyLmdlb2NvZGUoeydsYXRMbmcnOiBsYXRsbmd9LCBmdW5jdGlvbihyZXN1bHRzLCBzdGF0dXMpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1swXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHRzWzBdKTsgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS50ZXh0X3N0YXJ0ID0gcmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzczsgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmRpY2FjaW9uZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYWxlcnQoJ05vIHJlc3VsdHMgZm91bmQnKTtcbiAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdHZW9jb2RlciBmYWlsZWQgZHVlIHRvOiAnICsgc3RhdHVzKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uUGxhY2VDaGFuZ2VkKHBsYWNlKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGFjZSk7XG4gICAgICAgIGlmIChwbGFjZVswXS5nZW9tZXRyeSkge1xuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gcGxhY2VbMF0uZ2VvbWV0cnkubG9jYXRpb247XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbik7XG4gICAgICAgICAgICBtYXAucGFuVG8obG9jYXRpb24pO1xuICAgICAgICAgICAgbWFwLnNldFpvb20oMTUpO1xuICAgICAgICAgICAgLy8gY3JlYXRlTWFya2VyKHBsYWNlKTtcbiAgICAgICAgICAgIHNlYXJjaChsb2NhdGlvbik7XG4gICAgICAgIH0gIGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dG9jb21wbGV0ZV9zZWFyY2gnKS5wbGFjZWhvbGRlciA9ICdFbnRlciBhIGNpdHknO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2VhcmNoIGZvciBob3RlbHMgaW4gdGhlIHNlbGVjdGVkIGNpdHksIHdpdGhpbiB0aGUgdmlld3BvcnQgb2YgdGhlIG1hcC5cbiAgICBmdW5jdGlvbiBzZWFyY2gobG9jYXRpb24pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobG9jYXRpb24pO1xuICAgICAgICB2YXIgcGxhY2VzID0gbmV3IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlKG1hcCk7XG4gICAgICAgIHZhciBzZWFyY2ggPSB7IFxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgICAgICAgcmFkaXVzOiA1MDAsXG4gICAgICAgICAgICB0eXBlczogWydlc3RhYmxpc2htZW50J11cbiAgICAgICAgfTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGxhY2UpO1xuICAgICAgICBwbGFjZXMubmVhcmJ5U2VhcmNoKHNlYXJjaCwgZnVuY3Rpb24ocmVzdWx0cywgc3RhdHVzKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHRzKTtcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IGdvb2dsZS5tYXBzLnBsYWNlcy5QbGFjZXNTZXJ2aWNlU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJSZXN1bHRzKCk7XG4gICAgICAgICAgICAgICAgY2xlYXJNYXJrZXJzKCk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU1hcmtlcihyZXN1bHRzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiAoc3RhdHVzID09PSBnb29nbGUubWFwcy5wbGFjZXMuUGxhY2VzU2VydmljZVN0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIG1hcmtlciBmb3IgZWFjaCBob3RlbCBmb3VuZCwgYW5kXG4gICAgICAgICAgICAgICAgLy8gYXNzaWduIGEgbGV0dGVyIG9mIHRoZSBhbHBoYWJldGljIHRvIGVhY2ggbWFya2VyIGljb24uXG4gICAgICAgICAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvLyB2YXIgbWFya2VyTGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZSgnQScuY2hhckNvZGVBdCgwKSArIChpICUgMjYpKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgbWFya2VySWNvbiA9IE1BUktFUl9QQVRIICsgbWFya2VyTGV0dGVyICsgJy5wbmcnO1xuICAgICAgICAgICAgICAgIC8vIFVzZSBtYXJrZXIgYW5pbWF0aW9uIHRvIGRyb3AgdGhlIGljb25zIGluY3JlbWVudGFsbHkgb24gdGhlIG1hcC5cbiAgICAgICAgICAgICAgICAvLyBtYXJrZXJzW2ldID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgLy8gICAgIHBvc2l0aW9uOiByZXN1bHRzW2ldLmdlb21ldHJ5LmxvY2F0aW9uLFxuICAgICAgICAgICAgICAgIC8vICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICAgICAgICAgIC8vICAgICBpY29uOiBtYXJrZXJJY29uXG4gICAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgY2xpY2tzIGEgaG90ZWwgbWFya2VyLCBzaG93IHRoZSBkZXRhaWxzIG9mIHRoYXQgaG90ZWxcbiAgICAgICAgICAgICAgICAvLyBpbiBhbiBpbmZvIHdpbmRvdy5cbiAgICAgICAgICAgICAgICAvLyBtYXJrZXJzW2ldLnBsYWNlUmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgICAgICAgICAvLyBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXJzW2ldLCAnY2xpY2snLCBzaG93SW5mb1dpbmRvdyk7XG4gICAgICAgICAgICAgICAgLy8gc2V0VGltZW91dChkcm9wTWFya2VyKGkpLCBpICogMTAwKTtcbiAgICAgICAgICAgICAgICAvLyBhZGRSZXN1bHQocmVzdWx0c1tpXSwgaSk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYWRkUmVzdWx0KHJlc3VsdCwgaSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgICAgICB2YXIgcmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzJyk7XG4gICAgICAgIHZhciBtYXJrZXJMZXR0ZXIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCdBJy5jaGFyQ29kZUF0KDApICsgKGkgJSAyNikpO1xuICAgICAgICB2YXIgbWFya2VySWNvbiA9IE1BUktFUl9QQVRIICsgbWFya2VyTGV0dGVyICsgJy5wbmcnO1xuXG4gICAgICAgIHZhciB0ciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG4gICAgICAgIHRyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IChpICUgMiA9PT0gMCA/ICcjRjBGMEYwJyA6ICcjRkZGRkZGJyk7XG4gICAgICAgIHRyLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcmtlcnNbaV0sICdjbGljaycpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGljb25UZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgICB2YXIgbmFtZVRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICAgIHZhciBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICBpY29uLnNyYyA9IG1hcmtlckljb247XG4gICAgICBpY29uLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncGxhY2VJY29uJyk7XG4gICAgICBpY29uLnNldEF0dHJpYnV0ZSgnY2xhc3NOYW1lJywgJ3BsYWNlSWNvbicpO1xuICAgICAgdmFyIG5hbWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXN1bHQubmFtZSk7XG4gICAgICBpY29uVGQuYXBwZW5kQ2hpbGQoaWNvbik7XG4gICAgICBuYW1lVGQuYXBwZW5kQ2hpbGQobmFtZSk7XG4gICAgICB0ci5hcHBlbmRDaGlsZChpY29uVGQpO1xuICAgICAgdHIuYXBwZW5kQ2hpbGQobmFtZVRkKTtcbiAgICAgIC8vIHJlc3VsdHMuYXBwZW5kQ2hpbGQodHIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkcm9wTWFya2VyKGkpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbWFya2Vyc1tpXS5zZXRNYXAobWFwKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYXJNYXJrZXJzKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChtYXJrZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgbWFya2Vyc1tpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWFya2VycyA9IFtdO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbGVhclJlc3VsdHMoKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdHMnKTtcbiAgICAgICAgd2hpbGUgKHJlc3VsdHMuY2hpbGROb2Rlc1swXSkge1xuICAgICAgICAgICAgcmVzdWx0cy5yZW1vdmVDaGlsZChyZXN1bHRzLmNoaWxkTm9kZXNbMF0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNob3dJbmZvV2luZG93KCkge1xuICAgICAgICB2YXIgbWFya2VyID0gdGhpcztcbiAgICAgICAgcGxhY2VzLmdldERldGFpbHMoe3BsYWNlSWQ6IG1hcmtlci5wbGFjZVJlc3VsdC5wbGFjZV9pZH0sXG4gICAgICAgICAgICBmdW5jdGlvbihwbGFjZSwgc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyAhPT0gZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2VTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXJrZXIpO1xuICAgICAgICAgICAgICAgIC8vIGluZm9XaW5kb3cuc2V0Q29udGVudChtYXJrZXIpO1xuICAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICAgICAgYnVpbGRJV0NvbnRlbnQocGxhY2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkSVdDb250ZW50KHBsYWNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBsYWNlKTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LWljb24nKS5pbm5lckhUTUwgPSAnPGltZyBjbGFzcz1cImhvdGVsSWNvblwiICcgKyAnc3JjPVwiJyArIHBsYWNlLmljb24gKyAnXCIvPic7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy11cmwnKS5pbm5lckhUTUwgPSAnPGI+PGEgaHJlZj1cIicgKyBwbGFjZS51cmwgKyAnXCI+JyArIHBsYWNlLm5hbWUgKyAnPC9hPjwvYj4nO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctYWRkcmVzcycpLnRleHRDb250ZW50ID0gcGxhY2UudmljaW5pdHk7XG5cbiAgICAgICAgaWYgKHBsYWNlLmZvcm1hdHRlZF9waG9uZV9udW1iZXIpIHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcGhvbmUtcm93Jykuc3R5bGUuZGlzcGxheSA9ICcnO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy1waG9uZScpLnRleHRDb250ZW50ID0gcGxhY2UuZm9ybWF0dGVkX3Bob25lX251bWJlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcGhvbmUtcm93Jykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFzc2lnbiBhIGZpdmUtc3RhciByYXRpbmcgdG8gdGhlIGhvdGVsLCB1c2luZyBhIGJsYWNrIHN0YXIgKCcmIzEwMDI5OycpXG4gICAgICAgIC8vIHRvIGluZGljYXRlIHRoZSByYXRpbmcgdGhlIGhvdGVsIGhhcyBlYXJuZWQsIGFuZCBhIHdoaXRlIHN0YXIgKCcmIzEwMDI1OycpXG4gICAgICAgIC8vIGZvciB0aGUgcmF0aW5nIHBvaW50cyBub3QgYWNoaWV2ZWQuXG4gICAgICAgIGlmIChwbGFjZS5yYXRpbmcpIHtcbiAgICAgICAgICB2YXIgcmF0aW5nSHRtbCA9ICcnO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocGxhY2UucmF0aW5nIDwgKGkgKyAwLjUpKSB7XG4gICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjU7JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJhdGluZ0h0bWwgKz0gJyYjMTAwMjk7JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcmF0aW5nLXJvdycpLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctcmF0aW5nJykuaW5uZXJIVE1MID0gcmF0aW5nSHRtbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2l3LXJhdGluZy1yb3cnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHJlZ2V4cCBpc29sYXRlcyB0aGUgZmlyc3QgcGFydCBvZiB0aGUgVVJMIChkb21haW4gcGx1cyBzdWJkb21haW4pXG4gICAgICAgIC8vIHRvIGdpdmUgYSBzaG9ydCBVUkwgZm9yIGRpc3BsYXlpbmcgaW4gdGhlIGluZm8gd2luZG93LlxuICAgICAgICBpZiAocGxhY2Uud2Vic2l0ZSkge1xuICAgICAgICAgIHZhciBmdWxsVXJsID0gcGxhY2Uud2Vic2l0ZTtcbiAgICAgICAgICB2YXIgd2Vic2l0ZSA9IGhvc3RuYW1lUmVnZXhwLmV4ZWMocGxhY2Uud2Vic2l0ZSk7XG4gICAgICAgICAgaWYgKHdlYnNpdGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHdlYnNpdGUgPSAnaHR0cDovLycgKyBwbGFjZS53ZWJzaXRlICsgJy8nO1xuICAgICAgICAgICAgZnVsbFVybCA9IHdlYnNpdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpdy13ZWJzaXRlLXJvdycpLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctd2Vic2l0ZScpLnRleHRDb250ZW50ID0gd2Vic2l0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaXctd2Vic2l0ZS1yb3cnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJHNjb3BlLmluaXRNYXAgPSBmdW5jdGlvbigpIHsgXG4gICAgICAgIC8vICRzY29wZS4kd2F0Y2goJ3NlYXJjaF9lbnRpZGFkJywgZnVuY3Rpb24obil7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnNlYXJjaF9lbnRpZGFkICE9IHVuZGVmaW5lZCAmJiAkc2NvcGUuc2VhcmNoX2VudGlkYWQgIT0gJycpe1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkKCRzY29wZS5zZWFyY2hfZW50aWRhZCw1LDEpO1xuICAgICAgICAgICAgICAgIC8vICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvYWQoJycsJzAnLDEpOyBcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubWFwYSA9ICdmdWxsJzsgXG4gICAgICAgICAgICB9XG4gICAgICAgIC8vIH0pOyAgICAgICAgICAgXG4gICAgfVxuICAgICRzY29wZS5JbmNpYWxpemFjaW9uKCk7XG4gICAgLy8gJHNjb3BlLmluaXRNYXAoKTtcblxuICAgICRzY29wZS5yZXNpemUgPSBmdW5jdGlvbihtYXApe1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UobWFwLCAnYm91bmRzX2NoYW5nZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgICAgIHZhciBib3VuZHMgPSBtYXAuZ2V0Qm91bmRzKCk7XG4gICAgICAgIH0pO1xuICAgIH07IFxuXG4gICAgJHNjb3BlLmdldEtpbG9tZXRyb3MgPSBmdW5jdGlvbihsYXQxLGxvbjEsbGF0Mixsb24yKXtcbiAgICAgICAgZnVuY3Rpb24gcmFkKHgpIHtcbiAgICAgICAgICAgIHJldHVybiB4ICogTWF0aC5QSS8xODA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIFIgPSA2Mzc4LjEzNzsgLy9SYWRpbyBkZSBsYSB0aWVycmEgZW4ga21cbiAgICAgICAgdmFyIGRMYXQgPSByYWQoIGxhdDIgLSBsYXQxICk7XG4gICAgICAgIHZhciBkTG9uZyA9IHJhZCggbG9uMiAtIGxvbjEgKTtcbiAgICAgICAgdmFyIGEgPSBNYXRoLnNpbihkTGF0LzIpICogTWF0aC5zaW4oZExhdC8yKSArIE1hdGguY29zKHJhZChsYXQxKSkgKiBNYXRoLmNvcyhyYWQobGF0MikpICogTWF0aC5zaW4oZExvbmcvMikgKiBNYXRoLnNpbihkTG9uZy8yKTtcbiAgICAgICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxLWEpKTtcbiAgICAgICAgdmFyIGQgPSBSICogYztcbiAgICAgICAgdmFyIHJlc3VsdCA9IGQudG9GaXhlZCgzKTsgXG4gICAgICAgIHJldHVybiByZXN1bHQ7IC8vUmV0b3JuYSB0cmVzIGRlY2ltYWxlc1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRNaW5Gcm9tQXJyYXkgKGFycmF5X29mX3ZhbHVlcykge1xuICAgICAgICB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgYXJyYXlfb2ZfdmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIG1pbjsgICBcbiAgICB9O1xuXG4gICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIC8vICAgICBhbGVydChcImNsaWNrZWQgbWFya2VyXCIpO1xuICAgIC8vIH0pO1xuXG4gICAgXG4gICAgLy8gJHNjb3BlLmxvY2F0aW9uID0gZnVuY3Rpb24oKXsgIFxuICAgICAgICAvLyAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xuICAgICAgICAvLyAgICAgICAgIC8vIElOSVQgUkVTSVpFIFxuICAgICAgICAvLyAgICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuZGlzYWJsZV9idXR0b24gPSB0cnVlOyBcbiAgICAgICAgLy8gICAgICAgICAkc2NvcGUuZGF0YSA9IFtdO1xuXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLmluaXRNYXAoKTsgXG4gICAgICAgIC8vICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICAvLyAgICAgICAgIH0sNTAwKTtcbiAgICAgICAgLy8gICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7ICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAkc2NvcGUuY3JlYXRlTWFya2VyKG1hcCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICRzY29wZS5wb3NpY2lvbl9hY3R1YWwgPSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgbGF0OiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgbG5nOiBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlXG4gICAgICAgIC8vICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgdmFyIGdlb2NvZGluZyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sYXQgKyAnLCcgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxuZyArICcmc2Vuc29yPWZhbHNlJztcbiAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coZ2VvY29kaW5nKTtcblxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgc2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoNTAsIDUwKSwgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCA0MClcbiAgICAgICAgLy8gICAgICAgICAgICAgfTsgXG4gICAgICAgIC8vICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAkc2NvcGUucG9zaWNpb25fYWN0dWFsLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZVxuICAgICAgICAvLyAgICAgICAgICAgICB9KTtcblxuICAgICAgICAvLyAgICAgICAgICAgICB2YXIgY2lyY2xlID0gbmV3IGdvb2dsZS5tYXBzLkNpcmNsZSh7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBjZW50ZXI6ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICByYWRpdXM6IDEwMDAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogJyMzOTUyN2InLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBzdHJva2VDb2xvcjogJyMzOTUyN2InLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgc3Ryb2tlT3BhY2l0eTogMC4yXG4gICAgICAgIC8vICAgICAgICAgICAgIH0pOyAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vICRzY29wZS5zZWFyY2hfZW50aWRhZCA9IGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICAgICAgZm9yICh2YXIgaSA9ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpLS07KXsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBpZihwYXJzZUZsb2F0KCAkc2NvcGUuZ2V0S2lsb21ldHJvcyggJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sYXQsICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nLCAkc2NvcGUuZGF0YV9sb2FkW2ldLmxhdCwgJHNjb3BlLmRhdGFfbG9hZFtpXS5sbmcpKSA8PSAxKXsgICBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGF0YV9yZWFsLnB1c2goJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfcmVhbCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgYXJyYXkpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGkgKycgZWwgbWluaW1vIGVzOiAnKyBtaW4pO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaSA9PSAwKXtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJHNjb3BlLmRhdGFfbG9hZFtpXSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIHN0YXJ0ID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBlbmQgPSAkc2NvcGUuZGF0YV9sb2FkWzNdLmRpcmVjY2lvbjtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGlmKCFzdGFydCB8fCAhZW5kKXtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBhbGVydChcIlN0YXJ0IGFuZCBFbmQgYWRkcmVzc2VzIGFyZSByZXF1aXJlZFwiKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICByZXR1cm47XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgb3JpZ2luOiBzdGFydCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGVzdGluYXRpb246IGVuZCxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1RyYXZlbE1vZGVbJ1dBTEtJTkcnXSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgdW5pdFN5c3RlbTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1VuaXRTeXN0ZW1bJ01FVFJJQyddLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBwcm92aWRlUm91dGVBbHRlcm5hdGl2ZXM6IGZhbHNlXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9O1xuXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRQYW5lbCgkKFwiI2RpcmVjdGlvbnNfcGFuZWxcIikuZ2V0KDApKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Usc3RhdHVzKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgYWxlcnQoXCJUaGVyZSBpcyBubyBkaXJlY3Rpb25zIGF2YWlsYWJsZSBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcIik7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH0pXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGVsc2V7IFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzY29wZS5kZWwoJHNjb3BlLmRhdGFfbG9hZC5pbmRleE9mKCRzY29wZS5kYXRhX2xvYWRbaV0pKTsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbaV0uc2V0TWFwKG51bGwpOyAgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTsgXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAvLyAgICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAvLyAgICAgICAgICAgICBtYXAuc2V0Wm9vbSgxOCk7XG4gICAgICAgIC8vICAgICAgICAgICAgIG1hcC5wYW5UbyhtYXJrZXIucG9zaXRpb24pO1xuICAgICAgICAvLyAgICAgICAgICAgICBtYXAuZml0Qm91bmRzKGNpcmNsZS5nZXRCb3VuZHMoKSk7XG4gICAgICAgIC8vICAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAgXG4gICAgICAgIC8vICAgICAgICAgICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yKHRydWUsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG4gICAgICAgIC8vICAgICAgICAgfSk7IFxuICAgICAgICAvLyAgICAgfSBlbHNlIHsgXG4gICAgICAgIC8vICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IoZmFsc2UsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG5cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgIFxuICAgIC8vIH1cbiAgICB2YXIgYWxsX21lID0gW107XG4gICAgJHNjb3BlLmxvY2F0aW9uID0gZnVuY3Rpb24oKXsgXG4gICAgICAgICBcbiAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikgeyBcbiAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24ocG9zaXRpb24pIHsgICAgXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICRzY29wZS5wb3NpY2lvbl9hY3R1YWwgPSB7XG4gICAgICAgICAgICAgICAgICBsYXQ6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICAgIGxuZzogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZVxuICAgICAgICAgICAgICAgIH07IFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5wb3NpY2lvbl9hY3R1YWwpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsX21lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhbGxfbWVbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbF9tZVtpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWxsX21lID0gW107IFxuICAgICAgICAgICAgICAgICRzY29wZS5pbnB1dF9zdGFydCA9ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwubGF0K1wiLFwiKyRzY29wZS5wb3NpY2lvbl9hY3R1YWwubG5nO1xuXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0ge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXNzZXRzL2FwcC9pbWFnZXMvcG9zaXRpb25fYWN0dWFsLnBuZycsIFxuICAgICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMClcblxuICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB2YXIgbWUgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICRzY29wZS5wb3NpY2lvbl9hY3R1YWwsXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZVxuICAgICAgICAgICAgICAgIH0pOyAgICBcbiAgICAgICAgICAgICAgICBhbGxfbWUucHVzaChtZSk7IFxuXG4gICAgICAgICAgICAgICAgdmFyIGdlb2NvZGluZyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgJHNjb3BlLnBvc2ljaW9uX2FjdHVhbC5sYXQgKyAnLCcgKyAkc2NvcGUucG9zaWNpb25fYWN0dWFsLmxuZyArICcmc2Vuc29yPWZhbHNlJzsgXG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKGdlb2NvZGluZykuZG9uZShmdW5jdGlvbihsb2NhdGlvbikgeyBcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRleHRfc3RhcnQgPSBsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzOyAgXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG4gICAgICAgICAgICAgICAgfSk7ICBcbiAgICAgICAgICAgICAgICBtYXAuc2V0Wm9vbSgxNik7XG4gICAgICAgICAgICAgICAgbWFwLnBhblRvKG1lLnBvc2l0aW9uKTsgXG4gICAgICAgICAgICAgICAgJHNjb3BlLmluZGljYWNpb25lcygpO1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2FkX2FsbEJvbWJlcm9zKCk7XG4gICAgICAgICAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcblxuICAgICAgICAgICAgICAgIC8vICRzY29wZS5jYXJnYXJfbWFyY2Fkb3JlcygpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7ICAgXG4gICAgICAgICAgICAgICAgJHNjb3BlLmhhbmRsZUxvY2F0aW9uRXJyb3IodHJ1ZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcbiAgICAgICAgICAgIH0pOyBcbiAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAkc2NvcGUuaGFuZGxlTG9jYXRpb25FcnJvcihmYWxzZSwgaW5mb1dpbmRvdywgbWFwLmdldENlbnRlcigpKTtcblxuICAgICAgICB9XG4gICAgICAgICBcbiAgICB9XG4gICAgLyogcGVybWl0ZSBtb3N0cmEgeSBvY3VsdGFyIGxvcyBtYXJjYWRvcmVzIHkgYWN0dWFsaXphciBlbCBsaXN0YWRvICovXG4gICAgJHNjb3BlLmljb25fdHJ1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5pY29uXzEgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaWNvbl8yID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmljb25fMyA9IHRydWU7XG4gICAgICAgICRzY29wZS5pY29uXzQgPSB0cnVlO1xuICAgIH1cbiAgICAkc2NvcGUuaWNvbl90cnVlKCk7XG5cbiAgICAkc2NvcGUudG9nZ2xlX01hcmtlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgJHNjb3BlLmljb25fdHJ1ZSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChtYXJrZXJzW2ldKSB7XG4gICAgICAgICAgICAgICAgbWFya2Vyc1tpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbWFya2VycyA9IFtdO1xuICAgICAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0b2NvbXBsZXRlX3NlYXJjaCcpO1xuICAgICAgICBpZiAoaWQgPT09IDEpIHtcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gXCJiYW5jb3NcIjsgIFxuICAgICAgICAgICAgJHNjb3BlLmljb25fMSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmljb24xID0gXCIvYXNzZXRzL2FwcC9pbWFnZXMvYmFuY28tY29sb3Iuc3ZnXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihpZCA9PT0gMil7IFxuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBcImNvbWlzYXJpYXNcIjsgXG4gICAgICAgICAgICAkc2NvcGUuaWNvbl8yID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuaWNvbjEgPSBcIi9hc3NldHMvYXBwL2ltYWdlcy9jb21pc2FyaWEtY29sb3Iuc3ZnXCI7IFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoaWQgPT09IDMpeyBcbiAgICAgICAgICAgIGlucHV0LnZhbHVlID0gXCJob3NwaXRhbGVzXCI7IFxuICAgICAgICAgICAgJHNjb3BlLmljb25fMyA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmljb24xID0gXCIvYXNzZXRzL2FwcC9pbWFnZXMvaG9zcGl0YWwtY29sb3Iuc3ZnXCI7IFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoaWQgPT09IDQpe1xuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBcImJvbWJlcm9zXCI7XG4gICAgICAgICAgICAkc2NvcGUuaWNvbl80ID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuaWNvbjEgPSBcIi9hc3NldHMvYXBwL2ltYWdlcy9ib21iZXJvcy1jb2xvci5zdmdcIjsgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW50cmVcIik7IFxuICAgICAgICAgICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnYm91bmRzX2NoYW5nZWQnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUubG9hZF9hbGxCb21iZXJvcygpO1xuICAgICAgICAgICAgLy8gfSk7ICBcbiAgICAgICAgICAgIC8vICRzY29wZS5saW1pdF9jaGFuZ2VkKDQpOyBcbiAgICAgICAgfVxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKGlucHV0LCAnZm9jdXMnKVxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKGlucHV0LCAna2V5ZG93bicsIHtcbiAgICAgICAgICAgIGtleUNvZGU6IDEzXG4gICAgICAgIH0pOyAgICBcbiAgICB9XG4gICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnYm91bmRzX2NoYW5nZWQnLCRzY29wZS50b2dnbGVfTWFya2VyKGlkKSk7XG4gICAgLy8gJHNjb3BlLnRvZ2dsZV9NYXJrZXIgPSBmdW5jdGlvbihpZCl7IFxuICAgIC8vICAgICBjb25zb2xlLmxvZyhcIkluZ3Jlc28gZWwgSUQ6IFwiK2lkKTtcbiAgICAvLyAgICAgJHNjb3BlLmlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpOztcbiAgICAvLyAgICAgJHNjb3BlLmlkLmNoZWNrZWQgPSAhJHNjb3BlLmlkLmNoZWNrZWQ7IFxuICAgIC8vICAgICBpZigkKCcjJytpZCkuaXMoJzpjaGVja2VkJykpe1xuICAgIC8vICAgICAgICAgZm9yKHZhciBpID0gJHNjb3BlLmRhdGFfcmVhbC5sZW5ndGg7IGktLTspeyBcbiAgICAvLyAgICAgICAgICAgICBpZigkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzID09PSBpZCl7ICBcbiAgICAvLyAgICAgICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gJyMnKyRzY29wZS5kYXRhX3JlYWxbaV0uaWQrJy0nK2lkO1xuICAgIC8vICAgICAgICAgICAgICAgICAkKHZhcmlhYmxlKS5zaG93KCk7XG4gICAgLy8gICAgICAgICAgICAgICAgIC8vICRzY29wZS5kZWxfdGVtcCgkc2NvcGUuZGF0YV9yZWFsLmluZGV4T2YoJHNjb3BlLmRhdGFfcmVhbFtpXSkpOyAgIFxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICBlbHNle1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT09PT09PT1cIik7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX3JlYWxbaV0uaWRfc2VydmljZXMpO1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09PT09PT09PT1cIik7IFxuICAgIC8vICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUubmV3X21hcmtlci5sZW5ndGg7IGkrKyl7XG4gICAgLy8gICAgICAgICAgICAgaWYoJHNjb3BlLm5ld19tYXJrZXJbaV0udHlwZSA9PT0gaWQpeyBcbiAgICAvLyAgICAgICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXJbaV0uc2V0VmlzaWJsZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGVsc2V7XG4gICAgLy8gICAgICAgICBmb3IodmFyIGkgPSAkc2NvcGUuZGF0YV9yZWFsLmxlbmd0aDsgaS0tOyl7IFxuICAgIC8vICAgICAgICAgICAgIGlmKCRzY29wZS5kYXRhX3JlYWxbaV0uaWRfc2VydmljZXMgPT09IGlkKXsgXG4gICAgLy8gICAgICAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9ICcjJyskc2NvcGUuZGF0YV9yZWFsW2ldLmlkKyctJytpZDtcbiAgICAvLyAgICAgICAgICAgICAgICAgJCh2YXJpYWJsZSkuaGlkZSgpO1xuICAgIC8vICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZGVsX3RlbXAoJHNjb3BlLmRhdGFfcmVhbC5pbmRleE9mKCRzY29wZS5kYXRhX3JlYWxbaV0pKTsgICBcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgZWxzZXtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpO1xuICAgIC8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PT09PT09XCIpOyBcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgJHNjb3BlLm5ld19tYXJrZXIubGVuZ3RoOyBqKyspe1xuICAgIC8vICAgICAgICAgICAgIGlmKCRzY29wZS5uZXdfbWFya2VyW2pdLnR5cGUgPT09IGlkKXsgXG4gICAgLy8gICAgICAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyW2pdLnNldFZpc2libGUoZmFsc2UpOyBcbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgZWxzZXtcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItLSBubyBzZSBlbGltaW5vIC0tOiBcIiskc2NvcGUuZGF0YV9yZWFsW2ldLmlkX3NlcnZpY2VzKTsgICBcbiAgICAvLyAgICAgICAgICAgICB9IFxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIC8vICRzY29wZS4kZGlnZXN0KCk7XG4gICAgLy8gfVxuXG4gICAgJHNjb3BlLmluZGljYWNpb25lcyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICBpZighJHNjb3BlLmlucHV0X3N0YXJ0IHx8ICEkc2NvcGUuaW5wdXRfZW5kKXtcbiAgICAgICAgICAgIC8vIGFsZXJ0KFwiU3RhcnQgYW5kIEVuZCBhZGRyZXNzZXMgYXJlIHJlcXVpcmVkXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLmlucHV0X3N0YXJ0LFxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuaW5wdXRfZW5kLFxuICAgICAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNUcmF2ZWxNb2RlWydEUklWSU5HJ10sXG4gICAgICAgICAgICAgICAgdW5pdFN5c3RlbTogZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1VuaXRTeXN0ZW1bJ01FVFJJQyddLFxuICAgICAgICAgICAgICAgIHByb3ZpZGVSb3V0ZUFsdGVybmF0aXZlczogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKSB7XG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRNYXAobWFwKTtcbiAgICAgICAgICAgICAgICAvLyBkaXJlY3Rpb25zRGlzcGxheS5zZXRQYW5lbCgkKFwiI2RpcmVjdGlvbnNfcGFuZWxcIikuZ2V0KDApKTtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUub3JpZ2VuID0gcmVzcG9uc2UucmVxdWVzdC5vcmlnaW47XG4gICAgICAgICAgICAgICAgJHNjb3BlLmRlc3Rpbm8gPSByZXNwb25zZS5yZXF1ZXN0LmRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgICAgICRzY29wZS5pbmRpY2FjaW9uX2RldGFsbGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICRzY29wZS53YXJuaW5nID0gcmVzcG9uc2Uucm91dGVzWzBdLndhcm5pbmdzWzBdO1xuICAgICAgICAgICAgICAgICRzY29wZS5kaXN0YW5jaWEgPSByZXNwb25zZS5yb3V0ZXNbMF0ubGVnc1swXS5kaXN0YW5jZS50ZXh0O1xuICAgICAgICAgICAgICAgICRzY29wZS5kdXJhY2lvbiA9IHJlc3BvbnNlLnJvdXRlc1swXS5sZWdzWzBdLmR1cmF0aW9uLnRleHQ7XG4gICAgICAgICAgICAgICAgJHNjb3BlLnJ1dGFfZ2VuZXJhbCA9IHJlc3BvbnNlLnJvdXRlc1swXS5zdW1tYXJ5O1xuICAgICAgICAgICAgICAgICRzY29wZS5ydXRhX2RldGFsbGUgPSByZXNwb25zZS5yb3V0ZXNbMF0ubGVnc1swXS5zdGVwcztcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUudGl0dWxvID0gJCgnI2RldGEnKS5odG1sKHJlc3BvbnNlLnJvdXRlc1swXS5sZWdzWzBdLnN0ZXBzWzFdLmluc3RydWN0aW9ucyk7XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuJGRpZ2VzdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSxzdGF0dXMpO1xuICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwiVGhlcmUgaXMgbm8gZGlyZWN0aW9ucyBhdmFpbGFibGUgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgXG4gICAgfVxuXG4gICAgJHNjb3BlLmdvX3Bvc2l0aW9uID0gZnVuY3Rpb24oKXsgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5kYXRhX2xvYWRbaV0pO1xuICAgICAgICAkLmdldEpTT04oZ2VvY29kaW5nKS5kb25lKGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsb2NhdGlvbik7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBsb2NhdGlvbi5yZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzO1xuICAgICAgICAgICAgdmFyIGVuZCA9ICRzY29wZS5kYXRhX2xvYWRbM10uZGlyZWNjaW9uO1xuICAgICAgICAgICAgaWYoIXN0YXJ0IHx8ICFlbmQpe1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiU3RhcnQgYW5kIEVuZCBhZGRyZXNzZXMgYXJlIHJlcXVpcmVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogZW5kLFxuICAgICAgICAgICAgICAgICAgICB0cmF2ZWxNb2RlOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVHJhdmVsTW9kZVsnV0FMS0lORyddLFxuICAgICAgICAgICAgICAgICAgICB1bml0U3lzdGVtOiBnb29nbGUubWFwcy5EaXJlY3Rpb25zVW5pdFN5c3RlbVsnTUVUUklDJ10sXG4gICAgICAgICAgICAgICAgICAgIHByb3ZpZGVSb3V0ZUFsdGVybmF0aXZlczogZmFsc2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIGZ1bmN0aW9uKHJlc3BvbnNlLCBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcChtYXApO1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRQYW5lbCgkKFwiI2RpcmVjdGlvbnNfcGFuZWxcIikuZ2V0KDApKTtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2Usc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJUaGVyZSBpcyBubyBkaXJlY3Rpb25zIGF2YWlsYWJsZSBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pIFxuICAgIH1cblxuICAgIC8vIEVsaW1pbmEgMSB4IDEgY2FkYSBkYXRvIHF1ZSBubyBlc3RhIGVuIGVsIHJhbmdvXG4gICAgJHNjb3BlLmRlbCA9IGZ1bmN0aW9uKGluZGV4KXsgIFxuICAgICAgICAkc2NvcGUuZGF0YV9sb2FkLnNwbGljZShpbmRleCwxKTsgIFxuICAgIH07XG4gICAgJHNjb3BlLmRlbF90ZW1wID0gZnVuY3Rpb24oaW5kZXgpeyAgXG4gICAgICAgICRzY29wZS5kYXRhX3JlYWwuc3BsaWNlKGluZGV4LDEpOyAgXG4gICAgfTtcbiAgICAvLyBIYWNlIHVuIHJlY29ycmlkbyBhbCBhcnJheSBkZSBtYXJjYWRvcmVzXG4gICAgJHNjb3BlLnNldE1hcE9uQWxsID0gZnVuY3Rpb24obWFwKSB7XG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUubmV3X21hcmtlci5sZW5ndGg7IGkrKykgeyBcbiAgICAgICAgICAgICRzY29wZS5uZXdfbWFya2VyW2ldLnNldE1hcChtYXApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGxpbXBpYSB0b2RvcyBsb3MgbWFyY2Fkb3JlcyBhIG51bGxcbiAgICAkc2NvcGUuY2xlYXJNYXJrZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5zZXRNYXBPbkFsbChudWxsKTtcbiAgICB9XG4gICAgLy8gZnVuY2lvbiBsbGFtYSBhIGxpbXBpYXIgdG9kb3MgbG9zIG1hcmNhZG9yZXNcbiAgICAkc2NvcGUuZGVsZXRlTWFya2VycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUuY2xlYXJNYXJrZXJzKCk7XG4gICAgICAgICRzY29wZS5uZXdfbWFya2VyID0gW107XG4gICAgfSBcblxuICAgICRzY29wZS5oYW5kbGVMb2NhdGlvbkVycm9yPSBmdW5jdGlvbihicm93c2VySGFzR2VvbG9jYXRpb24sIGluZm9XaW5kb3csIHBvcykge1xuICAgICAgICBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7XG4gICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChicm93c2VySGFzR2VvbG9jYXRpb24gP1xuICAgICAgICAgICAgJ0Vycm9yOiBFbCBzZXJ2aWNpbyBkZSBHZW9sb2NhbGl6YWNpb24gRmFsbMOzLicgOlxuICAgICAgICAgICAgJ0Vycm9yOiBZb3VyIGJyb3dzZXIgZG9lc25cXCd0IHN1cHBvcnQgZ2VvbG9jYXRpb24uJyk7XG4gICAgfSBcblxuICAgIFxuICAgIFxuICAgICRzY29wZS5jcmVhdGVNYXJrZXIgPSBmdW5jdGlvbihtYXApIHsgIFxuICAgICAgICBpZigkc2NvcGUuZGF0YV9sb2FkICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5kYXRhX2xvYWQubGVuZ3RoOyBpKyspIHsgIFxuICAgICAgICAgICAgICAgIHZhciBkYXRhX3RlbXAgPSAkc2NvcGUuZGF0YV9sb2FkW2ldOyBcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0ge1xuICAgICAgICAgICAgICAgICAgbGF0OiBwYXJzZUZsb2F0KGRhdGFfdGVtcC5sYXQpLFxuICAgICAgICAgICAgICAgICAgbG5nOiBwYXJzZUZsb2F0KGRhdGFfdGVtcC5sbmcpXG4gICAgICAgICAgICAgICAgfTsgXG4gICAgICAgICAgICAgICAgaWYoZGF0YV90ZW1wLmlkX3NlcnZpY2VzID09PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0geyBcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8vbG9jYWxob3N0OjgwMDAvYXNzZXRzL2FwcC9pbWFnZXMvYmFuY28tY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgZWxzZSBpZihkYXRhX3RlbXAuaWRfc2VydmljZXMgPT09IDIpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9jb21pc2FyaWEtY29sb3Iuc3ZnJywgXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZWRTaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgyMCwgMjApLCAgXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSwgXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAxXG4gICAgICAgICAgICAgICAgICAgIH07ICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihkYXRhX3RlbXAuaWRfc2VydmljZXMgPT09IDMpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnLy9sb2NhbGhvc3Q6ODAwMC9hc3NldHMvYXBwL2ltYWdlcy9ob3NwaXRhbC1jb2xvci5zdmcnLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDIwLCAyMCksICBcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDFcbiAgICAgICAgICAgICAgICAgICAgfTsgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGRhdGFfdGVtcC5pZF9zZXJ2aWNlcyA9PT0gNCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9IHsgXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvL2xvY2FsaG9zdDo4MDAwL2Fzc2V0cy9hcHAvaW1hZ2VzL2JvbWJlcm9zLWNvbG9yLnN2ZycsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVkU2l6ZTogbmV3IGdvb2dsZS5tYXBzLlNpemUoMjAsIDIwKSwgIFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksIFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgICAgICAgICAgICB9OyAgXG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9jdXJyaW8gdW4gZXJyb3IgaW5lc3BlcmFkbyBlbiBsb3MgSUQgXCIrZGF0YV90ZW1wLmlkX3NlcnZpY2VzK1wiIGRlIEVudGlkYWRlc1wiKTtcbiAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvcyxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsIFxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBpbWFnZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogZGF0YV90ZW1wLmlkX3NlcnZpY2VzLFxuICAgICAgICAgICAgICAgICAgICBmb3RvOiBkYXRhX3RlbXAuZm90byxcbiAgICAgICAgICAgICAgICAgICAgbm9tYnJlX2VtcHJlc2E6IGRhdGFfdGVtcC5ub21icmVfZW1wcmVzYSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWNjaW9uOiBkYXRhX3RlbXAuZGlyZWNjaW9uXG5cbiAgICAgICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5ld19tYXJrZXIucHVzaChtYXJrZXIpOyBcbiAgICAgICAgICAgICAgICAvLyAkc2NvcGUubWFya2Vyc19ob3ZlcihtYXJrZXIpOyAgXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3BlbkluZm9XaW5kb3codGhpcyk7IFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBhbGVydCgnT2N1cnJpbyB1biBlcnJvciBhbCBjYXJnYXInKTtcblxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5uZXdfbWFya2VyKTtcbiAgICAgICAgLy9jaWVycmEgZWwgaW5mb3dpbmRvdyB1bmEgdmV6IGNhbWJpZVxuICAgICAgICBpbmZvV2luZG93LmNsb3NlKCk7XG4gICAgfSBcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUJvdW5jZSgpIHsgXG4gICAgICAgIC8vIG1hcmtlci5zZXRBbmltYXRpb24oZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkJPVU5DRSk7IFxuICAgIH1cbiAgICBcbiAgICBcbiAgICAkc2NvcGUubWFya2Vyc19ob3ZlciA9IGZ1bmN0aW9uKGRhdGEpeyBcbiAgICAgICAgJHNjb3BlLnJldHVybl9saXN0ID0gdHJ1ZTtcbiAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpO1xuICAgICAgICAkc2NvcGUuc2hvd19kZXRhaWxfbWFya2VyKCk7XG4gICAgICAgICRzY29wZS5kZXRhbGxlID0gZGF0YTsgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpOyBcbiAgICAgICAgdmFyIHBvcyA9IHt9O1xuICAgICAgICBwb3MubGF0ID0gZGF0YS5wb3NpdGlvbi5sYXQoKTtcbiAgICAgICAgcG9zLmxuZyA9IGRhdGEucG9zaXRpb24ubG5nKCk7XG4gICAgICAgIC8vIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7bWFwOiBtYXAsbWF4V2lkdGg6IDIwMH0pO1xuICAgICAgICBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7IFxuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjZW50ZXIgZ2xvYm9fdWJpY2FjaW9uXCI+JywgXG4gICAgICAgICAgICAgICAgJzxpbWcgd2lkdGg9XCIxMDAlXCIgc3JjPVwiJytkYXRhLmZvdG8rJ1wiPicsXG4gICAgICAgICAgICAgICAgJzxoNj4nK2RhdGEudGl0bGUrJzwvaDY+JywgXG4gICAgICAgICAgICAgICAgJzxwPicrZGF0YS5kaXJlY2Npb24rJzwvcD4nLCBcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgXS5qb2luKCcnKVxuICAgICAgICApOyBcbiAgICAgICAgJHNjb3BlLnNldF9nb29nbGVfbWFwcygpOyBcbiAgICAgICAgbWFwLnNldFpvb20oMTgpO1xuICAgICAgICBtYXAucGFuVG8ocG9zKTtcbiAgICAgICAgJCgnI3ViaWNhY2lvbmVzJykuYW5pbWF0ZSh7XG4gICAgICAgICAgICBzY3JvbGxUb3A6ICcwcHgnXG4gICAgICAgIH0sIDApOyBcbiAgICAgICAgJCgnI3ViaWNhY2lvbmVzJykuY3NzKCdoZWlnaHQnLCcxMDAlJyk7XG5cbiAgICB9IFxuXG4gICAgXG4gICAgJHNjb3BlLm9wZW5JbmZvV2luZG93ID0gZnVuY3Rpb24obWFya2VyKXtcbiAgICAgICAgaW5mb1dpbmRvdy5jbG9zZSgpOyBcbiAgICAgICAgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHttYXA6IG1hcCxtYXhXaWR0aDogMjAwfSk7XG4gICAgICAgIHZhciBwb3MgPSBtYXJrZXIucG9zaXRpb247IFxuICAgICAgICBpbmZvV2luZG93LnNldFBvc2l0aW9uKHBvcyk7IFxuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjZW50ZXIgZ2xvYm9fdWJpY2FjaW9uXCI+JywgXG4gICAgICAgICAgICAgICAgJzxpbWcgd2lkdGg9XCIxMDAlXCIgc3JjPVwiJyttYXJrZXIuZm90bysnXCI+JyxcbiAgICAgICAgICAgICAgICAnPGg2PicrbWFya2VyLm5vbWJyZV9lbXByZXNhKyc8L2g2PicsIFxuICAgICAgICAgICAgICAgICc8cD4nK21hcmtlci5kaXJlY2Npb24rJzwvcD4nLCBcbiAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgXS5qb2luKCcnKVxuICAgICAgICApOyBcbiAgICAgICAgJHNjb3BlLnNldF9nb29nbGVfbWFwcygpO1xuICAgIH1cblxuICAgICRzY29wZS5zZXRfZ29vZ2xlX21hcHMgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgaXdPdXRlciA9ICQoJy5nbS1zdHlsZS1pdycpO1xuICAgICAgICB2YXIgaXdDbG9zZUJ0biA9IGl3T3V0ZXIubmV4dCgpO1xuICAgICAgICB2YXIgaXdCYWNrZ3JvdW5kID0gaXdPdXRlci5wcmV2KCk7IFxuICAgICAgICBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKS5jc3MoeydkaXNwbGF5JyA6ICdub25lJ30pOyBcbiAgICAgICAgaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDQpJykuY3NzKHsnZGlzcGxheScgOiAnbm9uZSd9KTtcbiAgICAgICAgLy8gaXdPdXRlci5wYXJlbnQoKS5wYXJlbnQoKS5jc3Moe2xlZnQ6ICcxMHB4J30pO1xuICAgICAgICAvLyBpd0JhY2tncm91bmQuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2xlZnQ6IDYwcHggIWltcG9ydGFudDsnfSk7XG4gICAgICAgIC8vIGl3QmFja2dyb3VuZC5jaGlsZHJlbignOm50aC1jaGlsZCgzKScpLmF0dHIoJ3N0eWxlJywgZnVuY3Rpb24oaSxzKXsgcmV0dXJuIHMgKyAnbGVmdDogNjBweCAhaW1wb3J0YW50Oyd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuZmluZCgnZGl2JykuY2hpbGRyZW4oKS5jc3Moeydib3gtc2hhZG93JzogJ3JnYmEoMCwgMCwgMCwgMCkgMHB4IDFweCA2cHgnLCAnei1pbmRleCcgOiAnMSd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuY2hpbGRyZW4oJzpudGgtY2hpbGQoMSknKS5maW5kKCdkaXYnKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2hlaWdodDogMjFweCAhaW1wb3J0YW50OycrJ3dpZHRoOiAxMHB4ICFpbXBvcnRhbnQ7JysnbGVmdDogLTE1cHggIWltcG9ydGFudCd9KTtcbiAgICAgICAgLy8gaXdCYWNrZ3JvdW5kLmNoaWxkcmVuKCc6bnRoLWNoaWxkKDMpJykuY2hpbGRyZW4oJzpudGgtY2hpbGQoMiknKS5maW5kKCdkaXYnKS5hdHRyKCdzdHlsZScsIGZ1bmN0aW9uKGkscyl7IHJldHVybiBzICsgJ2hlaWdodDogMjVweCAhaW1wb3J0YW50OycrJ3dpZHRoOiA5cHggIWltcG9ydGFudDsnKydsZWZ0OiAtMTVweCAhaW1wb3J0YW50J30pO1xuICAgICAgICBpd0Nsb3NlQnRuLmNzcyh7J2Rpc3BsYXknOiAnbm9uZSd9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNob3dfbWFya2VyID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgJHNjb3BlLmhpZGVfc2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLmJvdG9uX3NlYXJjaF9nbG9iYWwgPSBmYWxzZTtcbiAgICAgICAgLy8gZm9yICh2YXIgaSA9IDA7IGkgPCBtYXJrZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIG1hcmtlcltpXS5zZXRNYXAobnVsbCk7XG4gICAgICAgIC8vIH0gIFxuICAgICAgICBcbiAgICAgICAgdmFyIHBvcyA9IHt9O1xuICAgICAgICBwb3MubGF0ID0gcGFyc2VGbG9hdChkYXRhLmxhdCk7XG4gICAgICAgIHBvcy5sbmcgPSBwYXJzZUZsb2F0KGRhdGEubG5nKTtcbiAgICAgICAgY29uc29sZS5sb2cocG9zKTsgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuZGV0YWxsZSA9IGRhdGE7XG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsID0gZmFsc2U7XG4gICAgICAgIC8qIGhhY2Ugem9vbSB5IHJlbmRlcml6YSBsYSBwb3NpY2lvbiAqLyBcbiAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgcG9zaXRpb246IHBvcyxcbiAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCwgXG4gICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLCBcbiAgICAgICAgICAgIHR5cGU6IGRhdGEuaWRfc2VydmljZXMsXG4gICAgICAgICAgICBmb3RvOiBkYXRhLmZvdG8sXG4gICAgICAgICAgICBub21icmVfZW1wcmVzYTogZGF0YS5ub21icmVfZW1wcmVzYSxcbiAgICAgICAgICAgIGRpcmVjY2lvbjogZGF0YS5kaXJlY2Npb24gXG4gICAgICAgIH0pOyAgXG4gICAgICAgIFxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcCwgJ3Jlc2l6ZScpO1xuICAgICAgICB9LDgwMCk7XG4gICAgICAgIG1hcC5zZXRab29tKDE3KTtcbiAgICAgICAgbWFwLnBhblRvKHBvcyk7IFxuICAgIH07XG5cbiAgICAkc2NvcGUuc2VhcmNoX2dsb2JhbCA9IGZ1bmN0aW9uKHNlYXJjaCl7XG4gICAgICAgICRzY29wZS5tYXBhID0gJ2RldGFsbGUnOyBcbiAgICAgICAgJHNjb3BlLmhpZGVfc2VhcmNoID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlOyBcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgPSB0cnVlOyBcbiAgICAgICAgJHNjb3BlLmJvdG9uX3NlYXJjaF9nbG9iYWwgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmxvYWQoc2VhcmNoLDEwLDEpO1xuICAgICAgICAkc2NvcGUuY3JlYXRlTWFya2VyKG1hcCk7XG5cbiAgICB9XG4gICAgJHNjb3BlLnJldHVybiA9IGZ1bmN0aW9uKCl7ICBcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IGZhbHNlOyBcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgICA9IHRydWU7ICBcbiAgICAgICAgJHNjb3BlLnJldHVybl9saXN0ID0gZmFsc2U7IFxuICAgICAgICAkKCcjdWJpY2FjaW9uZXMnKS5jc3MoJ2hlaWdodCcsJzYwNXB4Jyk7XG4gICAgfTtcblxuICAgICRzY29wZS5jb21vX2xsZWdhciA9IGZ1bmN0aW9uKGxhdCwgbG5nKXsgXG4gICAgICAgICRzY29wZS5zaG93X2RldGFsbGUgICAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaW5kaWNhY2lvbl9kZXRhbGxlICAgPSB0cnVlOyBcbiAgICAgICAgJHNjb3BlLnNob3dfcGFuZWwgICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCAgICAgICAgICA9IHRydWU7IFxuICAgICAgICAkc2NvcGUuaGVhZGVyX3NlYXJjaCAgICAgICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLnJldHVybl9saXN0ICAgICAgICAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5ib3Rvbl9zZWFyY2hfZ2xvYmFsICA9IGZhbHNlOyAgXG4gICAgICAgIC8vIG1vc3RyYXIgZWwgaGVhZGVyIGRlIGluZGljYWRvclxuICAgICAgICAkc2NvcGUuaW5wdXRfZW5kID0gbGF0K1wiLFwiK2xuZzsgXG4gICAgICAgICRzY29wZS5pbmRpY2FjaW9uZXMoKTtcbiAgICAgICAgdmFyIGdlb2NvZGluZyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2xhdGxuZz0nICsgJHNjb3BlLmlucHV0X2VuZCArICcmc2Vuc29yPWZhbHNlJzsgXG4gICAgICAgICQuZ2V0SlNPTihnZW9jb2RpbmcpLmRvbmUoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvY2F0aW9uLnJlc3VsdHNbMF0uZm9ybWF0dGVkX2FkZHJlc3MpO1xuICAgICAgICAgICAgJHNjb3BlLnRleHRfZW5kID0gbG9jYXRpb24ucmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcztcbiAgICAgICAgICAgICRzY29wZS4kZGlnZXN0KCk7XG5cbiAgICAgICAgfSk7IFxuXG4gICAgfVxuXG4gICAgJHNjb3BlLnNob3dfZGV0YWxsZV9pbmRpY2FjaW9uZXMgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuZGV0YWxsZV9kaXN0YW5jaWEgPSB0cnVlO1xuICAgIH1cblxuICAgICRzY29wZS5zaG93X2xpc3RfbWFya2VyID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAkc2NvcGUubWFwYSA9ICdkZXRhbGxlJzsgIFxuICAgICAgICAkc2NvcGUuc2hvd19kZXRhbGxlID0gZmFsc2U7IFxuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IHRydWU7ICAgXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgIH0sNTAwKTtcbiAgICAgICAgJHNjb3BlLiRkaWdlc3QoKTtcbiAgICB9XG4gICAgJHNjb3BlLnNob3dfZGV0YWlsX21hcmtlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy51YmljYWNpb25lcycpLmNzcygncGFkZGluZy10b3AnLCcwcHgnKTtcbiAgICAgICAgJHNjb3BlLm1hcGEgPSAnZGV0YWxsZSc7ICBcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSA9IHRydWU7IFxuICAgICAgICAkc2NvcGUuc2hvd19wYW5lbCA9IGZhbHNlOyAgXG4gICAgfVxuXG4gICAgJHNjb3BlLmNsb3NlX2luZGljYWNpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRNYXAobnVsbCk7XG4gICAgICAgICRzY29wZS5tYXBhICAgICAgICAgICAgICAgICA9ICdkZXRhbGxlJztcbiAgICAgICAgJHNjb3BlLmlucHV0X2VuZCAgICAgICAgICAgID0gXCJcIjsgICAgXG4gICAgICAgICRzY29wZS5oZWFkZXJfc2VhcmNoICAgICAgICA9IHRydWU7XG4gICAgICAgICRzY29wZS5oaWRlX3NlYXJjaCAgICAgICAgICA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUuaW5kaWNhY2lvbl9kZXRhbGxlICAgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmJvdG9uX3NlYXJjaF9nbG9iYWwgID0gZmFsc2U7ICBcbiAgICAgICAgJHNjb3BlLnNob3dfZGV0YWxsZSAgICAgICAgID0gZmFsc2U7XG4gICAgICAgICRzY29wZS5zaG93X3BhbmVsICAgICAgICAgICA9IHRydWU7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIobWFwLCAncmVzaXplJyk7XG4gICAgICAgIH0sNTAwKTtcbiAgICB9XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFwLCAnem9vbV9jaGFuZ2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgem9vbSA9IG1hcC5nZXRab29tKCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHpvb20pO1xuICAgICAgICAvLyBpZiAoem9vbSA9PSAyMSkgeyBtYXJrZXIuc2V0SWNvbihuZXcgZ29vZ2xlLm1hcHMuTWFya2VySW1hZ2UoJ2ltYWdlcy9pbWcucG5nJywgbnVsbCwgbnVsbCwgbnVsbCwgbmV3IGdvb2dsZS5tYXBzLlNpemUoMTkwMCwgMTkwMCkpKTsgfVxuICAgIH0pOyBcbiAgICAvLyAkc2NvcGUubGltaXRfY2hhbmdlZCA9IGZ1bmN0aW9uKGlkKXsgXG4gICAgXG4gICAgLy8gfVxuICAgIC8vIEVTVEUgQ09ESUdPIENSRUEgSE9TUElUQUxFU1xuICAgIC8vIHZhciBnZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpOyBcbiAgICAvLyAkc2NvcGUuY3JlYXRlX2hvc3BpdGFsZXMgPSBmdW5jdGlvbigpe1xuICAgIC8vICAgICBTZXJ2aWNlcy5sb2FkX2hvc3BpdGFsZXMoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG4gICAgLy8gICAgICAgICAkc2NvcGUudGVtcF9kYXRhID0gW107XG4gICAgLy8gICAgICAgICAkc2NvcGUucmVzdWx0cyA9IHJlc3BvbnNlLmRhdGE7IFxuICAgIC8vICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5yZXN1bHRzLCBmdW5jdGlvbih2YWx1ZSl7XG5cbiAgICAvLyAgICAgICAgICAgICBnZW9jb2Rlci5nZW9jb2RlKHsgJ2FkZHJlc3MnOiB2YWx1ZS5kaXJlY2Npb259LCBmdW5jdGlvbiBnZW9jb2RlUmVzdWx0KHJlc3VsdHMsIHN0YXR1cykgeyBcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSAnT0snKSB7ICAgIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzdWx0c1swXSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB2YXIgbGF0ID0gcmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQ7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB2YXIgbG5nID0gcmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sbmc7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXJrZXJPcHRpb25zKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgbm9tYnJlX3RlbXAgOiBcIkhPU1BJVEFMIFwiK3ZhbHVlLm5vbWJyZSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBpZF9pbWFnZSA6IHV1aWQudjQoKSxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBub21icmVfZW1wcmVzYSA6IHZhbHVlLm5vbWJyZV9lbXByZXNhLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjY2lvbjogdmFsdWUuZGlyZWNjaW9uLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGhvcmFyaW86ICcnLFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHRlbGVmb25vXzE6IHZhbHVlLnRlbGVmb25vXzEsIFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIGNvcnJlbzogdmFsdWUuY29ycmVvLCBcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBsYXQ6IGxhdCxcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGxuZywgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgaWRfc2VydmljZXM6IDMsXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB2YWx1ZS5saW5rX3dlYlxuXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAkc2NvcGUudGVtcF9kYXRhLnB1c2gob2JqKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS50ZW1wX2RhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyAkc2NvcGUuZ3VhcmRhcl9ob3NwaXRhbGVzKG9iaik7XG4gICAgLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBFbiBjYXNvIGRlIG5vIGhhYmVyIHJlc3VsdGFkb3MgbyBxdWUgaGF5YSBvY3VycmlkbyB1biBlcnJvclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgLy8gbGFuemFtb3MgdW4gbWVuc2FqZSBjb24gZWwgZXJyb3JcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiR2VvY29kaW5nIG5vIHR1dm8gw6l4aXRvIGRlYmlkbyBhOiBcIiArIHN0YXR1cyk7XG4gICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICB9KTsgXG4gICAgICAgICAgICAgICAgXG4gICAgLy8gICAgICAgICB9KSBcbiAgICAvLyAgICAgICAgIC8vICRzY29wZS50ZW1wLnB1c2goJHNjb3BlLmRhdGFfbG9hZCk7ICBcbiAgICAvLyAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH1cbiAgICAvLyAkc2NvcGUuZ3VhcmRhcl9ob3NwaXRhbGVzID0gZnVuY3Rpb24gKGRhdGEpeyAgXG4gICAgLy8gICAgIFNlcnZpY2VzLkNyZWF0ZShkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIC8vICAgICAgICAgLy8gJHNjb3BlLmluaXQoKTtcbiAgICAvLyAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH07XG4gICAgLy8gJHNjb3BlLmNyZWF0ZV9ob3NwaXRhbGVzKCk7XG4gICAgXG59XSk7IFxubW9kZWwuZGlyZWN0aXZlKCd0b29sdGlwJywgZnVuY3Rpb24oKXtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgICAgICAgJChlbGVtZW50KS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIG9uIG1vdXNlZW50ZXJcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnRvb2x0aXAoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8gb24gbW91c2VsZWF2ZVxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkudG9vbHRpcCgnaGlkZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufSk7XG4vLyBtb2RlbC5maWx0ZXIoJ3N0ckxpbWl0JywgWyckZmlsdGVyJywgZnVuY3Rpb24oJGZpbHRlcikge1xuLy8gICAgIHJldHVybiBmdW5jdGlvbihpbnB1dCwgbGltaXQpIHtcbi8vICAgICAgIGlmICghIGlucHV0KSByZXR1cm47XG4vLyAgICAgICBpZiAoaW5wdXQubGVuZ3RoIDw9IGxpbWl0KSB7XG4vLyAgICAgICAgICAgcmV0dXJuIGlucHV0O1xuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gJGZpbHRlcignbGltaXRUbycpKGlucHV0LCBsaW1pdCkgKyAnLi4uJztcbi8vICAgIH07XG4vLyB9XSk7XG5cbn0pKCk7XG5cbi8qIFxuICAgIDEuIGN1YW5kbyBlbCB1c3VhcmlvIGVzY3JpYmEgbGUgbXVlc3RyZSB1biBsaXN0YWRvIGRlIGVudGlkYWRlc1xuICAgIDIuIGN1YW5kbyBzZSB1YmljYSBubyBoYXlhIG1hcmNhZG9yZXNcbiAgICAzLiBsaW1pdGFjaW9uZXM6IHRvZG9zIGxvcyB1c3VhcmlvcyB0aWVuZW4gcXVlIGNvbnRhciBjb24gdW4gc21hcnRwaG9uZSBxdWUgdGVuZ2EgZ3BzXG4qLyIsIihmdW5jdGlvbiAoKSB7XG4ndXNlIHN0cmljdCc7XG5hbmd1bGFyLm1vZHVsZSgnU2VydmljZXMnLCBbXSlcbi5mYWN0b3J5KCdTZXJ2aWNlcycsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgcmV0dXJuIHsgXG4gICAgICAgIExvYWQ6IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL2xvY2F0aW9ucz9ub21icmU9JytxKycmcGVyX3BhZ2U9JytwKycmcGFnZT0nK3BhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIExvYWRfU2VydmljZXM6IGZ1bmN0aW9uKHEscCxwYWdlKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzP25vbWJyZT0nK3ErJyZwZXJfcGFnZT0nK3ArJyZwYWdlPScrcGFnZSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpeyAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgVXBkYXRlX2ltZzogZnVuY3Rpb24oaWQsZGF0YSl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucHV0KGJhc2VfdXJsICsnL2FwaS92MS9sb2NhdGlvbnMvJytpZCxkYXRhKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbG9hZF9ob3NwaXRhbGVzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL2dydXBvYWl6ZW4uY29tL2hvc3BpdGFsZXMuanNvbicpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKXsgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgYWxsQm9tYmVyb3M6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvJytpZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19saW1hX2NvbWFuOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DZEJ5SWQvMjA0MDAwJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19saW1hX2NvbXBhOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DaWFzQnlJZC8yMDQwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19jYWxsYW9fY29tYW46IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NkQnlJZC8yMDUwMDAnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBib21iZXJvc19jYWxsYW9fY29tcGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NpYXNCeUlkLzIwNTAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGJvbWJlcm9zX2xpbWFfc3VyX2NvbWFuOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLmdldCgnaHR0cDovL3d3dy5ib21iZXJvc3BlcnUuZ29iLnBlL1djZlNlcnZpY2VGb3JJbnNlcnQvQ2RTZXJ2aWNlLnN2Yy9DZEJ5SWQvMjI0MDAwJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfbGltYV9zdXJfY29tcGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NpYXNCeUlkLzIyNDAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgYm9tYmVyb3NfbGltYV9ub3J0ZV9jb21hbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJ2h0dHA6Ly93d3cuYm9tYmVyb3NwZXJ1LmdvYi5wZS9XY2ZTZXJ2aWNlRm9ySW5zZXJ0L0NkU2VydmljZS5zdmMvQ2RCeUlkLzIyNTAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGJvbWJlcm9zX2xpbWFfbm9ydGVfY29tcGE6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCdodHRwOi8vd3d3LmJvbWJlcm9zcGVydS5nb2IucGUvV2NmU2VydmljZUZvckluc2VydC9DZFNlcnZpY2Uuc3ZjL0NpYXNCeUlkLzIyNTAwMCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH07XG59KTsgXG59KSgpOyJdfQ==
