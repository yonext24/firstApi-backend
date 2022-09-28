import mongoose from 'mongoose'
const { Schema } = mongoose

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  comments: [{type: Schema.Types.ObjectId, ref: 'Coment'}]
}, {timestamps: true}
)

export default mongoose.model('User', UserSchema)