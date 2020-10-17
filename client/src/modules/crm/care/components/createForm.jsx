import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { ButtonModal, DialogModal, SelectBox, DatePicker, ConfirmNotification } from '../../../../common-components';

class CreateCareForm extends Component {
    render() {
        const { translate } = this.props;
        const { cares } = this.props.crm;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-crm-care-create" button_name={translate('general.add')} title={translate('crm.group.add')} />
                <DialogModal
                    modalID="modal-crm-care-create"
                    formID="form-crm-care-create"
                    title={translate('crm.group.add')}
                    func={this.save}
                    size={50}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-crm-care-create">
                        {/* Mã nhóm khách hàng */}
                        <div className={`form-group`}>
                            <label>Nhân viên phụ trách</label>
                            <input type="text" className="form-control" onChange={this.handleChangeGroupCode} />
                            {/* <ErrorLabel content={groupCodeError} /> */}
                        </div>
                        {/* Tên nhóm khách hàng */}
                        <div className={`form-group`}>
                            <label>Tên công việc</label>
                            <input type="text" className="form-control" onChange={this.handleChangeGroupName} />
                            {/* <ErrorLabel content={groupNameError} /> */}
                        </div>
                        {/* Mô tả nhóm khách hàng */}
                        <div className="form-group">
                            <label>Mô tả công việc</label>
                            <textarea type="text" className="form-control" onChange={this.handleChangeGroupDescription} />
                        </div>
                        {/* Ưu đãi kèm theo nhóm khách hàng */}
                        <div className="form-group">
                            <label>Loại hình chăm sóc</label>
                            <SelectBox
                                id={`customer-care`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    [
                                        { value: '', text: 'Chọn' },
                                        { value: 0, text: 'Gọi điện tư vấn' },
                                        { value: 1, text: 'Gửi email' },
                                        { value: 2, text: 'Gặp mặt trực tiếp' },
                                    ]
                                }
                                value={''}
                                onChange={this.handleChangeCustomerGender}
                                multiple={true}
                            />
                        </div>
                        <div className="form-group">
                            <label>Trạng thái</label>
                            <input type="text" className="form-control" onChange={this.handleChangeGroupName} />
                        </div>
                        <div className="form-group">
                            <label>Thời gian thực hiện</label>
                            <DatePicker
                                id="startDate-form-care"
                                value={''}
                                onChange={this.handleChangeCustomerBirth}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>Thời gian kết thúc</label>
                            <DatePicker
                                id="endDate-form-care "
                                value={''}
                                onChange={this.handleChangeCustomerBirth}
                                disabled={false}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateCareForm));