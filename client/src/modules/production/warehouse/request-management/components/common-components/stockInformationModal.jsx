import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../../../common-components';
import { BinLocationActions } from '../../../bin-location-management/redux/actions';

function StockInformationModal(props) {
    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: 5,
        path: '',
        status: '',
        stock: '',
        requestId: '',
    })
    useEffect(() => {
        let data = {
            page: state.page,
            limit: state.limit,
            managementLocation: state.currentRole,
            stock: state.stock,
        }
        props.getChildBinLocations(data);
    }, [state.stock])

    if (props.requestId !== state.requestId) {
        setState({
            ...state,
            stock: props.requestApprove.stock._id,
            stockInfo: props.requestApprove.stock,
            requestId: props.requestId,
        })
    }

    const handleEnableGood = (enableGoods) => {
        enableGoods.sort((a, b) => b.contained - a.contained);
        if (enableGoods[0].contained === 0) {
            return null;
        } else
            return enableGoods;
    }

    const { translate, binLocations, requestApprove } = props;
    const { stockInfo } = state;
    const { listPaginate, } = binLocations;
    return (
        <React.Fragment>
            <DialogModal
                modalID={`stock-information-modal`}
                title={"Thông tin kho"}
                formID={`form-stock-information-modal`}
                size={100}
                maxWidth={1000}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-stock-information-modal`}>
                    {stockInfo && (
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.code')}:&emsp;</strong>
                                    {stockInfo.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.address')}:&emsp;</strong>
                                    {stockInfo.address}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.description')}:&emsp;</strong>
                                    {stockInfo.description}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.name')}:&emsp;</strong>
                                    {stockInfo.name}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.status')}:&emsp;</strong>
                                    {stockInfo.status && <span style={{ color: translate(`manage_warehouse.bin_location_management.${stockInfo.status}.color`) }}>{translate(`manage_warehouse.bin_location_management.${stockInfo.status}.status`)}</span>}
                                </div>
                                <div className="form-group">
                                    <strong>{"Thời gian mở cửa"}:&emsp;</strong>
                                    {stockInfo.startTime}&emsp;
                                    <strong>{"Thời gian đóng cửa"}:&emsp;</strong>
                                    {stockInfo.endTime}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{"Chi tiết vị trí lưu trữ"}</legend>
                                <table id={"form-stock-information-table"} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "5%" }}>{translate('manage_warehouse.bin_location_management.index')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.code')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.status')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.capacity')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.contained')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.goods')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                                            listPaginate.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.path}</td>
                                                    <td style={{ color: translate(`manage_warehouse.bin_location_management.${x.status}.color`) }}>{translate(`manage_warehouse.bin_location_management.${x.status}.status`)}</td>
                                                    <td>{x.capacity ? x.capacity : 0} {x.unit}</td>
                                                    <td>
                                                        {x.contained > 0 && (x.contained + ' ' + x.unit)}
                                                        {x.contained <= 0 && translate('manage_warehouse.bin_location_management.empty_stock')}
                                                    </td>
                                                    <td>
                                                        {(x.enableGoods && x.enableGoods.length > 0) && (handleEnableGood(x.enableGoods) !== null ? handleEnableGood(x.enableGoods).map((x, i) => { return <p key={i}>{x.good.name} ({x.contained} {x.good.baseUnit})</p> }) : translate('manage_warehouse.bin_location_management.empty_stock'))}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                {binLocations.isLoading ?
                                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                    (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </fieldset>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getChildBinLocations: BinLocationActions.getChildBinLocations,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockInformationModal));
