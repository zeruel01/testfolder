"use strict";

angular.module('originacionApp')
.factory('UserModel', function($resource, Config, $base64) {
	//var url = 'http://jsonplaceholder.typicode.com/users/';
	
	var token = getToken(Config.SecureKey, $base64);
	
	var url = Config.ApiUrl+'usuario/';
	 
	var User = $resource(url+':user'+'?token='+token, { user: '@user'},{
		save: {
			method: "POST",            
			headers: { 'Content-Type': undefined }
		},
		updateSelfie: {
			method: "PUT",
			headers: { 'Content-Type': undefined }
		},
		update: {
			method: "PUT",
			headers: { 'Content-Type': undefined }
		}
	});

	User.prototype.getLabel = function(key) {
		var labels = {
			'id' : 'Identificador',
			'id_usuario' : 'Identificador del usuario',
			'name' : 'Nombre',
			'apdPaterno' : 'Appellido paterno',
			'apdMaterno' : 'Appellido materno',
			'numeroSolicitud': 'Número de solicitud',
			'empresaPatron': 'Nombre de la empresa'
		}
		return (labels[key]) ? labels[key] : key;
	};
	return User;
});