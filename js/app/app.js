var aplicacion = angular.module('originacionApp', ['md.data.table', 'ngMaterial'
, 'ngResource', 'ngRoute', 'ngSanitize', 'ngMessages', 'base64', 'slick','ui.mask'
]

);

aplicacion.controller('AppCtrl', [
    '$scope', '$mdBottomSheet','$mdSidenav', 'UserModel', 'SolicitudModel', 'Modules', '$mdDialog', '$mdMedia', '$mdToast', 'NotificacionesModel' , '$q', 'Config',
    function($scope, $mdBottomSheet, $mdSidenav, UserModel, SolicitudModel, Modules, $mdDialog, $mdMedia, $mdToast, NotificacionesModel, $q, Config){
        $scope.user = {};
        $scope.solicitud = {};
        $scope.loading = false;
        $scope.totalNotifications = 0;
        $scope.registrationId = '';
        $scope.menuActivo = 'inicio';
        $scope.init = function(){
            $scope.loading = true;
            var userCookie = localStorage.getItem("v3_soco_user");
            if(angular.isUndefined(userCookie)){
                window.location="index.html";
            }
            else{
                var usuario = UserModel.get({user:userCookie}, 
                    function(){
                        if(angular.isUndefined(usuario.id)){
                            showMessage($mdToast, 'Error de sesión');
                            $scope.salir();
                        }else{

                            $scope.user = usuario;
                            var dataSolicitud = SolicitudModel.get({id_user:usuario.id}, function(){
                                console.log(dataSolicitud);
                                if(angular.isUndefined(dataSolicitud.id)){
                                    if(angular.isUndefined(dataSolicitud.codigo_error)){
                                        message  = 'No se encontró nunguna solicitud de crédito'
                                    }
                                    else{
                                        message  = dataSolicitud.codigo_error+': '+dataSolicitud.mensaje;
                                    }
                                }else{
                                    $scope.solicitud = dataSolicitud;
                                    $scope.solicitud.infoComplet = false;  
                                }

                                $scope.menu = Modules.getMenu($scope.user.role);
                                var totalNotifications = NotificacionesModel.get({userId:$scope.user.id, leido:0, tipo:2, scope:'total'}, function(){
                                    $scope.totalNotifications = totalNotifications.total;
                                });

                            }); 
                            $scope.loading = false;
                            if(usuario.permiteNotificaciones == 1){
                                app.initializePush();  
                            }


                        }
                    },
                    function(){
                        showMessage($mdToast, 'Error  de conexión, intente mas tarde');
                        $scope.loading = false;
                    });
            }

        }
        $scope.updateDevice = function(){
            if($scope.registrationId != ''){    
                var device = DeviceModel.query({user_id:$scope.user.id, registration_code: $scope.registrationId, search:'search'}, 
                    function(){
                        if(angular.isUndefined(device[0])){
                            var deviceNew = DeviceModel.new({user_id:$scope.user.id, registration_code:$scope.registrationId, os:$scope.device});  
                        }else{
                            if(device[0].status != 1){
                                var deviceUpdated = DeviceModel.update({id:device[0].id},{registration_code:$scope.registrationId, os:$scope.device, status:1}); 
                            }
                        }
                    });
            }
        }
        $scope.updateDataUser = function(){
            var usuario = UserModel.update({user:$scope.user.id, scope:'registrarDispositivo',registrationId:$scope.registrationId}, {registrationId:$scope.registrationId}, function(){
            //alert(JSON.stringify(usuario));
            }, function(error){
            //alert(JSON.stringify(error));
            });
        }
        $scope.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle({clickOutsideToClose: false});


        };
        $scope.openMenu = function(active) {
            $mdSidenav('left').toggle({clickOutsideToClose: false});
            $scope.menuActivo = active;

        };
        $scope.focusSection = function() {
            $mdSidenav('left').close();
        };
        $scope.salir=function(){
            localStorage.removeItem('v3_soco_user');

            NotificacionesModel.save({usuarioId:$scope.user.id, scope:'updateUser'}, {status:0});
            window.location="index.html";
        } 
        $scope.openNotifications=function(){
            window.location="#notificaciones";
        } 
        $scope.showHelp= function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/app/help.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        }
        $scope.uploadSelfie = function(source){
            var deferr = $q.defer();
            deferr.promise.then(function (imageData){
                $scope.loading = true;
                var usuario = UserModel.updateSelfie({user:$scope.user.id,scope:'selfie'}, {file_camera:imageData}, 
                    function(){
                        showMessage($mdToast, 'Tus datos se actualizaron correctamente');
                        $scope.user.selfie = usuario.selfie; // El ws no esta regresando el nodo selfie
                        $scope.user.selfie = "data:image/jpeg;base64," + imageData;
                        $scope.loading = false;
                    }, 
                    function(error){
                        /*alert(JSON.stringify(error));*/
                        showMessage($mdToast, 'Error  de conexión, intente mas tarde');
                        $scope.loading = false;
  
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

function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}

