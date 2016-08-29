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
		
		
			if(!(this.cuentaForm.password === this.cuentaForm.password2))
			{	
				showMessage($mdToast, 'Las contraseñas no coinciden');
				//console.log("las contraseñas  no coinciden");
				return;
			}
			if(this.cuentaForm.password.length<8||this.cuentaForm.password2.length<8)
			{	
				showMessage($mdToast, 'Se requieren al menos 8 caracteres');
				//console.log("las contraseñas  no coinciden");
				return;
			}



		//if( != this.cuentaForm.password2
		//return;
		//return;
		//alert("test");
	
		var message=""; 
		var usuario = UserModel.get({scope:'autenticar', email:this.user.email, password:this.cuentaForm.passwordCurrent}, function(){

			   if(angular.isUndefined(usuario.id)){
            if(angular.isUndefined(usuario.codigo_error)){
              message  = 'Error de autenticación'
            }
            else{
              message  = usuario.codigo_error + "la contraseña actual no es la correcta  ";
			  //+': '+usuario.mensaje;
            }

            $scope.$parent.$parent.loading = false;
            showMessage($mdToast, message);

          }else{
			  	var userNew =UserModel.update({user:$scope.$parent.user.id}, $scope.configCtrl.cuentaForm, function(){
						if(angular.isUndefined(userNew.id)){
							showMessage($mdToast, 'Ocurrió un error, intente mas tarde');
						}else{
							showMessage($mdToast, 'Tus datos se actualizaron correctamente');
						}
					});
            //localStorage.setItem("v3_soco_user", usuario.id);
            //window.location="app.html";
			}
		}
		,function(){
      	$scope.$parent.$parent.loading = false;
      	showMessage($mdToast, 'Tu contraseña actual es incorrecta');
    });

		/*var user = UserModel.get({user:$scope.user.id, password:this.cuentaForm.passwordCurrent}, 
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
			})*/
		
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

