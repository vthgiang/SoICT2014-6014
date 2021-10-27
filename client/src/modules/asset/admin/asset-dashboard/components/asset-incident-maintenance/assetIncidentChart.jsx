import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, SelectBox, TreeSelect } from '../../../../../../common-components';
import Swal from 'sweetalert2';
import { AssetManagerActions } from '../../../asset-information/redux/actions';
import c3 from 'c3';
import 'c3/c3.css';

class AssetIncidentChart extends Component {
    constructor(props) {
        super(props);

        let d = new Date(),
            month = d.getMonth() + 1,
            year = d.getFullYear();
        let startMonth, endMonth, startYear;

        if (month > 3) {
            startMonth = month - 3;
            startYear = year;
        } else {
            startMonth = month - 3 + 12;
            startYear = year - 1;
        }
        if (startMonth < 10)
            startMonth = '0' + startMonth;
        if (month < 10) {
            endMonth = '0' + month;
        } else {
            endMonth = month;
        }

        this.INFO_SEARCH = {
            incidentDateAfter: [startYear, startMonth].join('-'),
            incidentDateBefore: [year, endMonth].join('-'),
            type: []
        }

        this.state = {
            incidentDateAfter: this.INFO_SEARCH.incidentDateAfter,
            incidentDateBefore: this.INFO_SEARCH.incidentDateBefore,
            defaultStartMonth: [startMonth, startYear].join('-'),
            defaultEndMonth: [endMonth, year].join('-'),
            year: "false",
            type: [],
        }
    }

    setDataColumnChartForMonth = (type) => {
        const { translate, getIncidentData ,incidentAsset} = this.props;
        let category1 = [], count1 = ['Số lần'], yValue1 = [], max = []
        const maxVa = (a, b) => Math.max(a, b)
        if (incidentAsset.incidentChart) {
            incidentAsset.incidentChart.forEach(element => {
                if (type.length !== 0) {
                    let sumCate = 0
                    type.forEach(value => {
                        let index = element.idAssetTypeIncident.indexOf(value)
                        sumCate += element.countAssetcount[index]
                    })
                    category1.push(element.xType)
                    count1.push(sumCate)
                } else {
                    const reducer = (a, b) => a + b
                    category1.push(element.xType)
                    count1.push(element.countAssetcount.reduce(reducer))

                }
            })
        }
        let maxCout = count1.slice(1)

        let yMaxValue = count1.slice(1).reduce(maxVa, 0)

        for (let i = 0; i <= yMaxValue; i++) {
            yValue1.push(i)
        }

        let dataColumnChart = {
            category: category1,
            count: count1,
            yValues: yValue1
        };

        if (incidentAsset && dataColumnChart) {
            getIncidentData(dataColumnChart, type);
        }

        return dataColumnChart;
    }

    setDataColumnChartForYear = (type) => {
        const { translate, getIncidentData,incidentAsset } = this.props;
        let category1=[],count1=['Số lần'], yValue1=[] , max = []
        const maxVa = (a,b) =>  Math.max(a,b)
        if (incidentAsset.incidentChartYear){
            incidentAsset.incidentChartYear.forEach(element => {
                if (type.length !==0){
                    let sumCate = 0
                    type.forEach(value=>{
                        let index = element.idAssetTypeIncidentYear.indexOf(value)
                        sumCate += element.countAssetcountYear[index]
                        
                    })
                    category1.push(element.xType)
                    count1.push(sumCate)
                    
                }else{
                    const reducer = (a,b) => a+b
                    category1.push(element.xType)
                    count1.push(element.countAssetcountYear.reduce(reducer))
                   
                }
            })
        }
        let maxCout = count1.slice(1)
        
        let yMaxValue = count1.slice(1).reduce(maxVa,0)
       
       
       for (let i = 0; i <= yMaxValue; i++) {
           yValue1.push(i)
       }

        let dataColumnChart = {
            category: category1,
            count: count1,
            yValues: yValue1
        };

        if (dataColumnChart && incidentAsset) {
            getIncidentData(dataColumnChart, type);
        }
        return dataColumnChart;
    }

