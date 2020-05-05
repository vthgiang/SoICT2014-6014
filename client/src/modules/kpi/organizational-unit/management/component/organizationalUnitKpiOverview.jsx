import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { managerActions } from '../redux/actions';
import { ModalDetailKPI } from './organizationalUnitKpiDetailModal';
import { ModalCopyKPIUnit } from './organizationalUnitKpiCopyModal';
import {PaginateBar, DataTableSetting } from '../../../../../common-components';

class KPIUnitManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModalCopy: "",
            currentRole: localStorage.getItem("currentRole")
        };
    }
    componentDidMount() {
        this.props.getDepartment();//localStorage.getItem('id')
        this.props.getAllKPIUnit(localStorage.getItem("currentRole"));
        this.handleResizeColumn();
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
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
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
        var listkpi, currentKPI, currentTargets, kpiApproved, datachat1, targetA, targetC, targetOther, misspoint;
        var unitList, currentUnit;
        const { department, managerKpiUnit } = this.props;
        
        if (department.unitofuser) {
            unitList = department.unitofuser;
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
                currentTargets =currentKPI[0].kpis.map(item => { return { y: item.weight, name: item.name } });
                datachat1 = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.result }
                }).reverse();
                targetA = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.listtarget[0].result }
                }).reverse();
                targetC = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: item.listtarget[1].result }
                }).reverse();
                targetOther = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (item.result - item.listtarget[0].result - item.listtarget[1].result) }
                }).reverse();
                misspoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.date), y: (100 - item.result) }
                }).reverse();
            };
            
        }
        return (
            <React.Fragment>
            <div className="box">
                <div className="box-body qlcv">
                    <DataTableSetting class="pull-right" tableId="tree-table" tableContainerId="tree-table-container"
                        tableWidth="1300px" columnArr={[ 'STT' ,'Người tạo', 'Thời gian' , 'Số lượng mục tiêu'
                        , 'Kết quả đánh giá' ,'Xem chi tiết' , 'Tạo KPI tháng mới' , 'Cập nhật' ]} limit={this.state.perPage}
                        setLimit={this.setLimit} hideColumnOption={true} />
                    <table id="example1" className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th title="STT">STT</th>
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
                                <td title={index+1}>{index + 1}</td>
                                <td>{item.creator.name}</td>
                                <td>{this.formatDate(item.date)}</td>
                                <td>{item.kpis.length}</td>
                                <td>{item.result}</td>
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
    const { department, managerKpiUnit } = state;
    return { department, managerKpiUnit };
}

const actionCreators = {
    getDepartment: DepartmentActions.getDepartmentOfUser,
    getAllKPIUnit: managerActions.getAllKPIUnit,
    refreshData: managerActions.evaluateKPIUnit
};
const connectedKPIUnitManager = connect(mapState, actionCreators)(KPIUnitManager);
export { connectedKPIUnitManager as KPIUnitManager };