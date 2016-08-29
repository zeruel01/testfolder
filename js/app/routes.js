"use strict";
angular.module('originacionApp').config(function($routeProvider){
  $routeProvider.
  when("/", {
    templateUrl : "views/dashboard/index.html",
    resolve: {

    }
  })
  .when("/personales", {
    templateUrl : "views/user/view.html",
    controller : "userController"
  })
  .when("/documentos", {
    templateUrl : "views/documentos/index.html",
    controller : "documentosController"
  })
  .when("/documentos/:idDocumento", {
    templateUrl : "views/documentos/view.html"
  })
  .when("/calculadora", {
    templateUrl : "views/calculadora/index.html",
    controller : "calculadoraController"
  })
  .when("/calculadora/result", {
    templateUrl : "views/calculadora/result.html"
  })
  .when("/solicitud", {
    templateUrl : "views/solicitud/view.html"
  })
    
  .when("/solicitud/edit", {
    templateUrl : "views/solicitud/edit.html"
  })
  .when("/solicitud/create", {
    templateUrl : "views/solicitud/create.html"
  })
  .when("/credito", {
    templateUrl : "views/credito/index.html"
  })
  .when("/saldo", {
    templateUrl : "views/saldo/index.html"
  })
  .when("/saldo/amortizacion", {
    templateUrl : "views/saldo/amortizacion.html"
  })
  .when("/buro", {
    templateUrl : "views/buro/index.html"
  })
  .when("/buro/:id", {
    templateUrl : "views/buro/view.html"
  })
  .when("/config", {
    templateUrl : "views/configuracion/index.html"
  })
  .when("/help", {
    templateUrl : "views/app/help.html"
  })
  .when("/notificaciones", {
    templateUrl : "views/notificaciones/index.html"
  })
  .when("/mensajes", {
    templateUrl : "views/mensajes/index.html"
  })
  .when("/mensajes/:id", {
    templateUrl : "views/mensajes/view.html"
  })
  .when("/nuevo-mensaje", {
    templateUrl : "views/mensajes/new.html"
  })
  .when("/responer-mensaje/:id", {
    templateUrl : "views/mensajes/reply.html"
  })
  .when("/salir", {
    templateUrl : "views/salir/index.html"
  })
  //este es digamos, al igual que en un switch el default, en caso que 
  //no hayamos concretado que nos redirija a la página principal
  .otherwise({ reditrectTo : "/app.html" });
})