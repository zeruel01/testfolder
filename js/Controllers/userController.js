"use strict";
angular.module('originacionApp')
.controller('userController', ['$scope', 'UserModel', function ($scope, UserModel) {
	this.user={};
	this.init = function(){
		if ($scope.$parent.user.id){
			$scope.$parent.$parent.loading = true;

			var user = UserModel.get({user:$scope.$parent.user.id, scope:'completa'}, function(){
				delete user.id;
				delete user.role;
				$scope.userCtrl.user = user;
				$scope.$parent.$parent.loading = false;
			},
			function(){
				showMessage($mdToast, 'Error  de conexión, intente mas tarde');
				$scope.$parent.$parent.loading=false;
			});
		}
	}


}]);