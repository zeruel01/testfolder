"use strict";

angular.module('originacionApp')
.factory('NotificacionesModel', function($resource, Config, $base64) {
	//var url = 'http://jsonplaceholder.typicode.com/users/';
	var f = new Date();
	var token = $base64.encode(f.getDate() +''+ (f.getMonth()+1 )+''+ f.getFullYear()+Config.SecureKey);
	var url = Config.ApiUrl+'notificacion/';
	var Notificacion = $resource(url+':id'+'?token='+token, { id: '@id'},{
		new: {
			method: "POST",            
			headers: { 'Content-Type': undefined }
		},
		update: {
			method: "PUT",            
			headers: { 'Content-Type': undefined }
		}
	});
	return Notificacion;
});