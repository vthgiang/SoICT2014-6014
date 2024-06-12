import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../production/common-production/request-management/redux/actions';

function OrdersInfoChart (props) {
    const { monthToSearch, transportationRequests } = props
    const transportationPieChart = useRef(null);
    const [state, setState] = useState({
        inProcessRequests: 0,
        failRequests: 0,
        successRequests: 0,
        isDelivering: 0
    });

    const { inProcessRequests, failRequests, successRequests, isDelivering } = state;

    useEffect(() => {
        pieChart();
    }, [inProcessRequests, failRequests, successRequests]);

    useEffect(() => {
        props.getAllRequestByCondition({ monthToSearch: monthToSearch, requestType: 4});
    }, [])

    useEffect(() => {
        if (transportationRequests) {
            setState({
                ...state,
                inProcessRequests: transportationRequests.totalRequests - transportationRequests.failRequests - transportationRequests.successRequests - transportationRequests.inProcessRequests,
                isDelivering: transportationRequests.inProcessRequests,
                failRequests: transportationRequests.failRequests,
                successRequests: transportationRequests.successRequests
            })
        }
    }, [transportationRequests])

    // Khởi tạo PieChart bằng C3
    const pieChart = () => {
        let chart = c3.generate({
            bindto: transportationPieChart.current,
            data: {
                columns: [
                    ['Chưa giao', inProcessRequests],
                    ['Đang giao', isDelivering],
                    ['Thất bại', failRequests],
                    ['Thành công', successRequests],
                ],
                type: 'pie',
                colors: {
                    'Chưa giao': '#3383f2',
                    'Đang giao': '#fade0a',
                    'Thất bại': '#ff2d03',
                    'Thành công': '#04de29'
                },
            },
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
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
            <section ref={transportationPieChart}></section>
        </React.Fragment>
    );
}

function mapState(state) {
    const requestManagements = state.requestManagements;
    return { requestManagements }
}
const mapDispatchToProps = {
    getAllRequestByCondition: RequestActions.getAllRequestByCondition,
}

const connectedOrdersInfoChart = connect(mapState, mapDispatchToProps)(withTranslate(OrdersInfoChart));
export { connectedOrdersInfoChart as OrdersInfoChart };