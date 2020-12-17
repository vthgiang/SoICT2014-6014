import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SlaActions } from "../redux/actions";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { PaginateBar, DataTableSetting, SelectBox, DeleteNotification, ConfirmNotification } from "../../../../../common-components";
import SlaCreateForm from "./slaCreateForm";
import SlaEditForm from "./slaEditForm";
import SlaDetailForm from "./slaDetailForm";

class SLAMangementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            code: "",
            title: "",
            status: true,
            slaDetail: {},
        };
    }

    componentDidMount() {
        const { page, limit, status } = this.state;
        this.props.getAllSLAs({ page, limit, status });
        this.props.getAllGoodsByType({ type: "product" });
    }

    setPage = async (page) => {
        await this.setState({
            page: page,
        });
        const data = {
            limit: this.state.limit,
            page: page,
            status: this.state.status,
        };
        this.props.getAllSLAs(data);
    };

    setLimit = async (limit) => {
        await this.setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page: this.state.page,
            status: this.state.status,
        };
        this.props.getAllSLAs(data);
    };

    handleCodeChange = (e) => {
        this.setState({
            code: e.target.value,
        });
    };

    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value,
        });
    };
    handleStatusChange = (value) => {
        if (value[0] === "all") {
            this.setState({
                status: undefined,
            });
        } else {
            this.setState({
                status: value[0],
            });
        }
    };

    handleSubmitSearch = () => {
        const { page, limit, code, title, status } = this.state;
        const data = {
            limit: limit,
            page: page,
            code: code,
            title: title,
            status: status,
        };
        this.props.getAllSLAs(data);
    };

    handleEditSla = async (item) => {
        await this.setState((state) => {
            return {
                ...state,
                currentRow: item,
            };
        });
        window.$("#modal-edit-sla").modal("show");
    };

    handleShowDetailSLA = async (slaDetail) => {
        this.setState((state) => {
            return {
                ...state,
                slaDetail: slaDetail,
            };
        });
        window.$("#modal-detail-sla").modal("show");
    };

    deleteSLA = (code) => {
        this.props.deleteSLA({ code });
    };

    disableSLA = (id) => {
        this.props.disableSLA(id);
    };

    render() {
        const { translate } = this.props;
        const { serviceLevelAgreements } = this.props;
        const { totalPages, page, listSLAs } = serviceLevelAgreements;
        const { code, title, currentRow, slaDetail } = this.state;
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    {slaDetail ? <SlaDetailForm slaDetail={slaDetail} /> : ""}
                    <SlaCreateForm />
                    {currentRow ? <SlaEditForm slaEdit={currentRow} /> : ""}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{"Mã"} </label>
                            <input type="text" className="form-control" value={code} onChange={this.handleCodeChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{"Tiêu đề"} </label>
                            <input type="text" className="form-control" value={title} onChange={this.handleTitleChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Trạng thái đơn</label>
                            <SelectBox
                                id={`select-filter-status-slas`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: true, text: "Đang hiệu lực" },
                                    { value: false, text: "Hết hiệu lực" },
                                    { value: "all", text: "Tất cả" },
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-success"
                                title={translate("manage_order.tax.search")}
                                onClick={this.handleSubmitSearch}
                            >
                                {translate("manage_order.tax.search")}
                            </button>
                        </div>
                    </div>
                    <table id="tax-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã cam kết</th>
                                <th>Tiêu đề</th>
                                <th>Trạng thái</th>
                                <th
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                    }}
                                >
                                    Hành động
                                    <DataTableSetting
                                        tableId="tax-table"
                                        columnArr={["STT", "Mã cam kết", "Tiêu đề", "Trạng thái"]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listSLAs &&
                                listSLAs.length !== 0 &&
                                listSLAs.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.code}</td>
                                        <td>{item.title}</td>
                                        <td>
                                            <center>
                                                {item.status ? (
                                                    <ConfirmNotification
                                                        icon="domain_verification"
                                                        name="domain_verification"
                                                        className="text-success"
                                                        title={"Click để thay đổi trạng thái"}
                                                        content={`<h4>Bỏ kích hoạt cam kết này</h4>
                                                        <br/> <h5>Điều đó đồng ghĩa với việc cam kết này sẽ không còn được áp dụng vào các đơn hàng</h5>
                                                        <h5>Tuy nhiên các dữ liệu đơn hàng liên quan đến cam kết này trước đó không bị ảnh hưởng và bạn có thể kích hoạt lại nó</h5?`}
                                                        func={() => this.disableSLA(item._id)}
                                                    />
                                                ) : (
                                                    <ConfirmNotification
                                                        icon="disabled_by_default"
                                                        name="disabled_by_default"
                                                        className="text-red"
                                                        title={"Click để thay đổi trạng thái"}
                                                        content={`<h4>Kích hoạt cam kết này</h4>
                                                    <br/> <h5>Cam kết này có thể áp dụng vào các đơn hàng nếu được kích hoạt trở lại</h5>`}
                                                        func={() => this.disableSLA(item._id)}
                                                    />
                                                )}
                                            </center>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                style={{ width: "5px" }}
                                                title={"Xem chi tiết"}
                                                onClick={() => {
                                                    this.handleShowDetailSLA(item);
                                                }}
                                            >
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            {item.status ? (
                                                <a
                                                    className="edit text-yellow"
                                                    style={{ width: "5px" }}
                                                    title={"Sửa thông tin"}
                                                    onClick={() => {
                                                        this.handleEditSla(item);
                                                    }}
                                                >
                                                    <i className="material-icons">edit</i>
                                                </a>
                                            ) : (
                                                ""
                                            )}
                                            <DeleteNotification
                                                content={"Bạn có chắc chắn muốn xóa cam kết này"}
                                                data={{
                                                    id: item._id,
                                                    info: item.title,
                                                }}
                                                func={() => this.deleteSLA(item.code)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {serviceLevelAgreements.isLoading ? (
                        <div className="table-info-panel">{translate("confirm.loading")}</div>
                    ) : (
                        (typeof listSLAs === "undefined" || listSLAs.length === 0) && (
                            <div className="table-info-panel">{translate("confirm.no_data")}</div>
                        )
                    )}
                    <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { serviceLevelAgreements } = state;
    return { serviceLevelAgreements };
}

const mapDispatchToProps = {
    getAllSLAs: SlaActions.getAllSLAs,
    disableSLA: SlaActions.disableSLA,
    deleteSLA: SlaActions.deleteSLA,
    getAllGoodsByType: GoodActions.getAllGoodsByType,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SLAMangementTable));
