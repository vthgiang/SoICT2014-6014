import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { kpiMemberActions } from '../redux/actions';
import { DataTableSetting } from '../../../../../common-components';
import {DatePicker, SelectBox } from '../../../../../common-components/index';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { EmployeeKpiApproveModal } from './employeeKpiApproveModal';
import { EmployeeKpiEvaluateModal } from './employeeKpiEvaluateModal';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import { withTranslate } from 'react-redux-multilingual';

class EmployeeKpiManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commenting: false,
            user:null,
            status: -1,
            startDate: null,
            endDate: null,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                user: null,
                status: -1,
                startDate: null,
                endDate: null
            },
            showApproveModal: null,
            showEvaluateModal: null
        };
    }
    componentDidMount() {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        this.props.getAllKPIMemberOfUnit(this.state.infosearch);
    }
    formatDateBack(date) {
        let d = new Date(date), month, day, year;
        if(d.getMonth()===0){
            month = '' + 12;
            day = '' + d.getDate();
            year = d.getFullYear()-1;
        } else{
            month = '' + (d.getMonth()+1);
            day = '' + d.getDate();
            year = d.getFullYear();
        }
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
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

        return [month, year].join('-');
    }
    checkStatusKPI = (status) => {
        if (status === 0) {
            return "Đang thiết lập";
        } else if (status === 1) {
            return "Chờ phê duyệt";
        } else if (status === 2) {
            return "Đã kích hoạt";
        }
    }
    handleStartDateChange = (value) => {
        this.setState(state => {
                return {
                    ...state,
                    startDate: value,
                }
            });
        
    }
    handleEndDateChange = (value) => {
        this.setState(state => {
                return {
                    ...state,
                    endDate: value,
                }
            });
        
    }
    handleEmployeeChange =(value) => {
        this.setState(state => {
            return {
                ...state,
                user: value
            }
        });
    }
    handleStatusChange =(value) => {
        if(value === -1) value = null;
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        });
    }
    
    handleSearchData = async () => {
        if(this.state.startDate === "") this.state.startDate = null;
        if(this.state.endDate === "") this.state.endDate = null;
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    user: this.state.user,
                    status: this.state.status,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                },
                kpiId: null,
                employeeKpiSet: {_id: null},
            }
        })
        const { infosearch } = this.state;
        let startDate, endDate;
        let startdate = null, enddate = null;

        if(infosearch.startDate !== null) {
            startDate = infosearch.startDate.split("-");
            startdate = new Date(startDate[1], startDate[0], 0);
        }
        if (infosearch.endDate !== null){
            endDate = infosearch.endDate.split("-");
            enddate = new Date(endDate[1], endDate[0], 28);
        }
        const{ translate } = this.props;

        if (startdate && enddate && Date.parse(startdate) > Date.parse(enddate)) {
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'), 
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } 
        else {
            this.props.getAllKPIMemberOfUnit(infosearch);
        }
    }
    handleShowApproveModal = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                kpiId: id
            }
        })
        window.$(`modal-approve-KPI-member`).modal('show');
    }
    showEvaluateModal = async (item) => {
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: item
            }
        })
        window.$(`employee-kpi-evaluation-modal`).modal('show');
    }
    render() {
        const { user, kpimembers } = this.props;
        const { translate } = this.props;
        const {status, startDate, endDate} = this.state;
        let userdepartments, kpimember, unitMembers;
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (kpimembers.kpimembers) kpimember = kpimembers.kpimembers;
        if (userdepartments) {
            unitMembers = getEmployeeSelectBoxItems([userdepartments]);
            unitMembers = [{text:translate('kpi.evaluation.employee_evaluation.choose_employee'), value: "null"}, ...unitMembers[0].value];
        }
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-body qlcv">
                        <EmployeeKpiApproveModal id={this.state.kpiId} />
                        <EmployeeKpiEvaluateModal employeeKpiSet={this.state.employeeKpiSet}/>
                        <div className="form-inline">
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.employee')}:</label>
                                {unitMembers &&
                                <SelectBox 
                                    id={`employee-kpi-manage`}
                                    className="form-control"
                                    style={{width: "100%"}}
                                    items={unitMembers}
                                    onChange={this.handleEmployeeChange}
                                    value={user}
                                />}
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.status')}:</label>
                                <SelectBox 
                                    id={`status-kpi`}
                                    style={{width: "100%"}}
                                    items = {[
                                        {value: -1, text: translate('kpi.evaluation.employee_evaluation.choose_status')},
                                        {value: 0, text: translate('kpi.evaluation.employee_evaluation.establishing')},
                                        {value: 1, text: translate('kpi.evaluation.employee_evaluation.expecting')},
                                        {value: 2, text: translate('kpi.evaluation.employee_evaluation.activated')}
                                    ]}
                                    onChange={this.handleStatusChange}
                                    value={status}
                                />
                            </div>
                        </div>
                        <div className="form-inline">
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.from')}:</label>
                                <DatePicker
                                id='start_date'
                                value={startDate}
                                onChange={this.handleStartDateChange}
                                dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.to')}:</label>
                                <DatePicker
                                id='end_date'
                                value={endDate}
                                onChange={this.handleEndDateChange}
                                dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-success" onClick={()=> this.handleSearchData()}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>
                        </div>
                        
                        <DataTableSetting class="pull-right" tableId="kpiManagement" tableContainerId="tree-table-container" tableWidth="1300px"
                            columnArr={[ 
                                'STT' , 
                                'Thời gian' , 
                                'Tên nhân viên' , 
                                'Số lượng mục tiêu' , 
                                'Trạng thái KPI' , 
                                'Kết quả', 
                                'Phê duyệt' , 
                                'Đánh giá' ]} 
                                limit = {this.state.perPage} 
                                setLimit = {this.setLimit} 
                                hideColumnOption = {true} />
                        
                        <table id="kpiManagement" className="table table-hover table-bordered">
                        <thead>
                            <tr>
                            <th title="STT" style={{ width: "40px" }} className="col-fixed">STT</th>
                            <th title="Thời gian">{translate('kpi.evaluation.employee_evaluation.time')}</th>
                            <th title="Tên nhân viên">{translate('kpi.evaluation.employee_evaluation.name')}</th>
                            <th title="Số lượng mục tiêu">{translate('kpi.evaluation.employee_evaluation.num_of_kpi')}</th>
                            <th title="Trạng thái KPI">{translate('kpi.evaluation.employee_evaluation.kpi_status')}</th>
                            <th title="Kết quả">{translate('kpi.evaluation.employee_evaluation.result')}</th>
                            <th title="Phê duyệt" style={{textAlign: "center"}}>{translate('kpi.evaluation.employee_evaluation.approve')}</th>
                            <th title="Đánh giá">{translate('kpi.evaluation.employee_evaluation.evaluate')}</th>
                            </tr>
                        </thead>
                        <tbody className="task-table">
                            {(kpimember && kpimember.length !== 0) ?
                            kpimember.map((item, index) =>
                            <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item? this.formatDate(item.date): "Deleted"}</td>
                            <td>{item.creator? item.creator.name: "Deleted"}</td>
                            <td>{item.kpis? item.kpis.length: "Deleted"}</td>
                            <td>{item? this.checkStatusKPI(item.status): "Deleted"}</td>
                            <td>{item.approvedPoint === null? translate('kpi.evaluation.employee_evaluation.not_avaiable'): item.approvedPoint}</td>
                            <td style={{textAlign: "center"}}>
                                <a data-target={`#modal-approve-KPI-member`} onClick={()=> this.handleShowApproveModal(item._id)} data-toggle="modal" className="approve"
                                title={translate('kpi.evaluation.employee_evaluation.approve_this_kpi')}><i className="fa fa-bullseye"></i></a>
                            </td>
                            <td>
                                <a data-target={`#employee-kpi-evaluation-modal`} onClick={()=> this.showEvaluateModal(item)} data-toggle="modal"
                                className="copy" title={translate('kpi.evaluation.employee_evaluation.evaluate_this_kpi')}><i className="fa fa-list"></i></a>
                            </td>
                            </tr>
                            ) : <tr>
                            <td colSpan={8}>
                                <center>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</center>
                            </td>
                            </tr>}
                        </tbody>
                        </table>
                    </div>
                </div>
        </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, kpimembers,KPIPersonalManager } = state;
    return { user, kpimembers,KPIPersonalManager };
}
 
const actionCreators = {
    getAllUserSameDepartment : UserActions.getAllUserSameDepartment,
    getAllKPIMemberOfUnit: kpiMemberActions.getAllKPIMemberOfUnit,
    getAllKPIMember: kpiMemberActions.getAllKPIMemberByMember
};
const connectedKPIMember = connect(mapState, actionCreators)(withTranslate(EmployeeKpiManagement));
export { connectedKPIMember as EmployeeKpiManagement };