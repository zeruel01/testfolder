"use strict";
angular.module('originacionApp')
.controller('salirController', ['$scope', 'AccessControl', 'NotificacionesModel', '$mdToast', function ($scope, AccessControl, NotificacionesModel, $mdToast) {
	this.notificaciones = {}
	this.init = function()
	
	{
	 localStorage.removeItem('v3_soco_user');

            NotificacionesModel.save({usuarioId:$scope.user.id, scope:'updateUser'}, {status:0});
            window.location="index.html";
	}


}]);