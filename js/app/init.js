var aplicacion = angular.module('originacionApp', ['ngMaterial', 'ngResource', 'ngRoute', 'ngMessages', 'base64'
,'ui.mask'

]);

aplicacion.controller('loginController', ['$scope', 'UserModel','$mdToast', '$q', function($scope, UserModel, $mdToast, $q){
  this.loginForm = {};
  this.init = function(){

    var userCookie = localStorage.getItem("v3_soco_user");
    if( userCookie != null){
     window.location="app.html";

   }
 }
 this.autenticar = function(){
  $scope.$parent.$parent.loading = true;

        //var usuario = UserModel.get({scope:'autenticar', email:$scope.login.loginForm.email, password:this.loginForm.password}, function(){
          var usuario = UserModel.get({scope:'autenticar', email:$scope.login.loginForm.email, password:this.loginForm.password}, function(){
            console.log(usuario);
          var message = ''; 

          if(angular.isUndefined(usuario.id)){
            if(angular.isUndefined(usuario.codigo_error)){
              message  = 'Error de autenticación'
            }
            else{
              message  = usuario.codigo_error+': '+usuario.mensaje;
            }
            $scope.$parent.$parent.loading = false;
            showMessage($mdToast, message);

          }else{
            localStorage.setItem("v3_soco_user", usuario.id);
            window.location="app.html";
        //message = localStorage.getItem("v3_soco_user");
        /*var result = push.registerPush(function (result) {
          alert(result.type);
          if (result.type === 'registration') {
            $scope.$parent.$parent.loading = false;
            alert(result.id);
            localStorage.setItem("v3_soco_id_registration", result.id);
           // window.location="app.html";
          }
          if (result.type === 'message') {
            alert(result.message);
            
          }
        });*/
        
      }
      
      
      //console.log($scope);
    }, function(){
      $scope.$parent.$parent.loading = false;
      showMessage($mdToast, 'Ocurrió un problema de conectividad, intente mas tarde');
    });

      } 
    }]);

aplicacion.controller('recoverController', ['$scope', 'UserModel', '$mdToast', 'NotificacionesModel', function($scope, UserModel, $mdToast, NotificacionesModel){
  $scope.recuperar = function(){
    $scope.$parent.$parent.loading = true;
    //var usuario = UserModel.get({email:this.email}, function(){
      var usuario = UserModel.get({user:1}, function(){
        var message = '';
        if(angular.isUndefined(usuario.id)){
          if(angular.isUndefined(usuario.codigo_error)){
            message = 'No se encontró ningún usuario con este correo';
          }
          else{
            message = $usuario.codigo_error+': '+$usuario.mensaje;
          }
        }else{
          var notificacion = NotificacionModel.new({scope:'cambiarContrasena'}, {destinatarios:usuario.id}, function(){
            if(angular.isUndefined(notificacion.status)){
              if(angular.isUndefined(notificacion.codigo_error)){
                message = 'Ocurrió un problema, intente mas tarde';
              }
              else{
                message = notificacion.codigo_error+': '+notificacion.mensaje;
              }
            }else{
              if (notificacion.status == 1) {
                message= 'Revise su bandeja de correo y siga los pasos ahi indicados para recuperar su contraseña'; 
                //window.location="#login";
              }else{
                message = 'Ocurrió un problema, intente mas tarde';
              }
            }
            $scope.$parent.$parent.loading = false;
            showMessage($mdToast, message);
          }, function(){
            $scope.$parent.$parent.loading = false;
            showMessage($mdToast, 'Ocurrió un problema de conectividad, intente mas tarde');
            return;
          });
          
        }
        


      }, function(){
        showMessage($mdToast, 'Ocurrió un problema de conectividad, intente mas tarde');
      });
      
    }  
  }]);

aplicacion.controller('registerController',['$scope', 'UserModel','$mdToast',  function($scope, UserModel,$mdToast){
    $scope.loading=false;
    $scope.user={};
    $scope.registerUser = function(isValid){
        var form = $scope.registerCtrl.projectForm;
        $scope.loading = true;
        if ($scope.projectForm.$valid && isValid) {
            if( (form.contrasena!=form.contrasena2 ) || angular.isUndefined(form.contrasena2) ){
                $scope.loading=false;
                showMessage($mdToast, 'No coinciden las contraseñas');
                return false;
            }
            var usuario = UserModel.save({}, form, function(){
                if(angular.isUndefined(usuario.id)){
                    if(angular.isUndefined(usuario.codigo_error)){
                        $scope.errorMessage = 'Ocurrió un error con su registro, intente mas tarde'
                    }
                    else{
                        $scope.errorMessage = usuario.codigo_error+': '+usuario.mensaje;
                    }
                    $scope.loading=false;
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent($scope.errorMessage)
                        .position('bottom left')
                        .hideDelay(3000)
                        );
                }else{
                    localStorage.setItem("v3_soco_user", usuario.id);
                    window.location = 'app.html';
                }
            });
        } else {
            $scope.loading=false;
            showMessage($mdToast, 'Se dectecto errores en los campos, verifique sus datos');
            return false;
        }
    }
}]);
aplicacion.directive('compareTo', function() {
    return {
        require: "ngModel",
        scope: {
          otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});
aplicacion.config(function($routeProvider){
  $routeProvider.
  when("/", {
    templateUrl : "views/app/login.html",
    controller : "loginController"
  }).
  when("/login", {
    templateUrl : "views/app/login.html",
    controller : "loginController"
  })
  .when("/register", {
    templateUrl : "views/app/register.html",
    controller : "registerController"
  })
  .when("/recover", {
    templateUrl : "views/app/recover.html",
    controller : "loginController"
  })
  .otherwise({ reditrectTo : "/views/app/login.html" });
})
