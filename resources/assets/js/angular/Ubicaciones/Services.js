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