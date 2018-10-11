let router = require('express').Router();
let User = require('../../models/User');
let Product = require('../../models/Product');

let auth = require('../auth');

router.get('/',function(req,res,next) {
    Product.find().then(function(products){
        res.json({products:products});

    }).catch(next);
    
});
module.exports = router;