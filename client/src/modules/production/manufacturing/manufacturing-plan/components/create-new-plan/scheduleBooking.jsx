import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, ErrorLabel, SelectBox } from '../../../../../../common-components';
import { millActions } from '../../../manufacturing-mill/redux/actions';
import WorkScheduleComponent from '../plan-component/workScheduleComponent';
import WorkSchedule from '../../../work-schedule/components';
import MillProductivity from '../plan-component/millProductivity';
import HistoryCommandTable from './historyCommandTable';
import { workScheduleActions } from '../../../work-schedule/redux/actions';

class MillScheduleBooking extends Component {
    constructor(props) {
        super(props);
        this.EMPTY_COMMAND = {
            manufacturingMill: "1",
            startDate: "",
            endDate: "",
            startTurn: "",
            endTurn: "",
            responsibles: []
        }
        this.state = {
            booking: false,
            command: Object.assign({}, this.EMPTY_COMMAND),
            manufacturingCommands: this.props.manufacturingCommands
        }
    }

    componentDidMount = () => {
        const { startDate, endDate, manufacturingMill } = this.props;
        const { listMills } = manufacturingMill;
        const listMillIds = listMills.map(x => x._id);
        const data = {
            startDate: startDate,
            endDate: endDate,
            manufacturingMills: listMillIds
        }
        this.props.getAllWorkSchedulesOfManufacturingWork(data);
    }

    handleShowCommandHistory = async (goodId) => {
        await this.setState({
            goodId: goodId
        })
        window.$('#history-command-table').modal('show');
    }
    handleBookingCommand = (command, index) => {
        command.manufacturingMill = "1";
        this.setState((state) => ({
            ...state,
            command: Object.assign(this.EMPTY_COMMAND, command),
            booking: true,
            indexBooking: index,
        }));
    }

    getManufacturingMillsArray = () => {
        const { translate, manufacturingMill } = this.props;
        let manufacturingMillArr = [{
            value: "1",
            text: translate('manufacturing.plan.choose_mill')
        }];
        const { listMills } = manufacturingMill;
        if (listMills) {
            listMills.map(x => {
                manufacturingMillArr.push({
                    value: x._id,
                    text: x.name
                });
            });
        }
        return manufacturingMillArr;
    }

    handleManufacturingMillChange = (value) => {
        const manufacturingMill = value[0];
        this.validateManufacturingMillChange(manufacturingMill, true);
    }

    validateManufacturingMillChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "1") {
            msg = translate('manufacturing.plan.choose_mill_error')
        }

        const { command } = this.state;
        let millCanNotManufacturingGood = true;
        command.good.manufacturingMills.map(x => {
            if (x.manufacturingMill._id === value) {
                millCanNotManufacturingGood = false;
            }
        });

        if (millCanNotManufacturingGood) {
            msg = translate('manufacturing.plan.choose_mill_error_on_good')
        }


        if (willUpdateState) {
            const { command } = this.state;
            command.manufacturingMill = value;
            this.setState({
                command: { ...command },
                manufacturingMillError: msg
            });
        }
    }
    // Tim ra good trong listGoods
    // Tim ra productivity cua Mill trong good
    // Chia command.quantity cho productivity lam tron ra ket qua tra ve
    getTurnNumberSuggest = () => {
        const { command } = this.state;
        let turnNumberSuggest = "";
        command.good.manufacturingMills.map(x => {
            if (x.manufacturingMill._id === command.manufacturingMill) {
                turnNumberSuggest = Math.round(command.quantity / x.productivity) ? Math.round(command.quantity / x.productivity) : 1;
            }
        });
        return turnNumberSuggest;
    }

    getWorkerNumberSuggest = () => {
        const { command } = this.state;
        let workerNumberSuggest = "";
        command.good.manufacturingMills.map(x => {
            if (x.manufacturingMill._id === command.manufacturingMill) {
                workerNumberSuggest = x.personNumber;
            }
        });
        return workerNumberSuggest;
    }

    getManufacturingMillNameById = () => {
        const { manufacturingMill } = this.props;
        const { command } = this.state;
        const { listMills } = manufacturingMill;
        let mill = listMills.filter(x => x._id === command.manufacturingMill);
        return mill[0].name;
    }

    static getDerivedStateFromProps = (props, state) => {
        if (props.workSchedule.listWorkSchedulesOfWorks && props.workSchedule.isLoading === false) {
            const { manufacturingMill, workSchedule } = props;
            const { listMills } = manufacturingMill;
            const listMillIds = listMills.map(x => x._id);
            var listSchedulesMap = new Map();
            listMillIds.map(x => {
                let workSchedulesOfMill = workSchedule.listWorkSchedulesOfWorks.filter(y => y.manufacturingMill === x);
                listSchedulesMap.set(x, workSchedulesOfMill);
            })
            return {
                ...state,
                startDate: props.startDate,
                endDate: props.endDate,
                listWorkSchedulesOfWorks: listSchedulesMap
            }
        }
    }

    handleChangeStartDateEndDate = (startDate, startTurn, endDate, endTurn) => {
        const { command } = this.state;
        command.startDate = startDate;
        command.startTurn = startTurn;
        command.endDate = endDate;
        command.endTurn = endTurn;
        this.setState({
            command: { ...command }
        });
    }

    handleCancelEditCommand = (e) => {
        e.preventDefault();
        this.setState({
            command: Object.assign({}, this.EMPTY_COMMAND),
            booking: false,
            listWorkSchedulesOfWorks: this.state.listWorkSchedulesOfWorks
        });
    }

    handleClearCommand = (e) => {
        e.preventDefault();
    }

    render() {
        const { translate, listGoods } = this.props;
        const { command, manufacturingCommands, manufacturingMillError, listWorkSchedulesOfWorks } = this.state;
        console.log(listWorkSchedulesOfWorks);
        return (
            <React.Fragment>
                {
                    <HistoryCommandTable goodId={this.state.goodId} />
                }
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <WorkSchedule />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <MillProductivity listGoods={listGoods} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing.plan.manufacturing_command_info')}</legend>
                            <table className="table not-sort">
                                <thead>
                                    <tr>
                                        <th>{translate('manufacturing.plan.index')}</th>
                                        <th>{translate('manufacturing.plan.command_code')}</th>
                                        <th>{translate('manufacturing.plan.good_code')}</th>
                                        <th>{translate('manufacturing.plan.good_name')}</th>
                                        <th>{translate('manufacturing.plan.base_unit')}</th>
                                        <th>{translate('manufacturing.plan.quantity')}</th>
                                        <th>{translate('manufacturing.plan.history_info')}</th>
                                        <th>{translate('manufacturing.plan.status')}</th>
                                        <th>{translate('general.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        manufacturingCommands && manufacturingCommands.length === 0
                                            ?
                                            <tr><td colSpan={7}>{translate('general.no_data')}</td></tr>
                                            :
                                            manufacturingCommands.map((command, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{command.code}</td>
                                                    <td>{command.good.code}</td>
                                                    <td>{command.good.name}</td>
                                                    <td>{command.good.baseUnit}</td>
                                                    <td>{command.quantity}</td>
                                                    <td>
                                                        <a className="text-green" title={translate('manufacturing.plan.history_info')} onClick={() => this.handleShowCommandHistory(command.good._id)}>
                                                            <i className="material-icons">visibility</i>
                                                        </a>
                                                    </td>
                                                    <td></td>
                                                    <td>
                                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manufacturing.plan.schedule_booking')}
                                                            onClick={() => this.handleBookingCommand(command, index)}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                    }
                                </tbody>
                            </table>
                        </fieldset>
                    </div>
                </div>
                {
                    this.state.booking &&
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manufacturing.plan.schedule_booking')}</legend>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className={`form-group`}>
                                            <label>{translate('manufacturing.plan.command_code')}</label>
                                            <input type="text" disabled={true} value={command.code} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className={`form-group`}>
                                            <label>{translate('manufacturing.plan.good_name')}</label>
                                            <input type="text" disabled={true} value={command.good.name} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className={`form-group`}>
                                            <label>{translate('manufacturing.plan.quantity')}</label>
                                            <input type="text" disabled={true} value={command.quantity} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className={`form-group ${!manufacturingMillError ? "" : "has-error"}`}>
                                            <label>{translate('manufacturing.plan.choose_mill')}<span className="attention"> * </span></label>
                                            <SelectBox
                                                id={`select-mill-command-create`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value={command.manufacturingMill}
                                                items={this.getManufacturingMillsArray()}
                                                onChange={this.handleManufacturingMillChange}
                                                multiple={false}
                                            />
                                            <ErrorLabel content={manufacturingMillError} />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className={`form-group`}>
                                            <label>{translate('manufacturing.plan.turn_number_suggest')}</label>
                                            <input type="text" value={command.manufacturingMill ? this.getTurnNumberSuggest() : ""} disabled={true} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                        <div className={`form-group`}>
                                            <label>{translate('manufacturing.plan.worker_number_suggest')}</label>
                                            <input type="text" disabled={true} value={command.manufacturingMill ? this.getWorkerNumberSuggest() : ""} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                                        <div className={`form-group`}>
                                            <label>{translate('manufacturing.plan.start_date_command')}<span className="attention"> * </span></label>
                                            <DatePicker
                                                id={`command_start_date_booking`}
                                                // dateFormat={dateFormat}
                                                value={command.startDate}
                                                onChange={this.handleStartDateChange}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                                        <div className={`form-group`}>
                                            <label>{translate('manufacturing.plan.start_turn')}<span className="attention"> * </span></label>
                                            <input type="text" disabled={true} value={command.startTurn ? translate('manufacturing.plan.turn') + command.startTurn : ""} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                                        <div className={`form-group`}>
                                            <label>{translate('manufacturing.plan.end_date_command')}<span className="attention"> * </span></label>
                                            <DatePicker
                                                id={`command_end_date_booking`}
                                                // dateFormat={dateFormat}
                                                value={command.endDate}
                                                onChange={this.handleStartDateChange}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                                        <div className={`form-group`}>
                                            <label>{translate('manufacturing.plan.end_turn')}<span className="attention"> * </span></label>
                                            <input type="text" disabled={true} value={command.endTurn ? translate('manufacturing.plan.turn') + command.endTurn : ""} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                {
                                    command.manufacturingMill !== "1" && !manufacturingMillError &&
                                    <WorkScheduleComponent
                                        manufacturingMillId={command.manufacturingMill}
                                        command={command}
                                        listWorkSchedulesOfMill={listWorkSchedulesOfWorks.get(command.manufacturingMill)}
                                        manufacturingMillName={this.getManufacturingMillNameById()}
                                        startDate={this.props.startDate}
                                        onChangeStartDateEndDate={this.handleChangeStartDateEndDate}
                                    />
                                }
                                {
                                    this.state.command.startDate &&
                                    <div className="row">
                                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                            <div className={`form-group`}>
                                                <label>{translate('manufacturing.plan.responsible')}<span className="attention"> * </span></label>
                                                <SelectBox
                                                    id="select-responsible-of-command"
                                                    className="form-control select"
                                                    style={{ width: "100%" }}
                                                    items={[{
                                                        value: 1, text: "ban a"
                                                    }, {
                                                        value: 2, text: "ban b"
                                                    }]}
                                                    disabled={false}
                                                    onChange={this.handleApproversChange}
                                                    value={command.responsibles}
                                                    multiple={true}
                                                />
                                                <ErrorLabel content={""} />
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="pull-right" style={{ marginBottom: "10px" }}>
                                    <React.Fragment>
                                        <button className="btn btn-success" onClick={this.handleCancelEditCommand} style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.cancel_editing_good')}</button>
                                        <button className="btn btn-success" onClick={this.handleSaveEditCommand} style={{ marginLeft: "10px" }}>{translate('manufacturing.purchasing_request.save_good')}</button>
                                    </React.Fragment>
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearCommand}>{translate('manufacturing.purchasing_request.delete_good')}</button>
                                </div>

                            </fieldset>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingMill, workSchedule } = state;
    return { manufacturingMill, workSchedule }
}

const mapDispatchToProps = {
    getAllWorkSchedulesOfManufacturingWork: workScheduleActions.getAllWorkSchedulesOfManufacturingWork,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MillScheduleBooking));