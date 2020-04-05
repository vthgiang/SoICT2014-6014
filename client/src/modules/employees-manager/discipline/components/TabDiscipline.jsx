import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import 'react-toastify/dist/ReactToastify.css';
import { DisciplineActions } from '../redux/actions';
import { ModalAddDiscipline } from './ModalAddDiscipline';
import { ModalEditDiscipline } from './ModalEditDiscipline';
import { ActionColumnDiscipline } from './ActionColumDiscipline';
import { PaginateBar, DeleteNotification } from '../../../../common-components';
class TabDiscipline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: "All",
            number: "",
            employeeNumber: "",
            department: "All",
            page: 0,
            limit: 5,
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
        this.props.getListDiscipline(this.state);
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
    setLimit = async (number) => {
        await this.setState({ limit: parseInt(number) });
        this.props.getListDiscipline(this.state);
        window.$(`#setting-table2`).collapse("hide");
    }
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListDiscipline(this.state);
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleSubmitSearch(event) {
        this.props.getListDiscipline(this.state);
    }
    render() {
        const { tree, list } = this.props.department;
        const { translate } = this.props;
        var listDiscipline = "", listDepartment = list, listPosition;
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
            listDiscipline = this.props.discipline.listDiscipline;
        }
        var pageTotal = (this.props.discipline.totalListDiscipline % this.state.limit === 0) ?
            parseInt(this.props.discipline.totalListDiscipline / this.state.limit) :
            parseInt((this.props.discipline.totalListDiscipline / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div id="kyluat" className="tab-pane">
                <div className="box-body">
                    <div className="form-group">
                        <button type="button" className="btn btn-success pull-right" title={translate('discipline.add_discipline_title')} data-toggle="modal" data-target="#modal-addNewDiscipline" >{translate('discipline.add_discipline')}</button>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}:</label>
                            <select className="form-control" defaultValue="All" id="tree-select2" name="department" onChange={this.handleChange}>
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
                    <div className="form-inline">
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
                    <table className="table table-striped table-bordered table-hover" >
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>{translate('table.employee_number')}</th>
                                <th>{translate('table.employee_name')}</th>
                                <th style={{ width: "13%" }}>{translate('discipline.start_date')}</th>
                                <th style={{ width: "13%" }}>{translate('discipline.end_date')}</th>
                                <th>{translate('page.number_decisions')}</th>
                                <th>{translate('table.unit')}</th>
                                <th style={{ width: "15%" }}>{translate('table.position')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>
                                    <ActionColumnDiscipline
                                        columnName={translate('table.action')}
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
                            {(typeof listDiscipline === 'undefined' || listDiscipline.length === 0) ? <tr><td colSpan={8}><center> Không có dữ liệu</center></td></tr> :
                                listDiscipline.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employee.employeeNumber}</td>
                                        <td>{x.employee.fullName}</td>
                                        <td>{x.startDate}</td>
                                        <td>{x.endDate}</td>
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
                                        <td style={{ textAlign: 'center' }}>
                                            <ModalEditDiscipline data={x} />
                                            <DeleteNotification
                                                content={{
                                                    title: "Xoá thông tin kỷ luật",
                                                    btnNo: translate('confirm.no'),
                                                    btnYes: translate('confirm.yes'),
                                                }}
                                                data={{
                                                    id: x._id,
                                                    info: x.employee.employeeNumber + " - Số quyết định: " + x.number
                                                }}
                                                func={this.props.deleteDiscipline}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                    <ModalAddDiscipline />
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

const connectedListDiscipline = connect(mapState, actionCreators)(withTranslate(TabDiscipline));
export { connectedListDiscipline as TabDiscipline };