
import React, { Component } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';
import { LotActions } from '../../inventory-management/redux/actions';
import { StockActions } from '../../stock-management/redux/actions';
import { CategoryActions } from '../../../common-production/category-management/redux/actions';

class QuantityInventoryDashboard extends Component {
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
        this.props.getAllStocks({ managementLocation: this.state.currentRole });
        this.props.getCategoryToTree();
    }

    handleStockChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                stock: value
            }
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

    handleSubmitSearch = () => {
        let data = {
            stock: this.state.stock,
            category: this.state.category,
            type: this.state.type,
            managementLocation: this.state.currentRole,
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
    barChart = (name, inventory, goodReceipt, goodIssue) => {
        let chart = c3.generate({
            bindto: this.refs.quantityInventoryDashboard,
            data: {
                x : 'x',
                columns: [
                    name,
                    inventory,
                    goodReceipt,
                    goodIssue
                ],
                type: 'bar'
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
        });
    }

    render() {
        const { translate, lots, stocks, categories } = this.props;
        const { inventoryDashboard } = lots;
        const { listStocks } = stocks;
        const { categoryToTree } = categories;
        const dataCategory = this.getAllCategory();
        const { type, category } = this.state;

        let name = ['x'];
        let inventory = ['Số lượng tồn kho'];
        let goodReceipt = ['Số lượng sắp nhập'];
        let goodIssue = ['Số lượng sắp xuất'];
        if(inventoryDashboard.length > 0) {
            for(let i = 0; i < inventoryDashboard.length; i++) {
                name = [...name, inventoryDashboard[i].name];
                inventory = [...inventory, inventoryDashboard[i].inventory];
                goodReceipt = [...goodReceipt, inventoryDashboard[i].goodReceipt];
                goodIssue = [...goodIssue, inventoryDashboard[i].goodIssue];
            }
        }
        this.barChart(name, inventory, goodReceipt, goodIssue);
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng tồn kho của các mặt hàng
                        </h3>
                        <div className="box-body qlcv" >
                            <div className="form-inline">
                                <div className="form-group">
                                    <label>Kho</label>
                                    <SelectMulti
                                    id={`select-multi-stock-dashboard-inventory`}
                                    multiple="multiple"
                                    options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listStocks.map((x, index) => { return { value: x._id, text: x.name }})}
                                    onChange={this.handleStockChange}
                                />
                                </div>
                                <div className="form-group">
                                    <label>Loại hàng hóa</label>
                                    <SelectMulti
                                    id={`select-multi-type-dashboard-inventory`}
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
                            </div>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label>Danh mục</label>
                                    <TreeSelect 
                                        data={dataCategory} 
                                        value={category} 
                                        handleChange={this.handleCategoryChange} 
                                        mode="hierarchical" 
                                    />
                                </div>
                                <div className="form-group">
                                <label></label>
                                    <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSubmitSearch()} >{translate('general.search')}</button>
                                </div>
                            </div>
                        </div>
                        <div ref="quantityInventoryDashboard"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getInventoriesDashboard: LotActions.getInventoriesDashboard,
    getAllStocks: StockActions.getAllStocks,
    getCategoryToTree: CategoryActions.getCategoryToTree,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityInventoryDashboard));