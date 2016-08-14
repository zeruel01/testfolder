"use strict";
angular.module('originacionApp')
.controller('creditoController', ['$scope', 'UserModel', 'SolicitudModel','$mdToast', 'AccessControl', function ($scope, UserModel, SolicitudModel, $mdToast, AccessControl) {
	this.credito = {};
	this.accessObj = {};

	this.getStatusCredito = function(){
		
		
		$scope.creditoCtrl.accessObj = AccessControl.havePermission('credito', $scope.$parent.solicitud, $scope.$parent.user);
		console.log($scope.creditoCtrl.accessObj);
		if ($scope.creditoCtrl.accessObj.access){
			$scope.$parent.$parent.loading = true;
			var credito = SolicitudModel.get(
			{
				id:$scope.$parent.solicitud.id, 
				scope:'statusCredito'
			},
			function(){
				console.log(credito);
				if(angular.isUndefined(credito.id)){
					showMessage($mdToast, 'No tiene crédito asociado');
				}else{
					$scope.creditoCtrl.credito = credito;
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
	
}]);