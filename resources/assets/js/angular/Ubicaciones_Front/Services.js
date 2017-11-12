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