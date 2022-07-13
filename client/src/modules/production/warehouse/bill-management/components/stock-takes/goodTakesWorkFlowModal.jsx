import React, { useState, useEffect } from "react";
import { DialogModal, ErrorLabel, SelectBox } from "../../../../../../common-components";
import "../good-receipts/goodReceipt.css";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { BillActions } from "../../redux/actions";

function GoodTakesWorkFlowModal(props) {

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: 5,
        status: 1,
        stock: '',
        displayType: 1,
        lotType: 0,
        listData: [],
        statusAll: 0,
    })

    const formatListDataToGoodData = (listData) => {
        let data = [];
        listData.map(item => {
            let lots = [];
            item.lots.forEach(lot => {
                let binLocations = [];
                lot.stocks[0].binLocations.forEach(bin => {
                    binLocations.push({
                        binLocation: bin.binLocation._id,
                        quantity: bin.quantity,
                        realQuantity: bin.realQuantity,
                        status: bin.status,
                        name: bin.binLocation.name,
                    });

                })
                lots.push({
                    lot: lot._id,
                    quantity: lot.stocks[0].quantity,
                    realQuantity: lot.stocks[0].binLocations.reduce((total, item) => total + parseInt(item.realQuantity), 0),
                    binLocations: binLocations,
                })
            })
            data.push({
                good: item.goodId,
                lots: lots,
            })
        })
        return data;
    }

    const formatGoodDataToListLotsByGood = (goodData) => {
        let lots = [];
        goodData.forEach(good => {
            good.lots.forEach(lot => {
                let stocks = [];
                let binLocations = [];
                lot.binLocations.forEach(bin => {
                    binLocations.push({
                        binLocation: {
                            _id: bin._id,
                            name: bin.name,
                        },
                        lot: lot,
                        quantity: bin.quantity,
                        realQuantity: bin.realQuantity,
                        status: bin.status,
                    });
                })
                stocks.push({
                    binLocations: binLocations,
                    quantity: lot.quantity,
                })
                lots.push({
                    _id: lot.lot._id,
                    good: good.good,
                    stocks: stocks,
                    passedQualityControl: lot.lot.passedQualityControl,
                    code: lot.lot.code,
                })
            })
        })
        return lots;
    }

    useEffect(() => {
        const { currentRole } = state;
        const listLotsByGood = (props.billInfor.goods.length == 0 || props.billInfor.goods[0].lots.length == 0)
            ? props.lots.listLotsByGood : formatGoodDataToListLotsByGood(props.billInfor.goods)
        setState({
            ...state,
            billId: props.billId,
            code: props.billInfor.code,
            listGoods: props.billInfor.goods,
            stockInfo: props.billInfor.fromStock,
            listLotsByGood: listLotsByGood,
            listData: getListdata(listLotsByGood),
            listLots: listLotsByGood,
        })
    }, [props.billId, props.lots.listLotsByGood.length])
    // Trạng thái của việc thực hiện công việc
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
                status: status,
                errorOnStatus: msg,
            });
        }
        return msg === undefined;
    }

    // Hàm sắp xếp dữ liệu của mảng
    const sortData = (data, type) => {
        if (type == 2) {
            data.forEach(item => {
                item.binLocations.sort((a, b) =>
                    a.binLocation.name.localeCompare(b.binLocation.name)
                );
            })
        }
        return data;
    }
    // Thay đổi kiểu hiển thị theo kiểm kê theo lô hoặc kiểm kê theo vị trí lưu trữ
    const handleDisplayTypeChange = (value) => {
        let listData = getListdata(state.listLots);
        listData = sortData(listData, value[0]);
        setState({
            ...state,
            displayType: value[0],
            listData: listData,
        });
    }

    // Lấy mảng con theo điều kiện
    const getSubArray = (array, passedQualityControl) => {
        let data = [];
        array.forEach(item => {
            if (item.passedQualityControl == passedQualityControl)
                data.push(item);
        })
        return data;
    }

    // Thay đổi loại lô hàng hóa: toàn bộ, đạt kiểm định, không đạt kiểm định

    const handleLotTypeChange = (value) => {
        const lotType = value[0];
        let { listLotsByGood } = state;
        switch (lotType) {
            case "0":
                setState({
                    ...state,
                    lotType: lotType,
                    listLots: listLotsByGood,
                    listData: sortData(getListdata(listLotsByGood), state.displayType),
                });
                break;
            case "1":
                let listLots = getSubArray(listLotsByGood, 1);
                setState({
                    ...state,
                    lotType: lotType,
                    listLots: listLots,
                    listData: sortData(getListdata(listLots), state.displayType),
                });
                break;
            case "2":
                let listLots2 = getSubArray(listLotsByGood, 0);
                setState({
                    ...state,
                    lotType: lotType,
                    listLots: listLots2,
                    listData: sortData(getListdata(listLots2), state.displayType),
                });
                break;
        }
    }

    // số lượng thực tế

    const handleRealQuantityChange = (e, index, index2) => {
        let { value } = e.target;

        let { listData } = state;
        listData[index].binLocations[index2].realQuantity = value ? parseInt(value) : 0;
        setState({
            ...state,
            listData,
        });

        validateRealQuantityChangeOnTable(value, index, index2, true);
    };

    const validateRealQuantityChangeOnTable = (value, index, index2, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) < 0) {
            msg = "giá trị không được nhỏ hơn 0!";
        }
        if (willUpdateState) {
            setState({
                ...state,
                quantityErrorPosition1: index,
                quantityErrorPosition2: index2,
                quantityErrorOnTable: msg,
            });
        }

    };

    // Lọc dữ liệu mảng chỉ lấy ra dữ liệu khác nhau theo goodID

    const getUnique = (arr) => {
        const unique = arr
            .map(e => e.good._id)
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    }

    // Lọc dữ liệu mảng chỉ lấy ra dữ liệu khác nhau theo BinLocationPath

    const getUniqueByBinLocationPath = (arr) => {
        const unique = arr
            .map(e => e.binLocation.path)
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    }

    // gán giá trị cho bảng tính tổng số hàng hóa

    const totalDataOfGood = (listData) => {
        const totalData = [];
        listData.forEach(data => {
            const totalLot = data.lots.length;
            const totalLocation = getUniqueByBinLocationPath(data.binLocations).length;
            const totalBook = data.binLocations.reduce((total, currentValue) => total = total + parseInt(currentValue.quantity), 0);
            const totalActual = data.binLocations.reduce((total, currentValue) => total = total + parseInt(currentValue.realQuantity), 0);
            totalData.push({
                goodName: data.goodName,
                unitName: data.goodBaseUnit,
                totalLot: totalLot,
                totalLocation: totalLocation,
                totalBook: totalBook,
                totalActual: totalActual,
                totalDamage: (totalBook - totalActual) * data.pricePerBaseUnit,
            })
        })
        return totalData;
    }

    //  Hàm format dữ liệu cho bảng

    const getListdata = (listLots) => {
        let data = [];
        let listLotsUnique = getUnique(listLots);
        if (listLotsUnique && listLotsUnique.length > 0) {
            listLotsUnique.forEach(lotUnique => {
                let item = {};
                item.lots = [];
                item.binLocations = [];
                if (listLots && listLots.length > 0) {
                    listLots.forEach(lot => {
                        if (lot.good._id == lotUnique.good._id) {
                            item.goodId = lot.good._id;
                            item.goodName = lot.good.name;
                            item.goodBaseUnit = lot.good.baseUnit;
                            item.pricePerBaseUnit = lot.good.pricePerBaseUnit ? lot.good.pricePerBaseUnit : 0;
                            item.lots.push(lot);
                            lot.stocks[0].binLocations.forEach(bin => {
                                bin.lot = lot;
                                bin.realQuantity = bin.realQuantity ? bin.realQuantity : bin.quantity;
                                bin.status = bin.status ? bin.status : false;
                            })
                            item.binLocations = [...item.binLocations, ...lot.stocks[0].binLocations];
                        }
                    })
                }
                data.push(item);
            })
        }
        return data;
    }

    const handleChangeStatusLot = (index, index2) => {
        let { listData } = state;
        listData[index].binLocations[index2].status = !listData[index].binLocations[index2].status;;
        setState({
            ...state,
            listData,
        });
    }

    // validate and save

    const disabledStatus = () => {
        let { listData } = state;
        let counter = 0;
        let binLocationLength = 0;
        listData.forEach(data => {
            data.binLocations.forEach(bin => {
                if (bin.status === true) {
                    counter++;
                }
            })
            binLocationLength = binLocationLength + data.binLocations.length;
        })
        if (counter === binLocationLength) {
            return true;
        }
        return false;
    }

    const save = async () => {
        if (validateStatus(state.status, false)) {
            const { billInfor } = props;
            await props.editBill(billInfor._id, {
                statusAll: state.status,
                goods: formatListDataToGoodData(state.listData),
                group: billInfor.group,
                fromStock: billInfor.fromStock,
                oldStatus: billInfor.status,
                code: billInfor.code,
            });
        }
    }

    const { translate } = props;
    const { code, stockInfo, status, errorOnStatus, lotType, displayType, listData, quantityErrorPosition1, quantityErrorPosition2, quantityErrorOnTable } = state;
    const totalData = totalDataOfGood(listData);
    const tbodies = listData.map((data, index) => {
        const binRows = data.binLocations.map((bin, index2) => {
            const goodName = index2 === 0 ? <td rowSpan={data.binLocations.length + 1}>{data.goodName}</td> : null
            const goodBaseUnit = index2 === 0 ? <td rowSpan={data.binLocations.length + 1}>{data.goodBaseUnit}</td> : null
            if (displayType == 1) {
                return (
                    <tr key={index2}>
                        <td>{index2 + 1}</td>
                        {goodName}
                        {goodBaseUnit}
                        <td>{(index2 > 0 && data.binLocations[index2 - 1].lot.code === bin.lot.code) ? '' : bin.lot.code}</td>
                        <td>{bin.binLocation.name}</td>
                        <td style={{ textAlign: "center" }}>{bin.quantity}</td>
                        <td>
                            <div className={`form-group ${parseInt(quantityErrorPosition1) === index && parseInt(quantityErrorPosition2) === index2 && quantityErrorOnTable ? "has-error" : ""} `}>
                                <input
                                    className="form-control"
                                    type="number"
                                    value={bin.realQuantity ? bin.realQuantity : ""}
                                    name="value"
                                    style={{ width: "100%" }}
                                    onChange={(e) => handleRealQuantityChange(e, index, index2)}
                                />
                                {parseInt(quantityErrorPosition1) === index && parseInt(quantityErrorPosition2) === index2 && quantityErrorOnTable && (
                                    <ErrorLabel content={quantityErrorOnTable} />
                                )}
                            </div>
                        </td>
                        <td>{
                            bin.status == 0 ? <a
                                onClick={() => handleChangeStatusLot(index, index2)}
                                className="add text-red"
                                style={{ width: "5px" }}
                                title="Thực hiện công việc"
                            >
                                <i className="material-icons">check_circle_outline</i>
                            </a> : <a
                                onClick={() => handleChangeStatusLot(index, index2)}
                                className="add text-green"
                                style={{ width: "5px" }}
                                title="Thực hiện công việc"
                            >
                                <i className="material-icons">check_circle</i>
                            </a>
                        }</td>
                    </tr>
                )
            } else
                return (
                    <tr key={index2}>
                        <td>{index2 + 1}</td>
                        {goodName}
                        {goodBaseUnit}
                        <td>{(index2 > 0 && data.binLocations[index2 - 1].binLocation.name === bin.binLocation.name) ? '' : bin.binLocation.name}</td>
                        <td>{bin.lot.code}</td>
                        <td style={{ textAlign: "center" }}>{bin.quantity}</td>
                        <td>
                            <div className={`form-group ${parseInt(quantityErrorPosition1) === index && parseInt(quantityErrorPosition2) === index2 && quantityErrorOnTable ? "has-error" : ""} `}>
                                <input
                                    className="form-control"
                                    type="number"
                                    value={bin.realQuantity ? bin.realQuantity : ""}
                                    name="value"
                                    style={{ width: "100%" }}
                                    onChange={(e) => handleRealQuantityChange(e, index, index2)}
                                />
                                {parseInt(quantityErrorPosition1) === index && parseInt(quantityErrorPosition2) === index2 && quantityErrorOnTable && (
                                    <ErrorLabel content={quantityErrorOnTable} />
                                )}
                            </div>
                        </td>
                        <td>{
                            bin.status == 0 ? <a
                                onClick={() => handleChangeStatusLot(index, index2)}
                                className="add text-red"
                                style={{ width: "5px" }}
                                title="Thực hiện công việc"
                            >
                                <i className="material-icons">check_circle_outline</i>
                            </a> : <a
                                onClick={() => handleChangeStatusLot(index, index2)}
                                className="add text-green"
                                style={{ width: "5px" }}
                                title="Thực hiện công việc"
                            >
                                <i className="material-icons">check_circle</i>
                            </a>
                        }</td>
                    </tr>
                )
        })
        return (
            <tbody key={index}>
                {binRows}
            </tbody>
        )
    })

    return (
        <React.Fragment>
            <DialogModal
                modalID="good-takes-work-flow-modal"
                isLoading={false}
                formID="good-takes-work-flow-modal"
                title={"Thực hiện công việc kiểm kê"}
                msg_success={"Lưu thành công"}
                msg_failure={"Lưu thất bại"}
                disableSubmit={!validateStatus(status, false)}
                func={save}
                size={75}
                maxWidth={500}
            >
                <form id="good-takes-work-flow-modal">
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
                                    <input type="text" value={code ? code : ''} className="form-control" disabled={true}></input>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group ${!errorOnStatus ? "" : "has-error"}`}>
                                    <label>{translate('manage_warehouse.bill_management.status')}<span className="text-red">*</span></label>
                                    <SelectBox
                                        id={`select-quality-control-status-bill`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        items={[
                                            { value: 0, text: "Chọn trạng thái" },
                                            { value: 1, text: "Chưa kiểm kê xong" },
                                            { value: 2, text: "Đã kiểm kê hàng hóa xong" }]}
                                        onChange={handleStatusChange}
                                        multiple={false}
                                        disabled={!disabledStatus()}
                                    />
                                    <ErrorLabel content={errorOnStatus} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{"Chọn loại hiển thị kiểm kê"}</label>
                                    <SelectBox
                                        id={`select-good-takes-display-type`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={displayType}
                                        items={[
                                            { value: 1, text: "Kiểm kê theo lô" },
                                            { value: 2, text: "Kiểm kê theo vị trí lưu trữ" }]}
                                        onChange={handleDisplayTypeChange}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{"Chọn loại hàng hóa"}</label>
                                    <SelectBox
                                        id={`select-lot-type`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={lotType}
                                        items={[
                                            { value: 0, text: "Toàn bộ" },
                                            { value: 1, text: "Đạt kiểm định chất lượng" },
                                            { value: 2, text: "Không đạt kiểm định chất lượng" }]}
                                        onChange={handleLotTypeChange}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{"Thông tin chi tiết lô hàng đạt kiểm định"}</legend>
                                    <div className={`form-group`}>
                                        {/* Bảng thông tin chi tiết */}
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                    <th title="Mã Lô">{"Mã Lô"}</th>
                                                    <th title={"Vị trí lưu trữ"}>{"Vị trí lưu trữ"}</th>
                                                    <th title={"Số lượng sổ sách"}>{"Số lượng sổ sách"}</th>
                                                    <th title={"Số lượng thực tế"}>{"Số lượng thực tế"}</th>
                                                    <th title={"Trạng thái kiểm kê"}>{"Trạng thái kiểm kê"}</th>
                                                </tr>
                                            </thead>
                                            {tbodies}
                                        </table>
                                    </div>
                                    <div className={`form-group`}>
                                        {/* Bảng thông tin về tổng */}
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                    <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                    <th title="Tổng số lô">{"Tổng số Lô"}</th>
                                                    <th title={"Tổng số vị trí lưu trữ"}>{"Tổng số vị trí lưu trữ"}</th>
                                                    <th title={"Tổng số lượng sổ sách"}>{"Tổng số lượng sổ sách"}</th>
                                                    <th title={"Tổng số lượng thực tế"}>{"Tổng số lượng thực tế"}</th>
                                                    <th title={"Tổng số lượng thiệt hại (VND)"}>{"Tổng số lượng thiệt hại (VND)"}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {totalData && totalData.length > 0 && totalData.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.goodName}</td>
                                                            <td>{item.unitName}</td>
                                                            <td>{item.totalLot}</td>
                                                            <td>{item.totalLocation}</td>
                                                            <td>{item.totalBook}</td>
                                                            <td>{item.totalActual}</td>
                                                            <td>{item.totalDamage}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </React.Fragment>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editBill: BillActions.editBill,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodTakesWorkFlowModal));
