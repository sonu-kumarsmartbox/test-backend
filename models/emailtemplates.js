var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmailTemplatesSchema = new Schema({
    name: {
        type: String,
    },
    subject: {
        type: String,
    },
    constants: {
        type: String,
        required: 'Description is required'
    },
    description:{
        type: String,
        required: 'Description is required'
    },
    status: { type: Boolean, default: true },
    is_deleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


module.exports = mongoose.model('emailtemplates', EmailTemplatesSchema);


