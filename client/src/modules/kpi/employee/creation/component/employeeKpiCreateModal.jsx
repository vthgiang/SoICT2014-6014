import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from "../../../../super-admin/user/redux/actions"
import { createKpiSetActions  } from '../redux/actions';
import { DatePicker, DialogModal } from '../../../../../../src/common-components';
import { withTranslate } from 'react-redux-multilingual';

var translate='';
class ModalCreateEmployeeKpiSet extends Component {
    constructor(props) {
        super(props);
        translate = this.props.translate;
        this.state = {
            employeeKpiSet: {
                organizationalUnit: "",
                // creater: this.getCreater(), //localStorage.getItem("id"),
                approver: "",
                time: "",
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

    componentDidMount() {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    formatDate = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: {
                    ...state.employeeKpiSet,
                    time: value
                }
            }
        })
    }

    //chu
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

        if(this.state.employeeKpiSet.time === ""){
            await this.setState(state => {
                return {
                    ...state,
                    employeeKpiSet: {
                        ...state.employeeKpiSet,
                        time: defaultTime,
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
                    approver: this.approver.value,
                }
            }
        })
        var { employeeKpiSet } = this.state;
        if(employeeKpiSet.organizationalUnit  && employeeKpiSet.time && employeeKpiSet.approver){//&& employeeKpiSet.creater
            this.props.createEmployeeKpiSet(employeeKpiSet);
            window.$("#createEmployeeKpiSet").modal("hide");
        }
    }
    
