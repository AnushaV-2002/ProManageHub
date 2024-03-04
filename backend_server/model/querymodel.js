const { Schema, model } = require('mongoose');

//Creation of Query Schema 
const querySchema=Schema({
    contact_Name:{
      type:String,
      required:[true,'Name is Mandatory']
    },
    contact_Email:{
      type:String,
      required:[true,'Email is Mandatory']
    },
    Query:{
      type:String,
      required:[true,'Query is Mandatory']
    }
  }, {timestamps:true})
  
//Model Creation
const Query=model('queries',querySchema)

//export the query model
module.exports=Query;