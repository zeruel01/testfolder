var aplicacion = angular.module('originacionApp', ['ngMaterial', 'ngResource', 'ngRoute', 'ngMessages', 'base64'
,'ui.mask'

]);

aplicacion.controller('loginController', ['$scope', 'UserModel','$mdToast', '$q','Config','ngFB', function($scope, UserModel, $mdToast, $q,Config,ngFB){
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
    },
    this.loginFacebook = function(){
        ngFB.init({  appId  : Config.appId  });
        var notificar = '',
        statusUserCallback = function(respuesta) {
            if (respuesta.status === 'connected') {                
                iniciar(respuesta.authResponse.accessToken);                 return;
            } else if (respuesta.status === 'not_authorized') {
                notificar  = 'No esta autorizado a ingresar a esta aplicación:';
                ngFB.logout().then(
                    function() {
                        // alert('Sesion finalizada');
                        notificar  += " Sesion finalizada"; 
                    },
                    function(error){
                        notificar  += ' Cierre de sesion fallida '+error; 
                    });
            } else if( typeof respuesta.status == 'undefined') {                
                notificar  = "Ocurrio un problema al iniciar sesión";               
            } 
            $scope.$parent.$parent.loading = false;
            showMessage($mdToast, notificar);
        },
        iniciar = function(accessToken) {
            ngFB.api({ 
                    path: '/me',
                    params: { "access_token": accessToken, "fields":"name,email" }
                }).then(
                function(facebookData) {
                    if ( angular.isUndefined(facebookData.email) ) {
                        showMessage($mdToast, 'Facebook no ha propocionado su correo, edite la informacion para que permita compartirlo');
                    } else {
                        var email = UserModel.get({scope:'validar', email:facebookData.email }, function(){
                        // var email = UserModel.get({scope:'validar', email:'acarmona@soco.com.mx' }, function(){
                            if ( !angular.isUndefined( email.codigo_error ) ) {
                                showMessage($mdToast, 'Su correo: '+facebookData.email+' no se encuentra en nuestros servidores, por favor verifiquelo o puede registrarse');
                            } else {
                                // alert(JSON.stringify(email))
                                localStorage.setItem("v3_soco_user", email.id);
                                window.location="app.html";
                            }
                        });
                    }
                },function(error){
                    showMessage($mdToast, 'Iniciar error ' + JSON.stringify(error));
                }
            );
            $scope.$parent.$parent.loading = false;   
        }
        $scope.$parent.$parent.loading = true;
        ngFB.login({scope: 'email'}).then(
            function(response) {
                // alert('Facebook login ' + JSON.stringify(response));
                statusUserCallback(response);
            },
            function(error) {
                $scope.$parent.$parent.loading = false;   
                showMessage($mdToast, 'Facebook login fallo: ' + JSON.stringify(error));
            }
        );
    },
    this.loginGoogle = function(){
        var login =function(access_token){
            var revokeUrl = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+access_token;
            $.get( revokeUrl, null,null,'json')
            .done(function(googleData) {
                var email = UserModel.get({scope:'validar', email:googleData.email }, function(){
                // var email = UserModel.get({scope:'validar', email:'acarmona@soco.com.mx' }, function(){
                        if ( !angular.isUndefined( email.codigo_error ) ) {
                            showMessage($mdToast, 'Su correo: '+googleData.email+' no se encuentra en nuestros servidores, por favor verifiquelo o puede registrarse');
                        } else {
                            // alert(JSON.stringify(email),googleData.email)
                            localStorage.setItem("v3_soco_user", email.id);
                            window.location="app.html";
                        }
                });                
                $scope.$parent.$parent.loading = false;
            })
            .fail(function(error) {
                $scope.$parent.$parent.loading = false;   
                    showMessage($mdToast, 'Iniciar error ' + JSON.stringify(error));
                    // showMessage($mdToast, 'Iniciar error ' +jqXHR+'\n<br>'+text_status+'\n<br>'+strError);
            }); 
        }
        $scope.$parent.$parent.loading = true;
        googleapi.authorize({
            client_id       :  Config.client_id,
            client_secret   :  Config.client_secret,
            redirect_uri    :  Config.redirect_uri,
            scope           : 'profile email'
        }).done(function(data) {
            login(data.access_token);
            // console.log(JSON.stringify(data));
            // alert('Sesion finalizada');
        }).fail(function(data) {
            $scope.$parent.$parent.loading = false;   
            showMessage($mdToast, 'Google login fallo: '+JSON.stringify(data));
        });
    } 
}]);

aplicacion.controller('recoverController', ['$scope', 'UserModel', '$mdToast', 'NotificacionesModel', function($scope, UserModel, $mdToast, NotificacionesModel){
    $scope.recuperar = function(){
        
        var message = '';
        var usuario = UserModel.get({email:this.email, scope:'validar'}, function(){
            console.log(usuario);
            if(angular.isDefined(usuario.id)){

                UserModel.get({user:usuario.id, scope:'recuperar'}, function(recover){
                    console.log(recover);
                    if(angular.isDefined(recover.codigo_error)){
                        message = recover.codigo_error+': '+recover.mensaje;
                    }else{
                        message = 'Ocurrió un problema al enviar un correo, intente mas tarde'
                    }
                    showMessage($mdToast, message);
                });
            }else{
                if(angular.isUndefined(usuario.codigo_error)){
                    message = 'No se encontró ningún usuario con este correo';
                }
                else{
                    message = usuario.codigo_error+': '+usuario.mensaje;
                }
                showMessage($mdToast, message);
            }
            
            
        });
    }
}]);

