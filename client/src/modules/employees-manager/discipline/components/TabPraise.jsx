import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import 'react-toastify/dist/ReactToastify.css';
import { DisciplineActions } from '../redux/actions';
import { ModalAddPraise } from './ModalAddPraise';
import { ModalEditPraise } from './ModalEditPraise';
import { DepartmentActions } from '../../../super-admin-management/departments-management/redux/actions';
import { DeleteNotification, PaginateBar, ActionColumn } from '../../../../common-components';
class TabPraise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: "All",
            number: "",
            employeeNumber: "",
            department: "All",
            page: 0,
            limit: 5,
            hideColumn: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getListPraise(this.state);
        this.props.getDepartment();
        let script1 = document.createElement('script');
        script1.src = 'lib/main/js/GridSelect.js';
        script1.async = true;
        script1.defer = true;
        document.body.appendChild(script1);
    }
    componentDidUpdate() {
        this.hideColumn();
    }

    hideColumn = () => {
        if (this.state.hideColumn.length !== 0) {
            var hideColumn = this.state.hideColumn;
            for (var j = 0, len = hideColumn.length; j < len; j++) {
                window.$(`#praise-table td:nth-child(` + hideColumn[j] + `)`).hide();
            }
        }
    }

    displayTreeSelect = (data, i) => {
        i = i + 1;
        if (data !== undefined) {
            if (typeof (data.children) === 'undefined') {
                return (
                    <option key={data.id} data-level={i} value={data.id}>{data.name}</option>
                )
            } else {
                return (
                    <React.Fragment key={data.id}>
                        <option data-level={i} value={data.id} style={{ fontWeight: "bold" }}>{data.name}</option>
                        {
                            data.children.map(tag => this.displayTreeSelect(tag, i))
                        }
                    </React.Fragment>
                )
            }

        }
        else return null
    }
    setLimit = async (number, hideColumn) => {
        await this.setState({
            limit: parseInt(number),
            hideColumn: hideColumn
        });
        this.props.getListPraise(this.state);
    }
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListPraise(this.state);
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleSubmitSearch(event) {
        this.props.getListPraise(this.state);
    }
    render() {
        const { tree, list } = this.props.department;
        const { translate } = this.props;
        var listPraise = "", listDepartment = list, listPosition;
        for (let n in listDepartment) {
            if (listDepartment[n]._id === this.state.department) {
                listPosition = [
                    { _id: listDepartment[n].dean._id, name: listDepartment[n].dean.name },
                    { _id: listDepartment[n].vice_dean._id, name: listDepartment[n].vice_dean.name },
                    { _id: listDepartment[n].employee._id, name: listDepartment[n].employee.name }
                ]
            }
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
                    <div className="form-group">
                        <button type="button" className="btn btn-success pull-right" title={translate('discipline.add_praise_title')} data-toggle="modal" data-target="#modal-addPraise" >{translate('discipline.add_praise')}</button>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}:</label>
                            <select className="form-control" defaultValue="All" id="tree-select" name="department" onChange={this.handleChange}>
                                <option value="All" level={1}>--Tất cả---</option>
                                {
                                    tree !== null &&
                                    tree.map((tree, index) => this.displayTreeSelect(tree, 0))
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.position')}:</label>
                            <select className="form-control" defaultValue="All" name="position" onChange={this.handleChange}>
                                <option value="All">--Tất cả--</option>
                                {
                                    listPosition !== undefined &&
                                    listPosition.map((position, index) => (
                                        <option key={index} value={position._id}>{position.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.staff_number')}:</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="number" className="form-control-static">{translate('page.number_decisions')}:</label>
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
                            {(typeof listPraise === 'undefined' || listPraise.length === 0) ? <tr><th colSpan={7-this.state.hideColumn.length}><center> Không có dữ liệu</center></th></tr> :
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
                                            <ModalEditPraise data={x} />
                                            <DeleteNotification
                                                content={{
                                                    title: "Xoá thông tin khen thưởng",
                                                    btnNo: translate('confirm.no'),
                                                    btnYes: translate('confirm.yes'),
                                                }}
                                                data={{
                                                    id: x._id,
                                                    info: x.employee.employeeNumber + " - Số quyết định: " + x.number
                                                }}
                                                func={this.props.deletePraise}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                <ModalAddPraise />
            </div>
        )
    };
}
function mapState(state) {
    const { discipline, department } = state;
    return { discipline, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListPraise: DisciplineActions.getListPraise,
    deletePraise: DisciplineActions.deletePraise,
};

const connectedListPraise = connect(mapState, actionCreators)(withTranslate(TabPraise));
export { connectedListPraise as TabPraise };