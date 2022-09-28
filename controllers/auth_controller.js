import User from '../models/User.js'
import bcrypt from 'bcrypt'
import { createError } from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken'

export const AuthController = {
  register: async (req, res, next) => {
    try {
      
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hash,
      })

      await newUser.save()

      res.status(201).send('User has been creater correctly')

    } catch(err) {
      next(err)
    }
  },

  login: async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username })
      if (!user) return next(createError(400, 'username or password incorrect'))

      const match = await bcrypt.compare(req.body.password, user.password)
      if (!match) return next(createError(400, 'password incorrect'))

      const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT)

      const { password, isAdmin, ...otherDetails } = user._doc

      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true, 
      }).status(200).json({ details: {...otherDetails}, isAdmin },)
    } catch(err) {
      next(err)
    }
  }
}
