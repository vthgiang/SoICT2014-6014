import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../../common-components";

import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';

function LocateAndPlan(props) {
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                    <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Tọa độ vị trí</legend>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ khách hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" 
                                        // onChange={handleCustomer1AddressChange}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>
                                        Khách hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" 
                                        // onChange={handleCustomer1AddressChange}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ khách hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" 
                                        // onChange={handleCustomer1AddressChange}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>
                                        Tọa độ
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" 
                                        // onChange={handleCustomer1AddressChange}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
}

const actions = {
}

const connectedLocateAndPlan = connect(mapState, actions)(withTranslate(LocateAndPlan));
export { connectedLocateAndPlan as LocateAndPlan };