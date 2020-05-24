import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class DisciplineTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.Reward')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('page.number_decisions')}</th>
                                    <th>{translate('discipline.decision_day')}</th>
                                    <th>{translate('discipline.decision_unit')}</th>
                                    <th>{translate('discipline.reward_forms')}</th>
                                    <th>{translate('discipline.reason_praise')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof commendations !== 'undefined' && commendations.length !== 0) &&
                                    commendations.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.decisionNumber}</td>
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{x.organizationalUnit}</td>
                                            <td>{x.type}</td>
                                            <td>{x.reason}</td>
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
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('page.number_decisions')}</th>
                                    <th>{translate('discipline.start_date')}</th>
                                    <th>{translate('discipline.end_date')}</th>
                                    <th>{translate('discipline.decision_unit')}</th>
                                    <th>{translate('discipline.discipline_forms')}</th>
                                    <th>{translate('discipline.reason_discipline')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof disciplines !== 'undefined' && disciplines.length !== 0) &&
                                    disciplines.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.decisionNumber}</td>
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
                                            <td>{x.organizationalUnit}</td>
                                            <td>{x.type}</td>
                                            <td>{x.reason}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof disciplines === 'undefined' || disciplines.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>

                </div>
            </div>
        );
    }
};

const tabRearDiscipline = connect(null, null)(withTranslate(DisciplineTab));
export { tabRearDiscipline as DisciplineTab };