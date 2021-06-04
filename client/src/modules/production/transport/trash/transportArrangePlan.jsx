import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox } from "../../../../common-components";
import { formatToTimeZoneDate } from "../../../../helpers/formatDate"

import { TransportPlanChosenEdit } from './transportPlanChosenEdit'

import { transportRequirementsActions } from "../transport-requirements/redux/actions";
import { transportPlanActions } from "../transport-plan/redux/actions"
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function TransportArrangePlan(props) {
    const getTableId = "table-manage-transport-requirements-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;
    
    const { transportArrangeRequirements, allTransportPlans } = props;

    const [currentRequirement, setCurrentRequirement] = useState({});

    const [ timeData, setTimeData ] = useState({
        lists: [],
    });


    useEffect(() => {
        props.getAllTransportRequirements({page:1, limit: 100});
        // props.getAllTransportPlans({page:1, limit: 100});
    }, []);

    useEffect(() => {
        console.log(props.transportArrangeRequirements, " require");
    }, [props.transportArrangeRequirements]);

    useEffect(() => {
        let data = [];
        // data.push(
        //     {
        //         type: "stackedBar",
        //         name: "Meals",
        //         // showInLegend: "true",
        //         xValueFormatString: "DD, MMM",
        //         yValueFormatString: "$#,##0",
        //         dataPoints: [
        //             { x: new Date(2018, 5, 25), y: 56 },
        //             { x: new Date(2018, 5, 26), y: 45 },
        //             { x: new Date(2018, 5, 27), y: 71 },
        //             { x: new Date(2018, 5, 28), y: 41 },
        //             { x: new Date(2018, 5, 29), y: 60 },
        //             { x: new Date(2018, 5, 30), y: 75 },
        //             { x: new Date(2018, 6, 1), y: 98 },
        //         ]
        //     }
        // );
        // console.log(new Date(2021-04-07), "dada");
    }, [timeData])

    /**
     * Cập nhật state thời gian các đơn hàng trong bảng
     * lists = { id : id của requirement, value: giá trị ngày}
     */
    const handleTimeChange = async (value, id) => {
        let lists = timeData?(timeData.lists?timeData.lists:[]):[];
        let pos;
        if (lists && lists.length !== 0){
            lists.forEach((val, i) => {
                console.log(val, i, " foreach");
                if (val.id === id){
                    pos = i;
                    console.log(pos);
                }
            });
            if (Number(pos)>=0){
                lists[pos].value = value;
            }
            else {
                lists.push({
                    value: value,
                    id: id,
                });
            } 
        }
        else {
            lists.push({
                value: value,
                id: id,
            })
        }
        setTimeData({
            lists: lists
        });
        
        console.log(new Date(formatToTimeZoneDate(value)), "dada value");
    }


    /**
     * từ id trả về value trong state timeData.lists
     * @param {*} id 
     */
    const getValueFromTimeData = (id) => {
        let list = timeData.lists;
        const filterElement = list.filter(r => r.id === id);
        if (filterElement && filterElement.length !==0) {
            return filterElement[0].value;
        }
        else{
            return "";
        }
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
        // console.log(transportArrangeRequirements, " transportArrangeRequirements")
    }, [transportArrangeRequirements])

    const handleEdit = (index) => {
        console.log(index, " day la nut sua");
        // window.$("#" + index).datepicker({
        //     disabled : true,
        // })

    }
    const handleSaveOne = (id) => {
        let timeTransport = formatToTimeZoneDate(getValueFromTimeData(id));
        props.editTransportRequirement(id, { timeTransport: timeTransport,});
    }
    const handleTransportPlanChosenEdit = (item) => {
        setCurrentRequirement(item);
        window.$('#modal-edit-example-hooks').modal('show');
    }
    return (
        
        <React.Fragment>
        <TransportPlanChosenEdit
            // allTransportPlans={allTransportPlans}
            currentRequirementId={currentRequirement._id}
        />
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
                                    {/* <th style={{width: 200}}>{"Thời gian vận chuyển"}</th> */}
                                    <th>{"Kế hoạch vận chuyển"}</th>
                                    <th>{"Hành động"}</th>
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
                                        {/* <td>
                                            <DatePickerId
                                                id={`${item._id}`}
                                                value={""}
                                                onChange={handleTimeChange}
                                                disabled={false}
                                            />
                                        </td> */}
                                        <td>
                                            {item?.transportPlan?.code?item.transportPlan.code+" ": ""}
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={'manage_example.edit'} 
                                                onClick={() => handleTransportPlanChosenEdit(item)}
                                            >
                                                <i className="material-icons">edit</i></a>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={'manage_example.detail_info_example'} 
                                            // onClick={() => handleShowDetailInfo(example)}
                                            >
                                                <i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={'manage_example.edit'} 
                                                onClick={() => handleTransportPlanChosenEdit(index)}
                                            >
                                                <i className="material-icons">edit</i></a>
                                            <a className="text-green"
                                            onClick={() => handleSaveOne(item._id)}
                                            ><i className="material-icons">add_comment</i></a>
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                        </table>
                    </div>
                </div>
        
                {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <Chart />
                </div> */}
            </div>
        </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const transportArrangeRequirements = state.transportRequirements.lists;
    // const allTransportPlans = state.transportPlan.lists
    return { transportArrangeRequirements };
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    editTransportRequirement: transportRequirementsActions.editTransportRequirement,
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
}

const connectedTransportArrangePlan = connect(mapState, actions)(withTranslate(TransportArrangePlan));
export { connectedTransportArrangePlan as TransportArrangePlan };