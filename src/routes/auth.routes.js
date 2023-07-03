import express from 'express'
import { Auth } from '../controllers/index.js'

const router = express.Router()

router.post('/login', Auth.login)
router.post('/register', Auth.register)
router.post('/refresh-token', Auth.refreshToken)

export default router