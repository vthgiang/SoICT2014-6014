import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-redux-multilingual/lib/utils';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { formatYearMonth } from '../../../../../../helpers/formatDate';
import { workScheduleActions } from '../../../work-schedule/redux/actions';
import './workSchedule.css';

class WorkScheduleComponent extends Component {
    constructor(props) {
        super(props);
        let currentDate = Date.now();
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


    static getDerivedStateFromProps = (props, state) => {
        if (props.manufacturingMillId !== state.manufacturingMillId) {
            props.getAllWorkSchedulesByMillId(props.manufacturingMillId);
            return {
                ...state,
                manufacturingMillId: props.manufacturingMillId
            }
        }
        return null;
    }

    getCurrentWorkSchedule = () => {
        const { month } = this.state;
        const { workSchedule } = this.props;
        let currentWorkSchedule = undefined;
        if (workSchedule.listWorkSchedulesOfMill) {
            currentWorkSchedule = workSchedule.listWorkSchedulesOfMill.filter(x => formatYearMonth(x.month) === month);
        }
        return currentWorkSchedule[0];
    }



    render() {
        const { workSchedule, manufacturingMillName, translate } = this.props;
        const { allDaysOfMonth, month } = this.state;
        let listWorkSchedulesOfMill = [];
        let currentWorkSchedule = undefined;
        if (workSchedule.listWorkSchedulesOfMill && workSchedule.isLoading === false) {
            listWorkSchedulesOfMill = workSchedule.listWorkSchedulesOfMill;
            currentWorkSchedule = listWorkSchedulesOfMill.filter(x => formatYearMonth(x.month) === month)[0];
        }
        console.log(listWorkSchedulesOfMill);
        console.log(currentWorkSchedule);

        return (
            <div className="box box-primary" style={{ border: "1px solid black" }}>
                <div className="box-header with-border">
                    <div className="box-title">{translate('manufacturing.plan.work_schedule')} {manufacturingMillName} {translate('manufacturing.plan.month_lower_case')} {month}</div>
                    <div className="box-content" style={{ marginTop: "1rem" }}>
                        <table className="plan-table-custom plan-table-custom-bordered">
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
                                <tr>
                                    <td>{translate('manufacturing.work_schedule.turn_1')}</td>
                                    {
                                        // currentWorkSchedule && currentWorkSchedule.turns[0].map((day, index) => (
                                        //     <td key={index}>
                                        //         <div className="plan-checkbox-custom">
                                        //             <input type="checkbox" onChange={() => this.handleCheckBoxChange()} />
                                        //         </div>
                                        //     </td>
                                        // ))
                                        currentWorkSchedule && currentWorkSchedule.turns[0].map((command, index) => {
                                            if (command !== null)
                                                return (
                                                    <td key={index}>
                                                        {/* <input type="checkbox" disabled={true} style={{ backgroundColor: translate(`manufacturing.work_schedule.${command.status}.color`) }}>
                                                        </input> */}
                                                        <span className="icon" style={{ backgroundColor: "red" }}></span>
                                                    </td>
                                                )

                                            return (
                                                <td key={index}>
                                                    {/* <input type="checkbox" disabled={true} /> */}
                                                    <span className="icon" style={{ backgroundColor: "white" }}></span>
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{translate('manufacturing.work_schedule.turn_2')}</td>
                                    {
                                        allDaysOfMonth.map((day, index) => (
                                            <td key={index}>
                                                <div className="plan-checkbox-custom">
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange('shift1s', index)} />
                                                </div>
                                            </td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <td>{translate('manufacturing.work_schedule.turn_3')}</td>
                                    {
                                        allDaysOfMonth.map((day, index) => (
                                            <td key={index}>
                                                <div className="plan-checkbox-custom">
                                                    <input type="checkbox" onChange={() => this.handleCheckBoxChange('shift1s', index)} />
                                                </div>
                                            </td>
                                        ))
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="pull-right" style={{ marginBottom: "10px", marginTop: "10px" }}>
                        <button className="btn" style={{ marginLeft: "10px", backgroundColor: "#3C8DBC", color: "#FFF" }} onClick={this.handleClearCommand}>{"< Trước"}</button>
                        <button className="btn" style={{ marginLeft: "10px", backgroundColor: "#3C8DBC", color: "#FFF" }} onClick={this.handleClearCommand}>{"Sau >"}</button>
                    </div>
                </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    const { workSchedule } = state;
    return { workSchedule }
}

const mapDispatchToProps = {
    getAllWorkSchedulesByMillId: workScheduleActions.getAllWorkSchedulesByMillId
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(WorkScheduleComponent));