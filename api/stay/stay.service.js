import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db.service.js'
import { dogService } from '../dog/dog.service.js'

export const stayService = {
    add,
    query,
    getById,
    remove,
    removeByDogId,
    queryForExport,
}


async function add(stay) {
    const collection = await dbService.getCollection('stay')

    const dog = await dogService.getById(stay.dogId)
    if (!dog) throw new Error('Dog not found')

    const startDate = new Date(stay.startDate)
    const endDate = new Date(stay.endDate)
    const msPerDay = 1000 * 60 * 60 * 24
    const days = Math.max(1, Math.ceil((endDate - startDate) / msPerDay) + 1)
    const price = days * Number(dog.pricePerDay || 0)

    const stayToAdd = {
        _id: new ObjectId(),
        dogId: new ObjectId(stay.dogId),
        startDate,
        endDate,
        days,
        price
    }

    console.log('Inserting stay:', stayToAdd)

    const result = await collection.insertOne(stayToAdd)
    console.log('Insert result:', result)

    return stayToAdd
}


async function query(filterBy = {}) {
    const collection = await dbService.getCollection('stay')
    const stays = await collection.find({}).toArray()
    return stays
}

async function getById(stayId) {
    const collection = await dbService.getCollection('stay')
    const stay = await collection.findOne({ _id: new ObjectId(stayId) })
    return stay
}

async function remove(stayId) {
    const collection = await dbService.getCollection('stay')
    await collection.deleteOne({ _id: new ObjectId(stayId) })
}


async function removeByDogId(dogId) {
    const collection = await dbService.getCollection('stay')

    // dogId in stays is stored as ObjectId, so convert:
    const criteria = { dogId: new ObjectId(dogId) }
    const res = await collection.deleteMany(criteria)

    console.log(`Removed ${res.deletedCount} stays for dog ${dogId}`)
    return res.deletedCount
}


async function queryForExport({ from, to } = {}) {
    const collection = await dbService.getCollection('stay') // adjust collection name if different
  
    const criteria = {}
    // Simple overlap logic: stays that intersect the window
    // If you only want stays starting in range, simplify criteria accordingly.
    if (from || to) {
      criteria.$and = []
      if (to) criteria.$and.push({ startDate: { $lte: to } })
      if (from) criteria.$and.push({ endDate: { $gte: from } })
      if (!criteria.$and.length) delete criteria.$and
    }
  
    return collection
      .find(criteria)
      .project({ dogId: 1, startDate: 1, endDate: 1, price: 1 }) // keep it lean
      .sort({ startDate: 1 })
      .toArray()
  }
