import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

function GoodWillReceipt(props) {

    const refLineChart = React.createRef();

    useEffect(() => {
        barAndLineChart();
    }, [props.dataForChart])

    // Khởi tạo BarChart bằng C3
    const barAndLineChart = () => {
        let dataChart = [];
        let { dataForChart, title } = props;
        dataChart[0] = dataForChart;
        c3.generate({
            bindto: refLineChart.current,
            data: {
                columns: dataChart,
                type: 'line',
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 0,
                        multiline: false
                    },
                    categories: title.slice(1),
                    height: 100
                }
            }
        });
    }

    return (
        <React.Fragment>
            <h3 className="box-title" style={{ padding: "0.7em 25%" }}>{"Xem số lượng sẽ nhập kho của từng mặt hàng"}</h3>
            <p className="pull-left" style={{ marginBottom: 0 }}><b>{"ĐV tính: Hộp"}</b></p>
            <div ref={refLineChart}></div>
        </React.Fragment>
    )
}

export default connect(null, null)(withTranslate(GoodWillReceipt));
