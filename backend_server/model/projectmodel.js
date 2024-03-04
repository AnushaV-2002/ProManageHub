const { Schema, model } = require('mongoose');

//creation of project schema
const projectSchema =Schema({
  userId: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Project_Name: { 
    type: String, 
    required: true 
  },

  Project_Description:{
    type: String, 
    required: true 
  },
  Project_Stack:{
    type: Array, 
    required: true 
  },
  Project_Github:{
    type:String,
    required:true
  },
  Project_Demo:{
    type:String,
    required:true
  }
});

//creation project model
const Project = model('projects', projectSchema);

//export project model
module.exports = Project;
