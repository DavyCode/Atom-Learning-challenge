import { Answer, Question } from '../questions/questions.types'
import { UserResponse, UserPerformance, MonthlyResponse } from './responses.types'
import _ from 'lodash'

const verifyResponse = (question: Question, userAnswer: string): boolean => {
  const answerOptions: Answer[] = question.answerOptions

  if (!userAnswer) {
    throw new Error('Provide an answer!')
  }

  const answer: Answer = answerOptions.find((ans) => ans.answerText === userAnswer)

  if (!answer) {
    throw new Error("Oops! that's not a valid option")
  }

  return answer.isCorrect
}

const calculatePerformance = (
  responses: UserResponse[],
  template?: MonthlyResponse[]
): UserPerformance => {
  const responseTemplate: MonthlyResponse[] = template ? template : monthlyResponseTemplate
  return {
    performanceRating: computeAveragePerformance(responses),
    overallAveragePerformanceQ4: getPerformanceByQuarter(responses, '10'),
    aggregatedPerformanceByMonth: getPerformanceByMonth(responses, responseTemplate)
  }
}

const computeAveragePerformance = (responses: UserResponse[]): number => {
  let performanceScore: number = 0
  let difficulty: number = 0

  for (let i = 0; i < responses.length; i++) {
    const response = responses[i]
    const isCorrect = verifyResponse(response.question, response.userAnswer)

    difficulty += response.question.difficulty

    if (isCorrect) {
      performanceScore += 1 * response.question.difficulty
    }

    if (!isCorrect) {
      performanceScore -= 5 - response.question.difficulty
    }
  }

  const score = parseFloat(((performanceScore * 100) / difficulty).toFixed(2))

  return score >= 0 ? score : 0
}

const getPerformanceByMonth = (
  responses: UserResponse[],
  responseTemplate: MonthlyResponse[]
): MonthlyResponse[] => {
  const monthlyResponses: MonthlyResponse[] = sortResponsesByMonth(responses, responseTemplate)

  for (let i = 0; i < monthlyResponses.length; i++) {
    const responses: UserResponse[] = monthlyResponses[i].responses

    const performance: number = computeAveragePerformance(responses)
    monthlyResponses[i].performance = performance
  }

  return monthlyResponses
}

const sortResponsesByMonth = (
  responses: UserResponse[],
  monthlyResponseTemplate: MonthlyResponse[]
): MonthlyResponse[] => {
  let monthlyResponseBreakdown: MonthlyResponse[] = monthlyResponseTemplate

  for (let i = 0; i < responses.length; i++) {
    const response = responses[i]
    const month: string = dateUtil().getMonth(dateUtil().toIsoDate(response.dateUnix))

    let currentMonthResponse: MonthlyResponse | undefined = selectResponseByMonth(
      monthlyResponseBreakdown,
      month
    )

    if (currentMonthResponse) {
      currentMonthResponse.responses.push(response)
      monthlyResponseBreakdown = _.unionBy([currentMonthResponse], monthlyResponseBreakdown, 'name')
    }
  }

  return monthlyResponseBreakdown
}

const selectResponseByMonth = (
  monthlyResponseBreakdown: MonthlyResponse[],
  month: string
): MonthlyResponse | undefined =>
  monthlyResponseBreakdown.find((monthResponse) => monthResponse.month === month)

const getPerformanceByQuarter = (
  responses: UserResponse[],
  startMonthRange: string,
  endMonthRange?: string
): number => {
  const responsesRange: UserResponse[] = getResponsesByDateRange(
    responses,
    startMonthRange,
    endMonthRange
  )

  return computeAveragePerformance(responsesRange)
}

const getResponsesByDateRange = (
  responses: UserResponse[],
  startMonthRange: string,
  endMonthRange?: string
): UserResponse[] => {
  return responses.filter((response) => {
    const responseMth = parseInt(dateUtil().getMonth(dateUtil().toIsoDate(response.dateUnix)), 10)
    const startMth = parseInt(startMonthRange, 10)

    if (endMonthRange) {
      return responseMth >= startMth && responseMth <= parseInt(endMonthRange, 10)
    }
    return responseMth >= startMth
  })
}

const dateUtil = () => {
  return {
    toIsoDate: (dateUnix: number = 1): Date => new Date(dateUnix * 1000),
    getMonth: (date: Date): string => new Date(date).toISOString().slice(5, 7)
  }
}

const monthlyResponseTemplate: MonthlyResponse[] = [
  {
    month: '01',
    name: 'January',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '02',
    name: 'February',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '03',
    name: 'March',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '04',
    name: 'April',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '05',
    name: 'May',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '06',
    name: 'June',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '07',
    name: 'July',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '08',
    name: 'August',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '09',
    name: 'September',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '10',
    name: 'October',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '11',
    name: 'November',
    responses: [] as UserResponse[],
    performance: 0
  },
  {
    month: '12',
    name: 'December',
    responses: [] as UserResponse[],
    performance: 0
  }
]

export {
  verifyResponse,
  calculatePerformance,
  getPerformanceByQuarter,
  getResponsesByDateRange,
  computeAveragePerformance,
  selectResponseByMonth,
  dateUtil
}
