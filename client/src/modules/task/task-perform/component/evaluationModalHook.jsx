import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components/index';
import { EvaluateByResponsibleEmployee } from './evaluateByResponsibleEmployee';
import { EvaluateByAccountableEmployee } from './evaluateByAccountableEmployee';
import { EvaluateByConsultedEmployee } from './evaluateByConsultedEmployee';
import Swal from 'sweetalert2';

function EvaluationModal(props) {
    const { translate, performtasks } = props;
    const { role, id, hasAccountable } = props;
    const [state, setState] = useState(initState())
    const date = formatDate(new Date())
    const TODAY = date;

    function initState() {
        let date = formatDate(new Date())
        let data = handleData(date);
        return {
            newEvalArray: [],
            month: {},
            dateParam: {},
            evaluationsList: data.evaluations,
            checkEval: data.checkEval,
            checkMonth: data.checkMonth,
            expire: data.expire,
            isInNextMonthOfEndDate: data.isInNextMonthOfEndDate,
            showEval: {},
            disableAddItem: false,
        }
    }
    const { disableAddItem, newEvalArray, dateParam, month, evaluationsList, checkMonth, showEval,
        content, evaluation, isEval, expire, isInNextMonthOfEndDate } = state;
    const getDayOfMonth = (dateParam) => {
        let splitter = dateParam.split("-");

        let day = splitter[0];
        let month = splitter[1];
        let year = splitter[2];

        let dayOfMonth = 31;
        if (month === 4 || month === 6 || month === 5 || month === 9 || month === 11) {
            dayOfMonth = 30;
        } else if (month === 2) {
            if (((year % 4 === 0) && (year % 100 != 0)) || (year % 400 == 0)) { // là năm nhuận
                dayOfMonth = 29;
            } else {
                dayOfMonth = 28;
            }
        }

        return dayOfMonth;
    }

    function handleData(dateParam) {
        let { performtasks } = props;
        let data, checkMonth = false, checkEval = false;

        let task;
        if (performtasks.task) {
            task = performtasks.task;
        }

        let evaluations = task && task.evaluations;
        let evaluationOfMonth;

        let splitter = dateParam.split("-");
        let today = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let dateOfEval = today.getDate();
        let monthOfEval = today.getMonth();
        let yearOfEval = today.getFullYear();

        let endDate = new Date(task && task.endDate);
        let monthOfEndDate = endDate.getMonth();
        let yearOfEndDate = endDate.getUTCFullYear();

        // kiểm tra xem bước sang tháng mới so với ngày kết thúc hay chưa.
        let isInNextMonthOfEndDate = false;
        if ((yearOfEval === yearOfEndDate && monthOfEval > monthOfEndDate) || (yearOfEval > yearOfEndDate)) {
            isInNextMonthOfEndDate = true;
        }

        // nếu expire < 0 là đang quá hạn; ngược lại thì vẫn đúng hạn
        let expire = endDate.getTime() - today.getTime();


        // tìm đánh giá tháng hiện tại
        evaluationOfMonth = task && task.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));

        if (evaluations && evaluations.length > 0) {
            if (!evaluationOfMonth) { // có đánh giá các tháng nhưng chưa có đánh giá tháng này
                checkEval = true; // đánh giá công việc
                checkMonth = false; // đánh giá tháng này
            }
            else {
                checkEval = true;
                checkMonth = true;
            }
        }

        // sort evaluations
        let sortedEvaluations = handleSortMonthEval(evaluations);

        data = {
            evaluations: sortedEvaluations,
            checkEval: checkEval,
            checkMonth: checkMonth,
            expire: expire,
            isInNextMonthOfEndDate: isInNextMonthOfEndDate,
        }

        return data;
    }

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    function formatMonth(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    const handleChangeContent = async (id, item) => {
        await setState({
            ...state,
            content: id,
            evaluation: item,
            isEval: item ? true : false,
        });
    }

    const handleChangeShowEval = async (id) => {
        setState(state => {
            state.showEval[id] = false;
            return {
                ...state
            }
        });
    }

    const handleAddEval = async () => {
        await setState(state => {
            let numOfNewEval = state.newEvalArray.length;
            state.newEvalArray.unshift(`new-${numOfNewEval}`);
            state.showEval[`new-${numOfNewEval}`] = true;
            return {
                ...state,
                content: `new-${numOfNewEval}`,
                evaluation: null, // new evaluation of month
                isEval: false,
                disableAddItem: true,
                // checkMonth: true,
                // dataStatus: DATA_STATUS.QUERYING,
            }
        });
    }

    const showAlertDisableAdd = () => {
        Swal.fire({
            title: 'Bạn cần lưu đánh giá mới tạo trước khi thêm đánh giá mới',
            type: 'warning',
            confirmButtonColor: '#dd4b39',
            confirmButtonText: "Đóng",
        })
    }

    const handleChangeDataStatus = (value) => {
        setState({
            ...state,
            dataStatus: value,
            content: undefined,
        });
    }

    const handleChangeMonthEval = async (value) => {
        await setState(state => {
            state.month[value.id] = value.evaluatingMonth
            state.dateParam[value.id] = value.date
            return {
                ...state,

                // month: value.evaluatingMonth, 
                // dateParam: value.date
            }
        });
    }

    function handleSortMonthEval(evaluations) {
        // sắp xếp đánh giá theo thứ tự tháng
        const sortedEvaluations = evaluations?.sort((a, b) => new Date(b.evaluatingMonth) - new Date(a.evaluatingMonth));
        return sortedEvaluations;
    }

    const handleChangeEnableAddItem = async (id) => {
        let splitter = id?.split("-");
        if (splitter?.[0] === "new") {
            await setState({
                ...state,
                disableAddItem: false
            });
        }
    }

    let task;
    if (performtasks.task) {
        task = performtasks.task;
    }

    // let dateParam = TODAY;
    let now = new Date();
    let startDate = task && new Date(task.startDate);

    if (startDate && now.getTime() < startDate.getTime()) {
        dateParam = formatDate(startDate);
    }

    let title;
    if (role === 'responsible') {
        title = translate('task.task_management.detail_resp_eval');
    }
    else if (role === 'accountable') {
        title = translate('task.task_management.detail_acc_eval');
    }
    else if (role === 'consulted') {
        title = translate('task.task_management.detail_cons_eval');
    }

    let checkData = handleData(formatDate(new Date()));
    let checkEvaluationOfMonth = checkData.checkMonth;

    let dateProps;
    if (!checkEvaluationOfMonth) {
        if (dateParam[content]) {
            dateProps = dateParam
        } else {
            dateProps = TODAY
        }
    } else {
        dateProps = dateParam
    }

    return (
        <DialogModal
            modalID={`task-evaluation-modal-${id}-`}
            title={title}
            hasSaveButton={false}
            size={100}
        >
            <div className="col-xs-12 col-sm-4">
                <div className="box box-solid" style={{ border: "1px solid #ecf0f6", borderBottom: "none" }}>
                    <div className="box-header with-border">
                        <h3 className="box-title" style={{ fontWeight: 800 }}>{translate('task.task_management.eval_list')}</h3>
                    </div>
                    <div className="box-body no-padding">
                        <ul className="nav nav-pills nav-stacked">
                            {/* Đánh giá cho tháng đang được thêm, cho lên đầu */}
                            { // (showEval === true) && // checkMonth === false && 
                                newEvalArray.map((e, index) => {
                                    return showEval[e] && (
                                        <li key={index} className={content === e ? "active" : undefined}>
                                            <a style={{ cursor: 'pointer' }} onClick={() => handleChangeContent(e, null)}>
                                                {translate('task.task_management.eval_of')} {month[e] ? month[e] : "mới"}
                                                &nbsp;
                                            </a>
                                        </li>
                                    )
                                })
                            }

                            {/* Đánh giá cho các tháng trước đó */}
                            {(task?.evaluations && task?.evaluations.length !== 0) && task?.evaluations.map((item, index) =>
                                <li key={index} className={content === item._id ? "active" : undefined}>
                                    <a style={{ cursor: 'pointer' }} onClick={() => handleChangeContent(item._id, item)}>
                                        {translate('task.task_management.eval_of')} {formatMonth(item.evaluatingMonth)}
                                    &nbsp;
                                </a>
                                </li>
                            )}

                            {/* Thêm mới đánh giá */}
                            { // (showEval === false) && // checkMonth === false && // !(isInNextMonthOfEndDate) && // kiểm tra khi qua ngày kết thúc ko cho đánh giá
                                !disableAddItem ?
                                    <li className={content === 'new' ? "active" : undefined} >
                                        <a style={{ cursor: 'pointer' }} onClick={() => handleAddEval()}>
                                            {translate('task.task_management.add_eval_of_this_month')}&nbsp;&nbsp;&nbsp;&nbsp;<i style={{ color: 'green' }} className="fa fa-plus-square"></i>
                                        &nbsp;
                                    </a>
                                    </li> : <li className={content === 'new' ? "active" : undefined} >
                                        <a style={{ cursor: 'pointer' }} onClick={() => showAlertDisableAdd()}>
                                            {translate('task.task_management.add_eval_of_this_month')}&nbsp;&nbsp;&nbsp;&nbsp;<i style={{ color: 'green' }} className="fa fa-plus-square"></i>
                                        &nbsp;
                                    </a>
                                    </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col-xs-12 col-sm-8 qlcv">
                {(content !== undefined && role === "responsible") && hasAccountable === true &&
                    <EvaluateByResponsibleEmployee
                        id={content}
                        handleChangeDataStatus={handleChangeDataStatus}
                        task={task}
                        role={role}
                        title={title}
                        perform='evaluate'
                        evaluation={evaluation}
                        date={evaluation ? formatDate(evaluation.evaluatingMonth) : (checkEvaluationOfMonth ? dateParam[content] : (dateParam[content] ? dateParam[content] : TODAY))}
                        handleChangeMonthEval={handleChangeMonthEval}
                        isEval={isEval}
                        handleChangeShowEval={handleChangeShowEval}
                        handleChangeEnableAddItem={handleChangeEnableAddItem}
                    />
                }
                {(content !== undefined && role === "responsible") && hasAccountable === false &&
                    <EvaluateByAccountableEmployee
                        hasAccountable={false}
                        id={content}
                        handleChangeDataStatus={handleChangeDataStatus}
                        task={task}
                        role={role}
                        title={title}
                        perform='evaluate'
                        evaluation={evaluation}
                        date={evaluation ? formatDate(evaluation.evaluatingMonth) : (checkEvaluationOfMonth ? dateParam[content] : (dateParam[content] ? dateParam[content] : TODAY))}
                        handleChangeMonthEval={handleChangeMonthEval}
                        isEval={isEval}
                        handleChangeShowEval={handleChangeShowEval}
                        handleChangeEnableAddItem={handleChangeEnableAddItem}
                    />
                }
                {
                    (content !== undefined && role === "accountable") &&
                    <EvaluateByAccountableEmployee
                        hasAccountable={true}
                        id={content}
                        handleChangeDataStatus={handleChangeDataStatus}
                        task={task}
                        role={role}
                        title={title}
                        perform='evaluate'
                        evaluation={evaluation}
                        date={evaluation ? formatDate(evaluation.evaluatingMonth) : (checkEvaluationOfMonth ? dateParam[content] : (dateParam[content] ? dateParam[content] : TODAY))}
                        handleChangeMonthEval={handleChangeMonthEval}
                        isEval={isEval}
                        handleChangeShowEval={handleChangeShowEval}
                        handleChangeEnableAddItem={handleChangeEnableAddItem}
                    />
                }
                {
                    (content !== undefined && role === "consulted") &&
                    <EvaluateByConsultedEmployee
                        id={content}
                        handleChangeDataStatus={handleChangeDataStatus}
                        task={task}
                        role={role}
                        title={title}
                        perform='evaluate'
                        evaluation={evaluation}
                        date={evaluation ? formatDate(evaluation.evaluatingMonth) : (checkEvaluationOfMonth ? dateParam[content] : (dateParam[content] ? dateParam[content] : TODAY))}
                        handleChangeMonthEval={handleChangeMonthEval}
                        isEval={isEval}
                        handleChangeShowEval={handleChangeShowEval}
                        handleChangeEnableAddItem={handleChangeEnableAddItem}
                    />
                }
            </div>
        </DialogModal>
    );
}

const mapState = (state) => {
    const { performtasks } = state;
    return { performtasks }
}

const actionCreators = {};

const connectedEvaluationModal = connect(mapState, actionCreators)(withTranslate(EvaluationModal));
export { connectedEvaluationModal as EvaluationModal };