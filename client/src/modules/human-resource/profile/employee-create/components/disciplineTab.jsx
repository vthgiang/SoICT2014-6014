import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    ModalAddPraise, ModalEditPraise, ModalAddDiscipline, ModalEditDiscipline
} from './combinedContent';

class TabRearDisciplineContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
        const { praise } = this.state;
        await this.setState({
            praise: [...praise, {
                ...data
            }]
        })
        this.props.handleAddPraise(this.state.praise)
    }
    // Function chỉnh sửa thông tin khen thưởng
    handleEditPraise = async (data) => {
        const { praise } = this.state;
        praise[data.index] = data;
        await this.setState({
            praise: praise
        })
        this.props.handleEditPraise(this.state.praise)
    }
    // Function bắt sự kiện xoá thông tin khen thưởng
    delete = async (index) => {
        var praise = this.state.praise;
        praise.splice(index, 1);
        await this.setState({
            ...this.state,
            praise: [...praise]
        })
        this.props.handleDeletePraise(this.state.praise)
    }
    // Function thêm thông tin kỷ luật
    handleAddDiscipline = async (data) => {
        const { discipline } = this.state;
        await this.setState({
            discipline: [...discipline, {
                ...data
            }]
        })
        this.props.handleAddDiscipline(this.state.discipline)
    }
    // Function chỉnh sửa thông tin kỷ luật
    handleEditDiscipline = async (data) => {
        const { discipline } = this.state;
        discipline[data.index] = data;
        await this.setState({
            discipline: discipline
        })
        this.props.handleEditDiscipline(this.state.discipline)
    }
    // Function bắt sự kiện xoá thông tin kỷ luật
    deleteDiscipline = async (index) => {
        var discipline = this.state.discipline;
        discipline.splice(index, 1);
        await this.setState({
            ...this.state,
            discipline: [...discipline]
        })
        this.props.handleDeleteDiscipline(this.state.discipline)
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                praise: nextProps.praise,
                discipline: nextProps.discipline,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { praise, discipline } = this.state;
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
                                {(typeof praise !== 'undefined' && praise.length !== 0) &&
                                    praise.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.number}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.unit}</td>
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
                            (typeof praise === 'undefined' || praise.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
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
                                {(typeof discipline !== 'undefined' && discipline.length !== 0) &&
                                    discipline.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.number}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{x.unit}</td>
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
                            (typeof discipline === 'undefined' || discipline.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ModalEditPraise
                        id={`editPraise${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        number={this.state.currentRow.number}
                        startDate={this.state.currentRow.startDate}
                        unit={this.state.currentRow.unit}
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
                        number={this.state.currentRowDiscipline.number}
                        unit={this.state.currentRowDiscipline.unit}
                        startDate={this.state.currentRowDiscipline.startDate}
                        unit={this.state.currentRowDiscipline.unit}
                        type={this.state.currentRowDiscipline.type}
                        reason={this.state.currentRowDiscipline.reason}
                        endDate={this.state.currentRowDiscipline.endDate}
                        handleChange={this.handleEditDiscipline}
                    />
                }
            </div>
        );
    }
};

const tabRearDiscipline = connect(null, null)(withTranslate(TabRearDisciplineContent));
export { tabRearDiscipline as TabRearDisciplineContent };