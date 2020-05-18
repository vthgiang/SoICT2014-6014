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
                positionProponent: nextProps.position,
                equipment: nextProps.equipment,
                supplier: nextProps.supplier,
                total: nextProps.total,
                unit: nextProps.unit,
                estimatePrice: nextProps.estimatePrice,
                approver: nextProps.approver,
                positionApprover: nextProps.positionApprover,
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
        const { recommendNumber, dateCreate, proponent, positionProponent, equipment, supplier,
            total, unit, estimatePrice, approver, positionApprover, status, note } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-view-recommendprocure" isLoading={recommendProcure}
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
                                    {/* <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} disabled/> */}
                                </div>
                                <div className="form-group">
                                    <strong>Ngày lập:&emsp; </strong>
                                    {dateCreate}
                                    {/* <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_start_date"
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    /> */}
                                </div>
                                <div className="form-group">
                                    <strong>Người đề nghị:&emsp; </strong>
                                    {proponent}
                                    {/* <label>Người đề nghị<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="proponent" value={proponent} disabled /> */}
                                </div>
                                {/* <div className="form-group">
                                    <label>Đơn vị</label>
                                    <input type="text" className="form-control" name="department" value={department} disabled  />
                                </div> */}
                                <div className="form-group">
                                    <strong>Chức vụ người đề nghị:&emsp; </strong>
                                    {positionProponent}
                                    {/* <label>Chức vụ người đề nghị</label>
                                    <input type="text" className="form-control" name="position"  value={positionProponent} disabled/> */}
                                </div>
                                <div className={`form-group`}>
                                    <strong>Thiết bị đề nghị mua:&emsp; </strong>
                                    {equipment}
                                    {/* <label>Thiết bị đề nghị mua<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="equipment" value={equipment} onChange={this.handleEquipmentChange}></textarea> */}
                                </div>
                                <div className="form-group">
                                <strong>Nhà cung cấp:&emsp; </strong>
                                    {supplier}
                                    {/* <label>Nhà cung cấp<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="supplier" value={supplier} onChange={this.handleSupplierChange} /> */}
                                </div>
                                <div className={`form-group `}>
                                <strong>Số lượng:&emsp; </strong>
                                    {total}
                                    {/* <label>Số lượng<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="total" value={total} onChange={this.handleTotalChange} /> */}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                {/* <div className="form-group">
                                    <label>Nhà cung cấp</label>
                                    <input type="text" className="form-control" name="supplier" value={supplier} onChange={this.handleSupplierChange} />
                                </div> */}

                                <div className={`form-group `}>
                                <strong>Đơn vị tính:&emsp; </strong>
                                    {unit}
                                    {/* <label>Đơn vị tính<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" /> */}
                                </div>
                                <div className="form-group">
                                <strong>Giá trị dự tính:&emsp; </strong>
                                    {formater.format(parseInt(estimatePrice))} VNĐ
                                    {/* <label>Giá trị dự tính (VNĐ)</label>
                                    <input style={{ display: "inline", width: "93%" }} type="number" className="form-control" name="estimatePrice" value={estimatePrice} onChange={this.handleEstimatePriceChange} />
                                    <label style={{ height: 34, display: "inline", width: "5%" }}>  VNĐ</label> */}
                                </div>
                                {/* <div className="form-group">
                                    <label>Trạng thái</label>
                                    <input type="text" className="form-control" name="status" value={status} disabled />
                                </div> */}
                                <div className="form-group">
                                <strong>Người phê duyệt:&emsp; </strong>
                                    {approver}
                                    {/* <label>Người phê duyệt</label>
                                    <input type="text" className="form-control" name="approver" value={approver} disabled /> */}
                                </div>
                                <div className="form-group">
                                <strong>Chức vụ người phê duyệt:&emsp; </strong>
                                    {positionApprover}
                                    {/* <label>Chức vụ người phê duyệt:</label>
                                    <input type="text" className="form-control" name="position1" value={positionApprover} disabled /> */}
                                </div>
                                <div className="form-group">
                                <strong>Trạng thái:&emsp; </strong>
                                    {status}
                                    {/* <label>Trạng thái</label>
                                    <input type="text" className="form-control" name="status" value={status} disabled /> */}
                                </div>
                                <div className="form-group">
                                <strong>Ghi chú:&emsp; </strong>
                                    {note}
                                    {/* <label>Ghi chú</label>
                                    <input type="text" className="form-control" name="note" value={note} disabled /> */}
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
    // updateRecommendProcure: RecommendProcureActions.updateRecommendProcure,
};

const detailRecommendProcure = connect(null, null)(withTranslate(RecommendProcureDetailForm));
export { detailRecommendProcure as RecommendProcureDetailForm };