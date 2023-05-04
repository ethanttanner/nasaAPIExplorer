const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://ethanttanner:fKhqN3JZ3YMdOn36@cluster0.7foau8m.mongodb.net/images?retryWrites=true&w=majority');


// more mongoose code

//mongoose.connect('mongodb://127.0.0.1:27017/test');
// const foodSchema = new Schema({

const Image = mongoose.model('Image', {
    img: {
		type: String,
		required: [true, 'Must provide Image!']
		// unique: true  
    },
    title: {
    	type: String,
    	required: [true, 'Must provide title']
    },
	description: {
		type: String,
		required: [true, 'Must provide Description!']
    }
});

const User = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'Must provide First Name']
	},
	lastName: {
		type: String,
		required: [true, 'Must provide Last Name']
	},
	email: {
		type: String,
		required: [true, 'Must provide email'],
		unique: true
	},
	encryptedPassword: {
		type: String,
		required: [true, 'must provide password']
	}
});

User.methods.setEncryptedPassword = function (plainPassword) {
	var promise = new Promise((resolve, reject) => {
			
		bcrypt.hash(plainPassword, 12).then(hash => {
			this.encryptedPassword = hash;
			resolve();
		});
	});

	return promise;
};

User.methods.verifyEncryptedPassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.encryptedPassword);
    /*var promise = new Promise((resolve, reject) => {
    	bcrypt.hash(plainPassword, this.encryptedPassword, 12).then(hash => {
            this.encryptedPassword = hash;
            console.log(this.encryptedPassword);
            resolve();
        });
    });

    return promise;*/
};

// const food = new foodSchema
module.exports = {
  User: mongoose.model('User', User),
  Image: Image
};


