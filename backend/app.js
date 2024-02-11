const express = require ('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
// Connect to the database
const url = `mongodb+srv://mahadsheikh:mahadsheikh@cluster.qhe82rf.mongodb.net/?retryWrites=true&w=majority`;

const connectionParams={}

mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. ${err}`);
    })
    
app.use(cors())

app.listen(3001, () => {
    console.log('Server is running...')
})