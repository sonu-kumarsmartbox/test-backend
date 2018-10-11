let router = require('express').Router();
let User = require('../../models/User');
let auth = require('../auth');
let passport = require('passport');
var EmailTemplate = require('../../models/emailtemplates');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
let crypto = require('crypto');




router.post('/users/login', function (req, res, next) {

    if (!req.body.email)
        return res.status(422).json({ errors: { email: "can't be blank" } });
    if (!req.body.password)
        return res.status(422).json({ errors: { password: "can't be blank" } });

    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err) { return next(err); }

        if (user && user.is_verify) {
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON() });
        } else {
            return res.status(422).json(info);
        }


    })(req, res, next);

});

/* user signup route */

router.post('/users/signup', function (req, res, next) {

    User.findOne({'email': req.body.email}, function (err, data) {
        if(data){
            return res.json({ status:401,'error': 'email already exists' });
        }else{
            let user = new User();
            user.firstname = req.body.firstname;
            user.lastname = req.body.lastname;
            user.email = req.body.email;
            user.password = user.setPassword(req.body.password);
            user.email_activate = crypto.randomBytes(16).toString('hex');
        
            user.save().then(function () {
        
        
                User.findOne({ 'email': req.body.email, }, function (err, data) {
                    if (!err) {
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'sdd.sdei@gmail.com',
                                pass: 'SDEI#2017chdSDD'
                            }
                        });
        
                        var mailOptions = {
                            from: 'sonukumarr120@gmail.com',
                            to: req.body.email,
                            subject: 'Confirmation Email',
                            // text: process.HOST_URL + '/login',
                            html: `<p>Visit this link to activate your account <b><a href= http://localhost:4200/confirm-email/${data.email_activate}>Please click this link to activate account.</a></b></p>`
                        };
        
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
        
                    } else {
        
                        return res.json({ 'error': 'Error occured' });
                    }
                })
        
                return res.json({ 'success': "Email has been sent successfully" });
            }).catch(next);

        }
    })
   
});


router.post('/users/add-product', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(404) }

        if (req.body.products != null) {
            user.addmyProducts(req.body.products).then(function (result) {
                return res.json({ 'success': "200" });
            }).catch(next);
        }

    });

});


router.get('/users/my-products', auth.required, function (req, res, next) {
    User.findById(req.payload.id).populate('products').then(function (user) {
        if (!user) { return res.sendStatus(404) }

        return res.json({ products: user.products });

    });

});


router.put('/users/activate/:activationcode', function (req, res, next) {
    User.findOne({email_activate:req.params.activationcode}).then(function (user) {
        if (!user) { return res.sendStatus(404) }
        user.is_verify = true;
        user.save().then(function () {
            return res.json({ message: "Your account is activated." });
        });


    });

});




module.exports = router;


