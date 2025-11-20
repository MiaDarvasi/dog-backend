import { logger } from '../../services/logger.service.js'
import { stayService } from '../stay/stay.service.js'
import { dogService } from './dog.service.js'


export async function getDogs(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
        }
        const dogs = await dogService.query(filterBy)
        res.json(dogs)
    } catch (err) {
        logger.error('Failed to get dogs', err)
        res.status(400).send({ err: 'Failed to get dogs' })
    }
}


export async function getDogById(req, res) {
	try {
		const dogId = req.params.id
		const dog = await dogService.getById(dogId)
		res.json(dog)
	} catch (err) {
		logger.error('Failed to get dog', err)
		res.status(400).send({ err: 'Failed to get dog' })
	}
}

export async function addDog(req, res) {
	const { body: dog } = req

	try {
		const addedDog = await dogService.add(dog)
		res.json(addedDog)
	} catch (err) {
		logger.error('Failed to add dog', err)
		res.status(400).send({ err: 'Failed to add dog' })
	}
}


export async function updateDog(req, res) {
    try {
        const dog = req.body
        const updatedDog = await dogService.update(dog)
        res.json(updatedDog)
    } catch (err) {
        logger.error('Failed to update dog', err)
        res.status(400).send({ err: 'Failed to update dog' })
    }
}


export async function removeDog(req, res) {
	try {
		const dogId = req.params.id

		await stayService.removeByDogId(dogId)
		const removedId = await dogService.remove(dogId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove dog', err)
		res.status(400).send({ err: 'Failed to remove dog' })
	}
}

export async function addDogMsg(req, res) {
	const { loggedinUser } = req

	try {
		const dogId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		const savedMsg = await dogService.addDogMsg(dogId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to update dog', err)
		res.status(400).send({ err: 'Failed to update dog' })
	}
}

export async function removeDogMsg(req, res) {
	try {
		const dogId = req.params.id
		const { msgId } = req.params

		const removedId = await dogService.removeDogMsg(dogId, msgId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove dog msg', err)
		res.status(400).send({ err: 'Failed to remove dog msg' })
	}
}
