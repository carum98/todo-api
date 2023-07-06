import express from 'express'
import { List } from '../controllers/index.js'

const router = express.Router()

router.get('/', List.get)
router.post('/', List.create)

router.get('/:id', List.getById)
router.put('/:id', List.update)
router.delete('/:id', List.remove)

export default router