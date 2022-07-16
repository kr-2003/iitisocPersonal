const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'hwfivbriybfrbrug3qybybovogcuyctciy'

mongoose.connect('mongodb://localhost:27017/login-app-db', {

});

const app = express();

app.use('/' , express.static(path.join(__dirname, 'static')))

app.use(bodyParser.json());

app.post('/api/login', async (req,res) => {
  const { username, password } = req.body


  const user = await User.findOne({ username }).lean()

  if(!user){
    return res.json({ status: 'error', error: 'Invalid Username/Password'})
  }

  if(await bcrypt.compare(password, user.password)){

    const token = jwt.sign({
      id: user._id,
      username: user.username
    },
      JWT_SECRET
    )
    return res.json({ status: 'ok', data: token })
  }else{
    res.json({ status: 'error', error: 'Invalid Username/Password'})
  }

})

app.post('/api/register', async (req , res) => {
  console.log(req.body)

  const { username, password: plainTextPassword } = req.body;


  if(!username || typeof username !== 'string'){
    return res.json({ status: 'error', error: 'Invalid Username'})
  }
  if(!plainTextPassword || typeof plainTextPassword !== 'string'){
    return res.json({ status: 'error', error: 'Invalid Password'})
  }
  if(plainTextPassword.length < 5){
    return res.json({
      status: 'error',
      error: 'Password too small. Choose a Password which contains more than 5 characters.'
    })
  }

  const password = await bcrypt.hash(plainTextPassword , 10)

try {
  const response = await User.create({
    username,
    password,

  })
  console.log('User created successfully: ' ,response)
} catch (error){
  console.log(error)
  return res.json({ status:'error'})
}

  res.json({ status: 'ok'});
});
app.listen(3000, ()=> {
  console.log('Server up at 3000')
})
