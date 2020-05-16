import React, { Component } from 'react';
import { connect } from 'react-redux';
import { taskTemplateActions } from '../redux/actions';
import { DialogModal } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

class ModalViewTaskTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            return false;
        }
        return true;
    }

    render() {
        var taskTemplate = {};

        const { tasktemplates, translate } = this.props;
        if (tasktemplates.taskTemplate) taskTemplate = tasktemplates.taskTemplate;

        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-view-tasktemplate" isLoading={false}
                    formID="form-view-tasktemplate"
                    title={taskTemplate && taskTemplate.name}
                    hasSaveButton={false}
                >

                    {/* Modal Body */}
                    <form className="form-horizontal">
                        <div className="row" >
                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        Thông tin chung
                                    </div>
                                    <div className="box-body">

                                        <dt>{translate('task_template.unit')}</dt>
                                        <dd>{taskTemplate.organizationalUnit && taskTemplate.organizationalUnit.name}</dd>

                                        <dt>{translate('task_template.description')}</dt>
                                        <dd>{taskTemplate.description}</dd>

                                        <dt>{translate('task_template.formula')}</dt>
                                        <dd>{taskTemplate.formula}</dd>
                                        
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

                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        Các vai trò
                                    </div>
                                    <div className="box-body">
                                        <dl>
                                            <dt>{translate('task_template.permission_view')}</dt>
                                            <dd>
                                                 <ul>
                                                    {taskTemplate.readByEmployees && taskTemplate.readByEmployees.map((item, index) => {
                                                        return <li key={index}>{item.name}</li>
                                                    })}
                                                </ul>
                                            </dd>

                                            {taskTemplate.responsibleEmployees && taskTemplate.responsibleEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.performer')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {taskTemplate.responsibleEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }

                                            {taskTemplate.accountableEmployees && taskTemplate.accountableEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.approver')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {taskTemplate.accountableEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }

                                            {taskTemplate.consultedEmployees && taskTemplate.consultedEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.observer')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {taskTemplate.consultedEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }

                                            {taskTemplate.informedEmployees && taskTemplate.informedEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.supporter')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {taskTemplate.informedEmployees.map((item, index) => {
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
                        </div>


                        <div className="row">
                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        {translate('task_template.activity_list')}
                                    </div>
                                    <div className="box-body">
                                        {
                                            (!taskTemplate.taskActions || taskTemplate.taskActions.length === 0)?
                                                <p style={{ color: 'red', textAlign: 'left' }}>{translate('task_template.no_data')}</p> :
                                                taskTemplate.taskActions.map((item, index) =>
                                                    <React.Fragment key={index}>
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
                                            (!taskTemplate.taskInformations || taskTemplate.taskInformations.length === 0)? 
                                                <p style={{ color: 'red', textAlign: 'left' }}>{translate('task_template.no_data')}</p> :
                                                taskTemplate.taskInformations.map((item, index) =>
                                                    <React.Fragment key={index}>
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