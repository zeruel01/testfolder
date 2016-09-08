"use strict";
angular.module('originacionApp')
.controller('notificacionesController', ['$scope', 'AccessControl', 'NotificacionesModel', '$mdToast', function ($scope, AccessControl, NotificacionesModel, $mdToast) {
	this.notificaciones = {}
	this.init = function(){
		$scope.$parent.$parent.loading=true;
		var notificaciones = NotificacionesModel.get({userId:$scope.user.id, tipo:2}, function(){
			if(angular.isUndefined(notificaciones.codigo_error)){
				$scope.notiCtrl.notificaciones = notificaciones;
				console.log($scope.notiCtrl.notificaciones);
			}else{
				showMessage($mdToast, notificaciones.codigo_error+': '+notificaciones.mensaje);
			}
			$scope.$parent.$parent.loading=false;
			
		},
		function(){
			showMessage($mdToast, 'Error de conexión, intente mas tarde');
			$scope.$parent.$parent.loading=false;
		});
	}
	this.openLink = function(notificacion){
		//Si no ha sido leida la marcamos como leida
		if(notificacion.leido == 0){
			NotificacionesModel.update({id:notificacion.id},{leido:1});
			//$scope.$parent.$parent.totalNotifications -= 1;
		}
		if($scope.$parent.$parent.totalNotifications > 0){
			$scope.$parent.$parent.totalNotifications -= 1;	
		}
		window.location=notificacion.url;
		
	}

}]);