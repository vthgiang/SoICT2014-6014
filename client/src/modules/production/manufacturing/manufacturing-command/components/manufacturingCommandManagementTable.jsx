import React, { Component } from 'react';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti } from "../../../../../common-components";
import ManufacturingCommandDetailInfo from './manufacturingCommandDetailInfo';
import { connect } from 'react-redux';
import { commandActions } from '../redux/actions';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { formatDate } from '../../../../../helpers/formatDate';
import { UserActions } from '../../../../super-admin/user/redux/actions';
class ManufacturingCommandManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            page: 1,
            limit: 5,
            code: '',
            planCode: '',
            manufacturingOrderCode: '',
            salesOrderCode: '',
            lotCode: '',
            accountables: [],
            createdAt: '',
            startDate: '',
            endDate: '',
            status: []
        }
    }

    componentDidMount = () => {
        const data = {
            page: this.state.page,
            limit: this.state.limit,
            currentRole: this.state.currentRole
        }
        this.props.getAllManufacturingCommands(data);
        this.props.getAllUserOfCompany();

    }

    setPage = async (page) => {
        await this.setState({
            page: page,
            limit: this.state.limit,
            currentRole: this.state.currentRole
        });
        this.props.getAllManufacturingCommands(this.state);
    }

    setLimit = async (limit) => {
        await this.setState({
            limit: limit,
            page: this.state.page,
            currentRole: this.state.currentRole
        });
        this.props.getAllManufacturingCommands(this.state);
    }

    getUserArray = () => {
        const { user } = this.props;
        const { usercompanys } = user;
        let userArray = [];
        if (usercompanys) {
            usercompanys.map(user => {
                userArray.push({
                    value: user._id,
                    text: user.name + " - " + user.email
                });
            });
        }
        return userArray;
    }

    handleCodeChange = (e) => {
        const { value } = e.target;
        this.setState({
            code: value
        })
    }

    handleAccountablesChange = (value) => {
        this.setState({
            accountables: value
        });
    }

    handlePlanCodeChange = (e) => {
        const { value } = e.target;
        this.setState({
            planCode: value
        });
    }

    handleCreatedAtChange = (value) => {
        this.setState({
            createdAt: value
        });
    }

    handleManufacturingOrderCodeChange = (e) => {
        const { value } = e.target;
        this.setState({
            manufacturingOrderCode: value
        });
    }

    handleStartDateChange = (value) => {
        this.setState({
            startDate: value
        });
    }

    handleSalesOrderCodeChange = (e) => {
        const { value } = e.target;
        this.setState({
            salesOrderCode: value
        });
    }

    handleEndDateChange = (value) => {
        this.setState({
            endDate: value
        });
    }

    handleLotCodoChange = (e) => {
        const { value } = e.target;
        this.setState({
            lotCode: value
        });
    }

    handleStatusChange = (value) => {
        this.setState({
            status: value
        });
    }

    handleSubmitSearch = () => {
        const { currentRole, page, limit, code, accountables, planCode, createdAt, manufacturingOrderCode, startDate, salesOrderCode,
            endDate, lotCode, status } = this.state;
        const data = {
            currentRole: currentRole,
            page: page,
            limit: limit,
            code: code,
            accountables: accountables,
            planCode: planCode,
            createdAt: createdAt,
            manufacturingOrderCode: manufacturingOrderCode,
            startDate: startDate,
            salesOrderCode: salesOrderCode,
            endDate: endDate,
            lotCode: lotCode,
            status: status
        }
        this.props.getAllManufacturingCommands(data);
    }

    render() {
        const { translate, manufacturingCommand } = this.props;
        let listCommands = [];
        if (manufacturingCommand.listCommands && manufacturingCommand.isLoading === false) {
            listCommands = manufacturingCommand.listCommands
        }
        const { totalPages, page } = manufacturingCommand;
        const { code, accountables, planCode, createdAt, manufacturingOrderCode, startDate, salesOrderCode, endDate, lotCode, status } = this.state;
        this.getUserArray();
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.code')}</label>
                            <input type="text" className="form-control" value={code} onChange={this.handleCodeChange} placeholder="LSX202012245" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.accountables')}</label>
                            <SelectBox
                                id={`select-accoutables`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={this.getUserArray()}
                                value={accountables}
                                onChange={this.handleAccountablesChange}
                                multiple={true}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.plan_code')}</label>
                            <input type="text" className="form-control" value={planCode} onChange={this.handlePlanCodeChange} placeholder="KH202011122" autoComplete="off" />
                        </div>

                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.created_at')}</label>
                            <DatePicker
                                id={`created-at-command-managemet-table`}
                                value={createdAt}
                                onChange={this.handleCreatedAtChange}
                                disabled={false}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.manufacturing_order_code')}</label>
                            <input type="text" className="form-control" value={manufacturingOrderCode} onChange={this.handleManufacturingOrderCodeChange} placeholder="DSX202012221" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.start_date')}</label>
                            <DatePicker
                                id={`start-date-command-managemet-table`}
                                value={startDate}
                                onChange={this.handleStartDateChange}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.sales_order_code')}</label>
                            <input type="text" className="form-control" value={salesOrderCode} onChange={this.handleSalesOrderCodeChange} placeholder="DKD202032210" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.end_date')}</label>
                            <DatePicker
                                id={`end-date-command-managemet-table`}
                                value={endDate}
                                onChange={this.handleEndDateChange}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.lot_code')}</label>
                            <input type="text" className="form-control" value={lotCode} onChange={this.handleLotCodoChange} placeholder="LOSX202031233" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.status')}</label>
                            <SelectMulti
                                id={`select-multi-process-command`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manufacturing.command.choose_status'), allSelectedText: translate('manufacturing.command.choose_all') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: translate('manufacturing.command.1.content') },
                                    { value: '2', text: translate('manufacturing.command.2.content') },
                                    { value: '3', text: translate('manufacturing.command.3.content') },
                                    { value: '4', text: translate('manufacturing.command.4.content') }
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manufacturing.command.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.command.search')}</button>
                        </div>
                    </div>
                    <table id="manufacturing-plan-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('manufacturing.command.index')}</th>
                                <th>{translate('manufacturing.command.code')}</th>
                                <th>{translate('manufacturing.command.plan_code')}</th>
                                <th>{translate('manufacturing.command.created_at')}</th>
                                <th>{translate('manufacturing.command.responsibles')}</th>
                                <th>{translate('manufacturing.command.accountables')}</th>
                                <th>{translate('manufacturing.command.mill')}</th>
                                <th>{translate('manufacturing.command.start_date')}</th>
                                <th>{translate('manufacturing.command.end_date')}</th>
                                <th>{translate('manufacturing.command.status')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="manufacturing-plan-table"
                                        columnArr={[
                                            translate('manufacturing.command.index'),
                                            translate('manufacturing.command.code'),
                                            translate('manufacturing.command.plan_code'),
                                            translate('manufacturing.command.created_at'),
                                            translate('manufacturing.command.responsibles'),
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
                                        <td>{command.manufacturingPlan !== undefined && command.manufacturingPlan.code}</td>
                                        <td>{formatDate(command.createdAt)}</td>
                                        <td>{command.responsibles.length && command.responsibles.map((res, index) => {
                                            if (command.responsibles.length === index + 1)
                                                return res.name
                                            return res.name + ", "
                                        })}
                                        </td>
                                        <td>{command.accountables.length && command.accountables.map((acc, index) => {
                                            if (command.accountables.length === index + 1)
                                                return acc.name;
                                            return acc.name + ", "
                                        })}</td>
                                        <td>{command.manufacturingMill !== undefined && command.manufacturingMill.name}</td>
                                        <td>{"Ca " + command.startTurn + " ngày " + formatDate(command.startDate)}</td>
                                        <td>{"Ca " + command.endTurn + " ngày " + formatDate(command.endDate)}</td>
                                        <td style={{ color: translate(`manufacturing.command.${command.status}.color`) }}>{translate(`manufacturing.command.${command.status}.content`)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a style={{ width: '5px' }} title={translate('manufacturing.purchasing_request.purchasing_request_detail')} onClick={() => { this.handleShowDetailPurchasingRequest(command) }}><i className="material-icons">view_list</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa lệnh sản xuất"><i className="material-icons">edit</i></a>
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
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingCommand, user } = state;
    return { manufacturingCommand, user }
}

const mapDispatchToProps = {
    getAllManufacturingCommands: commandActions.getAllManufacturingCommands,
    getAllUserOfCompany: UserActions.getAllUserOfCompany
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingCommandManagementTable));