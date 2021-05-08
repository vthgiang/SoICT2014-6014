import React from 'react';
import PropTypes from 'prop-types';

EvaluationTabInfoForm.propTypes = {

};

function EvaluationTabInfoForm(props) {
    const { id,evaluationInfo } = props
    return (
        <div className="tab-pane active " id={id}>
            <div className="box-body qlcv">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin đánh giá nhân viên"} </legend>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Mã nhân viên'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.staffCode}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Tên nhân viên'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.staffName}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Số khách hàng đang quản lý'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.numberOfCustomers}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Tổng số hoạt động'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.totalCare}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Số hoạt động đã hoàn thành'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.numberOfCompletedCares}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Số hoạt động đang thực hiện'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.numberOfProcessingCares}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Số hoạt động quá hạn'}</strong>
                        <div className="col-sm-8">
                            <span>{evaluationInfo.numberOfExpiredCares}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Tỉ lệ thành công'}</strong>
                        <div className="col-sm-8">
                            <span>{`${evaluationInfo.successRate*100} %`}</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <strong className="col-sm-4">{'Đánh giá trung bình'}</strong>
                        <div className="col-sm-8">
                            <span>{`${evaluationInfo.averagePoint} /10`}</span>
                        </div>
                    </div>

                </fieldset>
            </div>



        </div>
    );
}

export default EvaluationTabInfoForm;