import TaskProjectConstant from './constant';

const initState = {
    list: [],
    paginate: [],
    isLoading: false,
    item: {}
}

const TaskProjectReducer = (state = initState, action) => {
    switch(action.type){
        case TaskProjectConstant.GET_TASK_PROJECT_REQUEST:
        case TaskProjectConstant.SHOW_TASK_PROJECT_REQUEST:
        case TaskProjectConstant.CREATE_TASK_PROJECT_REQUEST:
        case TaskProjectConstant.EDIT_TASK_PROJECT_REQUEST:
        case TaskProjectConstant.SHOW_TASK_PROJECT_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case TaskProjectConstant.GET_TASK_PROJECT_FAILE:
        case TaskProjectConstant.SHOW_TASK_PROJECT_FAILE:
        case TaskProjectConstant.CREATE_TASK_PROJECT_FAILE:
        case TaskProjectConstant.EDIT_TASK_PROJECT_FAILE:
        case TaskProjectConstant.SHOW_TASK_PROJECT_FAILE:
            return {
                ...state,
                isLoading: false
            };

        case TaskProjectConstant.GET_TASK_PROJECT_SUCCESS:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };

        case TaskProjectConstant.SHOW_TASK_PROJECT_SUCCESS:
            return {
                ...state,
                item: action.payload,
                isLoading: false
            };

        case TaskProjectConstant.CREATE_TASK_PROJECT_SUCCESS:
            return {
                ...state,
                list: [...state.list, action.payload],
                isLoading: false
            };

        case TaskProjectConstant.EDIT_TASK_PROJECT_SUCCESS:
            let newList = state.list.map(tp => {
                let node = tp;
                if(node._id === action.payload._id) node = action.payload;
                
                return node;
            })
            return {
                ...state,
                list: newList,
                isLoading: false
            };
        
        case TaskProjectConstant.DELETE_TASK_PROJECT_SUCCESS:
            let listD = state.list.map(tp => tp._id !== action.payload);
            return {
                ...state,
                list: listD,
                isLoading: false
            };

        default: return {...state};
    }
}

export default TaskProjectReducer;