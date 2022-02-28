import React, { Component, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Tree } from '../../../../../../common-components';
import c3 from 'c3';
import 'c3/c3.css';

function BarChartDomain(props) {
    useEffect(() => {
        barChartDocumentInDomain();
    })
    const refDomain = React.createRef()
    function removePreviousDomainChart() {
        const chart = refDomain.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    const barChartDocumentInDomain = () => {
        removePreviousDomainChart();
        // let dataChart = setDataDomainBarchart();
        let dataChart = {count:0,shortName:[],type:[]}
        if (props.data){
            dataChart = props.data.dataChart
        }
        let count = dataChart.count;
        let heightCalc
        if (dataChart.type) {
            heightCalc = dataChart.type.length * 24.8;
        }
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: refDomain.current,
            data: {
                columns: [count],
                type: 'bar',
                labels: true,
            },

            padding: {
                top: 10,
                bottom: 20,
                right: 0,
                left: 100
            },

            axis: {
                x: {
                    type: 'category',
                    categories: dataChart.shortName,
                    tick: {
                        multiline: false
                    }
                },
                y: {
                    label: {
                        text: 'Số lượng',
                        position: 'outer-right'
                    }
                },
                rotated: true
            },

            size: {
                height: height
            },

            color: {
                pattern: ['#1f77b4']
            },

            legend: {
                show: false
            },

            tooltip: {
                format: {
                    title: function (index) { return dataChart.type[index] },

                }
            }
        });
    }
    const setDataDomainBarchart = () => {
        const domains = props.domains;
        const docs = props.docs;
        let typeName = [], shortName = [], countDomain = [], idDomain = [];
        for (let i in domains) {
            countDomain[i] = 0;
            idDomain.push(domains[i].id)
        }

        if (docs) {
            docs.map(doc => {
                doc.domains.map(domain => {
                    let idx = idDomain.indexOf(domain);
                    countDomain[idx]++;
                })
            })
            for (let i in domains) {
                let longName = domains[i].name.slice(0, 15) + "...";
                let name = domains[i].name.length > 15 ? longName : domains[i].name;
                shortName.push(name);
                typeName.push(domains[i].name);

            }
        }
        countDomain.unshift(' ');
        let data = {
            count: countDomain,
            type: typeName,
            shortName: shortName
        }
        return data;
    }

    const domains = props.domains;
    const docs = props.documents;
    useMemo(() => {
        barChartDocumentInDomain();
    }, [props.domains, props.documents])
    return (
        <React.Fragment>
            <div ref={refDomain}></div>
        </React.Fragment>
    )
}


export default BarChartDomain;