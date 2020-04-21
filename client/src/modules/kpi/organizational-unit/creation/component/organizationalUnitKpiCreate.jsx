import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUnitKpiActions } from '../redux/actions.js';
import { DepartmentActions} from '../../../../super-admin/organizational-unit/redux/actions';
import { ModalAddTargetKPIUnit } from './organizationalUnitKpiAddTargetModal';
import { ModalStartKPIUnit } from './organizationalUnitKpiCreateModal';
import Swal from 'sweetalert2';
import { ModalEditTargetKPIUnit } from './organizationalUnitKpiEditTargetModal';

//
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withTranslate } from 'react-redux-multilingual';

// hàm để chuyển sang song ngữ
var translate = '';

class KPIUnitCreate extends Component {
    componentDidMount() {
        // get department list of company
        
        this.props.getDepartment();
        this.props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
        this.props.getKPIParent(localStorage.getItem('currentRole'));
    }
    componentDidUpdate() {
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        if (this.state.currentRole !== localStorage.getItem('currentRole')) {
            this.props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
            this.setState(state => {
                return {
                    ...state,
                    currentRole: localStorage.getItem('currentRole')
                }
            })
        }
    }
    constructor(props) {
        super(props);   translate = this.props.translate;
        this.state = {
            kpiunit: {
                unit: "",
                time: this.formatDate(Date.now()),
                creater: ""     //localStorage.getItem("id")
            },
            adding: false,
            editing: false,
            submitted: false,
            currentRole: localStorage.getItem("currentRole")
        };

    }

    // function: notification the result of an action
    notifysuccess = (message) => toast.success(message, {containerId: 'toast-notification'});
    notifyerror = (message) => toast.error(message, {containerId: 'toast-notification'});
    notifywarning = (message) => toast.warning(message, {containerId: 'toast-notification'});

