const express = require('express');
const app = express();
const cors = require('cors');
const model = require('./model');
const port = process.env.PORT || 8080;

const session = require('express-session');
const User = require('./model');
const url = require('url');
const querystring = require('querystring');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
	credentials: true,
	origin: function(origin, callback) {
		callback(null, callback);
	}
}));
app.use(session({
	secret: "sfkdakdsadfkjlsadn3",
	saveUninitialized: true,
	resave: false
}));

async function authorizeRequest(req, res, next) {
	console.log(req.sessionID);
	console.log(req.session.userID);

	//if (req.session && req.session.userID) {
	if (req.session && req.sessionID) {
		console.log("email", req.body.email);
		const user = await model.User.findOne({ email: req.body.email });
		console.log(user);
		if (user) {
			console.log("authenticated");
  			req.user = user;
	      	next();
        } else {
			res.status(401).send("Unauthenticated");
          }
  	}
	else {
		res.status(401).send("Unauthenticated");
		//next();
	}
};

app.get('/users', function (req, res) {
	model.User.find().sort().then(users => {
		res.json(users);
		//res.status(200).send("authenticated");	
	});
})


// retrieve food collection
app.get('/images', function (req, res) {
	console.log(req.session);
	if (req.session.userID) {
		model.Image.find().sort().then(images => {
			res.json(images);
			//res.status(200).send("authenticated");	
		});
	} else {
		console.log("failed");
		res.status(401).send("Unauthenticated");
	}
	/*
	if (req.session && req.session.userID) {
		if (user) {
			model.Image.find().sort().then(images => {
				res.json(images);	
				res.status(200).send("Unauthenticated");
			});
		} 
	}	else {
			console.log("else");
			res.status(401).send("Unauthenticated");
		}*/
	});


app.post('/users', function (req, res) {
    console.log('parsed request body: ', req.body);
    //res.setHeader('Access-Control-Allow-Origin', '*');
    const newUser = new model.User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
         });

	newUser.setEncryptedPassword(req.body.password).then(function () {

		newUser.save().then(() => {
			res.status(201).send("Created user.");
		}).catch((error) => {
			if (error.code == 11000 ) {
				res.status(422).json({
					email: "Must be unique!"				
				});
			}
			else if (error.errors) {
				let errorMessages = {};
				for (let e in error.errors) {
					errorMessages[e] = error.errors[e].message;
				}
				res.status(422).json(errorMessages);
			}
			else {
				console.error('failed to save user to db', error);
				res.status(500).send("Server failed to create user.");
				}
			});
	});
});		


app.post('/users/login', async (req, res) => {
    try {
        const user = await model.User.findOne({ email: req.query.email });
        if (user) {
            const isValidPassword = await user.verifyEncryptedPassword(req.query.password);
            if (isValidPassword) {
                req.session[userID] = user._id;
                res.send('Logged in successfully');
                //return res.status(200).send("User found");
            } else {
                req.session.userID = null;
                return res.status(401).send('Invalid email or password');
            }
        } else {
            req.session.userID = null;
            return res.status(401).send('No user found');
        }
    } catch (error) {
        console.error(error);
        req.session.userID = null;
        return res.status(500).send('Internal server error');
    }
});


app.post('/users/logout', (req, res) => {
	console.log("logging out");
	console.log( req.sessionID, "\n");
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Logged out successfully');
    }
  });
  console.log(req.sessionID);
});




app.post('/session', function (req, res) {
	model.User.findOne({ email: req.body.email }).then(function (user) {
		if (user) {
			user.verifyEncryptedPassword(req.body.password).then(function (result) {
			if (result) {
				res.status(201).send("Authenticated");
				req.session.userID = user._id;
			} else {
				res.status(401).send("Unauthenticated");


				newUser.save().then(() => {
		        res.status(201).send("Created new user. ");
		    }).catch((error) => {
            	console.log('failed to save to user');
            	if (error.code == 1100) { // special case
                	res.status(422).json({
                    	name: 'Name must be specific'
            	});
    	};
    });




			}
			});	
		}	
	});
});

app.get('/session', function (req, res) {
	console.log("the current session data is: ", req.session);
//	res.status(200).send("TESTING");
	res.json(req.user);

	if (req.session && req.session.userID) {
		if (user) {
			res.json(user);
		} else {
			res.status(401).send("Unauthenticated");
		}
	}	

});
/*
    newUser.save().then(() => {
        console.log('image saved to db');
        res.status(201).send("Created new user. ");
    //MY_FOODS.push(req.body);
    }).catch((error) => {
            console.log('failed to save to user');
            if (error.code == 1100) { // special case
                res.status(422).json({
                    name: 'Name must be specific'
            });


    };
    });


*/


app.post('/images', function (req, res) {
	console.log('parsed request body: ', req.body);
	//res.setHeader('Access-Control-Allow-Origin', '*');
	const newImage = new model.Image({ 
		img: req.body.img,
		title: req.body.title,
		description: req.body.description
		 });
	newImage.save().then(() => {
		console.log('image saved to db');
		res.status(201).send("Created new image. ");		
	}).catch((error) => {
			console.log('failed to save to db');
			if (error.code == 1100) { // special case
	        	res.status(422).json({
	            	name: 'Name must be specific'
	    	});


	};
	});
});


app.delete('/images/:imageId', function (req, res) {
	model.Image.findOne({_id: req.params.imageId}).then(image => {
	if (image) {
		model.Image.deleteOne({_id: req.params.imageId }).then(image => {
			res.status(204).send("Image deleted");
		});
	} else {
		res.status(404).send("Failed");
	};	
	});
});


app.put('/images/:imageId', (req, res) => { 
	model.Image.findOne({_id: req.params.imageId}).then(image => {
	
	if (image) {
		model.Image.updateOne({ img: req.body.img }, { title: req.body.title ,  description: req.body.description }).then(image => {
			res.status(200).send("Image updated");
		});
	} else {
		res.status(404).send("Failed");
	};	
	});
	});



app.listen(port, function () {
	console.log('Server is running on port' , port);
});
