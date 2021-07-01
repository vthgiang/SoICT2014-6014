import React from 'react';
import PropTypes from 'prop-types';

EvaluationTabInfoForm.propTypes = {

};

function EvaluationTabInfoForm(props) {
    const { id, evaluationInfo } = props
    return (
        <div className="tab-pane active " id={id}>
            <div className="box-body qlcv">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i style={{ fontSize: '17px', marginRight: '5px' }} className="fa fa-info-circle" aria-hidden="true"></i>
                    <h4>{evaluationInfo.employeeName} - NV 1402</h4>
                </div>
                {/* <div className="form-group row col-sm-4">
                    <strong >{'Mã nhân viên : '}</strong>
                    <div>
                        <span>{evaluationInfo.employeeId}</span>
                    </div>
                </div>
                <div className="form-group row col-sm-8">
                    <strong>{'Tên nhân viên : '}</strong>
                    <div >
                        <span>{evaluationInfo.employeeName}</span>
                    </div>
                </div> */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin các hoạt động chăm sóc khách hàng"} </legend>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Tổng số hoạt động :'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.totalCareActions}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Tỉ lệ hoàn thành hoạt động :'}</strong>
                        <div className="col-sm-8">
                            <span>{`${evaluationInfo.completionRate * 100} %`}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Tỉ lệ hoạt động thành công :'}</strong>
                        <div className="col-sm-8">
                            <span>{`${evaluationInfo.solutionRate * 100} %`}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Số hoạt động quá hạn :'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.numberOfOverdueCareAction}</span>
                        </div>
                    </div>
                </fieldset>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin khách hàng đang quản lý"} </legend>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Tổng số khách hàng đang quản lý :'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.totalCustomer}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Số khách hàng mới trong tháng :'}</strong>
                        <div className="col-sm-8">
                            <span>{`${evaluationInfo.numberOfNewCustomers}`}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Tỉ lệ khách hàng quay trở lại :'}</strong>
                        <div className="col-sm-8">
                            <span>{`${evaluationInfo.customerRetentionRate * 100} %`}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Tỉ lệ mua hàng ở khách hàng mới :'}</strong>
                        <div className="col-sm-8">
                            <span>{`${evaluationInfo.newCustomerBuyingRate * 100} %`}</span>
                        </div>
                    </div>
                </fieldset>
            </div>



        </div>
    );
}

export default EvaluationTabInfoForm;