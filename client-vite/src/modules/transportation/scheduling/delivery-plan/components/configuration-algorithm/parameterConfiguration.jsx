import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { withTranslate } from "react-redux-multilingual"
import ProgressBar from 'react-bootstrap/ProgressBar';
import './initRoute.css'
import ConfirmInitRoute from "../confirmInitRoute";

function ParameterConfiguration(props) {
    const { parameterConfigurationValues, handleInputChange, handleInitDeliveryPlan, isProgress, handleChangeEstimatedDeliveryDate} = props;
    const [state, setState] = useState({
        isInitFail: false,
        progressPercent: 0,
    })

    useEffect(() => {

    }, [])

    const showConfirmBox = () => {
        window.$(`#modal-confirm-create-route`).modal('show');
    }

    return (
        <>

            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <div className="box-header">
                        {
                            isProgress &&
                            <>
                                <p>Đang khởi tạo kế hoạch giao hàng ...</p>
                                <ProgressBar animated now={10} label={`${10}%`} max={100} min={0}/>
                            </>
                        }
                        <ConfirmInitRoute
                            handleChangeEstimatedDeliveryDate={handleChangeEstimatedDeliveryDate}
                            handleInitDeliveryPlan={handleInitDeliveryPlan}
                        />
                        <div className="box-title">
                            <span>Cấu hình thuật toán (1/2)</span>
                        </div>
                        <div style={{float: "right"}}>
                            <button type="button" className="btn btn-secondary text-right" aria-expanded="true" style={{marginRight: "5px"}}
                                onClick={props.prevStep}
                            ><i className="fa fa-arrow-left" aria-hidden="true"></i> Quay lại</button>
                            <button type="button" className="btn btn-success text-right" aria-expanded="true"
                                onClick={showConfirmBox}
                            >Khởi tạo</button>
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="box">
                            <div className="box-header">
                                <span className="box-title">Cơ bản</span>
                                <hr></hr>
                            </div>
                            <div className="box-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="time-window">
                                                    <label>Cho phép vi phạm khung thời gian</label>
                                                    <div className="switch">
                                                        <input className="checkbox-toggle" type="checkbox" name="isAllowedViolateTW" value={ parameterConfigurationValues.isAllowedViolateTW } onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="time-window">
                                                    <label>Tự động loại trừ hàng hoá</label>
                                                    <div className="switch">
                                                        <input className="checkbox-toggle" type="checkbox" name="isExcludeProduct" value={ parameterConfigurationValues.isExcludeProduct } onChange={handleInputChange}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-md-6">
                                                <div className="algorithm-run-time form-group">
                                                    <label>Thời gian chạy thuật toán tối đa</label>
                                                    <input className="form-control" type="number" name="maxTime"  placeholder="phút" value={ parameterConfigurationValues.maxTime } onChange={handleInputChange}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="time-window">
                                                    <label>Giới hạn thời gian xe chạy</label>
                                                    <div className="switch">
                                                        <input className="checkbox-toggle" type="checkbox" name=""/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-md-6">
                                                <div className="time-window">
                                                    <label>Giới hạn quãng đường xe chạy</label>
                                                    <div className="switch">
                                                        <input className="checkbox-toggle" type="checkbox"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="box-header">
                                <p className="box-title">Nâng cao</p>
                                <hr></hr>
                            </div>
                            <div className="box-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="row">
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="">Kích thước quần thể(cá thể)</label>
                                                <input className="form-control" type="number" name="popSize"  value={ parameterConfigurationValues.popSize } onChange={handleInputChange}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="">Tỷ lệ tinh hoa(%)</label>
                                                <input className="form-control" type="number" name="eliteRate"  value={ parameterConfigurationValues.eliteRate } onChange={handleInputChange}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="">Số thế hệ tối đa được sinh</label>
                                                <input className="form-control" type="number" name="maxGen"  value={ parameterConfigurationValues.maxGen } onChange={handleInputChange}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="">Số thế hệ tối đa không cải thiện</label>
                                                <input className="form-control" type="number" name="maxGenImprove"  value={ parameterConfigurationValues.maxGenImprove } onChange={handleInputChange}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="">Xác suất lai ghép</label>
                                                <input className="form-control" type="number" name="probCrossover"  value={ parameterConfigurationValues.probCrossover } onChange={handleInputChange}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="">Xác suất đột biến</label>
                                                <input className="form-control" type="number" name="probMutation"  value={ parameterConfigurationValues.probMutation } onChange={handleInputChange}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="">Số cá thể được chọn</label>
                                                <input className="form-control" type="number" name="tournamentSize"  value={ parameterConfigurationValues.tournamentSize } onChange={handleInputChange}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="">Tỷ lệ tập chọn lọc</label>
                                                <input className="form-control" type="number" name="selectionRate"  value={ parameterConfigurationValues.selectionRate } onChange={handleInputChange}/>
                                            </div>
                                            <div className="col-md-6 form-group">
                                                <label htmlFor="">Hệ sô mũ trong hàm fitness</label>
                                                <input className="form-control" type="number" name="exponentialFactor"  value={ parameterConfigurationValues.exponentialFactor } onChange={handleInputChange}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function mapState(state) {
    const example = state.example1;
    return { example }
}

const connectedParameterConfiguration = connect(mapState, null)(withTranslate(ParameterConfiguration));
export { connectedParameterConfiguration as ParameterConfiguration };