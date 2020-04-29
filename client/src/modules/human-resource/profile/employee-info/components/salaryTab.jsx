import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class SalaryTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.historySalary')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('table.month')}</th>
                                    <th>{translate('salary_employee.main_salary')}</th>
                                    <th>{translate('table.total_salary')}</th>
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
                                                <td>{formater.format(parseInt(x.mainSalary))} {x.unit}</td>
                                                <td>
                                                    {
                                                        (typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
                                                            formater.format(parseInt(x.mainSalary)) :
                                                            formater.format(total + parseInt(x.mainSalary))
                                                    } {x.unit}
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
                        <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">{translate('manage_employee.sabbatical')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('table.start_date')}</th>
                                    <th>{translate('table.end_date')}</th>
                                    <th>{translate('sabbatical.reason')}</th>
                                    <th>{translate('table.status')}</th>
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

        );
    }
};

const salaryTab = connect(null, null)(withTranslate(SalaryTab));
export { salaryTab as SalaryTab };