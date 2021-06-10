import { Question } from '../questions/questions.types'

export type UserResponse = {
  question: Question
  userAnswer: string
  dateUnix: number
}

export type UserPerformance = {
  performanceRating: number
  overallAveragePerformanceQ4: number
  aggregatedPerformanceByMonth: Array<MonthlyResponse>
}

export type MonthlyResponse = {
  month: string
  name: string
  responses?: Array<UserResponse>
  performance: number
}
