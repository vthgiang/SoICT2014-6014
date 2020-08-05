import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker } from '../../../../common-components';
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
        var formater = new Intl.NumberFormat();
        const { translate, recommendProcure } = this.props;
        const { recommendNumber, dateCreate, proponent, equipment, supplier, total, unit, estimatePrice, approver, status, note } = this.state;
        console.log('this.state-detail', this.state);
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-view-recommendprocure" isLoading={recommendProcure}
                    formID="form-view-recommendprocure"
                    title="Thông tin phiếu đề nghị mua sắm thiết bị"
                    hasSaveButton={false}
                >
                    <form className="form-group" id="form-view-recommendprocure">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <strong>Mã phiếu:&emsp; </strong>
                                    {recommendNumber}
                                </div>
                                <div className="form-group">
                                    <strong>Ngày lập:&emsp; </strong>
                                    {dateCreate}
                                </div>
                                <div className="form-group">
                                    <strong>Người đề nghị:&emsp; </strong>
                                    {/* {proponent} */}
                                    {proponent.name}
                                    {/* {proponent ? proponent.name : ''} */}
                                </div>
                                <div className={`form-group`}>
                                    <strong>Thiết bị đề nghị mua:&emsp; </strong>
                                    {equipment}
                                </div>
                                <div className="form-group">
                                <strong>Nhà cung cấp:&emsp; </strong>
                                    {supplier}
                                </div>
                                <div className={`form-group `}>
                                <strong>Số lượng:&emsp; </strong>
                                    {total}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className={`form-group `}>
                                <strong>Đơn vị tính:&emsp; </strong>
                                    {unit}
                                </div>
                                <div className="form-group">
                                <strong>Giá trị dự tính:&emsp; </strong>
                                    {estimatePrice ? formater.format(parseInt(estimatePrice)) : ''} VNĐ
                                </div>
                                <div className="form-group">
                                <strong>Người phê duyệt:&emsp; </strong>
                                    {/* {approver ? approver: ''} */}
                                    {approver ? approver.name : ''}
                                </div>
                                <div className="form-group">
                                <strong>Trạng thái:&emsp; </strong>
                                    {status}
                                </div>
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