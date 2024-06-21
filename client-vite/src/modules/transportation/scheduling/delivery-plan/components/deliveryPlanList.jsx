import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../production/common-production/request-management/redux/actions';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
// import { DataTableSetting, DatePicker, PaginateBar, SelectBox, TreeSelect } from "../../../../../common-components";
// import { JourneyActions } from '../../tracking-route/redux/actions'

function DeliveryPlanList(props) {

    const [state, setState] = useState({
    });

    useEffect(() => {
        // Code to handle modal visibility when `showModal` prop changes
        if (props.showModal) {
            // Code to show modal
        }
    }, [props.showModal]);

    // Function to handle modal visibility
    const handleShowModal = () => {
        props.setShowModal(true); // Call setShowModal function passed from parent component
    }

    const { translate, bigModal } = props;

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-transportation-request"
                title= "Kế hoạch giao hàng dự kiến"
                size={bigModal ? 75 : 50}
                maxWidth={900}
                handleShowModal
            >
                <table className="table table-hover table-striped table-bordered" style={{ marginTop: '10px' }}>
                    <thead>
                        <tr>
                            {/* <th>{translate('manage_transportation.journey_list.journey_code')}</th> */}
                            {/* <th>{translate('manage_transportation.journey_list.shippers_for_journey')}</th> */}
                            {/* <th>{translate('manage_transportation.journey_list.total_cost')}</th> */}
                            {/* <th>{translate('manage_transportation.journey_list.revenue')}</th> */}
                            {/* <th>{translate('manage_transportation.journey_list.total_distance')}</th> */}
                            {/* <th>{translate('manage_transportation.journey_list.estimated_delivery_date')}</th> */}
                            {/* <th>{translate('manage_transportation.journey_list.status')}</th> */}
                            {/* <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_transportation.journey_list.journey_code'),
                                        translate('manage_transportation.journey_list.shippers_for_journey'),
                                        translate('manage_transportation.journey_list.total_cost'),
                                        translate('manage_transportation.journey_list.revenue'),
                                        // translate('manage_transportation.journey_list.total_distance'),
                                        translate('manage_transportation.journey_list.estimated_delivery_date'),
                                        translate('manage_transportation.journey_list.status'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th> */}
                            <th>Mã lộ trình</th>
                            <th>Tổng chi phí (VNĐ)</th>
                            <th>Lợi nhuận (VNĐ)</th>
                            <th>Thời gian đi trung bình</th>
                            <th>Số xe sử dụng</th>
                            <th>Số lượng tài xế</th>
                            <th>Tỷ lệ lấp đầy trung bình</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr >
                            <td>PLAN_01</td>
                            <td>3500000</td>
                            {/* <td>{journey.data.totalDistance}</td> */}
                            <td>700000</td>
                            <td>97.5 (phút/xe)</td>
                            <td>2 xe</td>
                            <td>2 người</td>
                            <td>22.82%</td>
                            {/* <td>
                                Chưa giao
                            </td> */}
                            <td style={{ textAlign: "center" }}>
                                <a className="text-blue"><i className="material-icons">visibility</i></a>
                                <a className="text-green"><i className="material-icons">check_circle</i></a>
                            </td>
                            {/* <td style={{ textAlign: "center" }}>
                                        <a className="text-green" title={translate('asset.general_information.view')} onClick={() => handleDetailJourney(journey)}><i className="material-icons">visibility</i></a>
                                        {journey.status == 1 &&
                                            <a className="text-red" title={translate('asset.general_information.delete')} onClick={() => handleDeleteJourney(journey._id)}><i className="material-icons">delete</i></a>
                                        }
                                    </td> */}
                        </tr>
                        <tr >
                            <td>PLAN_02</td>
                            <td>3500000</td>
                            {/* <td>{journey.data.totalDistance}</td> */}
                            <td>700000</td>
                            <td>87.3 (phút/xe)</td>
                            <td>2 xe</td>
                            <td>2 người</td>
                            <td>22.82%</td>
                            {/* <td>
                                        Chưa giao
                                    </td> */}
                            <td style={{ textAlign: "center" }}>
                                <a className="text-blue"><i className="material-icons">visibility</i></a>
                                <a className="text-green"><i className="material-icons">check_circle</i></a>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </DialogModal>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => {
};

export default connect(mapStateToProps)(withTranslate(DeliveryPlanList));