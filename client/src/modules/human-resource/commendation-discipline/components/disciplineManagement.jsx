import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DisciplineCreateForm, DisciplineEditForm } from './combinedContent';
import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti } from '../../../../common-components';

import { DisciplineActions } from '../redux/actions';

class DisciplineManager extends Component {
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
            organizationalUnits: organizationalUnits,
            page: 0,
            limit: 5,
        }
    }
    componentDidMount() {
        this.props.getListDiscipline(this.state);
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
        window.$('#modal-edit-discipline').modal('show');
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
        this.props.getListDiscipline(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getListDiscipline(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListDiscipline(this.state);
    }
    render() {
        const { limit, page, organizationalUnits } = this.state;
        const { list } = this.props.department;
        const { translate, discipline, pageActive } = this.props;
        var listDisciplines = "", listPosition = [];
        if (organizationalUnits !== null) {
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
            listDisciplines = discipline.listDisciplines;
        }
        var pageTotal = (discipline.totalListDiscipline % limit === 0) ?
            parseInt(discipline.totalListDiscipline / limit) :
            parseInt((discipline.totalListDiscipline / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);
        return (
            <div id="kyluat" className={`tab-pane ${pageActive === 'discipline' ? 'active' : null}`}>
                <div className="box-body qlcv">
                    <DisciplineCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}</label>
                            <SelectMulti id={`multiSelectUnitDiscipline`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                value={organizationalUnits}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.position')}</label>
                            <SelectMulti id={`multiSelectPositionDiscipline`} multiple="multiple"
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
                    <table id="discipline-table" className="table table-striped table-bordered table-hover" >
                        <thead>
                            <tr>
                                <th >{translate('table.employee_number')}</th>
                                <th>{translate('table.employee_name')}</th>
                                <th >{translate('discipline.start_date')}</th>
                                <th >{translate('discipline.end_date')}</th>
                                <th>{translate('page.number_decisions')}</th>
                                <th>{translate('table.unit')}</th>
                                <th >{translate('table.position')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId="discipline-table"
                                        columnArr={[
                                            translate('table.employee_number'),
                                            translate('table.employee_name'),
                                            translate('discipline.start_date'),
                                            translate('discipline.end_date'),
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
                            {(typeof listDisciplines !== 'undefined' && listDisciplines.length !== 0) &&
                                listDisciplines.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employee.employeeNumber}</td>
                                        <td>{x.employee.fullName}</td>
                                        <td>{this.formatDate(x.startDate)}</td>
                                        <td>{this.formatDate(x.endDate)}</td>
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
                                        <td style={{ textAlign: 'center' }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('discipline.edit_discipline')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('discipline.delete_discipline')}
                                                data={{
                                                    id: x._id,
                                                    info: x.employee.employeeNumber + " - " + translate('page.number_decisions') + ": " + x.decisionNumber
                                                }}
                                                func={this.props.deleteDiscipline}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {discipline.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listDisciplines === 'undefined' || listDisciplines.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                    {
                        this.state.currentRow !== undefined &&
                        <DisciplineEditForm
                            _id={this.state.currentRow._id}
                            employeeNumber={this.state.currentRow.employee.employeeNumber}
                            decisionNumber={this.state.currentRow.decisionNumber}
                            organizationalUnit={this.state.currentRow.organizationalUnit}
                            startDate={this.formatDate(this.state.currentRow.startDate)}
                            endDate={this.formatDate(this.state.currentRow.endDate)}
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
    getListDiscipline: DisciplineActions.getListDiscipline,
    deleteDiscipline: DisciplineActions.deleteDiscipline,
};

const disciplineManager = connect(mapState, actionCreators)(withTranslate(DisciplineManager));
export { disciplineManager as DisciplineManager };