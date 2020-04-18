import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    ModalAddSalary, ModalEditSalary,
    ModalAddSabbatical, ModalEditSabbatical,
} from './CombineContent';

class TabSalaryContent extends Component {
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
        const { salary } = this.state;
        let check = [];
        check = salary.filter(x => (x.month === data.month));
        if (check.length !== 0) {
            console.log("Tháng lương đã tồn tại");
        } else {
            await this.setState({
                salary: [...salary, {
                    ...data
                }]
            })
            this.props.handleAddSalary(this.state.salary);
        }
    }
    // Function chỉnh sửa thông tin lịch sử lương
    handleEditSalary = async (data) => {
        const { salary } = this.state;
        salary[data.index] = data;
        await this.setState({
            salary: salary
        })
        this.props.handleEditSalary(this.state.salary);
    }
    // Function xoá bảng lương
    deleteSalary = async (index) => {
        var { salary } = this.state;
        salary.splice(index, 1);
        await this.setState({
            ...this.state,
            salary: [...salary]
        })
        this.props.handleDeleteSalary(this.state.salary);
    }
    // Function thêm thông tin nghỉ phép
    handleAddSabbatical = async (data) => {
        const { sabbatical } = this.state;
        await this.setState({
            sabbatical: [...sabbatical, {
                ...data
            }]
        })
        this.props.handleAddSabbatical(this.state.sabbatical);
    }
    // Function chỉnh sửa thông tin nghỉ phép
    handleEditSabbatical = async (data) => {
        const { sabbatical } = this.state;
        sabbatical[data.index] = data;
        await this.setState({
            sabbatical: sabbatical
        })
        this.props.handleEditSabbatical(this.state.sabbatical);
    }
    // Function xoá thông tin nghỉ phép
    deleteSabbatical = async (index) => {
        var { sabbatical } = this.state;
        sabbatical.splice(index, 1);
        await this.setState({
            ...this.state,
            sabbatical: [...sabbatical]
        })
        this.props.handleDeleteSabbatical(this.state.sabbatical);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                salary: nextProps.salary,
                sabbatical: nextProps.sabbatical,
            }
        } else {
            return null;
        }
    }
    render() {
        var formater = new Intl.NumberFormat();
        const { id, translate } = this.props;
        const { sabbatical, salary } = this.state;
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
                                    {(typeof salary !== 'undefined' && salary.length !== 0) &&
                                        salary.map((x, index) => {
                                            let mainSalary = x.mainSalary.slice(0, x.mainSalary.length - 3);
                                            if (x.bonus.length !== 0) {
                                                var total = 0;
                                                for (let count in x.bonus) {
                                                    total = total + parseInt(x.bonus[count].number)
                                                }
                                            }
                                            var unit = x.mainSalary.slice(x.mainSalary.length - 3, x.mainSalary.length);
                                            return (
                                                <tr key={index}>
                                                    <td>{x.month}</td>
                                                    <td>{mainSalary} {unit}</td>
                                                    <td>
                                                        {
                                                            (typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
                                                                formater.format(parseInt(mainSalary)) :
                                                                formater.format(total + parseInt(mainSalary))
                                                        } {unit}
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
                                (typeof salary === 'undefined' || salary.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.sabbatical')}</h4></legend>
                            <ModalAddSabbatical handleChange={this.handleAddSabbatical} id={`addSabbatical${id}`} />
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
                                    {(typeof sabbatical !== 'undefined' && sabbatical.length !== 0) &&
                                        sabbatical.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.startDate}</td>
                                                <td>{x.endDate}</td>
                                                <td>{x.reason}</td>
                                                <td>{translate(`sabbatical.${x.status}`)}</td>
                                                <td >
                                                    <a onClick={() => this.handleViewEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('discipline.edit_praise')}><i className="material-icons">edit</i></a>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.deleteSabbatical(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {
                                (typeof sabbatical === 'undefined' || sabbatical.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                        </fieldset>
                    </div>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ModalEditSalary
                        id={`editSalary${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        unit={this.state.currentRow.mainSalary.slice(-3, this.state.currentRow.mainSalary.length)}
                        month={this.state.currentRow.month}
                        mainSalary={this.state.currentRow.mainSalary.slice(0, this.state.currentRow.mainSalary.length - 3)}
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
                        handleChange={this.handleEditSabbatical}
                    />
                }
            </div>
        );
    }
};

const tabSalary = connect(null, null)(withTranslate(TabSalaryContent));
export { tabSalary as TabSalaryContent };