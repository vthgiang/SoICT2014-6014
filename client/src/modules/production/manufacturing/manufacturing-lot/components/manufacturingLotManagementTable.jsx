import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti } from '../../../../../common-components';
import { formatDate } from '../../../../../helpers/formatDate';
import { GoodActions } from '../../../common-production/good-management/redux/actions';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';
import GoodReceiptCreateForm from './ goodReceiptCreateForm';
import ManufacturingLotDetailForm from './manufacturingLotDetailForm';
import ManufacturingLotEditFrom from './manufacturingLotEditForm';
import { StockActions } from '../../../warehouse/stock-management/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { generateCode } from '../../../../../helpers/generateCode';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
class ManufacturingLotManagementTable extends Component {
    constructor(props) {
        super(props);
        const tableId = "manufacturing-lot-table";
        const defaultConfig = { limit: 5 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            code: "",
            createdAt: "",
            expirationDate: "",
            good: "",
            page: 1,
            limit: limit,
            tableId
        }
    }

    componentDidMount = () => {
        this.props.getAllManufacturingLots({
            currentRole: this.state.currentRole,
            page: this.state.page,
            limit: this.state.limit
        });
        this.props.getAllGoodsByType({ type: "product" });
        this.props.getAllStocks();
        this.props.getAllUserOfCompany();
    }

    setLimit = async (limit) => {
        await this.setState({
            limit: limit
        });
        const data = {
            limit: limit,
            page: this.state.page,
            currentRole: this.state.currentRole
        }
        this.props.getAllManufacturingLots(data);
    }

    setPage = async (page) => {
        await this.setState({
            page: page
        });
        const data = {
            page: page,
            limit: this.state.limit,
            currentRole: this.state.currentRole
        }
        this.props.getAllManufacturingLots(data);
    }

    handleCodeChange = (e) => {
        const { value } = e.target;
        this.setState({
            code: value
        });
    }

    handleCreatedAtChange = (value) => {
        this.setState({
            createdAt: value
        });
    }

    handleManufacturingCommandCodeChange = (e) => {
        const { value } = e.target;
        this.setState({
            manufacturingCommandCode: value
        })
    }

    handleExpirationDateChange = (value) => {
        this.setState({
            expirationDate: value
        });
    }

    handleStatusChange = (value) => {
        this.setState({
            status: value
        });
    }

    getAllGoodArray = () => {
        const { goods, translate } = this.props;
        const { listGoodsByType } = goods;
        let goodArr = [{
            value: "",
            text: translate('manufacturing.lot.choose_good')
        }];
        if (listGoodsByType) {
            listGoodsByType.map(async (good) => {
                await goodArr.push({
                    value: good._id,
                    text: good.code + " - " + good.name
                })
            })
        }
        return goodArr;
    }

    handleGoodChange = (value) => {
        this.setState({
            good: value[0]
        });
    }

    handleSubmitSearch = () => {
        const data = {
            currentRole: this.state.currentRole,
            page: this.state.page,
            limit: this.state.limit,
            code: this.state.code,
            good: this.state.good,
            manufacturingCommandCode: this.state.manufacturingCommandCode,
            createdAt: this.state.createdAt,
            expirationDate: this.state.expirationDate,
            status: this.state.status
        }
        this.props.getAllManufacturingLots(data);
    }

    handleShowDetailLot = async (lot) => {
        await this.setState({
            lotDetail: lot
        });

        window.$('#modal-detail-info-manufacturing-lot').modal('show');
    }

    handleEditLot = async (lot) => {
        await this.setState({
            currentRow: lot
        });
        window.$('#modal-edit-manufacturing-lot').modal('show');
    }

    handleCreateGoodReceipt = async (lot) => {
        await this.setState({
            lotId: lot._id,
            currentLot: lot,
            billCode: generateCode("BILL")
        });


        window.$('#modal-create-bill-issue-product').modal('show');

    }

