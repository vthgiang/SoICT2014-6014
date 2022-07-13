import React from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../../../common-components';
import { formatDate } from '../../../../../../helpers/formatDate';
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import { timelineText } from "./config"

function DetailForm(props) {

    const { translate, requestDetail } = props;
    let timelineTextArr = [];
    let timelineTextArr2 = [];
    if (requestDetail && requestDetail.type == '1'){
        timelineTextArr = timelineText.timelineTextPurchase1();
        timelineTextArr2 = timelineText.timelineTextPurchase2();
    }
    else if (requestDetail && requestDetail.type == '2')
        timelineTextArr = timelineText.timelineTextReceipt();
    else if (requestDetail && requestDetail.type == '3')
        timelineTextArr = timelineText.timelineTextIssue();
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-purchasing-request`} isLoading={false}
                title={translate('production.request_management.request_detail')}
                formID={`form-detail-purchasing-request`}
                size={75}
                maxWidth={600}
                hasSaveButton={false}
                hasNote={false}
            >
                {requestDetail ? (
                    <form id={`form-detail-request`}>
                        {requestDetail.status && <div className="timeline-create">
                            <div className="timeline-progress" style={{ width: parseInt(requestDetail.status) > 5 ? "100%" : (parseInt(requestDetail.status) - 1) / 4 * 100 + "%" }}></div>
                            <div className="timeline-items">
                                {timelineTextArr && timelineTextArr.length > 0 && timelineTextArr.map((item, index) => (
                                    <div className={`timeline-item ${index < parseInt(requestDetail.status) ? "active" : ""}`} key={index} >
                                        <div className={`timeline-contain`}>
                                            {item.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}
                        {requestDetail.status && requestDetail.type == '1' && <div className="timeline-create">
                            <div className="timeline-progress" style={{ width: (parseInt(requestDetail.status) - 6) / 3 * 100 + "%" }}></div>
                            <div className="timeline-items">
                                {timelineTextArr2 && timelineTextArr2.length > 0 && timelineTextArr2.map((item, index) => (
                                    <div className={`timeline-item ${index < parseInt(requestDetail.status) - 5 ? "active" : ""}`} key={index} >
                                        <div className={`timeline-contain`}>
                                            {item.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>}
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('production.request_management.code')}:&emsp;</strong>
                                    {requestDetail.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('production.request_management.creator')}:&emsp;</strong>
                                    {requestDetail.creator && requestDetail.creator.name}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('production.request_management.createdAt')}:&emsp;</strong>
                                    {formatDate(requestDetail.createdAt)}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('production.request_management.desiredTime')}:&emsp;</strong>
                                    {formatDate(requestDetail.desiredTime)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('production.request_management.description')}:&emsp;</strong>
                                    {requestDetail.description}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('production.request_management.good_detail')}</legend>
                                    <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>{translate('production.request_management.index')}</th>
                                                <th>{translate('production.request_management.good_code')}</th>
                                                <th>{translate('production.request_management.good_name')}</th>
                                                <th>{translate('production.request_management.quantity')}</th>
                                                <th>{translate('production.request_management.good_base_unit')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (requestDetail.goods
                                                    &&
                                                    requestDetail.goods.length === 0)
                                                &&
                                                <tr>
                                                    <td colSpan={5}>{translate('confirm.no_data')}</td>
                                                </tr>
                                            }
                                            {
                                                (requestDetail.goods
                                                    && requestDetail.goods.length !== 0)
                                                &&
                                                requestDetail.goods.map((good, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{good.good.code}</td>
                                                        <td>{good.good.name}</td>
                                                        <td>{good.quantity}</td>
                                                        <td>{good.good.baseUnit}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                ) : ""}
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { requestManagements } = state;
    return { requestManagements }
}

const mapDispatchToProps = {
    getDetailRequest: RequestActions.getDetailRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailForm));
