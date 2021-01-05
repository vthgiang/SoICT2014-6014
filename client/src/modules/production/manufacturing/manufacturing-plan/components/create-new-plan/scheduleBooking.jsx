import React, { Component } from 'react';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import WorkSchedule from '../../../work-schedule/components';
import HistoryCommandTable from './historyCommandTable';

class MillScheduleBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleShowCommandHistory = async (goodId) => {
        await this.setState({
            goodId: goodId
        })
        window.$('#history-command-table').modal('show');
    }
    render() {
        const { translate, listGoods, manufacturingCommands } = this.props;
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
                                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manufacturing.plan.schedule_booking')}>
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
                {/* <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <MillProductivity listGoods={listGoods} />
                    </div>
                </div> */}
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing.plan.schedule_booking')}</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manufacturing.plan.command_code')}</label>
                                        <input type="text" disabled={true} className="form-control" />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className={`form-group`}>
                                        <label>{translate('manufacturing.plan.command_code')}</label>
                                        <input type="text" disabled={true} className="form-control" />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </React.Fragment>


        );
    }
}

export default withTranslate(MillScheduleBooking);