    handleEditKPi = async () => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing,
            }
        })
    }
    saveEdit = async (id, unit) => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing,
                kpiunit: {
                    ...state.kpiunit,
                    unit: unit,
                    time: this.time.value,
                }
            }
        })
        var { kpiunit } = this.state;
        if (kpiunit.unit && kpiunit.time ) {//&& kpiunit.creater
            this.props.editKPIUnit(id, kpiunit);

            this.notifysuccess(translate('kpi_unit_create.edit_success'));
        }
        else{
            this.notifyerror(translate('kpi_unit_create.error'));
        }
    }
    cancelEdit = async () => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing
            }
        })
    }
    cancelKPIUnit = (event, id, status) => {
        event.preventDefault();
        Swal.fire({
            title: translate('kpi_unit_create.confirm_unapprove_success'),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: translate('kpi_unit_create.confirm')
        }).then((res) => {
            if (res.value) {
                this.props.editStatusKPIUnit(id, status);

                this.notifysuccess(translate('kpi_unit_create.unapprove_success'));
            }
        });
    }
    approveKPIUnit = (event,currentStatus, currentKPI, status) => {
        event.preventDefault();
        var totalWeight = currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if(currentStatus === 1){
            Swal.fire({
                title: translate('kpi_unit_create.approve_already'),
                type: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            })
        } else {
            if (totalWeight === 100) {
                Swal.fire({
                    title: translate('kpi_unit_create.confirm_approve_success'),
                    type: 'success',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi_unit_create.confirm'),
                }).then((res) => {
                    if (res.value) {
                        this.props.editStatusKPIUnit(currentKPI._id, status);

                        this.notifysuccess(translate('kpi_unit_create.approve_success'));
                    }
                });
            } else {
                Swal.fire({
                    title: translate('kpi_unit_create.confirm_approve_error'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi_unit_create.confirm'),
                })
            }
        }
    }
    deleteKPI = (status, id) => {
        if (status === 1) {
            Swal.fire({
                title: translate('kpi_unit_create.confirm_delete_error'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('kpi_unit_create.confirm_delete_success'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            }).then((res) => {
                if (res.value) {
                    this.props.deleteKPIUnit(id);

                    this.notifysuccess(translate('kpi_unit_create.delete_success'));
                }
            });
        }
    }
    deleteTargetKPIUnit = (status ,id, kpiunit) => {
        if (status === 1) {
            Swal.fire({
                title: translate('kpi_unit_create.confirm_delete_target_error'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('kpi_unit_create.confirm_delete_target_success'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            }).then((res) => {
                if (res.value) {
                    this.props.deleteTargetKPIUnit(id, kpiunit);

                    this.notifysuccess(translate('kpi_unit_create.delete_target_success'));
                }
            });
        }
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
    checkPermisson = (deanCurrentUnit) => {
        var currentRole = localStorage.getItem("currentRole");
        
        return (currentRole === deanCurrentUnit);
    }

    checkStartKpiUnit = (currentUnit) => {
        let parentUnit = currentUnit[0].parent; 
        let parentKpi = this.props.createKpiUnit.parent;

        if(parentUnit == null){
            return true;
        }
        else{
            if(parentKpi == null){
                return false;
            }
            else if(parentKpi.status !== 1){
                return false;
            }
            else{
                return true;
            }
        }
    }

    startKpiUnitError = () => {
        let parentKpi = this.props.createKpiUnit.parent;
        if(parentKpi == null){
            Swal.fire({
                title: 'Bạn chưa khởi tạo KPI đơn vị cha',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
        else{
            Swal.fire({
                title: 'Bạn chưa kích hoạt KPI đơn vị cha',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }
    
    render() {
        var unitList, currentUnit, currentKPI;
        const { department, createKpiUnit } = this.props;
        const { editing } = this.state;
        if (department.unitofuser) {
            unitList = department.unitofuser;
            currentUnit = unitList.filter(item =>
                item.dean === this.state.currentRole
                || item.viceDean === this.state.currentRole
                || item.employee === this.state.currentRole);
        }
        if (createKpiUnit.currentKPI) currentKPI = createKpiUnit.currentKPI;
        console.log(currentKPI);

        // hàm để chuyển sang song ngữ
        const { translate } = this.props;

        return (
            <div className="box">
                <div className="box-body">
                    {(typeof currentKPI !== 'undefined' && currentKPI !== null) ?
                        <div>
                            {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                               <div style={{marginLeft: "-10px"}}>
                                    {editing ?
                                        <React.Fragment>
                                            <a className="btn btn-app" onClick={() => this.saveEdit(currentKPI._id, currentUnit && currentUnit[0]._id)} title="Lưu thông tin chỉnh sửa">
                                                <i className="fa fa-save" style={{ fontSize: "16px" }}></i>Lưu
                                            </a>
                                            <a className="btn btn-app" onClick={() => this.cancelEdit()} title="Hủy bỏ chỉnh sửa">
                                                <i className="fa fa-ban" style={{ fontSize: "16px" }}></i>Hủy bỏ
                                            </a>
                                        </React.Fragment> :
                                        <a className="btn btn-app" onClick={() => this.handleEditKPi()} title="Chỉnh sửa thông tin chung">
                                            <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>Chỉnh sửa
                                        </a>
                                    }
                                    <a className="btn btn-app" onClick={() => this.deleteKPI(currentKPI.status, currentKPI._id)} title="Xóa KPI tháng">
                                        <i className="fa fa-trash" style={{ fontSize: "16px" }}></i>Xóa KPI tháng
                                    </a>
                                    {currentKPI.status === 0 ?
                                        <a className="btn btn-app" onClick={(event) => this.approveKPIUnit(event,currentKPI.status, currentKPI, 1)}>
                                            <i className="fa fa-rocket" style={{ fontSize: "16px" }}></i>{translate('kpi_unit_create.approve')}
                                        </a> :
                                        <a className="btn btn-app" onClick={(event) => this.cancelKPIUnit(event, currentKPI._id, 0)}>
                                            <i className="fa fa-lock" style={{ fontSize: "16px" }}></i>{translate('kpi_unit_create.cancel_approve')}
                                        </a>
                                    }
                                    <a className="btn btn-app" data-toggle="modal" data-target="#modal-add-target" data-backdrop="static" data-keyboard="false">
                                        <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('kpi_unit_create.add_target')}
                                    </a>
                                    <ModalAddTargetKPIUnit kpiunit={currentKPI._id} unit={currentKPI.unit._id} />
                                </div>
                            }
                            <div className="">
                                <h4 style={{ display: "inline-block", fontWeight: "600" }}>
                                    KPI {currentKPI.unit.name} {!editing && this.formatDate(currentKPI.time)}
                                </h4>
                                {editing &&
                                    <div className='input-group form-group'>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                    </div>
                                }
                                <div className="form-group">
                                    <span>
                                        {currentKPI.listtarget.reduce(sum => sum + 1, 0)} {translate('kpi_unit_create.target')} -&nbsp;
                                        {translate('kpi_unit_create.weight_total')} &nbsp;
                                        {currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100
                                    </span>
                                    {currentKPI.listtarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ?
                                        <span className="text-danger" style={{fontWeight: "bold"}}> - Chưa thỏa mãn </span>:
                                        <span className="text-success" style={{fontWeight: "bold"}}> - Đã thỏa mãn </span>
                                    }
                                    {currentKPI.status === 1 ?
                                        <span className="text-success" style={{fontWeight: "bold"}}> - Đã kích hoạt</span> :
                                        <span className="text-danger" style={{fontWeight: "bold"}}> - Chưa kích hoạt</span>
                                    }
                                </div>

                                <table className="table table-bordered table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th titl="Số thứ tự" style={{ width: "40px" }}>Stt</th>
                                            <th title="Tên mục tiêu">{translate('kpi_unit_create.target_name')}</th>
                                            <th title="Tiêu chí đánh giá">{translate('kpi_unit_create.criteria')}</th>
                                            <th title="Trọng số" style={{ width: "100px" }}>{translate('kpi_unit_create.weight')}</th>
                                            {this.checkPermisson(currentUnit && currentUnit[0].dean) && <th style={{ width: "100px" }}>{translate('kpi_unit_create.action')}</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentKPI.listtarget.map((item, index) =>
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td title={item.name}>{item.name}</td>
                                                    <td title={item.criteria}>{item.criteria}</td>
                                                    <td title={item.weight}>{item.weight}</td>
                                                    {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                                                        <td>
                                                            <a href="#abc" className="edit" title="Edit" data-toggle="modal" data-target={`#editTargetKPIUnit${item._id}`} data-backdrop="static" data-keyboard="false"><i className="material-icons"></i></a>
                                                            <ModalEditTargetKPIUnit target={item} unit={currentUnit && currentUnit[0]} />
                                                            {item.default === 0 ?
                                                                <a href="#abc" className="delete" title="Delete" onClick={() => this.deleteTargetKPIUnit(currentKPI.status, item._id, currentKPI._id)}>
                                                                    <i className="material-icons"></i>
                                                                </a> :
                                                                <div className="tooltip2">
                                                                    <a>
                                                                        <i className="material-icons">help</i>
                                                                    </a>
                                                                    <span className="tooltip2text" style={{right: "0px"}}>
                                                                        Mục tiêu mặc định
                                                                    </span>
                                                                </div>

                                                                
                                                            }
                                                        </td>
                                                    }
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div> :
                        <div>
                            <div style={{marginLeft: "-10px"}}>
                                {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                                    <div>
                                        {this.checkStartKpiUnit(currentUnit) ?
                                            <React.Fragment>
                                                <a className="btn btn-app" data-toggle="modal" data-target="#startKPIUnit" data-backdrop="static" data-keyboard="false">
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi_unit_create.start_kpi')}
                                                </a>
                                                <ModalStartKPIUnit unit={currentUnit && currentUnit[0]} />
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <a className="btn btn-app" data-toggle="modal" data-backdrop="static" data-keyboard="false" onClick={() => this.startKpiUnitError()}>
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi_unit_create.start_kpi')}
                                                </a>
                                            </React.Fragment>
                                        }
                                    </div>
                                }
                            </div>
                            <h4 style={{ display: "inline-block", fontWeight: "600" }}>KPI {currentUnit && currentUnit[0].name}</h4>
                            <p>Chưa thiết lập KPI tháng {this.formatDate(Date.now())}</p>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { department, createKpiUnit } = state;
    return { department, createKpiUnit };
}

const actionCreators = {
    getDepartment: DepartmentActions.getDepartmentOfUser,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    editKPIUnit: createUnitKpiActions.editKPIUnit,
    deleteKPIUnit: createUnitKpiActions.deleteKPIUnit,
    deleteTargetKPIUnit: createUnitKpiActions.deleteTargetKPIUnit,
    editStatusKPIUnit: createUnitKpiActions.editStatusKPIUnit,
    getKPIParent: createUnitKpiActions.getKPIParent
};
const connectedKPIUnitCreate = connect(mapState, actionCreators)(withTranslate(KPIUnitCreate));
export { connectedKPIUnitCreate as KPIUnitCreate };