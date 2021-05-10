const express = require('express');
require('dotenv').config({path:__dirname+'/.env'})
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));


app.set('view engine', 'ejs');
// var item = ['buji', 'pallan'];
var today = '';
var username = '';



// User database connection
const db_password = process.env['DB_PASSWORD'].toString();
const db_username = process.env.DB_USERNAME;


mongoose.connect(`mongodb+srv://${db_username}:${db_password}@todolist.wb7ss.mongodb.net/todolistDB`, 
    {useNewUrlParser: true, useUnifiedTopology: true, })
 
//user schema
const usersSchema = {
    username : String,
    email : String,
    password : String,
}
const User = mongoose.model('User', usersSchema)

//items schema
const itemsShema = {
    username : String,
    item : String,
}
const Item = mongoose.model('Item', itemsShema);


//for login screen
app.get('/', (req, res) => {
    res.render("login")
})


//for checking user credentials 
app.post('/', function(req, res)  {
    const day = new Date();
    var options = {
        weekday :'long',
        day: 'numeric',
        month : 'long'
    };
    today = day.toLocaleDateString("en-US", options);
    

    User.findOne({email : req.body.email, password : req.body.password}, (err, result) =>{  
        if(result){ 
            username = result.username;
            res.redirect('/lists');
        }else{
            res.send('invalid username or password');
        }
    })
})


//endpoint for getting list items for a particular user
app.get('/lists', (req, res) => {
    var foundItems = [];
    
    Item.find({username : username}, (err, result) => {
        if(err){
            res.send(err)
        }else{
            foundItems = result;
            res.render("samle", {day: today, items: foundItems, name: username})
        }
        
    })
    

})


//endpoint for adding new item for a particular item
app.post('/lists', (req, res) => {
    const item = new Item({
        username : username,
        item : req.body.newItem,
    })

    Item.insertMany(item, (err) => {
        if(err){
            res.send(err)
        }else{
            res.redirect('/lists');
        }
    })
    
})


//endpoint for register form
app.get('/register', (req, res) => {
    res.render("register");
})


//adding new user to the UsersList
app.post('/register', (req, res) =>{
    const user = new User({
        username : req.body.name,
        email : req.body.email,
        password : req.body.password,
    }) 

    User.findOne({email : req.body.email}, (err, result) =>{  
        if(result){ 
            res.send('Account with this email already exist');
        }else{
            User.insertMany(user, (err) =>{
                if(err){
                    console.log(err);
                    res.send(err);
                }else{
                    res.redirect('/');
                }
            })
        }
    })
    

   
    
})


app.post('/delete', (req, res) => {

    Item.deleteOne({_id : req.body.id}, (err) => {
        if(err){
            res.send(err);
        }else{
            res.redirect('/lists');
        }
    })
})





app.listen(3000, ()=> {
    console.log('sever runnning on port 3000 successfully');
})


