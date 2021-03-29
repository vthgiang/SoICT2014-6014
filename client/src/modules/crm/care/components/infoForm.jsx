import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { formatFunction } from '../../common';
import { CrmCareActions } from '../redux/action';

class InfoCareForm extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            careInfomation: {}
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.careInfoId !== state.careInfoId) {
            props.getCare(props.careInfoId);
            return {
                dataStatus: 1,
                careInfoId: props.careInfoId,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        let { careInfomation, dataStatus } = this.state;
        if (dataStatus === this.DATA_STATUS.QUERYING && !nextProps.crm.cares.isLoading) {
            let care = nextProps.crm.cares.careById;
            careInfomation = { ...care };

            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                careInfomation,
            })
            return false;
        }

        if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return false;
        }
        return true;
    }

    formatCareStatus(input) {
        input = parseInt(input);
        if (input === 1) return 'Chưa thực hiện';
        if (input === 2) return 'Đang thực hiện';
        if (input === 3) return 'Đang tạm hoãn';
        if (input === 4) return 'Đã hoàn thành';
    }

    render() {
        const { crm, translate } = this.props;
        const { careInfomation } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-care-info" isLoading={crm.cares.isLoading}
                    formID="form-crm-care-info"
                    title={translate("crm.care.info")}
                    size={75}
                    func={this.save}
                // disableSubmit={!this.isFormValidated()}
                >
                    {/* Form xem công việc chăm sóc khách hàng */}
                    <div className="description-box" style={{ lineHeight: 1.5 }}>

                        {/* <h4>Thông tin hoạt động</h4> */}
                        <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{"Thông tin hoạt động"} </legend>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.care.customer')}</strong>
                                        <div className="col-sm-8">
                                            <span>{careInfomation.customer ? careInfomation.customer.map(o => o.name).join(', ') : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.care.caregiver')}</strong>
                                        <div className="col-sm-8">
                                            <span>{careInfomation.caregiver ? careInfomation.caregiver.map(o => o.name).join(', ') : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.care.name')}</strong>
                                        <div className="col-sm-8">
                                            <span>{careInfomation.name ? careInfomation.name : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.care.description')}</strong>
                                        <div className="col-sm-8">
                                            <div dangerouslySetInnerHTML={{ __html: careInfomation.description ? careInfomation.description : '' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.care.careType')}</strong>
                                        <div className="col-sm-8">
                                            <span>{careInfomation.careType ? careInfomation.careType.map(o => o.name).join(', ') : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{'Độ ưu tiên'}</strong>
                                        <div className="col-sm-8">
                                            <span>Ưu tiên cao</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                        <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.care.status')}</strong>
                                        <div className="col-sm-8">
                                            <span>{careInfomation.status ? this.formatCareStatus(careInfomation.status) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{'Người tạo hoạt động'}</strong>
                                        <div className="col-sm-8">
                                            <span>Nguyễn Văn Thái</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.care.startDate')}</strong>
                                        <div className="col-sm-8">
                                            <span>{careInfomation.startDate ? formatFunction.formatDate(careInfomation.startDate) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.care.endDate')}</strong>
                                        <div className="col-sm-8">
                                            <span>{careInfomation.endDate ? formatFunction.formatDate(careInfomation.endDate) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{"Chỉnh sửa lần cuối "}</strong>
                                        <div className="col-sm-8">
                                            <span>{"9:00 AM 24/03/2021"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{"Người chỉnh sửa"}</strong>
                                        <div className="col-sm-8">
                                            <span>{"Nguyễn Văn Danh"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </fieldset>
                    </div>
                    
                    <div className="description-box" style={{ lineHeight: 1.5 }}>

                        {/* <h4>Đánh giá hoạt động</h4> */}
                        <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{"Đánh giá hoạt động"} </legend>
                    <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{"Ngày hoàn thành"}</strong>
                                        <div className="col-sm-8">
                                            <span>9:00 AM 23/03/2021</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{"Kết quả hoạt động"}</strong>
                                        <div className="col-sm-8">
                                            <span>Thành công </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{"Điểm tự đánh giá"}</strong>
                                        <div className="col-sm-8">
                                            <span> 80 /100</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{"Nội dung đánh giá "}</strong>
                                        <div className="col-sm-8">
                                            <span>Khách hài lòng về sản phẩm, yêu cầu được báo giá </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        </fieldset>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getCare: CrmCareActions.getCare,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InfoCareForm));
