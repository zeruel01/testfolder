"use strict";

angular.module('originacionApp')
.factory('AccessControl', function(Modules) {
	var accessControl = {};

	accessControl.existModule = function(module, role){
		var modulos = Modules.getAll();
		return ! (angular.isUndefined(modulos[role][module]));
	}

	accessControl.havePermission = function(module, solicitud, user){
		var existeSolicitud = ! (angular.isUndefined(solicitud.id) || solicitud.id == 0);
		var result = {
			access: false, 
			message: 'No tiene acceso a este módulo',
			template: '<div><a href="#solicitud/create" class="md-raised md-primary md-button" >Solicitar crédito</a></div>'
		};
		if(this.existModule(module, user.role)){
			switch(module){
				case 'documentos':
				if(existeSolicitud){
					result.access = true;
				}else{
					result.message = 'Para acceder a tus documentos, primero debes solicitar un crédito';
				}
				break;
				
				case 'credito':
				//if(existeSolicitud && solicitud.situacionCredito==29){
				if(existeSolicitud){
					result.access = true;
				}else{
					result.message = 'Para ver el estado de tu crédito, primero debes solicitarlo';
				}
				case 'buro':
				//if(existeSolicitud && solicitud.situacionCredito==29){
				if(existeSolicitud){
					result.access = true;
				}else{
					result.message = 'Para acceder al buró primero debes solicitar un credito';
				}
				break;
				case 'saldo':
				//if(existeSolicitud && solicitud.situacionCredito==29){
				if(existeSolicitud){
					result.access = true;
				}else{
					result.message = 'Para ver tu saldo actual, primero debes solicitar un crédito';
				}
				case 'mensajes':
					result.access = true;
				break;
				
			}


		}
		return result;
	}
	
	return accessControl;
});