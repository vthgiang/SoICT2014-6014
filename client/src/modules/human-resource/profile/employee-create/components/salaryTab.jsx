import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AnnualLeaveAddModal, AnnualLeaveEditModal } from './combinedContent';

class SalaryTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày cần format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
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
        return date;
    }

    /**
     * Bắt sự kiện click edit thông tin nghỉ phép
     * @param {*} value : Thông tin nghỉ phép cần chỉnh sửa
     * @param {*} index : Số thứ tự thông tin nghỉ phép
     */
    handleViewEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowSabbatical: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-sabbatical-editSabbatical${index}`).modal('show');
    }

    /**
     * Function thêm thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép cần thêm
     */
    handleAddAnnualLeave = async (data) => {
        const { annualLeaves } = this.state;
        await this.setState({
            annualLeaves: [...annualLeaves, {
                ...data
            }]
        })
        this.props.handleAddAnnualLeave(annualLeaves, data);
    }

    /**
     * Function chỉnh sửa thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép cần chỉnh sửa
     */
    handleEditAnnualLeave = async (data) => {
        const { annualLeaves } = this.state;
        annualLeaves[data.index] = data;
        await this.setState({
            annualLeaves: annualLeaves
        })
        this.props.handleEditAnnualLeave(annualLeaves, data);
    }

    /**
     * Function xoá thông tin nghỉ phép
     * @param {*} index : Số thứ tự thông tin nghỉ phép cần xoá
     */
    handleDeleteAnnualLeave = async (index) => {
        let { annualLeaves } = this.state;
        let data = annualLeaves[index];
        annualLeaves.splice(index, 1);
        await this.setState({
            ...this.state,
            annualLeaves: [...annualLeaves]
        })
        this.props.handleDeleteAnnualLeave(annualLeaves, data);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                pageCreate: nextProps.pageCreate,
                annualLeaves: nextProps.annualLeaves,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, department, employeesInfo } = this.props;

        const { id } = this.props;

        let { annualLeaves, pageCreate, currentRowSabbatical } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <div className=" row col-md-12">
                        {/* Table thông tin nghỉ phép */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.sabbatical')}</h4></legend>
                            {(pageCreate || employeesInfo?.organizationalUnits?.length === 0) && <a style={{ marginBottom: '10px', marginTop: '2px', cursor: "pointer" }} className="btn btn-success pull-right" title={translate('human_resource.profile.employee_management.staff_no_unit_title')} disabled >{translate('modal.create')}</a>}
                            {!pageCreate && employeesInfo?.organizationalUnits?.length !== 0 && <AnnualLeaveAddModal handleChange={this.handleAddAnnualLeave} id={`addSabbatical${id}`} />}
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>{translate('human_resource.annual_leave.table.start_date')}</th>
                                        <th>{translate('human_resource.annual_leave.table.end_date')}</th>
                                        <th>{translate('human_resource.annual_leave.table.reason')}</th>
                                        <th>{translate('human_resource.status')}</th>
                                        <th>{translate('human_resource.unit')}</th>
                                        <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(typeof annualLeaves !== 'undefined' && annualLeaves.length !== 0) &&
                                        annualLeaves.map((x, index) => {
                                            let organizationalUnit = department.list.find(y => y._id === x.organizationalUnit);
                                            return (
                                                <tr key={index}>
                                                    <td><p>{this.formatDate(x.startDate)}</p>{x.startTime ? x.startTime : null}</td>
                                                    <td><p>{this.formatDate(x.endDate)}</p>{x.endTime ? x.endTime : null}</td>
                                                    <td>{x.reason}</td>
                                                    <td>{translate(`human_resource.annual_leave.status.${x.status}`)}</td>
                                                    <td>{organizationalUnit.name}</td>
                                                    <td >
                                                        <a onClick={() => this.handleViewEdit(x, index)} className="edit text-yellow" style={{ width: '5px', cursor: "pointer" }} title={translate('human_resource.annual_leave.edit_annual_leave')}><i className="material-icons">edit</i></a>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteAnnualLeave(index)} style={{ cursor: "pointer" }}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                            {
                                (typeof annualLeaves === 'undefined' || annualLeaves.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </fieldset>
                    </div>
                </div>
                {
                    currentRowSabbatical !== undefined &&
                    <AnnualLeaveEditModal
                        id={`editSabbatical${currentRowSabbatical.index}`}
                        _id={currentRowSabbatical._id}
                        index={currentRowSabbatical.index}
                        organizationalUnit={currentRowSabbatical.organizationalUnit}
                        startDate={this.formatDate(currentRowSabbatical.startDate)}
                        endDate={this.formatDate(currentRowSabbatical.endDate)}
                        reason={currentRowSabbatical.reason}
                        endTime={currentRowSabbatical.endTime}
                        startTime={currentRowSabbatical.startTime}
                        totalHours={currentRowSabbatical.totalHours}
                        type={currentRowSabbatical.type}
                        status={currentRowSabbatical.status}
                        handleChange={this.handleEditAnnualLeave}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { department, employeesInfo } = state;
    return { department, employeesInfo };
};

const salaryTab = connect(mapState, null)(withTranslate(SalaryTab));
export { salaryTab as SalaryTab };