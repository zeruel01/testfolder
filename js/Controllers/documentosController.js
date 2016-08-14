"use strict";
angular.module('originacionApp')
.controller('documentosController', ['$scope', 'DocumentosModel', '$routeParams','$timeout', '$mdToast', 'AccessControl', '$q', 'Config', function ($scope, DocumentosModel, $routeParams, $timeout, $mdToast, AccessControl, $q, Config) {
	this.loading = false;
	this.params=$routeParams;
	this.files = {};
	this.listado={};
	this.accessObj = {};

	this.init = function(){

		$scope.documentos.accessObj=AccessControl.havePermission('documentos', $scope.solicitud, $scope.user);
		if($scope.documentos.accessObj.access){
			$scope.$parent.$parent.loading=true;	
			
			var listado = DocumentosModel.query({user_id:$scope.user.id}, function(){
				$scope.documentos.listado  = listado;
			},
			function(){
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.documentos.loading=false;
			});
			var listadoFaltantes = DocumentosModel.query({user_id:$scope.user.id, skope: 'faltantes'}, function(){
				$scope.documentos.listadoFaltantes = listadoFaltantes;
				$scope.$parent.$parent.loading= false;
			},
			function(){
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading= false;
			});
		}

		
	}
	this.loadDocumento = function(idDocumento){
		$scope.$parent.$parent.loading = true;
		var documento =  DocumentosModel.get({id_documento_cargado:idDocumento}, function(){
			$scope.$parent.$parent.loading= false;
			documento.vaidado = parseInt(documento.vaidado);
			$scope.documentos.documento = documento;

		},
		function(){
			showMessage($mdToast, 'Error  de conexión, intente mas tarde');
			$scope.$parent.$parent.loading= false;
		});
	}
	$scope.uploadFile = function(event){
		$scope.documentos.loading = true;
		
		//$scope.documentos.files.newFile = event.target.files[0];
		var formData = new FormData();
		var id = event.target.id.split('_')[1];
		formData.append("file", event.target.files[0]);
		formData.append("id_documento", id);
		var documento = DocumentosModel.create({id_user:$scope.user.id}, formData, function(){
			/*alert(JSON.stringify(documento));*/
			$scope.documentos.loading = false;
			var mensaje = 'El documento se guardó exitosamente. En espera de validación';
			if(angular.isUndefined(documento.id_documento_cargado)){
				mensaje=documento.codigo_error+': '+documento.mensaje;
			}else{
				$scope.documentos.listado.push(documento);
				$('md-list-item#item_'+id).remove();
			}
			
			showMessage($mdToast, mensaje);
			//window.location="#documentos";
		},
		function(error){
			/*alert(JSON.stringify(error));*/
			showMessage($mdToast, 'Error  de conexión, intente mas tarde');
			$scope.documentos.loading=false;
		});
		
		

	};
	this.executeClick=function(id){
		$timeout(function() {
			angular.element(document).find('#fileInput_'+id).trigger('click');
		}, 100);
	}
	this.takePhoto=function(id){
		/*alert(id);*/
		$scope.documentos.loading = true;
		var defer = $q.defer();
		defer.promise.then(function (imageData){
			/*var smallImage = document.getElementById('smallImage');
			smallImage.style.display = 'block';
			smallImage.src = "data:image/jpeg;base64," + imageData;*/
			var documento = DocumentosModel.createCamera({id_user:$scope.user.id}, {id_documento:id, file_camera:imageData}, 
				function(){
					/*alert(JSON.stringify(documento));*/
					var mensaje = 'El documento se guardó exitosamente. En espera de validación';
					if(angular.isUndefined(documento.id_documento_cargado)){
						mensaje=documento.codigo_error+': '+documento.mensaje;
					}
					else{
						showMessage($mdToast, mensaje);
						$scope.documentos.listado.push(documento);
						$('md-list-item#item_'+id).remove();
						$scope.documentos.loading = false;
					}
					
				}, 
				function(error){
					/*alert(JSON.stringify(error));*/
					showMessage($mdToast, 'Error  de conexión, intente mas tarde');
					$scope.documentos.loading = false;
				});
			
		}, function (error){
			/*alert(JSON.stringify(error));*/
		});

		navigator.camera.getPicture(defer.resolve, defer.reject, { 
			quality: Config.QualityPhoto,
			destinationType: Camera.DestinationType.DATA_URL });
	}

	this.goBack = function(){
		window.location="#documentos";
	}
	this.eliminar = function(idDocumento){
		if(confirm('¿Estas seguro que deseas eliminar este documento?')){
			$scope.$parent.$parent.loading= true;
			var res = DocumentosModel.delete({id_usuario: $scope.user.id, id_documento_cargado:idDocumento}, 
				function(){
					$scope.$parent.$parent.loading= false;
					var mensaje = 'El documento se eliminó exitosamente';
					if(angular.isUndefined(res.status)){
						mensaje=documento.codigo_error+': '+documento.mensaje;
					}

					showMessage($mdToast, mensaje);
					window.location="#documentos";
				},
				function(){
					showMessage($mdToast, 'Error  de conexión, intente mas tarde');
					$scope.$parent.$parent.loading= false;
				});

		}
	}

}]);