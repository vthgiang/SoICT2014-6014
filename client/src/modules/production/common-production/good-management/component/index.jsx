import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { GoodActions } from "../redux/actions";
import { CategoryActions } from "../../category-management/redux/actions";
import { StockActions } from "../../../warehouse/stock-management/redux/actions";
import { DataTableSetting, DeleteNotification, PaginateBar, TreeSelect } from "../../../../../common-components";
import GoodCreateForm from "./goodCreateForm";
import GoodEditForm from "./goodEditForm";
import GoodDetailForm from "./goodDetailForm";

class GoodManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            page: 1,
            limit: 5,
            code: "",
            name: "",
            category: "",
            value: "",
            type: "",
            oldType: "",
            activeP: false,
            activeM: false,
            activeE: false,
            activeW: false,
        };
    }

    componentDidMount() {
        let { page, limit, type, currentRole } = this.state;
        this.props.getGoodsByType();
        this.props.getGoodsByType({ page, limit, type });
        this.props.getCategoryToTree();
        this.props.getAllStocks({ managementLocation: currentRole })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.oldType !== prevState.type) {
            nextProps.getGoodsByType({ page: prevState.page, limit: prevState.limit, type: prevState.type });
            return {
                oldType: prevState.type,
            };
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextPage) {
        if(!nextPage.type) {
            this.setType();
            return false;
        }
        return true;
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value,
            type: this.state.type,
        };
        this.props.getGoodsByType(data);
    };

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            key: this.state.option,
            value: this.state.value,
            type: this.state.type,
        };
        this.props.getGoodsByType(data);
    };

    setOption = (title, option) => {
        this.setState({
            [title]: option,
        });
    };

    handleEdit = async (goods) => {
        await this.setState((state) => {
            return {
                ...state,
                currentRow: goods,
            };
        });

        window.$("#modal-edit-goods").modal("show");
    };

    handleProduct = () => {
        let type = "product";
        let page = 1;
        this.setState({
            page: page,
            type: type,
            category: "",
        });
    };

    handleMaterial = () => {
        let type = "material";
        let page = 1;
        this.setState({
            page: page,
            type: type,
            category: "",
        });
    };

    handleEquipment = () => {
        let type = "equipment";
        let page = 1;
        this.setState({
            page: page,
            type: type,
            category: "",
        });
    };

    handleWaste = () => {
        let type = "waste";
        let page = 1;
        this.setState({
            page: page,
            type: type,
            category: "",
        });
    };

    handleCodeChange = async (e) => {
        const value = e.target.value;
        this.setState((state) => {
            return {
                ...state,
                code: value.trim(),
            };
        });
    };

    handleNameChange = async (e) => {
        const value = e.target.value;
        this.setState((state) => {
            return {
                ...state,
                name: value.trim(),
            };
        });
    };

    handleCategoryChange = (value) => {
        if (value.length === 0) {
            value = null;
        }

        this.setState({
            ...this.state,
            category: value,
        });
    };

    handleSubmitSearch = async () => {
        const data = {
            limit: this.state.limit,
            page: this.state.page,
            type: this.state.type,
            code: this.state.code,
            name: this.state.name,
            category: this.state.category,
        };
        await this.props.getGoodsByType(data);
    };

    handleEdit = async (goods) => {
        await this.setState((state) => {
            return {
                ...state,
                currentRow: goods,
            };
        });
        window.$("#modal-edit-good").modal("show");
    };

    handleShowDetailInfo = async (good) => {
        let id = good._id;
        this.props.getGoodDetail(id);
        await this.setState((state) => {
            return {
                ...state,
                currentRow: good,
            };
        });

        window.$("#modal-detail-good").modal("show");
    };

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

    checkManagementGood = (value) => {
        const { currentRole } = this.state;
        const { stocks } = this.props;
        const { listStocks } = stocks;
        let arrayType = [];
        if(listStocks && listStocks.length > 0) {
            for (let i = 0; i < listStocks.length; i++) {
                if(listStocks[i].managementLocation.length > 0) {
                    for(let j = 0; j < listStocks[i].managementLocation.length > 0; j++) {
                        if(listStocks[i].managementLocation[j].role._id === currentRole){
                            arrayType = arrayType.concat(listStocks[i].managementLocation[j].managementGood);
                        }
                    }
                }
            }
        }

        if(arrayType.includes(value)){
            return true;
        }

        return false;
    }

    setType = () => {
        if(this.checkManagementGood('product') || this.checkManagementGood('waste')){
            this.setState({ type: 'product', activeP: true});
        } else if(this.checkManagementGood('material')){
            this.setState({ type: 'material', activeM: true});
        } else if(this.checkManagementGood('equipment')){
            this.setState({ type: 'equipment', activeE: true });
        } else if(this.checkManagementGood('waste')){
            this.setState({ type: 'waste', activeW: true });
        }
    }

    render() {
        const { goods, categories, translate } = this.props;
        const { categoryToTree } = categories;
        const { type, category } = this.state;
        const { listPaginate, totalPages, page } = goods;
        const dataCategory = this.getAllCategory();
        let categorySearch = category ? category : [];

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    { (this.checkManagementGood('product') || this.checkManagementGood('waste')) && <li className={`${this.state.activeP ? "active" : ''}`}>
                        <a href="#good-products" data-toggle="tab" onClick={() => this.handleProduct()}>
                            {translate("manage_warehouse.good_management.product")}
                        </a>
                    </li>}
                    { this.checkManagementGood('material') && <li className={`${this.state.activeM ? "active" : ''}`}>
                        <a href="#good-materials" data-toggle="tab" onClick={this.handleMaterial}>
                            {translate("manage_warehouse.good_management.material")}
                        </a>
                    </li>}
                    { this.checkManagementGood('equipment') && <li className={`${this.state.activeE ? "active" : ''}`}>
                        <a href="#good-equipments" data-toggle="tab" onClick={() => this.handleEquipment()}>
                            {translate("manage_warehouse.good_management.equipment")}
                        </a>
                    </li>}
                    {/* { this.checkManagementGood('waste') && <li className={`${this.state.activeW ? "active" : ''}`}>
                        <a href="#good-wastes" data-toggle="tab" onClick={() => this.handleWaste()}>
                            {translate("manage_warehouse.good_management.waste")}
                        </a>
                    </li>} */}
                </ul>
                <div className="box-body qlcv">
                    <GoodCreateForm type={type} />
                    {this.state.currentRow && (
                        <GoodEditForm
                            goodId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            category={this.state.currentRow.category}
                            baseUnit={this.state.currentRow.baseUnit}
                            units={this.state.currentRow.units}
                            // packingRule={this.state.currentRow.packingRule}
                            materials={this.state.currentRow.materials}
                            description={this.state.currentRow.description}
                            manufacturingMills={this.state.currentRow.manufacturingMills}
                            pricePerBaseUnit={this.state.currentRow.pricePerBaseUnit}
                            salesPriceVariance={this.state.currentRow.salesPriceVariance}
                            numberExpirationDate={this.state.currentRow.numberExpirationDate}
                        />
                    )}

                    {this.state.currentRow && (
                        <GoodDetailForm
                            goodId={this.state.currentRow._id}
                            code={this.state.currentRow.code}
                            name={this.state.currentRow.name}
                            type={this.state.currentRow.type}
                            category={this.state.currentRow.category}
                            baseUnit={this.state.currentRow.baseUnit}
                            units={this.state.currentRow.units}
                            materials={this.state.currentRow.materials}
                            description={this.state.currentRow.description}
                            // packingRule={this.state.currentRow.packingRule}
                            manufacturingMills={this.state.currentRow.manufacturingMills}
                            pricePerBaseUnit={this.state.currentRow.pricePerBaseUnit}
                            salesPriceVariance={this.state.currentRow.salesPriceVariance}
                            numberExpirationDate={this.state.currentRow.numberExpirationDate}
                        />
                    )}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate("manage_warehouse.good_management.code")}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="code"
                                onChange={this.handleCodeChange}
                                placeholder={translate("manage_warehouse.good_management.code")}
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate("manage_warehouse.good_management.name")}</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                onChange={this.handleNameChange}
                                placeholder={translate("manage_warehouse.good_management.name")}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate("manage_warehouse.good_management.category")}</label>
                            <TreeSelect data={dataCategory} value={categorySearch} handleChange={this.handleCategoryChange} mode="hierarchical" />
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button
                                type="button"
                                className="btn btn-success"
                                title={translate("manage_warehouse.good_management.search")}
                                onClick={this.handleSubmitSearch}
                            >
                                {translate("manage_warehouse.good_management.search")}
                            </button>
                        </div>
                    </div>

                    <table id={`good-table-${type}`} className="table table-striped table-bordered table-hover" style={{ marginTop: "15px" }}>
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>{translate("manage_warehouse.good_management.index")}</th>
                                <th>{translate("manage_warehouse.good_management.code")}</th>
                                <th>{translate("manage_warehouse.good_management.name")}</th>
                                <th>{translate("manage_warehouse.good_management.category")}</th>
                                <th>{translate("manage_warehouse.good_management.unit")}</th>
                                {/* <th>{translate("manage_warehouse.good_management.packing_rule")}</th> */}
                                {type === "product" && <th>{translate("manage_warehouse.good_management.materials")}</th>}
                                <th>{translate("manage_warehouse.good_management.description")}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>
                                    {translate("table.action")}
                                    <DataTableSetting
                                        tableId={`good-table-${type}`}
                                        columnArr={[
                                            translate("manage_warehouse.good_management.index"),
                                            translate("manage_warehouse.good_management.code"),
                                            translate("manage_warehouse.good_management.name"),
                                            translate("manage_warehouse.good_management.category"),
                                            translate("manage_warehouse.good_management.unit"),
                                            // translate("manage_warehouse.good_management.packing_rule"),
                                            type === "product" ? translate("manage_warehouse.good_management.materials") : [],
                                            translate("manage_warehouse.good_management.description"),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {typeof listPaginate !== undefined &&
                                listPaginate.length !== 0 &&
                                listPaginate.map((x, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{x.code}</td>
                                        <td>{x.name}</td>
                                        <td>
                                            {x.category &&
                                                categoryToTree.list.length &&
                                                categoryToTree.list.filter((item) => item._id === x.category).pop()
                                                ? categoryToTree.list.filter((item) => item._id === x.category).pop().name
                                                : ""}
                                        </td>
                                        <td>{x.baseUnit}</td>
                                        <td>{
                                            type === "product" && x.materials.length > 0 &&
                                            x.materials.map((y, i)  => {
                                                if(x.materials.length === i + 1){
                                                    return y.good.name
                                                }
                                                return y.good.name + ", "
                                            })
                                        }</td>
                                        <td>{x.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleShowDetailInfo(x)}>
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            <a onClick={() => this.handleEdit(x)} href={`#${x._id}`} className="text-yellow">
                                                <i className="material-icons">edit</i>
                                            </a>
                                            <DeleteNotification
                                                content={translate("manage_warehouse.good_management.delete_info")}
                                                data={{
                                                    id: x._id,
                                                    info: x.code + " - " + x.name,
                                                }}
                                                func={this.props.deleteGood}
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {goods.isLoading ? (
                        <div className="table-info-panel">{translate("confirm.loading")}</div>
                    ) : (
                            (typeof listPaginate === "undefined" || listPaginate.length === 0) && (
                                <div className="table-info-panel">{translate("confirm.no_data")}</div>
                            )
                        )}
                    <PaginateBar pageTotal={totalPages} currentPage={page} func={this.setPage} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { goods, categories, stocks } = state;
    return { goods, categories, stocks };
}

const mapDispatchToProps = {
    getGoodsByType: GoodActions.getGoodsByType,
    getCategoryToTree: CategoryActions.getCategoryToTree,
    deleteGood: GoodActions.deleteGood,
    getGoodDetail: GoodActions.getGoodDetail,
    getAllStocks: StockActions.getAllStocks
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodManagement));
