import React, { useEffect, useState } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const ForecastChart = ({ forecasts, timeFrame, productLimit }) => {
    const [chart, setChart] = useState(null);

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
                        'Giá trị thực tế': 'spline',
                        'Dự báo': 'spline'
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
                }
            });
            setChart(newChart);
        } else if (forecasts.length > 0) {
            updateChart();
        }
    }, [forecasts, timeFrame, productLimit, chart]);

    const updateChart = () => {
        const actualValues = ['Giá trị thực tế'];
        const forecastValues = ['Dự báo'];

        const limitedForecasts = forecasts.slice(0, productLimit);

        limitedForecasts.forEach(forecast => {
            if (timeFrame === '1 Month') {
                actualValues.push(forecast.totalCurrentMonth);
                forecastValues.push(forecast.totalForecastOrders);
            } else if (timeFrame === '3 Months') {
                actualValues.push(forecast.totalCurrentMonth);
                forecastValues.push(forecast.totalForecastThreeMonth);
            } else if (timeFrame === '6 Months') {
                actualValues.push(forecast.totalCurrentMonth);
                forecastValues.push(forecast.totalForecastSixMonth);
            }
        });

        chart.load({
            columns: [actualValues, forecastValues],
            unload: true
        });
    };

    return (
        <div className="box">
            <div id="forecastChart" ></div>
        </div>
    );
};

export default ForecastChart;
