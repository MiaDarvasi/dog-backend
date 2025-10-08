import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const dogService = {
	remove,
	query,
	getById,
	add,
	update,
	addDogMsg,
	removeDogMsg,
}

async function query(filterBy = { name: '' }) {
	try {
        const criteria = _buildCriteria(filterBy)
        const sort = _buildSort(filterBy)

		const collection = await dbService.getCollection('dog')
		var dogCursor = await collection.find(criteria, { sort })

		if (filterBy.pageIdx !== undefined) {
			dogCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
		}

		const dogs = dogCursor.toArray()
		return dogs
	} catch (err) {
		logger.error('cannot find dogs', err)
		throw err
	}
}

async function getById(dogId) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(dogId) }

		const collection = await dbService.getCollection('dog')
		const dog = await collection.findOne(criteria)
        
		dog.createdAt = dog._id.getTimestamp()
		return dog
	} catch (err) {
		logger.error(`while finding dog ${dogId}`, err)
		throw err
	}
}

async function remove(dogId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(dogId) }
        const collection = await dbService.getCollection('dog')
        const res = await collection.deleteOne(criteria)
        if (res.deletedCount === 0) throw('Not found')
        return dogId
    } catch (err) {
        logger.error(`cannot remove dog ${dogId}`, err)
        throw err
    }
}

async function add(dog) {
	try {
		const collection = await dbService.getCollection('dog')
		await collection.insertOne(dog)

		return dog
	} catch (err) {
		logger.error('cannot insert dog', err)
		throw err
	}
}

// async function update(dog) {
//     const dogToSave = { vendor: dog.vendor, speed: dog.speed }

//     try {
//         const criteria = { _id: ObjectId.createFromHexString(dog._id) }

// 		const collection = await dbService.getCollection('dog')
// 		await collection.updateOne(criteria, { $set: dogToSave })

// 		return dog
// 	} catch (err) {
// 		logger.error(`cannot update dog ${dog._id}`, err)
// 		throw err
// 	}
// }

async function update(dog) {
    try {
        const dogToSave = {
            name: dog.name,
            gender: dog.gender,
            breed: dog.breed,
            age: +dog.age, 
            castrated: dog.castrated,
            ownerName: dog.ownerName,
            ownerPhone: dog.ownerPhone,
        }

        const criteria = { _id: new ObjectId(dog._id) }

        const collection = await dbService.getCollection('dog')
        await collection.updateOne(criteria, { $set: dogToSave })

        return { ...dog, ...dogToSave }
    } catch (err) {
        logger.error(`cannot update dog ${dog._id}`, err)
        throw err
    }
}


async function addDogMsg(dogId, msg) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(dogId) }
        msg.id = makeId()
        
		const collection = await dbService.getCollection('dog')
		await collection.updateOne(criteria, { $push: { msgs: msg } })

		return msg
	} catch (err) {
		logger.error(`cannot add dog msg ${dogId}`, err)
		throw err
	}
}

async function removeDogMsg(dogId, msgId) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(dogId) }

		const collection = await dbService.getCollection('dog')
		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId }}})
        
		return msgId
	} catch (err) {
		logger.error(`cannot add dog msg ${dogId}`, err)
		throw err
	}
}

// function _buildCriteria(filterBy) {
//     const criteria = {
//         vendor: { $regex: filterBy.txt, $options: 'i' },
//         speed: { $gte: filterBy.minSpeed },
//     }

//     return criteria
// }

// function _buildCriteria(filterBy = {}) {
//     const criteria = {}
//     if (filterBy.name) {
//         criteria.name = { $regex: filterBy.name, $options: 'i' }
//     }
//     if (filterBy.age) {
//         criteria.age = +filterBy.age
//     }
//     return criteria
// }

// function _buildCriteria(filterBy = {}) {
//     const criteria = {}

//     if (filterBy.name) {
//         criteria.name = { $regex: filterBy.name, $options: 'i' }
//     }

//     return criteria
// }


function _buildCriteria(filterBy = {}) {
    const criteria = {}

    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }

    if (filterBy.breed) {
        criteria.breed = { $regex: filterBy.breed, $options: 'i' }
    }

    return criteria
}




function _buildSort(filterBy) {
    if(!filterBy.sortField) return {}
    return { [filterBy.sortField]: filterBy.sortDir }
}