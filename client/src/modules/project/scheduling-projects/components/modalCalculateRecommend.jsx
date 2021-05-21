import jsPERT from 'js-pert'
import moment from 'moment'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import { DialogModal } from '../../../../common-components'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from "../../projects/redux/actions";
import { getCurrentProjectDetails, processDataTasksStartEnd } from '../../projects/components/functionHelper';

const NUMS_OF_REDUCTION = 4;

const ModalCalculateRecommend = (props) => {
    const { processedData, tasksData, translate, project, oldCPMEndDate } = props;
    const projectDetail = getCurrentProjectDetails(project);

    const [currentNumOfReduction, setCurrentNumOfReduction] = useState(NUMS_OF_REDUCTION);
    const [displayNumOfReduction, setDisplayNumOfReduction] = useState(NUMS_OF_REDUCTION);
    const [content, setContent] = useState({
        status: false,
        message: [],
        currentCPMEndDate: '',
        currentProcessedData: [],
    })

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

    const oneTimeReduce = (tasksData) => {
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
                    pessimisticTime: Number(item.estimateNormalTime) + 2,
                    predecessors: item.preceedingTasks,
                }
            }
        }
        const pert = jsPERT(formattedTasksData || {});
        // Tìm những tasks mà slack = 0 và deltaTime !== 0 để tránh kết quả NaN hoặc Infinity
        let criticalTasksOnlyArr = [];
        for (let i = 0; i < data.length; i++) {
            const { code, estimateOptimisticTime, estimateNormalTime, estimateNormalCost = 0, estimateMaxCost = 0 } = data[i];
            const currentSlack = pert.slack[code];
            const deltaTime = estimateNormalTime - estimateOptimisticTime;
            const deltaCostPerTime = (Number(estimateMaxCost.replace(/,/g, '')) - Number(estimateNormalCost.replace(/,/g, ''))) / deltaTime;
            if (deltaTime !== 0 && currentSlack === 0) {
                criticalTasksOnlyArr.push({
                    ...data[i],
                    deltaTime,
                    deltaCostPerTime,
                    taskIndexInArr: i,
                })
            }
        }
        // console.log('criticalTasksOnlyArr', criticalTasksOnlyArr);
        // Tìm task nào thuộc đường găng mà có mức dao động chi phí theo thời gian bé nhất
        let currentMinCPMItem = criticalTasksOnlyArr[0];
        for (let cpmItem of criticalTasksOnlyArr) {
            if (cpmItem.deltaCostPerTime < currentMinCPMItem.deltaCostPerTime) {
                currentMinCPMItem = cpmItem;
            }
        }
        if (!currentMinCPMItem) return {
            newData: undefined,
        }
        const timeToDecrease = currentMinCPMItem.deltaTime === 1 ? 1 : currentMinCPMItem.deltaTime - 1;
        const costToIncrease = currentMinCPMItem.deltaCostPerTime * timeToDecrease;
        // console.log('currentMinCPMItem', currentMinCPMItem.name)
        console.log('timeToDecrease', timeToDecrease);
        console.log('costToIncrease', costToIncrease);
        console.log('Be4 ------ data[currentMinCPMItem.taskIndexInArr]', data[currentMinCPMItem.taskIndexInArr])
        data[currentMinCPMItem.taskIndexInArr] = {
            ...data[currentMinCPMItem.taskIndexInArr],
            estimateNormalTime: data[currentMinCPMItem.taskIndexInArr].estimateNormalTime - timeToDecrease,
            estimateNormalCost: numberWithCommas(Number(data[currentMinCPMItem.taskIndexInArr].estimateNormalCost.replace(/,/g, '')) + costToIncrease),
        }
        console.log('After ------ data[currentMinCPMItem.taskIndexInArr]', data[currentMinCPMItem.taskIndexInArr])
        const newData = data.map(item => {
            item.startDate = '';
            item.endDate = '';
            return {
                ...item,
            };
        })
        console.log('newData', newData)
        return {
            newData,
            taskCode: currentMinCPMItem.code,
            taskName: currentMinCPMItem.name,
            timeToDecrease,
            costToIncrease,
            timeMessage: `Giảm thời gian công việc ${currentMinCPMItem.code} đi ${timeToDecrease} ${projectDetail?.unitTime}`,
            costMessage: `Tăng chi phí công việc ${currentMinCPMItem.code} thêm ${costToIncrease} ${projectDetail?.unitCost}`,
        };
    }

    const calculateRecommend = () => {
        let message = [];
        let currentProcessedData = [...processedData];
        for (let i = 0; i < currentNumOfReduction; i++) {
            console.log('\n\n-------------------------', i);
            const { newData, timeMessage, costMessage, taskCode, taskName, timeToDecrease, costToIncrease } = oneTimeReduce(currentProcessedData);
            if (!newData) break;
            message.push({
                timeMessage,
                costMessage,
                taskCode,
                taskName,
                timeToDecrease,
                costToIncrease,
            })
            const newProcessedData = processDataTasksStartEnd(projectDetail, newData);
            console.log('newProcessedData', newProcessedData)
            // console.log(moment(findLatestDate(newProcessedData)).format(), moment(projectDetail?.endDate).format());
            if (moment(findLatestDate(newProcessedData)).isSameOrBefore(moment(projectDetail?.endDate))) {
                currentProcessedData = newProcessedData;
                break;
            }
            currentProcessedData = newProcessedData;
        }
        const isReduceSuccessful = moment(findLatestDate(currentProcessedData)).isSameOrBefore(moment(projectDetail?.endDate));
        setContent({
            status: isReduceSuccessful,
            message,
            currentCPMEndDate: isReduceSuccessful ? findLatestDate(currentProcessedData) : '',
            currentProcessedData,
        });
        setDisplayNumOfReduction(currentNumOfReduction);
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

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-calculate-recommend`} isLoading={false}
                formID={`form-modal-calculate-recommend`}
                title={translate('project.schedule.calculateRecommend')}
                func={save}
                size={50}
                hasSaveButton={content.status}
                resetOnClose={true}
            >
                <div>
                    <div className="row">
                        <div className="form-group col-md-6">
                            <label className="form-control-static">Số bước giảm thời gian</label>
                            <input type="number" className="form-control" value={currentNumOfReduction} onChange={e => setCurrentNumOfReduction(e.target.value)} />
                        </div>
                        <button style={{ marginRight: 20, marginTop: 20 }} className="btn-success pull-right" onClick={calculateRecommend}>Tính toán</button>
                    </div>
                    <div>
                        {content.status ?
                            <div>
                                <ul className="todo-list">
                                    {content && content.message.length > 0 && content.message.map((messageItem, messageIndex) => {
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
                            </div>
                            :
                            <div>
                                <div>Không có kế hoạch giảm thời gian chỉ với <strong>{displayNumOfReduction} bước!</strong></div>
                                <div>Đề xuất: </div>
                                <ul>
                                    <li>Tăng số bước giảm chi phí</li>
                                    <li>Thay đổi thời gian dự kiến kết thúc của dự án</li>
                                    <li>Thay đổi dữ liệu thời gian ở file excel</li>
                                    <li>Chấp nhận kết quả và không sửa đổi gì</li>
                                </ul>
                            </div>
                        }
                    </div>
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
    getTasksByProject: taskManagementActions.getTasksByProject,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalCalculateRecommend))
