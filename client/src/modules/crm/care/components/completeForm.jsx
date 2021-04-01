import React from 'react';
import PropTypes from 'prop-types';
import { DialogModal, ErrorLabel, QuillEditor, SelectBox } from '../../../../common-components';

CompleteForm.propTypes = {
    
};

function CompleteForm(props) {
    return (
        <React.Fragment>
        <DialogModal
            modalID="modal-crm-care-complete" 
            formID="modal-crm-care-complete"
            title={"Xác nhận hoàn thành hoạt động"}
            size={75}
           /// func={this.save}
           // disableSubmit={!this.isFormValidated()}
        >
            <div className = 'form-group'>
                <div className = 'form-inline'>
                <label style ={{marginRight : '10px'}}>Tên hoạt động:  </label>
                Gọi điện tư vấn sản phẩm mới
                </div>
                <div className = 'form-inline'>
                <label style ={{marginRight : '10px'}}>Tên khách hàng : </label>
                Nguyễn Văn Thái
                </div>
               
            </div>
            {/* Form đánh giá hoạt động*/}
            <form id="modal-crm-care-complete">
                <h4>Đánh giá hoạt động</h4>
                {/* Kết quả hoạt động */}
                <div className="" >
                        <div className="form-group unitSearch">
                            <label>{"Kết quả hoạt động :"}</label>
                            <SelectBox id="SelectUnit"
                                defaultValue={''}
                                items={[{value:'0',text:'Thành công'},{value:'1',text:'Thất bại'},]}
                               // onChange={this.handleSelectOrganizationalUnit}
                                style ={{width : '100%'}}
                            >
                            </SelectBox>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{'Điểm tự đánh giá :'}</label>
                            <input className="form-control" type="text"  name="customerCode"  placeholder={``} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{'Nội dung đánh giá :'}</label>
                            <QuillEditor
                                id={'complete'}
                              //  getTextData={this.handleChangeDescription}
                              // quillValueDefault={quillValueDefault}
                                table={false}
                            />
                        </div>
                    </div>
              
                
            </form>
        </DialogModal>
    </React.Fragment>

    );
}

export default CompleteForm;