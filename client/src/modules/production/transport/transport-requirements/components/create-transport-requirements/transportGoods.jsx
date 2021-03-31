import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { exampleActions } from '../../redux/actions';
import { BillActions } from '../../../../warehouse/bill-management/redux/actions'
import { CrmCustomerActions } from "../../../../../crm/customer/redux/actions";
import { GoodActions} from '../../../../common-production/good-management/redux/actions';

function TransportGoods(props) {
    const {goods} = props;

    const [currentGood, setCurrentGood] = useState([]);
    const [listAllGoods, setListAllGoods] = useState([]);
    useEffect(() => {
        props.getAllGoods();
    }, [])

    useEffect(() => {
        console.log(props.listAllGoods, "aaaa");
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
        if (value[0] !== "0"){
            // let filterGood = listAllGoods.filter((r) => r._id === value[0]);
            // let currentGoodCode="", currentGoodName="";
            // if (filterGood.length > 0){
            //    currentGoodCode = filterGood[0].code ? filterGood[0].code : "";
            //    currentGoodName = filterGood[0].name ? filterGood[0].name : "";
            // }
            // setCurrentGood({
            //     ...currentGood,
            //     _id: value[0],
            //     name: currentGoodCode,
            //     code: currentGoodName,
            // })
            // console.log(currentGood, "current good")
        }
        console.log(value);
    }


    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            
            <div>
            {/* <fieldset className="scheduler-border" style={{ padding: 10 }}>
            <legend className="scheduler-border">Thông tin hàng hóa</legend>
                
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10, height: "100%" }}>
                <div className={`form-group`}>
                    <label>
                        Sản phẩm
                        <span className="attention"> * </span>
                    </label>
                    <SelectBox
                        id={`select-good-code-quote`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={good}
                        items={this.getGoodOptions()}
                        onChange={handleGoodChange}
                        multiple={false}
                    />
                </div>

                <div className="form-group">
                    <label>
                        Tên sản phẩm
                        <span className="attention"> * </span>
                    </label>
                    <input type="text" className="form-control"/>
                </div>
            </div>            

                <table className="table table-bordered not-sort">
                    <thead>
                        <tr>
                            <th title={"STT"}>STT</th>
                            <th title={"Mã sản phẩm"}>Mã sản phẩm</th>
                            <th title={"Tên sản phẩm"}>Tên sản phẩm</th>
                            <th title={"Đơn vị tính"}>Đ/v tính</th>
                            <th title={"Giá niêm yết"}>Giá niêm yết (vnđ)</th>
                            <th title={"giá tính tiền"}>giá tính tiền (vnđ)</th>
                            <th title={"Số lượng"}>Số lượng</th>
                            <th title={"Khối lượng vận chuyển"}>Khối lượng vận chuyển</th>
                            <th title={"Khuyến mãi"}>Khuyến mãi</th>
                            <th title={"Thành tiền"}>Thành tiền</th>
                            <th title={"Thuế"}>Thuế</th>
                            <th title={"Tổng tiền"}>Tổng tiền</th>
                            <th>Cam kết chất lượng</th>
                            <th title={"Ghi chú"}>Ghi chú</th>
                            <th title={"Hành động"}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(props.goods && props.goods.length !== 0) &&
                            props.goods.map((good, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * perPage}</td>
                                    <td>sssssss</td>
                                    <td>{good.good.code?good.good.code:""}</td>
                                    <td>{good.good.name?good.good.name:""}</td>
                                    <td>{example.description}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(example)}><i className="material-icons">visibility</i></a>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(example)}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('manage_example.delete')}
                                            data={{
                                                id: example._id,
                                                info: example.exampleName
                                            }}
                                            func={handleDelete}
                                        />
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </fieldset> */}
        </div>

{/* ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss */}

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
                                        value={"0"}
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
                                    <label>{"Số lượng"}</label>
                                    <input type="number" 
                                    // value={good.quantity} 
                                    // onChange={this.handleQuantityChange} 
                                    className="form-control" />
                                    {/* <ErrorLabel content={errorQuantity} /> */}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{"Khối lượng vận chuyển"}</label>
                                    <input type="number" 
                                    // value={good.quantity} 
                                    // onChange={this.handleQuantityChange} 
                                    className="form-control" />
                                    {/* <ErrorLabel content={errorQuantity} /> */}
                                </div>
                            </div>
                        </div>
                        
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                {/* {this.state.editGood ? ( */}
                                    <React.Fragment>
                                        <button className="btn btn-success" 
                                        // onClick={this.handleCancelEditGood} 
                                        style={{ marginLeft: "10px" }}>
                                            {"cancel_editing_good"}
                                        </button>
                                        <button className="btn btn-success" 
                                        // onClick={this.handleSaveEditGood} 
                                        style={{ marginLeft: "10px" }}>
                                            {"save_good"}
                                        </button>
                                    </React.Fragment>
                                {/* ) : ( */}
                                        {/* <button
                                            className="btn btn-success"
                                            style={{ marginLeft: "10px" }}
                                            disabled={!this.isGoodValidated()}
                                            onClick={this.handleAddGood}
                                        >
                                            {translate("manufacturing.purchasing_request.add_good")}
                                        </button>
                                    )}
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
                                {/* {listGoods && listGoods.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>{translate("general.no_data")}</td>
                                    </tr>
                                ) : (
                                        listGoods.map((x, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.good.code}</td>
                                                <td>{x.good.name}</td>
                                                <td>{x.good.baseUnit}</td>
                                                <td>{x.inventory}</td>
                                                <td>{x.quantity}</td>
                                                <td>
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
                                                </td>
                                            </tr>
                                        ))
                                    )} */}
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