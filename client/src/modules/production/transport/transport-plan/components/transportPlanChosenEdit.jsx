// ko dung
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
    let {allTransportPlans, 
        currentRequirementId, 
        currentTransportPlan, 
        currentTransportRequirement,
        } = props;
    

    /**
     * State lưu transportPlan id của currentRequirementId
     * Khi chọn plan mới, state cập nhật
     * Khi state thay đổi, query lại dữ liệu của currentRequirementId
     */    
    const [currentTransportRequirementPlanId, setCurrentTransportRequirementPlanId] = useState()

    /**
     * Load lại info currentRequirement
     */
    useEffect(() => {
        if (currentRequirementId){
            props.getDetailTransportRequirement(currentRequirementId);
        }
    }, [currentRequirementId]);

    useEffect(()=>{
        setCurrentTransportRequirementPlanId(currentTransportRequirement?.transportPlan?._id)
    }, [currentTransportRequirement])

    useEffect(() =>{
        if (currentRequirementId){
            props.getDetailTransportRequirement(currentRequirementId);
        }
    }, [currentTransportRequirementPlanId])

    const [placeGeocode, setPlaceGeoCode] = useState([
        {
            name: "current",
            lat: currentTransportRequirement?.geocode?.fromAddress.lat,
            lng: currentTransportRequirement?.geocode?.fromAddress.lng,
        },
        {
            name: "current",
            lat: currentTransportRequirement?.geocode?.toAddress.lat,
            lng: currentTransportRequirement?.geocode?.toAddress.lng,
        },
    ]);

    /**
     * @param {*} item - kế hoạch user chọn 
     * @returns 
     */
    const handleSelectPlan = (id) => {
        console.log(currentTransportRequirement);
            props.addTransportRequirementToPlan(id, {requirement:currentTransportRequirement._id});
            setCurrentTransportRequirementPlanId(id);
    }

    const handleShowDetailInfo = (transportPlan) => {
        props.getDetailTransportPlan(transportPlan._id);
    }

    useEffect(() => {
        props.getAllTransportPlans({page:1, limit: 100});
    }, []);

    useEffect(() => {
        console.log(currentTransportPlan , " cureen");
        let newPlaceGeocode = [];
        newPlaceGeocode.push({
            name: "current1",
            location: {
                lat: currentTransportRequirement?.geocode?.fromAddress.lat,
                lng: currentTransportRequirement?.geocode?.fromAddress.lng,
            },
            icon : {
                url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png", // url
            }
        });
        newPlaceGeocode.push({
            name: "current2",
            location: {
                lat: currentTransportRequirement?.geocode?.toAddress.lat,
                lng: currentTransportRequirement?.geocode?.toAddress.lng,
            },
            icon : {
                url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png", // url
            }
        });
        if (currentTransportPlan){
            if (currentTransportPlan.transportRequirements && currentTransportPlan.transportRequirements.length !==0){
                currentTransportPlan.transportRequirements.map((item, index) => {
                    newPlaceGeocode.push({
                        name: "plan " +index,
                        location: {
                            lat: item.geocode?.fromAddress?.lat,
                            lng: item.geocode?.fromAddress?.lng,
                        }
                    });
                    newPlaceGeocode.push({
                        name: "plan " +index,
                        location: {
                            lat: item.geocode?.toAddress?.lat,
                            lng: item.geocode?.toAddress?.lng,
                        }
                    })
                })
            }
        }
        setPlaceGeoCode(newPlaceGeocode);
    }, [currentTransportPlan])

    useEffect(() => {
        console.log(placeGeocode, " okmen");
    }, [placeGeocode])
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-example-hooks`} isLoading={false}
                formID={`form-edit-example-hooks`}
                title={'Lựa chọn kế hoạch vận chuyển'}
                // disableSubmit={!isFormValidated}
                // func={save}
                size={100}
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
                            currentTransportRequirement && 
                            <tr key={1}>
                                <td>{"Giao hàng"}</td>
                                <td>{currentTransportRequirement.fromAddress}</td>
                                <td>{currentTransportRequirement.toAddress}</td>                                        
                            </tr>
                        }
                    </tbody>
                </table>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border" style={{ height: "100%" }}>
                                <legend className="scheduler-border">Chọn kế hoạch vận chuyển</legend>
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
                                                            <td style={{ textAlign: "center" }}>
                                                                <a className="edit text-green" style={{ width: '5px' }} title={'manage_example.detail_info_example'} 
                                                                        onClick={() => handleShowDetailInfo(item)}
                                                                        >
                                                                            <i className="material-icons">visibility</i></a>
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
                            </fieldset>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border" style={{ height: "100%" }}>
                                <legend className="scheduler-border">Phương tiện vận chuyển có thể sử dụng</legend>
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
                                                                    onClick={() => handleSelectPlan(item)}
                                                                    ><i className="material-icons">add_comment</i></a>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                            </tbody>
                                        </table>
                                    </form>
                            </fieldset>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                        <fieldset className="scheduler-border" style={{ height: "100%" }}>
                        <legend className="scheduler-border">Các địa điểm trong kế hoạch</legend>
                            <MapContainer 
                                locations = {placeGeocode}
                            />
                        </fieldset>
                    </div>
                </div>

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
                                    <td style={{ textAlign: "center" }}>
                                    <a className="edit text-green" style={{ width: '5px' }} title={'manage_example.detail_info_example'} 
                                            // onClick={() => handleShowDetailInfo(example)}
                                            >
                                                <i className="material-icons">visibility</i></a>
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

                {/* <MapContainer/> */}


            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    console.log(state, " change");
    const { currentTransportPlan} = state.transportPlan;
    let allTransportPlans = [];
    allTransportPlans = state.transportPlan.lists;
    const { currentTransportRequirement } = state.transportRequirements;
    return { currentTransportPlan, currentTransportRequirement, allTransportPlans }
}

const actions = {
    editTransportRequirement: transportRequirementsActions.editTransportRequirement,
    getDetailTransportRequirement: transportRequirementsActions.getDetailTransportRequirement,
    getDetailTransportPlan: transportPlanActions.getDetailTransportPlan,
    editTransportPlan: transportPlanActions.editTransportPlan,
    addTransportRequirementToPlan: transportPlanActions.addTransportRequirementToPlan,
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
}

const connectedTransportPlanChosenEdit = connect(mapState, actions)(withTranslate(TransportPlanChosenEdit));
export { connectedTransportPlanChosenEdit as TransportPlanChosenEdit };