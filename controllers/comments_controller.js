import Comment from "../models/Comment.js"
import User from '../models/User.js'
import { createError } from "../utils/errorHandler.js"

export const CommentsController = {
  getOne: async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.id)
      if (!comment) return next(createError(401, 'comment not found'))

      await comment.populate({
        path: 'author',
        select: ['username', '_id']
      })

      res.status(200).json(comment)
    } catch (err) {
      res.status(400).json(err)
    }
  },

  getAll: async (req, res) => {
    try {
      const allComments = await Comment.find().populate({
        path: 'author',
        select: ['username', '_id']
      }).populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: ['username', '_id']
        }
      })
      res.status(200).json(allComments)
    } catch (err) {
      console.log(err)
      res.status(400).json(err)
    }
  },

  create: async (req, res, next) => {
    if (!req.user) return next(createError(401, 'You must be logged to create a comment!'))
    
    const newComment = new Comment({
      comment: req.body.comment,
      author: req.user.id
    })

    try {

      await newComment.populate({
        path: 'author',
        select: ['username', '_id']
      })

      const authorUser = await User.findById(newComment.author._id)
      authorUser.comments = authorUser.comments.concat(newComment._id)

      await newComment.save()
      await authorUser.save()
      res.status(200).json(newComment)
    } catch (err) {
      return next(err)
    }
  },

  createReply: async (req, res, next) => {
    try {
      if (!req.user) return next(createError(401, 'You must be logged to create a comment!'))

      const authorOfThisReply = await User.findById(req.user.id)
      if (!authorOfThisReply) return next(createError(403, 'Something Went Wrong! (user not found)'))

      const repliedComment = await Comment.findById(req.params.id)
      if (!repliedComment) return next(createError(403, 'Something went wrong (replied comment not found)'))

      const newComment = new Comment({
        comment: req.body.comment,
        author: req.user.id,
        replyingTo: repliedComment._id,
      })

      authorOfThisReply.comments = authorOfThisReply.comments.concat(newComment._id)
      repliedComment.replies = repliedComment.replies.concat(newComment._id)

      await newComment.save()
      await authorOfThisReply.save()
      await repliedComment.save()

      res.status(201).json(newComment)
    } catch (err) {
      return next(err)
    }
  },

  update: async (req, res) => {
    try {
      console.log(req.params.id)
      const updatedComment = await Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      res.status(200).json(updatedComment)
    } catch (err) {
      next(err)
    }
  },

  delete: async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.id)
      const user = await User.findById(comment.author._id)
      if (comment.replyingTo) {
        const repliedComment = await Comment.findById(comment.replyingTo)
        await repliedComment.replies.pull(comment._id)
        await repliedComment.save()
      }

      await user.comments.pull(comment._id)
      await user.save()
      await comment.delete()


      res.status(200).json('Hotel has been deleted!!')
    } catch (err) {
      return next(err)
    }
  },

  like: async (req, res, next) => {
    try {
      if (!req.user) return next(createError(400 ,'You must be logged in to like!'))
      
      const comment = await Comment.findById(req.params.id)
      if (!comment) return next(createError(404, 'Comment not found'))

      if (comment.usersWhoLiked.includes(req.user.id)) return next(createError(400, 'you already liked this comment'))
      
      comment.usersWhoLiked = comment.usersWhoLiked.concat(req.user.id)
      await comment.updateOne({$set : {score: comment.score + 1}}, {new: true})

      await comment.save()

      res.status(200).json(comment)
    } catch(err) {
      return next(err)
    }
  },
  delLike: async (req, res, next) => {
    try {
      if (!req.user) return next(createError(400, 'You must be logged in!'))

      const comment = await Comment.findById(req.params.id)
      if (!comment) return next(createError(400, 'Comment not found'))

      await comment.usersWhoLiked.pull(req.user.id)

      await comment.updateOne({$set : {score: comment.score - 1}}, {new: true})

      await comment.save()

      res.status(200).json(comment)
    } catch(err) {
      return next(err)
    }
  },

  disLike: async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.id)
      if (!comment) return next(createError(404, 'Comment not found'))

      if (comment.usersWhoDisliked.includes(req.user.id)) return next(createError(400, 'you already disliked this comment'))
      
      comment.usersWhoDisliked = comment.usersWhoDisliked.concat(req.user.id)
      await comment.updateOne({$set : {score: comment.score - 1}}, {new: true})
      await comment.save()

      res.status(200).json(comment)
    } catch(err) {
      return next(err)
    }
  },

  delDisLike: async (req, res, next) => {
    try {
      if (!req.user) return next(createError(400, 'You must be logged in!'))

      const comment = await Comment.findById(req.params.id)
      if (!comment) return next(createError(400, 'Comment not found'))

      await comment.usersWhoDisliked.pull(req.user.id)

      await comment.updateOne({ $set : {score: comment.score + 1}}, {new: true})

      await comment.save()

      res.status(200).json(comment)
    } catch(err) {
      return next(err)
    }
  }
}