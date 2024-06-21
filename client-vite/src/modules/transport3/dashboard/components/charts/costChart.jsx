import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../production/common-production/request-management/redux/actions';
import { JourneyActions } from '../../../../transportation/scheduling/tracking-route/redux/actions';
import moment from 'moment';

function TransportationCostChart (props) {

    const transportationCostChart = useRef(null);
    const { journeyTotalCostPerDay } = props;
    const [state, setState] = useState({
        costPerDay: [],
    })
    const { costPerDay } = state;

    useEffect(() => {
        pieChart();
    }, [costPerDay]);

    useEffect(() => {
        if (journeyTotalCostPerDay) {
            let costPerDay = journeyTotalCostPerDay.map((cost) => {
                return {
                    shipper: Math.round(cost.shipper/10000)/100,
                    vehicle: Math.round(cost.vehicle/10000)/100
                }
            })
            setState({
                ...state,
                costPerDay: costPerDay
            })
        }
    }, [journeyTotalCostPerDay])

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        let chart = c3.generate({
            bindto: transportationCostChart.current,
            data: {
                x: 'x',
                columns: [
                    ['x', moment().subtract(6, "days").format("DD-MM"), moment().subtract(5, "days").format("DD-MM"), moment().subtract(4, "days").format("DD-MM"), moment().subtract(3, "days").format("DD-MM"), moment().subtract(2, "days").format("DD-MM"), moment().subtract(1, "days").format("DD-MM") , moment().format("DD-MM")],
                    ['employSalary', costPerDay[6] ? costPerDay[6].shipper : 0, costPerDay[5] ? costPerDay[5].shipper : 0, costPerDay[4] ? costPerDay[4].shipper : 0,
                        costPerDay[3] ? costPerDay[3].shipper : 0, costPerDay[2] ? costPerDay[2].shipper : 0, costPerDay[1] ? costPerDay[1].shipper : 0,
                        costPerDay[0] ? costPerDay[0].shipper : 0
                    ],
                    ['vehiclesCost', costPerDay[6] ? costPerDay[6].vehicle : 0, costPerDay[5] ? costPerDay[5].vehicle : 0, costPerDay[4] ? costPerDay[4].vehicle : 0,
                        costPerDay[3] ? costPerDay[3].vehicle : 0, costPerDay[2] ? costPerDay[2].vehicle : 0, costPerDay[1] ? costPerDay[1].vehicle : 0,
                        costPerDay[0] ? costPerDay[0].vehicle : 0
                    ],
                ],
                type: 'spline',
                names: {
                    'vehiclesCost': "Chi phí xe",
                    'employSalary': 'Lương nhân viên'
                }
            },
            padding: {
                top: 20,
                bottom: 20,
            },

            axis: {
                x: {
                    type: 'category',
                },
                y: {
                    label: 'Triệu VND'
                }
            },

            color: {
                pattern: ['#0793de', '#f5b105']
            },

            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },

            legend: {
                show: true
            }
        });
    }

    return (
        <React.Fragment>
            {/* <button onClick={() => props.getCostOfAllJourney({})}>Test</button> */}
            <section ref={transportationCostChart}></section>
        </React.Fragment>
    );
}


function mapState(state) {
    const requestManagements = state.requestManagements;
    const journey = state.journey;

    return { requestManagements, journey }
}
const mapDispatchToProps = {
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
}

const connectedTransportationCostChart = connect(mapState, mapDispatchToProps)(withTranslate(TransportationCostChart));
export { connectedTransportationCostChart as TransportationCostChart };