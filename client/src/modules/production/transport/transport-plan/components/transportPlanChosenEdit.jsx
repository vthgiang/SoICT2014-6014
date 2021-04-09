import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { formatDate } from "../../../../../helpers/formatDate"
import { DialogModal, ErrorLabel } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { transportRequirementsActions } from "../../transport-requirements/redux/actions";
import { transportPlanActions } from "../redux/actions"
import {SimpleMap} from './map/map'
import { MapContainer } from './map/maphook'

function TransportPlanChosenEdit(props) {
    let {allTransportPlans, currentRequirement, currentTransportPlan} = props;
    const [currentTransportPlanId, setCurrentTransportPlanId] = useState("");

    const handleSelectPlan = async(id) => {
        // if (currentRequirement.transportPlan && String(currentRequirement.transportPlan) === id){
        //     return;
        // }
        // else{            
        //     if (currentRequirement.transportPlan){
        //         // props.getDetailTransportPlan
        //     }
            props.editTransportRequirement(currentRequirement._id, { transportPlan: id});
        //     props.getDetailTransportPlan(id);   // Thêm yêu cầu vc vào plan mới
        //     setCurrentTransportPlanId(id);  // ..................................
        // }
    }

    /**
     * khi user chọn thêm yêu cầu vận chuyển vào 1 kế hoạch và lấy được dữ liệu kế hoạch chọn
     * thêm yêu cầu vào trường transportRequirements của transportPlan
     */
    // useEffect(() => {
    //     if (currentTransportPlan && currentTransportPlan._id === currentTransportPlanId) {
    //         const requirementsList = currentTransportPlan.transportRequirements;
    //         let check;
    //         /**
    //          * Kiểm tra plan này đã có requirement chưa
    //          */
    //         if (requirementsList && requirementsList.length !==0){
    //             check = requirementsList.filter(r => String(r.transportRequirement) === String(currentRequirement._id));
    //         }
    //         if (check && check.length !==0){
                
    //         }
    //         else{
    //             requirementsList.push({transportRequirement: currentRequirement._id});
    //             props.editTransportPlan(currentTransportPlan._id, {transportRequirements: requirementsList});
    //         }            
    //     }
    // }, [currentTransportPlan])


    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-example-hooks`} isLoading={false}
                formID={`form-edit-example-hooks`}
                title={'manage_example.edit_title'}
                // disableSubmit={!isFormValidated}
                // func={save}
                size={50}
                maxWidth={500}
            >
                <table id={"123"} className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                                    <th>{"Điểm nhận hàng"}</th>
                                    <th>{"Điểm giao hàng"}</th>
                                </tr>
                            </thead>
                            <tbody>                                
                                {
                                    currentRequirement && 
                                    <tr key={1}>
                                        <td>{"Giao hàng"}</td>
                                        <td>{currentRequirement.fromAddress}</td>
                                        <td>{currentRequirement.toAddress}</td>                                        
                                    </tr>
                                }
                    </tbody>
                        </table>

                <form id={`form-edit-example-hooks`}>
                <table id={"6666"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Mã kế hoạch"}</th>
                            <th>{"Thời gian bắt đầu"}</th>
                            <th>{"Thời gian kết thúc"}</th>
                            <th>{"Hành động"}</th>
                        </tr>
                    </thead>
                    <tbody>                                
                    {
                        (allTransportPlans && allTransportPlans.length !==0) &&
                        allTransportPlans.map((item, index) => (
                                item && 
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.code}</td>
                                    <td>{formatDate(item.startTime)}</td>
                                    <td>{formatDate(item.endTime)}</td>
                                    <td>
                                        <a className="text-green"
                                            onClick={() => handleSelectPlan(item._id)}
                                            ><i className="material-icons">add_comment</i></a>
                                    </td>
                                </tr>
                            )
                        )
                    }
                    </tbody>
                </table>
                </form>
            
            
                {/* <iframe
                    width="600"
                    height="450"
                    style="border:0"
                    loading="lazy"
                    allowfullscreen
                    src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyCkVQAqCoJU79mTctNsNmQLy9ME7qiTlfs&q=Space+Needle,Seattle+WA"}>
                </iframe> */}

                {/* <iframe src={"https://www.google.com/maps/embed/v1/place?key=AIzaSyCkVQAqCoJU79mTctNsNmQLy9ME7qiTlfs&q=tan+lap,Dan+phuong,Hanoi,vietnam&q=hoai+duc,hanoi,vietnam"} 
                width="600" 
                height="450" 
                frameborder="0" 
                style={{border:0}} 
                allowfullscreen="" 
                aria-hidden="false" 
                tabindex="0"></iframe>   
                <SimpleMap/> */}

                <MapContainer/>


            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    console.log(state);
    const { currentTransportPlan } = state.transportPlan;
    return { currentTransportPlan }
}

const actions = {
    editTransportRequirement: transportRequirementsActions.editTransportRequirement,
    getDetailTransportPlan: transportPlanActions.getDetailTransportPlan,
    editTransportPlan: transportPlanActions.editTransportPlan,
}

const connectedTransportPlanChosenEdit = connect(mapState, actions)(withTranslate(TransportPlanChosenEdit));
export { connectedTransportPlanChosenEdit as TransportPlanChosenEdit };