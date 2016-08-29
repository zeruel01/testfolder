"use strict";

angular.module('originacionApp')
.factory('Modules', function() {
	var modules = {};
	
	modules.getAll = function(){
		var roles = {
			'interno':null, 
			'cliente':{
				'inicio':{
					'icon':'home', 
					'label':'Inicio', 
					'link':'#/',
					'color':'#429bc5'
				}, 
				'notificaciones':{
					'icon':'bell', 
					'label':'Notificaciones', 
					'link':'#notificaciones',
					'color':'#e9ac42'
				}, 
				'mensajes':{
					'icon':'envelope', 
					'label':'Mensajes', 
					'link':'#mensajes',
					'color':'#e9ac42'
				}, 
				'solicitud':{
					'icon':'file-text-o', 
					'label':'Solicitud', 
					'link':'#solicitud',
					'color':'#e9ac42'
				}, 
				'documentos':{
					'icon':'files-o', 
					'label':'Documentos', 
					'link':'#documentos',
					'color':'#d7db67'
				}, 
				'calculadora':{
					'icon':'calculator', 
					'label':'Calculadora', 
					'link':'#calculadora',
					'color':'#526c84'
				}, 
				'credito':{
					'icon':'credit-card', 
					'label':'Crédito', 
					'link':'#credito',
					'color':'#8dc7d4'
				}, 
				'saldo':{
					'icon':'dollar', 
					'label':'Saldo', 
					'link':'#saldo',
					'color':'#ff74c9'
				},  
				'buro':{
					'icon':'bank', 
					'label':'Buró', 
					'link':'#buro',
					'color':'#db6777'

				},  
				'config':{
					'icon':'user', 
					'label':'Perfil', 
					'link':'#config',
					'color':'#a487b1'

				}, 
			},
			'clienteShort':{
				'inicio':{
					'icon':'home', 
					'label':'Inicio', 
					'link':'#/',
					'color':'#429bc5'
				}
				/*, 
				'notificaciones':{
					'icon':'bell', 
					'label':'Notificaciones', 
					'link':'#notificaciones',
					'color':'#e9ac42'
				}, */
				/*'mensajes':{
					'icon':'envelope', 
					'label':'Mensajes', 
					'link':'#mensajes',
					'color':'#e9ac42'
				}, */,
				'solicitud':{
					'icon':'file-text-o', 
					'label':'Solicitud', 
					'link':'#solicitud',
					'color':'#e9ac42'
				}, 
				'documentos':{
					'icon':'files-o', 
					'label':'Documentos', 
					'link':'#documentos',
					'color':'#d7db67'
				}, 
				'calculadora':{
					'icon':'calculator', 
					'label':'Calculadora', 
					'link':'#calculadora',
					'color':'#526c84'
				}, 
				'credito':{
					'icon':'credit-card', 
					'label':'Crédito', 
					'link':'#credito',
					'color':'#8dc7d4'
				}, 
				'saldo':{
					'icon':'dollar', 
					'label':'Saldo', 
					'link':'#saldo',
					'color':'#ff74c9'
				},  
				'buro':{
					'icon':'bank', 
					'label':'Buró', 
					'link':'#buro',
					'color':'#db6777'

				},  
				/*'config':{
					'icon':'user', 
					'label':'Perfil', 
					'link':'#config',
					'color':'#a487b1'

				}, */
			}


		};	
		return roles;
	}
	modules.getMenu = function(rol){
		var roles = modules.getAll();
		return roles[rol];
	}

	
	return modules;
});