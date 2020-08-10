import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class SalaryTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày cần format
     * @param {*} monthYear : true trả về dạng ngày tháng, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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
        const { translate } = this.props;

        const { id } = this.props;

        const { annualLeaves, salaries } = this.state;

        let formater = new Intl.NumberFormat();
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.historySalary')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('human_resource.month')}</th>
                                    <th>{translate('human_resource.salary.table.main_salary')}</th>
                                    <th>{translate('human_resource.salary.table.total_salary')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries && salaries.length !== 0 &&
                                    salaries.map((x, index) => {
                                        if (x.bonus.length !== 0) {
                                            var total = 0;
                                            for (let count in x.bonus) {
                                                total = total + parseInt(x.bonus[count].number)
                                            }
                                        }
                                        return (
                                            <tr key={index}>
                                                <td>{this.formatDate(x.month, true)}</td>
                                                <td>{formater.format(parseInt(x.mainSalary))} {x.unit}</td>
                                                <td>
                                                    {
                                                        (!x.bonus || x.bonus.length === 0) ?
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
                            (!salaries || salaries.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
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
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
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