(function (zmodule) {

    zmodule.service("generics.services.zipCodes", [
        '$resource','$mdToast' 

        , function ($resource,$mdToast) {

            var resourceList = null;
            var service = {};

            var getResourceList = function () {

                if (resourceList == null) {
                    resourceList = $resource("http://sepomex-api.herokuapp.com/api/v1/zip_codes/?zip_code=:id", {}, {
                        getElementApi: {
                            method: "GET"
                            , isArray: false
                        },
                        addElementApi:
                        {
                            method: "POST"
                            //,isArray: true
                        }

                        , loadElementsApi:
                         {
                             method: "PUT"
                             , isArray: true
                         }

                    });
                }
                return resourceList;
            };



            service =
            {
                getZipCodes: function (
                    zipCode,
                 fnRespuesta, fnError) {

                    var recurso = getResourceList();

                    recurso.getElementApi({ id: zipCode })
                        .$promise.then(function (response) {
                            fnRespuesta(response);
                        }, function (xhr) {
                           showMessage($mdToast,xhr.data ? xhr.data.ExceptionMessage : "Servicio ZipCodes no disponible. Intente mas tarde");
                            if (fnError && typeof fnError == 'function') {
                                fnError();
                            }
                        });
                

                        
                }

            }

            return service;
        }
    ]);
})(angular.module("originacionApp"));