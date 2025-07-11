// const User = require('../models/userModel');


// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find(); 
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// module.exports = { getUsers };
const bcrypt        = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');



const createUser = async (req, res) => {
  // validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, userType } = req.body;

  try {
    // check for existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // hash password
    const salt   = await bcrypt.genSalt(12);
    const hash   = await bcrypt.hash(password, salt);

    // create & save user
    user = new User({
      email,
      password: hash,
      verified: false,           // default: false until email verification flow
      unique:   require('crypto').randomUUID(),
      userType,
      // created, __v, _p, _sp all get defaults or remain undefined
    });
    await user.save();

    // return sanitized user object
    const { password: pw, __v, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};








const getUsers = async (req, res) => {
  try {

    const limit  = Math.max(1, Math.min(100, parseInt(req.query.limit)  || 10));
    const page   = Math.max(1,                              parseInt(req.query.page)   || 1);
    const fields = req.query.fields
      ? req.query.fields.split(',').map(f => f.trim()).join(' ')
      : null;

    const skip = (page - 1) * limit;

    // Build the query
    let query = User.find();
    if (fields) query = query.select(fields);
    query = query.skip(skip).limit(limit);

    // Execute
    const users = await query;
    const total = await User.countDocuments();

    // Meta for client
    const totalPages = Math.ceil(total / limit);

    res.json({
      meta: { total, page, totalPages, limit },
      data: users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};



const updateUsers= async(req,res)=>{
const {email} = req.params;
const {name} = req.body;
  try {
    console.log("email:", email);
    console.log("name:", name);
    const updatedUser = await User.findOneAndUpdate(

      { email },            
      { $set:{name: name}},             
      { new: true , runValidators: true}         
    );
    console.log("Mongo has:", updatedUser);


    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User name updated successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }


};
module.exports = { getUsers , createUser, updateUsers};
