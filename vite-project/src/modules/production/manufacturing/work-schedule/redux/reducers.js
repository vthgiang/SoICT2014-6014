import { formatYearMonth } from '../../../../../helpers/formatDate'
import { workScheduleConstants } from '../redux/constants'

const initialState = {
  isLoading: false,
  listWorkSchedules: [],
  listWorkSchedulesWorker: [],
  totalDocs: 0,
  limit: 0,
  totalPages: 0,
  page: 0,
  pagingCounter: 0,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: 0,
  nextPage: 0,
  currentMonth: ''
}

export const workSchedule = (state = initialState, action) => {
  switch (action.type) {
    case workScheduleConstants.GET_ALL_WORK_SCHEDULE_REQUEST:
    case workScheduleConstants.CREATE_WORK_SCHEDULE_REQUEST:
    case workScheduleConstants.GET_ALL_WORK_SCHEDULE_WORKER_REQUEST:
    case workScheduleConstants.GET_ALL_WORK_SCHEDULE_BY_MILL_ID_REQUEST:
    case workScheduleConstants.GEt_ALL_WORK_SCHEDULE_OF_MANUFACTURING_WORK_REQUEST:
    case workScheduleConstants.GET_ALL_WORKER_BY_ARRAY_WORK_SCHEDULES_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case workScheduleConstants.GET_ALL_WORK_SCHEDULE_FAILURE:
    case workScheduleConstants.CREATE_WORK_SCHEDULE_FAILURE:
    case workScheduleConstants.GET_ALL_WORK_SCHEDULE_WORKER_FAILURE:
    case workScheduleConstants.GET_ALL_WORK_SCHEDULE_BY_MILL_ID_FAILURE:
    case workScheduleConstants.GEt_ALL_WORK_SCHEDULE_OF_MANUFACTURING_WORK_FAILURE:
    case workScheduleConstants.GET_ALL_WORKER_BY_ARRAY_WORK_SCHEDULES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case workScheduleConstants.GET_ALL_WORK_SCHEDULE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listWorkSchedules: action.payload.workSchedules.docs,
        totalDocs: action.payload.workSchedules.totalDocs,
        limit: action.payload.workSchedules.limit,
        totalPages: action.payload.workSchedules.totalPages,
        page: action.payload.workSchedules.page,
        pagingCounter: action.payload.workSchedules.pagingCounter,
        hasPrevPage: action.payload.workSchedules.hasPrevPage,
        hasNextPage: action.payload.workSchedules.hasNextPage,
        prevPage: action.payload.workSchedules.prevPage,
        nextPage: action.payload.workSchedules.nextPage
      }
    case workScheduleConstants.CREATE_WORK_SCHEDULE_SUCCESS:
      let month = action.payload.workSchedules[0].month
      if (formatYearMonth(month) === state.currentMonth) {
        if (action.payload.workSchedules[0].manufacturingMill) {
          action.payload.workSchedules.map((schedule) => {
            state.listWorkSchedules.push(schedule)
          })
        } else {
          action.payload.workSchedules.map((schedule) => {
            state.listWorkSchedulesWorker.push(schedule)
          })
        }
      }
      return {
        ...state,
        isLoading: false,
        listWorkSchedules: [...state.listWorkSchedules],
        listWorkSchedulesWorker: [...state.listWorkSchedulesWorker]
      }
    case workScheduleConstants.SET_CURRENT_MONTH:
      return {
        ...state,
        currentMonth: action.payload
      }
    case workScheduleConstants.GET_ALL_WORK_SCHEDULE_WORKER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listWorkSchedulesWorker: action.payload.workSchedules.docs,
        totalDocs: action.payload.workSchedules.totalDocs,
        limit: action.payload.workSchedules.limit,
        totalPages: action.payload.workSchedules.totalPages,
        page: action.payload.workSchedules.page,
        pagingCounter: action.payload.workSchedules.pagingCounter,
        hasPrevPage: action.payload.workSchedules.hasPrevPage,
        hasNextPage: action.payload.workSchedules.hasNextPage,
        prevPage: action.payload.workSchedules.prevPage,
        nextPage: action.payload.workSchedules.nextPage
      }
    case workScheduleConstants.GET_ALL_WORK_SCHEDULE_BY_MILL_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listWorkSchedulesOfMill: action.payload.workSchedules
      }
    case workScheduleConstants.GEt_ALL_WORK_SCHEDULE_OF_MANUFACTURING_WORK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listWorkSchedulesOfWorks: action.payload.workSchedules
      }
    case workScheduleConstants.GET_ALL_WORKER_BY_ARRAY_WORK_SCHEDULES_SUCCEESS:
      return {
        ...state,
        isLoading: false,
        listWorkers: action.payload.workers
      }
    default:
      return state
  }
}
