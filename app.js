(function () {
    'use strict';        
    var app = angular.module('app', [
      //inject other Angular Modules	
      'ngSanitize',
      'ngResource',	
      'ui.bootstrap',
      //add the tax picker directive
      'ui.TaxonomyPicker',
      //inject App modules
      'common'
    ]);
})();