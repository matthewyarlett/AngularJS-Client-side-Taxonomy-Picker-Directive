var sr = sr || {};
sr.models = sr.models || {};

sr.models.shipInfoModel = function (id) {
   this.Id = id ? id : -1;
   this.pa28754972f84ff7a6bf3e4762f23e23;
   this.__metadata = {
      type: 'SP.Data.SrShipRegisterListItem'
   };
}


function populateShipInfoModel(srcModel, tagsTerms) {
   var dstModel = new sr.models.shipInfoModel(srcModel.Id); 
   //Update the taxonomy field values	
   if(srcModel.Tags && srcModel.Tags.results){
      if(srcModel.Tags.results.length == 0){
         dstModel.pa28754972f84ff7a6bf3e4762f23e23 = '';
      }else{
         for(var i = 0; i < srcModel.Tags.results.length; i++)
         {
            var t = srcModel.Tags.results[i];
            dstModel.pa28754972f84ff7a6bf3e4762f23e23 = dstModel.pa28754972f84ff7a6bf3e4762f23e23 + ';' + t.Name + '|' + t.Id;			
         }	
      }	
   }
   dstModel.__metadata.etag = srcModel.__metadata.etag;
   dstModel.__metadata.id = srcModel.__metadata.id;
   dstModel.__metadata.uri = srcModel.__metadata.uri;
   return dstModel;
}

