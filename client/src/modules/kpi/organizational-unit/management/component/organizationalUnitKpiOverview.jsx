import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { managerActions } from '../redux/actions';
import { ModalDetailKPI } from './organizationalUnitKpiDetailModal';
import { ModalCopyKPIUnit } from './organizationalUnitKpiCopyModal';
import {PaginateBar, DataTableSetting,DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import Swal from 'sweetalert2';

class KPIUnitManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModalCopy: "",
            currentRole: localStorage.getItem("currentRole"),
            status: 3,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                status: 3,
                startDate: this.formatDate(Date.now()),
                endDate: this.formatDate(Date.now())
            },
        };
    }
    componentDidMount() {
        this.props.getDepartment();//localStorage.getItem('id')
        this.props.getAllKPIUnit(localStorage.getItem("currentRole"));
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    }
    componentDidUpdate() {
        if (this.state.currentRole !== localStorage.getItem('currentRole')) {
            this.props.getAllKPIUnit(localStorage.getItem("currentRole"));
            this.setState(state => {
                return {
                    ...state,
                    currentRole: localStorage.getItem('currentRole')
                }
            })
        }
    }
    handleStartDateChange = (value) => {
        // var value = e.target.value;
        this.setState(state => {
                return {
                    ...state,
                    //errorOnDate: this.validateDate(value),
                    startDate: value,
                }
            });
        
    }
    handleEndDateChange = (value) => {
        // var value = e.target.value;
        this.setState(state => {
                return {
                    ...state,
                    //errorOnDate: this.validateDate(value),
                    endDate: value,
                }
            });
        
    }
    handleUser= (value) => {
        this.setState(state =>{
            return {
                ...state,
                userkpi: value,
            }
        })
    }
    handleStatus= async (value) => {
        await this.setState(state =>{
            return {
                ...state,
                status: value
            }
        })
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
    handleSearchData = async () => {
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    status: this.state.status[0],
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                }
            }
        })
        const { infosearch } = this.state;
        console.log("inforsearch", infosearch);
        if (infosearch.role && infosearch.status && infosearch.startDate && infosearch.endDate) {
            var startDate = infosearch.startDate.split("-");
            var startDate =new Date(startDate[1], startDate[0]);
            var endDate = infosearch.endDate.split("-");
            var endDate = new Date(endDate[1], endDate[0]);
            if (Date.parse(startDate) > Date.parse(endDate)) {
                Swal.fire({
                    title: "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Xác nhận'
                })
            } else {
                this.props.getKPIUnits(infosearch);
            }
        }
    };
    showModalCopy = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showModalCopy: id
            }
        })
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        var modal = document.getElementById(`copyOldKPIToNewTime${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }
    checkPermisson = (deanCurrentUnit) => {
        var currentRole = localStorage.getItem("currentRole");
        return (currentRole === deanCurrentUnit);
    }
    render() {
        const{startDate, endDate, status, errorOnDate, infosearch}= this.state;
        var listkpi, currentKPI, currentTargets, kpiApproved, datachat1, targetA, targetC, targetOther, misspoint;
        var unitList, currentUnit, userdepartments;
        const { user, managerKpiUnit } = this.props;
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (user.organizationalUnitsOfUser) {
            unitList = user.organizationalUnitsOfUser;
            currentUnit = unitList.filter(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);
        }
        if (managerKpiUnit.kpis) {
            listkpi = managerKpiUnit.kpis;
            if(typeof listkpi !== "undefined" && listkpi.length !== 0)//listkpi.content
            {
                kpiApproved = listkpi.filter(item => item.status === 2);
                currentKPI = listkpi.filter(item => item.status !== 2);
                // currentTargets =currentKPI[0].kpis.map(item => { return { y: item.weight, name: item.name } });
                //  console.log("+++++", currentKPI[0].kpis)
                datachat1 = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.result }
                }).reverse();
                targetA = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.kpis[0].result }
                }).reverse();
                targetC = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.kpis[1].result }
                }).reverse();
                targetOther = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (item.result - item.kpis[0].result - item.kpis[1].result) }
                }).reverse();
                misspoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (100 - item.result) }
                }).reverse();
            };
            
        }
       // console.log("listkpi---", listkpi);
        return (
            <React.Fragment>
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                            <label>Từ tháng:</label>
                            <DatePicker
                                id="start_date"
                                value={startDate}
                                onChange={this.handleStartDateChange}
                                dateFormat="month-year"
                            />
                            <ErrorLabel content={errorOnDate} />
                        </div>
                        <div className="form-group">
                            <label>Đến tháng:</label>
                            <DatePicker
                                id="end_date"
                                value={endDate}
                                onChange={this.handleEndDateChange}
                                dateFormat="month-year"
                            />
                            <ErrorLabel content={errorOnDate} />
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            
                            <label>Trạng thái:</label>
                            {
                                <SelectBox
                                
                                    id={`select-status-kpi`}
                                    className="form-control select2"
                                    items = {[{value: 3, text: 'Tất cả trạng thái'} ,{ value: 2, text: 'Đã kết thúc' }, { value: 1, text: 'Đang hoạt động' } ]}
                                    onChange={this.handleStatus}
                                    style={{width: "100%"}}
                                    value={status}
                                    // multiple={true}
                                />
                            }
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={()=> this.handleSearchData()}>Tìm kiếm</button>
                        </div>
                    </div>

                    <DataTableSetting class="pull-right" tableId="kpiTable" tableContainerId="kpiTableContainer" tableWidth="1300px"
                        columnArr={['Người tạo', 'Thời gian', 'Số lượng mục tiêu', 'Kết quả đánh giá', 'Xem chi tiết', 'Tạo KPI tháng mới', 'Cập nhật' ]}
                        limit={this.state.perPage}
                        setLimit={this.setLimit} hideColumnOption={true} />
                    
                    <table id="kpiTable" className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th title="Người tạo">Người tạo</th>
                                <th title="Thời gian">Thời gian</th>
                                <th title="Số lượng mục tiêu">Số lượng mục tiêu</th>
                                <th title="Kết quả đánh giá">Kết quả đánh giá</th>
                                <th title="Xem chi tiết" style={this.checkPermisson(currentUnit && currentUnit[0].dean)? {} :
                                    {}}>Xem chi tiết</th>
                                <th tittle="Tạo KPI tháng mới" style={this.checkPermisson(currentUnit && currentUnit[0].dean)?
                                    {} : {}}>Tạo KPI tháng mới</th>
                                <th tittle="Cập nhật" style={this.checkPermisson(currentUnit && currentUnit[0].dean)? {} : {}}>
                                    Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            (typeof listkpi !== "undefined" && listkpi.length !== 0) ?
                            listkpi.map((item, index) =>
                            <tr key={index+1}>
                                <td>{item.creator.name}</td>
                                <td>{this.formatDate(item.date)}</td>
                                <td>{item.kpis.length}</td>
                                <td>{item.result=== null ? "Chưa đánh giá" : item.result}</td>
                                <td>
                                    <a href={`#dataResultTask${item._id}`} data-toggle="modal" data-backdrop="static"
                                        data-keyboard="false" title="Xem chi tiết KPI tháng này"><i
                                            className="material-icons">view_list</i></a>
                                    <ModalDetailKPI kpiunit={item} />
                                </td>
                                <td>{this.checkPermisson(currentUnit && currentUnit[0].dean) && <a href="#abc" onClick={()=>
                                        this.showModalCopy(item._id)} className="copy" data-toggle="modal"
                                        data-backdrop="static" data-keyboard="false" title="Thiết lập kpi tháng mới từ kpi tháng
                                        này"><i className="material-icons">content_copy</i></a>}
                                    {this.state.showModalCopy === item._id ?
                                    <ModalCopyKPIUnit kpiunit={item} /> : null}
                                </td>
                                <td>
                                    {this.checkPermisson(currentUnit && currentUnit[0].dean) && item.status === 1 ? <a
                                        style={{ color: "navy" }} href="#abc" onClick={()=> this.props.refreshData(item._id)}
                                        title="Cập nhật kết quả mới nhất của KPI này" ><i
                                            className="material-icons">refresh</i></a> : null}
                                </td>
                            </tr>) : <tr>
                                <td colSpan={8}>
                                    <center>Không có dữ liệu</center>
                                </td>
                            </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user, managerKpiUnit } = state;
    return { user, managerKpiUnit };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getDepartment: UserActions.getDepartmentOfUser,
    getAllKPIUnit: managerActions.getAllKPIUnit,
    refreshData: managerActions.evaluateKPIUnit,
    getKPIUnits: managerActions.getKPIUnits,
};
const connectedKPIUnitManager = connect(mapState, actionCreators)(KPIUnitManager);
export { connectedKPIUnitManager as KPIUnitManager };