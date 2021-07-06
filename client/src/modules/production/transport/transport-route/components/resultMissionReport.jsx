import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting,  PaginateBar, DialogModal, forceCheckOrVisible, LazyLoadComponent } from "../../../../../common-components";

import { transportPlanActions } from "../../transport-plan/redux/actions"


import { MapContainer } from "../../transportHelper/mapbox/map"

function ResultMissionReport(props) {
    const {routeOrdinal} = props;
    const [nonDirectLocations, setNonDirectLocations] = useState([])
    const [flyToCenter, setFlyToCenter] = useState({});
    useEffect(() => {
        setNonDirectLocations();
        if (routeOrdinal){
            let listLocation = [];
            let element1;
            let element2;
            if (Number(routeOrdinal.type) === 1){
                element1 = {
                    name: "M",
                    color: "blue",
                    location: routeOrdinal.transportRequirement?.geocode?.fromAddress,
                };
                setFlyToCenter({
                    center: routeOrdinal.transportRequirement?.geocode?.fromAddress,
                });
                element2 = {
                    name: "C",
                    color: "red",
                    location: routeOrdinal.transportRequirement?.transportStatus?.fromAddress?.locate,
                };
            }
            if (Number(routeOrdinal.type) === 2){
                element1 = {
                    name: "M",
                    color: "blue",
                    location: routeOrdinal.transportRequirement?.geocode?.toAddress,
                };
                setFlyToCenter({
                    center: routeOrdinal.transportRequirement?.geocode?.toAddress,
                });
                element2 = {
                    name: "C",
                    color: "red",
                    location: routeOrdinal.transportRequirement?.transportStatus?.toAddress?.locate,
                };
            }
            if (element2 && element1){
                listLocation.push(element1, element2);
                setNonDirectLocations(listLocation);
            }
        }
    }, [routeOrdinal])
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-result-misson-map`}
                title={"Vị trí báo cáo"}
                formID={`modal-result-misson-map`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`modal-result-misson-map`}>

                        {/* <MapContainer
                            nonDirectLocations={nonDirectLocations}
                            zoom={11}
                            indexComponent={"result"}
                            flyToCenter={flyToCenter}
                        /> */}
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    return { }
}

const actions = {
}

const connectedResultMissionReport = connect(mapState, actions)(withTranslate(ResultMissionReport));
export { connectedResultMissionReport as ResultMissionReport };