import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import moment from 'moment';
import { DashboardActions } from '../../redux/actions';
import { kpiTemplateActions } from '../../../../kpi/organizational-unit/template/redux/actions';
import { withRouter } from 'react-router-dom';
import { DialogModal } from '../../../../../common-components';
import improveOTDRate from './improveOTDRate';
import ImproveOTDRate from './improveOTDRate';

function OnTimeDeliveryChart(props) {
    const dispatch = useDispatch()
    const T3Dashboard = useSelector((state) => state.T3dashboard)
    const kpitemplates = useSelector((state) => state.kpitemplates.items)
    const ontimeDeliveryChart = useRef(null);
    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    };

    useEffect(() => {
        pieChart();
    });

    useEffect(() => {
        dispatch(DashboardActions.getOnTimeDeliveryRatesPerMonth())
        dispatch(DashboardActions.getEstimatedOnTimeDeliveryRatesPerMonth())
        dispatch(kpiTemplateActions.getKpiTemplates())
    }, [dispatch]);



    // Khởi tạo PieChart bằng C3
    const listMonth = () => {
        const arr = ['x']
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const monthList = Array.from({ length: currentMonth }, (_, i) => {
            const month = (i + 1).toString().padStart(2, '0');
            return `${month}-${currentYear}`
        })

        return arr.concat(monthList)
    }

    const generateActualOntimeRate = () => {
        const arr = ['actualOntimeDeliveryRate']

        const formatData = T3Dashboard.onTimeDeliveryData.map((item) => {
            return item.onTimeRate
        })

        return arr.concat(formatData)
    }

    const generateEstimatedOntimeRate = () => {
        const arr = ['estimatedOntimeDeliveryRate']

        const formatData = T3Dashboard.estimatedOnTimeDeliveryData.map((item) => {
            return item.onTimeRate
        })

        return arr.concat(formatData)
    }

    // Tìm giá trị target của kpi Tỉ lệ giao hàng đúng hạn trong collection organizationalunitkpitemplates
    const getKpiTargetArray = (kpiTemplates, kpiName) => {
        let kpi = null;

        kpiTemplates.forEach((kpiTemplate) => {
            const foundKpi = kpiTemplate.kpis.find(kpi => kpi.name === kpiName);
            if (foundKpi) {
                kpi = foundKpi;
            }
        });

        if (!kpi) {
            throw new Error(`KPI with name "${kpiName}" not found`);
        }

        const target = kpi.target;
        const months = listMonth();
        const targetArray = ['plannedOntimeDeliveryRate', ...Array(months.length - 2).fill(target)];
        return targetArray;
    }

    const kpiName = "Tỉ lệ giao hàng đúng hạn";
    let plannedOntimeDeliveryRate;
    try {
        plannedOntimeDeliveryRate = getKpiTargetArray(kpitemplates, kpiName);
        console.log('Planned Ontime Delivery Rate:', plannedOntimeDeliveryRate);
    } catch (error) {
        console.error(error.message);
        // Xử lý lỗi nếu cần thiết, ví dụ: gán giá trị mặc định
        plannedOntimeDeliveryRate = ['plannedOntimeDeliveryRate', 0, 0, 0, 0, 0, 0];
    }

    const handleOpenImproveOTDRateModal = () => {
        window.$(`#modal-improve-OTD-rate`).modal('show')
    };

    const pieChart = () => {
        let chart = c3.generate({
            bindto: ontimeDeliveryChart.current,
            data: {
                x: 'x',
                columns: [
                    listMonth(),
                    generateActualOntimeRate(),
                    generateEstimatedOntimeRate(),
                    plannedOntimeDeliveryRate
                    // getKpiTargetArray(kpitemplates, "Tỉ lệ giao hàng đúng hạn")
                    // ['actualOntimeDeliveryRate', 87, 92, 93, 85, 90, 92],
                    // ['estimatedOntimeDeliveryRate', 88, 92, 90, 87, 89, 91],
                    // ['plannedOntimeDeliveryRate', 90, 90, 90, 90, 90, 90],
                ],
                type: 'spline',
                names: {
                    'actualOntimeDeliveryRate': "Tỉ lệ giao hàng đúng hạn thực tế",
                    'estimatedOntimeDeliveryRate': "Tỉ lệ giao hàng đúng hạn dự kiến",
                    'plannedOntimeDeliveryRate': "Tỉ lệ giao hàng đúng hạn kế hoạch",
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
                    max: 100,
                    // min: 0,
                    padding: {top: 0, bottom: 10},
                    label: '%'
                }
            },

            color: {
                pattern: ['#0793de', '#f5b105', '#000000']
            },

            // tooltip: {
            //     format: {
            //         title: function (d) { return d; },
            //         value: function (value) {
            //             return value;
            //         }
            //     }
            // },

            // legend: {
            //     show: true
            // }
        });
    }

    return (
        <React.Fragment>
            {/* <button onClick={() => props.getCostOfAllJourney({})}>Test</button> */}
            {/* <section ref={ontimeDeliveryChart}></section> */}
            <section ref={ontimeDeliveryChart}>
            </section>
            {/* {JSON.stringify(T3Dashboard)} */}
            <button
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: '10', // Để đảm bảo nút hiển thị trước biểu đồ
                }}
                onClick={()=> handleOpenImproveOTDRateModal()}
            >
                Tăng tỉ lệ giao hàng đúng hạn
            </button>
            <ImproveOTDRate showModal={showModal} setShowModal={setShowModal} />
            {/* <RetrainingModel showModal={showModal} setShowModal={setShowModal} /> */}
        </React.Fragment>
    );
}


function mapState(state) {

}
// const connectedOnTimeDeliveryChart = connect(mapState)(withTranslate(OnTimeDeliveryChart));
const connectedOnTimeDeliveryChart = connect(mapState)(withTranslate(withRouter(OnTimeDeliveryChart)));
export { connectedOnTimeDeliveryChart as OnTimeDeliveryChart };
