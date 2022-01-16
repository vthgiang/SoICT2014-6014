import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import isEqual from 'lodash/isEqual';
import { SuppliesActions } from '../../supplies/redux/actions';
import { SuppliesDashboardActions } from '../redux/actions';
import Swal from 'sweetalert2';
import { DatePicker, SelectBox } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { SuppliesDashboardService } from '../redux/service';
class SuppliesDashboard extends Component {

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
            typeOfChart: ["Bar"],
            purchaseDateAfter: [startYear, startMonth].join('-'),
            purchaseDateBefore: [year, endMonth].join('-'),
        }

        const defaultConfig = { limit: 10 }
        this.dashboardSuppliesId = "dashboard_asset_by_type";
        const dashboardSupplies = getTableConfiguration(this.dashboardSuppliesId, defaultConfig).limit;

        this.state = {
            suppliesData: [],
            countInvoice: [],
            countAllocation: [],
            valueInvoice: [],

            purchaseDateAfter: this.INFO_SEARCH.purchaseDateAfter,
            purchaseDateBefore: this.INFO_SEARCH.purchaseDateBefore,
            defaultStartMonth: [startMonth, startYear].join('-'),
            defaultEndMonth: [endMonth, year].join('-'),

            page: 1,
            limit: dashboardSupplies,
            listSupplies: [],
        }


    }

    componentDidMount() {
        SuppliesDashboardService.getSuppliesDashboard().then(res => {
            if (res.data.success) {
                this.setState({
                    ...this.state,
                    suppliesData: this.props.suppliesDashboardReducer.suppliesData,
                    countAllocation: this.props.suppliesDashboardReducer.countAllocation,
                    countInvoice: this.props.suppliesDashboardReducer.countInvoice,
                    valueInvoice: this.props.suppliesDashboardReducer.valueInvoice,
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    handleChangeSupplies = (value) => {
        this.setState(state => {
            return {
                ...state,
                listSupplies: value,
            }
        })
        console.log("type", JSON.stringify(value));
    }

    handleSelectSuppliesOfDisplay = async (value) => {
        this.INFO_SEARCH.displayBy = value
    }

    handlePaginationSupplies = (page) => {
        const { limit } = this.state;
        let pageConvert = (page - 1) * (limit);

        this.setState({
            ...this.state,
            page: parseInt(pageConvert),
        })
    }

    handleChangeDateAfter = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.purchaseDateAfter = month;
    }

    handleChangeDateBefore = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.purchaseDateBefore = month;
    }

    handleSearchData = async () => {
        let purchaseDateAfter = new Date(this.INFO_SEARCH.purchaseDateAfter);
        let purchaseDateBefore = new Date(this.INFO_SEARCH.purchaseDateBefore);

        if (purchaseDateAfter.getTime() > purchaseDateBefore.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            this.props.getSuppliesDashboard({ name: "purchase-date-data", endTime: purchaseDateBefore, startTime: purchaseDateAfter })
        }
    }

    setCountInvoice = (value) => {
        let { countInvoice } = this.state;

        if (!isEqual(countInvoice, value)) {
            this.setState(state => {
                return {
                    ...state,
                    countInvoice: value,
                }
            })
        }
    }

    setCountAllocation = (value) => {
        let { countAllocation } = this.state;

        if (!isEqual(countAllocation, value)) {
            this.setState(state => {
                return {
                    ...state,
                    countAllocation: value,
                }
            })
        }
    }

    setValueInvoice = (value) => {
        let { valueInvoice } = this.state;

        if (!isEqual(valueInvoice, value)) {
            this.setState(state => {
                return {
                    ...state,
                    valueInvoice: value,
                }
            })
        }
    }

    render() {
        const { translate } = this.props;
        let { year, listSupplies, suppliesData, countInvoiceState, countAllocationState, valueInvoiceState } = this.state;
        let { purchaseDateAfter, purchaseDateBefore } = this.INFO_SEARCH;

        let format = year == "true" ? "year" : "month-year";
        let startValue = year == "true" ? purchaseDateAfter.slice(0, 4) : purchaseDateAfter.slice(5, 7) + ' - ' + purchaseDateAfter.slice(0, 4);
        let endValue = year == "true" ? purchaseDateBefore.slice(0, 4) : purchaseDateBefore.slice(5, 7) + ' - ' + purchaseDateBefore.slice(0, 4);

        let listSuppliesAmount = {}
        if (this.state.listSupplies.length !== 0) {
            let countInvoice = [], countAllocation = [], valueInvoice = [], idSupplies = [], shortName = [], listSuppliesData = []
            this.state.listSupplies.forEach(element => {
                let index = suppliesData.findIndex(value => value._id === element)
                countInvoice = [...countInvoice, countInvoiceState[index]]
                countAllocation = [...countAllocation, countAllocationState[index]]
                valueInvoice = [...valueInvoice, valueInvoiceState[index]]
                idSupplies = [...idSupplies, suppliesData[index]._id]
                shortName = [...shortName, suppliesData[index].suppliesName]
                listSuppliesData = [...listSuppliesData, suppliesData[index]]
            });
            listSuppliesAmount = {
                countInvoice: countInvoice,
                countAllocation: countAllocation,
                valueInvoice: valueInvoice,
                idSupplies: idSupplies,
                shortName: shortName,
                listSuppliesData: listSuppliesData,
            }
        } else {
            listSuppliesAmount = {
                countInvoice: this.state.countInvoice,
                countAllocation: this.state.countAllocation,
                valueInvoice: this.state.valueInvoice,
                idSupplies: this.state.suppliesData.map(x => {
                    return x._id;
                }),
                shortName: this.state.suppliesData.map(x => {
                    return x.suppliesName;
                }),
                listSuppliesData: this.state.suppliesData,
            }
        }
        return (
            <React.Fragment>
                <div className='qlcv'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className="form-inline">
                                {/* Chọn hiển thị theo tháng/năm */}
                                <div className="form-group">
                                    <label>{translate('asset.dashboard.statistic_by')}</label>
                                    <SelectBox
                                        id="selectSuppliesOfStatistic2"
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={suppliesData.map(x => {
                                            return { value: x._id, text: x.suppliesName }
                                        })}
                                        onChange={this.handleChangeSupplies}
                                        value={listSupplies}
                                        multiple={true}
                                    />
                                </div>
                            </div>

                            <div className="form-inline">
                                <div className="form-group">
                                    <label >{translate('task.task_management.from')}</label>
                                    <DatePicker
                                        id={`purchase_after${year}`}
                                        dateFormat={format}
                                        value={startValue}
                                        onChange={this.handleChangeDateAfter}
                                        disabled={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <label >{translate('task.task_management.to')}</label>
                                    <DatePicker
                                        id={`purchase_before${year}`}
                                        dateFormat={format}
                                        value={endValue}
                                        onChange={this.handleChangeDateBefore}
                                        disabled={false}
                                    />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.search')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}
function mapState(state) {
    const { suppliesData, countInvoice, countAllocation, valueInvoice } = state.suppliesDashboardReducer;
    const { suppliesReducer, suppliesDashboardReducer } = state;
    return { suppliesData, countInvoice, countAllocation, valueInvoice, suppliesReducer, suppliesDashboardReducer };
}

const mapDispatchToProps = {
    searchSupplies: SuppliesActions.searchSupplies,
    getSuppliesDashboard: SuppliesDashboardActions.getSuppliesDashboard,
}

const dashboardSuppliesConnect = connect(mapState, mapDispatchToProps)(withTranslate(SuppliesDashboard));
export { dashboardSuppliesConnect as SuppliesDashboard };