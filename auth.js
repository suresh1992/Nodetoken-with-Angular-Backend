const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
var User = require('./models/User.js')
var express = require('express')
var router = express.Router()

router.post('/register', (req, res) => {
    var userData = req.body;
    var user = new User(userData)

    user.save((err, newUser) => {
        if (err) {
            return res.status(500).send({ message: "error saving user" });
        }
        createSendToken(res, newUser)
    })
})

router.post('/login', async (req, res) => {
    var loginData = req.body;

    var user = await User.findOne({ email: loginData.email })

    if (!user) {
        return res.json({ message: "Email or password doesn't match" });
    }
    bcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if (!isMatch) {
            return res.json({ message: "Email or password doesn't match" });
        }
        createSendToken(res,user)
    })
    const passwordIsValid = bcrypt.compareSync(loginData.password, user.password);
    console.log('Is Valid Password :: ' + passwordIsValid);

})
function createSendToken(res,user) {
    var payload = { sub: user._id }
    
            var token = jwt.encode(payload, '123')
    
            res.status(200).send({ token })
}

var auth = {
    router,
    checkAuthenticate:(req, res, next) => {
        if(!req.header('Authorization')){
            return res.status(401).send({message: "Unautherised! Auth header is missing"})
        }
        var token = req.header('Authorization').split(' ')[1]
        
        var payload = jwt.decode(token, '123')
    
        if(!payload)
             return res.status(401).send({message: "Unautherised! Pay-loader header is missing"}) 
        
        req.userId = payload.sub
    
        next()
    
    }
}

module.exports = auth