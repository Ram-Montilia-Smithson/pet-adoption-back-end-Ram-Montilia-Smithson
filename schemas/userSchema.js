const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    admin: Boolean,
    login: Boolean,
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: String, 
    lastName: String,
    tel: Number,
    bio: String
});

// userSchema.pre('save', function (next) {
//     // Check if document is new or a new password has been set
//     if (this.isNew || this.isModified('password')) {
//         // Saving reference to this because of changing scopes
//         const document = this;
//         bcrypt.hash(document.password, saltRounds,
//             function (err, hashedPassword) {
//                 if (err) {
//                     next(err);
//                 }
//                 else {
//                     document.password = hashedPassword;
//                     next();
//                 }
//             });
//     } else {
//         next();
//     }
// });

// userSchema.methods.isCorrectPassword = function (password, callback) {
//     bcrypt.compare(password, function (err, same) {
//         if (err) {callback(err);}
//         else {callback(err, same);}
//     });
// }


const User = mongoose.model('User', userSchema);

module.exports = User