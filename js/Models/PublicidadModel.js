"use strict";

angular.module('originacionApp')
.factory('PublicidadModel', function($resource, Config, $base64) {
	//var url = 'http://devv2.integracop.com/calculator/calcws';
	var token = getToken(Config.SecureKey, $base64);
	var url = Config.ApiUrl+'publicidad/';
	return $resource(url+':id'+'?token='+token, { id: '@id'});
});