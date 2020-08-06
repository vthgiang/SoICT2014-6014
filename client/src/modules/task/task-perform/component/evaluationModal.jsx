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
        const { translate, employeeKpiSet } = this.props;
        const { evaluationsList, checkEval, checkMonth, showEval, content, evaluation } = this.state;
        const { task, role } = this.props;
        
        return (
            <DialogModal
                modalID={`task-evaluation-modal-${this.props.id}-`}
                title={`Đánh giá công viêc`}
                hasSaveButton={false}
                size={100}
            >
                <div className="col-xs-12 col-sm-4">
                    <div className="box box-solid" style={{ border: "1px solid #ecf0f6", borderBottom: "none" }}>
                        <div className="box-header with-border">
                            <h3 className="box-title" style={{ fontWeight: 800 }}>{`Danh sách các lần đánh giá`}</h3>
                        </div>
                        <div className="box-body no-padding">
                            <ul className="nav nav-pills nav-stacked">
                                {(checkMonth === false && showEval === true) && 
                                    <li className={content === 'new' ? "active" : undefined}>
                                        <a style={{ cursor: 'pointer' }} onClick={() => this.handleChangeContent('new', null)}>
                                            Đánh giá tháng { this.formatMonth(new Date()) }
                                        &nbsp;
                                    </a>
                                    </li>
                                }
                                {(evaluationsList && evaluationsList.length!==0) && evaluationsList.map((item, index) =>
                                    <li key={index} className={content === item._id ? "active" : undefined}>
                                        <a style={{ cursor: 'pointer' }} onClick={() => this.handleChangeContent( item._id, item)}>
                                            Đánh giá tháng { this.formatMonth(item.date) }
                                        &nbsp;
                                    </a>
                                    </li>
                                )}
                                {(checkMonth === false && showEval === false ) && 
                                    <li className={content === 'new' ? "active" : undefined}>
                                        <a style={{ cursor: 'pointer' }} onClick={() => this.handleAddEval()}>
                                                Thêm đánh giá tháng này <i className="fa fa-plus"></i>
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
                            title={translate('task.task_management.detail_resp_eval')}
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
                        title={translate('task.task_management.detail_acc_eval')}
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
                        title={translate('task.task_management.detail_cons_eval')}
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

function mapState(state) {
    const { kpimembers } = state;
    return { kpimembers };
}

const actionCreators = {
    
};
const connectedEvaluationModal = connect(mapState, actionCreators)(withTranslate(EvaluationModal));
export { connectedEvaluationModal as EvaluationModal };