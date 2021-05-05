const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));


app.set('view engine', 'ejs');
var item = ['buji', 'pallan'];


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

app.post('/register', (req, res) =>{
    res.render('register')
})


app.listen(3000, ()=> {
    console.log('sever runnning on port 3000 successfully');
})


