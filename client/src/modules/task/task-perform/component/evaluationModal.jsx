import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components/index';
import { EvaluateByResponsibleEmployee } from './evaluateByResponsibleEmployee';
import { EvaluateByAccountableEmployee } from './evaluateByAccountableEmployee';
import { EvaluateByConsultedEmployee } from './evaluateByConsultedEmployee';
import Swal from 'sweetalert2';

class EvaluationModal extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        let date = this.formatDate(new Date());
        let data = this.handleData(date);
        this.TODAY = date;

        let month = this.formatMonth(new Date());

        this.state = {
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
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING) {
            let data = this.handleData(this.formatDate(new Date()));
            this.setState(state => {
                return {
                    evaluationsList: data.evaluations,
                    checkEval: data.checkEval,
                    checkMonth: data.checkMonth,
                    expire: data.expire,
                    isInNextMonthOfEndDate: data.isInNextMonthOfEndDate,
                    // showEval: false,
                    dataStatus: this.DATA_STATUS.FINISHED,
                }
            })
            return true;
        }
        return true;
    }

    getDayOfMonth = (dateParam) => {
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

    handleData = (dateParam) => {
        let { performtasks } = this.props;
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
        let sortedEvaluations = this.handleSortMonthEval(evaluations);

        data = {
            evaluations: sortedEvaluations,
            checkEval: checkEval,
            checkMonth: checkMonth,
            expire: expire,
            isInNextMonthOfEndDate: isInNextMonthOfEndDate,
        }

        return data;
    }


    formatDate(date) {
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
    formatMonth(date) {
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
    handleChangeContent = async (id, item) => {
        await this.setState(state => {
            return {
                ...state,
                content: id,
                evaluation: item,
                isEval: item ? true : false,
                // dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    handleChangeShowEval = async (id) => {
        this.setState(state => {
            state.showEval[id] = false;
            return {
                ...state
            }
        });
    }

    handleAddEval = async () => {
        await this.setState(state => {
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
                // dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    showAlertDisableAdd = () => {
        Swal.fire({
            title: 'Bạn cần lưu đánh giá mới tạo trước khi thêm đánh giá mới',
            type: 'warning',
            confirmButtonColor: '#dd4b39',
            confirmButtonText: "Đóng",
        })
    }

    handleChangeDataStatus = (value) => {
        this.setState(state => {
            return {
                ...state,
                dataStatus: value,
                content: undefined,
            }
        });
    }

    handleChangeMonthEval = async (value) => {
        await this.setState(state => {
            state.month[value.id] = value.evaluatingMonth
            state.dateParam[value.id] = value.date
            return {
                ...state,

                // month: value.evaluatingMonth, 
                // dateParam: value.date
            }
        });
    }

    handleSortMonthEval = (evaluations) => {
        // sắp xếp đánh giá theo thứ tự tháng
        const sortedEvaluations = evaluations?.sort((a, b) => new Date(b.evaluatingMonth) - new Date(a.evaluatingMonth));
        return sortedEvaluations;
    }

    handleChangeEnableAddItem = async (id) => {
        let splitter = id?.split("-");
        if (splitter?.[0] === "new") {
            await this.setState({ disableAddItem: false });
        }
    }

    render() {
        const { translate, performtasks } = this.props;
        let { disableAddItem, newEvalArray, dateParam, month, evaluationsList, checkMonth, showEval, content, evaluation, isEval, expire, isInNextMonthOfEndDate } = this.state;
        const { role, id, hasAccountable } = this.props;

        let task;
        if (performtasks.task) {
            task = performtasks.task;
        }

        // let dateParam = this.TODAY;
        let now = new Date();
        let startDate = task && new Date(task.startDate);

        if (startDate && now.getTime() < startDate.getTime()) {
            dateParam = this.formatDate(startDate);
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

        let checkData = this.handleData(this.formatDate(new Date()));
        let checkEvaluationOfMonth = checkData.checkMonth;

        let dateProps;
        if (!checkEvaluationOfMonth) {
            if (dateParam[content]) {
                dateProps = dateParam
            } else {
                dateProps = this.TODAY
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
                                                <a style={{ cursor: 'pointer' }} onClick={() => this.handleChangeContent(e, null)}>
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
                                        <a style={{ cursor: 'pointer' }} onClick={() => this.handleChangeContent(item._id, item)}>
                                            {translate('task.task_management.eval_of')} {this.formatMonth(item.evaluatingMonth)}
                                        &nbsp;
                                    </a>
                                    </li>
                                )}

                                {/* Thêm mới đánh giá */}
                                { // (showEval === false) && // checkMonth === false && // !(isInNextMonthOfEndDate) && // kiểm tra khi qua ngày kết thúc ko cho đánh giá
                                    !disableAddItem ?
                                        <li className={content === 'new' ? "active" : undefined} >
                                            <a style={{ cursor: 'pointer' }} onClick={() => this.handleAddEval()}>
                                                {translate('task.task_management.add_eval_of_this_month')}&nbsp;&nbsp;&nbsp;&nbsp;<i style={{ color: 'green' }} className="fa fa-plus-square"></i>
                                            &nbsp;
                                        </a>
                                        </li> : <li className={content === 'new' ? "active" : undefined} >
                                            <a style={{ cursor: 'pointer' }} onClick={() => this.showAlertDisableAdd()}>
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
                            handleChangeDataStatus={this.handleChangeDataStatus}
                            task={task}
                            role={role}
                            title={title}
                            perform='evaluate'
                            evaluation={evaluation}
                            date={evaluation ? this.formatDate(evaluation.evaluatingMonth) : (checkEvaluationOfMonth ? dateParam[content] : (dateParam[content] ? dateParam[content] : this.TODAY))}
                            handleChangeMonthEval={this.handleChangeMonthEval}
                            isEval={isEval}
                            handleChangeShowEval={this.handleChangeShowEval}
                            handleChangeEnableAddItem={this.handleChangeEnableAddItem}
                        />
                    }
                    {(content !== undefined && role === "responsible") && hasAccountable === false &&
                        <EvaluateByAccountableEmployee
                            hasAccountable={false}
                            id={content}
                            handleChangeDataStatus={this.handleChangeDataStatus}
                            task={task}
                            role={role}
                            title={title}
                            perform='evaluate'
                            evaluation={evaluation}
                            date={evaluation ? this.formatDate(evaluation.evaluatingMonth) : (checkEvaluationOfMonth ? dateParam[content] : (dateParam[content] ? dateParam[content] : this.TODAY))}
                            handleChangeMonthEval={this.handleChangeMonthEval}
                            isEval={isEval}
                            handleChangeShowEval={this.handleChangeShowEval}
                            handleChangeEnableAddItem={this.handleChangeEnableAddItem}
                        />
                    }
                    {
                        (content !== undefined && role === "accountable") &&
                        <EvaluateByAccountableEmployee
                            hasAccountable={true}
                            id={content}
                            handleChangeDataStatus={this.handleChangeDataStatus}
                            task={task}
                            role={role}
                            title={title}
                            perform='evaluate'
                            evaluation={evaluation}
                            date={evaluation ? this.formatDate(evaluation.evaluatingMonth) : (checkEvaluationOfMonth ? dateParam[content] : (dateParam[content] ? dateParam[content] : this.TODAY))}
                            handleChangeMonthEval={this.handleChangeMonthEval}
                            isEval={isEval}
                            handleChangeShowEval={this.handleChangeShowEval}
                            handleChangeEnableAddItem={this.handleChangeEnableAddItem}
                        />
                    }
                    {
                        (content !== undefined && role === "consulted") &&
                        <EvaluateByConsultedEmployee
                            id={content}
                            handleChangeDataStatus={this.handleChangeDataStatus}
                            task={task}
                            role={role}
                            title={title}
                            perform='evaluate'
                            evaluation={evaluation}
                            date={evaluation ? this.formatDate(evaluation.evaluatingMonth) : (checkEvaluationOfMonth ? dateParam[content] : (dateParam[content] ? dateParam[content] : this.TODAY))}
                            handleChangeMonthEval={this.handleChangeMonthEval}
                            isEval={isEval}
                            handleChangeShowEval={this.handleChangeShowEval}
                            handleChangeEnableAddItem={this.handleChangeEnableAddItem}
                        />
                    }
                </div>
            </DialogModal>
        );
    }
}

const mapState = (state) => {
    const { performtasks } = state;
    return { performtasks }
}

const actionCreators = {};

const connectedEvaluationModal = connect(mapState, actionCreators)(withTranslate(EvaluationModal));
export { connectedEvaluationModal as EvaluationModal };