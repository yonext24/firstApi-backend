import jwt from 'jsonwebtoken'
import Comment from '../models/Comment.js'
import { createError } from './errorHandler.js'

export const verifyToken = (req, res, next) => {
  const token = req.xxxxx || req.headers.xxxxx || req.cookies.access_token
  console.log(token)
  console.log(req)
  if (!token) {
    return next(createError(401, 'You are not logged!'))
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid"))
    console.log('Valid')
    req.user = user
    next()
  })
} 

export const verifyUser = async (req, res, next) => {

  const comment = await Comment.findById(req.params.id)
  if (comment.author.username === req.user.username || req.user.isAdmin) return next()
  
  return next(createError(403, 'You are not authorized'))
}

export const verifyAdmin = (req, res, next) => {
  console.log('hola')
  
  if (req.user.isAdmin) return next()

  return next(createError(403, 'You are not authorized'))
}
