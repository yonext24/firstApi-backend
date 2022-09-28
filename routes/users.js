import express from "express";
import { UsersController } from "../controllers/users_controller.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router()

router.get('/disliked', verifyToken, UsersController.disLiked)

router.put('/:id', verifyToken ,verifyUser , UsersController.update)

router.get('/:id', verifyToken ,verifyUser , UsersController.getOne)

router.delete('/:id', verifyToken ,verifyUser, UsersController.delete)

router.get('/', verifyToken ,verifyAdmin, UsersController.getAll)

export default router