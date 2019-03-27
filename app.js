const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/faviconandy.ico'));

mongoose.connect('mongodb+srv://admin-andy:passworD@grocerylist-96vtr.mongodb.net/test?retryWrites=true/GroceryListDB', { useNewUrlParser: true })

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
	
	// Displays the formatted date in the EJS view.
	let day = date.toLocaleDateString('en-US', options);
	let sum = 0;
	Grocery.find({}, function(err, foundGroceries){
		// Adds the price of all items to get total sum.
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
	
	// Receives the ID value from the EJS view and deletes from database.
	Grocery.findByIdAndRemove(groceryItem, function(err){
		if (!err){
			console.log('Item deleted.');
			res.redirect('/');
		} else {
			console.log('Item not deleted.');
		}
	});
});

// Just for Heroku. Allows user to run this application locally on port 3000 if needed.
let port = process.env.PORT;
if (port == null || port == '') {
	port = 3000;
}

app.listen(port, function() {
	console.log('Server started');
});
