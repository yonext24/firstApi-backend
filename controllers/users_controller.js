import User from "../models/User.js"
import Comment from "../models/Comment.js"
import { createError } from "../utils/errorHandler.js"

export const UsersController = {
  getOne: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).populate({
        path: 'comments',
        select: ['comment', '_id']
      })
      if (!user) return next(err)
      res.status(200).json(user)
    } catch(err) {
      return next(err)
    }
  },

  getAll: async (req, res, next) => {
    try {
      const allUsers = await User.find().populate({
        path: 'comments',
        select: ['comment', '_id']
      })
      res.status(200).json(allUsers)
    } catch(err) {
      next(err)
    }
  },
  update: async (req, res) => {
    try {
      console.log(req.params.id)
      const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true})
      res.status(200).json(updatedUser)
    } catch(err) {
      res.status(500).json(err)
    }
  },

  liked: async (req, res, next) => {
    try {
      if (!req.user) return next(createError(400 ,'You must be logged in to get likes!'))
      const user = await User.findById(req.user.id)

      res.status(200).json(user.likedComments)
    } catch(err) {
      next(err)
    }
  },
  disLiked: async (req, res, next) => {
    try {
      if (!req.user) return next(createError(400 ,'You must be logged in to get likes!'))
      const user = await User.findById(req.user.id)

      res.status(200).json(user.disLikedComments)
    } catch(err) {
      next(err)
    }
  },

  delete: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id)
      if (!user) return next(createError(401, 'User not found'))

      user.comments.forEach(async comment => {
        await Comment.findByIdAndDelete(comment._id)
      })

      user.delete()

      res.status(200).json('User has been deleted!!')
    } catch(err) {
      return next(err)
    }
  }
}