import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import InventoryDetailForm from './inventoryDetailForm';
import LotDetailForm from './lotDetailForm';
import LotEditForm from './lotEditForm';

import { LotActions } from '../redux/actions';
import { StockActions } from '../../stock-management/redux/actions';
import { BillActions } from '../../bill-management/redux/actions';
import { GoodActions } from '../../../common-production/good-management/redux/actions';

import { SelectMulti, DataTableSetting, SelectBox, DatePicker, PaginateBar } from '../../../../../common-components/index';

class InventoryManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            oldType: 'product',
            type: 'product',
            perPage: 1,
            dataStatus: 0,
            stock: []
        }
    }

    componentDidMount(){
        const { page, limit, type } = this.state;
        this.props.getAllStocks();
        this.props.getAllLots({ type });
        this.props.getAllLots({ page, limit, type });
        this.props.getAllGoodsByType({ type });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if(prevState.oldType !== prevState.type) {
            nextProps.getGoodsByType({ page: prevState.page, limit: prevState.limit, type: prevState.type });
            nextProps.getAllLots({ type: prevState.type });
            nextProps.getAllLots({ page: prevState.page, limit: prevState.limit, type: prevState.type });
            nextProps.getAllGoodsByType({ type: prevState.type });
            return { 
                oldType: prevState.type,
            }
        }
        return null;
    };

    handleProduct = () => {
        let type = 'product';
        let page = 1;
        this.setState({
            type: type,
            page: page,
            good: ''
        })
    }

    handleMaterial = () => {
        let type = 'material';
        let page = 1;
        this.setState({
            type: type,
            page: page,
            good: ''
        })
    }

    handleEquipment = () => {
        let type = 'equipment';
        let page = 1;
        this.setState({
            type: type,
            page: page,
            good: ''
        })
    }

    handleAsset = () => {
        let type = 'asset';
        let page = 1;
        this.setState({
            type: type,
            page: page,
            good: ''
        })
    }

    handleShowDetailInfo = async (id) => {
        const page = 1, limit = 5;
        await this.props.getGoodDetail(id);
        await this.props.getBillByGood({ good: id, page, limit });
        await this.setState(state => {
            return {
                ...state,
                lotDetailId: id
            }
        })
        
        window.$('#modal-detail-inventory').modal('show');
    }

    handleShowDetailLot = async (id) => {
        const lot = await this.props.getDetailLot(id);
        await this.setState(state => {
            return {
                ...state,
            }
        })
        window.$('#modal-detail-lot').modal('show');
    }

    handleEdit = async (id) => {
        const lot = await this.props.getDetailLot(id);
        this.setState(state => {
            return {
                ...state,
                lotId: id,
                dataStatus: 0
            }
        })
        window.$('#modal-edit-lot').modal('show');
    }

    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                day = '' + d.getDate(),
                month = '' + (d.getMonth() + 1),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            type: this.state.type,
            name: this.state.name,
            good: this.state.good,
            expirationDate: this.state.expirationDate,
            stock: this.state.stock,
        };
        this.props.getAllLots(data);
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            type: this.state.type,
            name: this.state.name,
            good: this.state.good,
            expirationDate: this.state.expirationDate,
            stock: this.state.stock,
        };
        this.props.getAllLots(data);
    }

    handleStockChange = (value) => {
        this.state.stock = value;
    }

    handleGoodChange = (value) => {
        this.state.good = value[0];
    }

    handleExpirationDateChange = (value) => {
        if (value === '') {
            value = null;
        }

        this.state.expirationDate = value;
    }

    handleLotChange = (e) => {
        let value = e.target.value;
        this.state.name = value;
    }

    handleSubmitSearch = async () => {
        let data = {
            type: this.state.type,
            page: this.state.page,
            limit: this.state.limit,
            name: this.state.name,
            good: this.state.good,
            expirationDate: this.state.expirationDate,
            stock: this.state.stock,
        }

        await this.props.getAllLots(data);

        await this.setState(state => {
            return {
                ...state
            }
        })
    }

    getAllGoodsByType = () => {
        let { translate, goods } = this.props;
        let goodArr = [{ value: '', text: translate('manage_warehouse.inventory_management.choose_good') }];

        goods.listGoodsByType.map(item => {
            goodArr.push({
                value: item._id,
                text: item.name,
                baseUnit: item.baseUnit
            })
        })

        return goodArr;
    }

    render() {

        const { translate, lots, goods, stocks } = this.props;
        const { type, lotId, lotDetailId, good, expirationDate, stock } = this.state;
        const { listGoodsByType } = goods;
        const { listPaginate, listLots, totalPages, page } = lots;
        const totalGoodsByType = listGoodsByType ? listGoodsByType.length : 0;
        const totalLot = listLots ? listLots.length : 0;
        const dataGoodsByType = this.getAllGoodsByType();

        // let lotOfGood = listLots ? listLots.filter(x => x.good ? x.good._id === good : x ) : [];
        // let quantityTotal = lotOfGood ? lotOfGood.reduce(function (accumulator, currentValue){
        //     return accumulator + currentValue.quantity;
        // }, 0) : 0;

        let goodName = dataGoodsByType.find(x => x.value === good);

        let inventoryQuantity = [];
        if(listLots && listLots.length > 0){
            if(stock.length === 0){
                for(let i = 0; i < listLots.length; i++) {
                    inventoryQuantity.push({quantity: listLots[i].quantity, good: listLots[i].good, name: listLots[i].name})
                }
            }
            else{
                for(let i = 0; i < listLots.length; i++) {
                    let quantity = 0;
                    for(let j = 0; j < stock.length; j++) {
                        for(let k = 0; k <listLots[i].stocks.length; k++) {
                            if(stock[j] === listLots[i].stocks[k].stock) {
                                quantity += listLots[i].stocks[k].quantity;
                            }
                        }
                    }
                    inventoryQuantity.push({quantity: quantity, good: listLots[i].good, name: listLots[i].name});
                }
            }
        }
        let quantityTotal = 0;
        if(inventoryQuantity.length > 0) {
            for(let i = 0; i < inventoryQuantity.length; i++) {
                if(inventoryQuantity[i].good._id === good) {
                    quantityTotal += inventoryQuantity[i].quantity
                }
            }
        }

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#inventory-products" data-toggle="tab" onClick={()=> this.handleProduct()}>{translate('manage_warehouse.inventory_management.product')}</a></li>
                    <li><a href="#inventory-materials" data-toggle="tab" onClick={this.handleMaterial}>{translate('manage_warehouse.inventory_management.material')}</a></li>
                    <li><a href="#inventory-equipments" data-toggle="tab" onClick={()=> this.handleEquipment()}>{translate('manage_warehouse.inventory_management.equipment')}</a></li>
                    <li><a href="#inventory-assets" data-toggle="tab" onClick={()=> this.handleAsset()}>{translate('manage_warehouse.inventory_management.asset')}</a></li>
                </ul>
                <div className="tab-content">
                    <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.stock')}</label>
                            <SelectMulti
                                id={`select-multi-stock`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manage_warehouse.inventory_management.total_stock'), allSelectedText: translate('manage_warehouse.inventory_management.total_stock') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={stocks.listStocks.map((x, index) => { return { value: x._id, text: x.name }})}
                                onChange={this.handleStockChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate(`manage_warehouse.inventory_management.${type}`)}</label>
                            <SelectBox
                                id={`select-good-inventory`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={good}
                                items={dataGoodsByType}
                                onChange={this.handleGoodChange}    
                                multiple={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.lot')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleLotChange} placeholder={translate('manage_warehouse.inventory_management.good_code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.date')}</label>
                            <DatePicker
                                id="expiration-date"
                                value={expirationDate}
                                onChange={this.handleExpirationDateChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.inventory_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.inventory_management.search')}</button>
                        </div>
                    </div>
                    <div className="box-body">
                        <ul className="todo-list">
                            <li>
                                <span className="text"><a href='/good-management'>Tổng số {translate(`manage_warehouse.inventory_management.${type}`)} trong kho</a></span>
                                <span className="label label-info" style={{fontSize: '11px'}}>{totalGoodsByType} {translate(`manage_warehouse.inventory_management.${type}`)}</span>
                            </li>
                            <li>
                                <span className="text"><a href="#">Tổng số lô hàng của {translate(`manage_warehouse.inventory_management.${type}`)}</a></span>
                                <span className="label label-warning" style={{fontSize: '11px'}}>{totalLot} {translate('manage_warehouse.inventory_management.lots')}</span>
                            </li>
                            {
                                good ?
                                <li>
                                    <span className="text">Số lượng tồn kho của {goodName.text} <a href="#" onClick={() => this.handleShowDetailInfo(goodName.value)}>(xem thẻ kho)</a></span>
                                    <span className="label label-success" style={{fontSize: '11px'}}>{quantityTotal} {goodName.baseUnit}</span>
                                </li> : []
                            }
                        </ul>
                    </div>
                    {
                        lotDetailId &&
                        <InventoryDetailForm
                            id={lotDetailId}
                            stock={stock}
                            quantity={quantityTotal}
                        />
                    }
                    <LotDetailForm />

                    { 
                        lotId &&
                        <LotEditForm
                            id={lotId}
                            lot={lots.lotDetail}
                        />
                    }
                        <table id="inventory-table" className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>{translate('manage_warehouse.inventory_management.index')}</th>
                                    <th>{translate('manage_warehouse.inventory_management.name')}</th>
                                    <th>{translate('manage_warehouse.inventory_management.unit')}</th>
                                    <th>{translate('manage_warehouse.inventory_management.quantity')}</th>
                                    <th>{translate('manage_warehouse.inventory_management.lot')}</th>
                                    <th>{translate('manage_warehouse.inventory_management.date')}</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                            tableId="stock-table"
                                            columnArr={[
                                                translate('manage_warehouse.inventory_management.index'),
                                                translate('manage_warehouse.inventory_management.name'),
                                                translate('manage_warehouse.inventory_management.unit'),
                                                translate('manage_warehouse.inventory_management.quantity'),
                                                translate('manage_warehouse.inventory_management.lot'),
                                                translate('manage_warehouse.inventory_management.date')
                                            ]}
                                            limit={this.state.limit}
                                            setLimit={this.setLimit}
                                            hideColumnOption={true}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { (typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                                    listPaginate.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.good.name}</td>
                                            <td>{x.good.baseUnit}</td>
                                            <td>{inventoryQuantity ? inventoryQuantity.map(y => {if(y.name === x.name) { return y.quantity}}) : 0}</td>
                                            <td>{x.name}</td>
                                            <td>{this.formatDate(x.expirationDate)}</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailLot(x._id)}><i className="material-icons">visibility</i></a>
                                                <a onClick={() => this.handleEdit(x._id)} href={`#${x._id}`} className="text-yellow" ><i className="material-icons">edit</i></a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {lots.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                        <PaginateBar pageTotal = {totalPages} currentPage = {page} func = {this.setPage} />
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
    getGoodDetail: GoodActions.getGoodDetail,
    getAllStocks: StockActions.getAllStocks,
    getDetailLot: LotActions.getDetailLot,
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    getBillByGood: BillActions.getBillByGood
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InventoryManagement));
