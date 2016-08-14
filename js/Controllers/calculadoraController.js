"use strict";
angular.module('originacionApp')
.controller('calculadoraController', ['$scope', 'AccessControl', 'CalculadoraModel', '$mdToast',  function ($scope, AccessControl, CalculadoraModel, $mdToast) {
	this.datos = {};
	this.showResult = false;
	$scope.result = {};
	this.urlResult = CalculadoraModel.url;
	this.init = function(){
		this.datos.nss=$scope.user.nss;
		console.log($scope.user);
	}
	this.calcular = function(){
		
		$scope.$parent.$parent.loading=true;
		var calculo = CalculadoraModel.calcular(this.datos, function(){
			$scope.calculadoraCtrl.result = calculo;
			$scope.calculadoraCtrl.showResult = true;
			$scope.$parent.$parent.loading=false;

			$scope.calculadoraCtrl.urlResult += '?'+serializeObj($scope.calculadoraCtrl.datos)+'&scope=resultsPfd';


		},
		function(){
			showMessage($mdToast, 'Error  de conexión, intente mas tarde');
			$scope.$parent.$parent.loading=false;
		});	
	}
	this.hideResult=function(){
		$scope.calculadoraCtrl.showResult = false;
	}
	this.downloadResult=function(){

	}

}]);

