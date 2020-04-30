import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUnitKpiActions } from '../redux/actions.js';
import { DepartmentActions} from '../../../../super-admin/organizational-unit/redux/actions';
import { OrganizationalUnitKpiAddTargetModal } from './organizationalUnitKpiAddTargetModal';
import { OrganizationalUnitKpiCreateModal } from './organizationalUnitKpiCreateModal';
import Swal from 'sweetalert2';
import { OrganizationalUnitKpiEditTargetModal } from './organizationalUnitKpiEditTargetModal';
import { withTranslate } from 'react-redux-multilingual';

// hàm để chuyển sang song ngữ
var translate = '';

class OrganizationalUnitKpiCreate extends Component {
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
            organizationalUnitKpiSet: {
                organizationalUnit: "",
                time: this.formatDate(Date.now()),
                creator: ""     //localStorage.getItem("id")
            },
            adding: false,
            editing: false,
            submitted: false,
            currentRole: localStorage.getItem("currentRole")
        };

    }

    handleEditKPi = async () => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing,
            }
        })
    }
    saveEdit = async (id, organizationalUnit) => {
        await this.setState(state => {
            return {
                ...state,
                editing: !state.editing,
                organizationalUnitKpiSet: {
                    ...state.organizationalUnitKpiSet,
                    organizationalUnit: organizationalUnit,
                    time: this.time.value,
                }
            }
        })
        var { organizationalUnitKpiSet } = this.state;
        if (organizationalUnitKpiSet.organizationalUnit && organizationalUnitKpiSet.time ) {//&& kpiunit.creater
            this.props.editKPIUnit(id, organizationalUnitKpiSet);
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
            title: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.cancel_approve.cancel'),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.confirm')
        }).then((res) => {
            if (res.value) {
                this.props.editStatusKPIUnit(id, status);
            }
        });
    }
    approveKPIUnit = (event,currentStatus, currentKPI, status) => {
        event.preventDefault();
        var totalWeight = currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if(currentStatus === 1){
            Swal.fire({
                title: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.request_approval_kpi.approve_already'),
                type: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.confirm'),
            })
        } else {
            if (totalWeight === 100) {
                Swal.fire({
                    title: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.request_approval_kpi.approve'),
                    type: 'success',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.confirm'),
                }).then((res) => {
                    if (res.value) {
                        this.props.editStatusKPIUnit(currentKPI._id, status);
                    }
                });
            } else {
                Swal.fire({
                    title: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.request_approval_kpi.not_enough_weight'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.confirm'),
                })
            }
        }
    }
    deleteKPI = (status, id) => {
        if (status === 1) {
            Swal.fire({
                title: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.delete_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.confirm_delete_success'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.confirm'),
            }).then((res) => {
                if (res.value) {
                    this.props.deleteKPIUnit(id);
                }
            });
        }
    }
    deleteTargetKPIUnit = (status ,id, organizationalUnitKpiSetId) => {
        if (status === 1) {
            Swal.fire({
                title: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.delete_kpi.approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.delete_kpi.kpi'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.confirm'),
            }).then((res) => {
                if (res.value) {
                    this.props.deleteTargetKPIUnit(id, organizationalUnitKpiSetId);
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
                                                <i className="fa fa-save" style={{ fontSize: "16px" }}></i>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.save')}
                                            </a>
                                            <a className="btn btn-app" onClick={() => this.cancelEdit()} title="Hủy bỏ chỉnh sửa">
                                                <i className="fa fa-ban" style={{ fontSize: "16px" }}></i>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.cancel')}
                                            </a>
                                        </React.Fragment> :
                                        <a className="btn btn-app" onClick={() => this.handleEditKPi()} title="Chỉnh sửa thông tin chung">
                                            <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.edit')}
                                        </a>
                                    }
                                    <a className="btn btn-app" onClick={() => this.deleteKPI(currentKPI.status, currentKPI._id)} title="Xóa KPI tháng">
                                        <i className="fa fa-trash" style={{ fontSize: "16px" }}></i>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.delete')}
                                    </a>
                                    {currentKPI.status === 0 ?
                                        <a className="btn btn-app" onClick={(event) => this.approveKPIUnit(event,currentKPI.status, currentKPI, 1)}>
                                            <i className="fa fa-rocket" style={{ fontSize: "16px" }}></i>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.approve')}
                                        </a> :
                                        <a className="btn btn-app" onClick={(event) => this.cancelKPIUnit(event, currentKPI._id, 0)}>
                                            <i className="fa fa-lock" style={{ fontSize: "16px" }}></i>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.cancel_approve')}
                                        </a>
                                    }
                                    <a className="btn btn-app" data-toggle="modal" data-target="#modal-add-target" data-backdrop="static" data-keyboard="false">
                                        <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.add_target')}
                                    </a>
                                    <OrganizationalUnitKpiAddTargetModal organizationalUnitKpiSetId={currentKPI._id} organizationalUnit={currentKPI.organizationalUnit} />
                                </div>
                            }
                            <div className="">
                                <h4 style={{ display: "inline-block", fontWeight: "600" }}>
                                    KPI {currentKPI.organizationalUnit.name} {!editing && this.formatDate(currentKPI.time)}
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
                                        {currentKPI.kpis.reduce(sum => sum + 1, 0)} {translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.general_information.target')} -&nbsp;
                                        {translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.weight_status.weight_total')} &nbsp;
                                        {currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100
                                    </span>
                                    {currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ?
                                        <span className="text-danger" style={{fontWeight: "bold"}}> - {translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.weight_status.not_satisfied')} </span>:
                                        <span className="text-success" style={{fontWeight: "bold"}}> - {translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.weight_status.satisfied')} </span>
                                    }
                                    {currentKPI.status === 1 ?
                                        <span className="text-success" style={{fontWeight: "bold"}}> - {translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.kpi_status.approved')}</span> :
                                        <span className="text-danger" style={{fontWeight: "bold"}}> - {translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.kpi_status.not_approved')}</span>
                                    }
                                </div>

                                <table className="table table-bordered table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th titl="Số thứ tự" style={{ width: "40px" }}>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.no_')}</th>
                                            <th title="Tên mục tiêu">{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.target_name')}</th>
                                            <th title="Tiêu chí đánh giá">{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.evaluation_criteria')}</th>
                                            <th title="Trọng số" style={{ width: "100px" }}>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.weight')}</th>
                                            {this.checkPermisson(currentUnit && currentUnit[0].dean) && <th style={{ width: "100px" }}>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.action')}</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            currentKPI.kpis.map((item, index) =>
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td title={item.name}>{item.name}</td>
                                                    <td title={item.criteria}>{item.criteria}</td>
                                                    <td title={item.weight}>{item.weight}</td>
                                                    {this.checkPermisson(currentUnit && currentUnit[0].dean) &&
                                                        <td>
                                                            <a href="#abc" className="edit" title={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.action_title.edit')} data-toggle="modal" data-target={`#editTargetKPIUnit${item._id}`} data-backdrop="static" data-keyboard="false"><i className="material-icons"></i></a>
                                                            <OrganizationalUnitKpiEditTargetModal target={item} organizationalUnit={currentUnit && currentUnit[0]} />
                                                            {item.default === 0 ?
                                                                <a href="#abc" className="delete" title={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.action_title.delete')} onClick={() => this.deleteTargetKPIUnit(currentKPI.status, item._id, currentKPI._id)}>
                                                                    <i className="material-icons"></i>
                                                                </a> :
                                                                <div className="tooltip2">
                                                                    <a>
                                                                        <i className="material-icons">help</i>
                                                                    </a>
                                                                    <span className="tooltip2text" style={{right: "0px"}}>
                                                                    {translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.action_title.content')}
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
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.initialize_kpi_newmonth')}
                                                </a>
                                                <OrganizationalUnitKpiCreateModal organizationalUnit={currentUnit && currentUnit[0]} />
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <a className="btn btn-app" data-toggle="modal" data-backdrop="static" data-keyboard="false" onClick={() => this.startKpiUnitError()}>
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.initialize_kpi_newmonth')}
                                                </a>
                                            </React.Fragment>
                                        }
                                    </div>
                                }
                            </div>
                            <h4 style={{ display: "inline-block", fontWeight: "600" }}>KPI {currentUnit && currentUnit[0].name}</h4>
                            <p>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set.not_initialize')} {this.formatDate(Date.now())}</p>
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
const connectedOrganizationalUnitKpiCreate = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiCreate));
export { connectedOrganizationalUnitKpiCreate as OrganizationalUnitKpiCreate };