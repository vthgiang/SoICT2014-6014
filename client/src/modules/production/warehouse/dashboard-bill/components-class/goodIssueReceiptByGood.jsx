
import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';
import { CategoryActions } from '../../../common-production/category-management/redux/actions';
import { LotActions } from '../../inventory-management/redux/actions';

class GoodIssueReceiptByGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true,
            type: 'product',
            currentRole: localStorage.getItem("currentRole"),
            category: []
        }
    }

    componentDidMount() {
        const { type } = this.state;
        this.props.getInventoriesDashboard({ type, managementLocation: this.state.currentRole });
        this.props.getCategoryToTree();
    }

    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            barChart: value
        })
    }

    handleCategoryChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                category: value
            }
        })
    };

    handleTypeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                type: value
            }
        })
    }

    handleChangeStartDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                startDate: value
            }
        });
    }

    handleChangeEndDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                endDate: value
            }
        });
    }

    handleSubmitSearch = () => {
        let data = {
            category: this.state.category,
            type: this.state.type,
            managementLocation: this.state.currentRole,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        }
        this.props.getInventoriesDashboard(data);
    }

    getAllCategory = () => {
        let { categories } = this.props;
        let categoryArr = [];
        if (categories.categoryToTree.list.length > 0) {
            categories.categoryToTree.list.map((item) => {
                categoryArr.push({
                    _id: item._id,
                    id: item._id,
                    state: { open: true },
                    name: item.name,
                    parent: item.parent ? item.parent.toString() : null,
                });
            });
        }
        return categoryArr;
    };

    // Khởi tạo BarChart bằng C3
    barAndChart = (name, inventory, goodReceipted, goodIssued) => {
        const { barChart } = this.state;
        let chart = c3.generate({
            bindto: this.refs.goodIssueReceipt,
            data: {
                x : 'x',
                columns: [
                    name,
                    inventory,
                    goodReceipted,
                    goodIssued
                ],
                type: barChart ? 'bar' : 'line',
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
            }
        });
    }

    render() {
        let { translate, lots } = this.props;
        const { inventoryDashboard } = lots;
        const dataCategory = this.getAllCategory();
        const { type, category, startDate, endDate} = this.state;

        let name = ['x'];
        let inventory = ['Tồn kho'];
        let goodReceipted = ['Nhập kho'];
        let goodIssued = ['Xuất kho'];
        if(inventoryDashboard.length > 0) {
            for(let i = 0; i < inventoryDashboard.length; i++) {
                name = [...name, inventoryDashboard[i].name];
                inventory = [...inventory, inventoryDashboard[i].inventory];
                goodReceipted = [...goodReceipted, inventoryDashboard[i].goodReceipted];
                goodIssued = [...goodIssued, inventoryDashboard[i].goodIssued];
            }
        }
        this.barAndChart(name, inventory, goodReceipted, goodIssued);
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng xuất, nhập, tồn trong tất cả các kho
                        </h3>
                        <div className="box-body qlcv" >
                            <div className="form-inline">
                                <div className="form-group">
                                        <label>Loại hàng hóa</label>
                                        <SelectMulti
                                        id={`select-multi-type-dashboard-bill`}
                                        multiple="multiple"
                                        options={{ nonSelectedText: "Loại hàng hóa", allSelectedText: "Chọn tất cả" }}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[
                                            { value: 'product', text: 'Sản phẩm'},
                                            { value: 'material', text: 'Nguyên vật liệu'},
                                        ]}
                                        onChange={this.handleTypeChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Danh mục</label>
                                    <TreeSelect 
                                        data={dataCategory} 
                                        value={category} 
                                        handleChange={this.handleCategoryChange} 
                                        mode="hierarchical" 
                                    />
                                </div>
                            </div>
                            <div className="form-inline">
                                <div className="form-group">
                                        <label className="form-control-static">Từ ngày</label>
                                        <DatePicker
                                            id="purchase-month-bill-dashboard-start"
                                            dateFormat="month-year"
                                            value={startDate}
                                            onChange={this.handleChangeStartDate}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-static">Đến ngày</label>
                                        <DatePicker
                                            id="purchase-month-bill-dashboard-end"
                                            dateFormat="month-year"
                                            value={endDate}
                                            onChange={this.handleChangeEndDate}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                                    </div>
                                </div>
                            </div>
                        
                        <div ref="goodIssueReceipt"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getCategoryToTree: CategoryActions.getCategoryToTree,
    getInventoriesDashboard: LotActions.getInventoriesDashboard,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodIssueReceiptByGood));