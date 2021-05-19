import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { worksActions } from "../../../../manufacturing/manufacturing-works/redux/actions"

function TransportImportGoods(props) {

    let {currentBill, callBackGeneralInfo,
        manufacturingWorks,
    } = props;
    const [formValue, setFormValue] = useState({
        stockCode: "",
        stockName: "",
        stockAddress: "",
        billCreator:"",
        millCode: "",
        millName: "",
        worksCode: "",
        worksName: "",
        worksAddress: "",
    })
    useEffect(() => {
        if (currentBill){
            setFormValue({
                ...formValue,
                stockCode: currentBill.fromStock?.code,
                billCreator: currentBill.creator?.name,
                stockName: currentBill.fromStock?.name,
                stockAddress: currentBill.fromStock?.address,
                millCode: currentBill.manufacturingMill?.code,
                millName: currentBill.manufacturingMill?.name,
            })
            if (currentBill.manufacturingMill){
                if (currentBill.manufacturingMill.manufacturingWorks){
                    let worksId = currentBill.manufacturingMill.manufacturingWorks.id?currentBill.manufacturingMill.manufacturingWorks.id:currentBill.manufacturingMill.manufacturingWorks;
                    console.log(worksId, " lolololololo")
                    props.getDetailManufacturingWorks(worksId);
                }
            }
        }
    },[currentBill])
    useEffect(() => {
        if (manufacturingWorks){
            if (manufacturingWorks.currentWorks){
                setFormValue({
                    ...formValue,
                    worksCode: manufacturingWorks.currentWorks.code,
                    worksName: manufacturingWorks.currentWorks.name,
                    worksAddress: manufacturingWorks.currentWorks.address,
                })
            }
        }
    }, [manufacturingWorks])

    useEffect(() => {
        if (formValue){
            let data = {
                customer1AddressTransport: formValue.worksAddress,
                customer2AddressTransport: formValue.stockAddress,
            }
            callBackGeneralInfo(data);
        }
    }, [formValue])

    return (
        <React.Fragment>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 0, height: "100%" }}>
                    <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Thông tin xưởng sản xuất</legend>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group`}>
                                    <label>
                                        Xưởng
                                        <span className="attention"> * </span>
                                    </label>
                                    <input type="text" className="form-control" disabled={false} 
                                            value={formValue.millCode}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                <div className="form-group">
                                    <label>
                                        Tên xưởng<span className="attention"> </span>
                                    </label>
                                    <input type="text" className="form-control" disabled={false} 
                                            value={formValue.millName}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                            <div className={`form-group`}>
                                <label>
                                    Mã nhà máy
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control"
                                    value={formValue.worksCode}
                                />
                        
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                            <div className="form-group">
                                <label>
                                    Tên nhà máy <span className="attention"> </span>
                                </label>
                                <input type="text" className="form-control" disabled={false} 
                                    value={formValue.worksName}/>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={`form-group`}>
                                <label>
                                    Địa chỉ nhà máy
                                    <span className="attention"> * </span>
                                </label>
                                <textarea type="text" className="form-control" 
                                    value={formValue.worksAddress}/>
                            </div>
                        </div>
                    </fieldset>
                    
                </div>
        
        
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 0, height: "100%" }}>
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                            <legend className="scheduler-border">Thông tin kho</legend>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{ padding: 0 }}>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group`}>
                                        <label>
                                            Kho
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={false}
                                                value={formValue.stockCode}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                                    <div className="form-group">
                                        <label>
                                            Tên kho <span className="attention"> </span>
                                        </label>
                                        <input type="text" className="form-control" disabled={false} 
                                                value={formValue.stockName}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className={`form-group`}>
                                    <label>
                                        Địa chỉ kho hàng
                                        <span className="attention"> * </span>
                                    </label>
                                    <textarea type="text" className="form-control" disabled={false}
                                        value={formValue.stockAddress}
                                    />
                                </div>
                            </div>

                            
                        </fieldset>
                      
                    </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const {manufacturingWorks} = state;
    return { manufacturingWorks }
}

const actions = {
    // createExample: exampleActions.createExample,
    // getExamples: exampleActions.getExamples,
    getDetailManufacturingWorks: worksActions.getDetailManufacturingWorks
}

const connectedTransportImportGoods = connect(mapState, actions)(withTranslate(TransportImportGoods));
export { connectedTransportImportGoods as TransportImportGoods };