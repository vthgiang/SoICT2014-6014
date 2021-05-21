import React, { useState, useEffect } from 'react';
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
import './inventory.css'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
function InventoryManagement(props) {
    const tableId = "inventory-management-table";
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: limit,
        oldType: '',
        type: '',
        perPage: 1,
        dataStatus: 0,
        stock: [],
        activeP: false,
        activeM: false,
        activeE: false,
        activeW: false,
        tableId
    })

    useEffect(() => {
        const { page, limit, type, currentRole } = state;
        props.getAllStocks({ managementLocation: currentRole });
        props.getAllLots({ type, managementLocation: currentRole });
        props.getAllLots({ page, limit, type, managementLocation: currentRole });
        props.getAllGoodsByType({ type });
    }, [])

    useEffect(() => {
        props.getGoodsByType({ page: state.page, limit: state.limit, type: state.type });
        props.getAllLots({ type: state.type, managementLocation: state.currentRole });
        props.getAllLots({ page: state.page, limit: state.limit, type: state.type, managementLocation: state.currentRole });
        props.getAllGoodsByType({ type: state.type });
        setState({
            ...state,
            oldType: state.type,
        })
    }, [state.oldType])

    // shouldComponentUpdate(props, nextPage) {
    //     if (!nextPage.type) {
    //         setType();
    //         return false;
    //     }
    //     return true;
    // }

    const handleProduct = () => {
        let type = 'product';
        let page = 1;
        setState({
            ...state,
            type: type,
            page: page,
            good: ''
        })
    }

    const handleMaterial = () => {
        let type = 'material';
        let page = 1;
        setState({
            ...state,
            type: type,
            page: page,
            good: ''
        })
    }

    const handleEquipment = () => {
        let type = 'equipment';
        let page = 1;
        setState({
            ...state,
            type: type,
            page: page,
            good: ''
        })
    }

    const handleWaste = () => {
        let type = 'waste';
        let page = 1;
        setState({
            ...state,
            type: type,
            page: page,
            good: ''
        })
    }

    const handleShowDetailInfo = async (id) => {
        const page = 1, limit = 5;
        await props.getGoodDetail(id);
        await props.getBillByGood({ good: id, page, limit });
        await setState({
            ...state,
            lotDetailId: id
        })

        window.$('#modal-detail-inventory').modal('show');
    }

    const handleShowDetailLot = async (id) => {
        const lot = await props.getDetailLot(id);
        await setState({
            ...state,
        })
        window.$('#modal-detail-lot').modal('show');
    }

    const handleEdit = async (id) => {
        const lot = await props.getDetailLot(id);
        setState({
            ...state,
            lotId: id,
            dataStatus: 0
        })
        window.$('#modal-edit-lot').modal('show');
    }

    function formatDate(date, monthYear = false) {
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

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        const data = {
            limit: number,
            page: state.page,
            managementLocation: state.currentRole,
            type: state.type,
            code: state.code,
            good: state.good,
            expirationDate: state.expirationDate,
            stock: state.stock,
        };
        const data1 = {
            type: state.type,
            managementLocation: state.currentRole,
            good: state.good,
            stock: state.stock,
        };

        props.getAllLots(data);
        props.getAllLots(data1);
    }

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        const data = {
            limit: state.limit,
            managementLocation: state.currentRole,
            page: page,
            type: state.type,
            code: state.code,
            good: state.good,
            expirationDate: state.expirationDate,
            stock: state.stock,
        };
        const data1 = {
            type: state.type,
            managementLocation: state.currentRole,
            good: state.good,
            stock: state.stock,
        };

        props.getAllLots(data);
        props.getAllLots(data1);
    }

    const handleStockChange = (value) => {
        state.stock = value;
    }

    const handleGoodChange = (value) => {
        state.good = value[0];
    }

    const handleExpirationDateChange = (value) => {
        if (value === '') {
            value = null;
        }

        state.expirationDate = value;
    }

    const handleLotChange = (e) => {
        let value = e.target.value;
        state.code = value;
    }

    const handleSubmitSearch = async () => {
        let data = {
            type: state.type,
            page: state.page,
            limit: state.limit,
            managementLocation: state.currentRole,
            code: state.code,
            good: state.good,
            expirationDate: state.expirationDate,
            stock: state.stock,
        }
        const data1 = {
            type: state.type,
            managementLocation: state.currentRole,
            good: state.good,
            stock: state.stock,
        };
        await props.getAllLots(data1);

        await props.getAllLots(data);

        await setState({
            ...state
        })
    }

    const getAllGoodsByType = () => {
        let { translate, goods } = props;
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

    const totaQuantity = (stocks) => {
        const { stock } = state;
        let result = 0;
        if (stock && stock.length > 0) {
            for (let i = 0; i < stock.length; i++) {
                let quantity = 0;
                for (let j = 0; j < stocks.length; j++) {
                    if (stocks[j].stock.toString() === stock[i].toString()) {
                        quantity += stocks[j].quantity;
                    }
                }
                result += quantity;
            }
        } else {
            for (let i = 0; i < props.stocks.listStocks.length; i++) {
                let quantity = 0;
                for (let j = 0; j < stocks.length; j++) {
                    if (stocks[j].stock.toString() === props.stocks.listStocks[i]._id.toString()) {
                        quantity += stocks[j].quantity;
                    }
                }
                result += quantity;
            }
        }
        return result;
    }

    const checkQuantity = (stock) => {
        const { stocks } = props;
        var check = 1;
        stock.map(x => {
            if (stocks.listStocks.length > 0) {
                for (let i = 0; i < stocks.listStocks.length; i++) {
                    if (x.stock === stocks.listStocks[i]._id) {
                        if (x.binLocations.length === 0) {
                            check = 0;
                        } else {
                            let totalQuantity = x.binLocations.reduce(function (accumulator, currentValue) {
                                return Number(accumulator) + Number(currentValue.quantity);
                            }, 0);
                            if (x.quantity !== totalQuantity) {
                                check = 0;
                            }
                        }
                    }
                }
            }
        })

        if (check === 1) {
            return false
        }
        return true
    }

    const checkManagementGood = (value) => {
        const { currentRole } = state;
        const { stocks } = props;
        const { listStocks } = stocks;
        let arrayType = [];
        if (listStocks && listStocks.length > 0) {
            for (let i = 0; i < listStocks.length; i++) {
                if (listStocks[i].managementLocation.length > 0) {
                    for (let j = 0; j < listStocks[i].managementLocation.length > 0; j++) {
                        if (listStocks[i].managementLocation[j].role._id === currentRole) {
                            arrayType = arrayType.concat(listStocks[i].managementLocation[j].managementGood);
                        }
                    }
                }
            }
        }

        if (arrayType.includes(value)) {
            return true;
        }

        return false;
    }

    const setType = () => {
        if (checkManagementGood('product')) {
            setState({ type: 'product', activeP: true });
        } else if (checkManagementGood('material')) {
            setState({ type: 'material', activeM: true });
        } else if (checkManagementGood('equipment')) {
            setState({ type: 'equipment', activeE: true });
        } else if (checkManagementGood('waste')) {
            setState({ type: 'waste', activeW: true });
        }
    }


    const { translate, lots, goods, stocks } = props;
    const { type, lotId, lotDetailId, good, expirationDate, stock } = state;
    const { listGoodsByType } = goods;
    const { listPaginate, listLots, totalPages, page } = lots;
    const totalGoodsByType = listGoodsByType ? listGoodsByType.length : 0;
    const totalLot = listLots ? listLots.length : 0;
    const dataGoodsByType = getAllGoodsByType();

    let goodName = dataGoodsByType.find(x => x.value === good);

    let inventoryQuantity = [];
    if (listLots && listLots.length > 0) {
        if (stock.length === 0) {
            // for(let i = 0; i < listLots.length; i++) {
            //     inventoryQuantity.push({quantity: listLots[i].quantity, good: listLots[i].good, name: listLots[i].name})
            // }
            for (let i = 0; i < listLots.length; i++) {
                let quantity = 0;
                for (let j = 0; j < stocks.listStocks.length; j++) {
                    for (let k = 0; k < listLots[i].stocks.length; k++) {
                        if (stocks.listStocks[j]._id === listLots[i].stocks[k].stock) {
                            quantity += listLots[i].stocks[k].quantity;
                        }
                    }
                }
                inventoryQuantity.push({ quantity: quantity, good: listLots[i].good, code: listLots[i].code });
            }
        }
        else {
            for (let i = 0; i < listLots.length; i++) {
                let quantity = 0;
                for (let j = 0; j < stock.length; j++) {
                    for (let k = 0; k < listLots[i].stocks.length; k++) {
                        if (stock[j] === listLots[i].stocks[k].stock) {
                            quantity += listLots[i].stocks[k].quantity;
                        }
                    }
                }
                inventoryQuantity.push({ quantity: quantity, good: listLots[i].good, code: listLots[i].code });
            }
        }
    }
    let quantityTotal = 0;
    if (inventoryQuantity.length > 0) {
        for (let i = 0; i < inventoryQuantity.length; i++) {
            // if(inventoryQuantity[i].good._id === good) {
            //     quantityTotal += inventoryQuantity[i].quantity
            // }
            quantityTotal += inventoryQuantity[i].quantity
        }
    }

    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                {checkManagementGood('product') && <li className={`${state.activeP ? "active" : ''}`}>
                    <a href="#inventory-products" data-toggle="tab" onClick={() => handleProduct()}>
                        {translate('manage_warehouse.inventory_management.product')}
                    </a>
                </li>}
                {checkManagementGood('material') && <li className={`${state.activeM ? "active" : ''}`}>
                    <a href="#inventory-materials" data-toggle="tab" onClick={handleMaterial}>
                        {translate('manage_warehouse.inventory_management.material')}
                    </a>
                </li>}
                {checkManagementGood('equipment') && <li className={`${state.activeE ? "active" : ''}`}>
                    <a href="#inventory-equipments" data-toggle="tab" onClick={() => handleEquipment()}>
                        {translate('manage_warehouse.inventory_management.equipment')}
                    </a>
                </li>}
                {checkManagementGood('waste') && <li className={`${state.activeW ? "active" : ''}`}>
                    <a href="#inventory-wastes" data-toggle="tab" onClick={() => handleWaste()}>
                        {translate('manage_warehouse.inventory_management.waste')}
                    </a>
                </li>}
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
                                items={stocks.listStocks.map((x, index) => { return { value: x._id, text: x.name } })}
                                onChange={handleStockChange}
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
                                onChange={handleGoodChange}
                                multiple={false}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.lot')}</label>
                            <input type="text" className="form-control" name="code" onChange={handleLotChange} placeholder={translate('manage_warehouse.inventory_management.good_code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.inventory_management.date')}</label>
                            <DatePicker
                                id="expiration-date"
                                value={expirationDate}
                                onChange={handleExpirationDateChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.inventory_management.search')} onClick={handleSubmitSearch}>{translate('manage_warehouse.inventory_management.search')}</button>
                        </div>
                    </div>
                    <div className="box-body">
                        <ul className="todo-list">
                            <li>
                                <span className="text"><a href='/good-management'>Tổng số {translate(`manage_warehouse.inventory_management.${type}`)} trong kho</a></span>
                                <span className="label label-info" style={{ fontSize: '11px' }}>{totalGoodsByType} {translate(`manage_warehouse.inventory_management.${type}`)}</span>
                            </li>
                            <li>
                                <span className="text"><a href="#">Tổng số lô hàng của {translate(`manage_warehouse.inventory_management.${type}`)}</a></span>
                                <span className="label label-warning" style={{ fontSize: '11px' }}>{totalLot} {translate('manage_warehouse.inventory_management.lots')}</span>
                            </li>
                            {
                                good ?
                                    <li>
                                        <span className="text">Số lượng tồn kho của {goodName.text} <a href="#" onClick={() => handleShowDetailInfo(goodName.value)}>(xem thẻ kho)</a></span>
                                        <span className="label label-success" style={{ fontSize: '11px' }}>{quantityTotal} {goodName.baseUnit}</span>
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
                    <table id={tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
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
                                        tableId={tableId}
                                        columnArr={[
                                            translate('manage_warehouse.inventory_management.index'),
                                            translate('manage_warehouse.inventory_management.name'),
                                            translate('manage_warehouse.inventory_management.unit'),
                                            translate('manage_warehouse.inventory_management.quantity'),
                                            translate('manage_warehouse.inventory_management.lot'),
                                            translate('manage_warehouse.inventory_management.date')
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                                listPaginate.map((x, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{x.good.name}</td>
                                        <td>{x.good.baseUnit}</td>
                                        { checkQuantity(x.stocks) ?
                                            <td className="tooltip-inventory">
                                                <span style={{ color: "red" }}>{((stock && stock.length > 0) || stocks.listStocks.length > 0) ? totaQuantity(x.stocks) : x.quantity}</span>
                                                <span className="tooltiptext"><p style={{ color: "white" }}>{translate('manage_warehouse.inventory_management.text')}</p></span>
                                            </td> :
                                            <td>{((stock && stock.length > 0) || stocks.listStocks.length > 0) ? totaQuantity(x.stocks) : x.quantity}</td>}
                                        <td>{x.code}</td>
                                        <td>{formatDate(x.expirationDate)}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a onClick={() => handleShowDetailLot(x._id)}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => handleEdit(x._id)} href={`#${x._id}`} className="text-yellow" ><i className="material-icons">edit</i></a>
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
                    <PaginateBar pageTotal={totalPages} currentPage={page} func={setPage} />
                </div>
            </div>
        </div>
    );
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
