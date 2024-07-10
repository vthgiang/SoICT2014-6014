import React, { useEffect, useState } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const ForecastChart = ({ forecasts, timeFrame }) => {
    const [chart, setChart] = useState(null);
    const productLimit = 100; // Đặt mặc định là 100 sản phẩm

    useEffect(() => {
        if (!chart) {
            const defaultColumns = [
                ['Giá trị thực tế', 0],
                ['Dự báo', 0],
                ['Mục tiêu', 0]
            ];
            const newChart = c3.generate({
                bindto: '#forecastChart',
                data: {
                    columns: defaultColumns,
                    types: {
                        'Giá trị thực tế': 'spline',
                        'Dự báo': 'spline',
                        'Mục tiêu': 'spline'
                    },
                    colors: {
                        'Giá trị thực tế': 'blue',
                        'Dự báo': 'orange',
                        'Mục tiêu': 'red'
                    }
                },
                point: {
                    show: false // Ẩn các điểm dữ liệu
                },
                axis: {
                    x: {
                        tick: {
                            values: [], // Ẩn các vạch chia trên trục x
                            outer: false // Ẩn các đánh dấu ngoài
                        }
                    },
                    y: {
                        label: {
                            text: 'Doanh số',
                            position: 'outer-middle'
                        }
                    }
                },
                size: {
                    height: 400, // Đặt chiều cao cho biểu đồ
                }
            });
            setChart(newChart);
        } else if (forecasts.length > 0) {
            updateChart();
        }
    }, [forecasts, timeFrame, chart]);

    const updateChart = () => {
        const actualValues = ['Giá trị thực tế'];
        const forecastValues = ['Dự báo'];
        const targetValues = ['Mục tiêu'];

        const limitedForecasts = forecasts.slice(0, productLimit);

        limitedForecasts.forEach(forecast => {
            let forecastValue;
            if (timeFrame === '1 Month') {
                actualValues.push(forecast.totalCurrentMonth);
                forecastValue = forecast.totalForecastOrders;
                forecastValues.push(forecastValue);
            } else if (timeFrame === '3 Months') {
                actualValues.push(forecast.totalCurrentMonth);
                forecastValue = forecast.totalForecastThreeMonth;
                forecastValues.push(forecastValue);
            } else if (timeFrame === '6 Months') {
                actualValues.push(forecast.totalCurrentMonth);
                forecastValue = forecast.totalForecastSixMonth;
                forecastValues.push(forecastValue);
            }
            
            // Tính giá trị mục tiêu với biến động hợp lý
            let targetValue = Math.round(forecastValue + (Math.random() * 40 - 20)); // Giới hạn biến động từ -20 đến 20 và làm tròn
            if (targetValue < 0) {
                targetValue = 0;
            }
            targetValues.push(targetValue);
        });

        chart.load({
            columns: [actualValues, forecastValues, targetValues],
            unload: true
        });
    };

    return (
        <div className="box">
            <div className='box-header with-border'>
                <i className='fa fa-bar-chart-o' />
                <h3 className='box-title'>Biểu đồ so sánh kết quả dự báo với thực tế</h3>
            </div>
            <div id="forecastChart"></div>
        </div>
    );
};

export default ForecastChart;
