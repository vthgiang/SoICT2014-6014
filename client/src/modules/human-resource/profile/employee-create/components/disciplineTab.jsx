import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    ModalAddPraise, ModalEditPraise, ModalAddDiscipline, ModalEditDiscipline
} from './combinedContent';

class DisciplineTab extends Component {
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
    handleAddPraise = async (data) => {
        const { commendations } = this.state;
        await this.setState({
            commendations: [...commendations, {
                ...data
            }]
        })
        this.props.handleAddPraise(this.state.commendations)
    }
    // Function chỉnh sửa thông tin khen thưởng
    handleEditPraise = async (data) => {
        const { commendations } = this.state;
        commendations[data.index] = data;
        await this.setState({
            praise: commendations
        })
        this.props.handleEditPraise(this.state.commendations)
    }
    // Function bắt sự kiện xoá thông tin khen thưởng
    delete = async (index) => {
        var commendations = this.state.commendations;
        commendations.splice(index, 1);
        await this.setState({
            ...this.state,
            commendations: [...commendations]
        })
        this.props.handleDeletePraise(this.state.praise)
    }
    // Function thêm thông tin kỷ luật
    handleAddDiscipline = async (data) => {
        const { disciplines } = this.state;
        await this.setState({
            disciplines: [...disciplines, {
                ...data
            }]
        })
        this.props.handleAddDiscipline(this.state.disciplines)
    }
    // Function chỉnh sửa thông tin kỷ luật
    handleEditDiscipline = async (data) => {
        const { disciplines } = this.state;
        disciplines[data.index] = data;
        await this.setState({
            disciplines: disciplines
        })
        this.props.handleEditDiscipline(this.state.disciplines)
    }
    // Function bắt sự kiện xoá thông tin kỷ luật
    deleteDiscipline = async (index) => {
        var disciplines = this.state.disciplines;
        disciplines.splice(index, 1);
        await this.setState({
            ...this.state,
            disciplines: [...disciplines]
        })
        this.props.handleDeleteDiscipline(this.state.disciplines)
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
        const { id, translate } = this.props;
        const { commendations, disciplines } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.Reward')}</h4></legend>
                        <ModalAddPraise handleChange={this.handleAddPraise} id={`addPraise${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('page.number_decisions')}</th>
                                    <th>{translate('discipline.decision_day')}</th>
                                    <th>{translate('discipline.decision_unit')}</th>
                                    <th>{translate('discipline.reward_forms')}</th>
                                    <th>{translate('discipline.reason_praise')}</th>
                                    <th style={{width:'120px'}}>{translate('table.action')}</th>
                                </tr>

                            </thead>
                            <tbody>
                                {(typeof commendations !== 'undefined' && commendations.length !== 0) &&
                                    commendations.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.decisionNumber}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.organizationalUnit}</td>
                                            <td>{x.type}</td>
                                            <td>{x.reason}</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('discipline.edit_praise')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}

                            </tbody>
                        </table>
                        {
                            (typeof commendations === 'undefined' || commendations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.discipline')}</h4></legend>
                        <ModalAddDiscipline handleChange={this.handleAddDiscipline} id={`addDiscipline${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('page.number_decisions')}</th>
                                    <th>{translate('discipline.start_date')}</th>
                                    <th>{translate('discipline.end_date')}</th>
                                    <th>{translate('discipline.decision_unit')}</th>
                                    <th>{translate('discipline.discipline_forms')}</th>
                                    <th>{translate('discipline.reason_discipline')}</th>
                                    <th style={{width:'120px'}}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof disciplines !== 'undefined' && disciplines.length !== 0) &&
                                    disciplines.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.decisionNumber}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{x.organizationalUnit}</td>
                                            <td>{x.type}</td>
                                            <td>{x.reason}</td>
                                            <td>
                                                <a onClick={() => this.handleViewDiscipline(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('discipline.edit_praise')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.deleteDiscipline(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof disciplines === 'undefined' || disciplines.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ModalEditPraise
                        id={`editPraise${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        decisionNumber={this.state.currentRow.decisionNumber}
                        organizationalUnit={this.state.currentRow.organizationalUnit}
                        startDate={this.state.currentRow.startDate}
                        type={this.state.currentRow.type}
                        reason={this.state.currentRow.reason}
                        handleChange={this.handleEditPraise}
                    />
                }
                {
                    this.state.currentRowDiscipline !== undefined &&
                    <ModalEditDiscipline
                        id={`editDiscipline${this.state.currentRowDiscipline.index}`}
                        index={this.state.currentRowDiscipline.index}
                        decisionNumber={this.state.currentRowDiscipline.decisionNumber}
                        organizationalUnit={this.state.currentRowDiscipline.organizationalUnit}
                        startDate={this.state.currentRowDiscipline.startDate}
                        endDate={this.state.currentRowDiscipline.endDate}
                        type={this.state.currentRowDiscipline.type}
                        reason={this.state.currentRowDiscipline.reason}
                        handleChange={this.handleEditDiscipline}
                    />
                }
            </div>
        );
    }
};

const disciplineTab = connect(null, null)(withTranslate(DisciplineTab));
export { disciplineTab as DisciplineTab };