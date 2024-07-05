import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DashboardActions } from '../../redux/actions';
import { kpiTemplateActions } from '../../../../kpi/organizational-unit/template/redux/actions';
import { withRouter } from 'react-router-dom';
import ImproveOTDRate from './improveOTDRate';

function OnTimeDeliveryChart({monthToSearch}) {
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
        const [month, year] = monthToSearch.split('-');
        dispatch(DashboardActions.getOnTimeDeliveryRatesPerMonth(month, year))
        dispatch(DashboardActions.getEstimatedOnTimeDeliveryRatesPerMonth(month, year))
        dispatch(kpiTemplateActions.getKpiTemplates())
    }, [dispatch, monthToSearch]);

    // Khởi tạo PieChart bằng C3
    const listMonth = () => {
        const arr = ['x']

        const formatData = T3Dashboard.onTimeDeliveryData.map((item) => {
            return item.month
        })

        return arr.concat(formatData)
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
        const targetArray = ['plannedOntimeDeliveryRate', ...Array(months.length - 1).fill(target)];
        return targetArray;
    }

    const kpiName = "Tỉ lệ giao hàng đúng hạn";
    let plannedOntimeDeliveryRate;
    try {
        plannedOntimeDeliveryRate = getKpiTargetArray(kpitemplates, kpiName);
    } catch (error) {
        console.error(error.message);
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
        });
    }

    return (
        <React.Fragment>
            <section ref={ontimeDeliveryChart}>
            </section>
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
        </React.Fragment>
    );
}


function mapState(state) {

}
// const connectedOnTimeDeliveryChart = connect(mapState)(withTranslate(OnTimeDeliveryChart));
const connectedOnTimeDeliveryChart = connect(mapState)(withTranslate(withRouter(OnTimeDeliveryChart)));
export { connectedOnTimeDeliveryChart as OnTimeDeliveryChart };