    columnChart = () => {
        const { translate, listAssets } = this.props;
        const { year, type } = this.state;
        let filterAsset = [];

        if (type && type.length) {
            listAssets.map(x => {
                if (x.assetType.length) {
                    for (let i in x.assetType) {
                        for (let j in type) {
                            type[j] === x.assetType[i]._id && filterAsset.push(x);
                        }
                    }
                }
            })
        }
        else {
            filterAsset = listAssets;
        }

        let dataColumnChart = year == "true" ? this.setDataColumnChartForYear(type) : this.setDataColumnChartForMonth(type);

        let chart = c3.generate({
            bindto: this.refs.assetIncidentChart,
            data: {
                columns: [
                    dataColumnChart.count,
                ],
                type: 'bar',
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    categories: dataColumnChart.category
                },
                y: {
                    tick: {
                        values: dataColumnChart.yValues
                    },
                    label: {
                        text: translate('asset.dashboard.time'),
                        position: 'outer-top'
                    }
                },

            },
            padding: {
                top: 20,
                bottom: 20
            },
            legend: {
                show: false
            }
        })
    }

    handleChangeDateAfter = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.incidentDateAfter = month;
    }

    handleChangeDateBefore = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.incidentDateBefore = month;
    }

    handleChangeTypeAsset = (value) => {
        if (value.length === 0) {
            value = []
        }
        this.INFO_SEARCH.type = value;
        this.setState(state => {
            return {
                ...state,
                type: value
            }
        })
        this.forceUpdate();
    }

    handleSearchData = async () => {
        let incidentDateAfter = new Date(this.INFO_SEARCH.incidentDateAfter);
        let incidentDateBefore = new Date(this.INFO_SEARCH.incidentDateBefore);

        if (incidentDateAfter.getTime() > incidentDateBefore.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            this.props.getAllAssetIncident({ name: "incident-date-data", endTimeIncident: incidentDateBefore, startTimeIncident: incidentDateAfter })
        }
    }

    handleChangeViewChart = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                year: value[0]
            }
        })
    }

    getAssetTypes = () => {
        let { assetType } = this.props;
        let typeArr = [];
        assetType && assetType.map(item => {
            typeArr.push({
                _id: item._id,
                id: item._id,
                name: item.typeName,
                parent: item.parent ? item.parent._id : null
            })
        })
        return typeArr;
    }

    render() {
        const { translate } = this.props;
        let { year, type } = this.state;
        let { incidentDateAfter, incidentDateBefore } = this.INFO_SEARCH;
        let typeArr = this.getAssetTypes();
        let dateFormat = year == "true" ? "year" : "month-year";
        let startValue = year == "true" ? incidentDateAfter.slice(0, 4) : incidentDateAfter.slice(5, 7) + ' - ' + incidentDateAfter.slice(0, 4);
        let endValue = year == "true" ? incidentDateBefore.slice(0, 4) : incidentDateBefore.slice(5, 7) + ' - ' + incidentDateBefore.slice(0, 4);

        this.columnChart();
        return (
            <React.Fragment>
                <div className="form-inline">

                    {/* Chọn hiển thị theo tháng/năm */}
                    <div className="form-group">
                        <label>{translate('asset.dashboard.statistic_by')}</label>
                        <SelectBox
                            id="selectTypeOfStatistic4"
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: false, text: `${translate('general.month')}` },
                                { value: true, text: `${translate('general.year')}` }
                            ]}
                            onChange={this.handleChangeViewChart}
                            value={year}
                            multiple={false}
                            options={{ minimumResultsForSearch: 3 }}
                        />
                    </div>

                    {/* Chọn loại tài sản */}
                    <div className="form-group">
                        <label >{translate('asset.general_information.asset_type')}</label>
                        <TreeSelect
                            data={typeArr}
                            value={type}
                            handleChange={this.handleChangeTypeAsset}
                            mode="hierarchical"
                        />
                    </div>
                </div>
                <div className="form-inline">
                    {/* Chọn ngày bắt đầu và kết thúc để tìm kiếm */}
                    <div className="form-group">
                        <label>{translate('task.task_management.from')}</label>
                        <DatePicker
                            id="incident_after"
                            dateFormat={dateFormat}
                            value={startValue}
                            onChange={this.handleChangeDateAfter}
                            disabled={false}
                        />
                    </div>

                    <div className="form-group">
                        <label>{translate('task.task_management.to')}</label>
                        <DatePicker
                            id="incident_before"
                            dateFormat={dateFormat}
                            value={endValue}
                            onChange={this.handleChangeDateBefore}
                            disabled={false}
                        />
                    </div>

                    {/* Tim kiem */}
                    <div className="form-group">
                        <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.search')}</button>
                    </div>
                </div>

                {/* Bieu do */}
                <div ref="assetIncidentChart"></div>

            </React.Fragment>
        )
    }
}
function mapState(state) {
    const { incidentAsset } = state.assetsManager;
    return { incidentAsset };
}

const mapDispatchToProps = {
    getAllAssetIncident: AssetManagerActions.getAllAssetIncident
}

const AssetIncidentChartConnect = connect(mapState, mapDispatchToProps)(withTranslate(AssetIncidentChart));
export { AssetIncidentChartConnect as AssetIncidentChart };