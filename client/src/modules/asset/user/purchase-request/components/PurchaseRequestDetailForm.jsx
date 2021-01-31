import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';
import { getFormatDateFromTime } from '../../../../../helpers/stringMethod';
import { AuthActions } from '../../../../auth/redux/actions';
import { isEqual } from 'lodash';

class PurchaseRequestDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (isEqual(prevState.oldData, nextProps) === false) {
            return {
                ...prevState,
                _id: nextProps._id,
                oldData: nextProps,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: nextProps.dateCreate,
                proponent: nextProps.proponent,
                equipmentName: nextProps.equipmentName,
                equipmentDescription: nextProps.equipmentDescription,
                supplier: nextProps.supplier,
                total: nextProps.total,
                unit: nextProps.unit,
                estimatePrice: nextProps.estimatePrice,
                approver: nextProps.approver,
                status: nextProps.status,
                note: nextProps.note,
                files: nextProps.files,
                recommendUnits: nextProps.recommendUnits,
            }
        } else {
            return null;
        }
    }

    convertStatus(status) {
        const { translate } = this.props;

        switch (status) {
            case 'approved': return translate('asset.usage.approved');
            case 'waiting_approval': return translate('asset.usage.waiting_approval');
            case 'disapproved': return translate('asset.usage.not_approved');
            default: return '';
        }
    }

    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        this.props.downloadFile(`.${path}`, fileName);
    }

    render() {
        const { translate, recommendProcure } = this.props;
        const { recommendNumber, dateCreate, proponent, equipmentName, equipmentDescription, supplier, total, unit, estimatePrice, approver, status, note, files, recommendUnits } = this.state;

        var formater = new Intl.NumberFormat();
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-view-recommendprocure" isLoading={recommendProcure}
                    formID="form-view-recommendprocure"
                    title={translate('asset.manage_recommend_procure.view_recommend_card')}
                    hasSaveButton={false}
                >
                    {/* Form xem chi tiết phiếu đăng ký mua sắm tài sản */}
                    <form className="form-group" id="form-view-recommendprocure">
                        <div className="col-md-12">

                            {/* Mã phiếu */}
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <strong>{translate('asset.general_information.form_code')}&emsp; </strong>
                                    {recommendNumber}
                                </div>

                                {/* Ngày lập */}
                                <div className="form-group">
                                    <strong>{translate('asset.general_information.create_date')}&emsp; </strong>
                                    {getFormatDateFromTime(dateCreate, 'dd-mm-yyyy')}
                                </div>

                                {/* Người đề nghị */}
                                <div className="form-group">
                                    <strong>{translate('asset.usage.proponent')}&emsp; </strong>
                                    {proponent ? proponent.name : ''}
                                </div>

                                {/* Đơn vị đề nghị */}
                                <div className="form-group">
                                    <strong>{translate('asset.usage.recommend_units')}&emsp; </strong>
                                    <ul>
                                        {recommendUnits && recommendUnits.map((obj, index) => (
                                            <li key={index}>{obj.name}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Thiết bị đề nghị mua */}
                                <div className={`form-group`}>
                                    <strong>{translate('asset.manage_recommend_procure.asset_recommend')}&emsp; </strong>
                                    {equipmentName}
                                </div>


                                {/* Nhà cung cấp */}
                                <div className="form-group">
                                    <strong>{translate('asset.manage_recommend_procure.supplier')}&emsp; </strong>
                                    {supplier}
                                </div>

                                {/* Số lượng */}
                                <div className={`form-group `}>
                                    <strong>{translate('asset.general_information.number')}&emsp; </strong>
                                    {total}
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Đơn vị tính */}
                                <div className={`form-group `}>
                                    <strong>{translate('asset.manage_recommend_procure.unit')}&emsp; </strong>
                                    {unit}
                                </div>

                                {/* Giá trị dự tính */}
                                <div className="form-group">
                                    <strong>{translate('asset.manage_recommend_procure.expected_value')}&emsp; </strong>
                                    {estimatePrice ? formater.format(parseInt(estimatePrice)) : ''} VNĐ
                                </div>

                                {/* Người phê duyệt */}
                                <div className="form-group">
                                    <strong>{translate('asset.usage.accountable')}&emsp; </strong>
                                    {approver && approver.length ?
                                        approver.map((x) => (
                                            <div>
                                                {x.name}
                                            </div>
                                        )) : ''}
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <strong>{translate('asset.general_information.status')}&emsp; </strong>
                                    {this.convertStatus(status)}
                                </div>

                                {/* Ghi chú */}
                                <div className="form-group">
                                    <strong>{translate('asset.usage.note')}&emsp; </strong>
                                    {note}
                                </div>

                                {/* Mô tả thiết bị đề nghị mua */}
                                <div className={`form-group`}>
                                    <strong>{translate('asset.manage_recommend_procure.equipment_description')}&emsp; </strong>
                                    {equipmentDescription}
                                </div>

                                {/* Tài liệu đính kèm */}
                                <div className="form-group">
                                    <strong>{translate('human_resource.profile.attached_files')}&emsp; </strong>
                                    {
                                        files && files.length > 0 &&
                                        <ul>
                                            {
                                                files.map((obj, index) => (
                                                    <li key={index}><a href="" title="Tải xuống" onClick={(e) => this.requestDownloadFile(e, obj.url, obj.fileName)}>{obj.fileName}</a></li>
                                                ))
                                            }
                                        </ul>
                                    }
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
    downloadFile: AuthActions.downloadFile,
};

const detailRecommendProcure = connect(mapState, actionCreators)(withTranslate(PurchaseRequestDetailForm));
export { detailRecommendProcure as PurchaseRequestDetailForm };