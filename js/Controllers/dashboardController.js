"use strict";
angular.module('originacionApp')
.controller('dashboardController', ['$scope', 'AccessControl', 'UserModel', 'PublicidadModel', function ($scope, AccessControl, UserModel, PublicidadModel) {
	this.user = $scope.$parent.usuario;
	this.galeria = null;
	this.init = function(){
		
		$scope.$parent.$parent.loading=true;	
		var userCookie = localStorage.getItem("v3_soco_user");
		var usuario = UserModel.get({user:userCookie}, 
			function(){
				if(usuario.role=='cliente'){
					var pub = PublicidadModel.get({}, function(){
						console.log(pub);
						$scope.dashboard.galeria = pub;
					});
					$('.galeria').slick();
				}
				$scope.$parent.$parent.loading=false;
			});
	}

}]);