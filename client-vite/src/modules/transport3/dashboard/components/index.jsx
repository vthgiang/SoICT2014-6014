import React from "react"

import { GeneralStatistic } from "./generalStatistic";
import { RouteTable } from "./routeTable";

function DashBoardTransportationUnit(props) {

    return (
        <React.Fragment>
            <GeneralStatistic/>
            <RouteTable/>
        </React.Fragment>
    )
}

export default DashBoardTransportationUnit;
