import React, { Component } from 'react';
import { connect } from 'react-redux';
import { taskTemplateActions } from '../redux/actions';
import { DialogModal } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

class ModalViewTaskTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasktemplate: ""
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.taskTemplateId !== prevState.taskTemplateId) {
            return {
                ...prevState,
                taskTemplateId: nextProps.taskTemplateId,
            } 
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.taskTemplateId !== this.state.taskTemplateId) {
            this.props.getTaskTemplate(nextProps.taskTemplateId);
        }
        return true;
    }

    render() {
        var taskTemplate;

        const { tasktemplates, translate } = this.props;
        if (tasktemplates.template) taskTemplate = tasktemplates.template;

        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-view-tasktemplate" isLoading={false}
                    formID="form-view-tasktemplate"
                    title={taskTemplate && taskTemplate.info.name}
                    hasSaveButton={false}
                >

                    {/* Modal Body */}
                    <form className="form-horizontal">
                        <div className="row" >
                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        Thông tin
                                    </div>
                                    <div className="box-body">
                                        <dl>
                                            <dt>{translate('task_template.unit')}</dt>
                                            <dd>{taskTemplate && taskTemplate.info.organizationalUnit.name}</dd>

                                            <dt>{translate('task_template.permission_view')}</dt>
                                            <dd>
                                                {taskTemplate && <span>{taskTemplate.info.readByEmployees[1]}</span>}
                                            </dd>

                                            {taskTemplate && taskTemplate.info.responsibleEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.performer')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {taskTemplate.info.responsibleEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }

                                            {taskTemplate && taskTemplate.info.accountableEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.approver')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {taskTemplate.info.accountableEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }

                                            {taskTemplate && taskTemplate.info.consultedEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.observer')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {taskTemplate.info.consultedEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }

                                            {taskTemplate && taskTemplate.info.informedEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.supporter')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {taskTemplate.info.informedEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        Công thức đánh giá
                                    </div>
                                    <div className="box-body">
                                        <dt>{translate('task_template.description')}</dt>
                                        <dd>{taskTemplate && taskTemplate.info.description}</dd>

                                        <dt>{translate('task_template.formula')}</dt>
                                        <dd>{taskTemplate && taskTemplate.info.formula}</dd>
                                        
                                        <dt>Tham số</dt>
                                        <dd>
                                            <span>D: Tổng số ngày thực hiện công việc (trừ CN)</span><br />
                                            <span>D0: Số ngày quá hạn</span><br />
                                            <span>A: Tổng số hoạt động</span><br />
                                            <span>AD: Tổng số lần duyệt "Chưa đạt" cho các hoạt động</span><br />
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        {translate('task_template.activity_list')}
                                    </div>
                                    <div className="box-body">
                                        {
                                            (typeof taskTemplate === 'undefined' || taskTemplate.info.taskActions.length === 0) ? <p style={{ color: 'red', textAlign: 'left' }}>{translate('task_template.no_data')}</p> :
                                                taskTemplate.info.taskActions.map((item, index) =>
                                                    <React.Fragment>
                                                        <dt style={{ textAlign: 'left' }} >{item.name} - {item.mandatory ? "" : "Không"} bắt buộc</dt>
                                                        <dd>{item.description}</dd>
                                                    </React.Fragment>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        {translate('task_template.information_list')}
                                    </div>
                                    <div className="box-body">
                                        {
                                            (typeof taskTemplate === 'undefined' || taskTemplate.info.taskInformations.length === 0) ? <p style={{ color: 'red', textAlign: 'left' }}>{translate('task_template.no_data')}</p> :
                                                taskTemplate.info.taskInformations.map((item, index) =>
                                                    <React.Fragment>
                                                        <dt>{item.name} - Kiểu {item.type} {item.filledByAccountableEmployeesOnly ? "- Chỉ quản lý được điền" : ""}</dt>
                                                        <dd>{item.description}</dd>
                                                    </React.Fragment>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasktemplates } = state;
    return { tasktemplates };
}

const actionCreators = {
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
};
const connectedModalViewTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalViewTaskTemplate));
export { connectedModalViewTaskTemplate as ModalViewTaskTemplate };