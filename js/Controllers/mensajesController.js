"use strict";
angular.module('originacionApp')
.controller('mensajesController', ['$scope', 'MensajesModel', '$routeParams','$timeout', '$mdToast', 'AccessControl', '$q', 'Config', '$mdDialog', '$mdMedia', function ($scope, MensajesModel, $routeParams, $timeout, $mdToast, AccessControl, $q, Config, $mdDialog, $mdMedia) {
    this.params=$routeParams,
    this.accessObj = {},
    this.mensaje = {},

    this.init = function(){
        $scope.$parent.$parent.loading=true;
        this.accessObj=AccessControl.havePermission('mensajes', $scope.solicitud, $scope.user);
        if(this.accessObj.access){
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
                    $scope.mensajesCtrl.mensajes = mensajes;
                    $scope.$parent.$parent.loading=false;
                }
                console.log(mensajes);
                
            });
        }    
    },
    this.loadView = function(id){
        window.location="#mensajes/"+id;
    },
    this.view = function(id){
        $scope.$parent.$parent.loading=true;
        var mensaje = MensajesModel.get({id:id}, function(){
            $scope.mensajesCtrl.mensaje = mensaje;
            $scope.mensajesCtrl.marcarLeido(mensaje);
            $scope.$parent.$parent.loading=false;
        })
    }, 
    this.marcarLeido = function(mensaje){
        var mensajesActualizar = new Array();
        console.log(mensaje);
        if(mensaje.status == 1 && mensaje.tipo == 2){
            mensajesActualizar.push(mensaje.id);
        }
        if(angular.isDefined(mensaje.mensajes)){
            angular.forEach(mensaje.mensajes, function(mensajeHijo){
                if(mensajeHijo.status ==1 && mensajeHijo.tipo == 2){
                    mensajesActualizar.push(mensajeHijo.id);
                }
            });
        }
        console.log(mensajesActualizar);
        angular.forEach(mensajesActualizar, function(mensajeActualizar){
            console.log(mensajeActualizar);
            MensajesModel.update({id:mensajeActualizar}, {status:2});
        });
    }
    this.goBack = function(){
        window.location="#mensajes";
    },
    this.new = function(ev, mensajeId){
        var mensajePadre = this.mensaje;
        var mensajeForm ={};
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show( {
            templateUrl: 'views/mensajes/form.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
            controller:function ($scope, $mdDialog) {
                $scope.mensajePadre = mensajePadre;

                $scope.mensajeForm = mensajeForm;
                
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.new = function(){
                    console.log(mensajeForm);
                    if(mensajeForm.asunto && mensajeForm.mensaje){
                        console.log(mensajeForm);
                        var nuevoMensaje = MensajesModel.new(mensajeForm, function(){
                            showMessage($mdToast, 'Mensaje enviado');
                            if(nuevoMensaje.mensaje_padre == 0){
                                window.location = '#mensajes';
                            }else{
                                mensajePadre.mensajes.push(nuevoMensaje);
                            }
                            $mdDialog.hide();
                        });
                    }else{
                        alert('Imgresa todos los campos');
                        return;
                    }
                };

            },
            onComplete:function(){
                if(angular.isDefined(mensajePadre.id)){
                    mensajeForm.asunto = 'RE:'+mensajePadre.asunto;
                    mensajeForm.mensaje_padre = mensajePadre.id;

                }else{
                    mensajeForm.mensaje_padre = '0';                    
                }
                mensajeForm.user_id = $scope.user.id;
            }
        });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });


    }



}]);