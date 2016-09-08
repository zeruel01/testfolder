"use strict";

angular.module('originacionApp')
.factory('DocumentosModel', function($resource, Config, $base64) {
	//var url = 'http://jsonplaceholder.typicode.com/posts/';
	var f = new Date();
	var token = $base64.encode(f.getDate() +''+ (f.getMonth()+1 )+''+ f.getFullYear()+Config.SecureKey);
	var url = Config.ApiUrl+'documento/';
	return $resource(url+':id_documento_cargado'+'?token='+token, { id_documento_cargado: '@_id_documento_cargado'},{
        create: {
            method: "POST",            
            headers: { 'Content-Type': undefined }
        },
        createCamera: {
            method: "POST",
            headers: { 'Content-Type': undefined }
        }
    });
});