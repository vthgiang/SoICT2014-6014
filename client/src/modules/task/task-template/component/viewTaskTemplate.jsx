import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { taskTemplateActions } from '../redux/actions';

// import { taskTemplateActions } from '../redux/actions';

class ViewTaskTemplate extends Component {
    constructor(props) {
        super(props);   
        this.state = {}

    }

    clickShowMore = () => {
        this.setState(state => {
            return {
                ...state,
                showMore: !state.showMore,
            }
        });
    }
    render() {
        const { translate, department } = this.props;
        const { taskTemplate, isProcess, listUser } = this.props;
        const {showMore } = this.state
        let listUserAccountable = [], listUserResponsible = []
        let organizationalUnitProcess
        let priority = "";
        if (isProcess) {
            if (listUser) {
                listUser.forEach(x => {
                    if (taskTemplate?.accountableEmployees.some(y => y === x._id)) {
                        listUserAccountable.push({ value: x._id, name: x.name })
                    }
                })
                listUser.forEach(x => {
                    if (taskTemplate?.responsibleEmployees.some(y => y === x._id)) {
                        listUserResponsible.push({ value: x._id, name: x.name })
                    }
                })
                department.list.forEach(x => {
                    if (taskTemplate?.organizationalUnit === x._id) {
                        organizationalUnitProcess = x.name
                    }
                })
            }
        }
        let organizationalUnit = isProcess ? organizationalUnitProcess : taskTemplate?.organizationalUnit?.name
        let accountableEmployees = isProcess ? listUserAccountable : taskTemplate?.accountableEmployees
        let responsibleEmployees = isProcess ? listUserResponsible : taskTemplate?.listUserResponsible
        console.log(responsibleEmployees)
        switch (taskTemplate?.priority) {
            case 1: priority = translate('task_template.low'); break;
            case 2: priority = translate('task_template.medium'); break;
            case 3: priority = translate('task_template.high'); break;
        }
        return (
            <React.Fragment>
                {/* Modal Body */}
                <div className="row row-equal-height" >
                    <div className={`${isProcess ? "col-lg-12 col-sm-12" : "col-xs-12 col-sm-12 col-md-6 col-lg-6"}`} style={{ padding: 10 }}>
                        <div className="box box-solid description">
                            <div className="box-header with-border">
                                {translate('task_template.general_information')}
                            </div>
                            <div className="box-body">

                                {/**Các thông tin của mẫu công việc */}
                                <dt>{translate('task_template.unit')}</dt>
                                <dd>{organizationalUnit}</dd>

                                <dt>{translate('task_template.description')}</dt>
                                <dd>{taskTemplate?.description}</dd>

                                <dt>{translate('task_template.formula')}</dt>
                                <dd>{taskTemplate?.formula}</dd>

                                <dt>{translate('task_template.parameters')}</dt>
                                <dd>
                                    <div><span style={{ fontWeight: 600 }}>overdueDate</span> - Thời gian quá hạn (ngày)</div>
                                    <div><span style={{ fontWeight: 600 }}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                                    <div><span style={{ fontWeight: 600 }}>totalDay</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)</div>
                                    <div><span style={{ fontWeight: 600 }}>averageActionRating</span> -  Trung bình cộng điểm đánh giá hoạt động (1-10)</div>
                                    <div><span style={{ fontWeight: 600 }}>progress</span> - % Tiến độ công việc (0-100)</div>
                                    <div><span style={{ fontWeight: 600 }}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</div>
                                </dd>
                                <dt>{translate('task_template.priority')}</dt>
                                <dd>{taskTemplate && priority}</dd>

                            </div>
                        </div>
                    </div>

                    <div className={`${isProcess ? "col-lg-12 col-sm-12" : "col-xs-12 col-sm-12 col-md-6 col-lg-6"}`} style={{ padding: 10 }} >
                        <div className="box box-solid description">
                            <div className="box-header with-border">
                                {translate('task_template.roles')}
                            </div>
                            <div className="box-body">
                                <dl>
                                    {!isProcess &&
                                        <React.Fragment>
                                            {/**Người được xem mẫu công việc */}
                                            <dt>{translate('task_template.permission_view')}</dt>
                                            <dd>
                                                <ul>
                                                    {taskTemplate?.readByEmployees && taskTemplate?.readByEmployees.map((item, index) => {
                                                        return <li key={index}>{item.name}</li>
                                                    })}
                                                </ul>
                                            </dd>
                                        </React.Fragment>
                                    }
                                    {/**Người thực hiện mẫu công việc */}
                                    {responsibleEmployees && responsibleEmployees.length > 0 &&
                                        <React.Fragment>
                                            <dt>{translate('task_template.performer')}</dt>
                                            <dd>
                                                <ul>
                                                    {responsibleEmployees.map((item, index) => {
                                                        return <li key={index}>{item.name}</li>
                                                    })}
                                                </ul>
                                            </dd>
                                        </React.Fragment>
                                    }

                                    {/**Người phê duyệt mẫu công việc */}
                                    {accountableEmployees && accountableEmployees.length > 0 &&
                                        <React.Fragment>
                                            <dt>{translate('task_template.approver')}</dt>
                                            <dd>
                                                <ul>
                                                    {accountableEmployees.map((item, index) => {
                                                        return <li key={index}>{item.name}</li>
                                                    })}
                                                </ul>
                                            </dd>
                                        </React.Fragment>
                                    }
                                    {showMore}
                                    {/**Người quan sát mẫu công việc */}
                                    {taskTemplate?.consultedEmployees && taskTemplate?.consultedEmployees.length > 0 &&
                                        <React.Fragment>
                                            <dt>{translate('task_template.observer')}</dt>
                                            <dd>
                                                <ul>
                                                    {taskTemplate?.consultedEmployees.map((item, index) => {
                                                        return <li key={index}>{item.name}</li>
                                                    })}
                                                </ul>
                                            </dd>
                                        </React.Fragment>
                                    }

                                    {/**Người quan sát mẫu công việc */}
                                    {taskTemplate?.informedEmployees && taskTemplate?.informedEmployees.length > 0 &&
                                        <React.Fragment>
                                            <dt>{translate('task_template.supporter')}</dt>
                                            <dd>
                                                <ul>
                                                    {taskTemplate?.informedEmployees.map((item, index) => {
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
                    <div className={`${isProcess ? "col-lg-12 col-sm-12" : "col-xs-12 col-sm-12 col-md-6 col-lg-6"}`} style={{ padding: 10 }} >
                        <div className="box box-solid description">
                            <div className="box-header with-border">
                                {translate('task_template.activity_list')}
                            </div>

                            {/**Các hoạt động mẫu công việc */}
                            <div className="box-body">
                                {
                                    (!taskTemplate?.taskActions || taskTemplate?.taskActions.length === 0) ?
                                        <dt>{translate('task_template.no_data')}</dt> :
                                        taskTemplate?.taskActions.map((item, index) =>
                                            <React.Fragment key={index}>
                                                <dt style={{ textAlign: 'left' }} >{item.name} - {item.mandatory ? "" : translate('general.no')} {translate('task_template.mandatory')}</dt>
                                                <dd>{item.description}</dd>
                                            </React.Fragment>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                    <div className={`${isProcess ? "col-lg-12 col-sm-12" : "col-xs-12 col-sm-12 col-md-6 col-lg-6"}`} style={{ padding: 10 }}>
                        <div className="box box-solid description">
                            <div className="box-header with-border">
                                {translate('task_template.information_list')}
                            </div>

                            {/**Các trường thông tin mẫu công việc */}
                            <div className="box-body">
                                {
                                    (!taskTemplate?.taskInformations || taskTemplate?.taskInformations.length === 0) ?
                                        <dt>{translate('task_template.no_data')}</dt> :
                                        taskTemplate?.taskInformations.map((item, index) =>
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
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasktemplates, department } = state;
    return { tasktemplates, department };
}

const actionCreators = {
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
};
const connectedViewTaskTemplate = connect(mapState, actionCreators)(withTranslate(ViewTaskTemplate));
export { connectedViewTaskTemplate as ViewTaskTemplate };