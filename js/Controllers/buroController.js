"use strict";
angular.module('originacionApp')
.controller('buroController', ['$scope', 'UserModel', 'BuroModel','$mdToast', 'AccessControl', '$routeParams', function ($scope, UserModel, BuroModel, $mdToast, AccessControl, $routeParams) {
	this.tableBuro = {};
	this.detail = {};
	this.selected = [];
	this.urlBuroPDF = BuroModel.url;
	this.params=$routeParams;
	this.accessObj = {};

	this.getBuro = function(){

		$scope.buroCtrl.accessObj=AccessControl.havePermission('buro', $scope.solicitud, $scope.user);
		if($scope.buroCtrl.accessObj.access){
			$scope.$parent.$parent.loading = true;
			var buro = BuroModel.get(
			{
				id_usuario:$scope.$parent.user.id
			},
			function(){
				if(angular.isDefined(buro.codigo_error)){
					showMessage($mdToast, buro.codigo_error+': '+buro.mensaje);

				}else if(angular.isDefined(buro.columns)){
					$scope.buroCtrl.tableBuro = buro;
					$scope.buroCtrl.urlBuroPDF +='?id_usuario='+$scope.$parent.user.id+'&scope=buroPdf';
				}else{
					showMessage($mdToast, 'No tiene crédito asociado');
				}
				$scope.$parent.$parent.loading = false;
			},
			function(error){
				alert(JSON.stringify(error));
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading=false;
			});
		}

	},
	this.view = function(value){
		var id = value[0];
		window.location="#buro/"+id;
	},
	this.goBack = function(){
		window.location="#buro";
	},
	this.loadDetail = function(id){
		var buro = BuroModel.get(
			{id:id},
			function(){
				if(angular.isDefined(buro.codigo_error)){
					showMessage($mdToast, buro.codigo_error+': '+buro.mensaje);

				}else if(angular.isDefined(buro.generales)){
					$scope.buroCtrl.detail = buro;
					console.log(buro);
				}else{
					showMessage($mdToast, 'Ocurrio un error intenet mas tarde');
				}
				$scope.$parent.$parent.loading = false;
			},
			function(error){
				alert(JSON.stringify(error));
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading=false;
			}
			);
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