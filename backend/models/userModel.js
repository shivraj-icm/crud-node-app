const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true },
  name:     {type: String},
  password:  { type: String, required: true },
  verified:  { type: Boolean, default: false },
  unique:    { type: String, required: true },
  created:   { type: Date, default: Date.now },
  __v:       { type: Number, select: false },
  userType:  { type: String },
  _p:        { type: Number },
  _sp:       { type: Number }
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);
