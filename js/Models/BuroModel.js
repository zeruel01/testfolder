"use strict";

angular.module('originacionApp')
.factory('BuroModel', function($resource, Config, $base64) {
	var f = new Date();
	var token = $base64.encode(f.getDate() +''+ (f.getMonth()+1 )+''+ f.getFullYear()+Config.SecureKey);
	var url = Config.ApiUrl+'buro/';
	var Buro = $resource(url+':id'+'?token='+token, { id: '@id'});
	Buro.url = url;
	
	return Buro;
});