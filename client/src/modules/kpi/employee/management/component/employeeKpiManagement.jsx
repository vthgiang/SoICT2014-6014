import React, { Component } from 'react';
import { ModalDetailKPIPersonal } from './employeeKpiDetailModal';
import { connect } from 'react-redux';
import { managerKpiActions  } from '../redux/actions';
import Swal from 'sweetalert2';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { kpiMemberActions } from '../../../evaluation/employee-evaluation/redux/actions'
import CanvasJSReact from '../../../../../chart/canvasjs.react';
import { ModalCopyKPIPersonal } from './employeeKpiCopyModal';
import {PaginateBar, DataTableSetting } from '../../../../../common-components';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components/index';
import { kpiMemberServices } from '../../../evaluation/employee-evaluation/redux/services';

class KPIPersonalManager extends Component {
    // UNSAFE_componentWillMount() {
    //     this.props.getAllKPIPersonal();//localStorage.getItem("id")
    // }
    constructor(props) {
        super(props);
        this.state = {
            commenting: false,
            user:null,
            status:null,
            // startDate : this.formatDateBack(Date.now()),
            // endDate : this.formatDateBack(Date.now()),
            startDate: null,
            endDate: null,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                user: null,
                status: null,
                // startDate: this.formatDate(Date.now()),
                // endDate: this.formatDate(Date.now())
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
        } else if (status === 3) {
            return "Đã kết thúc";
        } else if (status === 4) {
            return "Đang hoạt động";
        } else if (status === 5) {
            return "Tất cả các trạng thái";
        }
    }
    handleStartDateChange = (value) => {
        // var value = e.target.value;
        this.setState(state => {
                return {
                    ...state,
                    startDate: value,
                }
            });
        
    }
    handleEndDateChange = (value) => {
        // var value = e.target.value;
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
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    user: this.state.user,
                    status: this.state.status,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                }
            }
        })
        const { infosearch } = this.state;
         
        // if (infosearch.role && infosearch.user && infosearch.status && infosearch.startDate && infosearch.endDate) {
            
            var startDate;
            var startdate=null;
            var endDate;
            var enddate=null;
            if(infosearch.startDate !== null) {startDate = infosearch.startDate.split("-");
            startdate = new Date(startDate[1], startDate[0], 0);}
            if (infosearch.endDate !== null){endDate= infosearch.endDate.split("-");
            enddate = new Date(endDate[1], endDate[0], 28);}
            // if(data.status) status= parseInt(data.status); 
        // var startDate = infosearch.startDate.split("-");
        //     var startdate = new Date(startDate[1], startDate[0], 0);
        //     var endDate = infosearch.endDate.split("-");
        //     var enddate = new Date(endDate[1], endDate[0], 28);
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
                console.log("========================goi den tim kiem")
                console.log("inforsearch", infosearch);
            }
        // }
    }
    render() {
        var kpipersonal;
        var userdepartments;
        const {status,employee,startDate, endDate} = this.state;
        var currentKPI, currentTargets, kpiApproved, systempoint, mypoint, approverpoint, targetA, targetC, targetOther, misspoint;
        const {  kpimembers, KPIPersonalManager, user } = this.props;
        if (user !== "undefined") userdepartments = user.userdepartments;
        if ( kpimembers !== "undefined") kpipersonal =  kpimembers.kpimembers;
        // if ( kpimembers !== "undefined") {
        //     kpipersonal =  kpimembers.kpimembers;
        //     if (typeof kpipersonal !== "undefined" && kpipersonal.length !== 0) {//kpipersonal.content
        //         kpiApproved = kpipersonal.filter(item => item.status === 3);
        //         currentKPI = kpipersonal.filter(item => item.status !== 3);
        //         currentTargets = currentKPI[0].kpis.map(item => { return { y: item.weight, name: item.name } });
        //         systempoint = kpiApproved.map(item => {
        //             return { label: this.formatDate(item.time), y: item.systempoint }
        //         }).reverse();
        //         mypoint = kpiApproved.map(item => {
        //             return { label: this.formatDate(item.time), y: item.mypoint }
        //         }).reverse();
        //         approverpoint = kpiApproved.map(item => {
        //             return { label: this.formatDate(item.time), y: item.approverpoint }
        //         }).reverse();
        //         targetA = kpiApproved.map(item => {
        //             return { label: this.formatDate(item.time), y: item.kpis[0].approverpoint }
        //         }).reverse();
        //         targetC = kpiApproved.map(item => {
        //             return { label: this.formatDate(item.time), y: item.kpis[1].approverpoint }
        //         }).reverse();
        //         targetOther = kpiApproved.map(item => {
        //             return { label: this.formatDate(item.time), y: (item.approverpoint - item.kpis[0].approverpoint - item.kpis[1].approverpoint) }
        //         }).reverse();
        //         misspoint = kpiApproved.map(item => {
        //             return { label: this.formatDate(item.time), y: (100 - item.approverpoint) }
        //         }).reverse();
        //     }
        // }
        let unitMembers;
        if (userdepartments) {
            unitMembers = [
                {
                    // text: "Chọn nhân viên",
                    value: [{text:"--Chọn nhân viên--", value: "null"}]
                },
                // {
                //     text: userdepartments.roles.dean.name,
                //     value: userdepartments.deans.map(item => {return {text: item.name, value: item._id}})
                // },
                // {
                //     text: userdepartments.roles.viceDean.name,
                //     value: userdepartments.viceDeans.map(item => {return {text: item.name, value: item._id}})
                // },
                {
                    // text: userdepartments.roles.employee.name,
                    value: userdepartments.employees.map(item => {return {text: item.name, value: item._id}})
                },
            ]
        }
        return (
            <div className="box">
                <div className="box-body qlcv">
                <div className="form-inline">
                            <div className="form-group">
                                
                                <label>Nhân viên:</label>
                                {/* { <select defaultValue="all" className="form-control" ref={input=> this.user = input}>
                            <option value="all">Tất cả nhân viên</option>
                            <option value="all">Nhân viên phòng hành chính</option>
                            <option value="all">Nhân viên phòng giao dịch</option> */}
                            {/* <optgroup label={userdepartments[1].roleId.name}>
                                <option key={userdepartments[1].userId._id} value={userdepartments[1].userId._id}>
                                {userdepartments[1].userId.name}</option>
                            </optgroup>
                            <optgroup label={userdepartments[2].roleId.name}>
                                <option key={userdepartments[2].userId._id} value={userdepartments[2].userId._id}>
                                {userdepartments[2].userId.name}</option> */}
                            {/* </optgroup> */}
                            {/* </select>} */}
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
                                        {value:2, text : "Đã kích hoạt"},
                                        {value:3, text : "Đã kết thúc"},
                                        {value:4, text : "Đang hoạt động"},
                                        {value:5, text : "Tất cả các trạng thái"},]}
                                    // items = {items}
                                    onChange={this.handleStatusChange}
                                    // multiple={true}
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
                            <button type="button" className="btn btn-success" onClick={()=> this.handleSearchData()}>Tìm
                                kiếm</button>
                            </div>

                        </div>

                        </div>
                                <DataTableSetting class="pull-right" tableId="kpiEmployeeManagement" tableContainerId="tree-table-container" tableWidth="1300px"
                                                columnArr={[ 
                                                    'STT' ,
                                                    'Thời gian' , 
                                                    'Số lượng mục tiêu' , 
                                                    'Hệ thống đánh giá' ,
                                                    'Kết quả tự đánh giá' ,
                                                    'Quản lý đánh giá',
                                                    'Hành động']} 
                                                limit={this.state.perPage} 
                                                setLimit={this.setLimit} 
                                                hideColumnOption={true} />

                                                {/* <table id="kpiEmployeeManagement" className="table table-hover table-bordered"></table> */}
                                                <table id="kpiEmployeeManagement" className="table table-hover table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th title="STT" style={{ width: "20px" }}>STT</th>
                                                            <th title="Thời gian">Thời gian</th>
                                                            <th title="Số lượng mục tiêu">Số lượng mục tiêu</th>
                                                            <th title="Hệ thống đánh giá">Hệ thống đánh giá</th>
                                                            <th title="Kết quả tự đánh giá">Kết quả tự đánh giá</th>
                                                            <th title="Quản lý đánh giá">Quản lý đánh giá</th>
                                                            <th title="Hành động">Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                            {(typeof kpipersonal !== "undefined" && kpipersonal.length !== 0) ?
                                                kpipersonal.map((item, index) =>
                                                    <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td>{this.formatDate(item.date)}</td>
                                                        <td>{item.kpis.length}</td>
                                                        <td>{item.automaticPoint === null ? "Chưa đánh giá" : item.automaticPoint}</td>
                                                        <td>{item.employeePoint === null ? "Chưa đánh giá" : item.employeePoint}</td>
                                                        <td>{item.approvedPoint === null ? "Chưa đánh giá" : item.approvedPoint}</td>
                                                        <td>
                                                            <a href={`#detailKPIPersonal${item._id}`} data-toggle="modal" data-backdrop="static" data-keyboard="false" title="Xem chi tiết KPI tháng này" ><i className="material-icons">view_list</i></a>
                                                            <ModalDetailKPIPersonal kpipersonal={item} />
                                                            {<a href="#abc" onClick={() => this.showModalCopy(item._id)} className="copy" data-toggle="modal" data-backdrop="static" data-keyboard="false" title="Thiết lập kpi tháng mới từ kpi tháng này"><i className="material-icons">content_copy</i></a>}
                                                            {this.state.showModalCopy === item._id ? <ModalCopyKPIPersonal kpipersonal={item} /> : null}
                                                        </td>
                                                    </tr>) : null
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            // </div>
        )
    }

}

function mapState(state) {
    const { user,kpimembers ,KPIPersonalManager } = state;
    return {user, kpimembers,  KPIPersonalManager };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getAllKPIPersonal: managerKpiActions .getAllKPIPersonalByMember,
    getAllKPIMemberOfUnit: kpiMemberActions.getAllKPIMemberOfUnit,
    getAllKPIMember: kpiMemberActions.getAllKPIMemberByMember
};
const connectedKPIPersonalManager = connect(mapState, actionCreators)(KPIPersonalManager);
export { connectedKPIPersonalManager as KPIPersonalManager };