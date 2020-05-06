const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    address: { type: Schema.Types.ObjectId, ref: 'Address' }
});

UserSchema.plugin(mongooseBcrypt);

module.exports = mongoose.model("User", UserSchema);