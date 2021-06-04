import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

function TransportMaterial(props) {
    return (
        <React.Fragment>
                
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="transport-row-eq-height">
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 0}}>
                    <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Thông tin kho xưởng</legend>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group`}>
                                    <label>
                                        Khách hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" disabled={false} 
                                            // value={address}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                <div className="form-group">
                                    <label>
                                        Tên khách hàng <span className="attention"> </span>
                                    </label>
                                    <input type="text" className="form-control" disabled={false} />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                            <div className={`form-group`}>
                                <label>
                                    Số điện thoại
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control"/>
                        
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                            <div className="form-group">
                                <label>
                                    Email <span className="attention"> </span>
                                </label>
                                <input type="text" className="form-control" disabled={false} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={`form-group`}>
                                <label>
                                    Địa chỉ nhận hàng
                                    <span className="attention"> * </span>
                                </label>
                                <textarea type="text" className="form-control" />
                            </div>
                        </div>
                    </fieldset>
                    
                </div>
        
        
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 0}}>
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                            <legend className="scheduler-border">Thông tin kho</legend>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group`}>
                                        <label>
                                            Kho
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={false} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <label>
                                            Người tạo phiếu <span className="attention"> </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={false} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ kho hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" disabled={false}/>
                                </div>
                            </div>

                            
                        </fieldset>
                      
                    </div>
            </div>
        
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const example = state.example1;
    return { example }
}

const actions = {
    // createExample: exampleActions.createExample,
    // getExamples: exampleActions.getExamples,
}

const connectedTransportMaterial = connect(mapState, actions)(withTranslate(TransportMaterial));
export { connectedTransportMaterial as TransportMaterial };