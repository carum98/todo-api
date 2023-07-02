import express from 'express'
import { User } from '../controllers/index.js'

const router = express.Router()

router.get('/', User.get)
router.post('/', User.create)

router.get('/:id', User.getById)
router.put('/:id', User.update)
router.delete('/:id', User.remove)

export default router