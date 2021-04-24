import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { CommendationAddModal, CommendationEditModal, DisciplineAddModal, DisciplineEditModal } from './combinedContent';

function DisciplineTab(props) {

    const [state, setState] = useState({

    });

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
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

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                commendations: props.commendations,
                disciplines: props.disciplines,
            }
        })
    }, [props.id])

    const { id, translate, department } = props;

    const { commendations, disciplines, currentRow, currentRowDiscipline } = state;


    /**
     * Bắt sự kiện click edit khen thưởng
     * @param {*} value : Dữ liệu khen thưởng muốn chỉnh sửa
     * @param {*} index : Số thứ tự khen thưởng
     */
    const handleEdit = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-praise-editPraise${index}`).modal('show');
    }

    /**
     * Bắt sự kiện click edit kỷ luật
     * @param {*} value : Dữ liệu kỷ luật
     * @param {*} index : Số thứ tự thông tin kỷ luật
     */
    const handleViewDiscipline = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRowDiscipline: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-discipline-editDiscipline${index}`).modal('show');
    }

    /**
     * Function thêm thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     */
    const handleAddConmmendation = async (data) => {
        const { commendations } = state;
        await setState({
            ...state,
            commendations: [...commendations, {
                ...data
            }]
        })
        props.handleAddConmmendation([...commendations, {
            ...data
        }], data);
    }

    /**
     * Function chỉnh sửa thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     */
    const handleEditConmmendation = async (data) => {
        let { commendations } = state;
        commendations[data.index] = data;
        await setState({
            ...state,
            commendations: commendations
        })
        props.handleEditConmmendation(commendations, data);
    }

    /**
     * Function bắt sự kiện xoá thông tin khen thưởng
     * @param {*} index : Số thứ tự thông tin khen thưởng cần xoá
     */
    const handleDeleteConmmendation = async (index) => {
        let commendations = state.commendations;
        let data = commendations[index];
        commendations.splice(index, 1);
        await setState({
            ...state,
            commendations: [...commendations]
        })
        props.handleDeleteConmmendation([...commendations], data);
    }

    /**
     * Function thêm thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     */
    const handleAddDiscipline = async (data) => {
        const { disciplines } = state;
        await setState({
            ...state,
            disciplines: [...disciplines, {
                ...data
            }]
        })
        props.handleAddDiscipline([...disciplines, {
            ...data
        }], data)
    }

    /**
     * Function chỉnh sửa thông tin kỷ luật
     * @param {*} data : Thông tin kỷ luật cần chỉnh sửa
     */
    const handleEditDiscipline = async (data) => {
        let { disciplines } = state;
        disciplines[data.index] = data;
        await setState({
            ...state,
            disciplines: disciplines
        })
        props.handleEditDiscipline(disciplines, data)
    }

    /**
     * Function bắt sự kiện xoá thông tin kỷ luật
     * @param {*} index : Số thứ tự thông tin kỷ luật
     */
    const handleDeleteDiscipline = async (index) => {
        let { disciplines } = state;
        let data = disciplines[index];
        disciplines.splice(index, 1);
        await setState({
            ...state,
            disciplines: [...disciplines]
        })
        props.handleDeleteDiscipline([...disciplines], data)
    }

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                {/* Danh sách khen thưởng */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.reward')}</h4></legend>
                    <CommendationAddModal handleChange={handleAddConmmendation} id={`addPraise${id}`} />
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
                                <th>{translate('human_resource.commendation_discipline.commendation.table.decision_date')}</th>
                                <th>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}</th>
                                <th>{translate('human_resource.commendation_discipline.commendation.table.reward_forms')}</th>
                                <th>{translate('human_resource.commendation_discipline.commendation.table.reason_praise')}</th>
                                <th style={{ width: '120px' }}>{translate('table.action')}</th>
                            </tr>

                        </thead>
                        <tbody>
                            {commendations && commendations.length !== 0 &&
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
                                            <td>{formatDate(x.startDate)}</td>
                                            <td>{nameUnit}</td>
                                            <td>{x.type}</td>
                                            <td>{x.reason}</td>
                                            <td>
                                                <a onClick={() => handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.commendation_discipline.commendation.delete_commendation')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteConmmendation(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                    {
                        (!commendations || commendations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>
                {/* Danh sách kỷ luật */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.discipline')}</h4></legend>
                    <DisciplineAddModal handleChange={handleAddDiscipline} id={`addDiscipline${id}`} />
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
                                <th>{translate('human_resource.commendation_discipline.discipline.table.start_date')}</th>
                                <th>{translate('human_resource.commendation_discipline.discipline.table.end_date')}</th>
                                <th>{translate('human_resource.commendation_discipline.commendation.table.decision_unit')}</th>
                                <th>{translate('human_resource.commendation_discipline.discipline.table.discipline_forms')}</th>
                                <th>{translate('human_resource.commendation_discipline.discipline.table.reason_discipline')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disciplines && disciplines.length !== 0 &&
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
                                            <td>{formatDate(x.startDate)}</td>
                                            <td>{formatDate(x.endDate)}</td>
                                            <td>{nameUnit}</td>
                                            <td>{x.type}</td>
                                            <td>{x.reason}</td>
                                            <td>
                                                <a onClick={() => handleViewDiscipline(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.commendation_discipline.discipline.edit_discipline')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteDiscipline(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                    {
                        (!disciplines || disciplines.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>
            </div>
            {   /** Form chỉnh sửa thông tin khen thưởng */
                currentRow !== undefined &&
                <CommendationEditModal
                    id={`editPraise${currentRow.index}`}
                    _id={currentRow._id}
                    index={currentRow.index}
                    decisionNumber={currentRow.decisionNumber}
                    organizationalUnit={currentRow.organizationalUnit}
                    startDate={formatDate(currentRow.startDate)}
                    type={currentRow.type}
                    reason={currentRow.reason}
                    handleChange={handleEditConmmendation}
                />
            }
            {   /** Form chỉnh sửa thông tin kỷ luật */
                currentRowDiscipline !== undefined &&
                <DisciplineEditModal
                    id={`editDiscipline${currentRowDiscipline.index}`}
                    _id={currentRowDiscipline._id}
                    index={currentRowDiscipline.index}
                    decisionNumber={currentRowDiscipline.decisionNumber}
                    organizationalUnit={currentRowDiscipline.organizationalUnit}
                    startDate={formatDate(currentRowDiscipline.startDate)}
                    endDate={formatDate(currentRowDiscipline.endDate)}
                    type={currentRowDiscipline.type}
                    reason={currentRowDiscipline.reason}
                    handleChange={handleEditDiscipline}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { department } = state;
    return { department };
};

const disciplineTab = connect(mapState, null)(withTranslate(DisciplineTab));
export { disciplineTab as DisciplineTab };