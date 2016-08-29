
"use strict";

var regexIso8601 = 
/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

function convertDateStringsToDates(input)
{
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) 
    {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        // TODO: Improve this regex to better match ISO 8601 date strings.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
            var milliseconds = Date.parse(match[0]);
            if (!isNaN(milliseconds)) 
            {
                input[key] = new Date(milliseconds);
            }
        } else if (typeof value === "object") 
        {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }

}


aplicacion.filter('picker', function($filter,$interpolate) {
  return function(value, filterName) {
  if(filterName != null &&filterName !="")
  {
  	if(filterName.includes(':'))    
    {
            var result = $interpolate('{{value | ' + arguments[1] + '}}');
        return result({value:arguments[0]});
       //var filterName = [].splice.call(arguments, 1, 1)[0];
       //return $filter(filterName)(value);
      //  return $filter(filterName).apply(null, arguments);
      //return arguments;
      //return filterName;
    }
    else    	
      return $filter(filterName)(value);
      
   }      
    else 
    return value;
  };
});



aplicacion.filter('datefixer', function($filter,$interpolate) {
  return function(value, filterName) {
      
  /*if(filterName != null &&filterName !="")
  {
  	if(filterName.includes(':'))    
    {
            var result = $interpolate('{{value | ' + arguments[1] + '}}');
        return result({value:arguments[0]});
       //var filterName = [].splice.call(arguments, 1, 1)[0];
       //return $filter(filterName)(value);
      //  return $filter(filterName).apply(null, arguments);
      //return arguments;
      //return filterName;
    }
    else    	
      return $filter(filterName)(value);
      
   }      
    else 
    return value;*/
  };
});
angular.module('originacionApp').config(function($mdThemingProvider,  $mdDateLocaleProvider, $httpProvider) {
  $mdThemingProvider.definePalette('amazingPaletteName', {
    '50': 'ffebee',
    '100': 'ffcdd2',
    '200': 'ef9a9a',
    '300': 'e57373',
    '400': 'ef5350',
    '500': '526c84',
    '600': 'e53935',
    '700': 'd32f2f',
    '800': '526c84',
    '900': 'b71c1c',
    'A100': 'ede109',
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'd50000',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  });
  $mdThemingProvider.theme('default')    .primaryPalette('amazingPaletteName');


                $httpProvider.defaults.transformResponse.push(function (responseData)
                {
                convertDateStringsToDates(responseData);
                return responseData;
                });

       
            $mdDateLocaleProvider.formatDate = function (date) {
                return date ? moment(date).format('DD/MM/YYYY') : '';
            };

            $mdDateLocaleProvider.parseDate = function (dateString) {
                var m = moment(dateString, 'DD/MM/YYYY', true);
                return m.isValid() ? m.toDate() : new Date(NaN);
            };


}).constant("Config", {
    //"ApiUrl": "http://nubelab.com/rest/",
    "ApiUrl": "http://dev.ciberburo.com/ws/",
    //"ApiUrl": "http://http://dev.ciberburo.com/api/public/",
    "nameApp": "Ciberburó",
    "SecureKey": "easyred",
    "QualityPhoto": 20,
    //FACEBOOK
    'appId'         : '288029191556183',
    //GOOGLE
    'client_id'     : '165054149619-hrtl33b02afkdntqioo2d23d4fd1uon6.apps.googleusercontent.com',
    'client_secret' : 'nVnfduRRNcRb0QkykvvcbheU',
    'redirect_uri'  : 'http://localhost/v3_soco_app/android/'
});
