import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { formatToTimeZoneDate, formatYearMonth } from '../../../../../../helpers/formatDate';
import ManufacturingCommandDetailInfo from '../../../manufacturing-command/components/manufacturingCommandDetailInfo';
import './workSchedule.css';
import moment from 'moment';
import { translate } from 'react-redux-multilingual/lib/utils';

class WorkScheduleComponent extends Component {
    constructor(props) {
        super(props);
        this.TURNS_NUMBER = 3;
        let currentDate = new Date(formatToTimeZoneDate(this.props.startDate));
        let currentMonthYear = formatYearMonth(currentDate);
        let allDaysOfMonth = this.getAllDaysOfMonth(currentMonthYear);
        this.state = {
            month: currentMonthYear,
            allDaysOfMonth: allDaysOfMonth,
            // Chỉ số bắt đầu của các ca mỗi tháng => validate các ca liền nhau hay không
            startOfIndex: 0,
            // Mảng 1 chiều để validate các ca liền nhau
            arrayValidate: [],
            // listWorkSchedulesOfMill: [...this.props.listWorkSchedulesOfMill]
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
        let { month, startOfIndex } = this.state;
        startOfIndex += this.getAllDaysOfMonth(month).length * this.TURNS_NUMBER;
        const nextMonth = moment(formatToTimeZoneDate(month)).add(1, 'months').format('MM-YYYY');
        let allDaysOfMonth = this.getAllDaysOfMonth(nextMonth);
        await this.setState({
            month: nextMonth,
            allDaysOfMonth: allDaysOfMonth,
            startOfIndex: startOfIndex
        });
    }

    handlePreMonth = async (e) => {
        e.preventDefault();
        let { month, startOfIndex } = this.state;
        const preMonth = moment(formatToTimeZoneDate(month)).subtract(1, 'months').format('MM-YYYY');
        startOfIndex -= this.getAllDaysOfMonth(preMonth).length * this.TURNS_NUMBER;
        let allDaysOfMonth = this.getAllDaysOfMonth(preMonth);
        await this.setState({
            month: preMonth,
            allDaysOfMonth: allDaysOfMonth,
            startOfIndex: startOfIndex
        });
    }

    findIndex = (array, month) => {
        let result = -1;
        array.map((x, index) => {
            if (formatYearMonth(x.month) === month) {
                result = index;
            }
        });
        return result;
    }

    handleCheckBoxChange = async (index1, index2) => {
        let { listWorkSchedulesOfMill, month, startOfIndex, arrayValidate } = this.state;
        const index = this.findIndex(listWorkSchedulesOfMill, month);
        listWorkSchedulesOfMill[index].turns[index1][index2] = (listWorkSchedulesOfMill[index].turns[index1][index2] === null) ? this.props.command : null;
        if (listWorkSchedulesOfMill[index].turns[index1][index2] !== null) {
            let indexOfArray = startOfIndex + this.TURNS_NUMBER * index2 + index1;
            arrayValidate[indexOfArray] = true;
        } else {
            let indexOfArray = startOfIndex + this.TURNS_NUMBER * index2 + index1;
            arrayValidate[indexOfArray] = undefined;
        }
        await this.setState({
            listWorkSchedulesOfMill: [...listWorkSchedulesOfMill],
            arrayValidate: [...arrayValidate],
            bookingMillError: this.validateCheckBoxChange(arrayValidate)
        });
    }

    validateCheckBoxChange = (arrayValidate) => {
        let msg = undefined;
        const { translate } = this.props;
        let arrayKey = [];
        for (let i = 0; i < arrayValidate.length; i++) {
            if (arrayValidate[i] === true) {
                arrayKey.push(i);
            }
        }
        for (let j = 0; j < arrayKey.length; j++) {
            if (arrayKey.length > 1 && (j !== (arrayKey.length - 1)) && ((arrayKey[j + 1] - arrayKey[j]) !== 1)) {
                msg = translate('manufacturing.plan.booking_mill_error');
            }
        }
        if (msg || arrayKey.length === 0) {
            this.props.onChangeStartDateEndDate("", "", "", "");
        } else {
            this.handleSendStartDateEndDate(arrayValidate);
        }
        if (arrayKey.length === 0) {
            msg = translate('manufacturing.plan.please_booking_mill');
        }
        return msg;
    }

    handleSendStartDateEndDate = (arrayValidate) => {
        // Xử lý truyền ngày bđ ngày kt lên thằng cha
        let arrayKey = [];
        for (let i = 0; i < arrayValidate.length; i++) {
            if (arrayValidate[i] === true) {
                arrayKey.push(i);
            }
        }
        const startIndex = arrayKey[0];
        const endIndex = arrayKey[arrayKey.length - 1];
        const startDate = this.getDateFromIndex(startIndex);
        const startTurn = startIndex % this.TURNS_NUMBER + 1;
        const endDate = this.getDateFromIndex(endIndex);
        const endTurn = endIndex % this.TURNS_NUMBER + 1;
        this.props.onChangeStartDateEndDate(startDate, startTurn, endDate, endTurn);
    }

    // Dựa vào số chỉ số ngày mà tính ra được đó là ngày nào
    getDateFromIndex = (index) => {
        const { listWorkSchedulesOfMill } = this.state;
        let startIndexOfMonth = 0;
        for (let i = 0; i < listWorkSchedulesOfMill.length; i++) {
            const month = formatYearMonth(listWorkSchedulesOfMill[i].month);
            const arangeOfMonth = startIndexOfMonth + this.getAllDaysOfMonth(month).length * this.TURNS_NUMBER;
            const startIndexOfNextMonth = startIndexOfMonth + arangeOfMonth;
            if (index >= startIndexOfMonth && index < startIndexOfNextMonth) {
                const startDate = parseInt((index - startIndexOfMonth) / this.TURNS_NUMBER) + 1;
                const startDay = (startDate < 10) ? "0" + startDate + "-" + month : startDate + "-" + month;
                return startDay;
            } else {
                startIndexOfMonth = startIndexOfNextMonth;
            }
        }
    }

    checkBoxChecked = (index1, index2) => {
        const { listWorkSchedulesOfMill, month } = this.state;
        const index = this.findIndex(listWorkSchedulesOfMill, month);
        if (listWorkSchedulesOfMill[index].turns[index1][index2] === null) {
            return false;
        }
        return true;
    }

    checkBoxDisabled = (index1, index2) => {
        const { listWorkSchedulesOfMill, month } = this.state;
        const { command } = this.props;
        const index = this.findIndex(listWorkSchedulesOfMill, month);
        const schedule = listWorkSchedulesOfMill[index].turns[index1][index2];
        if (schedule && schedule.code === command.code) {
            return false;
        }
        if (!schedule) {
            return false;
        }
        return true;
    }

    static getDerivedStateFromProps = (props, state) => {
        if (props.listWorkSchedulesOfMill !== state.listWorkSchedulesOfMill) {
            return {
                ...state,
                listWorkSchedulesOfMill: [...props.listWorkSchedulesOfMill]
            }
        }
        return null;
    }

    render() {
        const { manufacturingMillName, translate } = this.props;
        const { allDaysOfMonth, month, listWorkSchedulesOfMill } = this.state;
        console.log(listWorkSchedulesOfMill);
        console.log(this.props.listWorkSchedulesOfMill);
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
                                    currentWorkSchedule && currentWorkSchedule.turns
                                        ?
                                        currentWorkSchedule.turns.map((turn, index1) => (
                                            <tr key={index1}>
                                                <td>{translate(`manufacturing.work_schedule.turn_${index1 + 1}`)}</td>
                                                {
                                                    turn.map((command, index2) => {
                                                        if (command !== null && command.status)
                                                            return (
                                                                <td key={index2} className="tooltip-checkbox">
                                                                    <div className="plan-checkbox-custom">
                                                                        <input type="checkbox" disabled={true}
                                                                            title={translate(`manufacturing.work_schedule.${command.status}.content`)}
                                                                            style={{ backgroundColor: translate(`manufacturing.work_schedule.${command.status}.color`) }}
                                                                        />
                                                                    </div>
                                                                    <span className="tooltiptext"><a style={{ color: "white", cursor: "pointer" }} onClick={() => this.handleShowDetailManufacturingCommand(command)}>{command.code}</a></span>
                                                                </td>
                                                            )

                                                        return (
                                                            <td key={index2}>
                                                                <div className="plan-checkbox-custom">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={this.checkBoxChecked(index1, index2)}
                                                                        onChange={() => this.handleCheckBoxChange(index1, index2)}
                                                                        disabled={this.checkBoxDisabled(index1, index2)}
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
                            {
                                !(formatYearMonth(listWorkSchedulesOfMill[0].month) === month) && <button className="btn" style={{ marginLeft: "10px", backgroundColor: "#3C8DBC", color: "#FFF" }} onClick={this.handlePreMonth}>{`< ${translate('manufacturing.plan.prev')}`}</button>
                            }
                            {
                                listWorkSchedulesOfMill.length > 1 && !(formatYearMonth(listWorkSchedulesOfMill[listWorkSchedulesOfMill.length - 1].month) === month) && <button className="btn" style={{ marginLeft: "10px", backgroundColor: "#3C8DBC", color: "#FFF" }} onClick={this.handleNextMonth}>{`${translate('manufacturing.plan.next')} >`}</button>
                            }
                        </div>
                    }

                    {
                        this.state.bookingMillError &&
                        <div className="pull-left form-group has-error" style={{ marginBottom: "10px" }}>
                            <label>{this.state.bookingMillError}<span className="attention"> * </span></label>
                        </div>
                    }

                </div>
            </div>

        )
    }
}


export default connect(null, null)(withTranslate(WorkScheduleComponent));