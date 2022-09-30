import express from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import commentsRoute from './routes/comments.js'
import usersRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

config()

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log('Conected to mongoDB')
  } catch(error) {
    throw error
  }
}

// middlewares
app.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://adorable-panda-7d06e6.netlify.app' : 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Expose-Headers', 'cookie')
  return next();
});  
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://adorable-panda-7d06e6.netlify.app' : 'http://localhost:3000'
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api', authRoute)
app.use('/api', commentsRoute)
app.use('/api/users', usersRoute)

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});


mongoose.connection.on('disconnected', () => {
  console.log('mongoDB Disconnected')
})
mongoose.connection.on('connected', () => {
  console.log('mongoDB Connected')
})

const PORT = process.env.PORT || 8800
app.listen(PORT, () => {
  connect() 
  console.log('server running on port', PORT)
})