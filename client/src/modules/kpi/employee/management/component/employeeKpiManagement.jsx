import React, { Component } from 'react';
import { ModalDetailKPIPersonal } from './employeeKpiDetailModal';
import { connect } from 'react-redux';
import { managerKpiActions  } from '../redux/actions';
import CanvasJSReact from '../../../../../chart/canvasjs.react';
import { ModalCopyKPIPersonal } from './employeeKpiCopyModal';
import {PaginateBar, DataTableSetting } from '../../../../../common-components';

class KPIPersonalManager extends Component {
    UNSAFE_componentWillMount() {
        this.props.getAllKPIPersonal();//localStorage.getItem("id")
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '../lib/main/js/Table.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    constructor(props) {
        super(props);
        this.state = {
            showModalCopy: ""
        };
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

    render() {
        var listkpi;
        var currentKPI, currentTargets, kpiApproved, systempoint, mypoint, approverpoint, targetA, targetC, targetOther, misspoint;
        const {  KPIPersonalManager } = this.props;
        if ( KPIPersonalManager.kpipersonals) {
            listkpi =  KPIPersonalManager.kpipersonals;
            if (typeof listkpi !== "undefined" && listkpi.length !== 0) {//listkpi.content
                kpiApproved = listkpi.filter(item => item.status === 3);
                currentKPI = listkpi.filter(item => item.status !== 3);
                currentTargets = currentKPI[0].kpis.map(item => { return { y: item.weight, name: item.name } });
                systempoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: item.systempoint }
                }).reverse();
                mypoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: item.mypoint }
                }).reverse();
                approverpoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: item.approverpoint }
                }).reverse();
                targetA = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: item.kpis[0].approverpoint }
                }).reverse();
                targetC = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: item.kpis[1].approverpoint }
                }).reverse();
                targetOther = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: (item.approverpoint - item.kpis[0].approverpoint - item.kpis[1].approverpoint) }
                }).reverse();
                misspoint = kpiApproved.map(item => {
                    return { label: this.formatDate(item.time), y: (100 - item.approverpoint) }
                }).reverse();
            }
        }
        return (
            <div className="box">
                <div className="box-body qlcv">

                {/* <div className="content-wrapper"> */}
                {/* <section className="content-header">
                        <h1>
                            Tổng quan KPI cá nhân
                        </h1>
                        <ol className="breadcrumb">
                            <li><a href="/"><i className="fa fa-dashboard" /> Home</a></li>
                            <li><a href="/">Forms</a></li>
                            <li className="active">Advanced Elements</li>
                        </ol>
                    </section> */}
                {/* <section className="content"> */}
                    {/* <div className="row"> */}
                            {/* <div className="box"> */}
                                <div className="col-sm-12" style={{ fontWeight: "500" }}>
                                    <h3 className="box-title">Bảng thống kê kpi cá nhân hàng tháng</h3>
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
                                            {(typeof listkpi !== "undefined" && listkpi.length !== 0) ?
                                                listkpi.map((item, index) =>
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
                            </div>
                        // </div>
                    // </div>
                                        
            //     </div>
            //     {/* </section> */}
            //     {/* </div> */}
            // </div>
        )
    }

}

function mapState(state) {
    const {  KPIPersonalManager } = state;
    return {  KPIPersonalManager };
}

const actionCreators = {
    getAllKPIPersonal: managerKpiActions .getAllKPIPersonalByMember
};
const connectedKPIPersonalManager = connect(mapState, actionCreators)(KPIPersonalManager);
export { connectedKPIPersonalManager as KPIPersonalManager };