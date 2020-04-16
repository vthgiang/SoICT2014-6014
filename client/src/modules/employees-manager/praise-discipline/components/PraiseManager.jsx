import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PraiseCreateForm, PraiseEditForm } from './CombineContent';
import { ActionColumn, DeleteNotification, PaginateBar, SelectMulti } from '../../../../common-components';

import { DisciplineActions } from '../redux/actions';
class PraiseManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            number: "",
            employeeNumber: "",
            unit: null,
            page: 0,
            limit: 5,
        }
    }
    componentDidMount() {
        this.props.getListPraise(this.state);
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
            unit: value
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

    render() {
        const { list } = this.props.department;
        const { translate, discipline } = this.props;
        var listPraise = "", listPosition = [];
        if (this.state.unit !== null) {
            let unit = this.state.unit;
            unit.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let position = [
                            { _id: x.dean._id, name: x.dean.name },
                            { _id: x.vice_dean._id, name: x.vice_dean.name },
                            { _id: x.employee._id, name: x.employee.name }
                        ]
                        listPosition = listPosition.concat(position)
                    }
                })
            })
        }
        if (this.props.discipline.isLoading === false) {
            listPraise = this.props.discipline.listPraise;
        }
        var pageTotal = (this.props.discipline.totalListPraise % this.state.limit === 0) ?
            parseInt(this.props.discipline.totalListPraise / this.state.limit) :
            parseInt((this.props.discipline.totalListPraise / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div id="khenthuong" className="tab-pane active">
                <div className="box-body qlcv">
                    <PraiseCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}</label>
                            <SelectMulti id={`multiSelectUnitPraise`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
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
                            <label htmlFor="number" className="form-control-static">{translate('page.number_decisions')}</label>
                            <input type="text" className="form-control" name="number" onChange={this.handleChange} placeholder={translate('page.number_decisions')} autoComplete="off" />
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
                                    <ActionColumn
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
                            {(typeof listPraise !== 'undefined' && listPraise.length !== 0) &&
                                listPraise.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employee.employeeNumber}</td>
                                        <td>{x.employee.fullName}</td>
                                        <td>{x.startDate}</td>
                                        <td>{x.number}</td>
                                        <td>{x.departments.length !== 0 ? x.departments.map(unit => (
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
                                                    info: x.employee.employeeNumber + " - " + translate('page.number_decisions') + ": " + x.number
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
                        (typeof listPraise === 'undefined' || listPraise.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                    {
                        this.state.currentRow !== undefined &&
                        <PraiseEditForm
                            _id={this.state.currentRow._id}
                            employeeNumber={this.state.currentRow.employee.employeeNumber}
                            number={this.state.currentRow.number}
                            unit={this.state.currentRow.unit}
                            startDate={this.state.currentRow.startDate}
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