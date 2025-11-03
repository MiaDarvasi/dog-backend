import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { addStay, getStays, getStayById } from './stay.controller.js'


const router = express.Router()


router.get('/', log, getStays) // optional query ?dogId=
router.get('/:id', log, getStayById)
router.post('/', log, addStay)


export const stayRoutes = router