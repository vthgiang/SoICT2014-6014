import { TaskPertConstants } from './constants';
const initState = {
    lists: [],
    listRiskById: null,
    isLoading: false,
    totalList: 0,
    parents: [],
    pertData :[],
    countModel:[],
    taskRiskData: [],
    processListData:[],
    closeProcess:false,
    diagramData:[],
    changeTime:[]
}
export function taskPert(state = initState, action) {

    switch (action.type) {
        case TaskPertConstants.COUNT_TASK_REQUEST:
        case TaskPertConstants.UPDATE_TASK_REQUEST:
        case TaskPertConstants.UPDATE_PROCESS_LIST_REQUEST:
        case TaskPertConstants.CLOSE_PROCESS_REQUEST:
        case TaskPertConstants.CHANGE_TIME_REQUEST:
            return {
                ...state,
                loading: true,
                isLoading: true
            };
        case TaskPertConstants.COUNT_TASK_FAILURE:
        case TaskPertConstants.UPDATE_TASK_FAILURE:
        case TaskPertConstants.UPDATE_PROCESS_LIST_FAILURE:
        case TaskPertConstants.CLOSE_PROCESS_FAILURE:
        case TaskPertConstants.CHANGE_TIME_FAILURE:
            return {
                isLoading: false,
                error: action.error
            };
        case TaskPertConstants.CHANGE_TIME_SUCCESS:
            return {
                ...state,
                changeTime:action.payload,
                isLoading:false
            }
        case TaskPertConstants.CLOSE_PROCESS_SUCCESS:
            return {
                ...state,
                closeProcess:!state.closeProcess
            }
        case TaskPertConstants.UPDATE_TASK_SUCCESS:
            return {
                ...state,
                pertData: action.payload.pertData,
                countModel: action.payload.countModel,
                taskRiskData : action.payload.taskRiskData,
                isLoading: false,
            }
        case TaskPertConstants.UPDATE_PROCESS_LIST_SUCCESS:
            return {
                ...state,
                processListData: action.payload.processListData,
                diagramData:action.payload.processListData.map(process => process.diagramData),
                isLoading: false,
            }
        case TaskPertConstants.COUNT_TASK_SUCCESS:
            return {
                ...state,
                pertData: action.payload.pertData,
                countModel: action.payload.countModel,
                taskRiskData : action.payload.taskRiskData,
                isLoading: false,
            };
        default:
            return state;
    }
}