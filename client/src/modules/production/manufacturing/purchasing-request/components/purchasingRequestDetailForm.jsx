import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../../common-components';
import { formatDate } from '../../../../../helpers/formatDate';
import { purchasingRequestActions } from '../redux/actions';
class PurchasingRequestDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.purchasingRequestDetail !== nextProps.purchasingRequestDetail) {
            this.props.getDetailPurchasingRequest(nextProps.purchasingRequestDetail._id);
            // false vì đây là lần đầu tiên ấn vào nút detail khi này props id truyền vào != props id hiện tại
            // nên là gọi get Detail để lấy dữ liệu gán vào state của redux
            return false;
        }
        // trả về true vì sau khi state redux được cập nhật vào biến currentPuschasingRequest thì lúc này props id  = next props id
        // Nên trả true để render ra
        return true;
    }

    render() {
        const { translate, purchasingRequest } = this.props;
        let currentPurchasingRequest = {};
        if (purchasingRequest.currentPurchasingRequest) {
            currentPurchasingRequest = purchasingRequest.currentPurchasingRequest
        }

        console.log("rendering....");
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-info-purchasing-request`} isLoading={this.props.purchasingRequest.isLoading}
                    title={translate('manufacturing.purchasing_request.purchasing_request_detail')}
                    formID={`form-detail-purchasing-request`}
                    size={75}
                    maxWidth={600}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-purchasing-request`}>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manufacturing.purchasing_request.code')}:&emsp;</strong>
                                    {currentPurchasingRequest.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.purchasing_request.command_code')}:&emsp;</strong>
                                    {currentPurchasingRequest.manufacturingCommand && currentPurchasingRequest.manufacturingCommand.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.purchasing_request.creator')}:&emsp;</strong>
                                    {currentPurchasingRequest.creator && currentPurchasingRequest.creator.name}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.purchasing_request.createdAt')}:&emsp;</strong>
                                    {formatDate(currentPurchasingRequest.createdAt)}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manufacturing.purchasing_request.receiveTime')}:&emsp;</strong>
                                    {formatDate(currentPurchasingRequest.intendReceiveTime)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.purchasing_request.description')}:&emsp;</strong>
                                    {currentPurchasingRequest.description}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.purchasing_request.status')}:&emsp;</strong>
                                    {currentPurchasingRequest.status && <span style={{ color: translate(`manufacturing.purchasing_request.${currentPurchasingRequest.status}.color`) }}>{translate(`manufacturing.purchasing_request.${currentPurchasingRequest.status}.content`)}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manufacturing.purchasing_request.material_detail')}</legend>
                                    <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>{translate('manufacturing.purchasing_request.index')}</th>
                                                <th>{translate('manufacturing.purchasing_request.good_code')}</th>
                                                <th>{translate('manufacturing.purchasing_request.good_name')}</th>
                                                <th>{translate('manufacturing.purchasing_request.quantity')}</th>
                                                <th>{translate('manufacturing.purchasing_request.good_base_unit')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (currentPurchasingRequest.materials
                                                    &&
                                                    currentPurchasingRequest.materials.length === 0)
                                                &&
                                                <tr>
                                                    <td colSpan={5}>{translate('confirm.no_data')}</td>
                                                </tr>
                                            }
                                            {
                                                (currentPurchasingRequest.materials
                                                    && currentPurchasingRequest.materials.length !== 0)
                                                &&
                                                currentPurchasingRequest.materials.map((material, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{material.good.code}</td>
                                                        <td>{material.good.name}</td>
                                                        <td>{material.quantity}</td>
                                                        <td>{material.good.baseUnit}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { purchasingRequest } = state;
    return { purchasingRequest }
}

const mapDispatchToProps = {
    getDetailPurchasingRequest: purchasingRequestActions.getDetailPurchasingRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchasingRequestDetailForm));