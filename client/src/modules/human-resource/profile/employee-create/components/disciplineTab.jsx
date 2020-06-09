import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    CommendationAddModal, CommendationEditModal, DisciplineAddModal, DisciplineEditModal
} from './combinedContent';

class DisciplineTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
    // Bắt sự kiện click edit khen thưởng
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-praise-editPraise${index}`).modal('show');
    }
    // Bắt sự kiện click edit kỷ luật
    handleViewDiscipline = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowDiscipline: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-discipline-editDiscipline${index}`).modal('show');
    }

    // Function thêm thông tin khen thưởng
    handleAddConmmendation = async (data) => {
        const { commendations } = this.state;
        await this.setState({
            commendations: [...commendations, {
                ...data
            }]
        })
        this.props.handleAddConmmendation(this.state.commendations, data);
    }
    // Function chỉnh sửa thông tin khen thưởng
    handleEditConmmendation = async (data) => {
        const { commendations } = this.state;
        commendations[data.index] = data;
        await this.setState({
            praise: commendations
        })
        this.props.handleEditConmmendation(this.state.commendations, data);
    }
    // Function bắt sự kiện xoá thông tin khen thưởng
    handleDeleteConmmendation = async (index) => {
        var commendations = this.state.commendations;
        var data = commendations[index];
        commendations.splice(index, 1);
        await this.setState({
            ...this.state,
            commendations: [...commendations]
        })
        this.props.handleDeleteConmmendation(this.state.praise, data);
    }
    // Function thêm thông tin kỷ luật
    handleAddDiscipline = async (data) => {
        const { disciplines } = this.state;
        await this.setState({
            disciplines: [...disciplines, {
                ...data
            }]
        })
        this.props.handleAddDiscipline(this.state.disciplines, data)
    }
    // Function chỉnh sửa thông tin kỷ luật
    handleEditDiscipline = async (data) => {
        const { disciplines } = this.state;
        disciplines[data.index] = data;
        await this.setState({
            disciplines: disciplines
        })
        this.props.handleEditDiscipline(this.state.disciplines, data)
    }
    // Function bắt sự kiện xoá thông tin kỷ luật
    handleDeleteDiscipline = async (index) => {
        var disciplines = this.state.disciplines;
        var data = disciplines[index];
        disciplines.splice(index, 1);
        await this.setState({
            ...this.state,
            disciplines: [...disciplines]
        })
        this.props.handleDeleteDiscipline(this.state.disciplines, data)
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                commendations: nextProps.commendations,
                disciplines: nextProps.disciplines,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate, department } = this.props;
        const { commendations, disciplines } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.Reward')}</h4></legend>
                        <CommendationAddModal handleChange={this.handleAddConmmendation} id={`addPraise${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('page.number_decisions')}</th>
                                    <th>{translate('discipline.decision_day')}</th>
                                    <th>{translate('discipline.decision_unit')}</th>
                                    <th>{translate('discipline.reward_forms')}</th>
                                    <th>{translate('discipline.reason_praise')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                </tr>

                            </thead>
                            <tbody>
                                {(typeof commendations !== 'undefined' && commendations.length !== 0) &&
                                    commendations.map((x, index) => {
                                        let nameUnit;
                                        department.list.forEach(u => {
                                            if (u._id === x.organizationalUnit) {
                                                nameUnit = u.name;
                                            }
                                        })
                                        return (
                                            <tr key={index}>
                                                <td>{x.decisionNumber}</td>
                                                <td>{this.formatDate(x.startDate)}</td>
                                                <td>{nameUnit}</td>
                                                <td>{x.type}</td>
                                                <td>{x.reason}</td>
                                                <td>
                                                    <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('discipline.edit_praise')}><i className="material-icons">edit</i></a>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteConmmendation(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                        {
                            (typeof commendations === 'undefined' || commendations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.discipline')}</h4></legend>
                        <DisciplineAddModal handleChange={this.handleAddDiscipline} id={`addDiscipline${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('page.number_decisions')}</th>
                                    <th>{translate('discipline.start_date')}</th>
                                    <th>{translate('discipline.end_date')}</th>
                                    <th>{translate('discipline.decision_unit')}</th>
                                    <th>{translate('discipline.discipline_forms')}</th>
                                    <th>{translate('discipline.reason_discipline')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof disciplines !== 'undefined' && disciplines.length !== 0) &&
                                    disciplines.map((x, index) => {
                                        let nameUnit;
                                        department.list.forEach(u => {
                                            if (u._id === x.organizationalUnit) {
                                                nameUnit = u.name;
                                            }
                                        })
                                        return (
                                            <tr key={index}>
                                                <td>{x.decisionNumber}</td>
                                                <td>{this.formatDate(x.startDate)}</td>
                                                <td>{this.formatDate(x.endDate)}</td>
                                                <td>{nameUnit}</td>
                                                <td>{x.type}</td>
                                                <td>{x.reason}</td>
                                                <td>
                                                    <a onClick={() => this.handleViewDiscipline(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('discipline.edit_praise')}><i className="material-icons">edit</i></a>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteDiscipline(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                        {
                            (typeof disciplines === 'undefined' || disciplines.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <CommendationEditModal
                        id={`editPraise${this.state.currentRow.index}`}
                        _id={this.state.currentRow._id}
                        index={this.state.currentRow.index}
                        decisionNumber={this.state.currentRow.decisionNumber}
                        organizationalUnit={this.state.currentRow.organizationalUnit}
                        startDate={this.formatDate(this.state.currentRow.startDate)}
                        type={this.state.currentRow.type}
                        reason={this.state.currentRow.reason}
                        handleChange={this.handleEditConmmendation}
                    />
                }
                {
                    this.state.currentRowDiscipline !== undefined &&
                    <DisciplineEditModal
                        id={`editDiscipline${this.state.currentRowDiscipline.index}`}
                        _id={this.state.currentRowDiscipline._id}
                        index={this.state.currentRowDiscipline.index}
                        decisionNumber={this.state.currentRowDiscipline.decisionNumber}
                        organizationalUnit={this.state.currentRowDiscipline.organizationalUnit}
                        startDate={this.formatDate(this.state.currentRowDiscipline.startDate)}
                        endDate={this.formatDate(this.state.currentRowDiscipline.endDate)}
                        type={this.state.currentRowDiscipline.type}
                        reason={this.state.currentRowDiscipline.reason}
                        handleChange={this.handleEditDiscipline}
                    />
                }
            </div>
        );
    }
};
function mapState(state) {
    const { department } = state;
    return { department };
};
const disciplineTab = connect(mapState, null)(withTranslate(DisciplineTab));
export { disciplineTab as DisciplineTab };