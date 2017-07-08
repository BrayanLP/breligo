!function(){"use strict";var e=angular.module("model",["Services"]);e.controller("Ctrl",["$scope","$http","upload","CSRF_TOKEN","$timeout","Services",function(e,t,n,o,a,r){e.cant_rows="10";e.path=window.location.href,e.load=function(t,n,o){void 0==t&&(t=""),r.Load(t,n,o).then(function(t){e.data_load=t.data,e.to=t.to,e.total=t.total,e.last_page=t.last_page,e.current_page=t.current_page,e.next_page_url=t.next_page_url,e.prev_page_url=t.prev_page_url,null!==e.prev_page_url&&(e.prev_page_url=e.prev_page_url.replace("?page=","")),null!==e.next_page_url&&(e.next_page_url=e.next_page_url.replace("?page=",""))},function(e){})},e.array=["cant_rows","search_text"],e.$watchGroup(e.array,function(t){void 0!=t?e.load(e.search_text,e.cant_rows,1):e.load("",e.cant_rows,1)}),e.init=function(){e.load("",e.cant_rows,1)},e.show=function(t){e.edit_copia={},r.Edit(t).then(function(t){e.edit=t,e.edit_copia.n=t.nombre},function(e){})},e.update=function(t){e.edit_copia.n!=e.edit.nombre?swal({title:"Desea Actualizar?",text:"confirmar si esta seguro de actualizar el registro",type:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Si, Actualizar",allowOutsideClick:!1}).then(function(){var n;n={nombre:e.edit.nombre},r.Update(t,n).then(function(t){e.message(t),$("#edit").modal("hide"),e.init()},function(e){})}):(displayToastr("info","No se realizaron cambios","Notificación"),$("#edit").modal("hide"))},e.delete=function(t){swal({title:"Quieres Eliminar?",text:"confirmar si esta seguro de eliminar el registro",type:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Si, Eliminar",allowOutsideClick:!1}).then(function(){r.Delete(t).then(function(t){e.message(t),e.init()},function(e){})})},e.files=[],e.$on("fileSelected",function(t,n){e.$apply(function(){e.files.push(n.file)})}),e.uploadFile=function(){var t=e.icon;n.uploadFile(t).then(function(e){console.log(e)})},e.guardar=function(){swal({title:"Desea Crear?",text:"confirmar si esta seguro de crear el registro",type:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Si, crear",allowOutsideClick:!1}).then(function(){var n=document.getElementById("add"),a=new FormData(n);a.append("_token",o),t({method:"POST",url:base_url+"/api/v1/services",headers:{"Content-Type":void 0},data:a,processData:!1,cache:!1}).success(function(t){e.message(t)}).error(function(t){e.message(t)},function(t){e.message(t)})})},e.clear_input=function(){$("input[name='icon']").val(""),$("input[name='nombre']").val("")},e.message=function(e){202==e.status?displayToastr("warning",e.message,"Campos Requeridos"):200==e.status?displayToastr("success",e.message,"Felicitaciones"):displayToastr("error","Registro ocurrio un error Inesperado","Que paso?")}}]),e.directive("uploaderModel",["$parse",function(e){return{restrict:"A",link:function(t,n,o){n.on("change",function(a){e(o.uploaderModel).assign(t,n[0].files[0])})}}}]),e.service("upload",["$http","$q",function(e,t){this.uploadFile=function(n){var o=t.defer();console.log(base_url);var a=document.getElementById("add"),r=new FormData(a);return r.append("icon",n),e.post(base_url+"/api/v1/services/uploadFile",r,{headers:{"Content-type":void 0},data:r,processData:!1,transformRequest:r}).success(function(e){o.resolve(e),console.log(e)}).error(function(e,t){o.reject(e),console.log(e)})}}])}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvU2VydmljaW9zL0N0cmwuanMiXSwibmFtZXMiOlsibW9kZWwiLCJhbmd1bGFyIiwibW9kdWxlIiwiY29udHJvbGxlciIsIiRzY29wZSIsIiRodHRwIiwidXBsb2FkIiwiQ1NSRl9UT0tFTiIsIiR0aW1lb3V0IiwiU2VydmljZXMiLCJjYW50X3Jvd3MiLCJwYXRoIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwibG9hZCIsInEiLCJwIiwicGFnZSIsInVuZGVmaW5lZCIsIkxvYWQiLCJ0aGVuIiwicmVzcG9uc2UiLCJkYXRhX2xvYWQiLCJkYXRhIiwidG8iLCJ0b3RhbCIsImxhc3RfcGFnZSIsImN1cnJlbnRfcGFnZSIsIm5leHRfcGFnZV91cmwiLCJwcmV2X3BhZ2VfdXJsIiwicmVwbGFjZSIsImFycmF5IiwiJHdhdGNoR3JvdXAiLCJuIiwic2VhcmNoX3RleHQiLCJpbml0Iiwic2hvdyIsImlkIiwiZWRpdF9jb3BpYSIsIkVkaXQiLCJlZGl0Iiwibm9tYnJlIiwidXBkYXRlIiwic3dhbCIsInRpdGxlIiwidGV4dCIsInR5cGUiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY29uZmlybUJ1dHRvbkNvbG9yIiwiY2FuY2VsQnV0dG9uQ29sb3IiLCJjb25maXJtQnV0dG9uVGV4dCIsImFsbG93T3V0c2lkZUNsaWNrIiwiVXBkYXRlIiwibWVzc2FnZSIsIiQiLCJtb2RhbCIsImRpc3BsYXlUb2FzdHIiLCJkZWxldGUiLCJEZWxldGUiLCJmaWxlcyIsIiRvbiIsImV2ZW50IiwiYXJncyIsIiRhcHBseSIsInB1c2giLCJmaWxlIiwidXBsb2FkRmlsZSIsImljb24iLCJyZXMiLCJjb25zb2xlIiwibG9nIiwiZ3VhcmRhciIsImZvcm1FbGVtZW50IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJtZXRob2QiLCJ1cmwiLCJiYXNlX3VybCIsImhlYWRlcnMiLCJDb250ZW50LVR5cGUiLCJwcm9jZXNzRGF0YSIsImNhY2hlIiwic3VjY2VzcyIsImVycm9yIiwiY2xlYXJfaW5wdXQiLCJ2YWwiLCJzdGF0dXMiLCJkaXJlY3RpdmUiLCIkcGFyc2UiLCJyZXN0cmljdCIsImxpbmsiLCJzY29wZSIsImlFbGVtZW50IiwiaUF0dHJzIiwib24iLCJlIiwidXBsb2FkZXJNb2RlbCIsImFzc2lnbiIsInNlcnZpY2UiLCIkcSIsInRoaXMiLCJkZWZlcnJlZCIsImRlZmVyIiwiZm9ybV9lZGl0IiwicG9zdCIsIkNvbnRlbnQtdHlwZSIsInRyYW5zZm9ybVJlcXVlc3QiLCJyZXNvbHZlIiwibXNnIiwiY29kZSIsInJlamVjdCJdLCJtYXBwaW5ncyI6IkNBQUEsV0FDQSxZQUNBLElBQUlBLEdBQVFDLFFBQVFDLE9BQU8sU0FDdEIsWUFJTEYsR0FBTUcsV0FBVyxRQUNaLFNBQ0QsUUFDQSxTQUNBLGFBQ0EsV0FDQSxXQUNBLFNBQ0lDLEVBQ0FDLEVBQ0FDLEVBQ0FDLEVBQ0FDLEVBQ0FDLEdBRUpMLEVBQU9NLFVBQVksSUFLbkJOLEdBQU9PLEtBQU9DLE9BQU9DLFNBQVNDLEtBRzlCVixFQUFPVyxLQUFPLFNBQVNDLEVBQUVDLEVBQUVDLE9BQ2ZDLElBQUxILElBQ0NBLEVBQUksSUFFUlAsRUFBU1csS0FBS0osRUFBRUMsRUFBRUMsR0FBTUcsS0FBSyxTQUFVQyxHQUNuQ2xCLEVBQU9tQixVQUFZRCxFQUFTRSxLQUM1QnBCLEVBQU9xQixHQUFLSCxFQUFTRyxHQUNyQnJCLEVBQU9zQixNQUFRSixFQUFTSSxNQUN4QnRCLEVBQU91QixVQUFZTCxFQUFTSyxVQUM1QnZCLEVBQU93QixhQUFlTixFQUFTTSxhQUMvQnhCLEVBQU95QixjQUFnQlAsRUFBU08sY0FDaEN6QixFQUFPMEIsY0FBZ0JSLEVBQVNRLGNBQ0osT0FBekIxQixFQUFPMEIsZ0JBQ04xQixFQUFPMEIsY0FBZ0IxQixFQUFPMEIsY0FBY0MsUUFBUSxTQUFTLEtBRXJDLE9BQXpCM0IsRUFBT3lCLGdCQUNOekIsRUFBT3lCLGNBQWdCekIsRUFBT3lCLGNB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QVNnQyxRQUFRLHFCQUVqQixLQUFuQmhDLEVBQVNvRSxPQUNkakMsY0FBYyxVQUFVbkMsRUFBU2dDLFFBQVMsa0JBRzFDRyxjQUFjLFFBQVEsdUNBQXVDLGlCQXlCekV6RCxFQUFNMkYsVUFBVSxpQkFBa0IsU0FBVSxTQUFVQyxHQUNsRCxPQUNJQyxTQUFVLElBQ1ZDLEtBQU0sU0FBVUMsRUFBT0MsRUFBVUMsR0FFN0JELEVBQVNFLEdBQUcsU0FBVSxTQUFTQyxHQUUzQlAsRUFBT0ssRUFBT0csZUFBZUMsT0FBT04sRUFBT0MsRUFBUyxHQUFHcEMsTUFBTSxXQU03RTVELEVBQU1zRyxRQUFRLFVBQVcsUUFBUyxLQUFNLFNBQVVqRyxFQUFPa0csR0FFckRDLEtBQUtyQyxXQUFhLFNBQVNELEdBRXZCLEdBQUl1QyxHQUFXRixFQUFHRyxPQUNsQnBDLFNBQVFDLElBQUlVLFNBQ1osSUFBSTBCLEdBQVlqQyxTQUFTQyxlQUFlLE9BRXBDQyxFQUFXLEdBQUlDLFVBQVM4QixFQUc1QixPQURBL0IsR0FBU0UsT0FBTyxPQUFRWixHQUNqQjdELEVBQU11RyxLQUFLM0IsU0FBVyw4QkFBK0JMLEdBQ3hETSxTQUNJMkIsbUJBQWdCMUYsSUFFcEJLLEtBQU1vRCxFQUNOUSxhQUFZLEVBQ1owQixpQkFBa0JsQyxJQUVyQlUsUUFBUSxTQUFTakIsR0FFZG9DLEVBQVNNLFFBQVExQyxHQUNqQkMsUUFBUUMsSUFBSUYsS0FFZmtCLE1BQU0sU0FBU3lCLEVBQUtDLEdBRWpCUixFQUFTUyxPQUFPRixHQUNoQjFDLFFBQVFDLElBQUl5QyIsImZpbGUiOiJhbmd1bGFyL1NlcnZpY2lvcy9DdHJsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbid1c2Ugc3RyaWN0JztcbnZhciBtb2RlbCA9IGFuZ3VsYXIubW9kdWxlKCdtb2RlbCcsIFxuICAgIFsnU2VydmljZXMnIF0pO1xuXG52YXIgc2VsZXRlZFZhbHVlID0gMTU7XG5cbm1vZGVsLmNvbnRyb2xsZXIoJ0N0cmwnLCBcbiAgICBbJyRzY29wZScsXG4gICAgJyRodHRwJyxcbiAgICAndXBsb2FkJyxcbiAgICAnQ1NSRl9UT0tFTicsXG4gICAgJyR0aW1lb3V0JyxcbiAgICAnU2VydmljZXMnLCBcbiAgICBmdW5jdGlvbihcbiAgICAgICAgJHNjb3BlLFxuICAgICAgICAkaHR0cCxcbiAgICAgICAgdXBsb2FkLFxuICAgICAgICBDU1JGX1RPS0VOLFxuICAgICAgICAkdGltZW91dCxcbiAgICAgICAgU2VydmljZXMpXG57IFxuICAgICRzY29wZS5jYW50X3Jvd3MgPSBcIjEwXCI7XG4gICAgdmFyIGh0bWwgPSBmdW5jdGlvbihpZCkgeyBcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTsgXG4gICAgfTsgXG5cbiAgICAkc2NvcGUucGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIC8vIGNvbnNvbGUubG9nKCRzY29wZS5wYXRoLGJhc2VfdXJsKTtcbiAgXG4gICAgJHNjb3BlLmxvYWQgPSBmdW5jdGlvbihxLHAscGFnZSl7XG4gICAgICAgIGlmKHEgPT0gdW5kZWZpbmVkKXsgXG4gICAgICAgICAgICBxID0gXCJcIjtcbiAgICAgICAgfSAgXG4gICAgICAgIFNlcnZpY2VzLkxvYWQocSxwLHBhZ2UpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZGF0YV9sb2FkID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgICRzY29wZS50byA9IHJlc3BvbnNlLnRvOyBcbiAgICAgICAgICAgICRzY29wZS50b3RhbCA9IHJlc3BvbnNlLnRvdGFsO1xuICAgICAgICAgICAgJHNjb3BlLmxhc3RfcGFnZSA9IHJlc3BvbnNlLmxhc3RfcGFnZTtcbiAgICAgICAgICAgICRzY29wZS5jdXJyZW50X3BhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgICAgICAgICAkc2NvcGUubmV4dF9wYWdlX3VybCA9IHJlc3BvbnNlLm5leHRfcGFnZV91cmw7XG4gICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9IHJlc3BvbnNlLnByZXZfcGFnZV91cmw7IFxuICAgICAgICAgICAgaWYoJHNjb3BlLnByZXZfcGFnZV91cmwgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJldl9wYWdlX3VybCA9ICRzY29wZS5wcmV2X3BhZ2VfdXJsLnJlcGxhY2UoXCI/cGFnZT1cIixcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCRzY29wZS5uZXh0X3BhZ2VfdXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgJHNjb3BlLm5leHRfcGFnZV91cmwgPSAkc2NvcGUubmV4dF9wYWdlX3VybC5yZXBsYWNlKFwiP3BhZ2U9XCIsXCJcIik7IFxuICAgICAgICAgICAgfSAgXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB9KTsgXG4gICAgfVxuICAgIC8vICRzY29wZS5sb2FkKCcnLCRzY29wZS5jYW50X3Jvd3MsMSk7IFxuICAgICRzY29wZS5hcnJheSA9IFsnY2FudF9yb3dzJywnc2VhcmNoX3RleHQnXTtcbiAgICAkc2NvcGUuJHdhdGNoR3JvdXAoJHNjb3BlLmFycmF5LCBmdW5jdGlvbihuKXtcbiAgICAgICAgaWYobiAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgJHNjb3BlLmxvYWQoJHNjb3BlLnNlYXJjaF90ZXh0LCRzY29wZS5jYW50X3Jvd3MsMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICRzY29wZS5sb2FkKCcnLCRzY29wZS5jYW50X3Jvd3MsMSk7XG4gICAgICAgIH1cbiAgICB9KTsgXG4gICAgJHNjb3BlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUubG9hZCgnJywkc2NvcGUuY2FudF9yb3dzLDEpO1xuICAgIH0gIFxuIFxuICAgICRzY29wZS5zaG93ID0gZnVuY3Rpb24oaWQpe1xuICAgICAgICAkc2NvcGUuZWRpdF9jb3BpYSA9IHt9O1xuICAgICAgICBTZXJ2aWNlcy5FZGl0KGlkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgJHNjb3BlLmVkaXQgPSByZXNwb25zZTtcbiAgICAgICAgICAgIC8vICQoJ2lucHV0W25hbWU9XCJub21icmVfZWRpdFwiXScpLnZhbChyZXNwb25zZS5ub21icmUpOyBcbiAgICAgICAgICAgICRzY29wZS5lZGl0X2NvcGlhLm4gPSByZXNwb25zZS5ub21icmU7IFxuICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgICAgJHNjb3BlLnVwbG9hZEZpbGUoKTtcbiAgICAvLyAgICAgJHNjb3BlLmVkaXRfY29waWEgPSB7fTtcbiAgICAvLyAgICAgdmFyIHN0b3JlO1xuICAgIC8vICAgICBzdG9yZSA9XG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIG5vbWJyZTokc2NvcGUuY3JlYXRlLm5vbWJyZVxuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKHN0b3JlLCAkKFwiaW5wdXRbbmFtZT0naWNvbiddXCIpLnZhbCgpKTtcbiAgICAvLyAgICAgU2VydmljZXMuQ3JlYXRlKHN0b3JlKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgJHNjb3BlLm1lc3NhZ2UocmVzcG9uc2UpO1xuICAgIC8vICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIC8vICAgICAgICAgJCgnI2NyZWF0ZScpLm1vZGFsKCdoaWRlJyk7XG4gICAgLy8gICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgIC8vICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAvLyAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gfTtcbiAgIC8vICAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24obWVzc2FnZSl7IFxuICAgLy8gICAgICB2YXIgZm9ybUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlcnZfYWRkXCIpO1xuICAgLy8gICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybUVsZW1lbnQpO1xuICAgLy8gICAgICBjb25zb2xlLmxvZyhmb3JtRGF0YSk7XG4gICAvLyAgICAgIGZvcm1EYXRhLmFwcGVuZCgnX3Rva2VuJywgQ1NSRl9UT0tFTik7XG4gICAvLyAgICAgICRodHRwKHtcbiAgIC8vICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAvLyAgICAgICAgIHVybDogYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzJyxcbiAgIC8vICAgICAgICAgZGF0YTogZm9ybURhdGEsXG4gICAvLyAgICAgICAgIGhlYWRlcnM6IHsnZW5jdHlwZSc6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJ30sXG4gICAvLyAgICAgICAgIHByb2Nlc3NEYXRhOmZhbHNlLFxuICAgLy8gICAgICAgICBjYWNoZTpmYWxzZVxuICAgLy8gICAgICB9KS4gXG4gICAvLyAgICAgc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAvLyAgICAgICAgICAkKCcjY3JlYXRlJykubW9kYWwoJ2hpZGUnKTtcbiAgIC8vICAgICAgICAgICRzY29wZS5pbml0KCk7IFxuICAgLy8gICAgIH0pOyBcbiAgIC8vIH07XG4gICAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgaWYoJHNjb3BlLmVkaXRfY29waWEubiAhPSAkc2NvcGUuZWRpdC5ub21icmUpeyBcbiAgICAgICAgICAgIHN3YWwoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRGVzZWEgQWN0dWFsaXphcj8nLFxuICAgICAgICAgICAgICAgIHRleHQ6IFwiY29uZmlybWFyIHNpIGVzdGEgc2VndXJvIGRlIGFjdHVhbGl6YXIgZWwgcmVnaXN0cm9cIixcbiAgICAgICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMzA4NWQ2JyxcbiAgICAgICAgICAgICAgICBjYW5jZWxCdXR0b25Db2xvcjogJyNkMzMnLFxuICAgICAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnU2ksIEFjdHVhbGl6YXInLFxuICAgICAgICAgICAgICAgIGFsbG93T3V0c2lkZUNsaWNrOiBmYWxzZVxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7IFxuICAgICAgICAgICAgICAgIHZhciB1cGRhdGU7XG4gICAgICAgICAgICAgICAgdXBkYXRlID0ge1xuICAgICAgICAgICAgICAgICAgICBub21icmU6JHNjb3BlLmVkaXQubm9tYnJlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFNlcnZpY2VzLlVwZGF0ZShpZCx1cGRhdGUpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2VkaXQnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGRpc3BsYXlUb2FzdHIoJ2luZm8nLCdObyBzZSByZWFsaXphcm9uIGNhbWJpb3MnLCdOb3RpZmljYWNpw7NuJyk7XG4gICAgICAgICAgICAkKCcjZWRpdCcpLm1vZGFsKCdoaWRlJyk7ICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xuICAgICRzY29wZS5kZWxldGUgPSBmdW5jdGlvbihpZCl7IFxuICAgICAgICBzd2FsKHtcbiAgICAgICAgICAgIHRpdGxlOiAnUXVpZXJlcyBFbGltaW5hcj8nLFxuICAgICAgICAgICAgdGV4dDogXCJjb25maXJtYXIgc2kgZXN0YSBzZWd1cm8gZGUgZWxpbWluYXIgZWwgcmVnaXN0cm9cIixcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMzA4NWQ2JyxcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvbkNvbG9yOiAnI2QzMycsXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ1NpLCBFbGltaW5hcicsXG4gICAgICAgICAgICBhbGxvd091dHNpZGVDbGljazogZmFsc2VcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7IFxuICAgICAgICAgICAgU2VydmljZXMuRGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuaW5pdCgpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTsgXG5cbiAgICAkc2NvcGUuZmlsZXMgPSBbXTsgXG4gICAgJHNjb3BlLiRvbihcImZpbGVTZWxlY3RlZFwiLCBmdW5jdGlvbiAoZXZlbnQsIGFyZ3MpIHtcbiAgICAgICAgJHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7ICAgIFxuICAgICAgICAgICAgJHNjb3BlLmZpbGVzLnB1c2goYXJncy5maWxlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7IFxuICAgICRzY29wZS51cGxvYWRGaWxlID0gZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgLy8gdmFyIG5hbWUgPSAkc2NvcGUubmFtZTtcbiAgICAgICAgdmFyIGZpbGUgPSAkc2NvcGUuaWNvbjtcbiAgICAgICAgXG4gICAgICAgIHVwbG9hZC51cGxvYWRGaWxlKGZpbGUpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmd1YXJkYXIgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ0Rlc2VhIENyZWFyPycsXG4gICAgICAgICAgICB0ZXh0OiBcImNvbmZpcm1hciBzaSBlc3RhIHNlZ3VybyBkZSBjcmVhciBlbCByZWdpc3Ryb1wiLFxuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogJyMzMDg1ZDYnLFxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uQ29sb3I6ICcjZDMzJyxcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnU2ksIGNyZWFyJyxcbiAgICAgICAgICAgIGFsbG93T3V0c2lkZUNsaWNrOiBmYWxzZVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHsgXG4gICAgICAgICAgICB2YXIgZm9ybUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZFwiKTtcbiAgICAgICAgICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtRWxlbWVudCk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ190b2tlbicsIENTUkZfVE9LRU4pO1xuICAgICAgICAgICAgJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLCBcbiAgICAgICAgICAgICAgICB1cmw6IGJhc2VfdXJsICsnL2FwaS92MS9zZXJ2aWNlcycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiB1bmRlZmluZWQgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTpmYWxzZSxcbiAgICAgICAgICAgICAgICBjYWNoZTpmYWxzZVxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkgeyBcbiAgICAgICAgICAgICAgICAkc2NvcGUubWVzc2FnZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTsgXG4gICAgICAgICAgICB9LGZ1bmN0aW9uKHJlc3BvbnNlKXsgIFxuICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlKHJlc3BvbnNlKTsgIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmNsZWFyX2lucHV0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJChcImlucHV0W25hbWU9J2ljb24nXVwiKS52YWwoJycpO1xuICAgICAgICAkKFwiaW5wdXRbbmFtZT0nbm9tYnJlJ11cIikudmFsKCcnKTsgXG4gICAgfVxuICAgICRzY29wZS5tZXNzYWdlID0gZnVuY3Rpb24ocmVzcG9uc2UpeyBcbiAgICAgICAgaWYoIHJlc3BvbnNlLnN0YXR1cyA9PSAyMDIgKXsgXG4gICAgICAgICAgICBkaXNwbGF5VG9hc3RyKCd3YXJuaW5nJyxyZXNwb25zZS5tZXNzYWdlLCdDYW1wb3MgUmVxdWVyaWRvcycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoIHJlc3BvbnNlLnN0YXR1cyA9PSAyMDAgKXtcbiAgICAgICAgICAgIGRpc3BsYXlUb2FzdHIoJ3N1Y2Nlc3MnLHJlc3BvbnNlLm1lc3NhZ2UgLCdGZWxpY2l0YWNpb25lcycpOyAgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBkaXNwbGF5VG9hc3RyKCdlcnJvcicsJ1JlZ2lzdHJvIG9jdXJyaW8gdW4gZXJyb3IgSW5lc3BlcmFkbycsJ1F1ZSBwYXNvPycpOyAgICAgIFxuICAgICAgICB9XG4gICAgfSAgICAgIFxuICAgIC8vICRzY29wZS51cGRhdGUgPSBmdW5jdGlvbiAoaWQpeyBcbiAgICAvLyAgICAgdmFyIGZvcm1fZWRpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKTtcblxuICAgIC8vICAgICB2YXIgZm9ybURhdGFfZWRpdCA9IG5ldyBGb3JtRGF0YV9lZGl0KGZvcm1fZWRpdCk7XG4gICAgLy8gICAgIGZvcm1EYXRhX2VkaXQuYXBwZW5kKCdfdG9rZW4nLCBDU1JGX1RPS0VOKTtcblxuICAgIC8vICAgICAkaHR0cCh7XG4gICAgLy8gICAgICAgICBtZXRob2Q6ICdQVVQnLCBcbiAgICAvLyAgICAgICAgIHVybDogYmFzZV91cmwgKycvYXBpL3YxL3NlcnZpY2VzLycraWQsXG4gICAgLy8gICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZCB9LFxuICAgIC8vICAgICAgICAgZGF0YTogZm9ybURhdGFfZWRpdCxcbiAgICAvLyAgICAgICAgIHByb2Nlc3NEYXRhOmZhbHNlLFxuICAgIC8vICAgICAgICAgY2FjaGU6ZmFsc2VcbiAgICAvLyAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihyZXNwb25zZSkge1xuICAgIC8vICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpOyBcbiAgICAgICAgICAgICBcbiAgICAvLyAgICAgfSxmdW5jdGlvbihyZXNwb25zZSl7ICAgXG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH07XG4gICAgIFxuIFxufV0pO1xubW9kZWwuZGlyZWN0aXZlKCd1cGxvYWRlck1vZGVsJywgW1wiJHBhcnNlXCIsIGZ1bmN0aW9uICgkcGFyc2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMpIFxuICAgICAgICB7XG4gICAgICAgICAgICBpRWxlbWVudC5vbihcImNoYW5nZVwiLCBmdW5jdGlvbihlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICRwYXJzZShpQXR0cnMudXBsb2FkZXJNb2RlbCkuYXNzaWduKHNjb3BlLCBpRWxlbWVudFswXS5maWxlc1swXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59XSlcblxubW9kZWwuc2VydmljZSgndXBsb2FkJywgW1wiJGh0dHBcIiwgXCIkcVwiLCBmdW5jdGlvbiAoJGh0dHAsICRxKSBcbntcbiAgICB0aGlzLnVwbG9hZEZpbGUgPSBmdW5jdGlvbihmaWxlKVxuICAgIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgY29uc29sZS5sb2coYmFzZV91cmwpO1xuICAgICAgICB2YXIgZm9ybV9lZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGRcIik7XG4gICAgICAgIC8vIHZhciBmb3JtRGF0YV9lZGl0ID0gbmV3IEZvcm1EYXRhX2VkaXQoZm9ybV9lZGl0KTtcbiAgICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm1fZWRpdCk7XG4gICAgICAgIC8vIGZvcm1EYXRhLmFwcGVuZChcIm5hbWVcIiwgbmFtZSk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImljb25cIiwgZmlsZSk7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGJhc2VfdXJsICsgXCIvYXBpL3YxL3NlcnZpY2VzL3VwbG9hZEZpbGVcIiwgZm9ybURhdGEsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOmZhbHNlLFxuICAgICAgICAgICAgdHJhbnNmb3JtUmVxdWVzdDogZm9ybURhdGFcbiAgICAgICAgfSlcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzKVxuICAgICAgICB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICB9KVxuICAgICAgICAuZXJyb3IoZnVuY3Rpb24obXNnLCBjb2RlKVxuICAgICAgICB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobXNnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0gICBcbn1dKVxuLy8gbW9kZWwuZGlyZWN0aXZlKCdmaWxlVXBsb2FkJywgZnVuY3Rpb24gKCkge1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIHNjb3BlOiB0cnVlLCAgICAgICAgLy9jcmVhdGUgYSBuZXcgc2NvcGVcbi8vICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbCwgYXR0cnMpIHtcbi8vICAgICAgICAgICAgIGVsLmJpbmQoJ2NoYW5nZScsIGZ1bmN0aW9uIChldmVudCkge1xuLy8gICAgICAgICAgICAgICAgIHZhciBmaWxlcyA9IGV2ZW50LnRhcmdldC5maWxlcztcbi8vICAgICAgICAgICAgICAgICAvL2l0ZXJhdGUgZmlsZXMgc2luY2UgJ211bHRpcGxlJyBtYXkgYmUgc3BlY2lmaWVkIG9uIHRoZSBlbGVtZW50XG4vLyAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7aTxmaWxlcy5sZW5ndGg7aSsrKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIC8vZW1pdCBldmVudCB1cHdhcmRcbi8vICAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGVtaXQoXCJmaWxlU2VsZWN0ZWRcIiwgeyBmaWxlOiBmaWxlc1tpXSB9KTtcbi8vICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuLy8gICAgIH07XG4vLyB9KTtcbi8vIG1vZGVsLmRpcmVjdGl2ZShcImZpbGVzSW5wdXRcIiwgZnVuY3Rpb24oKSB7XG4vLyAgIHJldHVybiB7XG4vLyAgICAgcmVxdWlyZTogXCJuZ01vZGVsXCIsXG4vLyAgICAgbGluazogZnVuY3Rpb24gcG9zdExpbmsoc2NvcGUsZWxlbSxhdHRycyxuZ01vZGVsKSB7XG4vLyAgICAgICBlbGVtLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGUpIHtcbi8vICAgICAgICAgdmFyIGltZyA9IGVsZW1bMF0uZmlsZXM7XG4vLyAgICAgICAgIGNvbnNvbGUubG9nKG5nTW9kZWwuJHNldFZpZXdWYWx1ZShpbWcpKTtcbi8vICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGltZyk7XG4vLyAgICAgICB9KVxuLy8gICAgIH1cbi8vICAgfVxuLy8gfSk7XG4vLyBtb2RlbC5kaXJlY3RpdmUoJ2ZpbGVJbnB1dCcsIFsnJHBhcnNlJywgZnVuY3Rpb24gKCRwYXJzZSkge1xuLy8gICAgIHJldHVybiB7XG4vLyAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4vLyAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuLy8gICAgICAgICAgICAgZWxlbWVudC5iaW5kKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgICAgICAgJHBhcnNlKGF0dHJpYnV0ZXMuZmlsZUlucHV0KVxuLy8gICAgICAgICAgICAgICAgIC5hc3NpZ24oc2NvcGUsZWxlbWVudFswXS5maWxlcylcbi8vICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKVxuLy8gICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgIH1cbi8vICAgICB9O1xuLy8gfV0pO1xuLy8gbW9kZWwuZGlyZWN0aXZlKFwiZmlsZXJlYWRcIiwgW2Z1bmN0aW9uICgpIHtcbi8vICAgICByZXR1cm4ge1xuLy8gICAgICAgICBzY29wZToge1xuLy8gICAgICAgICAgICAgZmlsZXJlYWQ6IFwiPVwiXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuLy8gICAgICAgICAgICAgZWxlbWVudC5iaW5kKFwiY2hhbmdlXCIsIGZ1bmN0aW9uIChjaGFuZ2VFdmVudCkge1xuLy8gICAgICAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuLy8gICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAobG9hZEV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5maWxlcmVhZCA9IGxvYWRFdmVudC50YXJnZXQucmVzdWx0O1xuLy8gICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoY2hhbmdlRXZlbnQudGFyZ2V0LmZpbGVzWzBdKTtcbi8vICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9XG4vLyAgICAgfVxuLy8gfV0pO1xuLy8gbW9kZWwuZGlyZWN0aXZlKCdiaW5kRmlsZScsIFtmdW5jdGlvbiAoKSB7XG4vLyAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgcmVxdWlyZTogXCJuZ01vZGVsXCIsXG4vLyAgICAgICAgIHJlc3RyaWN0OiAnQScsXG4vLyAgICAgICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUsIGVsLCBhdHRycywgbmdNb2RlbCkge1xuLy8gICAgICAgICAgICAgZWwuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4vLyAgICAgICAgICAgICAgICAgbmdNb2RlbC4kc2V0Vmlld1ZhbHVlKGV2ZW50LnRhcmdldC5maWxlc1swXSk7XG4vLyAgICAgICAgICAgICAgICAgJHNjb3BlLiRhcHBseSgpO1xuLy8gICAgICAgICAgICAgfSk7XG5cbi8vICAgICAgICAgICAgICRzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgIHJldHVybiBuZ01vZGVsLiR2aWV3VmFsdWU7XG4vLyAgICAgICAgICAgICB9LCBmdW5jdGlvbiAodmFsdWUpIHtcbi8vICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIGVsLnZhbChcIlwiKTtcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfVxuLy8gICAgIH07XG4vLyB9XSk7XG5cbn0pKCk7Il19
