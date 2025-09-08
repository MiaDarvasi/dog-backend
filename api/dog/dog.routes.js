import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getDogs, getDogById, addDog, updateDog, removeDog, addDogMsg, removeDogMsg } from './dog.controller.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getDogs)
router.get('/:id', log, getDogById)
router.post('/', log, addDog)
router.put('/:id', updateDog)
router.delete('/:id', removeDog)
// router.delete('/:id', requireAuth, requireAdmin, removeDog)

router.post('/:id/msg', requireAuth, addDogMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeDogMsg)

export const dogRoutes = router