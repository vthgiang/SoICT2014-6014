import React, { useEffect, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, ConfirmNotification, PaginateBar, SelectMulti, ExportExcel, DatePicker, SelectBox } from '../../../../common-components';

import { BiddingContractActions } from '../redux/actions';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import CreateBiddingContract from './createContract';
import EditBiddingContract from './editContract';
import ViewBiddingContract from './detailContract';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import CreateProjectByContractModal from './createProjectByContractModal';

const ContractManagement = (props) => {

    let search = window.location.search.split('?')
    let keySearch = 'nameSearch';
    let _nameSearch = null;

    useEffect(() => {
        for (let n in search) {
            let index = search[n].lastIndexOf(keySearch);
            if (index !== -1) {
                _nameSearch = search[n].slice(keySearch.length + 1, search[n].length);
                if (_nameSearch !== 'null' && _nameSearch.trim() !== '') {
                    _nameSearch = _nameSearch.split(',')
                } else _nameSearch = null
                break;
            }
        }
    }, [search])

    const tableId = "table-biddingContract-management--";
    const defaultConfig = { limit: 10 }
    const _limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        tableId,
        status: [0, 1, 2, 3, 4],
        type: [1, 2, 3, 4, 5],
        page: 1,
        limit: _limit,
        currentRow: null,
        currentRowView: null
    });


    useEffect(() => {
        props.getListBiddingContract(state);
    }, [state.limit, state.page]);

    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany();
        props.getAllUser();
    }, []);

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    // Function bắt sự kiện thêm hợp đồng
    const createContractPackage = () => {
        window.$('#modal-create-package-biddingContract').modal({ backdrop: 'static', display: 'show' });
    }

    // Function bắt sự kiện thêm lương nhân viên bằng import file
    const _importBiddingPackage = async () => {
        await setState(state => ({
            ...state,
            importBiddingPackage: true
        }))
        window.$('#modal_import_file').modal('show');
    }

    /**
     *  Bắt sự kiện click xem thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn xem
     */
    const handleView = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRowView: value
            }
        });
        setTimeout(() => {
            window.$(`#modal-view-bidding-contract--${value._id}`).modal('show');
        }, 500);
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
     */
    const handleEdit = (value) => {
        setState({
            ...state,
            currentRow: value
        });
        setTimeout(() => {
            window.$(`#modal-edit-bidding-contract--${value._id}`).modal('show');
        }, 500);
    }

    /**
     * Bắt sự kiện click tạo dự án theo hợp đồng
     * @param {*} value : Thông tin hợp đồng
     */
    const handleCreateProject = (value) => {
        setState({
            ...state,
            currentRow: value
        });
        setTimeout(() => {
            window.$(`#modal-create-project-for-contract--${value._id}`).modal('show');
        }, 500);
    }

    /**
     * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
     * @param {*} value : Tháng hết hạn hợp đồng
     */
    const handlestartDateSearchChange = (value) => {
        if (value) {
            let partValue = value.split('-');
            value = [partValue[2], partValue[1], partValue[0]].join('-');
        }
        setState(state => ({
            ...state,
            startDateSearch: value
        }))
    }

    /**
     * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
     * @param {*} value : Tháng hết hạn hợp đồng
     */
    const handleendDateSearchChange = (value) => {
        if (value) {
            let partValue = value.split('-');
            value = [partValue[2], partValue[1], partValue[0]].join('-');
        }
        setState(state => ({
            ...state,
            endDateSearch: value
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => ({
            ...state,
            [name]: value
        }))
    }

    /** Function bắt sự kiện tìm kiếm */
    const handleSunmitSearch = async () => {
        props.getListBiddingContract(state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng trên 1 trang
     */
    const setLimit = async (number) => {
        await setState(state => ({
            ...state,
            limit: parseInt(number),
        }))
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang muốn xem
     */
    const setPage = async (pageNumber) => {
        let page = pageNumber;
        await setState(state => ({
            ...state,
            page: parseInt(page)
        }))
    }

    const { biddingContract, translate } = props;

    const { limit, page, startDateSearch, endDateSearch, currentRow, currentRowView, status, type, isLoading } = state;

    let listContract = [];
    if (biddingContract.listBiddingContract) {
        listContract = biddingContract.listBiddingContract;
    }

    let pageTotal = ((biddingContract.totalList % limit) === 0) ?
        parseInt(biddingContract.totalList / limit) :
        parseInt((biddingContract.totalList / limit) + 1);
    let currentPage = page;

    return (
        <div className="box">
            <div className="box-body qlcv">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        {/* Button thêm mới hợp đồng */}
                        <div className="dropdown">
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title="Thêm hợp đồng" onClick={createContractPackage} >Thêm hợp đồng</button>
                        </div>
                        {/* <button type="button" style={{ marginRight: 15, marginTop: 0 }} className="btn btn-primary pull-right" onClick={handleExportExcel} >{translate('human_resource.name_button_export')}<i className="fa fa-fw fa-file-excel-o"> </i></button> */}
                    </div>
                </div>

                <div className="form-inline" style={{ marginTop: '10px' }}>
                    {/* Tên hợp đồng */}
                    <div className="form-group">
                        <label className="form-control-static">Tên hợp đồng</label>
                        <input type="text" className="form-control" name="nameSearch" onChange={handleChange} placeholder="Tên hợp đồng" autoComplete="off" />
                    </div>
                    {/* Mã hợp đồng  */}
                    <div className="form-group">
                        <label className="form-control-static">Mã hợp đồng</label>
                        <input type="text" className="form-control" name="codeSearch" onChange={handleChange} placeholder="Mã hợp đồng" autoComplete="off" />
                    </div>
                </div>

                <div className="form-inline">
                    {/* Thời gian hợp đồng bắt đầu có hiệu lực*/}
                    <div className="form-group">
                        <label title="Ngày có hiệu lực" className="form-control-static">Ngày có hiệu lực</label>
                        <DatePicker
                            id="month-startDate-biddingContract"
                            value={startDateSearch}
                            onChange={handlestartDateSearchChange}
                        />
                    </div>
                    {/* Thời gian hết hạn hợp đồng */}
                    <div className="form-group">
                        <label title="Thời gian hết hạn" className="form-control-static">Ngày hết hạn</label>
                        <DatePicker
                            id="month-endDate-biddingContract"
                            value={endDateSearch}
                            onChange={handleendDateSearchChange}
                        />
                    </div>
                </div>

                <div className="row" style={{ marginBottom: '15px', marginTop: '10px' }}>
                    <div className="col-md-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={handleSunmitSearch} >{translate('general.search')}</button>
                    </div>
                </div>

                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên hợp đồng</th>
                            <th>Mã hợp đồng</th>
                            <th>Gói thầu</th>
                            <th>Ngày ký kết</th>
                            <th>Ngày hết hạn</th>
                            <th>Giá trị hợp đồng</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listContract && listContract.length !== 0 &&
                            listContract?.map((x, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                    <td>{x.name}</td>
                                    <td>{x.code}</td>
                                    <td>{x.biddingPackage?.name}</td>
                                    <td>{formatDate(x.effectiveDate)}</td>
                                    <td>{formatDate(x.endDate)}</td>
                                    <td>{x.budget}({x.currenceUnit})</td>
                                    <td>
                                        <a onClick={() => handleView(x)} style={{ width: '5px' }} title="detail"><i className="material-icons">view_list</i></a>
                                        <a onClick={() => handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="edit"><i className="material-icons">edit</i></a>
                                        <ConfirmNotification
                                            icon="question"
                                            title="Xóa thông tin hợp đồng"
                                            name="delete"
                                            className="text-red"
                                            content={`<h4>Xóa "${x.name + " - " + x.code}"</h4>`}
                                            func={() => props.deleteBiddingContract(x._id)}
                                        />
                                        {!x.project &&
                                            <a className="" style={{ color: "#28A745" }} onClick={() => handleCreateProject(x)} title={"Tạo dự án theo hợp đồng này"}>
                                                <i className="material-icons">add_box</i>
                                            </a>
                                        }
                                    </td>
                                </tr>
                            )
                            )}
                    </tbody>

                </table>
                {biddingContract.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listContract || listContract.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
            </div>
            {/* From thêm mới hợp đồng */}
            <CreateBiddingContract />

            {/* From chinh sửa thông tin hợp đồng */}
            {
                <EditBiddingContract
                    id={currentRow ? currentRow._id : null}
                    data={currentRow ? currentRow : null}
                />
            }

            {/* From tạo dự án theo hợp đồng */}
            {
                <CreateProjectByContractModal
                    id={currentRow ? currentRow._id : null}
                    data={currentRow ? currentRow : null}
                />
            }

            {/* From import thông tin nhân viên */}
            {/* {
                importBiddingPackage && <BiddingPackageImportForm /> 
            } */}

            {/* From xem thông tin nhân viên */}
            {
                <ViewBiddingContract
                    id={currentRowView ? currentRowView._id : null}
                    data={currentRowView ? currentRowView : null}
                />
            }
        </div >
    );
}

function mapState(state) {
    const { biddingContract, department, field, major, career, certificates } = state;
    return { biddingContract, department, field, major, career, certificates };
}

const actionCreators = {
    getListBiddingContract: BiddingContractActions.getListBiddingContract,
    deleteBiddingContract: BiddingContractActions.deleteBiddingContract,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllUser: UserActions.get,
    getTasksByProject: taskManagementActions.getTasksByProject,
};

const biddingContractManagement = connect(mapState, actionCreators)(withTranslate(ContractManagement));
export { biddingContractManagement as ContractManagement };
