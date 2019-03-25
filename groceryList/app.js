const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));


let groceries = [];
let prices = [];
let sum = 0;

app.get('/', function(req, res){
	let date = new Date();

	let options = {
		weekday: 'long', 
		day: 'numeric', 
		month: 'long'
	};

	let day = date.toLocaleDateString('en-US', options);

	res.render('groceryList', {
		day: day,
		groceries: groceries,
		prices: prices,
		sum: sum.toFixed(2)
	});
});

app.post('/', function(req, res){
	let newItem = req.body.newItem;
	let newPrice = req.body.newPrice;
	let amount = req.body.amount;
	
	// Checks if the item is not just white-space, all numbers, or a duplicate.
	if (newItem.replace(/\s/g, '').length && isNaN(newItem) && groceries.includes(newItem) == false) {
		groceries.push(newItem);
		prices.push(newPrice * amount);
		sum += parseFloat(newPrice)
	} else {
		console.log('Enter groceries!')
	}

	res.redirect('/');
});

app.listen(3000, function(){
	console.log('Server started on port 3000');
});