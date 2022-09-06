// requiring the mongoose library
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    
       description: {
            type:String,
            required:true
        },
       date: {
            type:String,
            required:true,
        },
        typeOfTask: {
            type:String,
            required:true,
        },

}); 


const Task = mongoose.model('Task',taskSchema);

module.exports = Task;

