import React from 'react';
import PropTypes from 'prop-types';
import { ButtonModal, DatePicker, DialogModal, QuillEditor, SelectBox } from '../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

CreateCareCommonForm.propTypes = {
    
};

function CreateCareCommonForm(props) {
    const{translate,type} = props
    return (
        <React.Fragment>
          
            <DialogModal
                modalID="modal-crm-care-common-create"
                formID="form-crm-care-common-create"
                title={translate('crm.care.add')}
               // func={this.save}
                size={75}
            // disableSubmit={!this.isFormValidated()}
            >
                <form id="form-crm-care-create">
                    {/* Nhân viên phụ trách */}
                    <div className={`form-group`}>
                        <label>{translate('crm.care.caregiver')}</label>
                        {
                          
                            <SelectBox
                                id={`caregiver-care`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    [
                                        {value:1,text :'Nguyễn Văn Thái'},
                                        {value:2,text :'Nguyễn Văn Ann'}
                                    ]
                                }
                               // value={newCare.caregiver ? newCare.caregiver : []}
                              //  onChange={this.handleChangeCaregiver}
                                multiple={true}
                                options={{ placeholder: translate('crm.care.caregiver') }}
                            />
                        }
                        {/* <ErrorLabel content={groupCodeError} /> */}
                    </div>

                    {/* Khách hàng được chăm sóc */}
                    {type ==1? (
                    <div className={`form-group`}>
                        <label style ={{marginRight : '10px'}}>{translate('crm.care.customer')}:</label>
                        {
                           
                           <span>Nguyễn Văn Thái </span>
                        }
                        {/* <ErrorLabel content={groupCodeError} /> */}
                    </div>):
                    (
                        <div className={`form-group`}>
                        <label style ={{marginRight : '10px'}}>{"Nhóm khách hàng"}:</label>
                        {
                           
                           <span>Nhóm khách hàng bán buôn</span>
                        }
                        {/* <ErrorLabel content={groupCodeError} /> */}
                    </div>
                    )
                    
                    }
                    {/* Tên công việc */}
                    <div className={`form-group`}>
                        <label>{translate('crm.care.name')}</label>
                        <input type="text" className="form-control" 
                     //   onChange={this.handleChangeName} 
                        />
                        {/* <ErrorLabel content={groupNameError} /> */}
                    </div>

                    {/* Mô tả công việc chăm sóc */}
                    <div className="form-group">
                        <label>{translate('crm.care.description')}</label>
                        <QuillEditor
                            id={'createCommonCare'}
                           // getTextData={this.handleChangeDescription}
                            table={false}
                        />
                    </div>

                    {/* Loại hình chăm sóc khách hàng */}
                    <div className="form-group">
                        <label>{translate('crm.care.careType')}</label>
                        {
                            
                            <SelectBox
                                id={`customer-careType`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    [
                                        {value:1,text :'gọi điện'},
                                        {value:2,text :'nhắn tin'}
                                    ]
                                }
                               // value={newCare.careType ? newCare.careType : []}
                                //onChange={this.handleChangeCareType}
                                multiple={false}
                                options={{ placeholder: translate('crm.care.careType') }}
                            />
                        }
                    </div>
                    {/* Độ ưu tiên */}
                    <div className="form-group">
                        <label>{'Độ ưu tiên: '}</label>
                        <SelectBox
                            id={`status-care`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={
                                [
                                    { value: '', text: '---Chọn---' },
                                    { value: 1, text: 'Ưu tiên thấp' },
                                    { value: 2, text: 'Ưu tiên tiêu chuẩn' },
                                    { value: 3, text: 'Ưu tiên cao' },
                                ]
                            }
                        //    value={newCare.status ? newCare.status : ''}
                        //    onChange={this.handleChangeStatus}
                            multiple={false}
                        />
                    </div>

                    {/* Thời gian thực hiện */}
                    <div className="form-group">
                        <label>{translate('crm.care.startDate')}</label>
                        <DatePicker
                            id="startDate-form-care"
                         //   value={newCare.startDate ? newCare.startDate : ''}
                         //   onChange={this.handleChangeStartDate}
                            disabled={false}
                        />
                    </div>

                    {/* Thời gian kết thúc */}
                    <div className="form-group">
                        <label>{translate('crm.care.endDate')}</label>
                        <DatePicker
                            id="endDate-form-care"
                           // value={newCare.endDate ? newCare.endDate : ''}
                          //  onChange={this.handleChangeEndDate}
                            disabled={false}
                        />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

export default (withTranslate( CreateCareCommonForm));