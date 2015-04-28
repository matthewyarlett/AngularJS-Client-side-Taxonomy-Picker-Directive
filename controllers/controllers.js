
//App Controller
(function () {
   'use strict';
   var controllerId = 'appCtrlr';
   angular.module('app').controller(controllerId, ['$scope', appCtrlr]);

   function appCtrlr($scope) {
      var vm = this;			
      vm.data = [];				
      vm.context = null;
      vm.terms = [];
      //The data model for the taxonomy picker requires an array of values. Each value 
      //represents a term, and has the Id and Name properties. The Id property takes the 
      //terms TermGuid and the Name property correlates to the terms Label property.          
      vm.terms = [{Id:"dc146209-c1b2-697e-c0e2-9259ba19e750",Name:"Failed Inspection"}];      
      vm.keywords = [];
      vm.hashtags = [];
      vm.loadTaxonomyPickers = true;

      init();

      function init() {			
         //init code.
         //e.g. get data via REST and set the data model.                   
      }
   }
})();
