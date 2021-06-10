import {
  verifyResponse,
  calculatePerformance,
  getPerformanceByQuarter,
  getResponsesByDateRange,
  computeAveragePerformance,
  selectResponseByMonth,
  dateUtil
} from './responses.service'
import {
  performanceResponses,
  mockPerformanceResponses,
  mockMonthlyResponseTemplate,
  mockFailedPerformanceResponses
} from './responses.mock'

const mockQuestion = {
  id: 1,
  questionText: 'This is a test question',
  answerOptions: [
    {
      answerText: 'A',
      isCorrect: true
    },
    {
      answerText: 'B',
      isCorrect: false
    }
  ],
  difficulty: 1
}

describe('Responses Module', () => {
  describe('verifyResponse', () => {
    test('should return true when supplied with correct answer option', () => {
      expect(verifyResponse(mockQuestion, 'A')).toBe(true)
    })

    test('should return false when supplied with incorrect answer option', () => {
      expect(verifyResponse(mockQuestion, 'B')).toBe(false)
    })

    test('should throw an error when answer is not a valid option', () => {
      expect(() => verifyResponse(mockQuestion, 'C')).toThrowError()
    })

    test('should throw an error when answer is not present', () => {
      expect(() => verifyResponse(mockQuestion, '')).toThrowError()
    })
  })

  describe('calculatePerformance', () => {
    test('should return an average performance', () => {
      expect(calculatePerformance(performanceResponses).performanceRating).toEqual(40.33)
    })

    test('should return average performance for Q4', () => {
      expect(calculatePerformance(performanceResponses).overallAveragePerformanceQ4).toEqual(9.09)
    })

    test('should return aggregate performance by month', () => {
      expect(
        calculatePerformance(mockPerformanceResponses, mockMonthlyResponseTemplate)
          .aggregatedPerformanceByMonth[1].performance
      ).toEqual(100)
    })
  })

  describe('getPerformanceByQuarter', () => {
    test('should return average total performance for Q1 - Q3', () => {
      expect(getPerformanceByQuarter(performanceResponses, '01', '09')).toEqual(49.47)
    })
  })

  describe('getResponsesByDateRange', () => {
    test('should return user responses for a Date', () => {
      expect(getResponsesByDateRange(mockPerformanceResponses, '12')).toEqual([
        mockPerformanceResponses[1]
      ])
    })

    test('should return user responses for a Date Range', () => {
      expect(getResponsesByDateRange(mockPerformanceResponses, '11', '12')).toEqual(
        mockPerformanceResponses
      )
    })
  })

  describe('computeAveragePerformance', () => {
    test('should return average performance', () => {
      expect(computeAveragePerformance(performanceResponses)).toEqual(40.33)
    })

    test('should return average performance number between 0 and 100', () => {
      expect(computeAveragePerformance(mockFailedPerformanceResponses)).toBeGreaterThanOrEqual(0)
    })
  })

  describe('selectResponseByMonth', () => {
    test('should return the selected month response', () => {
      expect(selectResponseByMonth(mockMonthlyResponseTemplate, '12')).toEqual(
        mockMonthlyResponseTemplate[1]
      )
    })

    test('should return undefined when selected month is not a valid option', () => {
      expect(selectResponseByMonth(mockMonthlyResponseTemplate, '13')).toBeUndefined()
    })
  })

  describe('dateUtil', () => {
    test('should convert UNIX date to ISO', () => {
      expect(dateUtil().toIsoDate(1598842119)).toEqual(new Date('2020-08-31T02:48:39.000Z'))
    })

    test('should return month number in string', () => {
      expect(dateUtil().getMonth(new Date(1598842119))).toEqual('01')
    })
  })
})