    render() {
        var userdepartments;
        const { organizationalUnit, user, translate } = this.props;
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

        return (
            <React.Fragment>
                <DialogModal
                    modalID="createEmployeeKpiSet" isLoading={false}
                    formID="formCreateEmployeeKpiSet"
                    title={translate('employee_kpi_set.create_employee_kpi_set_modal.initialize_kpi_set')}
                    msg_success={translate('employee_kpi_set.create_employee_kpi_set_modal.success')}
                    msg_faile={translate('employee_kpi_set.create_employee_kpi_set_modal.failure')}
                    func={this.handleCreateEmployeeKpiSet}
                    // disableSubmit={!this.isFormValidated()}
                >
                    <form id="formCreateEmployeeKpiSet" onSubmit={() => this.handleCreateEmployeeKpiSet(translate('employee_kpi_set.create_employee_kpi_set_modal.success'))}>
                        <div className="form-group">
                            <label className="col-sm-3">{translate('employee_kpi_set.create_employee_kpi_set_modal.organizational_unit')}</label>
                            <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{organizationalUnit && organizationalUnit.name}</label>
                        </div>
                        
                        <div className="form-group">
                            <label className="col-sm-3">{translate('employee_kpi_set.create_employee_kpi_set_modal.month')}</label>
                            <DatePicker
                                id="month"      
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={defaultTime}                 // giá trị mặc định cho datePicker    
                                onChange={this.formatDate}
                                disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                            />
                        </div>

                        <div className="form-group">
                                <label className="col-sm-3">{translate('employee_kpi_set.create_employee_kpi_set_modal.approver')}</label>
                                <div className="input-group col-sm-9" style={{ width: "60%" }}>
                                    {userdepartments && 
                                        <select defaultValue={userdepartments[0].userId._id} ref={input => this.approver = input} className="form-control select2">
                                            <optgroup label={userdepartments[0].roleId.name}>
                                                <option key={userdepartments[0].userId._id} value={userdepartments[0].userId._id}>{userdepartments[0].userId.name}</option>
                                            </optgroup>
                                            <optgroup label={userdepartments[1].roleId.name}>
                                                <option key={userdepartments[1].userId._id} value={userdepartments[1].userId._id}>{userdepartments[1].userId.name}</option>
                                            </optgroup>
                                        </select>
                                    }
                                </div>
                            </div>

                            <div className="form-group" >
                                <label className="col-sm-12">{translate('employee_kpi_set.create_employee_kpi_set_modal.default_target')}</label>
                                <ul>
                                    <li>Hỗ trợ đồng nghiệp các vấn đề chuyên môn (Vai trò C)</li>
                                    <li>Hoàn thành nhiệm vụ phê duyệt (Vai trò A)</li>
                                </ul>
                            </div>

                    </form>
                </DialogModal>
            </React.Fragment>

            // <div className="modal fade" id="CreateEmployeeKpiSet">
            //     <div className="modal-dialog">
            //         <div className="modal-content">
            //             <div className="modal-header">
            //                 <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
            //                 <h3 className="modal-title">{translate('employee_kpi_set.start.initialize_kpi')}</h3>
            //             </div>
            //             <div className="modal-body">
            //                 <form className="form-horizontal">


            //                     <div className="form-group">
            //                         <label className="col-sm-3">{translate('employee_kpi_set.start.unit')}</label>
            //                         <p className="col-sm-9">{unit && unit.name}</p>
            //                     </div>

            //                     <div className="form-group">
            //                         <label className="col-sm-3">{translate('employee_kpi_set.start.month')}</label>
            //                         <div className="input-group col-sm-9 date has-feedback" style={{ width: "60%" }}>
            //                             <div className="input-group-addon">
            //                                 <i className="fa fa-calendar"/>
            //                             </div>
            //                             <input type="text" className="form-control" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
            //                         </div>
            //                     </div>

            //                     <div className="form-group">
            //                         <label className="col-sm-3">{translate('employee_kpi_set.start.approver')}</label>
            //                         <div className="input-group col-sm-9" style={{ width: "60%" }}>
            //                             {userdepartments && 
            //                                 <select defaultValue={userdepartments[0].userId._id} ref={input => this.approver = input} className="form-control select2">
            //                                     <optgroup label={userdepartments[0].roleId.name}>
            //                                         <option key={userdepartments[0].userId._id} value={userdepartments[0].userId._id}>{userdepartments[0].userId.name}</option>
            //                                     </optgroup>
            //                                     <optgroup label={userdepartments[1].roleId.name}>
            //                                         <option key={userdepartments[1].userId._id} value={userdepartments[1].userId._id}>{userdepartments[1].userId.name}</option>
            //                                     </optgroup>
            //                                 </select>
            //                             }
            //                             {/* {userdepartments && <select defaultValue={userdepartments[0].userId[0]._id} ref={input => this.approver = input} className="form-control select2" style={{ width: '100%' }}>
            //                                 <optgroup label={userdepartments[0].roleId.name}>
            //                                     {userdepartments[0].userId.map(x => {
            //                                         return <option key={x._id} value={x._id}>{x.name}</option>
            //                                     })}
            //                                 </optgroup>
            //                                 <optgroup label={userdepartments[1].roleId.name}>
            //                                     {userdepartments[1].userId.map(x => {
            //                                         return <option key={x._id} value={x._id}>{x.name}</option>
            //                                     })}
            //                                 </optgroup>
            //                             </select>} */}
            //                         </div>
            //                     </div>
            //                     <div className="form-group" >
            //                         <label className="col-sm-12">{translate('employee_kpi_set.start.default_target')}</label>
            //                         <ul>
            //                             <li>Hỗ trợ đồng nghiệp các vấn đề chuyên môn (Vai trò C)</li>
            //                             <li>Hoàn thành nhiệm vụ phê duyệt (Vai trò A)</li>
            //                         </ul>
            //                     </div>
            //                 </form>
            //             </div>
            //             <div className="modal-footer">
            //                 <button className="btn btn-success" onClick={(event)=>this.handleCreateKPIPersonal(event, unit&&unit._id)}>{translate('employee_kpi_set.start.initialize')}</button>
            //                 <button type="cancel" className="btn btn-primary" data-dismiss="modal">{translate('employee_kpi_set.start.cancel')}</button>
            //             </div>
            //         </div>
            //     </div>
            // </div>
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
