import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { Chart } from './chart'
import { DatePickerId } from './datePickerId'

import { transportRequirementsActions } from "../../transport-requirements/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function TransportArrangeSchedule(props) {
    const getTableId = "table-manage-transport-requirements-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;
    
    const { transportArrangeRequirements } = props;
    const [ timeData, setTimeData ] = useState({
        lists: [],
    });
    const [ listTime, setListTime ] = useState([]);
    useEffect(() => {
        props.getAllTransportRequirements({page:1, limit: 100});
    }, []);

    useEffect(() => {
        console.log(props.transportArrangeRequirements, " require");
    }, [props.transportArrangeRequirements]);


    /**
     * Cập nhật state thời gian các đơn hàng trong bảng
     * lists = { index : số thứ tự trong bảng, value: giá trị ngày}
     */
    const handleTimeChange = async (value, index) => {
        let lists = timeData?(timeData.lists?timeData.lists:[]):[];
        let pos;
        if (lists && lists.length !== 0){
            lists.forEach((val, i) => {
                if (parseInt(val.index) === Number(index)){
                    pos = i;
                }
            });
            if (Number(pos)>=0){
                lists[pos].value = value;
            }
            else {
                lists.push({
                    value: value,
                    index: index,
                });
            } 
        }
        else {
            lists.push({
                value: value,
                index: index,
            })
        }
        setTimeData({
            lists: lists
        });
    }
    const getRequestsTime = (index) => {
        let times = "";
        if (transportArrangeRequirements){
            if (transportArrangeRequirements[index].timeRequests && transportArrangeRequirements[index].timeRequests.length !==0){
                transportArrangeRequirements[index].timeRequests.forEach((item, i) => {
                    times += item.timeRequest +'___';
                })
            }
        }
        return times;
    }
    useEffect(() => {
        console.log(timeData, " time data");
    }, [timeData])
    return (
        <div className="box-body qlcv">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="form-inline">
                        <table id={getTableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Loại yêu cầu"}</th>
                            <th>{"Điểm nhận hàng"}</th>
                            <th>{"Điểm giao hàng"}</th>
                            <th>{"Thời gian mong muốn"}</th>
                            <th>{"Trạng thái"}</th>
                            <th style={{width: 200}}>{"Thời gian vận chuyển"}</th>
                        </tr>
                    </thead>
                    <tbody>                                
                        {
                            (transportArrangeRequirements && transportArrangeRequirements.length !==0) &&
                                transportArrangeRequirements.map((item, index) => (
                                    item && 
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{"Giao hàng"}</td>
                                        <td>{item.fromAddress}</td>
                                        <td>{item.toAddress}</td>
                                        <td>{getRequestsTime(index)}</td>
                                        <td>{"Xếp lịch"}</td>
                                        <td>
                                            <DatePickerId
                                                id={`${index}`}
                                                value={""}
                                                onChange={handleTimeChange}
                                                disabled={false}
                                            />
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
                    </div>
                </div>
                
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    
                    <Chart />
                </div>
            </div>
        </div>
    )
}

function mapState(state) {
    console.log(state);
    const transportArrangeRequirements = state.transportRequirements.lists;
    return { transportArrangeRequirements };
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
}

const connectedTransportArrangeSchedule = connect(mapState, actions)(withTranslate(TransportArrangeSchedule));
export { connectedTransportArrangeSchedule as TransportArrangeSchedule };