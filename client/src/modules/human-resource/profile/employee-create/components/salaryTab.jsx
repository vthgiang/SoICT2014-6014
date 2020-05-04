import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SalaryAddModal, SalaryEditModal, AnnualLeaveAddModal, AnnualLeaveEditModal } from './combinedContent';

class SalaryTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Bắt sự kiện click edit khen thưởng
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-salary-editSalary${index}`).modal('show');
    }
    // Bắt sự kiện click edit khen thưởng
    handleViewEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowSabbatical: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-sabbatical-editSabbatical${index}`).modal('show');
    }

    // Function thêm thông tin lịch sử lương
    handleAddSalary = async (data) => {
        const { salaries } = this.state;
        let check = [];
        check = salaries.filter(x => (x.month === data.month));
        if (check.length !== 0) {
            console.log("Tháng lương đã tồn tại");
        } else {
            await this.setState({
                salaries: [...salaries, {
                    ...data
                }]
            })
            this.props.handleAddSalary(this.state.salaries, data);
        }
    }
    // Function chỉnh sửa thông tin lịch sử lương
    handleEditSalary = async (data) => {
        const { salaries } = this.state;
        salaries[data.index] = data;
        await this.setState({
            salaries: salaries
        })
        this.props.handleEditSalary(this.state.salaries, data);
    }
    // Function xoá bảng lương
    handleDeleteSalary = async (index) => {
        var { salaries } = this.state;
        var data = salaries[index];
        salaries.splice(index, 1);
        await this.setState({
            ...this.state,
            salaries: [...salaries]
        })
        this.props.handleDeleteSalary(this.state.salaries, data);
    }

    // Function thêm thông tin nghỉ phép
    handleAddAnnualLeave = async (data) => {
        const { annualLeaves } = this.state;
        await this.setState({
            annualLeaves: [...annualLeaves, {
                ...data
            }]
        })
        this.props.handleAddAnnualLeave(this.state.annualLeaves, data);
    }
    // Function chỉnh sửa thông tin nghỉ phép
    handleEditAnnualLeave = async (data) => {
        const { annualLeaves } = this.state;
        annualLeaves[data.index] = data;
        await this.setState({
            annualLeaves: annualLeaves
        })
        this.props.handleEditAnnualLeave(this.state.annualLeaves, data
        );
    }
    // Function xoá thông tin nghỉ phép
    handleDeleteAnnualLeave = async (index) => {
        var { annualLeaves } = this.state;
        var data = annualLeaves[index];
        annualLeaves.splice(index, 1);
        await this.setState({
            ...this.state,
            annualLeaves: [...annualLeaves]
        })
        this.props.handleDeleteAnnualLeave(this.state.annualLeaves, data);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                salaries: nextProps.salaries,
                annualLeaves: nextProps.annualLeaves,
            }
        } else {
            return null;
        }
    }
    render() {
        var formater = new Intl.NumberFormat();
        const { id, translate } = this.props;
        const { annualLeaves, salaries } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <div className=" row col-md-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.historySalary')}</h4></legend>
                            <SalaryAddModal handleChange={this.handleAddSalary} id={`addSalary${id}`} />
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                                <thead>
                                    <tr>
                                        <th>{translate('table.month')}</th>
                                        <th>{translate('salary_employee.main_salary')}</th>
                                        <th>{translate('table.total_salary')}</th>
                                        <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(typeof salaries !== 'undefined' && salaries.length !== 0) &&
                                        salaries.map((x, index) => {
                                            if (x.bonus.length !== 0) {
                                                var total = 0;
                                                for (let count in x.bonus) {
                                                    total = total + parseInt(x.bonus[count].number)
                                                }
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>{x.month}</td>
                                                    <td>{formater.format(parseInt(x.mainSalary))} {x.unit}</td>
                                                    <td>
                                                        {
                                                            (typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
                                                                formater.format(parseInt(x.mainSalary)) :
                                                                formater.format(total + parseInt(x.mainSalary))
                                                        } {x.unit}
                                                    </td>
                                                    <td>
                                                        <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('salary_employee.edit_salary')}><i className="material-icons">edit</i></a>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteSalary(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                (typeof salaries === 'undefined' || salaries.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.sabbatical')}</h4></legend>
                            <AnnualLeaveAddModal handleChange={this.handleAddAnnualLeave} id={`addSabbatical${id}`} />
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                                <thead>
                                    <tr>
                                        <th>{translate('table.start_date')}</th>
                                        <th>{translate('table.end_date')}</th>
                                        <th>{translate('sabbatical.reason')}</th>
                                        <th>{translate('table.status')}</th>
                                        <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(typeof annualLeaves !== 'undefined' && annualLeaves.length !== 0) &&
                                        annualLeaves.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.startDate}</td>
                                                <td>{x.endDate}</td>
                                                <td>{x.reason}</td>
                                                <td>{translate(`sabbatical.${x.status}`)}</td>
                                                <td >
                                                    <a onClick={() => this.handleViewEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('discipline.edit_praise')}><i className="material-icons">edit</i></a>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteAnnualLeave(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {
                                (typeof annualLeaves === 'undefined' || annualLeaves.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </fieldset>
                    </div>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <SalaryEditModal
                        id={`editSalary${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        unit={this.state.currentRow.unit}
                        month={this.state.currentRow.month}
                        mainSalary={this.state.currentRow.mainSalary}
                        bonus={this.state.currentRow.bonus}
                        handleChange={this.handleEditSalary}
                    />
                }
                {
                    this.state.currentRowSabbatical !== undefined &&
                    <AnnualLeaveEditModal
                        id={`editSabbatical${this.state.currentRowSabbatical.index}`}
                        index={this.state.currentRowSabbatical.index}
                        startDate={this.state.currentRowSabbatical.startDate}
                        endDate={this.state.currentRowSabbatical.endDate}
                        reason={this.state.currentRowSabbatical.reason}
                        status={this.state.currentRowSabbatical.status}
                        handleChange={this.handleEditAnnualLeave}
                    />
                }
            </div>
        );
    }
};

const salaryTab = connect(null, null)(withTranslate(SalaryTab));
export { salaryTab as SalaryTab };