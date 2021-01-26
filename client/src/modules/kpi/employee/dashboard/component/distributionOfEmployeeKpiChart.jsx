import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { createKpiSetActions } from '../../creation/redux/actions';

import { DatePicker } from '../../../../../common-components';

import * as d3 from "d3";
import c3 from 'c3';
import 'c3/c3.css';


var translate ='';
class DistributionOfEmployeeKpiChart extends Component {

    constructor(props) {
        super(props);

        translate = this.props.translate;

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            month: currentYear + '-' + (currentMonth + 1),
            dataStatus: this.DATA_STATUS.QUERYING
        };
    }

    componentDidMount = () => {
        // Lấy Kpi của cá nhân hiện tại
        this.props.getEmployeeKpiSet(this.state.month);

        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
            };
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextState.month !== this.state.month) {
            await this.props.getEmployeeKpiSet(nextState.month);

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });

            return false;
        }
    
        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!nextProps.createEmployeeKpiSet.currentKPI)
                return false;
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE){
            this.pieChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }

    /**Thiết lập dữ liệu biểu đồ */
    setDataPieChart = () => {
        const { createEmployeeKpiSet } = this.props;
        let listEmployeeKpi, dataPieChart;

        if (createEmployeeKpiSet.currentKPI && createEmployeeKpiSet.currentKPI.kpis) {
            listEmployeeKpi = createEmployeeKpiSet.currentKPI.kpis
        }
        if(listEmployeeKpi){
            dataPieChart = listEmployeeKpi.map(x => { 
                return [ x.name, x.weight ]
            })
        }

        return dataPieChart;
    }

     /**Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart(){
        const chart = this.refs.chart;
        while(chart.hasChildNodes()){
            chart.removeChild(chart.lastChild);
        }
    } 

    /**Khởi tạo PieChart bằng C3 */
    pieChart = () => {
        this.removePreviousChart();

        // Tạo mảng dữ liệu
        let dataPieChart;
        dataPieChart = this.setDataPieChart(); 

        let chart = c3.generate({
            bindto: this.refs.chart,             // Đẩy chart vào thẻ div có id="pieChart"

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                columns: dataPieChart,
                type : 'pie',
            },

            legend: {
                show: false
            }
        });

        d3.select('.c3-chart-container').insert('div', '.chart').attr('class', 'legend StyleScrollDiv StyleScrollDiv-y').selectAll('span')
            .data(dataPieChart.map(item => item[0]))
            .enter().append('div')
            .attr('data-id', function (id) { return id; })
            .html(function (id) { return id; })
            .each(function (id) {
                d3.select(this).style('border-left', `5px solid ${chart.color(id)}`);
                d3.select(this).style('padding-left', `5px`);
            })
            .on('mouseover', function (id) {
                chart.focus(id);
            })
            .on('mouseout', function (id) {
                chart.revert();
            })
            .on('click', function (id) {
                chart.toggle(id);
            });
    }

    handleSelectMonth = async (value) => {
        let month = value.slice(3,7) + '-' + value.slice(0,2);
        this.setState(state => {
            return {
                ...state,
                month: month
            }
        })
    }

    render() {
        const { createEmployeeKpiSet } = this.props;
        let currentEmployeeKpiSet;

        if(createEmployeeKpiSet) {
            currentEmployeeKpiSet = createEmployeeKpiSet.currentKPI
        }

        let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultDate = [month, year].join('-');

        return (
            <React.Fragment>
                <section className="form-inline">
                    <div className="form-group">
                    <label>{translate('kpi.organizational_unit.dashboard.month')}</label>
                        <DatePicker 
                            id="monthDistributionOfEmployeeKpiChart"      
                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                            value={defaultDate}                 // giá trị mặc định cho datePicker    
                            onChange={this.handleSelectMonth}
                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                        />
                    </div>
                </section>

                {currentEmployeeKpiSet ?
                    <section className="c3-chart-container">
                        <div ref="chart"></div>
                        <label><i className="fa fa-exclamation-circle" style={{ color: '#06c', paddingRight: '5px' }}/>{translate('kpi.evaluation.employee_evaluation.KPI_list')}</label>
                    </section>
                    : <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
                }
            </React.Fragment>
        )
    }
        
}

function mapState(state) {
    const { createEmployeeKpiSet } = state;
    return { createEmployeeKpiSet };
}

const actions = {
    getEmployeeKpiSet: createKpiSetActions.getEmployeeKpiSet
}

const connectedDistributionOfEmployeeKpiChart = connect(mapState, actions)(withTranslate(DistributionOfEmployeeKpiChart));
export { connectedDistributionOfEmployeeKpiChart as DistributionOfEmployeeKpiChart}