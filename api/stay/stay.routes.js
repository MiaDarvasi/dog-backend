import express from 'express'
import { log } from '../../middlewares/logger.middleware.js'
import { addStay, getStays, getStayById, removeStay, exportStays,  } from './stay.controller.js'


const router = express.Router()


router.get('/export', exportStays)

router.get('/', log, getStays) // optional query ?dogId=
router.get('/:id', log, getStayById)
router.post('/', log, addStay)
router.delete('/:id', log, removeStay)


export const stayRoutes = router