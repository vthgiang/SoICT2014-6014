import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components/index';
import { EvaluateByResponsibleEmployee } from './evaluateByResponsibleEmployee';
import { EvaluateByAccountableEmployee } from './evaluateByAccountableEmployee';
import { EvaluateByConsultedEmployee } from './evaluateByConsultedEmployee';

class EvaluationModal extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        let date = this.formatDate(new Date());
        let data = this.handleData(date);
        this.TODAY = date;
        this.state = {
            evaluationsList: data.evaluations,
            checkEval: data.checkEval,
            checkMonth: data.checkMonth,
            expire: data.expire,
            showEval: false,
        };
    }

    handleData = (dateParam) => {
        let { task } = this.props;
        let data, checkMonth = false, checkEval = false;
        let evaluations = task.evaluations;
        let evaluationOfMonth;

        let splitter = dateParam.split("-");
        let today = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let monthOfEval = today.getMonth();
        let yearOfEval = today.getFullYear();
        
        let endDate = new Date(task.endDate);

        let expire = endDate.getTime() - today.getTime(); 

        evaluationOfMonth = task.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));

        if (evaluations.length > 0) {
            if(!evaluationOfMonth) { // có đánh giá các tháng nhưng chưa có đánh giá tháng này
                checkEval = true;
                checkMonth = false;
            }
            else {
                checkEval = true;
                checkMonth = true;
            }
        }

        data = {
            evaluations: evaluations,
            checkEval: checkEval,
            checkMonth: checkMonth,
            expire: expire,
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
                // dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }
    handleAddEval = async () => {
        await this.setState(state => {
            return {
                ...state,
                content: "new",
                evaluation: null, // new evaluation of month
                // checkMonth: true,
                showEval: true,
                // dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }


    render() {
        const { translate } = this.props;
        const { evaluationsList, checkEval, checkMonth, showEval, content, evaluation, expire } = this.state;
        const { task, role, id } = this.props;

        let title;
        if(role === 'responsible') {
            title = translate('task.task_management.detail_resp_eval');
        }
        else if (role === 'accountable') {
            title = translate('task.task_management.detail_acc_eval');
        }
        else if (role === 'consulted') {
            title = translate('task.task_management.detail_cons_eval');
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
                                {(checkMonth === false && showEval === true) && 
                                    <li className={content === 'new' ? "active" : undefined}>
                                        <a style={{ cursor: 'pointer' }} onClick={() => this.handleChangeContent('new', null)}>
                                            {translate('task.task_management.eval_of')} ({ this.formatMonth(new Date()) })
                                        &nbsp;
                                    </a>
                                    </li>
                                }
                                {(evaluationsList && evaluationsList.length!==0) && evaluationsList.map((item, index) =>
                                    <li key={index} className={content === item._id ? "active" : undefined}>
                                        <a style={{ cursor: 'pointer' }} onClick={() => this.handleChangeContent( item._id, item)}>
                                            {translate('task.task_management.eval_of')} ({ this.formatMonth(item.date) })
                                        &nbsp;
                                    </a>
                                    </li>
                                )}
                                {(expire > 0) && (checkMonth === false && showEval === false ) && 
                                    <li className={content === 'new' ? "active" : undefined}>
                                        <a style={{ cursor: 'pointer' }} onClick={() => this.handleAddEval()}>
                                                {translate('task.task_management.add_eval_of_this_month')} <i style={{color: 'green'}} className="fa fa-plus-square"></i>
                                            &nbsp;
                                        </a>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-8 qlcv">
                    {(content !== undefined && role === "responsible") &&
                        <EvaluateByResponsibleEmployee
                            id={content}
                            task={task}
                            role={role}
                            title={title}
                            perform='evaluate'
                            evaluation={evaluation}
                            date={evaluation ? this.formatDate(evaluation.date) : this.TODAY}
                        />
                    }
                    {
                    (content !== undefined && role === "accountable") &&
                    <EvaluateByAccountableEmployee
                        id={content}
                        task={task}
                        role={role}
                        title={title}
                        perform='evaluate'
                        evaluation={evaluation}
                        date={evaluation ? this.formatDate(evaluation.date) : this.TODAY}
                    />
                }
                {
                    (content !== undefined && role === "consulted") &&
                    <EvaluateByConsultedEmployee
                        id={content}
                        task={task}
                        role={role}
                        title={title}
                        perform='evaluate'
                        evaluation={evaluation}
                        date={evaluation ? this.formatDate(evaluation.date) : this.TODAY}
                    />
                }
                </div>
            </DialogModal>
        );
    }
}

const mapState = (state) => {}

const actionCreators = {};

const connectedEvaluationModal = connect(null, null)(withTranslate(EvaluationModal));
export { connectedEvaluationModal as EvaluationModal };