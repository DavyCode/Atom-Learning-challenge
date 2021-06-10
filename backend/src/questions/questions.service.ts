import { Question, Answer } from './questions.types'
import { getQuestions } from './questions.store'

const removeItemProperty = (answerOptions: Answer[]): Answer[] => {
  return answerOptions.map((ans): Answer => {
    delete ans.isCorrect
    return ans
  })
}

const getQuestionsWithoutIsCorrectValue = (): Question[] => {
  return getQuestions().map(
    (qus): Question => ({ ...qus, answerOptions: removeItemProperty(qus.answerOptions) })
  )
}

const getOne = (id: number): Question => {
  const question: Question = getQuestionsWithoutIsCorrectValue().find((qus) => qus.id === id)

  if (!question) {
    throw new Error('Question not found')
  }

  return question
}

const getRandom = (): Question => {
  return getQuestionsWithoutIsCorrectValue()[Math.floor(Math.random() * getQuestions().length)]
}

const getMany = (): Question[] => {
  return getQuestionsWithoutIsCorrectValue()
}

const getOneWithIsCorrectValue = (id: number): Question => {
  const question: Question = getQuestions().find((qus) => qus.id === id)

  if (!question) {
    throw new Error('Question not found')
  }

  return question
}

export { getOne, getRandom, getMany, getOneWithIsCorrectValue }
