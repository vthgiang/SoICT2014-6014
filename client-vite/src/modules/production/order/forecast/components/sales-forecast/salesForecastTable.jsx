import React, { useEffect, useState } from 'react';
import c3 from 'c3';
import 'c3/c3.css';
import { useDispatch, useSelector } from 'react-redux';
import { forecastActions } from '../../../forecast/redux/actions';

const ForecastChart = () => {
    const dispatch = useDispatch();
    const forecasts = useSelector(state => state.forecasts.forecasts);
    const isLoading = useSelector(state => state.forecasts.isLoading);
    const error = useSelector(state => state.forecasts.error);

    const [selectedPeriod, setSelectedPeriod] = useState(1);
    const [chart, setChart] = useState(null);

    useEffect(() => {
        dispatch(forecastActions.getAllForecasts());
    }, [dispatch]);

    useEffect(() => {
        if (!chart) {
            const defaultColumns = [
                ['Giá trị thực tế', 0],
                ['Dự báo', 0]
            ];
            const newChart = c3.generate({
                bindto: '#forecastChart',
                data: {
                    columns: defaultColumns,
                    types: {
                        'Giá trị thực tế': 'line',
                        'Dự báo': 'line'
                    }
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: ['Mẫu sản phẩm']
                    },
                    y: {
                        label: {
                            text: 'Doanh số',
                            position: 'outer-middle'
                        }
                    }
                }
            });
            setChart(newChart);
        } else if (forecasts.length > 0) {
            updateChart();
        }
    }, [forecasts, selectedPeriod, chart]);

    const updateChart = () => {
        const actualValues = ['Giá trị thực tế'];
        const forecastValues = ['Dự báo'];

        forecasts.forEach(forecast => {
            if (selectedPeriod === 1) {
                actualValues.push(forecast.totalCurrentMonth);
                forecastValues.push(forecast.totalForecastOrders);
            } else if (selectedPeriod === 3) {
                actualValues.push(forecast.totalCurrentMonth);
                forecastValues.push(forecast.totalForecastThreeMonth);
            } else if (selectedPeriod === 6) {
                actualValues.push(forecast.totalCurrentMonth);
                forecastValues.push(forecast.totalForecastSixMonth);
            }
        });

        chart.load({
            columns: [actualValues, forecastValues],
            unload: true,
            categories: forecasts.map(forecast => forecast.goodName)
        });
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(Number(event.target.value));
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', marginTop: '10px' }}>
                <select onChange={handlePeriodChange} value={selectedPeriod}>
                    <option value={1}>1 tháng</option>
                    <option value={3}>3 tháng</option>
                    <option value={6}>6 tháng</option>
                </select>
            </div>
            {isLoading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div id="forecastChart" style={{ height: '400px' }}></div>
            )}
        </div>
    );
};

export default ForecastChart;
