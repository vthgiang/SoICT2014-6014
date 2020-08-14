import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';

class RecommendProcureDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: nextProps.dateCreate,
                proponent: nextProps.proponent,
                equipment: nextProps.equipment,
                supplier: nextProps.supplier,
                total: nextProps.total,
                unit: nextProps.unit,
                estimatePrice: nextProps.estimatePrice,
                approver: nextProps.approver,
                status: nextProps.status,
                note: nextProps.note,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, recommendProcure } = this.props;
        const { recommendNumber, dateCreate, proponent, equipment, supplier, total, unit, estimatePrice, approver, status, note } = this.state;

        var formater = new Intl.NumberFormat();

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-view-recommendprocure" isLoading={recommendProcure}
                    formID="form-view-recommendprocure"
                    title="Thông tin phiếu đề nghị mua sắm thiết bị"
                    hasSaveButton={false}
                >
                    {/* Form xem chi tiết phiếu đăng ký mua sắm tài sản */}
                    <form className="form-group" id="form-view-recommendprocure">
                        <div className="col-md-12">

                            {/* Mã phiếu */}
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <strong>Mã phiếu:&emsp; </strong>
                                    {recommendNumber}
                                </div>

                                {/* Ngày lập */}
                                <div className="form-group">
                                    <strong>Ngày lập:&emsp; </strong>
                                    {dateCreate}
                                </div>

                                {/* Người đề nghị */}
                                <div className="form-group">
                                    <strong>Người đề nghị:&emsp; </strong>
                                    {proponent ? proponent.name : 'User is deleted'}
                                </div>

                                {/* Thiết bị đề nghị mua */}
                                <div className={`form-group`}>
                                    <strong>Thiết bị đề nghị mua:&emsp; </strong>
                                    {equipment}
                                </div>

                                {/* Nhà cung cấp */}
                                <div className="form-group">
                                    <strong>Nhà cung cấp:&emsp; </strong>
                                    {supplier}
                                </div>

                                {/* Số lượng */}
                                <div className={`form-group `}>
                                    <strong>Số lượng:&emsp; </strong>
                                    {total}
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Đơn vị tính */}
                                <div className={`form-group `}>
                                    <strong>Đơn vị tính:&emsp; </strong>
                                    {unit}
                                </div>

                                {/* Giá trị dự tính */}
                                <div className="form-group">
                                    <strong>Giá trị dự tính:&emsp; </strong>
                                    {estimatePrice ? formater.format(parseInt(estimatePrice)) : ''} VNĐ
                                </div>

                                {/* Người phê duyệt */}
                                <div className="form-group">
                                    <strong>Người phê duyệt:&emsp; </strong>
                                    {approver ? approver.name : 'User is deleted'}
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <strong>Trạng thái:&emsp; </strong>
                                    {status}
                                </div>

                                {/* Ghi chú */}
                                <div className="form-group">
                                    <strong>Ghi chú:&emsp; </strong>
                                    {note}
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { recommendProcure } = state;
    return { recommendProcure };
};

const actionCreators = {

};

const detailRecommendProcure = connect(null, null)(withTranslate(RecommendProcureDetailForm));
export { detailRecommendProcure as RecommendProcureDetailForm };