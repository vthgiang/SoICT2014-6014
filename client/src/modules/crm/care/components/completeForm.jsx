import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DialogModal, ErrorLabel, QuillEditor, SelectBox } from '../../../../common-components';
import { CrmCareActions } from '../redux/action';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { formatFunction } from '../../common';

function CompleteForm(props) {

    const { crm, user, careCompleteId, translate } = props
    const [careCompleteState, setCareCompleteState] = useState({ id: undefined });
    useEffect(() => {
        props.getCare(careCompleteId);
        setCareCompleteState({ id: undefined });
    }, [careCompleteId])

   
    if (!crm.cares.isLoading && crm.cares.careById && (careCompleteState.id !== crm.cares.careById._id)) {
        const care = crm.cares.careById;
        const newCare = {
            id: care._id,
            customerCareStaffs: care.customerCareStaffs ? care.customerCareStaffs.map(o => o._id) : [],
            customer: care.customer ? care.customer : '',
            name: care.name ? care.name : '',
            description: care.description ? care.description : '',
            customerCareTypes: care.customerCareTypes ? care.customerCareTypes.map(o => o._id) : [],
            status: care.status ? care.status : '',
            startDate: care.startDate ? formatFunction.formatDate(care.startDate) : '',
            endDate: care.endDate ? formatFunction.formatDate(care.endDate) : '',
            quillValueDefault: care.description ? care.description : '',
        }
        setCareCompleteState(newCare);
    }
    /**ham xu ly khi ket qua thay doi  */
    const handleChangeResult = async (value) => {
        const newState = { ...careCompleteState, evaluation: { ...careCompleteState.evaluation, result: value[0] } };
        await setCareCompleteState(newState);
    }

    const handleChangePoint = async (e) => {
        const value = e.target.value
        const newState = { ...careCompleteState, evaluation: { ...careCompleteState.evaluation, point: parseFloat(value) } };
        await setCareCompleteState(newState);
    }

    const handleChangeComment = async (value, imgs) => {
        const newState = { ...careCompleteState, evaluation: { ...careCompleteState.evaluation, comment: value } };
        await setCareCompleteState(newState);
    }
    const save = () => {

        let newState = { ...careCompleteState, completeDate: new Date(), status: careCompleteState.status==4?5:3 };
        if (newState.evaluation && !newState.evaluation.result) newState = { ...newState, evaluation: { ...careCompleteState.evaluation, result: 1 } }
        props.editCare(careCompleteId, newState)
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-crm-care-complete${careCompleteId}`}
                formID={`form-crm-care-complete${careCompleteId}`}
                title={"Xác nhận hoàn thành hoạt động"}
                size={75}
                func={save}
            // disableSubmit={!this.isFormValidated()}
            >
                <div className='form-group'>
                    <div className='form-inline'>
                        <label style={{ marginRight: '10px' }}>Tên hoạt động:  </label>
                        <strong>   {careCompleteState.name ? careCompleteState.name : ''}</strong>
                    </div>
                    <div className='form-inline'>
                        <label style={{ marginRight: '10px' }}>Tên khách hàng : </label>
                        <strong> {careCompleteState.customer ? careCompleteState.customer.name : ''}</strong>
                    </div>

                </div>
                {/* Form đánh giá hoạt động*/}
                <form id={`modal-crm-care-complete${careCompleteId}`}>
                    <h4>Đánh giá hoạt động</h4>
                    {/* Kết quả hoạt động */}
                    <div className="" >
                        <div className="form-group unitSearch">
                            <label>{"Kết quả hoạt động :"}</label>
                            <SelectBox id={`SelectUnit-result-${careCompleteId}`}
                                defaultValue={''}
                                items={[{ value: '1', text: 'Thành công' }, { value: '2', text: 'Thất bại' },]}
                                onChange={handleChangeResult}
                                style={{ width: '100%' }}
                            >
                            </SelectBox>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{'Điểm tự đánh giá :'}</label>
                            <input className="form-control" type="text" name="point" placeholder={``} onChange={handleChangePoint} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{'Nội dung đánh giá :'}</label>
                            <QuillEditor
                                id={`complete-comment-${careCompleteId}`}
                                getTextData={handleChangeComment}
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

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getCare: CrmCareActions.getCare,
    editCare: CrmCareActions.editCare,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CompleteForm));