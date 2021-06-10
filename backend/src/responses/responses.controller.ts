import express, { Router, Request, Response, NextFunction } from 'express'
import { verifyResponse } from './responses.service'
import { getOneWithIsCorrectValue } from '../questions/questions.service'

const routes: Router = express.Router()

routes.post('/verify', (req: Request, res: Response, next: NextFunction) => {
  try {
    const userAnswer: string = req.body.userAnswer
    const questionId = parseInt(req.body.questionId as string)

    if (!questionId) {
      throw new Error('Provide a valid question id')
    }

    res.json({
      isCorrect: verifyResponse(getOneWithIsCorrectValue(questionId), userAnswer)
    })
  } catch (e) {
    res.status(400).json(e.message)
  }
})

export default routes
