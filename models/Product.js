let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/* Defining Product schema  */

let ProductSchema = new Schema({
    name:{
        type: String, 
        required:[true, 'is required']
    },
    price:{
        type: String, 
        required:[true, 'is required']
    },
    description:{
        type: String, 
        required:[true, 'is required']
    },
    
});



module.exports = mongoose.model('Product',ProductSchema);