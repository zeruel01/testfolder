"use strict";
angular.module('originacionApp')
.controller('solicitudController', ['$scope', 'UserModel', 'SolicitudModel','$mdToast','$filter'
,"generics.services.zipCodes"
,
 function ($scope, UserModel, SolicitudModel, $mdToast ,$filter
 ,serviceZipCodes
 ) {
	this.solicitudForm = {};

	this.init = function(){
		if (angular.isUndefined(!$scope.$parent.solicitud.id) && $scope.$parent.solicitud.infoComplet == false){
			$scope.$parent.$parent.loading = true;
			var datosSolicitud = SolicitudModel.get({id:$scope.$parent.solicitud.id, id_user:$scope.$parent.user.id, scope:'completa'}, 
				function(){
					$scope.solicitudCtrl.solicitudForm = datosSolicitud;	
					console.log(datosSolicitud);	
					$scope.$parent.$parent.loading = false;

					     if ($scope.colonies==null)
                    $scope.colonies = [];

                if ($scope.credit.Colony != null) {
                    found = $filter('filter')($scope.colonies, { d_asenta: $scope.solicitudCtrl.solicitudForm.coloniaFraccionamiento }, true);
                    if ( found.length===0)
                        $scope.colonies.push({ d_asenta: $scope.solicitudCtrl.solicitudForm.coloniaFraccionamiento });
                }


				},
				function(){
					showMessage($mdToast, 'Error  de conexión, intente mas tarde');
					$scope.$parent.$parent.loading=false;
				});
		}else{
			$scope.solicitudCtrl.solicitudForm = $scope.$parent.solicitud;	
			//$scope.solicitudCtrl.solicitudForm.editable=0; 
		}

		
           
	}
	this.initCreate = function(){
		$scope.$parent.$parent.loading = true;
		var datosUsuario = UserModel.get({user:$scope.$parent.user.id, scope:'completa'}, 
		//var datosUsuario = UserModel.get({user:$scope.$parent.user.id}, 
			function(){
				datosUsuario.editable=1;
				datosUsuario.vigenciaIdentificacion = new Date();
				$scope.solicitudCtrl.solicitudForm = datosUsuario;	
				$scope.$parent.$parent.loading = false;
			},
			function(){
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading=false;
			});
	}
	this.initEdit = function(){
		if (angular.isUndefined($scope.$parent.solicitud) || $scope.$parent.solicitud.infoComplet == false){
			$scope.$parent.$parent.loading = true;
			//var datosSolicitud = SolicitudModel.get({id:$scope.$parent.solicitud.id, id_user:$scope.$parent.user.id, scope:'completa'}, 
			var datosSolicitud = SolicitudModel.get({id:$scope.$parent.solicitud.id, id_user:$scope.$parent.user.id}, 
				function(){
					datosSolicitud.vigenciaIdentificacion = new Date();
					$scope.solicitudCtrl.solicitudForm = datosSolicitud;	
					$scope.$parent.$parent.loading = false;
				},
				function(){
					showMessage($mdToast, 'Error  de conexión, intente mas tarde');
					$scope.$parent.$parent.loading=false;
				});
		}else{
			$scope.solicitudCtrl.solicitudForm = $scope.$parent.solicitud;	
		}		
	}
	this.nuevaSolicitud = function(){
		$scope.$parent.$parent.loading = true;
		this.solicitudForm.id=null;
		var solicitudNueva = SolicitudModel.save({id_user:$scope.$parent.user.id}, this.solicitudForm, function(){
			console.log(solicitudNueva);
			$scope.$parent.$parent.loading = false;
			var message =  'Se generó la solicitud correctamente';
			if(angular.isUndefined(solicitudNueva.id)){
				if(angular.isUndefined(solicitudNueva.codigo_error)){
					message  = 'Error al generar la solicitud'
				}
				else{
					message  = solicitudNueva.codigo_error+': '+$solicitudNueva.mensaje;
				}
			}else{
				solicitudNueva.vigenciaIdentificacion = new Date();
				$scope.$parent.$parent.solicitud = solicitudNueva;
				//$scope.$parent.$parent.solicitud.infoComplet = true;
				console.log($scope.$parent.$parent.solicitud);
				window.location="#solicitud"
			}
			showMessage($mdToast, message);
		},
		function(){
			showMessage($mdToast, 'Error  de conexión, intente mas tarde');
			$scope.$parent.$parent.loading=false;
		});
	}

	this.savePartial= function(zone)
	{
		if(zone==null)
		return;

		var valid=true;

		switch (zone) {
			case "Personales":
				
				break;
			case "Empleo":
				
				break;
					case "Referencias":
				
				break;

					case "Credito":
				
		
				break;
			default:
				break;
		}
		

		if(this.solicitudForm.editable==1)
		{
			this.editarSolicitudParcial(valid);
		}
		else
		{
			//solo si es editable
			//this.editarSolicitud(zone);
		}

	}

	this.editarSolicitudMain = function(isValid){
	 

		//this.editarSolicitud ($scope.solicitudForm.$valid);
		//if(zone==null)
		//return;

		var zone=$scope.selectedTabIndex;

		var valid=true;

		switch (zone) {
			case 0:
				
				break;
			case 1:
				
				break;
					case 2:
				
				break;

					case 3:
				
		
				break;
			default:
				break;
		}
		

		if(this.solicitudForm.editable==1)
		{
			this.editarSolicitudParcial(valid);
		}
		else
		{
			//solo si es editable
			//this.editarSolicitud(zone);
		}
	

	}
	this.editarSolicitud = function(isValid){
		var form = this.solicitudForm;
		//if(isValid)
		//{
		if ($scope.solicitudForm.$valid && isValid) {
			var solicitudEditada = SolicitudModel.update({id_user:$scope.$parent.user.id}, form, function(){
				$scope.$parent.$parent.loading = false;
				var message =  'Se actualizó la solicitud correctamente';
				if(angular.isUndefined(solicitudEditada.id)){
					if(angular.isUndefined(solicitudEditada.codigo_error)){
						message  = 'Error al actualizar la solicitud'
					}
					else{
						message  = solicitudEditada.codigo_error+': '+$solicitudEditada.mensaje;
					}
				}else{
					solicitudEditada.vigenciaIdentificacion = new Date();
					$scope.$parent.$parent.solicitud = solicitudEditada;
					//$scope.$parent.$parent.solicitud.infoComplet = true;
					console.log($scope.$parent.$parent.solicitud);
					window.location="#solicitud"
				}
				showMessage($mdToast, message);
			},
			function(){
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading=false;
			});
		} else {
			$scope.$parent.$parent.loading = false;
			showMessage($mdToast, 'Se dectecto errores en los campos, verifique sus datos');
		}
	}


	this.editarSolicitudParcial = function(isValid){
		var form = this.solicitudForm;
		if(isValid)
		{
		//if ($scope.solicitudForm.$valid && isValid) {
			var solicitudEditada = SolicitudModel.update({id_user:$scope.$parent.user.id}, form, function(){
				$scope.$parent.$parent.loading = false;
				var message =  'Se actualizó la solicitud correctamente';
				if(angular.isUndefined(solicitudEditada.id)){
					if(angular.isUndefined(solicitudEditada.codigo_error)){
						message  = 'Error al actualizar la solicitud'
					}
					else{
						message  = solicitudEditada.codigo_error+': '+$solicitudEditada.mensaje;
					}
				}else{
					solicitudEditada.vigenciaIdentificacion = new Date();
					$scope.$parent.$parent.solicitud = solicitudEditada;
					//$scope.$parent.$parent.solicitud.infoComplet = true;
					//console.log($scope.$parent.$parent.solicitud);
					//window.location="#solicitud"
				}
				showMessage($mdToast, message);
			},
			function(){
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading=false;
			});
		} else {
			$scope.$parent.$parent.loading = false;
			showMessage($mdToast, 'Se dectecto errores en los campos, verifique sus datos');
		}
	}
	

      
            this.getZipCodeData = function () {

                if ($scope.solicitudCtrl.solicitudForm.co == null)
                    return;
				$scope.$parent.$parent.loading=true;

                if ($scope.solicitudCtrl.solicitudForm.co .toString().length > 4)
                    serviceZipCodes.getZipCodes($scope.solicitudCtrl.solicitudForm.co ,
                    function (response) {
                        //var responseData = response;
                        var zipCodeData = response.zip_codes;

                        if (zipCodeData.length) {
                            var first = zipCodeData[0];
							$scope.solicitudCtrl.solicitudForm.entidad=first.d_estado;
							$scope.solicitudCtrl.solicitudForm.minicipioDelegacion=first.d_mnpio;
 							$scope.solicitudCtrl.solicitudForm.coloniaFraccionamiento = first.d_asenta;
							 $scope.colonies = zipCodeData;
								$scope.$parent.$parent.loading=false;
                            //$scope.credit.CiudadCliente = first.cityDescField;
                            //$scope.credit.City = first.d_mnpio;
                         
                            //var val = parseInt(first.c_estado);

                            //var found = $filter('filter')($rootScope.states, { IdSepomex: val }, true);
                            //if (found.length) $scope.credit.IdState = found[0].Id;
                            

                        } else {
								$scope.$parent.$parent.loading=false;
					showMessage($mdToast,"Datos no encontrados con ese codigo postal");
                        }

                    }
                    , function (parameters) {
                        //serviceMessages.alert("Datos no encontrados");
                    }

            );
                else {

                    showMessage($mdToast,"Datos insuficientes para generar el codigo postal");
                }

            }
}])