let router = require('express').Router();
let auth = require('../auth');


router.use('/', require('./users'));
router.use('/products', require('./products'));


/* Mongoose validation error will be handelled here */
router.use(function(err, req, res, next){
    if(err.name === 'ValidationError'){
      return res.status(422).json({
        errors: Object.keys(err.errors).reduce(function(errors, key){
          errors[key] = err.errors[key].message;
  
          return errors;
        }, {})
      });
    }
  
    return next(err);
});


module.exports = router;