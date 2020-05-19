import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
// import { RecommendDistributeCreateForm } from './RecommendDistributeCreateForm';
import { RecommendDistributeManagerEditForm } from './RecommendDistributeManagerEditForm';
import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';
// import { RecommendDistributeActions } from '../../recommend-procure/redux/actions';

class RecommendDistributeManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            month: "",
            status: null,
            page: 0,
            limit: 5,
        }
        this.handleSunmitSearch = this.handleSunmitSearch.bind(this);
    }
    componentDidMount() {
        // this.props.searchRecommendDistributes(this.state);
    }
    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-recommenddistributemanage').modal('show');
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    // Function lưu giá trị mã nhân viên vào state khi thay đổi
    handleRecommendNumberChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function bắt sự kiện tìm kiếm 
    handleSunmitSearch = async () => {
        if (this.state.month === "") {
            await this.setState({
                month: this.formatDate(Date.now())
            })
        }
        // this.props.searchRecommendDistributes(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        // this.props.searchRecommendDistributes(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        // this.props.searchRecommendDistributes(this.state);
    }

    render() {
        const { translate, recommendDistribute } = this.props;
        var listRecommendDistributes = "";

        if (this.props.recommendDistribute.isLoading === false) {
            listRecommendDistributes = this.props.recommendDistribute.listRecommendDistributes;
        }
        var pageTotal = ((this.props.recommendDistribute.totalList % this.state.limit) === 0) ?
            parseInt(this.props.recommendDistribute.totalList / this.state.limit) :
            parseInt((this.props.recommendDistribute.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box" >
                <div className="box-body qlcv">
                    {/* <RecommendDistributeCreateForm /> */}
                    <div className="form-group">
                        <h4 className="box-title">Danh sách phiếu đề nghị cấp phát thiết bị: </h4>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu:</label>
                            <input type="text" className="form-control" name="recommendNumber" onChange={this.handleRecommendNumberChange} placeholder="Mã phiếu" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />

                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "Đã chấp nhận", text: "Đã chấp nhận" },
                                    { value: "Chờ phê duyệt", text: "Chờ phê duyệt" },
                                    { value: "Không chấp nhận", text: "Không chấp nhận" }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSunmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="recommenddistributemanage-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                            <th style={{ width: "10%" }}>Mã phiếu</th>
                                <th style={{ width: "15%" }}>Ngày lập</th>
                                <th style={{ width: "15%" }}>Người đề nghị</th>
                                <th style={{ width: "17%" }}>Mã tài sản</th>
                                <th style={{ width: "15%" }}>Tên tài sản</th>
                                {/* <th style={{ width: "17%" }}>Loại tài sản</th> */}
                                <th style={{ width: "17%" }}>Thời gian đăng ký sử dụng từ ngày</th>
                                <th style={{ width: "17%" }}>Thời gian đăng ký sử dụng đến ngày</th>
                                <th style={{ width: "17%" }}>Người phê duyệt</th>
                                {/* <th style={{ width: "17%" }}>Ghi chú</th> */}
                                <th style={{ width: "11%" }}>Trạng thái</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                    <DataTableSetting
                                        tableId="recommenddistributemanage-table"
                                        columnArr={[
                                            "Mã phiếu",
                                            "Ngày lập",
                                            "Người đề nghị",
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Thời gian đăng ký sử dụng từ ngày",
                                            "Thời gian đăng ký sử dụng đến ngày",
                                            // "Loại tài sản",
                                            "Người phê duyệt",
                                            // "Ghi chú",
                                            "Trạng thái",
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listRecommendDistributes !== 'undefined' && listRecommendDistributes.length !== 0) &&
                                listRecommendDistributes.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.recommendNumber}</td>
                                        <td>{x.dateCreate}</td>
                                        <td>{x.proponent}</td>
                                        <td>{x.assetNumber}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.dateStartUse}</td>
                                        <td>{x.dateEndUse}</td>
                                        <td>{x.approver}</td>
                                        {/* <td>{x.note}</td> */}
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Cập nhật thông tin phiếu đề nghị"><i className="material-icons">edit</i></a>

                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {recommendDistribute.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listRecommendDistributes === 'undefined' || listRecommendDistributes.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                
                {
                    this.state.currentRow !== undefined &&
                    <RecommendDistributeManagerEditForm
                    _id={this.state.currentRow._id}
                    recommendNumber={this.state.currentRow.recommendNumber}
                    dateCreate={this.state.currentRow.dateCreate}
                    proponent={this.state.currentRow.proponent}
                    positionProponent={this.state.currentRow.positionProponent}
                    reqContent={this.state.currentRow.reqContent}
                    assetNumber={this.state.currentRow.assetNumber}
                    assetName={this.state.currentRow.assetName}
                    dateStartUse={this.state.currentRow.dateStartUse}
                    dateEndUse={this.state.currentRow.dateEndUse}
                    approver={this.state.currentRow.approver} 
                    positionApprover={this.state.currentRow.positionApprover} 
                    status={this.state.currentRow.status}
                    note={this.state.currentRow.note}
                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { recommendDistribute } = state;
    return { recommendDistribute };
};

const actionCreators = {
    // searchRecommendProcures: RecommendProcureActions.searchRecommendProcures,
    // deleteRecommendProcure: RecommendProcureActions.deleteRecommendProcure,
};

const connectedListRecommendDistributeManager = connect(mapState, actionCreators)(withTranslate(RecommendDistributeManager));
export { connectedListRecommendDistributeManager as RecommendDistributeManager };