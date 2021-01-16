import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, SelectBox, SlimScroll } from '../../../../../../common-components';
import { formatToTimeZoneDate, formatYearMonth } from '../../../../../../helpers/formatDate';
import { workScheduleActions } from '../../redux/actions';

class ManufacturingMillScheduleCreateForm extends Component {
    constructor(props) {
        super(props);
        let currentDate = Date.now();
        let currentMonthYear = formatYearMonth(currentDate);
        let allDaysOfMonth = this.getAllDaysOfMonth(currentMonthYear);
        this.state = {
            month: currentMonthYear,
            allDaysOfMonth: allDaysOfMonth,
            numberOfTurns: 4,
            manufacturingMill: 'all'
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


    handleMonthChange = (value) => {
        let allDaysOfMonth = this.getAllDaysOfMonth(value);
        this.setState((state) => ({
            ...state,
            month: value,
            allDaysOfMonth: allDaysOfMonth
        }));
    }

    getListManufacturingMills = () => {
        const { translate, manufacturingMill } = this.props;
        let listMillsArray = [{
            value: 'all',
            text: translate('manufacturing.work_schedule.choose_all_mill')
        }];

        const { listMills } = manufacturingMill;
        if (listMills) {
            listMills.map((mill, index) => {
                listMillsArray.push({
                    value: mill._id,
                    text: mill.code + " - " + mill.name
                })
            });
        }

        return listMillsArray
    }

    handleManufacturingMillChange = (value) => {
        const manufacturingMill = value[0];
        this.setState((state) => ({
            ...state,
            manufacturingMill: manufacturingMill
        }))
    }

    // handleNumberOfTurnsChange = (e) => {
    //     const { value } = e.target;
    //     this.setState((state) => ({
    //         ...state,
    //         numberOfTurns: value
    //     }))
    // }

    save = () => {
        let { manufacturingMill, month, numberOfTurns } = this.state;
        let data = {};
        if (manufacturingMill === "all") {
            data = {
                allManufacturingMill: true,
                month: formatToTimeZoneDate(month),
                numberOfTurns: numberOfTurns,
                currentRole: localStorage.getItem("currentRole")
            }
        } else {
            data = {
                manufacturingMill: manufacturingMill,
                month: formatToTimeZoneDate(month),
                numberOfTurns: numberOfTurns,
                currentRole: localStorage.getItem("currentRole")
            }
        }

        this.props.createWorkSchedule(data);
    }

    render() {
        const { translate, workSchedule } = this.props;
        const { manufacturingMill, month, allDaysOfMonth, numberOfTurns } = this.state;
        // Tao mang cac ca
        let turns = []
        for (let i = 1; i <= numberOfTurns; i++) {
            turns.push(i)
        }
        return (
            < React.Fragment >
                <ButtonModal modalID="modal-create-mill-work-schedule" button_name={translate('manufacturing.work_schedule.add_work_schedule_button')} title={translate('manufacturing.work_schedule.add_work_schedule')} />
                <DialogModal
                    modalID="modal-create-mill-work-schedule" isLoading={workSchedule.isLoading}
                    formID="form-create-mill-work-schedule"
                    title={translate('manufacturing.work_schedule.add_work_schedule_mill')}
                    msg_success={translate('manufacturing.work_schedule.create_successfully')}
                    msg_faile={translate('manufacturing.work_schedule.create_failed')}
                    func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    hasNote={false}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-mill-work-schedule">
                        <div className={`form-group`}>
                            <label>{translate('manufacturing.work_schedule.manufacturingMill')}</label>
                            <SelectBox
                                id={`select-manufacturingMill-create-work-schedule`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={manufacturingMill}
                                items={this.getListManufacturingMills()}
                                onChange={this.handleManufacturingMillChange}
                                multiple={false}
                            />
                        </div>
                        <div className={`form-group`}>
                            <label>{translate('manufacturing.work_schedule.month')}</label>
                            <DatePicker
                                id={`work-schedule-create-month`}
                                value={month}
                                dateFormat={"month-year"}
                                onChange={this.handleMonthChange}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.work_schedule.number_turns')}<span className="text-red">*</span></label>
                            <input type="number" disabled={true} value={numberOfTurns} className="form-control" onChange={this.handleNumberOfTurnsChange}></input>
                        </div>
                        <div id="create-croll-table" className="form-inline">
                            <table id="create-work-schedule-table" className="table table-striped table-bordered table-hover not-sort">
                                <thead>
                                    <tr>
                                        <th style={{ width: 100 }}>{translate('manufacturing.work_schedule.work_turns')}</th>
                                        {
                                            allDaysOfMonth.map((day, index) => (
                                                <th key={index}>{day}</th>
                                            ))

                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        turns.map((turn, index) => {
                                            return (
                                                <tr key={index}>

                                                    <td>{translate(`manufacturing.work_schedule.turn_${turn}`)}</td>
                                                    {
                                                        allDaysOfMonth.map((day, index2) =>
                                                            (
                                                                <td key={index2}>
                                                                    <input type="checkbox" disabled={true} />
                                                                </td>
                                                            )
                                                        )
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <SlimScroll outerComponentId='create-croll-table' innerComponentId='create-work-schedule-table' innerComponentWidth={1000} activate={true} />
                    </form>
                </DialogModal>
            </React.Fragment >
        )

    }


}

function mapStateToProps(state) {
    const { workSchedule, manufacturingMill } = state;
    return { workSchedule, manufacturingMill }
}

const mapDispatchToProps = {
    createWorkSchedule: workScheduleActions.createWorkSchedule
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingMillScheduleCreateForm));