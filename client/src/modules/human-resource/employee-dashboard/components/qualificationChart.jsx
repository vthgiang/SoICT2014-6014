/* Biểu đồ thể hiện trình độ học vấn của nhân viên trong công ty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { FieldsActions } from '../../field/redux/actions';

import { showListInSwal } from '../../../../helpers/showListInSwal';
import { CustomLegendC3js } from '../../../../common-components/index';

import c3 from 'c3';
import 'c3/c3.css';

class QualificationChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeChart: false,
        }
    }

    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i]._id !== items2[i]._id) {
                return false;
            }
        }
        return true;
    }

    /**
     * Bắt sự kiện thay đổi chế đọ xem biểu đồ
     * @param {*} value : chế độ xem biểu đồ (true or false)
     */
    handleChangeViewChart = (value) => {
        this.props.getListFields();
        this.setState({
            ...this.state,
            typeChart: value
        })
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.donutChart;
        while (chart && chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    /**
     * Render chart
     * @param {*} data : Dữ liệu của chart
     */
    renderChart = (data) => {
        const { typeChart } = this.state;
        this.removePreviousChart();

        this.dataChart = data;

        this.chart = c3.generate({
            bindto: this.refs.donutChart,
            data: {
                columns: [
                    ...data
                ],
                type: 'donut',
            },

            donut: {
                title: typeChart ? "Trình độ chuyên ngành" : "Trình độ chuyên môn"
            },

            legend: {
                show: false
            }
        });
    };

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { month } = this.state;
        await this.props.handleMonthChange(this.formatDate(month, true));
        await this.props.searchSalary({ callApiDashboard: true, month: month });
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.organizationalUnits !== prevState.organizationalUnits || !QualificationChart.isEqual(nextProps.employeesManager.listAllEmployees, prevState.listAllEmployees) ||
            !QualificationChart.isEqual(nextProps.employeesManager.listEmployeesOfOrganizationalUnits, prevState.listEmployeesOfOrganizationalUnits)) {
            return {
                organizationalUnits: nextProps.organizationalUnits,
                listAllEmployees: nextProps.employeesManager.listAllEmployees,
                listEmployeesOfOrganizationalUnits: nextProps.employeesManager.listEmployeesOfOrganizationalUnits
            }
        }
        return null;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    /**
     * Function chyển dữ liệu thành dữ liệu chart
     * @param {*} data: Dữ liệu truyền vào 
     * intermediate_degree - Trung cấp, colleges - Cao đẳng, university-Đại học, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có 
     */
    convertData = (data) => {
        const { translate, field } = this.props;
        const { typeChart } = this.state;
        let listFields = field.listFields;
        let intermediate_degree = 0, colleges = 0, university = 0, master_degree = 0, phd = 0, unavailable = 0;

        if (typeChart) {
            let degrees = [];
            data.forEach(x => {
                degrees = degrees.concat(x.degrees)
            });

            listFields = listFields.map(x => {
                let total = degrees.filter(y => y.field && y.field.toString() === x._id.toString())
                return [x.name, total.length]
            })
            return listFields
        } else {
            data.forEach(x => {
                switch (x.professionalSkill) {
                    case 'intermediate_degree':
                        intermediate_degree = intermediate_degree + 1;
                        break;
                    case 'colleges':
                        colleges = colleges + 1;
                        break;
                    case 'university':
                        university = university + 1;
                        break;
                    case 'master_degree':
                        master_degree = master_degree + 1;
                        break;
                    case 'phd':
                        phd = phd + 1;
                        break;
                    default:
                        unavailable = unavailable + 1;
                }
            });
            return [
                [translate(`human_resource.profile.intermediate_degree`), intermediate_degree],
                [translate(`human_resource.profile.colleges`), colleges],
                [translate(`human_resource.profile.university`), university],
                [translate(`human_resource.profile.master_degree`), master_degree],
                [translate(`human_resource.profile.phd`), phd],
                [translate(`human_resource.profile.unavailable`), unavailable]
            ]
        }
    };

    componentDidMount() {
        this.renderChart("");
    }

    componentDidUpdate() {
        const { employeesManager, department } = this.props;
        const { organizationalUnits } = this.state;

        let listAllEmployees = employeesManager.listEmployeesOfOrganizationalUnits;

        if (listAllEmployees.length !== 0) {
            this.renderChart(this.convertData(listAllEmployees));
        } else {
            this.removePreviousChart();
        }
    }

    render() {
        const { employeesManager, department, translate } = this.props;
        const { organizationalUnits, typeChart } = this.state;

        let organizationalUnitsName;
        if (organizationalUnits) {
            organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        }

        return (
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <div className="box-title">
                            {`Trình độ chuyên môn của nhân sự `}
                            {
                                organizationalUnitsName && organizationalUnitsName.length < 2 ?
                                    <>
                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                        <span>{` ${organizationalUnitsName?.[0] ? organizationalUnitsName?.[0] : ""}`}</span>
                                    </>
                                    :
                                    <span onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                    </span>
                            }
                        </div>
                    </div>
                    { employeesManager.isLoading
                        ? <p>{translate('general.loading')}</p>
                        : <div className="box-body">
                            <div className="box-tools pull-left" >
                                <div className="btn-group pull-left">
                                    <button type="button" className={`btn btn-xs ${typeChart ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Trình độ chuyên môn</button>
                                    <button type="button" className={`btn btn-xs ${typeChart ? 'btn-danger' : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Trình độ chuyên ngành</button>
                                </div>
                            </div>
                            <section id={"donutChart"} className="c3-chart-container">
                                <div ref="donutChart"></div>
                                <div style={{ paddingTop: 10 }}>
                                    <CustomLegendC3js
                                        chart={this.chart}
                                        chartId={"donutChart"}
                                        legendId={"donutChartLegend"}
                                        title={`${typeChart ? "Danh sách trình độ chuyên ngành" : "Dánh sách trình độ chuyên môn"}`}
                                        dataChartLegend={this.dataChart && this.dataChart.map(item => item[0])}
                                    />
                                </div>
                            </section>
                        </div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { employeesManager, field, department } = state;
    return { employeesManager, field, department };
}


const actionCreators = {
    getListFields: FieldsActions.getListFields,
};

const qualificationChart = connect(mapState, actionCreators)(withTranslate(QualificationChart));
export { qualificationChart as QualificationChart };