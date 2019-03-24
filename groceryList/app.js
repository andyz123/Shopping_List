const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));


let items = ["Chocolate"];

app.get('/', function(req, res){
	let date = new Date();

	let options = {
		weekday: 'long', 
		day: 'numeric', 
		month: 'long'
	};

	let day = date.toLocaleDateString('en-US', options);
	
	res.render('groceryList', {
		currentDay: day,
		groceries: items
	});
});

app.post('/', function(req, res){
	let newItem = req.body.newItem;
	if (newItem != ''){
		items.push(newItem);
	};
	

	res.redirect('/');
});

app.listen(3000, function(){
	console.log('Server started on port 3000');
});