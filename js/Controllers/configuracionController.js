"use strict";
angular.module('originacionApp')
.controller('configuracionController', ['$scope', '$mdToast', 'UserModel', '$q', 'Config', function ($scope, $mdToast, UserModel, $q, Config) {
	this.cuentaForm = {};
	this.user = $scope.user;
	$scope.configCtrl.notiForm = {
    	permiteNotificaciones: true
  	};
	console.log(this.user);
	this.guardarCuenta = function(){
		if(this.cuentaForm.password != this.cuentaForm.password2){
			showMessage($mdToast, 'Las contraseñas no coinciden');
			return;
		}else{
			var user = UserModel.get({user:$scope.user.id, password:this.cuentaForm.passwordCurrent}, 
				function(){
					if(angular.isUndefined(user.id)){
						showMessage($mdToast, 'Tu contraseña actual es incorrecta');
					}else{
						var userNew =UserModel.update({user:$scope.$parent.user.id}, $scope.configCtrl.cuentaForm, function(){
							if(angular.isUndefined(userNew.id)){
								showMessage($mdToast, 'Ocurrió un error, intente mas tarde');
							}else{
								showMessage($mdToast, 'Tus datos se actualizaron correctamente');
							}
						})
					}
				},
				function(){
					showMessage($mdToast, 'Tu contraseña actual es incorrecta');
				})
		}
	}

	this.guardarConfNoti = function(){
		var userNew =UserModel.update({user:$scope.$parent.user.id}, $scope.configCtrl.notiForm, function(){
			if(angular.isUndefined(userNew.id)){
				showMessage($mdToast, 'Ocurrió un error, intente mas tarde');
			}else{
				if(userNew.permiteNotificaciones == 1){
					app.permiteNotificaciones = 1;
					app.initializePush();
				}else{
					app.permiteNotificaciones = 0;
				}
				showMessage($mdToast, 'Tus datos se actualizaron correctamente');
			}
		});
	}	
	this.uploadSelfie = function(source){
		$scope.$parent.$parent.loading = true;
		var deferr = $q.defer();
		deferr.promise.then(function (imageData){
		/*	var smallImage = document.getElementById('smallImage');
			smallImage.style.display = 'block';
			smallImage.src = "data:image/jpeg;base64," + imageData;*/
			var usuario = UserModel.updateSelfie({user:$scope.$parent.user.id,scope:'selfie'}, {file_camera:imageData}, 
				function(){
					
					showMessage($mdToast, 'Tus datos se actualizaron correctamente');
					//$scope.configCtrl.user = usuario; //EL ws no regresa el nodo selfie
					$scope.configCtrl.selfie = "data:image/jpeg;base64," + imageData;
					$scope.$parent.$parent.loading  = false;
					//$scope.$parent.user.selfie= usuario.selfie; //EL ws no regresa el nodo selfie
					$scope.$parent.user.selfie = "data:image/jpeg;base64," + imageData;
					configCtrl
				}, 
				function(error){
					/*alert(JSON.stringify(error));*/
					showMessage($mdToast, 'Error  de conexión, intente mas tarde');
					$scope.$parent.$parent.loading = false;
				});
			
		}, function (error){
			/*alert(JSON.stringify(error));*/
		});

		if(source === 'camera'){
			navigator.camera.getPicture(deferr.resolve, deferr.reject, { 
			quality: Config.QualityPhoto,
			destinationType: Camera.DestinationType.DATA_URL });
		}else{
			navigator.camera.getPicture(deferr.resolve, deferr.reject, { 
			quality: Config.QualityPhoto, 
	        destinationType: Camera.DestinationType.DATA_URL,
	        sourceType: Camera.PictureSourceType.PHOTOLIBRARY });
		}
		
	}

}]);

