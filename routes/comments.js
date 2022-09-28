import express from "express";
import { CommentsController } from "../controllers/comments_controller.js"
import { verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router()

router.put('/comments/:id/like',verifyToken, CommentsController.like)

router.post('/comments/:id/dislike', verifyToken, CommentsController.disLike)

router.post('/comments', verifyToken, CommentsController.create)

router.put('/comments/:id', verifyToken ,verifyUser, CommentsController.update)

router.get('/comments/:id', CommentsController.getOne)

router.post('/comments/:id', verifyToken, CommentsController.createReply)

router.delete('/comments/:id', verifyToken ,verifyUser , CommentsController.delete)

router.get('/comments', CommentsController.getAll)


router.delete('/comments/:id/dislike', verifyToken, CommentsController.delDisLike)

router.delete('/comments/:id/like', verifyToken, CommentsController.delLike)



export default router