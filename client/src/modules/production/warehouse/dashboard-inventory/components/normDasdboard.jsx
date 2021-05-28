
import React, { useState, useEffect } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

function NormDasdboard(props){
    const [state, setState] = useState({
        barChart: true
    })

    const refBarChart = React.createRef();

    useEffect(() => {
        barChart();
    }, [])

    // Thiết lập dữ liệu biểu đồ
    const setDataBarChart = () => {
        let data = {
            count: ["5", "6", "7", "8", "9", "10"],
            type: ["Thắng", "Phương", "Tài", "An", "Sang"],
            shortName: ["T", "P","T", "A", "S"]
        }

        return data;
    }

    // Khởi tạo BarChart bằng C3
    const barChart = () => {
        let { translate } = props;
        let dataPieChart = setDataBarChart();
        let count = dataPieChart.count;
        let heightCalc = dataPieChart.type.length * 24.8;
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: refBarChart.current,
            data: {
                x : 'x',
                columns: [
                    ['x', 'Albendazole', 'Afatinib', 'Zoledronic Acid', 'Abobotulinum', 'Acid Thioctic', 'Mometasone (bôi)', 'Capecitabine', 'Mytomycin C'],
                    ['Lê Thanh Nghị', 10, -20, 10, 20, -0, 0, 0, 30],
                    ['Tạ Quang Bửu', 10, 0, -10, 0, -10, 22, 50, 0],
                    ['Trần Đại Nghĩa', 0, -20, 0, 20, -0, 0, 0, 0],
                    ['Đại Cồ Việt', -10, -0, 10, 0, -10, 0, 0, 0],
                ],
                type: 'bar',
                labels: true,
                // groups: [
                //     ['Trần Đại Nghĩa','Tạ Quang Bửu', 'Lê Thanh Nghị', 'Đại Cồ Việt']
                // ]
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 100
                }
            },
            grid: {
                y: {
                    lines: [{value: 0}]
                }
            }
        });
    }

        const { translate } = props;
        barChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng mặt hàng vượt định mức
                        </h3>
                        <div ref={refBarChart}></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

export default withTranslate(NormDasdboard);