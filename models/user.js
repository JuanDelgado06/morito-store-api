const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true},
    rol: {type: String, required: true, default: 'customer'},
    address: { type: Schema.Types.ObjectId, ref: 'Address' }
});

module.exports = mongoose.model("User", UserSchema);