import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting, DatePicker, DialogModal, PaginateBar, SelectMulti } from '../../../../../../common-components';
import { formatDate } from '../../../../../../helpers/formatDate';
import ManufacturingCommandDetailInfo from '../../../manufacturing-command/components/manufacturingCommandDetailInfo';
import { commandActions } from '../../../manufacturing-command/redux/actions';
import { millActions } from '../../../manufacturing-mill/redux/actions';

class HistoryCommandTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            quantity_gt: '',
            quantity_lt: '',
            fromDate: '',
            toDate: '',
            manufacturingMills: '',
            currentRole: localStorage.getItem('currentRole')
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.goodId !== nextProps.goodId) {
            const data = {
                page: this.state.page,
                limit: this.state.limit,
                good: nextProps.goodId,
                currentRole: this.state.currentRole
            }
            this.props.getAllManufacturingCommands(data);
            // this.props.getAllManufacturingMills(data);
            return false;
        }
        return true;
    }

    handleStartDateChange = (value) => {
        this.setState({
            fromDate: value
        });
    }

    handleEndDateChange = (value) => {
        this.setState({
            toDate: value
        });
    }

    handleQuantityGTChange = (e) => {
        const { value } = e.target;
        this.setState({
            quantity_gt: value
        });
    }

    handleQuantityLTChange = (e) => {
        const { value } = e.target;
        this.setState({
            quantity_lt: value
        })
    }

    getListMillsArr = () => {
        const { manufacturingMill } = this.props;
        let listMillsArr = [];
        const { listMills } = manufacturingMill;
        if (listMills) {
            listMills.map(x => {
                listMillsArr.push({
                    value: x._id,
                    text: x.name
                });
            });
        }
        return listMillsArr;
    }

    handleManufacturingMillChange = (value) => {
        this.setState({
            manufacturingMills: value
        })
    }

    setPage = async (page) => {
        await this.setState({
            page: page,
            good: this.props.goodId
        });
        this.props.getAllManufacturingCommands(this.state);
    }

    setLimit = async (limit) => {
        await this.setState({
            limit: limit,
            good: this.props.goodId
        });
        this.props.getAllManufacturingCommands(this.state);
    }

    handleSubmitSearch = () => {
        const { currentRole, page, limit, fromDate,
            toDate, manufacturingMills, quantity_gt, quantity_lt } = this.state;
        const data = {
            currentRole: currentRole,
            page: page,
            limit: limit,
            fromDate: fromDate,
            toDate: toDate,
            manufacturingMills: manufacturingMills,
            quantity_gt: quantity_gt,
            quantity_lt: quantity_lt,
            good: this.props.goodId
        }
        this.props.getAllManufacturingCommands(data);
    }

    handleShowDetailManufacturingCommand = async (command) => {
        await this.setState((state) => ({
            ...state,
            commandDetail: command
        }));
        window.$('#modal-detail-info-manufacturing-command-3').modal('show');
    }

    render() {
        const { translate, manufacturingCommand } = this.props;
        const { quantity_gt, quantity_lt, fromDate, toDate } = this.state
        const { totalPages, page } = manufacturingCommand;
        let listCommands = [];
        if (manufacturingCommand.listCommands && manufacturingCommand.isLoading === false) {
            listCommands = manufacturingCommand.listCommands
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`history-command-table`} isLoading={this.props.manufacturingCommand.isLoading}
                    title={translate('manufacturing.plan.history_info')}
                    formID={`form-history-command-table`}
                    size={75}
                    maxWidth={600}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    {
                        <ManufacturingCommandDetailInfo idModal={3} commandDetail={this.state.commandDetail} />
                    }
                    <form id={`form-history-command-table`}>
                        <div className="box-body qlcv">
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">{translate('manufacturing.command.quantity_gt')}</label>
                                    <input type="number" className="form-control" value={quantity_gt} onChange={this.handleQuantityGTChange} placeholder="50" autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-static">{translate('manufacturing.command.quantity_lt')}</label>
                                    <input type="number" className="form-control" value={quantity_lt} onChange={this.handleQuantityLTChange} placeholder="200" autoComplete="off" />
                                </div>
                            </div>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">{translate('manufacturing.command.from_date')}</label>
                                    <DatePicker
                                        id={`start-date-command-history-table`}
                                        value={fromDate}
                                        onChange={this.handleStartDateChange}
                                        disabled={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-static">{translate('manufacturing.command.to_date')}</label>
                                    <DatePicker
                                        id={`end-date-command-hostory-table`}
                                        value={toDate}
                                        onChange={this.handleEndDateChange}
                                        disabled={false}
                                    />
                                </div>
                            </div>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">{translate('manufacturing.command.mills')}</label>
                                    <SelectMulti
                                        id={`select-multi-mills-command-history`}
                                        multiple="multiple"
                                        options={{ nonSelectedText: translate('manufacturing.command.choose_mills'), allSelectedText: translate('manufacturing.plan.choose_all') }}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={this.getListMillsArr()}
                                        onChange={this.handleManufacturingMillChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-static"></label>
                                    <button type="button" className="btn btn-success" title={translate('manufacturing.command.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.command.search')}</button>
                                </div>
                            </div>
                            <table id="manufacturing-command-table" className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>{translate('manufacturing.command.index')}</th>
                                        <th>{translate('manufacturing.command.code')}</th>
                                        {/* <th>{translate('manufacturing.command.plan_code')}</th> */}
                                        <th>{translate('manufacturing.command.good_name')}</th>
                                        <th>{translate('manufacturing.command.good_base_unit')}</th>
                                        <th>{translate('manufacturing.command.quantity')}</th>
                                        <th>{translate('manufacturing.command.accountables')}</th>
                                        <th>{translate('manufacturing.command.mill')}</th>
                                        <th>{translate('manufacturing.command.start_date')}</th>
                                        <th>{translate('manufacturing.command.end_date')}</th>
                                        <th>{translate('manufacturing.command.status')}</th>
                                        <th style={{ width: "120px", textAlign: "center" }}>{translate('general.action')}
                                            <DataTableSetting
                                                tableId="manufacturing-command-table"
                                                columnArr={[
                                                    translate('manufacturing.command.index'),
                                                    translate('manufacturing.command.code'),
                                                    // translate('manufacturing.command.plan_code'),
                                                    translate('manufacturing.command.good_name'),
                                                    translate('manufacturing.command.good_base_unit'),
                                                    translate('manufacturing.command.quantity'),
                                                    translate('manufacturing.command.accountables'),
                                                    translate('manufacturing.command.mill'),
                                                    translate('manufacturing.command.start_date'),
                                                    translate('manufacturing.command.end_date'),
                                                    translate('manufacturing.command.status')
                                                ]}
                                                limit={this.state.limit}
                                                hideColumnOption={true}
                                                setLimit={this.setLimit}
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(listCommands && listCommands.length !== 0) &&
                                        listCommands.map((command, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{command.code}</td>
                                                {/* <td>{command.manufacturingPlan !== undefined && command.manufacturingPlan.code}</td> */}
                                                <td>{command.good && command.good.good.name}</td>
                                                <td>{command.good && command.good.good.baseUnit}</td>
                                                <td>{command.good && command.good.quantity}</td>
                                                <td>{command.accountables && command.accountables.map((acc, index) => {
                                                    if (command.accountables.length === index + 1)
                                                        return acc.name;
                                                    return acc.name + ", "
                                                })}</td>
                                                <td>{command.manufacturingMill && command.manufacturingMill.name}</td>
                                                <td>{translate('manufacturing.command.turn') + " " + command.startTurn + " " + translate('manufacturing.command.day') + " " + formatDate(command.startDate)}</td>
                                                < td > {translate('manufacturing.command.turn') + " " + command.endTurn + " " + translate('manufacturing.command.day') + " " + formatDate(command.endDate)}</td>
                                                <td style={{ color: translate(`manufacturing.command.${command.status}.color`) }}>{translate(`manufacturing.command.${command.status}.content`)}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <a style={{ width: '5px' }} title={translate('manufacturing.command.command_detail')} onClick={() => { this.handleShowDetailManufacturingCommand(command) }}><i className="material-icons">view_list</i></a>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            {manufacturingCommand.isLoading ?
                                <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                (typeof listCommands === 'undefined' || listCommands.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                            <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingCommand, manufacturingMill } = state;
    return { manufacturingCommand, manufacturingMill }
}

const mapDispatchToProps = {
    getAllManufacturingCommands: commandActions.getAllManufacturingCommands,
    getAllManufacturingMills: millActions.getAllManufacturingMills,

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(HistoryCommandTable));
