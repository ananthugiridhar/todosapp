const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));


app.set('view engine', 'ejs');
var item = ['buji', 'pallan'];

//database connection
const password = 'kysveP-durdyt-2nafty'
mongoose.connect("mongodb+srv://ananthugiridhar:kysveP-durdyt-2nafty@todolist.wb7ss.mongodb.net/todolistDB", 
    {newUrlParser: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,    })
const usersSchema = {
    username : String,
    email : String,
    password : String,
}
const User = mongoose.model('User', usersSchema)


app.get('/', (req, res) => {
    res.render("login")
})


app.post('/', function(req, res)  {
    console.log(req.body);
    item.push(req.body.newItem);
    console.log(item);
    res.redirect('/');
})

app.get('/lists', (req, res) => {
    const day = new Date();
    var options = {
        weekday :'long',
        day: 'numeric',
        month : 'long'
    };

    var today = day.toLocaleDateString("en-US", options);
    res.render("samle", {day : today, items : item})
})

app.post('/lists', (req, res) => { 
    // console.log(req.body);
    if(req.body.email === 'ananthu@gmail.com' && req.body.password == 'pallan007'){
       res.redirect('/lists')
    }
    else{
        res.send('invalid username or password');
    }
})


app.get('/register', (req, res) => {
    res.render("register");
})

app.post('/register', (req, res) =>{
    const user = new User({
        username : req.body.name,
        email : req.body.email,
        password : req.body.password,
    })

  

    User.insertMany(user, (err) =>{
        if(err){
            console.log(err);
        }else{
            console.log('success');
            res.send('added user successfully');
        }
    })
    
})






app.listen(3000, ()=> {
    console.log('sever runnning on port 3000 successfully');
})


