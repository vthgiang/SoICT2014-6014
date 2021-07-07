import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting,  PaginateBar, DialogModal, SelectBox } from "../../../../../common-components";

import { NewOne } from '../detail-component/newOne'
import { TransportDetailGoods } from "../../transport-requirements/components/detail-transport-requirement/transportDetailGoods"

import { MapContainer } from "../../transportHelper/mapbox/map"

function DetailMission(props) {
    let {currentMission, currentPositionCarrierShow, stt, allMissions, handleShowMissionDetailClearInterval} = props
    const [mission, setMission] = useState();

    const [nonDirectLocations, setNonDirectLocations] = useState();
    const [locations, setLocations] = useState();
    const [driverLocation, setDriverLocation] = useState();
    const [flyToCenter, setFlyToCenter] = useState();

    const getGeocodeRequirement = (requirement, actionType) => {
        if (Number(actionType) === 1) {
            return requirement?.geocode?.fromAddress;
        }
        return requirement?.geocode?.toAddress;
    }
    useEffect(() => {
        setMission(currentMission);
    }, [currentMission])

    useEffect(() => {
        console.log(currentPositionCarrierShow);
    }, [currentPositionCarrierShow])

    useEffect(() => {
        let nonLoc = [];
        let loc = [];
        if (allMissions && allMissions.length!==0){
            allMissions.map((item, index) => {
                if(index < stt-1) {
                    nonLoc.push({
                        location: getGeocodeRequirement(item.transportRequirement, item.type),
                        name: String(index+1),
                    })
                }
                if (index === stt-1) {
                    loc.push({
                        location: getGeocodeRequirement(item.transportRequirement, item.type),
                        name: String(index+1),
                        color: "blue",
                    })
                }
                if (index === stt){
                    loc.unshift({
                        location: getGeocodeRequirement(item.transportRequirement, item.type),
                        name: String(index+1),
                        color: "yellow",
                    })
                }
                if (index > stt) {
                    nonLoc.push({
                        location: getGeocodeRequirement(item.transportRequirement, item.type),
                        name: String(index+1),
                        color: "green",
                    })
                }
            })
        }
        if (loc.length>1){
            setFlyToCenter({
                center: loc[1].location,
            })
        }
        else {            
            if (nonLoc.length!==0){
                setFlyToCenter({
                    center: nonLoc[0].location
                })
            }
        }
        setNonDirectLocations(nonLoc);
        setLocations(loc);
        setDriverLocation([{
            name: "C",
            location: currentPositionCarrierShow?.location
        }])
    }, [currentMission, allMissions, stt, currentPositionCarrierShow])

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-mission`}
                title={"Chi tiết nhiệm vụ"}
                formID={`modal-detail-mission`}
                size={50}
                maxWidth={500}                
                hasSaveButton={false}
                hasNote={false}
                afterClose={handleShowMissionDetailClearInterval}
            >
                {
                    mission && 
                    (mission.transportRequirement?.type === 5 && <NewOne mission={mission}/>)
                }    

                <TransportDetailGoods 
                    listGoodsChosen = {mission?.transportRequirement?.goods}
                />
                
                <MapContainer 
                    nonDirectLocations={nonDirectLocations}
                    locations={locations}
                    driverLocation={driverLocation}
                    flyToCenter={flyToCenter}
                />
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
}

const actions = {   
}

const connectedDetailMission = connect(mapState, actions)(withTranslate(DetailMission));
export { connectedDetailMission as DetailMission };