import { logger } from '../../services/logger.service.js'
import { stayService } from './stay.service.js'


export async function getStays(req, res) {
    try {
        const filterBy = {
            dogId: req.query.dogId || ''
        }
        const stays = await stayService.query(filterBy)
        res.json(stays)
    } catch (err) {
        logger.error('Failed to get stays', err)
        res.status(400).send({ err: 'Failed to get stays' })
    }
}


export async function getStayById(req, res) {
    try {
        const stayId = req.params.id
        const stay = await stayService.getById(stayId)
        res.json(stay)
    } catch (err) {
        logger.error('Failed to get stay', err)
        res.status(400).send({ err: 'Failed to get stay' })
    }
}



export async function addStay(req, res) {
    try {
        const stayData = req.body
        console.log('📥 Received stayData:', stayData)
        const added = await stayService.add(stayData)
        console.log('✅ Added stay:', added)
        res.status(200).json(added)
    } catch (err) {
        console.error('❌ Failed to add stay:', err)
        res.status(500).send({ err: 'Failed to add stay', details: err.message })
    }
}

export async function removeStay(req, res) {
    try {
        const stayId = req.params.id
        await stayService.remove(stayId)
        res.json({ msg: 'Stay removed', stayId })
    } catch (err) {
        logger.error('Failed to remove stay', err)
        res.status(400).send({ err: 'Failed to remove stay' })
    }
}
