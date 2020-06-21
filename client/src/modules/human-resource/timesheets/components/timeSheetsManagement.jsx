import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalImportTimekeeping } from './combinedContent';

import { DataTableSetting, DeleteNotification, PaginateBar, DatePicker, SelectMulti, SlimScroll } from '../../../../common-components';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import './timesheet.css';



class TimeSheetsManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            month: null,
            employeeNumber: "",
            organizationalUnit: null,
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.getDepartment();
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

    // Function lưu giá trị mã nhân viên vào state khi thay đổi
    handleMSNVChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị unit vào state khi thay đổi
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnit: value
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

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        let partMonth = value.split('-');
        value = [partMonth[1], partMonth[0]].join('-');
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Function bắt sự kiện tìm kiếm 
    handleSunmitSearch = async () => {
        if (this.state.month === null) {
            let partMonth = this.formatDate(Date.now(), true).split('-');
            let month = [partMonth[1], partMonth[0]].join('-');
            await this.setState({
                ...this.state,
                month: month
            })
        }
        //this.props.searchSalary(this.state);
    }
    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        //this.props.searchSalary(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        //this.props.searchSalary(this.state);
    }
    render() {
        const { list } = this.props.department;
        const { translate } = this.props;
        var listTimesheets = "", listPosition = [];
        if (this.state.organizationalUnit !== null) {
            let organizationalUnit = this.state.organizationalUnit;
            organizationalUnit.forEach(u => {
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
        // if (salary.isLoading === false) {
        //     listSalarys = salary.listSalarys;
        // }
        // var pageTotal = (salary.totalList % this.state.limit === 0) ?
        //     parseInt(salary.totalList / this.state.limit) :
        //     parseInt((salary.totalList / this.state.limit) + 1);
        // var page = parseInt((this.state.page / this.state.limit) + 1);


        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-primary pull-right dropdown-toggle" data-toggle="dropdown" aria-expanded="true" title="Chấm công nhân viên" >Chấm công</button>
                            <ul className="dropdown-menu pull-right" style={{ background: "#999", marginTop: 0 }} >
                                <li><a style={{ color: "#fff" }} data-toggle="modal" data-target="#modal-importFileTimekeeping">Import file Excel</a></li>
                                <li><a style={{ color: "#fff" }} >Chấm bằng tay</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.position')}</label>
                            <SelectMulti id={`multiSelectPosition`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_position'), allSelectedText: translate('human_resource.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleMSNVChange} placeholder={translate('human_resource.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now(), true)}
                                onChange={this.handleMonthChange}
                            />
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>
                    <div className="form-inline">
                        <label>Ký hiệu: &emsp; &emsp; </label><i style={{ color: "#08b30e", fontSize: 19 }} className="glyphicon glyphicon-ok"></i><span> -- Có đi làm </span>
                                            &emsp;&emsp;&emsp;<i style={{ color: "red", fontSize: 19 }} className="glyphicon glyphicon-remove"></i><span> -- Nghỉ làm</span>

                    </div>
                    <div id="croll-table" className="form-inline">
                        <div className = "sticky col-lg-3 col-md-4 col-sm-6 col-xs-7 " style={{ padding: 0 }}>
                            <table className="keeping table table-bordered">
                                <thead>
                                    <tr style={{ height: 42 }}>
                                        <th >Mã nhân viên</th>
                                        <th style={{ width: "55%" }}>Tên nhân viên</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ paddingTop: 20 }}>2015053</td>
                                        <td style={{ paddingTop: 20 }}>Nguyen khanh linh</td>

                                    </tr>
                                    <tr>
                                        <td style={{ paddingTop: 20 }}>20150698</td>
                                        <td style={{ paddingTop: 20 }}>Nguyen van hung </td>
                                    </tr>
                                </tbody>

                            </table>
                        </div>
                        <div className="col-lg-9 col-md-8 col-sm-6 col-xs-5" style={{ padding: 0 }}>
                            <table id="timesheets" className="timekeeping table table table-striped table-bordered table-hover" style={{marginLeft:-1}}>
                                <thead>
                                    <tr>
                                        <th>1</th>
                                        <th>2</th>
                                        <th>3</th>
                                        <th>4</th>
                                        <th>5</th>
                                        <th>6</th>
                                        <th>7</th>
                                        <th>8</th>
                                        <th>9</th>
                                        <th>10</th>
                                        <th>11</th>
                                        <th>12</th>
                                        <th>13</th>
                                        <th>14</th>
                                        <th>15</th>
                                        <th>16</th>
                                        <th>17</th>
                                        <th>18</th>
                                        <th>19</th>
                                        <th>20</th>
                                        <th>21</th>
                                        <th>22</th>
                                        <th>23</th>
                                        <th>24</th>
                                        <th>25</th>
                                        <th>26</th>
                                        <th>27</th>
                                        <th>28</th>
                                        <th>29</th>
                                        <th>30</th>
                                        <th style={{ width: 45 }}>31</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                    </tr>
                                    <tr>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                    </tr>

                                    <tr>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                    </tr>
                                    <tr>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                        <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <SlimScroll outerComponentId='croll-table' innerComponentId='timesheets' innerComponentWidth={1000} activate={true} />

                </div>
                <ModalImportTimekeeping />
            </div>
        );
    }
}

function mapState(state) {
    const { department } = state;
    return { department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
};

const connectedTimesheets = connect(mapState, actionCreators)(withTranslate(TimeSheetsManagement));
export { connectedTimesheets as TimeSheetsManagement };