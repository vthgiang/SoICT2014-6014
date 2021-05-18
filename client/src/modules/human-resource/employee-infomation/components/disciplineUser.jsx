import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DisciplineActions } from "../../commendation-discipline/redux/actions";


function DisciplineUser(props) {
    useEffect(() => {
        if (props.unitId) {
            props.getListDiscipline({ organizationalUnits: props.unitId, employeeName: props.user.name, startDate: props.startDate, endDate: props.endDate, page: 0, limit: 100000 })
        }
    }, [props.user._id])
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
    const { discipline, translate } = props
    let { listDisciplines } = discipline
    return (
        <React.Fragment>
            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                <thead>
                    <tr>
                        <th>{translate('human_resource.commendation_discipline.discipline.table.start_date')}</th>
                        <th>{translate('human_resource.commendation_discipline.discipline.table.end_date')}</th>
                        <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
                        <th>{translate('human_resource.commendation_discipline.discipline.table.discipline_forms')}</th>
                        <th>{translate('human_resource.commendation_discipline.discipline.table.reason_discipline')}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listDisciplines && listDisciplines.length !== 0 &&
                        listDisciplines.map((x, index) => {
                            return (
                                <tr key={index}>
                                    <td>{formatDate(x.startDate)}</td>
                                    <td>{formatDate(x.endDate)}</td>
                                    <td>{x.decisionNumber}</td>
                                    <td>{x.type}</td>
                                    <td>{x.reason}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            {
                discipline.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listDisciplines || listDisciplines.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
        </React.Fragment>
    )
}
function mapState(state) {
    const { discipline } = state;
    return { discipline }
}

const mapDispatchToProps = {
    getListDiscipline: DisciplineActions.getListDiscipline
}



export default connect(mapState, mapDispatchToProps)(withTranslate(DisciplineUser));