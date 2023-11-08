const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require("mongoose")
const User = require('./Model/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express()
require('dotenv').config()
app.use(bodyParser.json())
const PORT = process.env.port
const DB_url = process.env.DB_url

app.use(cors)


// db connection
mongoose.connect(DB_url, {})
    .then(() => { console.log("DB connected") })
    .catch(() => { console.log('could not connect DB') })

//user signup api POST

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10)
    const user = new User({ username, password: hashedpassword })
    try {
        await user.save();
        res.send("Registered Succesfully")
    } catch (error) {
        res.status(500).send('Error occured in registration')
    }

})

// user login API POST

app.post('/user/login', async (req, res) => {
    const { username, password } = req.body;
    const usernamematch = await User.findOne({ username })
    if (!usernamematch) {
        res.json({ messaage: "User not Found" }).status(400)
    }
    const passwordmatch = await bcrypt.compare(password, usernamematch.password)
    if (!passwordmatch) {
        res.json({ messaage: "password does not match" }).status(400)
    }
   

    const token = jwt.sign({ username }, process.env.SECRET_KEY,
        { expiresIn: '1h' }
    )

    res.json({ token })
})

//listen server
app.listen(PORT, () => {
    console.log('the app is running on', PORT)
})