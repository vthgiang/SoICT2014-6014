import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { DatePicker } from '../../../../../common-components';

import { OrganizationalUnitKpiAddTargetModal } from './organizationalUnitKpiAddTargetModal';
import { OrganizationalUnitKpiCreateModal } from './organizationalUnitKpiCreateModal';
import { OrganizationalUnitKpiEditTargetModal } from './organizationalUnitKpiEditTargetModal';

import { createUnitKpiActions } from '../redux/actions.js';
import { UserActions} from '../../../../super-admin/user/redux/actions';

// Hàm để chuyển sang song ngữ
var translate = '';

class OrganizationalUnitKpiCreate extends Component {
    constructor(props) {
        super(props);   

        translate = this.props.translate;

        this.state = {
            organizationalUnitKpiSet: {
                organizationalUnit: "",
                date: this.formatDate(Date.now()),
                creator: "" // localStorage.getItem("id")
            },

            adding: false,
            editing: false,
            submitted: false,
            
            currentRole: localStorage.getItem("currentRole")
        };

    }

    componentDidMount() {
        // Get department list of company
        this.props.getDepartment();
        this.props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
        this.props.getKPIParent(localStorage.getItem('currentRole'));
    }

    componentDidUpdate() {
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
                }
            }
        })
        var { organizationalUnitKpiSet } = this.state;
        
        if (organizationalUnitKpiSet.organizationalUnit && organizationalUnitKpiSet.date) {//&& kpiunit.creater
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
            title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_cancel_approve'),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm')
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
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approve_already'),
                type: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
            })
        } else {
            if (totalWeight === 100) {
                Swal.fire({
                    title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approve'),
                    type: 'success',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
                }).then((res) => {
                    if (res.value) {
                        this.props.editStatusKPIUnit(currentKPI._id, status);
                    }
                });
            } else {
                Swal.fire({
                    title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_not_enough_weight'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
                })
            }
        }
    }

    deleteKPI = (status, id) => {
        if (status === 1) {
            Swal.fire({
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_delete_success'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
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
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_approving'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
            })
        } else {
            Swal.fire({
                title: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm_kpi'),
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi.organizational_unit.create_organizational_unit_kpi_set.confirm'),
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

        if (month.length < 2) {
            month = '0' + month;
        }
            
        if (day.length < 2){
            day = '0' + day;
        }

        return [month, year].join('-');
    }

    handleChangeDate = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                organizationalUnitKpiSet: {
                    ...state.organizationalUnitKpiSet,
                    date: value,
                }
            }
        })
    }

    checkPermisson = (deanCurrentUnit) => {
        var currentRole = localStorage.getItem("currentRole");
        
        return (deanCurrentUnit && deanCurrentUnit.includes(currentRole));
    }

    checkStartKpiUnit = (currentUnit) => {
        let parentUnit = currentUnit[0].parent; 
        let parentKpi = this.props.createKpiUnit.parent;

        if (parentUnit == null) {
            return true;
        } else {
            if (parentKpi == null) {
                return false;
            }
            else if (parentKpi.status !== 1) {
                return false;
            }
            else {
                return true;
            }
        }
    }

    startKpiUnitError = () => {
        let parentKpi = this.props.createKpiUnit.parent;
        if (parentKpi == null) {
            Swal.fire({
                title: 'Chưa thể khởi tạo KPI cho đơn vị bạn tháng này, do đơn vị cấp trên của đơn vị bạn chưa khởi tạo KPI. Liên hệ với cấp trên của bạn để hỏi thêm!',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            Swal.fire({
                title: 'Chưa thể khởi tạo KPI cho đơn vị bạn tháng này, do đơn vị cấp trên của đơn vị bạn chưa kích hoạt KPI. Liên hệ với cấp trên của bạn để hỏi thêm!',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        }
    }
    
    render() {
        const { user, createKpiUnit } = this.props; // Redux
        const { editing, currentRole, organizationalUnitKpiSet } = this.state;
        const { translate } = this.props; // Hàm để chuyển sang song ngữ

        var unitList, currentUnit, currentKPI;

        if (user.organizationalUnitsOfUser) {
            unitList = user.organizationalUnitsOfUser;
            currentUnit = unitList.filter(item =>
                item.deans.includes(currentRole)
                || item.viceDeans.includes(currentRole)
                || item.employees.includes(currentRole));
        }

        if (createKpiUnit.currentKPI) {
            currentKPI = createKpiUnit.currentKPI;
        }

        return (
            <div className="box">
                <div className="box-body">
                    {currentKPI ?
                        <div>
                            {this.checkPermisson(currentUnit && currentUnit[0].deans) &&
                               <div style={{marginLeft: "-10px"}}>
                                    {editing ?
                                        <React.Fragment>
                                            <a className="btn btn-app" onClick={() => this.saveEdit(currentKPI._id, currentUnit && currentUnit[0]._id)} title="Lưu thông tin chỉnh sửa">
                                                <i className="fa fa-save" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.save')}
                                            </a>
                                            <a className="btn btn-app" onClick={() => this.cancelEdit()} title="Hủy bỏ chỉnh sửa">
                                                <i className="fa fa-ban" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel')}
                                            </a>
                                        </React.Fragment> :
                                        <a className="btn btn-app" onClick={() => this.handleEditKPi()} title="Chỉnh sửa thông tin chung">
                                            <i className="fa fa-edit" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.edit')}
                                        </a>
                                    }
                                    <a className="btn btn-app" onClick={() => this.deleteKPI(currentKPI.status, currentKPI._id)} title="Xóa KPI tháng">
                                        <i className="fa fa-trash" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.delete')}
                                    </a>
                                    {currentKPI.status === 0 ?
                                        <a className="btn btn-app" onClick={(event) => this.approveKPIUnit(event,currentKPI.status, currentKPI, 1)}>
                                            <i className="fa fa-rocket" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.approve')}
                                        </a> :
                                        <a className="btn btn-app" onClick={(event) => this.cancelKPIUnit(event, currentKPI._id, 0)}>
                                            <i className="fa fa-lock" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.cancel_approve')}
                                        </a>
                                    }
                                    <a className="btn btn-app" data-toggle="modal" data-target="#modal-add-target" data-backdrop="static" data-keyboard="false">
                                        <i className="fa fa-plus-circle" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.add_target')}
                                    </a>
                                    <OrganizationalUnitKpiAddTargetModal organizationalUnitKpiSetId={currentKPI._id} organizationalUnit={currentKPI.organizationalUnit} />
                                </div>
                            }
                            <div className="">
                                <h4 style={{ display: "inline-block", fontWeight: "600" }}>
                                    KPI {currentKPI.organizationalUnit? currentKPI.organizationalUnit.name: "Đơn vị đã bị xóa"} {!editing && this.formatDate(currentKPI.date)}
                                </h4>

                                {/* Form chỉnh sửa KPI */}
                                {editing &&
                                    <div className='input-group form-group'>
                                        <DatePicker
                                            id="month"      
                                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                            value={organizationalUnitKpiSet.date} // giá trị mặc định cho datePicker    
                                            onChange={this.handleChangeDate}
                                            disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                                        />
                                    </div>
                                }

                                <div className="form-group">
                                    <span>
                                        {currentKPI.kpis.reduce(sum => sum + 1, 0)} {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.target')} -&nbsp;
                                        {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.weight_total')} &nbsp;
                                        {currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0)}/100
                                    </span>
                                    {currentKPI.kpis.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0) !== 100 ?
                                        <span className="text-danger" style={{fontWeight: "bold"}}> - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_satisfied')} </span>:
                                        <span className="text-success" style={{fontWeight: "bold"}}> - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.satisfied')} </span>
                                    }
                                    {currentKPI.status === 1 ?
                                        <span className="text-success" style={{fontWeight: "bold"}}> - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.approved')}</span> :
                                        <span className="text-danger" style={{fontWeight: "bold"}}> - {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_approved')}</span>
                                    }
                                </div>

                                {/* Bảng các mục tiêu của KPI */}
                                <table className="table table-bordered table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th titl="Số thứ tự" style={{ width: "40px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                                            <th title="Tên mục tiêu">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.target_name')}</th>
                                            <th title="Tiêu chí đánh giá">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.evaluation_criteria')}</th>
                                            <th title="Trọng số" style={{ width: "100px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.weight')}</th>
                                            {this.checkPermisson(currentUnit && currentUnit[0].deans) && <th style={{ width: "100px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.action')}</th>}
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
                                                    {this.checkPermisson(currentUnit && currentUnit[0].deans) &&
                                                        <td>
                                                            <a href="#abc" className="edit" title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.edit')} data-toggle="modal" data-target={`#editTargetKPIUnit${item._id}`} data-backdrop="static" data-keyboard="false"><i className="material-icons"></i></a>
                                                            <OrganizationalUnitKpiEditTargetModal target={item} organizationalUnit={currentUnit && currentUnit[0]} />
                                                            {item.type === 0 ?
                                                                <a href="#abc" className="delete" title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.delete_title')} onClick={() => this.deleteTargetKPIUnit(currentKPI.status, item._id, currentKPI._id)}>
                                                                    <i className="material-icons"></i>
                                                                </a> :
                                                                <div className="tooltip2">
                                                                    <a>
                                                                        <i className="material-icons">help</i>
                                                                    </a>
                                                                    <span className="tooltip2text" style={{right: "0px"}}>
                                                                    {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.content')}
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
                                {this.checkPermisson(currentUnit && currentUnit[0].deans) &&
                                    <div>
                                        {this.checkStartKpiUnit(currentUnit) ?
                                            <React.Fragment>
                                                <a className="btn btn-app" data-toggle="modal" data-target="#startKPIUnit" data-backdrop="static" data-keyboard="false">
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.initialize_kpi_newmonth')}
                                                </a>
                                                <OrganizationalUnitKpiCreateModal organizationalUnit={currentUnit && currentUnit[0]} />
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <a className="btn btn-app" data-toggle="modal" data-backdrop="static" data-keyboard="false" onClick={() => this.startKpiUnitError()}>
                                                    <i className="fa fa-calendar-plus-o" style={{ fontSize: "16px" }}></i>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.initialize_kpi_newmonth')}
                                                </a>
                                            </React.Fragment>
                                        }
                                    </div>
                                }
                            </div>
                            <h4 style={{ display: "inline-block", fontWeight: "600" }}>KPI {currentUnit && currentUnit[0].name}</h4>
                            <p>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.not_initialize')} {this.formatDate(Date.now())}</p>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { createKpiUnit, user } = state;
    return { createKpiUnit, user };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    editKPIUnit: createUnitKpiActions.editKPIUnit,
    deleteKPIUnit: createUnitKpiActions.deleteKPIUnit,
    deleteTargetKPIUnit: createUnitKpiActions.deleteTargetKPIUnit,
    editStatusKPIUnit: createUnitKpiActions.editStatusKPIUnit,
    getKPIParent: createUnitKpiActions.getKPIParent
};
const connectedOrganizationalUnitKpiCreate = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiCreate));
export { connectedOrganizationalUnitKpiCreate as OrganizationalUnitKpiCreate };