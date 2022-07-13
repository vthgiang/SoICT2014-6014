import { isValidDate } from '@fullcalendar/react';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox, ErrorLabel, DialogModal } from '../../../../../../common-components';
import { BinLocationActions } from '../../../bin-location-management/redux/actions';

function QueueGoodIntoTheWarehouseComponent(props) {
    const EMPTY_BINLOCATION = {
        id: '',
        name: '',
        quantity: 0,
    }
    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: 5,
        path: '',
        status: '',
        stock: '',
        currentIndex: -1,
        binLocation: Object.assign({}, EMPTY_BINLOCATION),
        editBinLocation: false,
        indexLotEditting: "",
        indexBinEditting: "",
        statusInventory: 1,
    })

    const getDataLots = (goods) => {
        let lots = [];
        goods.forEach(item => {
            item.lots.forEach(lot => {
                lot.goodName = item.good.name;
                lot.baseUnit = item.good.baseUnit;
                lots.push(lot);
            })
        })
        return lots;
    }

    const getDataUnPassedLots = (goods) => {
        let unPassedLots = [];
        goods.forEach(item => {
            item.unpassed_quality_control_lots.forEach(lot => {
                lot.goodName = item.good.name;
                lot.baseUnit = item.good.baseUnit;
                unPassedLots.push(lot);
            })
        })
        return unPassedLots;
    }

    if (props.billId !== state.billId) {
        setState({
            ...state,
            billId: props.billId,
            code: props.billInfor.code,
            listGoods: props.billInfor.goods,
            stockInfo: props.billInfor.fromStock,
            dataLots: getDataLots(props.billInfor.goods),
            dataUnPassedLots: getDataUnPassedLots(props.billInfor.goods),
            statusInventory: props.statusInventory,

        })
    }

    useEffect(() => {
        let data = {
            page: state.page,
            limit: state.limit,
            managementLocation: state.currentRole,
            stock: props.billInfor.fromStock._id,
        }
        props.getChildBinLocations(data);
    }, [props.billInfor.fromStock._id])

    const handleStatusChange = (value) => {
        const status = value[0];
        validateStatus(status, true);
    }

    const validateStatus = (status, willUpdateState = false) => {
        let msg = undefined;
        if (status == 0) {
            msg = "Bạn phải chọn trạng thái";
        }
        if (willUpdateState) {
            setState({
                ...state,
                statusInventory: status,
                errorOnStatus: msg,
            });
            props.onDataChange(status)
        }
        return msg === undefined;
    }

    const handleArrangeLot = async (lot, index, lotType) => {
        setState({
            ...state,
            currentLot: lot,
            currentIndex: index,
            lotType: lotType,
        });
        window.$('#arrange-lot-into-warehouse-modal').modal('show');
    }

    const getAllBinLocations = () => {
        const { binLocations } = props;
        const { listPaginate } = binLocations;
        let binLocationArr = [{ value: "", text: "Chọn khu vực lưu trữ" }];
        listPaginate.map((item) => {
            binLocationArr.push({
                value: item._id,
                text: item.name,
            });
        });

        return binLocationArr;
    }

    const handleBinLocationChange = (value) => {
        const binLocation = value[0];
        validateBinLocation(binLocation, true);
    }

    const validateBinLocation = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "") {
            msg = "Vui lòng chọn khu vực lưu trữ";
        }
        if (willUpdateState) {
            let { binLocation } = state;
            binLocation.id = value;
            setState({
                ...state,
                binLocation: { ...binLocation },
                errorBinLocation: msg
            });
        }
        return msg === undefined;
    }



    const handleQuantityChange = (e) => {
        let { value } = e.target;
        validateQuantityChange(value, true);
    }

    const validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "") {
            msg = "Số lượng phải lớn hơn 0 và nhỏ hơn hoặc bằng số lượng chưa xếp vào kho";
        }
        if (value < 1 || value > parseInt(checkDifferentGood(state.currentLot))) {
            msg = translate('production.request_management.error_quantity_input')
        }
        if (willUpdateState) {
            let { binLocation } = state;
            binLocation.quantity = value;
            setState({
                ...state,
                binLocation: { ...binLocation },
                errorQuantity: msg
            });
        }
        return msg === undefined;
    }

    const handleCancelEditBinLocation = (e) => {
        e.preventDefault();
        setState({
            ...state,
            editBinLocation: false,
            binLocation: Object.assign({}, EMPTY_BINLOCATION),
            currentIndex: -1,
        });
    }

    const handleSaveEditBinLocation = () => {
        let { dataLots, dataUnPassedLots, indexLotEditting, indexBinEditting, listGoods, currentLot, lotType } = state;

        let dataGoods = [...listGoods];
        if (lotType === 1) {
            dataLots[indexLotEditting].binLocations[indexBinEditting] = state.binLocation;
            dataGoods.forEach(good => {
                good.lots.forEach(lot => {
                    if (lot.code === currentLot.code) {
                        lot.binLocations[indexBinEditting] = state.binLocation;
                    }
                })
            })
        } else {
            dataUnPassedLots[indexLotEditting].binLocations[indexBinEditting] = state.binLocation;
            dataGoods.forEach(good => {
                good.unpassed_quality_control_lots.forEach(lot => {
                    if (lot.code === currentLot.code) {
                        lot.binLocations[indexBinEditting] = state.binLocation;
                    }
                })
            })
        }
        setState({
            ...state,
            editBinLocation: false,
            binLocation: Object.assign({}, EMPTY_BINLOCATION),
            dataLots: [...dataLots],
            listGoods: [...dataGoods],
            dataUnPassedLots: [...dataUnPassedLots],
            currentIndex: -1,
        })
    }

    const handleEditBinLocation = (lot, binLocation, index, index2) => {
        setState({
            ...state,
            currentLot: lot,
            currentIndex: index,
            editBinLocation: true,
            binLocation: { ...binLocation },
            indexLotEditting: index,
            indexBinEditting: index2,
        });
    }

    const handleDeleteBinLocation = (currentLot, binLocation, index, index2) => {
        let { dataLots, dataUnPassedLots, listGoods, lotType } = state;
        let dataGoods = [...listGoods];
        if (lotType === 1) {
            dataLots[index].binLocations.splice(index2, 1);
            dataGoods.forEach(good => {
                good.lots.forEach(lot => {
                    if (lot.code === currentLot.code) {
                        lot.binLocations.splice(index2, 1);
                    }
                })
            })
        } else {
            dataUnPassedLots[index].binLocations.splice(index2, 1);
            dataGoods.forEach(good => {
                good.unpassed_quality_control_lots.forEach(lot => {
                    if (lot.code === currentLot.code) {
                        lot.binLocations.splice(index2, 1);
                    }
                })
            })
        }
        setState({
            ...state,
            dataLots: [...dataLots],
            listGoods: [...dataGoods],
            dataUnPassedLots: [...dataUnPassedLots],
        });
    }

    const handleAddBinLocation = () => {
        const { binLocations } = props;
        const { listPaginate } = binLocations;
        let { binLocation, listGoods, currentLot, lotType, dataLots, dataUnPassedLots } = state;
        let listBinLocation = currentLot.binLocations && currentLot.binLocations.length > 0 ? currentLot.binLocations : [];
        let binLocationArrFilter = listPaginate.filter(x => x._id === binLocation.id);
        if (binLocationArrFilter) {
            binLocation.binLocation = binLocationArrFilter[0]._id;
            binLocation.name = binLocationArrFilter[0].name;
        }
        listBinLocation.push(binLocation);
        let dataGoods = [...listGoods];
        let data = {};
        if (lotType == 1) {
            data = [...dataLots];
            data[currentIndex].binLocations = listBinLocation;
            // data goods
            dataGoods.forEach(good => {
                good.lots.forEach(lot => {
                    if (lot.code === currentLot.code) {
                        lot.binLocations = listBinLocation;
                    }
                })
            })
        } else {
            data = [...dataUnPassedLots];
            data[currentIndex].binLocations = listBinLocation;
            // data goods
            dataGoods.forEach(good => {
                good.unpassed_quality_control_lots.forEach(lot => {
                    if (lot.code === currentLot.code) {
                        lot.binLocations = listBinLocation;
                    }
                })
            })
        }
        setState({
            ...state,
            dataLots: lotType == 1 ? data : [...dataLots],
            dataUnPassedLots: lotType == 2 ? data : [...dataUnPassedLots],
            listGoods: dataGoods,
            binLocation: Object.assign({}, EMPTY_BINLOCATION),
            currentLot: {},
            currentIndex: -1
        });
    }

    const checkDifferentGood = (lot) => {
        let quantity = lot.passedQuantity;
        if (lot.binLocations && lot.binLocations.length > 0) {
            lot.binLocations.forEach(bin => {
                quantity -= bin.quantity;
            })
        }
        return quantity;
    }

    const checkQuantity = (arr) => {
        let check = 0;
        arr.forEach(lot => {
            if (!lot.binLocations || (lot.binLocations && lot.binLocations.length == 0)) check = 1;
            else {
                let totalQuantity = 0;
                lot.binLocations.forEach(bin => {
                    totalQuantity += parseInt(bin.quantity);
                })
                if (totalQuantity != parseInt(lot.quantity)) check = 1;
            }
        })
        return check;
    }

    const isValidate = () => {
        let check = 0;
        const { dataLots, dataUnPassedLots } = state;
        if (dataLots && dataLots.length == 0 && dataUnPassedLots && dataUnPassedLots.length == 0) check = 1;
        else {
            if (dataLots && dataLots.length > 0) {
                check = checkQuantity(dataLots);
            }
            if (dataUnPassedLots && dataUnPassedLots.length > 0) {
                check = checkQuantity(dataUnPassedLots);
            }
        }
        return check === 0;
    }

    const handleClearBinLocation = () => {
        setState({
            ...state,
            binLocation: Object.assign({}, EMPTY_BINLOCATION),
        });
    }

    const isBinLocationValidated = () => {
        let result = validateBinLocation(state.binLocation.id, false) && validateQuantityChange(state.binLocation.quantity, false);
        return result;
    }

    const { translate } = props;
    const { dataLots, code, status, stockInfo, dataUnPassedLots, statusInventory, errorOnStatus, errorBinLocation, errorQuantity, binLocation, currentIndex } = state;
    return (
        <React.Fragment>
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
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div className="form-group">
                        <label>{translate('manage_warehouse.bill_management.code')}</label>
                        <input type="text" value={code} className="form-control" disabled={true}></input>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                    <div className={`form-group ${!errorOnStatus ? "" : "has-error"}`}>
                        <label>{translate('manage_warehouse.bill_management.status')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`select-quality-control-status-bill`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={statusInventory}
                            items={[
                                { value: 0, text: "Chọn trạng thái" },
                                { value: 1, text: "Chưa xếp hết hàng vào kho" },
                                { value: 2, text: "Đã xếp hết hàng vào kho" }]}
                            onChange={handleStatusChange}
                            multiple={false}
                            disabled={!isValidate()}
                        />
                        <ErrorLabel content={errorOnStatus} />
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    {currentIndex != -1 &&
                        <div>
                            <div className={`form-group ${!errorBinLocation ? "" : "has-error"}`}>
                                <label>{"Chọn khu vực lưu trữ"}</label>
                                <SelectBox
                                    id={`select-bin-location`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={binLocation.id}
                                    items={getAllBinLocations()}
                                    onChange={handleBinLocationChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorBinLocation} />
                            </div>
                            <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                                <label className="control-label">{"Chọn số lượng"}</label>
                                <div>
                                    <input type="number" className="form-control" value={binLocation.quantity} onChange={handleQuantityChange} />
                                </div>
                                <ErrorLabel content={errorQuantity} />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                {state.editBinLocation ?
                                    <React.Fragment>
                                        <button className="btn btn-success" disabled={!isBinLocationValidated()} onClick={handleSaveEditBinLocation} style={{ marginLeft: "10px" }}>{"Lưu chỉnh sửa"}</button>
                                        <button className="btn btn-danger" onClick={handleCancelEditBinLocation} style={{ marginLeft: "10px" }}>{"Hủy chỉnh sửa"}</button>
                                    </React.Fragment> :
                                    <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isBinLocationValidated()} onClick={handleAddBinLocation}>{translate('production.request_management.add_good')}</button>
                                }
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearBinLocation}>{"Xóa trắng"}</button>
                            </div>
                        </div>
                    }
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{"Thông tin chi tiết lô hàng đạt kiểm định"}</legend>
                        <div className={`form-group`}>
                            {/* Bảng thông tin chi tiết */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                        <th title="Mã lô hàng">{"Mã lô hàng"}</th>
                                        <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                        <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                        <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                        <th title={"Số lượng chưa xếp vào kho"}>{"Số lượng chưa xếp vào kho"}</th>
                                        <th title={"Vị trí lưu trữ/Số lượng"}>{"Vị trí lưu trữ/Số lượng"}</th>
                                        <th title={"Ngày hết hạn"}>{"Ngày hết hạn"}</th>
                                        <th title={translate('manage_warehouse.bill_management.action')}>{translate('manage_warehouse.bill_management.action')}</th>
                                    </tr>
                                </thead>
                                <tbody id={`good-bill-edit`}>
                                    {
                                        (typeof dataLots === 'undefined' || dataLots.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            dataLots.map((x, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.code}</td>
                                                    <td>{x.goodName}</td>
                                                    <td>{x.baseUnit}</td>
                                                    <td>{x.passedQuantity}</td>
                                                    {checkDifferentGood(x) > 0 ?
                                                        <td className="tooltip-abc">
                                                            <span style={{ color: "red" }}>{checkDifferentGood(x)}</span>
                                                            <span className="tooltiptext"><p style={{ color: "white" }}>{"Lô hàng còn " + checkDifferentGood(x) + x.baseUnit + " chưa xếp hết vào kho"}</p></span>
                                                        </td> :
                                                        <td>{"Hàng đã xếp hết vào kho"}</td>}
                                                    {(x.binLocations && x.binLocations.length > 0) ?
                                                        <td>{x.binLocations.map((binLocation, index2) =>
                                                            <div key={index2}>
                                                                <p>
                                                                    {binLocation.name + "/" + binLocation.quantity + " " + x.baseUnit}
                                                                    <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditBinLocation(x, binLocation, index, index2)}><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteBinLocation(x, binLocation, index, index2)}><i className="material-icons"></i></a>
                                                                </p>
                                                            </div>)}
                                                        </td> : <td>{''}</td>}
                                                    <td>{x.expirationDate}</td>
                                                    <td>
                                                        <p type="button" className="btn btn-success" style={{ marginLeft: "10px" }} onClick={() => handleArrangeLot(x, index, 1)}>{"xếp hàng"}</p>
                                                    </td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{"Thông tin chi tiết lô hàng không đạt kiểm định"}</legend>
                        <div className={`form-group`}>
                            {/* Bảng thông tin chi tiết */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                        <th title="Mã lô hàng">{"Mã lô hàng"}</th>
                                        <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                        <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                        <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                        <th title={"Số lượng chưa xếp vào kho"}>{"Số lượng chưa xếp vào kho"}</th>
                                        <th title={"Vị trí lưu trữ/Số lượng"}>{"Vị trí lưu trữ/Số lượng"}</th>
                                        <th title={"Ngày hết hạn"}>{"Ngày hết hạn"}</th>
                                        <th title={translate('manage_warehouse.bill_management.action')}>{translate('manage_warehouse.bill_management.action')}</th>
                                    </tr>
                                </thead>
                                <tbody id={`good-bill-edit`}>
                                    {
                                        (typeof dataUnPassedLots === 'undefined' || dataUnPassedLots.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            dataUnPassedLots.map((x, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.code}</td>
                                                    <td>{x.goodName}</td>
                                                    <td>{x.baseUnit}</td>
                                                    <td>{x.quantity}</td>
                                                    {checkDifferentGood(x) > 0 ?
                                                        <td className="tooltip-abc">
                                                            <span style={{ color: "red" }}>{checkDifferentGood(x)}</span>
                                                            <span className="tooltiptext"><p style={{ color: "white" }}>{"Lô hàng còn " + checkDifferentGood(x) + x.baseUnit + " chưa xếp hết vào kho"}</p></span>
                                                        </td> :
                                                        <td>{"Hàng đã xếp hết vào kho"}</td>}
                                                    {(x.binLocations && x.binLocations.length > 0) ?
                                                        <td>{x.binLocations.map((binLocation, index2) =>
                                                            <div key={index2}>
                                                                <p>
                                                                    {binLocation.name + "/" + binLocation.quantity + " " + x.baseUnit}
                                                                    <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditBinLocation(x, binLocation, index, index2)}><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteBinLocation(x, binLocation, index, index2)}><i className="material-icons"></i></a>
                                                                </p>
                                                            </div>)}
                                                        </td> : <td>{''}</td>}
                                                    <td>{x.expirationDate}</td>
                                                    <td>
                                                        <p type="button" className="btn btn-success" style={{ marginLeft: "10px" }} onClick={() => handleArrangeLot(x, index, 2)}>{"xếp hàng"}</p>
                                                    </td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getChildBinLocations: BinLocationActions.getChildBinLocations,
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QueueGoodIntoTheWarehouseComponent));