    render() {
        const { translate, lots } = this.props;
        const { totalPages, page } = lots;
        const { code, createdAt, expirationDate, good, manufacturingCommandCode, tableId } = this.state;
        let listManufacturingLots = [];

        if (lots.listManufacturingLots && lots.isLoading === false) {
            listManufacturingLots = lots.listManufacturingLots;
        }
        return (
            <React.Fragment>
                {
                    <ManufacturingLotDetailForm lotDetail={this.state.lotDetail} />
                }
                {
                    <GoodReceiptCreateForm
                        lotId={this.state.lotId}
                        lot={this.state.currentLot}
                        billCode={this.state.billCode}
                    />
                }
                {
                    this.state.currentRow &&
                    <ManufacturingLotEditFrom
                        lotId={this.state.currentRow._id}
                        code={this.state.currentRow.code}
                        manufacturingCommandCode={this.state.currentRow.manufacturingCommand.code}
                        good={this.state.currentRow.good}
                        quantity={this.state.currentRow.originalQuantity}
                        expirationDate={this.state.currentRow.expirationDate}
                        description={this.state.currentRow.description}
                        status={this.state.currentRow.status}
                    />
                }
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.lot.code')}</label>
                            <input type="text" className="form-control" value={code} onChange={this.handleCodeChange} placeholder="LOT202011111" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.created_at')}</label>
                            <DatePicker
                                id={`createdAt-manufacturing-lot`}
                                value={createdAt}
                                onChange={this.handleCreatedAtChange}
                                disabled={false}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.lot.command_code')}</label>
                            <input type="text" className="form-control" value={manufacturingCommandCode} onChange={this.handleManufacturingCommandCodeChange} placeholder="LSX202000001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.lot.expiration_date')}</label>
                            <DatePicker
                                id={`expirationDate-manufacturing-lot`}
                                value={expirationDate}
                                onChange={this.handleExpirationDateChange}
                                disabled={false}
                            />
                        </div>

                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.lot.good')}</label>
                            <SelectBox
                                id={`select-works`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={good}
                                items={this.getAllGoodArray()}
                                onChange={this.handleGoodChange}
                                multiple={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.lot.status')}</label>
                            <SelectMulti
                                id={`select-multi-status-manufacturing-lot`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manufacturing.lot.choose_status'), allSelectedText: translate('manufacturing.lot.choose_all') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: translate('manufacturing.lot.1.content') },
                                    { value: '2', text: translate('manufacturing.lot.2.content') },
                                    { value: '3', text: translate('manufacturing.lot.3.content') },
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manufacturing.command.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.command.search')}</button>
                        </div>
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('manufacturing.lot.index')}</th>
                                <th>{translate('manufacturing.lot.code')}</th>
                                {/* <th>{translate('manufacturing.lot.command_code')}</th> */}
                                <th>{translate('manufacturing.lot.good')}</th>
                                <th>{translate('manufacturing.lot.base_unit')}</th>
                                <th>{translate('manufacturing.lot.original_quantity')}</th>
                                <th>{translate('manufacturing.lot.product_type')}</th>
                                <th>{translate('manufacturing.lot.creator')}</th>
                                <th>{translate('manufacturing.lot.created_at')}</th>
                                <th>{translate('manufacturing.lot.expiration_date')}</th>
                                <th>{translate('manufacturing.lot.status')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('manufacturing.lot.index'),
                                            translate('manufacturing.lot.code'),
                                            // translate('manufacturing.lot.command_code'),
                                            translate('manufacturing.lot.good'),
                                            translate('manufacturing.lot.base_unit'),
                                            translate('manufacturing.lot.original_quantity'),
                                            translate('manufacturing.lot.product_type'),
                                            translate('manufacturing.lot.creator'),
                                            translate('manufacturing.lot.created_at'),
                                            translate('manufacturing.lot.expiration_date'),
                                            translate('manufacturing.lot.status'),
                                        ]}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(listManufacturingLots && listManufacturingLots.length !== 0) &&
                                listManufacturingLots.map((lot, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{lot.code}</td>
                                        {/* <td>{lot.manufacturingCommand && lot.manufacturingCommand.code}</td> */}
                                        <td>{lot.good && lot.good.name}</td>
                                        <td>{lot.good && lot.good.baseUnit}</td>
                                        <td>{lot.originalQuantity}</td>
                                        <td>{translate(`manufacturing.lot.product_type_object.${lot.productType}`)}</td>
                                        <td>{lot.creator && lot.creator.name}</td>
                                        <td>{formatDate(lot.createdAt)}</td>
                                        <td>{formatDate(lot.expirationDate)}</td>
                                        <td style={{ color: translate(`manufacturing.lot.${lot.status}.color`) }}>{translate(`manufacturing.lot.${lot.status}.content`)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a style={{ width: '5px' }} title={translate('manufacturing.lot.lot_detail')} onClick={() => { this.handleShowDetailLot(lot) }}><i className="material-icons">view_list</i></a>
                                            {
                                                lot.status === 1 && <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manufacturing.lot.lot_edit')} onClick={() => this.handleEditLot(lot)}><i className="material-icons">edit</i></a>
                                            }
                                            {
                                                lot.status === 1 && <a style={{ width: '5px', color: "green" }} title={translate('manufacturing.lot.create_bill')} onClick={() => { this.handleCreateGoodReceipt(lot) }}><i className="material-icons">account_balance</i></a>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {lots.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listManufacturingLots === 'undefined' || listManufacturingLots.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                </div>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { lots, goods } = state;
    return { lots, goods }
}

const mapDispatchToProps = {
    getAllManufacturingLots: LotActions.getAllManufacturingLots,
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    getAllStocks: StockActions.getAllStocks,
    getAllUserOfCompany: UserActions.getAllUserOfCompany
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingLotManagementTable));