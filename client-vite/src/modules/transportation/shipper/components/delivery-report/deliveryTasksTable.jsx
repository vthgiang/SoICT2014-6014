import React, { useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { ShipperActions } from '../../redux/actions'
import { useEffect } from "react";
import { LazyLoadComponent } from "../../../../../common-components";
import ShipperTaskList from './shipperTaskList';
import ShipperReportHistory from "./shipperReportHistory";

function DeliveryTasksTable(props) {
    const {translate, getTasksForShipper, shipper } = props;

    // Khởi tạo state
    const [state, setState] = useState({
        page: 1,
        limit: 10,
        type: 1,
    })

    const { page, limit, type } = state;

    useEffect(() => {
    }, []);


    const handleShipperTaskList =  async () => {
        const requestType = 4, status = 1;
        await setState({
            ...state,
            type: 1,
        })
    };


    const handleReportHistory =  async () => {
        const requestType = 4, status = 2;
        await setState({
            ...state,
            type: 2,
        })
    };

    return (
        <React.Fragment>
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body">
                    <div className="nav-tabs-custom">
                        <ul className="nav nav-tabs">
                            <li className="active"><a href="#list-shipper-task-tab" data-toggle="tab" onClick={() => handleShipperTaskList()}><i className="fa fa-tasks" aria-hidden="true"></i> {translate('manage_transportation.shipper.shipper_task_list_title')}</a></li>
                            <li><a href="#shipper-report-history" data-toggle="tab" onClick={() => handleReportHistory()}><i className="fa fa-history text-yellow" aria-hidden="true"></i> {translate('manage_transportation.shipper.shipper_report_history_title')}</a></li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane active" id="list-shipper-task-tab">
                                {type === 1 &&
                                    <LazyLoadComponent>
                                        <ShipperTaskList/>
                                    </LazyLoadComponent>
                                }
                            </div>
                            <div className="tab-pane" id="shipper-report-history">
                                {type === 2 &&
                                    <LazyLoadComponent>
                                        <ShipperReportHistory/>
                                    </LazyLoadComponent>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const shipper = state.shipper;
    return { shipper }
}

const mapActions = {
    getTasksForShipper: ShipperActions.getTasksForShipper
}
export default connect(mapState, mapActions)(withTranslate(DeliveryTasksTable));