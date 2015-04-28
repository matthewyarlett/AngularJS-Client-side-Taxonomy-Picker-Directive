(function () {
    angular.module('ui.TaxonomyPicker', [])
    .value('uiTaxonomyConfig', {})
    .directive('uiTaxonomy', ['uiTaxonomyConfig', '$q', '$resource', '$timeout', function (uiTaxonomyConfig, $q, $resource, $timeout) {
        uiTaxonomyConfig = uiTaxonomyConfig || {};
        var generatedIds = 0;
        return {
            require: ['ngModel'],
            priority: 10,
            link: function (scope, elm, attrs, ngModel) {
            // generate an ID if not present
            if (!attrs.id) {
              attrs.$set('id', 'uiTaxonomy' + generatedIds++);
            }
            var taxonomyModel = null;
            var updateView = function () {
                    ngModel[0].$setViewValue(taxonomyModel);
                    if (!scope.$root.$$phase) {
                        scope.$apply();
                    }
                };	
				var getViewValue = function(){
					return ngModel[0].$modelValue;
				}	                        
				var securityValidation = ''; 
				var loading = true;
				var dataLoaded = false;
				var scriptsLoaded = false;
            var eventAttached = false;
            var context = null;
				var _termSetId = (attrs.ppTermsetid === 'undefined') ? null : attrs.ppTermsetid;
            var _useHashTags = (attrs.ppIsMultiuser == true || attrs.ppIsKeywords == 'true') ? true : false;	
            var _useKeywords = (attrs.ppIsMultiuser == true || attrs.ppIsHashtags == 'true') ? true : false;	
            var _isMultiValued = (attrs.ppIsMultiuser == true || attrs.ppIsMultiValued == 'true') ? true : false;	
				var pickerWidth = (attrs.ppWidth && attrs.ppWidth.match(/^[0-9][0-9]*px$/i)) ? attrs.ppWidth : '220px';
            var pickerEditorWidth = (pickerWidth.substring(0, (pickerWidth.length -2)) - 26) + "px";
            var $pickerId = attrs.id + 'picker';
            this.$elm = elm;            
				var taxonomyPickerInstance = elm[0];
            $(taxonomyPickerInstance).css('width',pickerWidth);
            var taxPickerEditorNode = null;
            var inputNode = document.createElement('INPUT');
            inputNode.type = 'Hidden';
            inputNode.id = $pickerId; 
            taxonomyPickerInstance.appendChild(inputNode);
							
				var models = {};
            models.taxonomyPickerSchema = function(_termSetId, _useHashTags, _useKeywords, _isMultivalued){
               this.taxonomyPickerSchema = {};
               this.isMulti = (_isMultiValued == true ? true : false),
               this.allowFillIn = false,
               this.termSetId = _termSetId,
               this.isReadOnly = false,
               this.lcid = 1033,
               this.language = 'en-us',
               this.maxSuggestions = 5,
               this.useKeywords = (_useKeywords == true ? true : false),
               this.useHashtags = (_useHashTags == true ? true : false)
            }
            				
				function init() {										
					waitForScriptsToLoad().then(function (ctx) {
						context = ctx;
                  scriptsLoaded = true;
						if(dataLoaded){
							initializeTaxonomyPicker();
						}
					})["catch"](function (error) {
						//log error
					});					
				};					
				            
				scope.$watch(function(){return attrs.ppReadyToLoad}, function(value) {
				  if(value == true || value == 'true'){
					dataLoaded = true;
               setTaxonomyPickerInitialValue(inputNode,  getViewValue());
					if(scriptsLoaded){
						initializeTaxonomyPicker();
					}
				  }
				});
            
            scope.$watch(function(){return taxonomyPickerInstance.children.length}, function(value) {
				  if(value == 2 && eventAttached == false){               
					taxPickerEditorNode = taxonomyPickerInstance.childNodes[0].childNodes[0]; 
               $(taxPickerEditorNode).css('width', pickerEditorWidth);
               $(taxPickerEditorNode).focusout(function(){
                   syncTaxonomyValues();
               });
               eventAttached = true;
				  }
				});
            
            function syncTaxonomyValues(){
               var picker = document.getElementById($pickerId);
               if(picker){
                  if(picker.value != ''){
                     taxonomyModel = JSON.parse(picker.value);
                  }
                  updateView();
               }              
            }

            function setTaxonomyPickerInitialValue(valueElement, taxonomyValues){
               if(valueElement && taxonomyValues){
                  if(taxonomyValues instanceof Array){					
                     var jArray = [];
                     for(var i = 0; i < taxonomyValues.length; i++){
                        var tv = taxonomyValues[i];
                        var termId = tv.TermGuid === undefined ? tv.Id : tv.TermGuid;
                        var termLabel = tv.Label === undefined ? tv.Name : tv.Label;
                        jArray.push({'Id':termId,'Name':termLabel});
                     }
                     valueElement.value = JSON.stringify(jArray);
                  }
                  else{
                     var jString = '';
                     var termId = taxonomyValues.TermGuid == 'undefined' ? taxonomyValues.Id : taxonomyValues.TermGuid;
                     var termLabel = taxonomyValues.Label == 'undefined' ? taxonomyValues.Name : taxonomyValues.Label;
                     jString = '[{"Id":"'+termId+'","Name":"'+termLabel+'"}]';
                     valueElement.value = jString;
                  }	
               }		
            }
            
				function initializeTaxonomyPicker() {					
					taxonomyModel = getViewValue();
					if(!taxonomyModel){
						taxonomyModel = [];						
						updateView();
					}
					var tSchema = new models.taxonomyPickerSchema(_termSetId, _useHashTags, _useKeywords, _isMultiValued);			
               $('#'+$pickerId).taxpicker(tSchema, context, syncTaxonomyValues);
					loading = false;
				}
            
				function waitForScriptsToLoad() {
               var deferred = $q.defer();
               var context;
               SP.SOD.executeFunc("SP.js", null, function(){
                  context = SP.ClientContext.get_current(); 
                  $.getScript(context.get_url() + "/_layouts/15/SP.Runtime.js", function(){
                     $.getScript(context.get_url() + "/_layouts/15/sp.taxonomy.js", function(){
                        deferred.resolve(context);
                     })
                  })
               });
               return deferred.promise;
            }
            
            ngModel.$render = function () {                    
              if (taxonomyPickerInstance) {                        
                  init();
                  ngModel.$setPristine();
              }
            };
				
				init();
            }
        };
    }]);
})();
