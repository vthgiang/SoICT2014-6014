import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { managerActions } from '../redux/actions';
import { ModalDetailKPI } from './organizationalUnitKpiDetailModal';
import { ModalCopyKPIUnit } from './organizationalUnitKpiCopyModal';
import { withTranslate } from 'react-redux-multilingual';
import { PaginateBar, DataTableSetting, DialogModal, ErrorLabel, DatePicker, SelectBox, ToolTip } from '../../../../../common-components';
import Swal from 'sweetalert2';

class KPIUnitManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModalCopy: "",
            currentRole: localStorage.getItem("currentRole"),
            status: -1,
            infosearch: {
                role: localStorage.getItem("currentRole"),
                status: -1,
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
    checkStatusKPI = (status) => {
        const {translate} = this.props
        if (status === 0) {
            return translate('kpi.organizational_unit.management.over_view.setting_up');
        } else if (status === 1) {
            return translate('kpi.organizational_unit.management.over_view.activated');
        }
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
    handleUser = (value) => {
        this.setState(state => {
            return {
                ...state,
                userkpi: value,
            }
        })
    }
    handleStatus = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                status: value
            }
        })
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
    handleShowEdit = async (id, idkpiunit, date) => {
        await this.setState(state => {
            return {
                ...state,
                id: id,
                idkpiunit: idkpiunit,
                date: date
            }
        });
        window.$(`#dataResultTask`).modal('show');

    }
    handleSearchData = async () => {
        await this.setState(state => {
            return {
                ...state,
                infosearch: {
                    ...state.infosearch,
                    status: this.state.status,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                }
            }
        })
        const { infosearch } = this.state;
        const { translate} = this.props;
        if (infosearch.role && infosearch.status && infosearch.startDate == undefined && infosearch.endDate == undefined) {
            this.props.getKPIUnits(infosearch);
        }
        if (infosearch.role && infosearch.status && infosearch.startDate == undefined && infosearch.endDate !== undefined) {
            this.props.getKPIUnits(infosearch);
        }
        if (infosearch.role && infosearch.status && infosearch.startDate !== undefined && infosearch.endDate == undefined) {
            this.props.getKPIUnits(infosearch);
        }
        if (infosearch.role && infosearch.status && infosearch.startDate && infosearch.endDate) {
            var startDate = infosearch.startDate.split("-");
            var startDate = new Date(startDate[1], startDate[0]);
            var endDate = infosearch.endDate.split("-");
            var endDate = new Date(endDate[1], endDate[0]);
            if (Date.parse(startDate) > Date.parse(endDate)) {
                Swal.fire({
                    title: translate('kpi.organizational_unit.management.over_view.alert_search.search'),
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: translate('kpi.organizational_unit.management.over_view.alert_search.confirm')
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
        window.$(`#copy-old-kpi-to-new-time-${id}`).modal("show")

    }
    checkPermisson = (deanCurrentUnit) => {
        var currentRole = localStorage.getItem("currentRole");
        return (deanCurrentUnit && deanCurrentUnit.includes(currentRole));
    }
    render() {
        const { startDate, endDate, status, errorOnDate, infosearch } = this.state;
        var listkpi, currentKPI, currentTargets, kpiApproved, datachat1, targetA, targetC, targetOther, misspoint;
        var unitList, currentUnit, userdepartments;
        const { user, managerKpiUnit, translate } = this.props;
        if (user.userdepartments) userdepartments = user.userdepartments;
        if (user.organizationalUnitsOfUser) {
            unitList = user.organizationalUnitsOfUser;
            currentUnit = unitList.filter(item =>
                item.deans.includes(this.state.currentRole)
                || item.viceDeans.includes(this.state.currentRole)
                || item.employees.includes(this.state.currentRole));
        }
        if (managerKpiUnit.kpis) {
            listkpi = managerKpiUnit.kpis;
            if (typeof listkpi !== "undefined" && listkpi.length !== 0)//listkpi.content
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

        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-body qlcv">
                        <ModalDetailKPI
                            date={this.state.date}
                            id={this.state.id}
                            idkpiunit={this.state.idkpiunit}
                        // idkpiunit={item}
                        />
                        <div className="form-inline">
                            <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('kpi.organizational_unit.management.over_view.start_date')}</label>
                                <DatePicker
                                    id="start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                    dateFormat="month-year"
                                />
                                <ErrorLabel content={errorOnDate} />
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.organizational_unit.management.over_view.end_date')}</label>
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

                                <label>{translate('kpi.organizational_unit.management.over_view.status')}</label>
                                {
                                    <SelectBox
                                        id={`select-status-kpi`}
                                        className="form-control select2"
                                        items={[{ value: -1, text: translate('kpi.organizational_unit.management.over_view.all_status') }, { value: 0, text: translate('kpi.organizational_unit.management.over_view.setting_up') }, { value: 1, text: translate('kpi.organizational_unit.management.over_view.activated') },]}
                                        onChange={this.handleStatus}
                                        style={{ width: "100%" }}
                                        value={status}
                                    // multiple={true}
                                    />
                                }
                            </div>
                            <div className="form-group">
                                <label></label>
                                <button type="button" className="btn btn-success" onClick={() => this.handleSearchData()}>{translate('kpi.organizational_unit.management.over_view.search')}</button>
                            </div>
                        </div>

                        <DataTableSetting class="pull-right" tableId="kpiTable" tableContainerId="kpiTableContainer" tableWidth="1300px"
                            columnArr={['Người tạo', 'Thời gian', 'Trạng thái', 'Số lượng mục tiêu', 'Kết quả đánh giá', 'Xem chi tiết', 'Tạo KPI tháng mới', 'Cập nhật']}
                            limit={this.state.perPage}
                            setLimit={this.setLimit} hideColumnOption={true} />

                        <table id="kpiTable" className="table table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th title="Người tạo">{translate('kpi.organizational_unit.management.over_view.creator')}</th>
                                    <th title="Thời gian">{translate('kpi.organizational_unit.management.over_view.time')}</th>
                                    <th title="Trạng thái">{translate('kpi.organizational_unit.management.over_view.status')}</th>
                                    <th title="Số lượng mục tiêu">{translate('kpi.organizational_unit.management.over_view.number_target')}</th>
                                    <th title="Kết quả đánh giá (Điểm phê duyệt - Điểm hệ thống- Điểm tự đánh giá)">{translate('kpi.organizational_unit.management.over_view.result')}</th>
                                    <th title="Hành động">{translate('kpi.organizational_unit.management.over_view.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (typeof listkpi !== "undefined" && listkpi.length !== 0) ?
                                        listkpi.map((item, index) =>
                                            <tr key={index + 1}>
                                                <td>{item.creator.name}</td>
                                                <td>{this.formatDate(item.date)}</td>
                                                <td>{this.checkStatusKPI(item.status)}</td>
                                                <td>{item.kpis.length}</td>
                                                <td>{item.approvedPoint === null ? translate('kpi.organizational_unit.management.over_view.not_eval') : `${item.approvedPoint}-${item.automaticPoint}-${item.employeePoint}`}</td>
                                                <td>
                                                    <a href={`#dataResultTask`} data-toggle="modal" data-backdrop="static"
                                                        data-keyboard="false" title="Xem chi tiết KPI tháng này"><i
                                                            className="material-icons" onClick={() => this.handleShowEdit(item._id, item.organizationalUnit._id, item.date)}>view_list</i></a>
                                                    {this.checkPermisson(currentUnit && currentUnit[0].deans) && <a href="#abc" onClick={() =>
                                                        this.showModalCopy(item._id)} className="copy" data-toggle="modal"
                                                        data-backdrop="static" data-keyboard="false" title="Thiết lập kpi tháng mới từ kpi tháng
                                        này"><i className="material-icons">content_copy</i></a>}
                                                    {this.state.showModalCopy === item._id ?
                                                        <ModalCopyKPIUnit idunit={item.organizationalUnit._id} listkpi={listkpi} kpiunit={item} /> : null}

                                                </td>
                                            </tr>) : <tr>
                                            <td colSpan={8}>
                                                <center>{translate('kpi.organizational_unit.management.over_view.no_data')}</center>
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
const connectedKPIUnitManager = connect(mapState, actionCreators)(withTranslate(KPIUnitManager));
export { connectedKPIUnitManager as KPIUnitManager };