
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';
import { LotActions } from '../../inventory-management/redux/actions';
import { StockActions } from '../../stock-management/redux/actions';
import { CategoryActions } from '../../../common-production/category-management/redux/actions';

function QuantityInventoryDashboard(props) {
    const [state, setState] = useState({
        barChart: true,
        type: 'product',
        currentRole: localStorage.getItem("currentRole"),
        category: []
    })

    const refBarChart = React.createRef();

    useEffect(() => {
        const { type } = state;
        props.getInventoriesDashboard({ type, managementLocation: state.currentRole });
        props.getAllStocks({ managementLocation: state.currentRole });
        props.getCategoryToTree();
    }, [])

    const handleStockChange = (value) => {
        setState({
            ...state,
            stock: value
        })
    }

    const handleCategoryChange = (value) => {
        setState({
            ...state,
            category: value
        })
    };

    const handleTypeChange = (value) => {
        setState({
            ...state,
            type: value
        })
    }

    const handleSubmitSearch = () => {
        let data = {
            stock: state.stock,
            category: state.category,
            type: state.type,
            managementLocation: state.currentRole,
        }
        props.getInventoriesDashboard(data);
    }

    const getAllCategory = () => {
        let { categories } = props;
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
    const barChart = (name, inventory, goodReceipt, goodIssue) => {
        let chart = c3.generate({
            bindto: refBarChart.current,
            data: {
                columns: [
                    inventory,
                    goodReceipt,
                    goodIssue
                ],
                type: 'bar',
                labels: true,
            },
            padding: {
                bottom: 20,
                right: 20
            },
            axis: {
                x: {
                    type: 'category',
                    categories: name,
                    tick: {
                        multiline: false
                    },
                    height: 100
                },
                y: {
                    label: {
                        text: "Số lượng",
                        position: 'outer-right'
                    }
                },
                rotated: true
            },
            size: {
                height: 500
            },

            legend: {
                show: false
            },
        });
    }

    const { translate, lots, stocks, categories } = props;
    const { inventoryDashboard } = lots;
    const { listStocks } = stocks;
    const { categoryToTree } = categories;
    const dataCategory = getAllCategory();
    const { type, category } = state;

    let name = [];
    let inventory = ['Số lượng tồn kho'];
    let goodReceipt = ['Số lượng sắp nhập'];
    let goodIssue = ['Số lượng sắp xuất'];
    if (inventoryDashboard.length > 0) {
        for (let i = 0; i < inventoryDashboard.length; i++) {
            name = [...name, inventoryDashboard[i].name];
            inventory = [...inventory, inventoryDashboard[i].inventory];
            goodReceipt = [...goodReceipt, inventoryDashboard[i].goodReceipt];
            goodIssue = [...goodIssue, inventoryDashboard[i].goodIssue];
        }
    }
    barChart(name, inventory, goodReceipt, goodIssue);
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
                                    items={listStocks.map((x, index) => { return { value: x._id, text: x.name } })}
                                    onChange={handleStockChange}
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
                                        { value: 'product', text: 'Sản phẩm' },
                                        { value: 'material', text: 'Nguyên vật liệu' },
                                    ]}
                                    onChange={handleTypeChange}
                                />
                            </div>
                        </div>
                        <div className="form-inline">
                            <div className="form-group">
                                <label>Danh mục</label>
                                <TreeSelect
                                    data={dataCategory}
                                    value={category}
                                    handleChange={handleCategoryChange}
                                    mode="hierarchical"
                                />
                            </div>
                            <div className="form-group">
                                <label></label>
                                <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSubmitSearch()} >{translate('general.search')}</button>
                            </div>
                        </div>
                    </div>
                    <div ref={refBarChart}></div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getInventoriesDashboard: LotActions.getInventoriesDashboard,
    getAllStocks: StockActions.getAllStocks,
    getCategoryToTree: CategoryActions.getCategoryToTree,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityInventoryDashboard));