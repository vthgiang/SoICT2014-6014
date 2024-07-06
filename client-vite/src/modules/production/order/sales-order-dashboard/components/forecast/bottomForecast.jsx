import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';
import { forecastActions } from '../../../forecast/redux/actions';

const Bottom5ProductsChart = ({ bottom5Products, timeFrame, dispatch }) => {
    useEffect(() => {
        dispatch(forecastActions.getBottom5Products());
    }, [dispatch]);

    useEffect(() => {
        if (bottom5Products && bottom5Products.bottom5OneMonth) {
            let chartData, categories;

            switch (timeFrame) {
                case '1 Month':
                    chartData = {
                        columns: [
                            ['1 Month', ...bottom5Products.bottom5OneMonth.map(item => item.totalForecastOrders)],
                        ],
                        type: 'bar'
                    };
                    categories = bottom5Products.bottom5OneMonth.map(item => shortenText(item.goodName));
                    break;
                case '3 Months':
                    chartData = {
                        columns: [
                            ['3 Months', ...bottom5Products.bottom5ThreeMonth.map(item => item.totalForecastThreeMonth)],
                        ],
                        type: 'bar'
                    };
                    categories = bottom5Products.bottom5ThreeMonth.map(item => shortenText(item.goodName));
                    break;
                case '6 Months':
                    chartData = {
                        columns: [
                            ['6 Months', ...bottom5Products.bottom5SixMonth.map(item => item.totalForecastSixMonth)],
                        ],
                        type: 'bar'
                    };
                    categories = bottom5Products.bottom5SixMonth.map(item => shortenText(item.goodName));
                    break;
                default:
                    break;
            }

            c3.generate({
                bindto: '#chart-bottom5',
                data: chartData,
                axis: {
                    rotated: true,
                    x: {
                        type: 'category',
                        categories: categories,
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
                            return getFullName(d, timeFrame, bottom5Products);
                        }
                    }
                }
            });
        }
    }, [bottom5Products, timeFrame]);

    const shortenText = (text, maxLength = 20) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const getFullName = (index, timeFrame, products) => {
        switch (timeFrame) {
            case '1 Month':
                return products.bottom5OneMonth[index].goodName;
            case '3 Months':
                return products.bottom5ThreeMonth[index].goodName;
            case '6 Months':
                return products.bottom5SixMonth[index].goodName;
            default:
                return '';
        }
    };

    return (
        <div>
            <h2>Bottom 5 Products</h2>
            <div id="chart-bottom5"></div>
        </div>
    );
};

const mapStateToProps = state => ({
    bottom5Products: state.forecasts.bottom5Products
});

export default connect(mapStateToProps)(Bottom5ProductsChart);
