import express, { Router, Request, Response, NextFunction } from 'express'
import { getOne, getMany, getRandom } from './questions.service'

const routes: Router = express.Router()

routes.get('/find', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.query.id as string)
    if (!id) {
      throw new Error('Provide a valid question id as query')
    }
    res.json(getOne(id))
  } catch (e) {
    res.status(400).json(e.message)
  }
})

routes.get('/random', (req: Request, res: Response, next: NextFunction) => {
  res.json(getRandom())
})

routes.get('/all', (req: Request, res: Response, next: NextFunction) => {
  res.json(getMany())
})

export default routes
