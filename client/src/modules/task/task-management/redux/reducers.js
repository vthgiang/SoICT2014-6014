import { taskManagementConstants } from "./constants";

export function tasks(state = {
    isLoading: false,
    allTimeSheetLogs: [],
    userTimeSheetLogs: [],
    totalCount: 0,
    totalDocs: 0,
    tasks: [],
    pages: 0,
}, action) {
    switch (action.type) {
        case taskManagementConstants.GETALL_TASK_REQUEST:
            return {
                ...state,
                loading: true,
                isLoading: true
            };
        case taskManagementConstants.GETALL_TASK_SUCCESS:
            return {
                ...state,
                items: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GETALL_TASK_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_BYID_REQUEST:
            return {
                ...state,
                task: null,
                loading: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_BYID_SUCCESS:
            return {
                ...state,
                task: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_BYID_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_REQUEST:
            return {
                ...state,
                responsibleTasks: null,
                tasks: null,
                pages: null,
                loadingResponsible: true,
                isLoading: true,
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_SUCCESS:
            return {
                ...state,
                responsibleTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                loadingResponsible: false,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_REQUEST:
            return {
                ...state,
                accountableTasks: null,
                tasks: null,
                pages: null,
                loadingAccountable: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_SUCCESS:
            return {
                ...state,
                accountableTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                loadingAccountable: false,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_REQUEST:
            return {
                ...state,
                consultedTasks: null,
                tasks: null,
                pages: null,
                loadingConsulted: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_SUCCESS:
            return {
                ...state,
                consultedTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                loadingConsulted: false,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CONSULTED_BYUSER_FAILURE:
            return {
                ...state,
                error: action.error,
                loadingConsulted: false
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_REQUEST:
            return {
                ...state,
                informedTasks: null,
                tasks: null,
                pages: null,
                loadingInformed: true,
                isLoading: true
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_SUCCESS:
            return {
                ...state,
                informedTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                loadingInformed: false,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_INFORMED_BYUSER_FAILURE:
            return {
                ...state,
                error: action.error,
                loadingInformed: false,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_REQUEST:
            return {
                ...state,
                creatorTasks: null,
                tasks: null,
                pages: null,
                loadingCreator: true,
                isLoading: true,
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_SUCCESS:
            return {
                ...state,
                creatorTasks: action.payload.tasks,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                loadingCreator: false,
                isLoading: false
            };
        case taskManagementConstants.GETTASK_CREATOR_BYUSER_FAILURE:
            return {
                ...state,
                error: action.error,
                loadingCreator: false,
                isLoading: false
            };
        case taskManagementConstants.GET_TASK_HAS_EVALUATION_REQUEST:
            return {
                ...state,
                evaluatedTask: null,
                isLoading: true,
            };
        case taskManagementConstants.GET_TASK_HAS_EVALUATION_SUCCESS:
            return {
                ...state,
                evaluatedTask: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GET_TASK_HAS_EVALUATION_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_REQUEST:
            return {
                ...state,
                adding: true,
                isLoading: true
            };
        case taskManagementConstants.GET_PAGINATE_TASK_BYUSER_REQUEST:
            if (action.calledId) {
                return {
                    ...state,
                    isLoading: true
                };
            }
            return {
                ...state,
                tasks: null,
                pages: null,
                isLoading: true
            }

        case taskManagementConstants.GET_PAGINATE_TASK_BYUSER_SUCCESS:
            if (action.calledId === 'listSearch') {
                return {
                    ...state,
                    listSearchTasks: action.payload.tasks,
                    isLoading: false
                };
            }
            return {
                ...state,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GET_PAGINATE_TASK_BYUSER_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GET_PAGINATE_TASK_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                isLoading: true,
                loadingPaginateTasks: true,
            }

        case taskManagementConstants.GET_PAGINATE_TASK_SUCCESS:
            return {
                ...state,
                tasks: action.payload.tasks,
                pages: action.payload.totalPage,
                totalCount: action.payload.totalCount,
                isLoading: false,
                loadingPaginateTasks: false,
            };
        case taskManagementConstants.GET_PAGINATE_TASK_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false,
                loadingPaginateTasks: false,
            };
        case taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                tasks: null,
                pages: null,
                isLoading: true
            }
        case taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                tasks: action.payload.tasks,
                totalCount: action.payload.totalCount,
                pages: action.payload.totalPage,
                isLoading: false
            };
        case taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_REQUEST:
            return {
                ...state,
                adding: true,
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_SUCCESS:
            console.log('action.payload', action.payload);
            console.log('kkkkk', [
                action.payload,
                ...state.tasks,
            ]);
            return {
                ...state,
                tasks: [
                    action.payload,
                    ...state.tasks,
                ],
                totalCount: state?.totalCount + 1,
                isLoading: false
            };
        case taskManagementConstants.ADDNEW_TASK_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        // case taskManagementConstants.EDIT_TASK_REQUEST:
        //     return {
        //         ...state,
        //         items: state.items.map(task =>
        //             task._id === action.id
        //                 ? { ...task, editing: true }
        //                 : task
        //         ),
        //         isLoading: false
        //     };
        // case taskManagementConstants.EDIT_TASK_SUCCESS:

        // console.log(action.payload)
        //     return {
        //         ...state,
        //         tasks: state.tasks.map(task =>
        //             task._id === action.payload.info._id
        //                 ? action.payload.info : task
        //         ),
        //         task: action.payload,
        //         isLoading: false
        //     };
        // case taskManagementConstants.EDIT_TASK_FAILURE:
        //     return {
        //         error: action.error,
        //         isLoading: false
        //     };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EDIT_STATUS_OF_TASK_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };

        case taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_SUCCESS:
            return {
                ...state,
                isLoading: false,
                tasks: state.tasks.filter(task => !(action.payload._id.includes(task._id))),
            };

        case taskManagementConstants.EDIT_ARCHIVED_STATUS_OF_TASK_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };

        case taskManagementConstants.DELETE_TASK_REQUEST:
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task._id === action.id || (Array.isArray(action.id) && action.id.includes(task._id))
                        ? { ...task, deleting: true }
                        : task
                ),
                isLoading: false
            };
        case taskManagementConstants.DELETE_TASK_SUCCESS:
            return {
                ...state,
                tasks: state.tasks.filter(task => task._id !== action.id && (!Array.isArray(action.id) || !action.id.includes(task._id))),
                isLoading: false
            };
        case taskManagementConstants.DELETE_TASK_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case taskManagementConstants.GET_SUBTASK_REQUEST:
            return {
                ...state,
                subtasks: null,
                isLoading: true
            };
        case taskManagementConstants.GET_SUBTASK_SUCCESS:
            return {
                ...state,
                subtasks: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GET_SUBTASK_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            }
        case taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EDIT_TASK_BY_ACCOUNTABLE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EDIT_TASK_BY_RESPONSIBLE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EVALUATE_TASK_BY_ACCOUNTABLE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EVALUATE_TASK_BY_RESPONSIBLE_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.EVALUATE_TASK_BY_CONSULTED_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case taskManagementConstants.EVALUATE_TASK_BY_CONSULTED_SUCCESS:
            return {
                ...state,
                isLoading: false,
                task: action.payload
            };
        case taskManagementConstants.EVALUATE_TASK_BY_CONSULTED_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        case taskManagementConstants.GET_TASK_BY_USER_REQUEST:
            return {
                ...state,
                tasksbyuser: null,
                isLoading: true
            };
        case taskManagementConstants.GET_TASK_BY_USER_SUCCESS:
            return {
                ...state,
                tasksbyuser: action.payload,
                isLoading: false
            };
        case taskManagementConstants.GET_TASK_BY_USER_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            }

        case taskManagementConstants.GET_TASK_EVALUATION_REQUEST:
            return {
                ...state,
                listTaskEvaluations: null,
                isLoading: true
            };
        case taskManagementConstants.GET_TASK_EVALUATION_SUCCESS:
            return {
                ...state,
                listTaskEvaluations: action.payload,
                isLoading: false,
            };
        case taskManagementConstants.GET_TASK_EVALUATION_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error,

            }

        case taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_REQUEST:
            if (action.typeApi) {
                return {
                    ...state,
                    organizationUnitTasksInMonth: null,
                    isLoading: true
                };
            }
            return {
                ...state,
                organizationUnitTasks: null,
                isLoading: true
            };
        case taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_SUCCESS:
            if (action.typeApi) {
                return {
                    ...state,
                    organizationUnitTasksInMonth: action.payload,
                    isLoading: false,
                };
            }
            return {
                ...state,
                organizationUnitTasks: action.payload,
                isLoading: false,
            };
        case taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error,

            }


        case taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_FAILURE:
            return {
                ...state,
                isLoading: false
            }

        case taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_REQUEST:
            return {
                ...state,
                isLoading: true
            }

        case taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_SUCCESS:
            return {
                ...state,
                organizationUnitTasksChart: {
                    urgent: action.payload.urgent,
                    taskNeedToDo: action.payload.taskNeedToDo
                },
                isLoading: false,
            }

        case taskManagementConstants.GET_TIME_SHEET_OF_USER_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case taskManagementConstants.GET_TIME_SHEET_OF_USER_FAILE:
            return {
                ...state,
                isLoading: false
            };

        case taskManagementConstants.GET_TIME_SHEET_OF_USER_SUCCESS:
            return {
                ...state,
                userTimeSheetLogs: action.payload,
                isLoading: false
            };

        case taskManagementConstants.GET_USER_TIME_SHEET_LOG_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case taskManagementConstants.GET_USER_TIME_SHEET_LOG_FAILURE:
            return {
                ...state,
                isLoading: false
            };

        case taskManagementConstants.GET_USER_TIME_SHEET_LOG__SUCCESS:
            return {
                ...state,
                userTimeSheetLogs: action.payload,
                isLoading: false
            };


        case taskManagementConstants.GET_ALL_USER_TIME_SHEET_LOG_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case taskManagementConstants.GET_ALL_USER_TIME_SHEET_LOG_FAILE:
            return {
                ...state,
                isLoading: false
            };

        case taskManagementConstants.GET_ALL_USER_TIME_SHEET_LOG_SUCCESS:
            return {
                ...state,
                allTimeSheetLogs: action.payload,
                isLoading: false
            };


        case taskManagementConstants.UPDATE_TASK_SUCCESS:
            return {
                ...state,
                tasks: state.tasks.map(t => (t._id === action.payload._id) ? action.payload : t),
                isLoading: false
            };

        case taskManagementConstants.GETTASK_BYPROJECT_REQUEST:
            return {
                ...state,
                isLoading: true
            };

        case taskManagementConstants.GETTASK_BYPROJECT_SUCCESS:
            return {
                ...state,
                tasks: action.payload.docs,
                tasksByProject: action.payload.docs,
                totalDocs: action.payload.totalDocs,
                isLoading: false
            };

        case taskManagementConstants.GETTASK_BYPROJECT_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            };

        case taskManagementConstants.GETTASK_BYPROJECT_PAGINATE_REQUEST:
            return {
                ...state,
                isProjectPaginateLoading: true
            };


        case taskManagementConstants.GETTASK_BYPROJECT_PAGINATE_SUCCESS:
            return {
                ...state,
                tasks: action.payload.docs,
                tasksByProjectPaginate: action.payload.docs,
                totalDocs: action.payload.totalDocs,
                isProjectPaginateLoading: false
            }
        case taskManagementConstants.GETTASK_BYPROJECT_PAGINATE_FAILURE:
            return {
                ...state,
                error: action.error,
                isProjectPaginateLoading: false
            }

        case taskManagementConstants.IMPORT_TASKS_REQUEST:
            return {
                ...state,
                isLoading: true,
                isLoadingImport: true,
            };

        case taskManagementConstants.IMPORT_TASKS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isLoadingImport: false,
                importTask: action.payload.content,
            }

        case taskManagementConstants.IMPORT_TASKS_FAILURE:
            console.log('action.error', action.error)
            return {
                ...state,
                error: action.error,
                isLoading: false,
                isLoadingImport: false
            }
        case taskManagementConstants.GET_ORGANIZATION_TASK_DASHBOARD_CHART_REQUEST:
            if (action.chartNameArr) {
                if (action.chartNameArr.length === 2) {
                    let charts = state?.taskDashboardCharts
                    for (const i of action.chartNameArr) {
                        if (i !== "common-params") {
                            for (const j of Object.keys(charts)) {
                                if (i === j) {
                                    charts = { ...charts, [i]: { ...state.taskDashboardCharts?.[i], isLoading: true } }
                                }
                            }

                            return {
                                ...state,
                                taskDashboardCharts: charts,
                                isLoading: true
                            }
                        }
                    }
                }
                else {
                    let charts = {}
                    for (const i of action?.chartNameArr) {
                        charts = { ...charts, [i]: { isLoading: true } }
                    }

                    return {
                        ...state,
                        taskDashboardCharts: charts,
                        isLoading: true
                    }

                }
            }



        case taskManagementConstants.GET_ORGANIZATION_TASK_DASHBOARD_CHART_SUCCESS:
            let result = action.payload;
            if (Object.keys(result).length === 1) {
                const data = Object.values(result)[0];
                let charts = state.taskDashboardCharts
                for (const i of Object.keys(charts)) {
                    if (i === Object.keys(result)[0]) {
                        charts = { ...charts, [i]: { ...data, isLoading: false } }
                    }
                }
                return {
                    ...state,
                    taskDashboardCharts: charts,
                    isLoading: false
                }
            }
            else {
                for (const i of Object.keys(result)) {
                    result = { ...result, [i]: { ...result[i], isLoading: false } }
                }
                return {
                    ...state,
                    taskDashboardCharts: result,
                    isLoading: false
                }
            }

        case taskManagementConstants.GET_ORGANIZATION_TASK_DASHBOARD_CHART_FAILURE:
            return {
                ...state,
                error: action.error,
                isLoading: false
            }

        default:
            return state
    }
}