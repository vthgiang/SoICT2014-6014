import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import InventoryDetailForm from './inventoryDetailForm';
import LotDetailForm from './lotDetailForm';

import { LotActions } from '../redux/actions';
import { StockActions } from '../../stock-management/redux/actions';
import { GoodActions } from '../../../common-production/good-management/redux/actions';

import { TreeTable } from './treeTable';

import { LazyLoadComponent, forceCheckOrVisible, SelectMulti, DataTableSetting, DeleteNotification, DatePicker, PaginateBar } from '../../../../../common-components/index';

class InventoryManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            type: 'product',
            perPage: 2
        }
    }

    componentDidMount(){
        let { page, limit, type } = this.state;
        this.props.getAllLots({ page, limit });
        this.props.getAllStocks();
        this.props.getGoodsByType({ page, limit, type });
    }

    handleShowDetailInfo = async () => {
        window.$('#modal-detail-inventory').modal('show');
    }

    handleShowDetailLot = async () => {
        window.$('#modal-detail-lot').modal('show');
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    render() {

        const { translate, lots, goods } = this.props;
        const { perPage } = this.state;

        let dataGoods = goods.listPaginate ? goods.listPaginate.map((node, index) => {
            const goodId = node._id;
            let lotOfGood = [];
            lotOfGood = lots.listPaginate ? lots.listPaginate.filter(x => x.good ? x.good._id === goodId : x ) : [];
            let quantityTotal = lotOfGood ? lotOfGood.reduce(function (accumulator, currentValue){
                return accumulator + currentValue.quantity;
            }, 0) : 0;
            return {
                ...node,
                index: index + 1,
                name: node.name,
                baseUnit: node.baseUnit,
                quantity: quantityTotal,
                lot: "",
                expirationDate: "",
                parent: null,
                action: ["viewGood"]
            }
        }) : [];

        let dataLots = lots.listPaginate ? lots.listPaginate.map(node => {
            return {
                ...node,
                name: node.good ? node.good.name : "",
                baseUnit: node.good ? node.good.baseUnit : "",
                quantity: node.quantity,
                lot: node.name,
                expirationDate: this.formatDate(node.expirationDate),
                parent: node.good ? node.good._id : null,
                action: ["viewLot", "edit"]
            }
        }) : [];

        const dataTree = dataGoods.concat(dataLots);

        let column = [
            { name: translate('manage_warehouse.inventory_management.index'), key: "index" },
            { name: translate('manage_warehouse.inventory_management.name'), key: "name" },
            { name: translate('manage_warehouse.inventory_management.unit'), key: "baseUnit" },
            { name: translate('manage_warehouse.inventory_management.quantity'), key: "quantity" },
            { name: translate('manage_warehouse.inventory_management.lot'), key: "lot" },
            { name: translate('manage_warehouse.inventory_management.date'), key: "expirationDate" }
        ]

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#inventory-products" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.product')}</a></li>
                    <li><a href="#inventory-materials" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.material')}</a></li>
                    <li><a href="#inventory-equipments" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.equipment')}</a></li>
                    <li><a href="#inventory-assets" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.asset')}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.stock')}</label>
                            <SelectMulti
                                id={`select-multi-stock`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Kho Tạ Quang Bửu"},
                                    { value: '2', text: "Kho Trần Đại Nghĩa"},
                                    { value: '3', text: "Kho Đại Cồ Việt"},
                                    { value: '4', text: "Kho Lê Thanh Nghị"},
                                ]}
                                onChange={this.handleCategoryChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.purchase_date')}</label>
                            <DatePicker
                                id="purchase-month"
                                dateFormat="month-year"
                                value=""
                                onChange={this.handlePurchaseMonthChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.good_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleNameChange} placeholder={translate('manage_warehouse.inventory_management.good_code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.name')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleNameChange} placeholder={translate('manage_warehouse.inventory_management.name')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.inventory_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.inventory_management.search')}</button>
                        </div>
                    </div>
                    <InventoryDetailForm />
                    <LotDetailForm />

                    <DataTableSetting
                        tableId="tree-table"
                        tableContainerId="tree-table-container"
                        tableWidth="1300px"
                        columnArr={[
                            translate('manage_warehouse.inventory_management.index'),
                            translate('manage_warehouse.inventory_management.name'),
                            translate('manage_warehouse.inventory_management.unit'),
                            translate('manage_warehouse.inventory_management.quantity'),
                            translate('manage_warehouse.inventory_management.lot'),
                            translate('manage_warehouse.inventory_management.date'),
                        ]}
                        limit={perPage}
                        setLimit={this.setLimit}
                        hideColumnOption={true}
                    />

                    <div id="tree-table-container">
                        <TreeTable
                            behaviour="show-children"
                            column={column}
                            data={dataTree}
                            titleAction={{
                                edit: translate('task.task_management.action_edit'),
                                viewLot: translate('task.task_management.action_edit'),
                                viewGood: translate('task.task_management.action_edit'),
                            }}
                            funcEdit={this.handleShowModal}
                            funcViewLot={this.handleShowDetailLot}
                            funcViewGood={this.handleShowDetailInfo}
                        />

                    </div>

                    <PaginateBar
                    />
                    </div>
                </div>
            </div>
        );
    }
    
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllLots: LotActions.getAllLots,
    getGoodsByType: GoodActions.getGoodsByType,
    getAllStocks: StockActions.getAllStocks,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InventoryManagement));
