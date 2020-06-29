import React, { Component } from 'react';

import { connect } from 'react-redux';

import Swal from 'sweetalert2';

import { kpiMemberActions } from '../redux/actions';
import {PaginateBar, DataTableSetting } from '../../../../../common-components';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components/index';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions' ;
import { UserActions } from "../../../../super-admin/user/redux/actions";
import {
    getStorage
} from '../../../../../config';
import { ModalMemberApprove } from './employeeKpiApproveModal';
import { Comments } from './employeeKpiComment';
import { ModalMemberEvaluate } from './employeeKpiEvaluateModal';

import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';

// import { withTranslate } from 'react-redux-multilingual';
 
class KPIMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commenting: false,
            user:null,
            status:null,
            startDate: null,
            endDate: null,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                user: null,
                status: null,
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
        var d = new Date(date), month, day, year;
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
        var d = new Date(date),
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
            var startDate;
            var endDate;
            var startdate=null;
            var enddate=null;
            
            if(infosearch.startDate !== null) {startDate = infosearch.startDate.split("-");
            startdate = new Date(startDate[1], startDate[0], 0);}
            if (infosearch.endDate !== null){endDate= infosearch.endDate.split("-");
            enddate = new Date(endDate[1], endDate[0], 28);}
   
            if (startdate && enddate && Date.parse(startdate) > Date.parse(enddate)) {
                Swal.fire({
                    title: "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
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
        var userdepartments, kpimember;
        const { user, kpimembers } = this.props;
        const {status,employee,startDate, endDate} = this.state;

        if (user.userdepartments) userdepartments = user.userdepartments;
        if (kpimembers.kpimembers) kpimember = kpimembers.kpimembers;

        let unitMembers;
        if (userdepartments) {
            unitMembers = getEmployeeSelectBoxItems([userdepartments]);
            unitMembers = [{text:"--Chọn nhân viên--", value: "null"}, ...unitMembers[0].value];
        }

        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-body qlcv">
                        <ModalMemberApprove id={this.state.kpiId} />
                        <ModalMemberEvaluate employeeKpiSet={this.state.employeeKpiSet}/>

                        <div className="form-inline">
                            <div className="form-group">
                                <label>Nhân viên:</label>
                                {unitMembers &&
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`employee-kpi-manage`}
                                    className="form-control"
                                    style={{width: "100%"}}
                                    items={unitMembers}
                                    onChange={this.handleEmployeeChange}
                                    // multiple={true}
                                    value={user}
                                />}
                            </div>
                            <div className="form-group">
                                <label>Trạng thái:</label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`status-kpi`}
                                    // className="form-control"
                                    style={{width: "100%"}}
                                    items = {[
                                        {value:"null", text : "--Chọn trạng thái--"},
                                        {value:0, text : "Đang thiết lập"},
                                        {value:1, text : "Chờ phê duyệt"},
                                        {value:2, text : "Đã kích hoạt"},]}
                                    onChange={this.handleStatusChange}
                                    value={status}
                                />
                            </div>
                        </div>

                        <div className="form-inline">
                            <div className="form-group">
                                <label>Từ tháng:</label>
                                <DatePicker
                                id='start_date'
                                
                                value = {startDate}
                                onChange={this.handleStartDateChange}
                                dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <label>Đến tháng:</label>
                                <DatePicker
                                id='end_date'
                               
                                value = {endDate}
                                onChange={this.handleEndDateChange}
                                dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                    <button type="button" className="btn btn-success" onClick={()=> this.handleSearchData()}>Tìm kiếm</button>
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
                            limit={this.state.perPage} 
                            setLimit={this.setLimit} 
                            hideColumnOption={true} />
                        
                        <table id="kpiManagement" className="table table-hover table-bordered">
                        <thead>
                            <tr>
                            <th title="STT" style={{ width: "40px" }} className="col-fixed">STT</th>
                            <th title="Thời gian">Thời gian</th>
                            <th title="Tên nhân viên">Tên nhân viên</th>
                            <th title="Số lượng mục tiêu">Số lượng mục tiêu</th>
                            <th title="Trạng thái KPI">Trạng thái Kpi</th>
                            <th title="Kết quả">Kết quả</th>
                            <th title=">Phê duyệt" style={{textAlign: "center"}}>Phê duyệt</th>
                            <th title="Đánh giá">Đánh giá</th>
                            </tr>
                        </thead>
                        <tbody className="task-table">
                            {(typeof kpimember !== "undefined" && kpimember.length !== 0) ?
                            kpimember.map((item, index) =>
                            <tr key={index + 1}>
                            <td title={index+1}>{index + 1}</td>
                            <td title={this.formatDate(item.date)}>{this.formatDate(item.date)}</td>
                            <td title="">{item.creator.name}</td>
                            <td title="">{item.kpis.length}</td>
                            <td title="">{this.checkStatusKPI(item.status)}</td>
                            <td title="">{item.approvedPoint === null ? "Chưa đánh giá" : item.approvedPoint}</td>
                            
                            <td style={{textAlign: "center"}}>
                                <a data-target={`#modal-approve-KPI-member`} onClick={()=> this.handleShowApproveModal(item._id)} data-toggle="modal" className="approve"
                                title="Phê duyệt kpi nhân viên này"><i className="fa fa-bullseye"></i></a>
                            </td>
                            <td>
                                <a data-target={`#employee-kpi-evaluation-modal`} onClick={()=> this.showEvaluateModal(item)} data-toggle="modal"
                                className="copy" title="Đánh giá kpi nhân viên này"><i className="fa fa-list"></i></a>
                                {/* {this.state.showEvaluateModal === item._id ?
                                <ModalMemberEvaluate name={item.creator.name} employeeId={item.creator._id} id={item._id} date={item.date}/> : null} */}
                            </td>
                            </tr>
                            ) : <tr>
                            <td colSpan={8}>
                                <center>Không có dữ liệu</center>
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
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getAllKPIMemberOfUnit: kpiMemberActions.getAllKPIMemberOfUnit,
    getAllKPIMember: kpiMemberActions.getAllKPIMemberByMember
};
const connectedKPIMember = connect(mapState, actionCreators)(KPIMember);
export { connectedKPIMember as KPIMember };