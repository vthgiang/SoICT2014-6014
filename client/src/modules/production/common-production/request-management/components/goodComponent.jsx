import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ErrorLabel, SelectBox } from '../../../../../common-components';

function GoodComponentRequest(props) {

    const EMPTY_GOOD = {
        goodId: "1",
        goodObject: "",
        quantity: "",
        baseUnit: "",
    };

    const [state, setState] = useState({
        listGoods: [],
        good: Object.assign({}, EMPTY_GOOD),
        editGood: false,
        goodOptions: [],
        // Một phần tử của goodOptions
        indexEditting: "",
    });

    // phần hàng hóa

    const getAllGoods = () => {
        const { translate, goods } = props;
        let listGoods = [{
            value: "1",
            text: translate('production.request_management.choose_good')
        }];
        const { listGoodsByType } = goods;

        if (listGoodsByType) {
            listGoodsByType.map((item) => {
                listGoods.push({
                    value: item._id,
                    text: item.code + " - " + item.name
                })
            })
        }
        return listGoods
    }

    const handleGoodChange = (value) => {
        const goodId = value[0];
        validateGoodChange(goodId, true);
    }

    const validateGoodChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "1") {
            msg = translate('production.request_management.error_good')
        }

        if (willUpdateState) {
            let { good } = state;

            good.goodId = value
            console.log(value, good.goodId);
            const { goods } = props;
            const { listGoodsByType } = goods;
            let goodArrFilter = listGoodsByType.filter(x => x._id === good.goodId);
            if (goodArrFilter) {
                good.goodObject = goodArrFilter[0];
                good.baseUnit = goodArrFilter[0].baseUnit;
            }


            setState({
                ...state,
                good: { ...good },
                errorGood: msg
            })
        }
        return msg;

    }

    const handleQuantityChange = (e) => {
        let { value } = e.target;
        validateQuantityChange(value, true);
    }

    const validateQuantityChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "") {
            msg = translate('production.request_management.error_quantity')
        }
        if (value < 1) {
            msg = translate('production.request_management.error_quantity_input')
        }
        if (willUpdateState) {
            let { good } = state;
            good.quantity = value;
            setState({
                ...state,
                good: { ...good },
                errorQuantity: msg
            });
        }
        return msg;
    }

    const isGoodValidated = () => {
        if (validateGoodChange(state.good.goodId, false)
            || validateQuantityChange(state.good.quantity, false)
        ) {
            return false;
        }
        return true
    }

    const handleClearGood = async (e) => {
        e.preventDefault();

        await setState({
            ...state,
            good: Object.assign({}, EMPTY_GOOD),
        });
    }

    const handleAddGood = (e) => {
        e.preventDefault();
        let { listGoods, good } = state;

        // Lấy các thông tin của good đưa vào goodObject va day good vao listGoods
        const { goods } = props;
        const { listGoodsByType } = goods;
        let goodArrFilter = listGoodsByType.filter(x => x._id === good.goodId);
        if (goodArrFilter) {
            good.goodObject = goodArrFilter[0];
        }

        listGoods.push(good);

        // filter good ra khoi getAllGoods() va gan state vao goodOption
        let { goodOptions } = state;
        if (goodOptions.length === 0) {
            goodOptions = getAllGoods().filter(x => x.value !== good.goodId);
        } else {
            // Nếu state đang là goodOptions thi vẫn phải filter những thằng còn lại
            goodOptions = goodOptions.filter(x => x.value !== good.goodId);
        }

        // Cập nhật lại good state

        good = Object.assign({}, EMPTY_GOOD);

        setState({
            ...state,
            listGoods: [...listGoods],
            goodOptions: [...goodOptions],
            good: { ...good }
        })
        props.onHandleGoodChange(listGoods);
    }

    const handleDeleteGood = (good, index) => {
        let { listGoods, goodOptions } = state;
        // Loại bỏ phần tử good ra khỏi listGoods
        listGoods.splice(index, 1);

        setState({
            ...state,
            listGoods: [...listGoods],
            goodOptions: [...goodOptions, {
                value: good.goodId,
                text: good.goodObject.code + " - " + good.goodObject.name
            }]
        });
    }

    const handleEditGood = (good, index) => {
        let { goodOptions } = state;
        setState({
            ...state,
            editGood: true,
            good: { ...good },
            goodOptions: [...goodOptions, {
                value: good.goodId,
                text: good.goodObject.code + " - " + good.goodObject.name
            }],
            indexEditting: index
        });
    }

    const handleCancelEditGood = (e) => {
        e.preventDefault();
        let { listGoods, indexEditting, goodOptions } = state;
        goodOptions = goodOptions.filter(x => x.value !== listGoods[indexEditting].goodId)
        setState({
            ...state,
            editGood: false,
            good: Object.assign({}, EMPTY_GOOD),
            goodOptions: goodOptions
        });

    }

    const handleSaveEditGood = () => {
        let { listGoods, good, indexEditting, goodOptions } = state;
        goodOptions = goodOptions.filter(x => x.value !== good.goodId)
        listGoods[indexEditting] = state.good;
        setState({
            ...state,
            editGood: false,
            good: Object.assign({}, EMPTY_GOOD),
            goodOptions: goodOptions,
            listGoods: [...listGoods]
        })
    }

    if (props.requestId !== state.requestId) {
        setState({
            ...state,
            requestId: props.requestId,
            listGoods: props.listGoods
        })
    }
    const { translate, selectBoxName } = props;
    const { good, errorGood, errorQuantity, listGoods, goodOptions, requestId } = state;

    return (
        <React.Fragment>
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">{translate('production.request_management.good_info')}</legend>
                <div className={`form-group ${!errorGood ? "" : "has-error"}`}>
                    <label>{translate('production.request_management.good_code')}</label>
                    <SelectBox
                        id={`select-good-purchasing-request-${selectBoxName ? selectBoxName : ""}`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={good.goodId}
                        items={goodOptions.length ? goodOptions : getAllGoods()}
                        onChange={handleGoodChange}
                        multiple={false}
                    />
                    <ErrorLabel content={errorGood} />
                </div>
                <div className={`form-group`}>
                    <label>{translate('production.request_management.good_base_unit')}</label>
                    <input type="text" value={good.baseUnit} disabled={true} className="form-control" />
                </div>
                <div className={`form-group ${!errorQuantity ? "" : "has-error"}`}>
                    <label className="control-label">{translate('production.request_management.quantity')}</label>
                    <div>
                        <input type="number" className="form-control" placeholder={100} value={good.quantity} onChange={handleQuantityChange} />
                    </div>
                    <ErrorLabel content={errorQuantity} />
                </div>
                <div className="pull-right" style={{ marginBottom: "10px" }}>
                    {state.editGood ?
                        <React.Fragment>
                            <button className="btn btn-success" onClick={handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('production.request_management.cancel_editing_good')}</button>
                            <button className="btn btn-success" disabled={!isGoodValidated()} onClick={handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('production.request_management.save_good')}</button>
                        </React.Fragment> :
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isGoodValidated()} onClick={handleAddGood}>{translate('production.request_management.add_good')}</button>
                    }
                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearGood}>{translate('production.request_management.delete_good')}</button>
                </div>
            </fieldset>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>{translate('production.request_management.index')}</th>
                        <th>{translate('production.request_management.good_code')}</th>
                        <th>{translate('production.request_management.good_name')}</th>
                        <th>{translate('production.request_management.good_base_unit')}</th>
                        <th>{translate('production.request_management.quantity')}</th>
                        <th>{translate('table.action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (!listGoods || listGoods.length === 0) ?
                            <tr>
                                <td colSpan={6}>
                                    <center>{translate('confirm.no_data')}</center>
                                </td>
                            </tr>
                            :
                            listGoods.map((good, index) => {
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{good.goodObject.code}</td>
                                    <td>{good.goodObject.name}</td>
                                    <td>{good.goodObject.baseUnit}</td>
                                    <td>{good.quantity}</td>
                                    <td>
                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditGood(good, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteGood(good, index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            })
                    }
                </tbody>
            </table>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodComponentRequest));
