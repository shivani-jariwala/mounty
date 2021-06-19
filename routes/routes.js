const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

//GET users sorted by their distance from the coordinates passed in query params
router.get('/users/distance', async (req,res) => {
  const user = await User.aggregate([
    {
    $geoNear:{
      near:{
        type:'Point',coordinates:[parseFloat(req.query.lng),parseFloat(req.query.lat)]
      },
      distanceField:"dist.calculated",
      spherical:true
    }
  }
  ])
  res.send(user);
});

//GET users sorted by createdAt with pagination
router.get('/users',paginatedData(User),async (req, res) => {
  res.json(res.paginatedResult);
});

//POST Add new user
router.post('/users',async (req, res) => {  
      try {
        const user = await User.create(req.body)
        res.json(user);
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Phone number should be unique' });
      }
});

//PUT update an existing user by id
router.put('/users/:id',async(req,res)=> {
  const id = req.params.id;
  try {
      await User.findByIdAndUpdate(id,req.body);
      const updatedUser = await User.findById(id);
      res.send(updatedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Server Error!' });
    
  }
});

//DELETE delete a user by id
router.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndRemove(id);
    res.send(deletedUser);
    //res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.log(err.message);
  }
});

//function to execute pagination
function paginatedData(model) {
  return async (req,res,next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const results = {};
    if(startIndex > 0) {
      results.previous = {
        page: page-1,
        limit:limit
      };
    }
    if(endIndex <await model.countDocuments().exec() ) {
      results.next = {
        page: page+1,
        limit:limit
      };
    }
    try {
    results.result = await model.find().sort({ created_at:1 }).limit(limit).skip(startIndex).exec(); 
    res.paginatedResult = results;
    next()  
  
  } catch (error) {
      res.status(500).json({message:error.message})
    }
  }
}


module.exports = router;