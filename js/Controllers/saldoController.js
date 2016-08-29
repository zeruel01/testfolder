"use strict";
angular.module('originacionApp')
.controller('saldoController', ['$scope', 'UserModel', 'SolicitudModel','$mdToast', 'AccessControl', function ($scope, UserModel, SolicitudModel, $mdToast, AccessControl) {
	this.credito = {};
	this.accessObj = {};
	this.urlSaldoPDF = SolicitudModel.url;
	this.urlAmortizacionPDF = SolicitudModel.url;

	this.getStatusCredito = function(){
		
		var solicitud = (angular.isUndefined($scope.$parent.solicitud.id)) ? null : $scope.$parent.solicitud;
		$scope.saldoCtrl.accessObj = AccessControl.havePermission('saldo', $scope.$parent.solicitud, $scope.$parent.user);
		if ($scope.saldoCtrl.accessObj.access){
			$scope.$parent.$parent.loading = true;
			var credito = SolicitudModel.get(
			{
				id:$scope.$parent.solicitud.id, 
				scope:'saldosCredito'
			},
			function(){
				if(angular.isUndefined(credito.id)){
					if(angular.isDefined(credito.codigo_error)){
						showMessage($mdToast, credito.codigo_error+': '+credito.mensaje);	
					}else{
						showMessage($mdToast, 'Ocurrió un error, intente mas tarde');	
					}
					
				}else{
					$scope.saldoCtrl.credito = credito;
					$scope.saldoCtrl.urlSaldoPDF +=$scope.$parent.solicitud.id+'?id_user='+$scope.$parent.user.id+'&scope=saldosCreditoPDF';
				}
				$scope.$parent.$parent.loading = false;
			},
			function(){
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading=false;
			}
			);
		}
		
	}
	this.initAmortizacion = function(){
		var solicitud = (angular.isUndefined($scope.$parent.solicitud.id)) ? null : $scope.$parent.solicitud;
		$scope.saldoCtrl.accessObj = AccessControl.havePermission('saldo', $scope.$parent.solicitud, $scope.$parent.user);
		if ($scope.saldoCtrl.accessObj.access){
			$scope.$parent.$parent.loading = true;
			var amortizacion = SolicitudModel.get(
			{
				id:$scope.$parent.solicitud.id, 
				id_user:$scope.$parent.user.id, 
				scope:'amortizacion'
			},
			function(){
				$scope.saldoCtrl.amortizacion = amortizacion.tablaAmortizacion;
				console.log($scope.saldoCtrl.amortizacion);
				$scope.$parent.$parent.loading = false;
				$scope.saldoCtrl.urlAmortizacionPDF +=$scope.$parent.solicitud.id+'?id_user='+$scope.$parent.user.id+'&scope=amortizacionPDF';
			},
			function(){
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading=false;
			}
			);
		}
	}
	
}]);