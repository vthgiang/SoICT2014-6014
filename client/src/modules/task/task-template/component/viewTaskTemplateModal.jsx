import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';

import { taskTemplateActions } from '../redux/actions';

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
        const { tasktemplates, translate } = this.props;

        let taskTemplate = {};
        let priority ="";
       
        if (tasktemplates.taskTemplate) {
            taskTemplate = tasktemplates.taskTemplate;
            switch(taskTemplate.priority)
            {
                case 1: priority=translate('task_template.low'); break;
                case 2: priority=translate('task_template.medium');break;
                case 3: priority=translate('task_template.high'); break;
            }
        }
        
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-view-tasktemplate" isLoading={false}
                    formID="form-view-tasktemplate"
                    title={taskTemplate && taskTemplate.name}
                    hasSaveButton={false}
                >
                    {/* Modal Body */}
                        <div className="row row-equal-height" >
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{padding: 10}}>
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        {translate('task_template.general_information')}
                                    </div>
                                    <div className="box-body">

                                        {/**Các thông tin của mẫu công việc */}
                                        <dt>{translate('task_template.unit')}</dt>
                                        <dd>{taskTemplate.organizationalUnit && taskTemplate.organizationalUnit.name}</dd>

                                        <dt>{translate('task_template.description')}</dt>
                                        <dd>{taskTemplate.description}</dd>

                                        <dt>{translate('task_template.formula')}</dt>
                                        <dd>{taskTemplate.formula}</dd>
                                        
                                        <dt>{translate('task_template.parameters')}</dt>
                                        <dd>
                                            <div><span style={{fontWeight: 600}}>overdueDate</span> - Thời gian quá hạn (ngày)</div>
                                            <div><span style={{fontWeight: 600}}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                                            <div><span style={{fontWeight: 600}}>totalDay</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)</div>
                                            <div><span style={{fontWeight: 600}}>averageActionRating</span> -  Trung bình cộng điểm đánh giá hoạt động (1-10)</div>
                                            <div><span style={{fontWeight: 600}}>progress</span> - % Tiến độ công việc (0-100)</div>
                                            <div><span style={{fontWeight: 600}}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                                        </dd>
                                        <dt>{translate('task_template.priority')}</dt>
                                        <dd>{taskTemplate && priority }</dd>

                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{padding: 10}} >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        {translate('task_template.roles')}
                                    </div>
                                    <div className="box-body">
                                        <dl>

                                            {/**Người được xem mẫu công việc */}
                                            <dt>{translate('task_template.permission_view')}</dt>
                                            <dd>
                                                 <ul>
                                                    {taskTemplate.readByEmployees && taskTemplate.readByEmployees.map((item, index) => {
                                                        return <li key={index}>{item.name}</li>
                                                    })}
                                                </ul>
                                            </dd>

                                            {/**Người thực hiện mẫu công việc */}
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
                                            
                                            {/**Người phê duyệt mẫu công việc */}
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

                                            {/**Người quan sát mẫu công việc */}
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
                                            
                                            {/**Người quan sát mẫu công việc */}
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

                        <div className="row row-equal-height">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{padding: 10}} >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        {translate('task_template.activity_list')}
                                    </div>

                                    {/**Các hoạt động mẫu công việc */}
                                    <div className="box-body">
                                        {
                                            (!taskTemplate.taskActions || taskTemplate.taskActions.length === 0)?
                                                <dt>{translate('task_template.no_data')}</dt> :
                                                taskTemplate.taskActions.map((item, index) =>
                                                    <React.Fragment key={index}>
                                                        <dt style={{ textAlign: 'left' }} >{item.name} - {item.mandatory ? "" : translate('general.no')} {translate('task_template.mandatory')}</dt>
                                                        <dd>{item.description}</dd>
                                                    </React.Fragment>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{padding: 10}}>
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        {translate('task_template.information_list')}
                                    </div>

                                    {/**Các trường thông tin mẫu công việc */}
                                    <div className="box-body">
                                        {
                                            (!taskTemplate.taskInformations || taskTemplate.taskInformations.length === 0)? 
                                                <dt>{translate('task_template.no_data')}</dt> :
                                                taskTemplate.taskInformations.map((item, index) =>
                                                    <React.Fragment key={index}>
                                                        <dt>{item.code} - {item.name} - Kiểu {item.type} {item.filledByAccountableEmployeesOnly ? ` - ${translate('task_template.manager_fill')}` : ""}</dt>
                                                        <dd>{item.description}</dd>
                                                    </React.Fragment>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
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