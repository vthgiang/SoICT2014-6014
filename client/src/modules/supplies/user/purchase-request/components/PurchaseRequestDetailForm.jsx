import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';
import { getFormatDateFromTime } from '../../../../../helpers/stringMethod';
import { AuthActions } from '../../../../auth/redux/actions';
import { isEqual } from 'lodash';

function PurchaseRequestDetailForm(props) {
    const [state, setState] = useState({})
    const [prevProps, setPrevProps] = useState()

    if(isEqual(prevProps, props) === false){
        setState(state => {
            return{ 
                ...state,
                _id: props._id,
                oldData: props,
                recommendNumber: props.recommendNumber,
                dateCreate: props.dateCreate,
                proponent: props.proponent,
                suppliesName: props.suppliesName,
                suppliesDescription: props.suppliesDescription,
                supplier: props.supplier,
                total: props.total,
                unit: props.unit,
                estimatePrice: props.estimatePrice,
                approver: props.approver,
                status: props.status,
                note: props.note,
                files: props.files,
                recommendUnits: props.recommendUnits,
            }
        })
        setPrevProps(props)
    }

    const { translate, purchaseRequest } = props;
    const { recommendNumber, dateCreate, proponent, suppliesName, suppliesDescription, supplier, total, unit, estimatePrice, approver, status, note, files, recommendUnits } = state;

    var formater = new Intl.NumberFormat();
    
    const convertStatus = (status) => {
        const { translate } = props;

        switch (status) {
            case 'approved': return translate('asset.usage.approved');
            case 'waiting_for_approval': return translate('asset.usage.waiting_approval');
            case 'disapproved': return translate('asset.usage.not_approved');
            default: return '';
        }
    }

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        props.downloadFile(`.${path}`, fileName);
    }

   
    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-view-recommendprocure" isLoading={purchaseRequest}
                formID="form-view-recommendprocure"
                title={translate('supplies.general_information.view_recommend_card')}
                hasSaveButton={false}
            >
                {/* Form xem chi tiết phiếu đăng ký mua sắm vật tư */}
                <form className="form-group" id="form-view-recommendprocure">
                    <div className="col-md-12">

                        {/* Mã phiếu */}
                        <div className="col-sm-6">
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.recommendNumber')}&emsp; </strong>
                                {recommendNumber}
                            </div>

                            {/* Ngày lập */}
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.dateCreate')}&emsp; </strong>
                                {getFormatDateFromTime(dateCreate, 'dd-mm-yyyy')}
                            </div>

                            {/* Người đề nghị */}
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.proponent')}&emsp; </strong>
                                {proponent ? proponent.name : ''}
                            </div>

                            {/* Đơn vị đề nghị */}
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.recommendUnits')}&emsp; </strong>
                                <ul>
                                    {recommendUnits && recommendUnits.map((obj, index) => (
                                        <li key={index}>{obj.name}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Vật tư đề nghị mua */}
                            <div className={`form-group`}>
                                <strong>{translate('supplies.purchase_request.suppliesName')}&emsp; </strong>
                                {suppliesName}
                            </div>


                            {/* Nhà cung cấp */}
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.supplier')}&emsp; </strong>
                                {supplier}
                            </div>

                            {/* Số lượng */}
                            <div className={`form-group `}>
                                <strong>{translate('supplies.purchase_request.total')}&emsp; </strong>
                                {total}
                            </div>
                        </div>

                        <div className="col-sm-6">
                            {/* Đơn vị tính */}
                            <div className={`form-group `}>
                                <strong>{translate('supplies.purchase_request.unit')}&emsp; </strong>
                                {unit}
                            </div>

                            {/* Giá trị dự tính */}
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.estimatePrice')}&emsp; </strong>
                                {estimatePrice ? formater.format(parseInt(estimatePrice)) : ''} VNĐ
                            </div>

                            {/* Người phê duyệt */}
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.approver')}&emsp; </strong>
                                {approver && approver.length ?
                                    approver.map((x) => (
                                        <div>
                                            {x.name}
                                        </div>
                                    )) : ''}
                            </div>

                            {/* Trạng thái */}
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.status')}&emsp; </strong>
                                {convertStatus(status)}
                            </div>

                            {/* Ghi chú */}
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.note')}&emsp; </strong>
                                {note}
                            </div>

                            {/* Mô tả Vật tư đề nghị mua */}
                            <div className={`form-group`}>
                                <strong>{translate('supplies.purchase_request.suppliesDescription')}&emsp; </strong>
                                {suppliesDescription}
                            </div>

                            {/* Tài liệu đính kèm */}
                            <div className="form-group">
                                <strong>{translate('supplies.purchase_request.files')}&emsp; </strong>
                                {
                                    files && files.length > 0 &&
                                    <ul>
                                        {
                                            files.map((obj, index) => (
                                                <li key={index}><a href="" title="Tải xuống" onClick={(e) => requestDownloadFile(e, obj.url, obj.fileName)}>{obj.fileName}</a></li>
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
};

function mapState(state) {
    const { purchaseRequest } = state;
    return { purchaseRequest };
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const detailPurchaseRequest = connect(mapState, actionCreators)(withTranslate(PurchaseRequestDetailForm));
export { detailPurchaseRequest as PurchaseRequestDetailForm };