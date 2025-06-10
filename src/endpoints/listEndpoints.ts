import { type Response, type Request, Router } from 'express'
import { addJsonOption, getJsonOptions } from '../utils/jsonUtils'
import path from 'path'
import fs from 'fs/promises'

const listsRouter = Router()

const dataDir = path.resolve(process.cwd(), 'data')
const validJsonFiles = ['category.json', 'type.json', 'area.json']

// // Endpoint to get a list
// listsRouter.get('/:listName', async (req: Request, res: Response) => {
//   const { listName } = req.params
//   if (!validJsonFiles.includes(listName)) {
//     return res.status(404).send({ error: 'List not found' })
//   }

//   try {
//     const options = await getJsonOptions(listName)
//     res.json(options)
//   } catch (error) {
//     res.status(500).send({ error: `Failed to load ${listName}` })
//   }
// })

// // Endpoint to add to a list
// listsRouter.post('/:listName', async (req: Request, res: Response) => {
//   const { listName } = req.params
//   if (!validJsonFiles.includes(listName)) {
//     return res.status(404).send({ error: 'List not found' })
//   }

//   const { label, value } = req.body

//   if (!label || !value) {
//     return res.status(400).send({ error: 'Label and value are required' })
//   }

//   try {
//     await addJsonOption(listName, { label, value })
//     // After adding, get the updated list to send back or just send success
//     const updatedOptions = await getJsonOptions(listName)
//     res.status(201).json(updatedOptions)
//   } catch (error) {
//     console.error(`Error in POST /api/lists/${listName}:`, error)
//     res.status(500).send({ error: `Failed to update ${listName}` })
//   }
// })

export default listsRouter
