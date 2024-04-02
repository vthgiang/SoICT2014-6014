import React, { useEffect, useState } from 'react';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DialogModal ,SelectBox,QuillEditor} from "../../../../common-components";
import parse from 'html-react-parser';
import { getStorage } from '../../../../config'
import dayjs from 'dayjs'
import {getEmployeeSelectBoxItems} from '../../process-analysis/TaskPertHelper'
import { UserActions } from '../../../super-admin/user/redux/actions';
import {riskResponsePlanRequestActions} from '../redux/actions'
const EditChangeRequest = (props) => {
    const { translate,requestChange,process} = props
    
    const [state, setState] = useState({
        processName: '',
        status: '',
        manager: [],    
        processID: '',
        description: '',
        reson: '',
        startDate: '',
        endDate: '',
        managerSendRequest:requestChange.receiveEmployees.map(em=>em._id)
    })
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

    useEffect(() => {
        if(props.user.usersInUnitsOfCompany&&props.user.usersInUnitsOfCompany.length!=0){
            console.log(process.manager)
            let items = getEmployeeSelectBoxItems(props.user.usersInUnitsOfCompany)
            console.log(items)
            
            let managerItems = items.map(acc => {
                let userInDepartment = acc.value
                for(let user of userInDepartment){
                    if(process.manager.map(u => u._id).includes(user.value))
                    return user
                }
                return null
                
            })
            managerItems= managerItems.filter(acc => acc!=null)
            console.log(managerItems)
            setState({
                ...state,
                manager:managerItems
            })
        }
       console.log(props.user.usersInUnitsOfCompany)
    }, [props.user.usersInUnitsOfCompany])
    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany();
        console.log('processChange')
        if(process!=undefined)
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
    const handleChangeContent = (val) =>{
        setState({
            ...state,
            description:val
        })
    }
    const handleChangeReson = (val) =>{
        setState({
            ...state,
            reson: val
        })
    }
    const handleChangeManager = (val) =>{
        setState({
            ...state,
            managerSendRequest:val
        })
    }
    const isValidatedForm = () => {
        return state.description.length!=0&&state.reson.length!=0&&state.managerSendRequest.length!=0
    }
    const save = () => {
        if(isValidatedForm()){
            let data = {
                status:'wait_for_approve',
                process:process._id,
                sendEmployee:getStorage('userId'),
                receiveEmployees:managerSendRequest,
                content:description,
                reson:reson
            }
            // something for save 
            props.editChangeRequest(requestChange._id,data)
        }
        console.log(state)
    }
    const getDateFormat = (date) => {
        return dayjs(date).format('DD/MM/YYYY')
    }
    return (
        <React.Fragment>
            <DialogModal
                size={75}
                modalID={`modal-edit-change-request`} isLoading={false}
                formID="modal-edit-change-request"
                disableSubmit={!isValidatedForm()}
                title={"Yêu cầu chỉnh sửa quy trình"}
                // hasSaveButton={false}
                // bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
                func={save}
            >
               <div className="box">
                    <div className="box-body">
                        <div className="row">
                            <div style={{ textAlign: 'center' }}>
                                <h2><strong>{processName}</strong></h2>
                                <h4>{'PROCESS ID #' + processID}</h4>
                                <h4>{`${getDateFormat(startDate)} - ${getDateFormat(endDate)}`}</h4>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="box">
                    <div className="box-body">
                        <div className="request-change-content">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="">Nội dung chỉnh sửa<span className="text-red">*</span></label>
                                    <QuillEditor
                                        id="change-process-content"
                                        getTextData={(val) => handleChangeContent(val)}
                                        quillValueDefault={requestChange.content}
                                        embeds={false}
                                        placeholder="Mô tả phương pháp giảm thiểu/xử lý rủi ro"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Lý do chỉnh sửa<span className="text-red">*</span></label>
                                    <QuillEditor
                                        id="request-change-change-reson"
                                        getTextData={(val) => handleChangeReson(val)}
                                        quillValueDefault={requestChange.reson}
                                        embeds={false}
                                        placeholder="Mô tả phương pháp giảm thiểu/xử lý rủi ro"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Người quản lý<span className="text-red">*</span></label>
                                    {manager&&manager.length!=0&&<SelectBox
                                        id={`request-change-select-box`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={manager}
                                        onChange={handleChangeManager}
                                        value={managerSendRequest}
                                        multiple={true}
                                        options={{ placeholder: 'Quản lý quy trình' }}
                                    />}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>

    )
}
const mapState = (state) => {
    const { taskProcess ,user} = state
    return {taskProcess,user}
}
const mapActions = {
    getAllRequest: riskResponsePlanRequestActions.getRiskResponsePlanRequests,
    editChangeRequest: riskResponsePlanRequestActions.editChangeRequest,
    createChangeRequest: riskResponsePlanRequestActions.createRiskResponsePlanRequest,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}

const connectedEditChangeRequest = React.memo(connect(mapState, mapActions)(withTranslate(EditChangeRequest)));
export { connectedEditChangeRequest as EditChangeRequest }