import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from "../../../../super-admin/user/redux/actions"
import { createKpiSetActions  } from '../redux/actions';
import { DatePicker, DialogModal, SelectBox } from '../../../../../../src/common-components';
import { withTranslate } from 'react-redux-multilingual';

var translate='';
class ModalCreateEmployeeKpiSet extends Component {
    componentDidMount() {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
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
    // getCreater = async () => {
    //     const token = getStorage();
    //     const verified = await jwt.verify(token, TOKEN_SECRET);
    //     var id = verified._id;
    //     return id;
    // }

    // function: notification the result of an action

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
        let userdepartments=null, items;
        const { user } = this.props;
        let approver = null;
        if (user.userdepartments) userdepartments = user.userdepartments;

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

        if(this.state.employeeKpiSet.approver === null){
            if(userdepartments === null){
                approver = null;
            }
            else{    
                items = userdepartments.map(x => {
                    return { value: x.userId._id, text: x.userId.name } 
                });
                approver = items[0].value;
            }    
        }
        else{
            approver = this.state.employeeKpiSet.approver
        }
        
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: {
                    ...state.employeeKpiSet,
                    organizationalUnit: this.props.organizationalUnit,
                    approver: approver,
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
        var userdepartments, items;
        const { organizationalUnit, user, translate } = this.props;
        const { _id } = this.state;
        if (user.userdepartments) userdepartments = user.userdepartments;

        if(userdepartments === undefined) {
            items = [];
        } 
        else {
            items = userdepartments.map(x => {
                return { value: x.userId._id, text: x.userId.name }
            });
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
                            <lable style={{ fontWeight: "400", marginLeft: "+2.5%" }}>{organizationalUnit && organizationalUnit.name}</lable>
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

                            {userdepartments && (items.length !== 0) &&
                                <div className="col-sm-6 col-xs-12 form-group">
                                    <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}</label>
                                    <SelectBox
                                        id={`createEmployeeKpiSet${_id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={items}
                                        multiple={false}
                                        onChange={this.handleApproverChange}
                                        value={items[0]}
                                    />
                                </div>
                            }
                        </div>
                        <div className="form-group" >
                            <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.default_target')}</label>
                            <ul>
                                <li>Hỗ trợ đồng nghiệp các vấn đề chuyên môn (Vai trò C)</li>
                                <li>Hoàn thành nhiệm vụ phê duyệt (Vai trò A)</li>
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
