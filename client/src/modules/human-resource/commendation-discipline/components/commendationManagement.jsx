import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PraiseCreateForm, PraiseEditForm } from './combinedContent';
import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti, ExportExcel } from '../../../../common-components';

import { DisciplineActions } from '../redux/actions';

class PraiseManager extends Component {
    constructor(props) {
        super(props);
        let search = window.location.search.split('?')
        let keySearch = 'organizationalUnits';
        let organizationalUnits = null;
        for (let n in search) {
            let index = search[n].lastIndexOf(keySearch);
            if (index !== -1) {
                organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length);
                if (organizationalUnits !== 'null' && organizationalUnits.trim() !== '') {
                    organizationalUnits = organizationalUnits.split(',')
                } else organizationalUnits = null
                break;
            }
        }
        this.state = {
            position: null,
            decisionNumber: "",
            employeeNumber: "",
            organizationalUnits: organizationalUnits ? organizationalUnits : [],
            page: 0,
            limit: 5,
        }
    }
    componentDidMount() {
        this.props.getListPraise(this.state);
    }
    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    // Bắt sự kiện click chỉnh sửa thông tin khen thưởng
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-praise').modal('show');
    }

    // Function lưu giá trị unit vào state khi thay đổi
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnits: value
        })
    }

    // Function lưu giá trị chức vụ vào state khi thay đổi
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    // Function bắt sự kiện thay đổi mã nhân viên và số quyết định
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    // Function bắt sự kiện tìm kiếm 
    handleSubmitSearch = () => {
        this.props.getListPraise(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getListPraise(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListPraise(this.state);
    }

    // Function chyển đổi dữ liệu khen thưởng thành dạng dữ liệu dùng export
    convertDataToExportData = (data) => {
        const { list } = this.props.department;
        if (data) {
            data = data.map((x, index) => {
                let organizationalUnits = x.organizationalUnits.map(y => y.name);
                let position = x.roles.map(y => y.roleId.name);
                let decisionUnit = list.find(y => y._id === x.organizationalUnit);
                return {
                    STT: index + 1,
                    employeeNumber: x.employee.employeeNumber,
                    fullName: x.employee.fullName,
                    organizationalUnits: organizationalUnits.join(', '),
                    position: position.join(', '),
                    decisionNumber: x.decisionNumber,
                    decisionUnit: decisionUnit ? decisionUnit.name : "",
                    startDate: this.formatDate(x.startDate),
                    type: x.type,
                    reason: x.reason,
                };

            })
        }
        let exportData = {
            fileName: "Bảng thống kê khen thưởng",
            dataSheets: [
                {
                    sheetName: "sheet1",
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "organizationalUnits", value: "Đơn vị" },
                                { key: "position", value: "Chức vụ" },
                                { key: "decisionNumber", value: "Số ra quyết định" },
                                { key: "decisionUnit", value: "Cấp ra quyết định" },
                                { key: "startDate", value: "Ngày ra quyết định" },
                                { key: "type", value: "Hình thức khen thưởng" },
                                { key: "reason", value: "Lý do khen thưởng" },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData
    }

    render() {
        const { limit, page, organizationalUnits } = this.state
        const { list } = this.props.department;
        const { translate, discipline, pageActive } = this.props;
        var listCommendations = [], listPosition = [];
        if (organizationalUnits.length !== 0) {
            organizationalUnits.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let roleDeans = x.deans.map(y => { return { _id: y._id, name: y.name } });
                        let roleViceDeans = x.viceDeans.map(y => { return { _id: y._id, name: y.name } });
                        let roleEmployees = x.employees.map(y => { return { _id: y._id, name: y.name } });
                        listPosition = listPosition.concat(roleDeans).concat(roleViceDeans).concat(roleEmployees);
                    }
                })
            })
        }
        if (discipline.isLoading === false) {
            listCommendations = discipline.listCommendations;
        }
        let exportData = this.convertDataToExportData(listCommendations);

        let pageTotal = (discipline.totalListCommendation % limit === 0) ?
            parseInt(discipline.totalListCommendation / limit) :
            parseInt((discipline.totalListCommendation / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);
        return (
            <div id="khenthuong" className={`tab-pane ${pageActive === 'commendation' ? 'active' : null}`}>
                <div className="box-body qlcv">
                    <PraiseCreateForm />
                    <ExportExcel id="export-commendation" exportData={exportData} style={{ marginRight: 15, marginTop: 2 }} />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}</label>
                            <SelectMulti id={`multiSelectUnitPraise`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                value={organizationalUnits}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.position')}</label>
                            <SelectMulti id={`multiSelectPositionPraise`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_position'), allSelectedText: translate('page.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.number_decisions')}</label>
                            <input type="text" className="form-control" name="decisionNumber" onChange={this.handleChange} placeholder={translate('page.number_decisions')} autoComplete="off" />
                            <button type="button" className="btn btn-success" onClick={this.handleSubmitSearch} title={translate('page.add_search')} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="praise-table" className="table table-striped table-bordered table-hover" >
                        <thead>
                            <tr>
                                <th >{translate('table.employee_number')}</th>
                                <th>{translate('table.employee_name')}</th>
                                <th >{translate('discipline.decision_day')}</th>
                                <th >{translate('page.number_decisions')}</th>
                                <th>{translate('table.unit')}</th>
                                <th >{translate('table.position')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="praise-table"
                                        columnArr={[
                                            translate('table.employee_number'),
                                            translate('table.employee_name'),
                                            translate('discipline.decision_day'),
                                            translate('page.number_decisions'),
                                            translate('table.unit'),
                                            translate('table.position')
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listCommendations !== 'undefined' && listCommendations.length !== 0) &&
                                listCommendations.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employee.employeeNumber}</td>
                                        <td>{x.employee.fullName}</td>
                                        <td>{this.formatDate(x.startDate)}</td>
                                        <td>{x.decisionNumber}</td>
                                        <td>{x.organizationalUnits.length !== 0 ? x.organizationalUnits.map(unit => (
                                            <React.Fragment key={unit._id}>
                                                {unit.name}<br />
                                            </React.Fragment>
                                        )) : null}</td>
                                        <td>{x.roles.length !== 0 ? x.roles.map(role => (
                                            <React.Fragment key={role._id}>
                                                {role.roleId.name}<br />
                                            </React.Fragment>
                                        )) : null}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('discipline.edit_praise')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('discipline.delete_praise')}
                                                data={{
                                                    id: x._id,
                                                    info: x.employee.employeeNumber + " - " + translate('page.number_decisions') + ": " + x.decisionNumber
                                                }}
                                                func={this.props.deletePraise}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {discipline.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listCommendations === 'undefined' || listCommendations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                    {
                        this.state.currentRow !== undefined &&
                        <PraiseEditForm
                            _id={this.state.currentRow._id}
                            employeeNumber={this.state.currentRow.employee.employeeNumber}
                            decisionNumber={this.state.currentRow.decisionNumber}
                            organizationalUnit={this.state.currentRow.organizationalUnit}
                            startDate={this.formatDate(this.state.currentRow.startDate)}
                            type={this.state.currentRow.type}
                            reason={this.state.currentRow.reason}
                        />
                    }
                </div>
            </div>
        )
    };
}
function mapState(state) {
    const { discipline, department } = state;
    return { discipline, department };
};

const actionCreators = {
    getListPraise: DisciplineActions.getListPraise,
    deletePraise: DisciplineActions.deletePraise,
};

const praiseManager = connect(mapState, actionCreators)(withTranslate(PraiseManager));
export { praiseManager as PraiseManager };