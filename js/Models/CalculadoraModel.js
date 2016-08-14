"use strict";

angular.module('originacionApp')
.factory('CalculadoraModel', function($resource, Config, $base64) {
	//var url = 'http://devv2.integracop.com/calculator/calcws';
	var f = new Date();
	var token = $base64.encode(f.getDate() +''+ (f.getMonth()+1 )+''+ f.getFullYear()+Config.SecureKey);
	var url = Config.ApiUrl+'calculadora/';
	var Calculadora = $resource(url+':id'+'?token='+token, { id: '@id'},{
        calcular: {
            method: "GET"
        }
    });
    Calculadora.url = url;

	
	return Calculadora;
});