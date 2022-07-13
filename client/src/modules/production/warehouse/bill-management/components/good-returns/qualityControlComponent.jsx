import React, { useState } from 'react';
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { SelectBox, ErrorLabel } from '../../../../../../common-components';

function QualityControlComponent(props) {
    const [state, setState] = useState({
        quantityPassedTest: [],
    })

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
                statusQuality: status,
                errorOnStatus: msg,
            });
            props.onDataChange(status)
        }
        return msg === undefined;
    }

    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            content: value
        });
    }

    const handlePassedQuantityChange = (e, index) => {
        let { value } = e.target;

        let { dataLots } = state;
        dataLots[index].passedQuantity = value;
        setState({
            ...state,
            dataLots,
        });

        validatePassedQuantityChangeOnTable(value, index, true);
    };

    const validatePassedQuantityChangeOnTable = (value, index, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) < 0) {
            msg = "giá trị không được nhỏ hơn 0!";
        } else if (parseInt(value) > parseInt(state.dataLots[index].returnQuantity)) {
            msg = "giá trị không được lớn hơn số lượng trả hàng!";
        }
        if (willUpdateState) {
            setState({
                ...state,
                passedQuantityErrorPosition: index,
                passedQuantityErrorOnTable: msg,
            });
        }

        return msg;
    };

    const getDataLots = (goods) => {
        let lots = [];
        if (goods && goods.length > 0) {
            goods.forEach(item => {
                item.lots.forEach(lot => {
                    lot.goodName = item.good.name;
                    lot.baseUnit = item.good.baseUnit;
                    lot.code = lot.lot.code;
                    lot.expirationDate = lot.lot.expirationDate;
                    lot.returnQuantity = lot.returnQuantity;
                    lot.goodId = item.good._id;
                    lots.push(lot);
                })
            })
        }
        return lots;
    }

    if (props.billId !== state.billId) {
        setState({
            ...state,
            billId: props.billId,
            code: props.billInfor.code,
            listGoods: props.billInfor.goods,
            dataLots: getDataLots(props.billInfor.goods),
            statusQuality: props.statusQuality,
        })
    }

    const checkLots = (quantity, index) => {
        if (listGoods[index].realQuantity > quantity || listGoods[index].realQuantity < 0 || listGoods[index].realQuantity === "") {
            return [false, "Số lượng kiểm định phải nhỏ hơn số lượng gốc và lớn hơn 0, không được để trống"];
        }
        return [true, ""];
    }
    const { translate, bills, billInfor } = props;
    const { dataLots, statusQuality, content, code, listGoods, errorOnStatus, passedQuantityErrorPosition ,passedQuantityErrorOnTable } = state;
    return (
        <React.Fragment>
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
                        value={statusQuality}
                        items={[
                            { value: 0, text: "Chọn trạng thái" },
                            { value: 1, text: "Chưa kiểm định hàng hóa xong" },
                            { value: 2, text: "Đã kiểm định hàng hóa xong" }]}
                        onChange={handleStatusChange}
                        multiple={false}
                    />
                    <ErrorLabel content={errorOnStatus} />
                </div>
            </div>
            {(typeof listGoods === 'undefined' || listGoods.length === 0) ? '' :
                <div className={`form-group`}>
                    <label>{translate('manage_warehouse.bill_management.quality_control_of_each_goods')}<span className="text-red">*</span></label>
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
                                        <th title={"Số lượng xuất kho"}>{"Số lượng xuất kho"}</th>
                                        <th title={"Vị lượng trả lại"}>{"Số lượng trả lại"}</th>
                                        <th title={"Số lượng đạt kiểm định"}>{"Số lượng đạt kiểm định"}</th>
                                    </tr>
                                </thead>
                                <tbody id={`data-lot-bill`}>
                                    {
                                        (typeof dataLots === 'undefined' || dataLots.length === 0) ? <tr><td colSpan={7}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            dataLots.map((x, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.code}</td>
                                                    <td>{x.goodName}</td>
                                                    <td>{x.baseUnit}</td>
                                                    <td>{x.quantity}</td>
                                                    <td>{x.returnQuantity}</td>
                                                    <td>
                                                        <div className={`form-group ${parseInt(passedQuantityErrorPosition) === index && passedQuantityErrorOnTable ? "has-error" : ""} `}>
                                                            <input
                                                                className="form-control"
                                                                type="number"
                                                                value={x.passedQuantity ? x.passedQuantity : ""}
                                                                name="value"
                                                                style={{ width: "100%" }}
                                                                onChange={(e) => handlePassedQuantityChange(e, index)}
                                                            />
                                                            {parseInt(passedQuantityErrorPosition) === index && passedQuantityErrorOnTable && (
                                                                <ErrorLabel content={passedQuantityErrorOnTable} />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                </div>
            }
            <div className="form-group">
                <label>{translate('manage_warehouse.bill_management.description')}</label>
                <textarea type="text" value={content} onChange={handleDescriptionChange} className="form-control"></textarea>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QualityControlComponent))
