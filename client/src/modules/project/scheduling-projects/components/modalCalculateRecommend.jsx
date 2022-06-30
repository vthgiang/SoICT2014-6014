import jsPERT from 'js-pert'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import { DialogModal, ErrorLabel } from '../../../../common-components'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from "../../projects/redux/actions";
import { getCurrentProjectDetails, processDataTasksStartEnd, calculateRecommendation } from '../../projects/components/functionHelper';
import ValidationHelper from '../../../../helpers//validationHelper';
import _cloneDeep from 'lodash/cloneDeep';


const ModalCalculateRecommend = (props) => {
    const { processedData, translate, project, oldCPMEndDate } = props;
    const projectDetail = getCurrentProjectDetails(project);
    const [state, setState] = useState({
        errorOnTimeReduced: undefined,
    });

    const [content, setContent] = useState({
        status: false,
        message: [],
        currentCPMEndDate: '',
        currentProcessedData: [],
    })
    const [timeToReduce, setTimeToReduce] = useState(0);
    const [maxReducedTime, setMaxReducedTime] = useState(0);
    const [normalTime, setNormalTime] = useState(0);

    //Xử lí khi thay đổi số ngày cần giảm
    const handleChangeTimeToReduce = (event) => {
        validateTimeReduced(event.target.value, true);
    }

    const validateTimeReduced = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateNumberInput(translate, value, 0, maxReducedTime);
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnTimeReduced: message,
                }
            })
            setTimeToReduce(value);
        }
        console.log(message, value, maxReducedTime);
        return message === undefined;
    }

    const findLatestDate = (data) => {
        if (data.length === 0) return null;
        let currentMax = data[0].endDate;
        for (let dataItem of data) {
            if (moment(dataItem.endDate).isAfter(moment(currentMax))) {
                currentMax = dataItem.endDate;
            }
        }
        return currentMax;
    }


    // const oneTimeReduce = (tasksData) => {
    //     let data = [...tasksData];
    //     // Tạo object để có thể dùng thư viện PERT
    //     let formattedTasksData = {}
    //     for (let item of data) {
    //         formattedTasksData = {
    //             ...formattedTasksData,
    //             [item.code]: {
    //                 id: item.code,
    //                 optimisticTime: Number(item.estimateOptimisticTime),
    //                 mostLikelyTime: Number(item.estimateNormalTime),
    //                 pessimisticTime: 2 * Number(item.estimateNormalTime) - Number(item.estimateOptimisticTime),
    //                 predecessors: item.preceedingTasks,
    //             }
    //         }
    //     }
    //     const pert = jsPERT(formattedTasksData || {});
    //     console.log(pert);
    //     // Tìm những tasks mà slack = 0 và deltaTime !== 0 để tránh kết quả NaN hoặc Infinity
    //     let criticalTasksOnlyArr = [];
    //     for (let i = 0; i < data.length; i++) {
    //         const { code, estimateOptimisticTime, estimateNormalTime, estimateNormalCost = 0, estimateMaxCost = 0 } = data[i];
    //         const currentSlack = pert.slack[code];
    //         const deltaTime = estimateNormalTime - estimateOptimisticTime;
    //         const deltaCostPerTime = (Number(estimateMaxCost.replace(/,/g, '')) - Number(estimateNormalCost.replace(/,/g, ''))) / deltaTime;
    //         if (deltaTime !== 0 && currentSlack === 0) {
    //             criticalTasksOnlyArr.push({
    //                 ...data[i],
    //                 deltaTime,
    //                 deltaCostPerTime,
    //                 taskIndexInArr: i,
    //             })
    //         }
    //     }
    //     // console.log('criticalTasksOnlyArr', criticalTasksOnlyArr);
    //     // Tìm task nào thuộc đường găng mà có mức dao động chi phí theo thời gian bé nhất
    //     let currentMinCPMItem = criticalTasksOnlyArr[0];
    //     for (let cpmItem of criticalTasksOnlyArr) {
    //         if (cpmItem.deltaCostPerTime < currentMinCPMItem.deltaCostPerTime) {
    //             currentMinCPMItem = cpmItem;
    //         }
    //     }
    //     if (!currentMinCPMItem) return {
    //         newData: undefined,
    //     }
    //     const timeToDecrease = currentMinCPMItem.deltaTime === 1 ? 1 : currentMinCPMItem.deltaTime - 1;
    //     const costToIncrease = currentMinCPMItem.deltaCostPerTime * timeToDecrease;
    //     // console.log('currentMinCPMItem', currentMinCPMItem.name)
    //     console.log('timeToDecrease', timeToDecrease);
    //     console.log('costToIncrease', costToIncrease);
    //     console.log('Be4 ------ data[currentMinCPMItem.taskIndexInArr]', data[currentMinCPMItem.taskIndexInArr])
    //     data[currentMinCPMItem.taskIndexInArr] = {
    //         ...data[currentMinCPMItem.taskIndexInArr],
    //         estimateNormalTime: data[currentMinCPMItem.taskIndexInArr].estimateNormalTime - timeToDecrease,
    //         estimateNormalCost: numberWithCommas(Number(data[currentMinCPMItem.taskIndexInArr].estimateNormalCost.replace(/,/g, '')) + costToIncrease),
    //     }
    //     console.log('After ------ data[currentMinCPMItem.taskIndexInArr]', data[currentMinCPMItem.taskIndexInArr])
    //     const newData = data.map(item => {
    //         item.startDate = '';
    //         item.endDate = '';
    //         return {
    //             ...item,
    //         };
    //     })
    //     console.log('newData', newData)
    //     return {
    //         newData,
    //         taskCode: currentMinCPMItem.code,
    //         taskName: currentMinCPMItem.name,
    //         timeToDecrease,
    //         costToIncrease,
    //         timeMessage: `Giảm thời gian công việc có mã ${currentMinCPMItem.code} đi ${timeToDecrease} ${projectDetail?.unitTime}`,
    //         costMessage: `Tăng chi phí công việc có mã ${currentMinCPMItem.code} thêm ${costToIncrease} ${projectDetail?.unitCost}`,
    //     };
    // }


    // Tính số ngày tối đa có thể giảm và số ngày thực hiện thông thường của dự án
    const findMaxReducedTime = (tasksData) => {
        let data = [...tasksData];
        // Tạo object để có thể dùng thư viện PERT
        let formattedTasksData = {}
        for (let item of data) {
            formattedTasksData = {
                ...formattedTasksData,
                [item.code]: {
                    id: item.code,
                    optimisticTime: Number(item.estimateOptimisticTime),
                    mostLikelyTime: Number(item.estimateNormalTime),
                    pessimisticTime: 2 * Number(item.estimateNormalTime) - Number(item.estimateOptimisticTime),
                    predecessors: item.preceedingTasks,
                }
            }
        }
        // Tính thời gian gốc
        const normalPert = jsPERT(formattedTasksData || {});

        // Tạo object để có thể dùng thư viện PERT
        // Tính thời gian nhỏ nhất
        for (let item of data) {
            formattedTasksData = {
                ...formattedTasksData,
                [item.code]: {
                    id: item.code,
                    optimisticTime: Number(item.estimateOptimisticTime),
                    mostLikelyTime: Number(item.estimateOptimisticTime),
                    pessimisticTime: Number(item.estimateOptimisticTime),
                    predecessors: item.preceedingTasks,
                }
            }
        }
        const shortPert = jsPERT(formattedTasksData || {});
        return {
            maxReducedTime: normalPert.latestFinishTimes['__end'] - shortPert.latestFinishTimes['__end'],
            normalTime: normalPert.latestFinishTimes['__end']
        }
    }

    // Kiểm tra ngày kết thúc dự án sớm nhất có thể trước ngày kết thúc dự kiến không
    const checkEarliestEndDate = (taskData) => {
        let fastestCase = taskData.map(task => {
            return {
                ...task,
                estimateNormalTime: task.estimateOptimisticTime
            }
        })
        let fastestProcessedData = processDataTasksStartEnd(projectDetail, fastestCase);
        let isReduceSuccessful = moment(findLatestDate(fastestProcessedData)).isSameOrBefore(moment(projectDetail?.endDate));
        setContent({
            status: isReduceSuccessful
        });
    }

    const calculateRecommend = async () => {
        let message = [];
        let answer = [];
        // Sao chép dữ liệu ra mảng mới để tránh ảnh hưởng tới dữ liệu gốc
        let currentProcessedData = _cloneDeep(processedData);
        if (timeToReduce > 0) {
            answer = await calculateRecommendation(currentProcessedData, normalTime - timeToReduce);
            console.log(answer);
        }


        // for (let i = 0; i < currentNumOfReduction; i++) {
        //     console.log('\n\n-------------------------', i);
        //     const { newData, timeMessage, costMessage, taskCode, taskName, timeToDecrease, costToIncrease } = oneTimeReduce(currentProcessedData);
        //     if (!newData) break;
        //     message.push({
        //         timeMessage,
        //         costMessage,
        //         taskCode,
        //         taskName,
        //         timeToDecrease,
        //         costToIncrease,
        //     })
        //     const newProcessedData = processDataTasksStartEnd(projectDetail, newData);
        //     console.log('newProcessedData', newProcessedData)
        //     // console.log(moment(findLatestDate(newProcessedData)).format(), moment(projectDetail?.endDate).format());
        //     if (moment(findLatestDate(newProcessedData)).isSameOrBefore(moment(projectDetail?.endDate))) {
        //         currentProcessedData = newProcessedData;
        //         break;
        //     }
        //     currentProcessedData = newProcessedData;
        // }

        // Tạo message từ answer đã có
        message = answer.map(task => {
            return {
                timeMessage: `Giảm thời gian công việc có mã ${task.taskCode} đi ${task.timeToDecrease} ${projectDetail?.unitTime}`,
                costMessage: `Tăng chi phí công việc có mã ${task.taskCode} thêm ${task.costToIncrease} ${projectDetail?.unitCost}`,
                taskCode: task.taskCode,
                taskName: task.taskName,
                timeToDecrease: task.timeToDecrease,
                costToIncrease: task.costToIncrease,
            }
        })

        // Tạo 1 bản sao có sửa đổi của danh sách công việc dựa trên kết quả thời gian thực hiện bị giảm mà ta đã tính
        for (let item of currentProcessedData) {
            item.startDate = '';
            item.endDate = '';
        }

        answer.forEach(task => {
            for (let item of currentProcessedData) {
                if (item.code === task.taskCode) {
                    item.estimateNormalTime = item.estimateNormalTime - task.timeToDecrease;
                    item.estimateNormalCost = numberWithCommas(Number(item.estimateNormalCost.replace(/,/g, '')) + task.costToIncrease);
                }
            }
        })

        const newProcessedData = processDataTasksStartEnd(projectDetail, currentProcessedData);
        console.log('newProcessedData', newProcessedData)
        currentProcessedData = newProcessedData;

        setContent({
            ...content,
            message,
            currentCPMEndDate: findLatestDate(currentProcessedData),
            currentProcessedData,
        });
    }

    const save = () => {
        Swal.fire({
            html: `<h4 style="color: red"><div>Chấp nhận những thay đổi này và tiếp tục?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.handleApplyChange(content.currentProcessedData);
            }
        })
    }

    useEffect(() => {
        let currentProcessedData = [...processedData];
        checkEarliestEndDate(currentProcessedData);
        let { maxReducedTime, normalTime } = findMaxReducedTime(currentProcessedData);
        setMaxReducedTime(maxReducedTime);
        setNormalTime(normalTime);
    }, [JSON.stringify(processedData)])

    const renderContent = () => {

        return (
            <div>
                <ul className="todo-list">
                    {content && content.message?.length > 0 && content.message?.map((messageItem, messageIndex) => {
                        const { taskCode, timeToDecrease, costToIncrease } = messageItem;
                        return (
                            <li key={`${messageIndex}-${messageItem.taskCode}`}>
                                <strong>Công việc {taskCode}: </strong>
                                <span style={{ color: 'green' }}>
                                    Giảm thời gian đi {timeToDecrease} {translate(`project.unit.${projectDetail?.unitTime}`)}
                                </span>
                                {', '}
                                <span style={{ color: 'red' }}>tăng chi phí thêm {numberWithCommas(costToIncrease)} {projectDetail?.unitCost}</span>
                            </li>
                        )
                    })}
                </ul>
                {timeToReduce > 0 && timeToReduce <= maxReducedTime && content.message?.length >0 &&
                    <div style={{ marginLeft: 10 }}>
                        <h5>Ngày kết thúc dự án dự kiến: <strong>{moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY')}</strong></h5>
                        <h5>Ngày kết thúc dự án tính theo CPM cũ:{' '}
                            <strong style={{ color: 'red' }}>
                                {moment(oldCPMEndDate).format('HH:mm DD/MM/YYYY')}
                            </strong>
                        </h5>
                        <h5>Ngày kết thúc dự án tính theo CPM mới:{' '}
                            <strong style={{ color: 'green' }}>
                                {moment(content.currentCPMEndDate).format('HH:mm DD/MM/YYYY')}
                            </strong>
                        </h5>
                    </div>
                }

                {!content.status &&
                    <div>
                        <div>Chú ý : Không có phương án nào để giảm thời gian dự án xuống trước hoặc cùng ngày kết thúc dự kiến!</div>
                        <div>Đề xuất: </div>
                        <ul>
                            <li>Thay đổi thời gian dự kiến kết thúc của dự án</li>
                            <li>Thay đổi dữ liệu thời gian ở file excel</li>
                            <li>Chấp nhận kết quả và không sửa đổi gì</li>
                        </ul>
                    </div>
                }

            </div>
        )
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-calculate-recommend`} isLoading={false}
                formID={`form-modal-calculate-recommend`}
                title={translate('project.schedule.calculateRecommend')}
                func={save}
                size={50}
                hasSaveButton={content.message?.length > 0}
                resetOnClose={true}
            >
                <div className="description-box without-border">

                    {/* Thời gian thực hiện tối đa có thể giảm */}

                    <div>
                        <h5><strong>Thời gian thực hiện dự án có thể giảm tối đa: {`${maxReducedTime} ${projectDetail?.unitTime} `}</strong></h5>
                    </div>

                    {/* Thời gian thực hiện cần giảm */}
                    <div className={`form-group ${!state.errorOnTimeReduced ? "" : "has-error"} `}>
                        <label>{translate('project.time_to_reduce')}<span className="text-red">*</span></label>
                        <input
                            className="form-control"
                            type="number"
                            name="timeToReduce"
                            placeholder={translate('project.time_to_reduce')}
                            onChange={handleChangeTimeToReduce}
                            value={timeToReduce}
                        />
                        <ErrorLabel content={state.errorOnTimeReduced} />
                    </div>

                    {/* Tính toán */}
                    <div>
                        <button className="btn btn-success" onClick={calculateRecommend}>
                            {translate('project.calculate')}
                        </button>
                    </div>
                    {renderContent()}
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalCalculateRecommend))
