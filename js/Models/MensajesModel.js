"use strict";

angular.module('originacionApp')
.factory('MensajesModel', function($resource, Config, $base64) {
    //var url = 'http://devv2.integracop.com/calculator/calcws';
    var token = getToken(Config.SecureKey, $base64);
    var url = Config.ApiUrl+'mensajes/';
    var Mensaje = $resource(url+':id'+'?token='+token, { id: '@id'},{
        new: {
            method: "POST"
        },
        update: {
            method: "PUT"
        }
    });
    return Mensaje;
});