import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    ModalAddSalary, ModalEditSalary,
    ModalAddSabbatical, ModalEditSabbatical,
} from './combinedContent';

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
        const { salarys } = this.state;
        let check = [];
        check = salarys.filter(x => (x.month === data.month));
        if (check.length !== 0) {
            console.log("Tháng lương đã tồn tại");
        } else {
            await this.setState({
                salarys: [...salarys, {
                    ...data
                }]
            })
            this.props.handleAddSalary(this.state.salary);
        }
    }
    // Function chỉnh sửa thông tin lịch sử lương
    handleEditSalary = async (data) => {
        const { salarys } = this.state;
        salarys[data.index] = data;
        await this.setState({
            salarys: salarys
        })
        this.props.handleEditSalary(this.state.salarys);
    }
    // Function xoá bảng lương
    deleteSalary = async (index) => {
        var { salarys } = this.state;
        salarys.splice(index, 1);
        await this.setState({
            ...this.state,
            salarys: [...salarys]
        })
        this.props.handleDeleteSalary(this.state.salarys);
    }
    // Function thêm thông tin nghỉ phép
    handleAddAnnualLeaves = async (data) => {
        const { annualLeaves } = this.state;
        await this.setState({
            annualLeaves: [...annualLeaves, {
                ...data
            }]
        })
        this.props.handleAddSabbatical(this.state.annualLeaves);
    }
    // Function chỉnh sửa thông tin nghỉ phép
    handleEditAnnualLeaves = async (data) => {
        const { annualLeaves } = this.state;
        annualLeaves[data.index] = data;
        await this.setState({
            annualLeaves: annualLeaves
        })
        this.props.handleEditSabbatical(this.state.annualLeaves);
    }
    // Function xoá thông tin nghỉ phép
    deleteAnnualLeaves = async (index) => {
        var { annualLeaves } = this.state;
        annualLeaves.splice(index, 1);
        await this.setState({
            ...this.state,
            annualLeaves: [...annualLeaves]
        })
        this.props.handleDeleteSabbatical(this.state.annualLeaves);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                salarys: nextProps.salarys,
                annualLeaves: nextProps.annualLeaves,
            }
        } else {
            return null;
        }
    }
    render() {
        var formater = new Intl.NumberFormat();
        const { id, translate } = this.props;
        const { annualLeaves, salarys } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <div className=" row col-md-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.historySalary')}</h4></legend>
                            <ModalAddSalary handleChange={this.handleAddSalary} id={`addSalary${id}`} />
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
                                    {(typeof salarys !== 'undefined' && salarys.length !== 0) &&
                                        salarys.map((x, index) => {
                                            if (x.bonus.length !== 0) {
                                                var total = 0;
                                                for (let count in x.bonus) {
                                                    total = total + parseInt(x.bonus[count].number)
                                                }
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td>{x.month}</td>
                                                    <td>{x.mainSalary} {x.unit}</td>
                                                    <td>
                                                        {
                                                            (typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
                                                                formater.format(parseInt(x.mainSalary)) :
                                                                formater.format(total + parseInt(x.mainSalary))
                                                        } {x.unit}
                                                    </td>
                                                    <td>
                                                        <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('salary_employee.edit_salary')}><i className="material-icons">edit</i></a>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.deleteSalary(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {
                                (typeof salarys === 'undefined' || salarys.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.sabbatical')}</h4></legend>
                            <ModalAddSabbatical handleChange={this.handleAddAnnualLeaves} id={`addSabbatical${id}`} />
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
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.deleteAnnualLeaves(index)}><i className="material-icons"></i></a>
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
                    <ModalEditSalary
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
                    <ModalEditSabbatical
                        id={`editSabbatical${this.state.currentRowSabbatical.index}`}
                        index={this.state.currentRowSabbatical.index}
                        startDate={this.state.currentRowSabbatical.startDate}
                        endDate={this.state.currentRowSabbatical.endDate}
                        reason={this.state.currentRowSabbatical.reason}
                        status={this.state.currentRowSabbatical.status}
                        handleChange={this.handleEditAnnualLeaves}
                    />
                }
            </div>
        );
    }
};

const salaryTab = connect(null, null)(withTranslate(SalaryTab));
export { salaryTab as SalaryTab };