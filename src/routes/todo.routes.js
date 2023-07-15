import express from 'express'
import { Todo } from '../controllers/index.js'

const router = express.Router()

router.get('/', Todo.get)
router.post('/', Todo.create)

router.get('/:id', Todo.getById)
router.put('/:id', Todo.update)
router.delete('/:id', Todo.remove)

router.post('/:id/complete', Todo.complete)
router.post('/:id/toggle', Todo.toggle)
router.post('/:id/move', Todo.move)

export default router