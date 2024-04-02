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
const DetailRequestChange = (props) => {
    const { translate, requestChange, process } = props
    useEffect(() => {
        console.log('detail', requestChange)
    }, [])
    const [state, setState] = useState({
        processName: '',
        status: '',
        sender: requestChange.sendEmployee,
        manager: requestChange.receiveEmployees,
        processID: '',
        description: '',
        reson: '',
        startDate: '',
        endDate: '',
        managerSendRequest: requestChange.receiveEmployees.map(em => em._id)
    })
    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany();
        console.log('processChange')
        if (process != undefined)
            setState({
                ...state,
                processID: process._id.toString().toUpperCase(),
                processName: process.processName,
                manager: process.manager,
                status: process.status,
                startDate: process.startDate,
                endDate: process.endDate
            })
    }, [process])
    const {

        processName,
        processID,
        manager,
        reson,
        description,
        startDate,
        endDate,
        managerSendRequest
    } = state
    const getDateFormat = (date) => {
        return dayjs(date).format('DD/MM/YYYY')
    }
    return (
        <React.Fragment>
            <DialogModal
                size={75}
                modalID={`modal-detail-change-request`} isLoading={false}
                formID="modal-detail-change-request"
                // disableSubmit={!isValidatedForm()}
                title={translate('manage_change_process.title')}
                hasSaveButton={false}
            // bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            // func={save}
            >
                <div className="row process-info">
                    <div style={{ textAlign: 'center' }}>
                        <h2><strong>{processName}</strong></h2>
                        <h4>{'PROCESS ID #' + processID}</h4>
                        <h4>{`${getDateFormat(startDate)} - ${getDateFormat(endDate)}`}</h4>
                    </div>
                </div>
                <div className="row detail-request-change">
                    <div className="row">
                        <div className="form-group" style={{textAlign:'center'}}>
                            <label htmlFor=""></label>
                            <h4><strong>{getStatusStr(translate,requestChange.status,true)}</strong></h4>
                        </div>
                    </div>
                    <div className="row approve-infor">
                        <div className=" basic">

                            <div className="form-group">
                                <label htmlFor="">{translate('manage_change_process.detail.approver')}:</label>
                                <span>
                                    {requestChange.receiveEmployees.map(u => u.name).join(',')}
                                </span>

                            </div>
                            <div className="form-group">
                                <label htmlFor="">{translate('manage_change_process.detail.send_request')}:</label>
                                <span>
                                    {requestChange.sendEmployee.name}
                                </span>

                            </div>
                        </div>

                        <div className="user">


                            <div className="form-group">
                                <label htmlFor="">{translate('manage_change_process.detail.create_date')}:</label>
                                <span><i class="fa fa-clock-o" />
                                    {
                                        dayjs(requestChange.createdAt).format('DD/MM/YYYY HH:mm:ss')
                                    }
                                </span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="">{translate('manage_change_process.detail.last_updated')}:</label>

                                <span><i class="fa fa-clock-o" /> {dayjs(requestChange.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group border-div">
                            {requestChange.approveData && <div className="form-group">
                                <label htmlFor="">{translate('manage_change_process.detail.content')}:</label>
                                <div>
                                    {parse(requestChange.approveData.comment)}
                                </div>

                            </div>}
                        </div>
                        <div className="form-group border-div ">
                            <label htmlFor="">{translate('manage_change_process.detail.reson')}:</label>
                            <div>
                                {parse(requestChange.reson)}
                            </div>
                        </div>
                        <div className="form-group border-div">
                            <label htmlFor="">{translate('manage_change_process.detail.request_content')}:</label>
                            <div>
                                {parse(requestChange.content)}
                            </div>
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

const connectedDetailRequestChange = React.memo(connect(mapState, mapActions)(withTranslate(DetailRequestChange)));
export { connectedDetailRequestChange as DetailRequestChange }