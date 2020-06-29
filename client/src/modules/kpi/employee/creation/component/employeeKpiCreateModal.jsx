import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from "../../../../super-admin/user/redux/actions"
import { createKpiSetActions  } from '../redux/actions';
import { DatePicker, DialogModal, SelectBox } from '../../../../../../src/common-components';
import { withTranslate } from 'react-redux-multilingual';

import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';

var translate='';
class ModalCreateEmployeeKpiSet extends Component {
    componentDidMount() {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    }

    constructor(props) {
        super(props);
        translate = this.props.translate;
        this.state = {
            _id: null,
            employeeKpiSet: {
                organizationalUnit: "",
                // creater: this.getCreater(), //localStorage.getItem("id"),
                approver: null,
                date: "",
            },
            adding: false
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { user } = this.props;

        // Khi truy vấn API đã có kết quả
        if (!this.state.employeeKpiSet.approver && user.userdepartments && user.userdepartments.deans) {
            if (Object.keys(user.userdepartments.deans).length > 0){ // Nếu có trưởng đơn vị
                let members = user.userdepartments.deans[Object.keys(user.userdepartments.deans)[0]].members;
                if (members.length) {
                    this.setState(state =>{
                        return{
                            ...state,
                            employeeKpiSet: {
                                ...this.state.employeeKpiSet,
                                approver: members[0]
                            }
                        };
                    });
                    return false; // Sẽ cập nhật lại state nên không cần render
                }
            }
        }

        return true;
    }

    formatDate = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: {
                    ...state.employeeKpiSet,
                    date: value
                }
            }
        })
    }

    handleApproverChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                    employeeKpiSet: {
                        ...state.employeeKpiSet,
                        approver: value,
                    }
            }
        });
    }
    
    handleCreateEmployeeKpiSet = async () => {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultTime =  [month, year].join('-');
        if(this.state.employeeKpiSet.date === ""){
            await this.setState(state => {
                return {
                    ...state,
                    employeeKpiSet: {
                        ...state.employeeKpiSet,
                        date: defaultTime,
                    }
                }
            })
        }
        
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: {
                    ...state.employeeKpiSet,
                    organizationalUnit: this.props.organizationalUnit,
                }
            }
        })
        var { employeeKpiSet } = this.state;
        if(employeeKpiSet.organizationalUnit  && employeeKpiSet.date && employeeKpiSet.approver){//&& employeeKpiSet.creater
            this.props.createEmployeeKpiSet(employeeKpiSet);
            window.$("#createEmployeeKpiSet").modal("hide");
        }
    }
    
    render() {
        let deans;
        const { organizationalUnit, user, translate } = this.props;
        const { _id } = this.state;
        if (user.userdepartments) {
            deans = getEmployeeSelectBoxItems([user.userdepartments], true, false, false);
        }

        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultTime =  [month, year].join('-');

        return (
            <React.Fragment>
                <DialogModal
                    modalID="createEmployeeKpiSet" isLoading={false}
                    formID="formCreateEmployeeKpiSet"
                    title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.initialize_kpi_set')}
                    msg_success={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.success')}
                    msg_faile={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.failure')}
                    func={this.handleCreateEmployeeKpiSet}
                    // disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="formCreateEmployeeKpiSet" onSubmit={() => this.handleCreateEmployeeKpiSet(translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.success'))}>
                        <div className="form-group">
                            <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.organizational_unit')}</label>
                            <label style={{ fontWeight: "400", marginLeft: "+2.5%" }}>{organizationalUnit && organizationalUnit.name}</label>
                        </div>

                        <div className="row">
                            <div className="col-sm-6 col-xs-12 form-group">
                                <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.month')}</label>
                                <DatePicker 
                                    id="month"      
                                    dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                    value={defaultTime}                 // giá trị mặc định cho datePicker    
                                    onChange={this.formatDate}
                                    disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                                />
                            </div>

                            {deans &&
                                <div className="col-sm-6 col-xs-12 form-group">
                                    <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}</label>
                                    <SelectBox
                                        id={`createEmployeeKpiSet${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={deans}
                                        multiple={false}
                                        onChange={this.handleApproverChange}
                                        value={this.state.employeeKpiSet.approver}
                                    />
                                </div>
                            }
                        </div>
                        <div className="form-group" >
                            <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.default_target')}</label>
                            <ul>
                                <li>Hỗ trợ thực hiện công việc</li>
                                <li>Phê duyệt công việc</li>
                            </ul>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user } = state;
    return { user };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    createEmployeeKpiSet: createKpiSetActions.createEmployeeKpiSet
};

const connectedModalCreateEmployeeKpiSet = connect( mapState, actionCreators )( withTranslate(ModalCreateEmployeeKpiSet)) ;
export { connectedModalCreateEmployeeKpiSet as ModalCreateEmployeeKpiSet };
