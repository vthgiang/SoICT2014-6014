import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';
import { forecastActions } from '../../../forecast/redux/actions';

const Top5ProductsChart = ({ top5Products, timeFrame, dispatch }) => {
    useEffect(() => {
        dispatch(forecastActions.getTop5Products());
    }, [dispatch]);

    useEffect(() => {
        if (top5Products && top5Products.top5OneMonth) {
            let chartData, categories;

            switch (timeFrame) {
                case '1 Month':
                    chartData = {
                        columns: [
                            ['1 Month', ...top5Products.top5OneMonth.map(item => item.totalForecastOrders)],
                        ],
                        type: 'bar'
                    };
                    categories = top5Products.top5OneMonth.map(item => shortenText(item.goodName));
                    break;
                case '3 Months':
                    chartData = {
                        columns: [
                            ['3 Months', ...top5Products.top5ThreeMonth.map(item => item.totalForecastThreeMonth)],
                        ],
                        type: 'bar'
                    };
                    categories = top5Products.top5ThreeMonth.map(item => shortenText(item.goodName));
                    break;
                case '6 Months':
                    chartData = {
                        columns: [
                            ['6 Months', ...top5Products.top5SixMonth.map(item => item.totalForecastSixMonth)],
                        ],
                        type: 'bar'
                    };
                    categories = top5Products.top5SixMonth.map(item => shortenText(item.goodName));
                    break;
                default:
                    break;
            }

            c3.generate({
                bindto: '#chart-top5',
                data: chartData,
                axis: {
                    rotated: true, // Chuyển trục để biểu đồ nằm ngang
                    x: {
                        type: 'category',
                        categories: categories,
                    },
                    y: {
                        label: {
                            text: 'Đơn vị tính',
                            position: 'outer-middle'
                        }
                    }
                },
                bar: {
                    width: {
                        ratio: 0.5
                    }
                },
                tooltip: {
                    format: {
                        title: function (d) {
                            return getFullName(d, timeFrame, top5Products);
                        }
                    }
                },
                legend: {
                    show: true
                }
            });
        }
    }, [top5Products, timeFrame]);

    const shortenText = (text, maxLength = 20) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const getFullName = (index, timeFrame, products) => {
        switch (timeFrame) {
            case '1 Month':
                return products.top5OneMonth[index].goodName;
            case '3 Months':
                return products.top5ThreeMonth[index].goodName;
            case '6 Months':
                return products.top5SixMonth[index].goodName;
            default:
                return '';
        }
    };

    return (
        <div className="box">
            <div className="box-header with-border">
                <i className="fa fa-bar-chart-o" />
                <h3 className="box-title">Top 5 Products</h3>
                <div id="chart-top5"></div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    top5Products: state.forecasts.top5Products
});

export default connect(mapStateToProps)(Top5ProductsChart);
