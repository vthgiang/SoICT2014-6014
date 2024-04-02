import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { getIconURL } from '../../utilities';
import { Marker, InfoWindow } from '@react-google-maps/api';

function CustomerMarker (props) {
    const [state, setState] = useState({
        id: props.marker.id,
        code: props.marker.code,
        lat: props.marker.lat,
        lng: props.marker.lng,
        infoWindow: props.marker.infoWindow,
        color: props.marker.color,
        icon: getIconURL("CUSTOMER"),
    });

    const hideMarkerInfo = () => {
        let marker = props.marker;
        marker.isShowInfo = false;
        props.setShow(marker);
    }

    return (
        <>
           <Marker
                key={state.id}
                icon={state.icon}
                label={{
                    color: state.color,
                    text: state.code,
                }}
                position={{
                    lat: parseFloat(state.lat),
                    lng: parseFloat(state.lng),
                }}
            >
                {props.marker.isShowInfo === true && props.marker.infoWindow &&
                    <InfoWindow onCloseClick={() => hideMarkerInfo()}>
                        {props.marker.infoWindow &&
                            <div>
                                <div>
                                    <p><b>{"Thời điểm đến: "}</b>{props.marker.infoWindow.startTime}</p>
                                </div>
                                <div>
                                    <p><b>{"Thời điểm dời: "}</b>{props.marker.infoWindow.endTime}</p>
                                </div>
                                <div>
                                    <p><b>{"Khung thời gian yêu cầu: "}</b>{props.marker.infoWindow.intendStartTime + " - " + props.marker.infoWindow.intendEndTime}</p>
                                </div>
                                <div>
                                    <p><b>{"Mã khách hàng: "}</b>{props.marker.infoWindow.customerCode}</p>
                                </div>
                                <div>
                                    <p><b>{"Mã đơn hàng: "}</b>{props.marker.infoWindow.bill.order.code}</p>
                                    <p><b>{"Khối lượng hàng: "}</b>{props.marker.infoWindow.bill.order.weight + " kg"}</p>
                                    <p><b>{"Thể tích hàng: "}</b>{props.marker.infoWindow.bill.order.capacity + " m3"}</p>
                                    <p><b>{"Số loại hàng: "}</b>{props.marker.infoWindow.bill.order.productTypeNumber}</p>
                                    <p><b>{"Tổng số tiền thu: "}</b>{props.marker.infoWindow.bill.totalAmount + " VND"}</p>
                                    <p><b>{"Giá trị đơn hàng: "}</b>{props.marker.infoWindow.bill.orderValue + " VND"}</p>
                                    <p><b>{"Phí dỡ hàng: "}</b>{props.marker.infoWindow.bill.unloadingFee + " VND"}</p>
                                    {props.marker.infoWindow.bill.penaltyCost > 0 &&

                                        <p><b>{"Phí phạt: "}</b>{props.marker.infoWindow.bill.penaltyCost + " VND"}</p>
                                    }
                                </div>
                                <div>
                                    <p><b>{"Tỷ lệ lấp đầy thể tích: "}</b>{props.marker.infoWindow.fillRateCapacity + " %"}</p>
                                </div>
                                <div>
                                    <p><b>{"Tỷ lệ lấp đầy khối lượng: "}</b>{props.marker.infoWindow.fillRateLoadWeight + " %"}</p>
                                </div>
                                <div>
                                    <p><b>{"Thời gian di chuyển: "}</b>{(Math.round((props.marker.infoWindow.travelTime / 60) * 10) / 10) + " phút"}</p>
                                </div>
                            </div>

                        }

                    </InfoWindow>
                }
            </Marker>
        </>
    );
}

export default connect(null, null)(withTranslate(CustomerMarker))