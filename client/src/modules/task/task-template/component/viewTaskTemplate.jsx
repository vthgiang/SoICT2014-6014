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
        let responsibleEmployees = isProcess ? listUserResponsible : taskTemplate?.responsibleEmployees
        console.log(responsibleEmployees)
        switch (taskTemplate?.priority) {
            case 1: priority = translate('task_template.low'); break;
            case 2: priority = translate('task_template.medium'); break;
            case 3: priority = translate('task_template.high'); break;
        }
        return (
            <React.Fragment>
                {/* Modal Body */}
                <div className="row row-equal-height" style={{marginTop: -25}}>
                    <div className={`${isProcess ? "col-lg-12 col-sm-12" : "col-xs-12 col-sm-12 col-md-6 col-lg-6"}`} style={{ padding: 10 }}>
                        <div className="description-box" style={{ height: "100%" }}>
                            <h4>
                                {translate('task_template.general_information')}
                            </h4>

                            {/**Các thông tin của mẫu công việc */}
                            <div><strong>{translate('task_template.unit')}:</strong><span>{organizationalUnit}</span></div>
                            
                            <div><strong>{translate('task_template.description')}:</strong><span>{taskTemplate?.description}</span></div>

                            <div><strong>{translate('task_template.priority')}:</strong><span>{taskTemplate && priority}</span></div>

                            <div>
                                <strong>{translate('task_template.formula')}:</strong>
                                <span>{taskTemplate?.formula}</span>
                            </div>
                            
                            <div>
                                <strong>{translate('task_template.parameters')}:</strong>
                            </div>
                            <ul>
                                <li><span style={{ fontWeight: 600 }}>overdueDate</span> - Thời gian quá hạn (ngày)</li>
                                <li><span style={{ fontWeight: 600 }}>dayUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)</li>
                                <li><span style={{ fontWeight: 600 }}>totalDay</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)</li>
                                <li><span style={{ fontWeight: 600 }}>averageActionRating</span> -  Trung bình cộng điểm đánh giá hoạt động (1-10)</li>
                                <li><span style={{ fontWeight: 600 }}>progress</span> - % Tiến độ công việc (0-100)</li>
                            </ul>
                        </div>
                    </div>

                    <div className={`${isProcess ? "col-lg-12 col-sm-12" : "col-xs-12 col-sm-12 col-md-6 col-lg-6"}`} style={{ padding: 10 }} >
                        <div className="description-box" style={{ height: "100%" }}>
                            <h4>
                                {translate('task_template.roles')}
                            </h4>
                            <div>
                                {!isProcess &&
                                    <React.Fragment>
                                        {/**Người được xem mẫu công việc */}
                                        <div><strong>{translate('task_template.permission_view')}</strong></div>
                                        <div>
                                            <ul>
                                                {taskTemplate?.readByEmployees && taskTemplate?.readByEmployees.map((item, index) => {
                                                    return <li key={index}>{item.name}</li>
                                                })}
                                            </ul>
                                        </div>
                                    </React.Fragment>
                                }
                                {/**Người thực hiện mẫu công việc */}
                                {responsibleEmployees && responsibleEmployees.length > 0 &&
                                    <React.Fragment>
                                        <div><strong>{translate('task_template.performer')}</strong></div>
                                        <div>
                                            <ul>
                                                {responsibleEmployees.map((item, index) => {
                                                    return <li key={index}>{item.name}</li>
                                                })}
                                            </ul>
                                        </div>
                                    </React.Fragment>
                                }

                                {/**Người phê duyệt mẫu công việc */}
                                {accountableEmployees && accountableEmployees.length > 0 &&
                                    <React.Fragment>
                                        <div><strong>{translate('task_template.approver')}</strong></div>
                                        <div>
                                            <ul>
                                                {accountableEmployees.map((item, index) => {
                                                    return <li key={index}>{item.name}</li>
                                                })}
                                            </ul>
                                        </div>
                                    </React.Fragment>
                                }
                                {showMore}
                                {/**Người quan sát mẫu công việc */}
                                {taskTemplate?.consultedEmployees && taskTemplate?.consultedEmployees.length > 0 &&
                                    <React.Fragment>
                                        <div><strong>{translate('task_template.observer')}</strong></div>
                                        <div>
                                            <ul>
                                                {taskTemplate?.consultedEmployees.map((item, index) => {
                                                    return <li key={index}>{item.name}</li>
                                                })}
                                            </ul>
                                        </div>
                                    </React.Fragment>
                                }

                                {/**Người quan sát mẫu công việc */}
                                {taskTemplate?.informedEmployees && taskTemplate?.informedEmployees.length > 0 &&
                                    <React.Fragment>
                                        <div><strong>{translate('task_template.supporter')}</strong></div>
                                        <div>
                                            <ul>
                                                {taskTemplate?.informedEmployees.map((item, index) => {
                                                    return <li key={index}>{item.name}</li>
                                                })}
                                            </ul>
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row row-equal-height">
                    <div className={`${isProcess ? "col-lg-12 col-sm-12" : "col-xs-12 col-sm-12 col-md-6 col-lg-6"}`} style={{ padding: 10 }} >
                        <div className="description-box" style={{ height: "100%" }}>
                            <h4>
                                {translate('task_template.activity_list')}
                            </h4>

                            {/**Các hoạt động mẫu công việc */}
                            <div>
                                {
                                    (!taskTemplate?.taskActions || taskTemplate?.taskActions.length === 0) ?
                                        <div><strong>{translate('task_template.no_data')}</strong></div> :
                                        taskTemplate?.taskActions.map((item, index) =>
                                            <React.Fragment key={index}>
                                                <div style={{ textAlign: 'left' }}><strong>{item.name} - {item.mandatory ? "" : translate('general.no')} {translate('task_template.mandatory')}:</strong><span>{item.description}</span></div>
                                            </React.Fragment>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                    <div className={`${isProcess ? "col-lg-12 col-sm-12" : "col-xs-12 col-sm-12 col-md-6 col-lg-6"}`} style={{ padding: 10 }}>
                        <div className="description-box" style={{ height: "100%"}}>
                            <h4>
                                {translate('task_template.information_list')}
                            </h4>

                            {/**Các trường thông tin mẫu công việc */}
                            <div>
                                {
                                    (!taskTemplate?.taskInformations || taskTemplate?.taskInformations.length === 0) ?
                                        <div><strong>{translate('task_template.no_data')}</strong></div> :
                                        taskTemplate?.taskInformations.map((item, index) =>
                                            <React.Fragment key={index}>
                                                <div><strong>{item.code} - {item.name} - Kiểu {item.type} {item.filledByAccountableEmployeesOnly ? ` - ${translate('task_template.manager_fill')}` : ""}:</strong><span>{item.description}</span></div>
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