"use strict";
angular.module('originacionApp')
.controller('creditoController', ['$scope', 'UserModel', 'SolicitudModel','$mdToast', 'AccessControl'
,'DocumentosModel'
,'MensajesModel'
, function ($scope, UserModel, SolicitudModel, $mdToast, AccessControl
,DocumentosModel
,MensajesModel
) {
	this.credito = {};
	this.accessObj = {};
	$scope.listadoFaltantes = [];
	$scope.mensajes = [];
	this.getStatusCredito = function(){
		
		
				$scope.creditoCtrl.accessObj = AccessControl.havePermission('credito', $scope.$parent.solicitud, $scope.$parent.user);
		//console.log($scope.creditoCtrl.accessObj);
		if ($scope.creditoCtrl.accessObj.access){
			$scope.$parent.$parent.loading = true;
			var credito = SolicitudModel.get(
			{
				id:$scope.$parent.solicitud.id, 
				scope:'statusCredito'
			},
			function(){
				//console.log(credito);
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

				var listadoFaltantes = DocumentosModel.query({user_id:$scope.user.id, skope: 'faltantes'}, function(){
				$scope.listadoFaltantes = listadoFaltantes;
				$scope.$parent.$parent.loading= false;
			},
			function(){
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading= false;
			});

    		var mensajes = MensajesModel.query({user_id:$scope.user.id, mensaje_padre:0}, function(){
                if(angular.isDefined(mensajes.codigo_error)){
                    showMessage($mdToast, mensajes.codigo_error+': '+mensajes.mensaje);
                }else{
                    angular.forEach(mensajes, function(mensajePadre, key){
                        if(angular.isDefined(mensajePadre.id)){
                            mensajePadre.isNew = (mensajePadre.status == 1 && mensajePadre.tipo == 2)? 1 : 0;
                            if(angular.isDefined(mensajePadre.mensajes)){
                                angular.forEach(mensajePadre.mensajes, function(mensajeHijo){
                                    if(mensajeHijo.status==1 && mensajeHijo.tipo == 2){
                                        mensajePadre.isNew = 1;
                                    }
                                });
                            } 
                        }
                    });
                    $scope.mensajes = mensajes;
                    $scope.$parent.$parent.loading=false;
                }
                //console.log(mensajes);
                
            });

		}

		
		
	}
	
}]);