//for use route
var express = require('express');
const jwt = require('jsonwebtoken')
var router = express.Router();

const { login } = require('../service/login');
const { register } = require('../service/register')
const { logout } = require('../service/logout')
const { getUser } = require('../service/getUser')
const { joiValidation } = require('../middleware/joiValidation');
const { loginSchema, registerSchema } = require('../schemas/index')
const {ensureSignedIn, ensureSignedOut, currentUser} = require('../middleware/auth');
const { func } = require('joi');
const userService = require('../service/user')

//home page 
router.get('/', function(req,res,next) {
    console.log("router up");
    res.send("Hello, this is API");
});
//login page
router.post('/login',async function(req,res,next) {
    const param = req.body;
    const {email,password} = param
    const result = await login(email, password);
    if(result.success){
        const token = jwt.sign(param, "t0kenEncrypti0n");
        req.session.jwtToken = token;
    }
    res.json(result);
});


//register page
router.post('/register', async function(req,res,next) {
    const param =req.body;
    console.log(req.body);
    const result = await register(param);
    //  const result = await register(req);
    res.json(result);
});


//logout page
router.post('/logout', ensureSignedIn, function(req, res, next){
    const result = logout(req.session);
    res.clearCookie('token')
    res.json(result);
});


//get user by id
router.get('/user/:id', ensureSignedIn, async function(req, res, next){
    var userId = req.path.split("/user/")[1]
    console.log(userId)
    result = await getUser(userId)
    res.json(result)
});


//me
router.get('/me', currentUser, async function(req, res, next){
    const { currentUser } = req;
    const result = await userService.findByOne(currentUser.email)
   res.json(result)
})
router.get('/findall', ensureSignedIn, async function(req, res, next){
    const result = await userService.findall();
    res.json(result)
})
router.post('/update-password', ensureSignedIn, currentUser, async function(req, res, next){
    const email = req.currentUser.email
    console.log(email)
    const param = req.body;
    const newPassword = param.password
    const result = await userService.updatePass(newPassword, email)
    res.json(result)
})
router.post('/update-user', ensureSignedIn, currentUser, async function(req, res, next){
    const email = req.currentUser.email
    const param = req.body;
    const newInfo = param;
    const result = await userService.updateUser(newInfo, email)
    res.json(result)
})
router.post('/delete-user', ensureSignedIn, currentUser, async function(req,res,next){
    const email = req.currentUser.email
    const result = await userService.deleteUser(req.body.email);
    if(result.success){
        logout(req.session);
        res.clearCookie('token')
    }
    res.json(result)
})

module.exports = router;