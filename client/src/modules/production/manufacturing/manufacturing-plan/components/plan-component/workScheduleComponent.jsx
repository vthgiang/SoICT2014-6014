import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { formatToTimeZoneDate, formatYearMonth } from '../../../../../../helpers/formatDate';
import ManufacturingCommandDetailInfo from '../../../manufacturing-command/components/manufacturingCommandDetailInfo';
import './workSchedule.css';

class WorkScheduleComponent extends Component {
    constructor(props) {
        super(props);
        let currentDate = new Date(formatToTimeZoneDate(this.props.startDate));
        let currentMonthYear = formatYearMonth(currentDate);
        let allDaysOfMonth = this.getAllDaysOfMonth(currentMonthYear);
        this.state = {
            month: currentMonthYear,
            allDaysOfMonth: allDaysOfMonth,
        }
    }

    getAllDaysOfMonth = (month) => {
        let arrayMonthYear = month.split("-");
        let lastDaysOfMonth = new Date(arrayMonthYear[1], arrayMonthYear[0], 0);
        let days = lastDaysOfMonth.getDate();

        let arrayDayOfMonth = [];
        for (let i = 1; i <= days; i++) {
            arrayDayOfMonth.push(i);
        }
        return arrayDayOfMonth;
    }

    handleShowDetailManufacturingCommand = async (command) => {
        await this.setState((state) => ({
            ...state,
            commandDetail: command
        }));
        window.$('#modal-detail-info-manufacturing-command-4').modal('show');
    }

    handleNextMonth = async (e) => {
        e.preventDefault();
        let allDaysOfMonth = this.getAllDaysOfMonth("02-2021");
        await this.setState({
            month: "02-2021",
            allDaysOfMonth: allDaysOfMonth
        });
    }

    handlePreMonth = async (e) => {
        e.preventDefault();
        let allDaysOfMonth = this.getAllDaysOfMonth("01-2021");
        await this.setState({
            month: "01-2021",
            allDaysOfMonth: allDaysOfMonth
        });
    }




    render() {
        const { manufacturingMillName, translate, listWorkSchedulesOfMill } = this.props;
        const { allDaysOfMonth, month } = this.state;
        const currentWorkSchedule = listWorkSchedulesOfMill ? listWorkSchedulesOfMill.filter(x => formatYearMonth(x.month) === month)[0] : undefined;
        const arrayStatus = [0, 6, 1, 2, 3, 4, 5];
        return (
            <div className="box box-primary" style={{ border: "1px solid black" }}>
                <div className="box-header with-border">
                    {
                        <ManufacturingCommandDetailInfo idModal={4} commandDetail={this.state.commandDetail} />
                    }
                    <div className="box-title">{translate('manufacturing.plan.work_schedule')} {manufacturingMillName} {translate('manufacturing.plan.month_lower_case')} {month}</div>
                    <div className="box-header" style={{ textAlign: "center" }}>
                        <div className="form-inline">
                            {
                                arrayStatus.map((status, index) => (
                                    <span key={index}>
                                        <span className="icon" title={translate(`manufacturing.work_schedule.${status}.content`)} style={{ backgroundColor: translate(`manufacturing.work_schedule.${status}.color`), verticalAlign: "middle" }}>
                                        </span>
                                        <span style={{ verticalAlign: "middle" }}>
                                            &emsp;
                                    {
                                                translate(`manufacturing.work_schedule.${status}.content`)
                                            }
                                    &emsp;&emsp;
                                </span>
                                    </span>

                                ))
                            }
                        </div>
                    </div>
                    <div className="box-content" style={{ marginTop: "1rem" }}>
                        <table className="plan-table-custom plan-table-custom-bordered not-sort">
                            <thead>
                                <tr>
                                    <th rowSpan={2} style={{ backgroundColor: "#F0F0F0", width: "10%" }}>{translate('manufacturing.work_schedule.work_turns')}</th>
                                    <th colSpan={allDaysOfMonth.length} style={{ backgroundColor: "#3C8DBC", color: "#FFFFFF" }}>{translate('manufacturing.plan.month_upper_case')} {month}</th>
                                </tr>
                                <tr>
                                    {
                                        allDaysOfMonth.map((day, index) => (
                                            <td key={index}>{day}</td>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    currentWorkSchedule
                                        ?
                                        currentWorkSchedule.turns.map((turn, index1) => (
                                            <tr key={index1}>
                                                <td>{translate(`manufacturing.work_schedule.turn_${index1 + 1}`)}</td>
                                                {
                                                    turn.map((command, index2) => {
                                                        if (command !== null)
                                                            return (
                                                                <td key={index2} className="tooltip-checkbox">
                                                                    <div className="plan-checkbox-custom">
                                                                        <input type="checkbox" disabled={true}
                                                                            title={translate(`manufacturing.work_schedule.${command.status}.content`)} style={{ backgroundColor: translate(`manufacturing.work_schedule.${command.status}.color`) }}
                                                                        />
                                                                    </div>
                                                                    <span className="tooltiptext"><a style={{ color: "white", cursor: "pointer" }} onClick={() => this.handleShowDetailManufacturingCommand(command)}>{command.code}</a></span>
                                                                </td>
                                                            )

                                                        return (
                                                            <td key={index2}>
                                                                <div className="plan-checkbox-custom">
                                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange()}
                                                                    />
                                                                </div>
                                                            </td>
                                                        );
                                                    })
                                                }
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td colSpan={allDaysOfMonth.length + 1}>
                                                {translate('general.no_data')}
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {
                        currentWorkSchedule &&
                        <div className="pull-right" style={{ marginBottom: "10px", marginTop: "10px" }}>
                            <button className="btn" style={{ marginLeft: "10px", backgroundColor: "#3C8DBC", color: "#FFF" }} onClick={this.handlePreMonth}>{`< ${translate('manufacturing.plan.prev')}`}</button>
                            <button className="btn" style={{ marginLeft: "10px", backgroundColor: "#3C8DBC", color: "#FFF" }} onClick={this.handleNextMonth}>{`${translate('manufacturing.plan.next')} >`}</button>
                        </div>
                    }
                </div>
            </div>

        )
    }
}


export default connect(null, null)(withTranslate(WorkScheduleComponent));