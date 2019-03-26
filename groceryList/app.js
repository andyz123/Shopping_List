const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/GroceryListDB', { useNewUrlParser: true })

const groceryModel = {
	name: {
		type: String,
		unique: true
	},
	price: Number,
	quantity: Number,
	sum: Number
};

const Grocery = mongoose.model('Grocery', groceryModel);

app.get('/', function(req, res){
	let date = new Date();

	let options = {
		weekday: 'long', 
		day: 'numeric', 
		month: 'long'
	};

	let day = date.toLocaleDateString('en-US', options);
	let sum = 0;
	Grocery.find({}, function(err, foundGroceries){
		for (let i = 0; i < foundGroceries.length; i++){
			sum += foundGroceries[i].sum;
		}
		res.render('groceryList', {
		day: day,
		groceries: foundGroceries,
		sum: sum
	});
	})

});

app.post('/', function(req, res){
	let newItem = req.body.newItem;
	let newPrice = req.body.newPrice;
	let quantity = req.body.amount;

	// Checks if the item is not just white-space, all numbers, or a duplicate.
	if (newItem.replace(/\s/g, '').length && isNaN(newItem)) {
		const grocery = new Grocery({
			name: newItem,
			price: newPrice,
			quantity: quantity,
			sum: newPrice * quantity
		});
		grocery.save();

	} else {
		console.log('Enter groceries!')
	}

	res.redirect('/');
});

app.post('/delete', function(req, res){
	let groceryItem = req.body.delete;

	Grocery.findByIdAndRemove(groceryItem, function(err){
		if (!err){
			console.log('Item deleted.');
			res.redirect('/');
		} else {
			console.log('Item not deleted.');
		}
	});
});

app.listen(3000, function(){
	console.log('Server started on port 3000');
});