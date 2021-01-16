import React, { Component } from 'react';
import { ConfirmNotification, DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti } from "../../../../../common-components";
import ManufacturingCommandDetailInfo from './manufacturingCommandDetailInfo';
import { connect } from 'react-redux';
import { commandActions } from '../redux/actions';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { formatDate } from '../../../../../helpers/formatDate';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import ManufacturingLotCreateForm from '../../manufacturing-lot/components/manufacturingLotCreateForm';
import QualityControlForm from './qualityControlForm';
import { generateCode } from '../../../../../helpers/generateCode';
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
            fromDate: '',
            toDate: '',
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
            fromDate: value
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
            toDate: value
        });
    }

    handleLotCodeChange = (e) => {
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
        const { currentRole, page, limit, code, accountables, planCode, createdAt, manufacturingOrderCode, fromDate, salesOrderCode,
            toDate, lotCode, status } = this.state;
        const data = {
            currentRole: currentRole,
            page: page,
            limit: limit,
            code: code,
            accountables: accountables,
            planCode: planCode,
            createdAt: createdAt,
            manufacturingOrderCode: manufacturingOrderCode,
            fromDate: fromDate,
            salesOrderCode: salesOrderCode,
            toDate: toDate,
            lotCode: lotCode,
            status: status
        }
        this.props.getAllManufacturingCommands(data);
    }

    handleShowDetailManufacturingCommand = async (command) => {
        await this.setState((state) => ({
            ...state,
            commandDetail: command
        }));
        window.$('#modal-detail-info-manufacturing-command-1').modal('show');
    }

    checkRoleAccountables = (commands) => {
        const { accountables } = commands;
        const userId = localStorage.getItem("userId");
        let accoutableIds = accountables.map(x => x._id);
        if (accoutableIds.includes(userId)) {
            return true;
        }
        return false
    }

    handleStartCommand = (command) => {
        const data = {
            status: 3
        }
        this.props.handleEditCommand(command._id, data);
    }

    handleEndCommand = async (command) => {
        // const data = {
        //     status: 4
        // }
        // this.props.handleEditCommand(command._id, data);
        await this.setState(({
            command: command,
            code1: generateCode('LTP'),
            code2: generateCode('LPP')
        }));

        window.$('#modal-create-manufacturing-lot').modal('show');

    }


    checkRoleQualityControl = (command) => {
        const { qualityControlStaffs } = command;
        const userId = localStorage.getItem("userId");
        let qcIds = qualityControlStaffs.map(x => x.staff._id);

        if (qcIds.includes(userId)) {
            return true;
        }
        return false;
    }


    findIndexOfStaff = (array, id) => {
        let result = -1;
        array.forEach((element, index) => {
            if (element.staff._id === id) {
                result = index;
            }
        });
        return result;
    }

    handleQualityControlCommand = async (command) => {
        const userId = localStorage.getItem("userId");
        let index = this.findIndexOfStaff(command.qualityControlStaffs, userId);
        let qcStatus = command.qualityControlStaffs[index].status;
        let qcContent = command.qualityControlStaffs[index].content ? command.qualityControlStaffs[index].content : "";
        console.log(qcContent);
        await this.setState({
            currentQCCommand: command,
            qcStatus: qcStatus,
            qcContent: qcContent
        })
        window.$('#modal-quality-control').modal('show');
    }

    reloadCommandTable = () => {
        const data = {
            page: 1,
            limit: 5,
            currentRole: this.state.currentRole
        }
        this.props.getAllManufacturingCommands(data);
        window.$('#modal-detail-info-manufacturing-command-1').modal('hide');
    }


    render() {
        const { translate, manufacturingCommand } = this.props;
        let listCommands = [];
        if (manufacturingCommand.listCommands && manufacturingCommand.isLoading === false) {
            listCommands = manufacturingCommand.listCommands
        }
        const { totalPages, page } = manufacturingCommand;
        const { code, accountables, planCode, createdAt, manufacturingOrderCode, fromDate, salesOrderCode, toDate, lotCode, status } = this.state;
        this.getUserArray();
        return (
            <React.Fragment>
                {
                    <ManufacturingCommandDetailInfo
                        idModal={1}
                        commandDetail={this.state.commandDetail}
                        onReloadCommandTable={this.reloadCommandTable}
                    />
                }
                {
                    this.state.command &&
                    <ManufacturingLotCreateForm
                        command={this.state.command}
                        code1={this.state.code1}
                        code2={this.state.code2}

                    />
                }
                {
                    this.state.currentQCCommand &&
                    <QualityControlForm
                        commandId={this.state.currentQCCommand._id}
                        code={this.state.currentQCCommand.code}
                        status={this.state.qcStatus}
                        content={this.state.qcContent}
                    />
                }
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
                        {/* <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.manufacturing_order_code')}</label>
                            <input type="text" className="form-control" value={manufacturingOrderCode} onChange={this.handleManufacturingOrderCodeChange} placeholder="DSX202012221" autoComplete="off" />
                        </div> */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.sales_order_code')}</label>
                            <input type="text" className="form-control" value={salesOrderCode} onChange={this.handleSalesOrderCodeChange} placeholder="DKD202032210" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.from_date')}</label>
                            <DatePicker
                                id={`start-date-command-management-table`}
                                value={fromDate}
                                onChange={this.handleStartDateChange}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.lot_code')}</label>
                            <input type="text" className="form-control" value={lotCode} onChange={this.handleLotCodeChange} placeholder="LOSX202031233" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.to_date')}</label>
                            <DatePicker
                                id={`end-date-command-management-table`}
                                value={toDate}
                                onChange={this.handleEndDateChange}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.command.status')}</label>
                            <SelectMulti
                                id={`select-multi-process-command`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manufacturing.command.choose_status'), allSelectedText: translate('manufacturing.command.choose_all') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '6', text: translate('manufacturing.command.6.content') },
                                    { value: '1', text: translate('manufacturing.command.1.content') },
                                    { value: '2', text: translate('manufacturing.command.2.content') },
                                    { value: '3', text: translate('manufacturing.command.3.content') },
                                    { value: '4', text: translate('manufacturing.command.4.content') },
                                    { value: '5', text: translate('manufacturing.command.5.content') },
                                ]}
                                onChange={this.handleStatusChange}
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
                                <th>{translate('manufacturing.command.plan_code')}</th>
                                <th>{translate('manufacturing.command.created_at')}</th>
                                <th>{translate('manufacturing.command.qualityControlStaffs')}</th>
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
                                            translate('manufacturing.command.plan_code'),
                                            translate('manufacturing.command.created_at'),
                                            translate('manufacturing.command.qualityControlStaffs'),
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
                                        <td>{command.qualityControlStaffs && command.qualityControlStaffs.map((staff, index) => {
                                            if (command.qualityControlStaffs.length === index + 1)
                                                return staff.staff.name
                                            return staff.staff.name + ", "
                                        })}
                                        </td>
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
                                            {
                                                this.checkRoleAccountables(command) && command.status === 2 &&
                                                <ConfirmNotification
                                                    icon="question"
                                                    title={translate('manufacturing.command.start_command')}
                                                    content={translate('manufacturing.command.start_command') + " " + command.code}
                                                    name="play_circle_filled"
                                                    className="text-yellow"
                                                    func={() => this.handleStartCommand(command)}
                                                />
                                            }
                                            {
                                                this.checkRoleQualityControl(command) && (command.status === 3 || command.status === 4 || command.status === 5) &&
                                                <a style={{ width: '5px', color: "green" }} title={translate('manufacturing.command.quality_control_command')} onClick={() => { this.handleQualityControlCommand(command) }}><i className="material-icons">thumb_up</i></a>
                                            }
                                            {
                                                this.checkRoleAccountables(command) && command.status === 3 &&
                                                <ConfirmNotification
                                                    icon="question"
                                                    title={translate('manufacturing.command.end_command')}
                                                    content={translate('manufacturing.command.end_command') + " " + command.code}
                                                    name="check_circle"
                                                    className="text-green"
                                                    func={() => this.handleEndCommand(command)}
                                                />
                                            }
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
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    handleEditCommand: commandActions.handleEditCommand
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingCommandManagementTable));