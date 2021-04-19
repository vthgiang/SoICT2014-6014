import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { exampleActions } from '../../redux/actions';
import { BillActions } from '../../../../warehouse/bill-management/redux/actions'
import { CrmCustomerActions } from "../../../../../crm/customer/redux/actions";
import { GoodActions} from '../../../../common-production/good-management/redux/actions';
import { validate } from 'uuid';

function TransportGoods(props) {
    const {goods, callBackState} = props;

    const [currentGood, setCurrentGood] = useState({});

    const [listAllGoods, setListAllGoods] = useState([]);

    const [listGoodsChosen, setListGoodsChosen] = useState([]);

    useEffect(() => {
        props.getAllGoods();
        setCurrentGood({
            _id: "0",
            quantity: 1,
            currentSelectBoxGoodText: "Chọn hàng hóa",
            volume: 1,
            weight: 1
        })
    }, [])

    useEffect(() => {
        setListAllGoods(props.listAllGoods);
    }, [props.listAllGoods])

    const getAllGoods = () => {
        let listGoods = [
            {
                value: "0",
                text: "Chọn hàng hóa",
            },
        ];        
        if (listAllGoods) {
            listAllGoods.map((item) => {
                listGoods.push({
                    value: item._id,
                    text: item.code + " - " + item.name,
                });
            });
        }
        return listGoods;
    }

    let handleGoodChange = (value) => {
        if (value[0] !== "0" && listAllGoods){
            let filterGood = listAllGoods.filter((r) => r._id === value[0]);
            let currentGoodCode="", currentGoodName="";
            if (filterGood.length > 0){
               currentGoodCode = filterGood[0].code ? filterGood[0].code : "";
               currentGoodName = filterGood[0].name ? filterGood[0].name : "";
            }
            const currentSelectBoxGoodText = currentGoodCode + " - " + currentGoodName;
            setCurrentGood({
                ...currentGood,
                _id: value[0],
                name: currentGoodCode,
                code: currentGoodName,
                currentSelectBoxGoodText: currentSelectBoxGoodText,
            })
        }
    }
    const handleQuantityChange = (e) => {
        let {value} = e.target;
        validateQuantityChange(value);
    }

    const validateQuantityChange = (value) => {
        let v = 1;
        value = parseInt(value);
        if (value > 0) {
            v = parseInt(value);
        }
        setCurrentGood({
            ...currentGood,
            quantity: v,
        })
    }

    const handleWeightChange = (e) => {
        let {value} = e.target;
        validateWeightChange(value);
    }

    const validateWeightChange = (value) => {
        let v = 1;
        value = parseInt(value);
        if (value > 0) {
            v = parseInt(value);
        }
        setCurrentGood({
            ...currentGood,
            weight: v,
        })
    }

    const handleVolumeChange = (e) => {
        let {value} = e.target;
        validateVolumeChange(value);
    }

    const validateVolumeChange = (value) => {
        let v = 1;
        value = parseInt(value);
        if (value > 0) {
            v = parseInt(value);
        }
        setCurrentGood({
            ...currentGood,
            volume: v,
        })
    }
    /**
     * Xử lý khi ấn nút thêm hàng hóa (set state listGoodsChosen để callback) 
     */
    const handleAddGood = (e) => {
        e.preventDefault();
        let good = {
            _id: currentGood._id,
            code: currentGood.code ? currentGood.code : "",
            name: currentGood.name ? currentGood.name : "",
            quantity: currentGood.quantity,
            volume: currentGood.volume,
            payload: currentGood.weight,
        }
        setListGoodsChosen(listGoodsChosen => [...listGoodsChosen, good]);
    }
    useEffect(() => {
        if(goods && goods.length!==0){
            let goodList = [];
            goods.map(good => {
                goodList.push({
                    _id: good?.good?._id,
                    code: good?.good.code ? good.good.code : "",
                    name: good?.good.name ? good?.good.name : "",
                    quantity: good?.quantity,
                    volume: good?.volume,
                    payload: good?.weight,  
                })
            })
            setListGoodsChosen(goodList);
        }
    }, [goods])
    useEffect(() => {
        console.log(listGoodsChosen, " danh sach hang hoa chon");
        callBackState(listGoodsChosen);
    }, [listGoodsChosen])
    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <fieldset className="scheduler-border">
            <legend className="scheduler-border">{"Thông tin hàng hóa"}</legend>
            <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group 
                                `}
                                >
                                    <label>{"Chọn hàng hóa"}</label>
                                    <SelectBox
                                        id={`select-good`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={currentGood._id}
                                        items={getAllGoods()}
                                        onChange={handleGoodChange}
                                        multiple={false}
                                    />
                                    {/* <ErrorLabel content={errorGood} /> */}
                                </div>
                            </div>
                            {/* <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate("manufacturing.plan.quantity_good_inventory")}</label>
                                    <input type="number" value={good.inventory} disabled={true} className="form-control" />
                                </div>
                            </div> */}
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{"Số lượng"}</label>
                                    <input type="number" 
                                    value={currentGood.quantity} 
                                    onChange={handleQuantityChange} 
                                    className="form-control" />
                                    {/* <ErrorLabel content={errorQuantity} /> */}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate("manufacturing.plan.base_unit")}</label>
                                    <input type="text" value={good.baseUnit} disabled={true} className="form-control" />
                                </div>
                            </div> */}
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{"Khối lượng"}</label>
                                    <input type="number" 
                                    value={currentGood.weight} 
                                    onChange={handleWeightChange} 
                                    className="form-control" />
                                    {/* <ErrorLabel content={errorQuantity} /> */}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{"Thể tích"}</label>
                                    <input type="number" 
                                    value={currentGood.volume} 
                                    onChange={handleVolumeChange} 
                                    className="form-control" />
                                    {/* <ErrorLabel content={errorQuantity} /> */}
                                </div>
                            </div>
                        </div>
                        
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                {/* {this.state.editGood ? ( */}
                                    {/* <React.Fragment>
                                        <button className="btn btn-success" 
                                        // onClick={this.handleCancelEditGood} 
                                        style={{ marginLeft: "10px" }}>
                                            {"cancel_editing_good"}
                                        </button>
                                        <button className="btn btn-success" 
                                        onClick={this.handleSaveEditGood} 
                                        style={{ marginLeft: "10px" }}>
                                            {"save_good"}
                                        </button>
                                    </React.Fragment> */}
                                {/* ) : ( */}
                                        <button
                                            className="btn btn-success"
                                            style={{ marginLeft: "10px" }}
                                            // disabled={!this.isGoodValidated()}
                                            onClick={handleAddGood}
                                        >
                                            {"Thêm hàng hóa"}
                                        </button>
                                    {/* )}
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
                                    {translate("manufacturing.purchasing_request.delete_good")}
                                </button> */}
                            </div>
                        
                        
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>{"Số thứ tự"}</th>
                                    <th>{"Mã sản phẩm"}</th>
                                    <th>{"Tên sản phẩm"}</th>
                                    <th>{"Số lượng"}</th>
                                    <th>{"Khối lượng vận chuyển"}</th>
                                    {/* <th>{translate("manufacturing.plan.base_unit")}</th>
                                    <th>{translate("manufacturing.plan.quantity_good_inventory")}</th>
                                    <th>{translate("manufacturing.plan.quantity")}</th>
                                    <th>{translate("table.action")}</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {listGoodsChosen && listGoodsChosen.length === 0 ? (
                                    <tr>
                                        {/* <td colSpan={7}>{translate("general.no_data")}</td> */}
                                        <td colSpan={5}>{"Không có dữ liệu"}</td>
                                    </tr>
                                ) : (
                                    listGoodsChosen.map((x, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.code}</td>
                                                <td>{x.name}</td>
                                                <td>{x.quantity}</td>
                                                <td>{x.volume}</td>
                                                {/* <td>
                                                    <a
                                                        href="#abc"
                                                        className="edit"
                                                        title={translate("general.edit")}
                                                        onClick={() => this.handleEditGood(x, index)}
                                                    >
                                                        <i className="material-icons"></i>
                                                    </a>
                                                    <a
                                                        href="#abc"
                                                        className="delete"
                                                        title={translate("general.delete")}
                                                        onClick={() => this.handleDeleteGood(index)}
                                                    >
                                                        <i className="material-icons"></i>
                                                    </a>
                                                </td> */}
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>
                    
                    </div>
                </div>
            
        </fieldset>
        </div>

    
    );
}

function mapState(state) {
    const listAllGoods = state.goods.listALLGoods;
    return { listAllGoods }
}

const actions = {
    getAllGoods: GoodActions.getAllGoods,
}

const connectedTransportGoods = connect(mapState, actions)(withTranslate(TransportGoods));
export { connectedTransportGoods as TransportGoods };