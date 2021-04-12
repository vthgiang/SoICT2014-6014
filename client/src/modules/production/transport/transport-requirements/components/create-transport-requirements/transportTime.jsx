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

function TransportTime(props) {
    const {callBackState} = props;

    const [currentTime, setCurrentTime] = useState({
        time: "",
        detail: "",
    });

    const [listTimeChosen, setListTimeChosen] = useState([]);

    let handleTimeChange = (value) => {
        setCurrentTime({
            ...currentTime,
            time: value,
        })
    }
    let handleDetailChange = (e) => {
        setCurrentTime({
            ...currentTime,
            detail: e.target.value,
        })
    }
    const handleAddTime = (e) => {
        e.preventDefault();
        let time = {
            time: currentTime.time,
            detail: currentTime.detail,
        }
        setListTimeChosen(listTimeChosen => [...listTimeChosen, time]);
    }

    useEffect(() => {
        console.log(listTimeChosen, " danh sach thoi gian lua chon");
        callBackState(listTimeChosen);
    }, [listTimeChosen])
    return (
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <fieldset className="scheduler-border">
            <legend className="scheduler-border">{"Thời gian mong muốn"}</legend>
            <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="row">
                            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                                <div className={`form-group`}
                                >
                                    <label>
                                        {"Chọn ngày"}
                                        <span className="attention"> * </span>
                                    </label>
                                    <DatePicker
                                        id={`expected_date`}
                                        value={currentTime.time}
                                        onChange={handleTimeChange}
                                        disabled={false}
                                    />
                                    {/* <ErrorLabel content={errorGood} /> */}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-5 col-md-5 col-lg-5">
                                <div className={`form-group`}
                                >
                                    <label>{"Yêu cầu thêm"}</label>
                                    <textarea type="text" className="form-control" 
                                        value={currentTime.detail}
                                        onChange={handleDetailChange}
                                    />
                                    {/* <ErrorLabel content={errorGood} /> */}
                                </div>
                            </div>
                            <div style={{ marginTop: "24px" }}>
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
                                            onClick={handleAddTime}
                                        >
                                            {"Thêm yêu cầu"}
                                        </button>
                                    {/* )}
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>
                                    {translate("manufacturing.purchasing_request.delete_good")}
                                </button> */}
                            </div>
                        
                        </div>
                        
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>{"Số thứ tự"}</th>
                                    <th>{"Ngày"}</th>
                                    <th>{"Chi tiết"}</th>
                                    {/* <th>{translate("manufacturing.plan.base_unit")}</th>
                                    <th>{translate("manufacturing.plan.quantity_good_inventory")}</th>
                                    <th>{translate("manufacturing.plan.quantity")}</th>
                                    <th>{translate("table.action")}</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {listTimeChosen && listTimeChosen.length === 0 ? (
                                    <tr>
                                        {/* <td colSpan={7}>{translate("general.no_data")}</td> */}
                                        <td colSpan={3}>{"Không có dữ liệu"}</td>
                                    </tr>
                                ) : (
                                    listTimeChosen.map((x, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.time}</td>
                                                <td>{x.detail}</td>
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

const connectedTransportTime = connect(mapState, actions)(withTranslate(TransportTime));
export { connectedTransportTime as TransportTime };