aplicacion.controller('registerController',['$scope', 'UserModel','$mdToast','Config','ngFB',  function($scope, UserModel,$mdToast,Config,ngFB){
    ngFB.init({  appId  : Config.appId  });
    $scope.loading=false;
    $scope.registroConPass=true;
    $scope.user={};
    
    $scope.registerUser = function(isValid){        
        $scope.loading = true;
        if ($scope.projectForm.$valid && isValid) {
            if ($scope.registroConPass == false) {
                $scope.registerCtrl.projectForm = {
                    contrasena     : '',
                    contrasena2    : ''
                }
            }
            var form = $scope.registerCtrl.projectForm;
            if( $scope.registroConPass == true && ( (form.contrasena!=form.contrasena2 ) || angular.isUndefined(form.contrasena2) ) ){
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
    },
    this.registerFacebook = function(ev){        
        var notificar = "",
            statusUserRegisterCallback = function(resp) {
                if (resp.status === 'connected') {
                    registrar(resp.authResponse.accessToken);                return;
                } else if(resp.status === 'not_authorized') {
                    notificar = "No esta autorizado a ingresar a esta aplicación:";
                    ngFB.logout().then(
                        function() {
                            // alert('Sesion finalizada');
                            notificar  += " Sesion finalizada"; 
                        },
                        function(error){
                            // alert('Cierre de sesion fallida '+error);
                            notificar  += 'Cierre de sesion fallida '+error; 
                        });
                } else {
                    notificar = "Existe un problema con el registro, verifique sus datos"
                }
                $scope.$parent.$parent.loading = false;
                showMessage($mdToast, notificar);
            },
            registrar = function(accessToken){
                ngFB.api({ 
                    path: '/me',
                    params: { "access_token": accessToken, "fields":"name,first_name,last_name,email" }
                }).then(
                    function(facebookData) {
                        if ( angular.isUndefined(facebookData.email) ) {
                            showMessage($mdToast, 'Facebook no ha propocionado su correo, edite la informacion para que permita compartirlo');
                        } else {
                            $scope.$parent.$parent.loading = false;
                            var email = UserModel.get({scope:'validar', email:facebookData.email }, function(){
                                if ( !angular.isUndefined( email.codigo_error ) ) {
                                    // alert( JSON.stringify(facebookData) )
                                    $scope.registerCtrl.projectForm = {
                                        name        : facebookData.name,
                                        apdPaterno  : facebookData.first_name,
                                        apdMaterno  : facebookData.last_name,
                                        email       : facebookData.email
                                    }
                                    showMessage($mdToast, 'Complete los datos que faltan para continuar con el registro');
                                    $scope.registroConPass = false;
                                    $scope.sinPass = true;
                                    $scope.noRequired = false;
                                } else {
                                    showMessage($mdToast, 'Su correo: '+facebookData.email+' se encuentra en nuestros servidores');
                                    window.location="#login";
                                }
                            });
                        }
                    },function(error){
                        showMessage($mdToast, 'Iniciar error ' + JSON.stringify(error));
                    }
                );
            }            
        $scope.$parent.$parent.loading = true;
        ngFB.login({scope: 'email'}).then(
            function(response) {
                // alert('Facebook register ' + JSON.stringify(response));
                statusUserRegisterCallback(response);
            },
            function(error) {
                $scope.$parent.$parent.loading = false;   
                // alert('Facebook register fallo: ' + error);
                showMessage($mdToast, 'Facebook register fallo: ' + JSON.stringify(error));
            }
        );
    },
    this.registerGoogle = function(ev){
        var login =function(access_token){
            $.ajax({
                url:'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+access_token,
                type:'GET',
                data: null,
                dataType:'json',
                success:function(googleData){
                    var email = UserModel.query({ email:googleData.email , search:'search' }, function() {
                        $scope.$parent.$parent.loading = false;
                        if ( angular.isUndefined(googleData.email) ) {
                            showMessage($mdToast, 'Google+ no ha propocionado su correo, edite la informacion para que permita compartirlo');
                        } else {
                            $scope.$parent.$parent.loading = false;
                            var email = UserModel.get({scope:'validar', email:googleData.email }, function(){
                                if ( !angular.isUndefined( email.codigo_error ) ) {
                                    // alert( JSON.stringify(googleData) )
                                    var last_name   = googleData.family_name.split(" ");
                                    $scope.registerCtrl.projectForm = {
                                        name        : googleData.given_name,
                                        apdPaterno  : last_name[0],
                                        apdMaterno  : ( angular.isUndefined( last_name[1] ) )? '' : last_name[1],
                                        email       : googleData.email
                                    }
                                    showMessage($mdToast, 'Complete los datos que faltan para continuar con el registro');
                                    $scope.registroConPass = false;
                                    $scope.sinPass = true;
                                    $scope.noRequired = false;
                                } else {
                                    showMessage($mdToast, 'Su correo: '+googleData.email+' se encuentra en nuestros servidores');
                                    window.location="#login";
                                }
                            });
                        }
                    });
                },
                error:function(jqXHR,text_status,strError){
                    $scope.$parent.$parent.loading = false;   
                    // showMessage($mdToast, 'Iniciar error ' + JSON.stringify(error));
                    showMessage($mdToast, 'Iniciar error ' +jqXHR+'\n<br>'+text_status+'\n<br>'+strError);
                }               
            });  
        }
        $scope.$parent.$parent.loading = true;
        googleapi.authorize({
            client_id       :  Config.client_id,
            client_secret   :  Config.client_secret,
            redirect_uri    :  Config.redirect_uri,
            scope           : 'profile email'
        }).done(function(data) {
            login(data.access_token);
            // console.log(JSON.stringify(data));
            // alert('Sesion finalizada');
        }).fail(function(data) {
            $scope.$parent.$parent.loading = false;   
            showMessage($mdToast, 'Error: '+JSON.stringify(data));
        });
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
