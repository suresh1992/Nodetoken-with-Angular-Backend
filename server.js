const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jwt-simple')

var app = express()
mongoose.Promise = Promise

var User = require('./models/User.js')
var Post = require('./models/Post.js')
var auth = require('./auth.js')

app.use(cors())
app.use(bodyParser.json());



app.get('/posts/:id', async (req, res) => {
    var author = req.params.id
    var posts = await Post.find({author})
    res.send(posts)
})

app.post('/post', auth.checkAuthenticate, (req, res) => {
    var postData = req.body;
    postData.author = req.userId
    var post = new Post(postData);

    post.save((err, result) => {
        if (err) {
            console.error('saving post error')
            return res.status(500).send({message: 'Saving post error message'})
        }

        res.sendStatus(200)
    })
})

app.get('/users',  async (req, res) => {

    try {
        var users = await User.find({}, '-password -__v')
        res.send(users)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.get('/profile/:id', async (req, res) => {
    try{
        var user = await User.findById(req.params.id, '-password -__v') 
        res.send(user)
    }catch(error){
    res.sendStatus(200)
    }
})

mongoose.connect('mongodb://sureshpalla:sureshpalla1@ds261296.mlab.com:61296/nodetoken', (err) => {
    if (!err) {
        console.log('Mongo connected')
    }
})

app.use('/auth',auth.router)

app.listen(4000, (res) => {
    console.log('connection done')
});
