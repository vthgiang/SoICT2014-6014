import React, { useEffect, useState } from 'react';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DialogModal, SelectBox, QuillEditor } from "../../../../common-components";
import parse from 'html-react-parser';
import { getStorage } from '../../../../config'
import dayjs from 'dayjs'
import { getEmployeeSelectBoxItems } from '../../process-analysis/TaskPertHelper'
import { UserActions } from '../../../super-admin/user/redux/actions';
import { riskResponsePlanRequestActions } from '../redux/actions'
import { getStatusStr } from './helper'
import './style.css'
const AprroveChangeRequest = (props) => {
    const { translate, requestChange, } = props

    const [state, setState] = useState({
        comment: '',
        status: 'wait_for_approve'
    })

    const {
        comment,
        status
    } = state
    const getDateFormat = (date) => {
        return dayjs(date).format('DD/MM/YYYY')
    }
    const save = () => {
        if(isValidatedForm()){
            let id = requestChange._id
            let data={
                action:'approve',
                status:status,
                approveData:{
                    comment:comment,
                    approveEmployee:getStorage('userId')
                }
            }
            props.editChangeRequest(id,data)
            console.log(data)
            
        }
    }
    const isValidatedForm = () => {
        return true
    }
    const handleChangeComment = (val)=>{
        setState({
            ...state,
            comment:val
        })
    }
    const handleChangeStatus = (event) =>{
        let val = event.target.value
        console.log(val)
        setState({
            ...state,
            status:val
        })
    }
    return (
        <React.Fragment>
            <DialogModal
                size={75}
                modalID={`modal-approve-change-request`} isLoading={false}
                formID="modal-apprve-change-request"
                disableSubmit={!isValidatedForm()}
                title={translate('manage_change_process.title')}
                func={save}
            >
                <div className="box">
                    <div className="box-body">
                        <div className="form-group">
                            <label htmlFor="">{translate('manage_change_process.status')}<span className="text-red">*</span></label>
                            <div>
                                <select className={`form-control`} onChange={handleChangeStatus}>
                                    {['wait_for_approve', 'canceled', 'finished'].map(item => (
                                        <option value={item}>{getStatusStr(translate,item,false)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="">{translate('manage_change_process.detail.content')}<span className="text-red">*</span></label>
                            <QuillEditor
                                id="comment-process-content"
                                getTextData={(val) => handleChangeComment(val)}
                                quillValueDefault={''}
                                embeds={false}
                                placeholder="Mô tả phương pháp giảm thiểu/xử lý rủi ro"
                            />
                        </div>


                    </div>
                </div>
            </DialogModal>

        </React.Fragment>
    )
}
const mapState = (state) => {
    const { taskProcess, user } = state
    return { taskProcess, user }
}
const mapActions = {
    getAllRequest: riskResponsePlanRequestActions.getRiskResponsePlanRequests,
    editChangeRequest: riskResponsePlanRequestActions.editChangeRequest,
    createChangeRequest: riskResponsePlanRequestActions.createRiskResponsePlanRequest,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}

const connectedAprroveChangeRequest = React.memo(connect(mapState, mapActions)(withTranslate(AprroveChangeRequest)));
export { connectedAprroveChangeRequest as AprroveChangeRequest }