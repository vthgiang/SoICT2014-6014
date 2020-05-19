import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RecommendProcureCreateForm } from './RecommendProcureCreateForm';
import { RecommendProcureDetailForm } from './RecommendProcureDetailForm';
import { RecommendProcureEditForm } from './RecommendProcureEditForm';
import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';
import { RecommendProcureActions } from '../redux/actions';

class RecommendProcure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            month: "",
            status: "Chờ phê duyệt",
            page: 0,
            limit: 5,
        }
        this.handleSunmitSearch = this.handleSunmitSearch.bind(this);
    }
    componentDidMount() {
        this.props.searchRecommendProcures(this.state);
    }

    // Bắt sự kiện click chỉnh sửa thông tin nghỉ phép
    handleView = async (value) => {
        await this.setState(state => {
            return {
                currentRowView: value
            }
        });
        window.$('#modal-view-recommendprocure').modal('show');
    }
    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-recommendprocure').modal('show');
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
        this.props.searchRecommendProcures(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.searchRecommendProcures(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.searchRecommendProcures(this.state);
    }

    render() {
        const { translate, recommendProcure } = this.props;
        var listRecommendProcures = "";

        if (this.props.recommendProcure.isLoading === false) {
            listRecommendProcures = this.props.recommendProcure.listRecommendProcures;
        }
        var pageTotal = ((this.props.recommendProcure.totalList % this.state.limit) === 0) ?
            parseInt(this.props.recommendProcure.totalList / this.state.limit) :
            parseInt((this.props.recommendProcure.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box" >
                <div className="box-body qlcv">
                    <RecommendProcureCreateForm />
                    <div className="form-group">
                        <h4 className="box-title">Danh sách phiếu đề nghị mua sắm thiết bị: </h4>
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
                    <table id="recommendprocure-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>Mã phiếu</th>
                                <th style={{ width: "15%" }}>Ngày lập</th>
                                <th style={{ width: "15%" }}>Người đề nghị</th>
                                <th style={{ width: "17%" }}>Thiết bị đề nghị mua sắm</th>
                                <th style={{ width: "15%" }}>Người phê duyệt</th>
                                <th style={{ width: "17%" }}>Ghi chú</th>
                                <th style={{ width: "11%" }}>Trạng thái</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                    <DataTableSetting
                                        tableId="recommendprocure-table"
                                        columnArr={[
                                            "Mã phiếu",
                                            "Ngày lập",
                                            "Người đề nghị",
                                            "Thiết bị đề nghị mua sắm",
                                            "Người phê duyệt",
                                            "Ghi chú",
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
                            {(typeof listRecommendProcures !== 'undefined' && listRecommendProcures.length !== 0) &&
                                listRecommendProcures.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.recommendNumber}</td>
                                        <td>{x.dateCreate}</td>
                                        <td>{x.proponent}</td>
                                        <td>{x.equipment}</td>
                                        <td>{x.approver}</td>
                                        <td>{x.note}</td>
                                        <td>{x.status}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title="xem thông tin Phiếu đề nghị mua sắm"><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin phiếu đề nghị mua sắm"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa thông tin phiếu"
                                                data={{
                                                    id: x._id,
                                                    info: x.recommendNumber + " - " + x.dateCreate.replace(/-/gi, "/")
                                                }}
                                                func={this.props.deleteRecommendProcure}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {recommendProcure.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listRecommendProcures === 'undefined' || listRecommendProcures.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                
                {
                    this.state.currentRowView !== undefined &&
                    <RecommendProcureDetailForm
                        _id={this.state.currentRowView._id}
                        recommendNumber={this.state.currentRowView.recommendNumber}
                        dateCreate={this.state.currentRowView.dateCreate}
                        proponent={this.state.currentRowView.proponent}
                        equipment={this.state.currentRowView.equipment}
                        supplier={this.state.currentRowView.supplier}
                        total={this.state.currentRowView.total} 
                        unit={this.state.currentRowView.unit} 
                        estimatePrice={this.state.currentRowView.estimatePrice} 
                        approver={this.state.currentRowView.approver} 
                        note={this.state.currentRowView.note} 
                        status={this.state.currentRowView.status}
                    />
                }
                {
                    this.state.currentRow !== undefined &&
                    <RecommendProcureEditForm
                        _id={this.state.currentRow._id}
                        recommendNumber={this.state.currentRow.recommendNumber}
                        dateCreate={this.state.currentRow.dateCreate}
                        proponent={this.state.currentRow.proponent}
                        equipment={this.state.currentRow.equipment}
                        supplier={this.state.currentRow.supplier}
                        total={this.state.currentRow.total} 
                        unit={this.state.currentRow.unit} 
                        estimatePrice={this.state.currentRow.estimatePrice} 
                        approver={this.state.currentRow.approver} 
                        note={this.state.currentRow.note} 
                        status={this.state.currentRow.status}
                    />
                }
            </div >
        );
    }
};

function mapState(state) {
    const { recommendProcure } = state;
    return { recommendProcure };
};

const actionCreators = {
    searchRecommendProcures: RecommendProcureActions.searchRecommendProcures,
    deleteRecommendProcure: RecommendProcureActions.deleteRecommendProcure,
};

const connectedListRecommendProcure = connect(mapState, actionCreators)(withTranslate(RecommendProcure));
export { connectedListRecommendProcure as RecommendProcure };