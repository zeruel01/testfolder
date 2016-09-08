"use strict";

angular.module('originacionApp')
.factory('SolicitudModel', function($resource, Config, $base64) {
	var f = new Date();
	var token = $base64.encode(f.getDate() +''+ (f.getMonth()+1 )+''+ f.getFullYear()+Config.SecureKey);
	var url = Config.ApiUrl+'solicitud/';
	var Solicitud = $resource(url+':id'+'?token='+token, { id: '@id'},{
		save: {
			method: "POST",            
			headers: { 'Content-Type': undefined }
		},
		update: {
			method: "PUT",            
			headers: { 'Content-Type': undefined }
		}
	});
	Solicitud.url = url;
	Solicitud.prototype.getLabel = function(key) {
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
	
	return Solicitud;
});