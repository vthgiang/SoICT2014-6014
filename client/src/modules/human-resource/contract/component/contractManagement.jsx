import React, { useEffect, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, ConfirmNotification, PaginateBar, SelectMulti, ExportExcel, DatePicker, SelectBox } from '../../../../common-components';


import { ContractActions } from '../redux/actions';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import CreateContract from './createContract';

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

    const tableId = "table-contract-management--";
    const defaultConfig = { limit: 10 }
    const _limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        tableId,
        position: null,
        gender: null,
        status: [0, 1, 2, 3, 4],
        type: [1, 2, 3, 4, 5],
        professionalSkills: null,
        careerFields: null,
        page: 0,
        limit: _limit,
        currentRow: {},
        currentRowView: {}
    });


    useEffect(() => {
        props.getListContract(state);
    }, [state.limit, state.page]);

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
        window.$('#modal-create-package-contract').modal({ backdrop: 'static', display: 'show' });
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
        window.$(`#modal-detail-bidding-package${value._id}`).modal('show');
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
     */
    const handleEdit = (value) => {
        setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        setTimeout(() => {
            window.$(`#modal-edit-bidding-package${value._id}`).modal('show');
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
        props.getListContract(state);
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
        let page = (pageNumber - 1) * (state.limit);
        await setState(state => ({
            ...state,
            page: parseInt(page)
        }))
    }

    const { contract, translate } = props;

    const { limit, page, startDateSearch, endDateSearch, currentRow, currentRowView, status, type, isLoading } = state;

    let listContract = [];
    if (contract.listContract) {
        listContract = contract.listContract;
    }

    let pageTotal = ((contract.totalList % limit) === 0) ?
        parseInt(contract.totalList / limit) :
        parseInt((contract.totalList / limit) + 1);
    let currentPage = parseInt((page / limit) + 1);

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
                        <label title="Thời gian ký kết" className="form-control-static">Start Date</label>
                        <DatePicker
                            id="month-startDate-contract"
                            value={startDateSearch}
                            onChange={handlestartDateSearchChange}
                        />
                    </div>
                    {/* Thời gian hết hạn hợp đồng */}
                    <div className="form-group">
                        <label title="Thời gian hết hạn" className="form-control-static">End Date</label>
                        <DatePicker
                            id="month-endDate-contract"
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
                                    <td>{formatDate(x.startDate)}</td>
                                    <td>{formatDate(x.endDate)}</td>
                                    <td>{x.budget}&bnsp;({x.unitCode})</td>
                                    <td>
                                        <a onClick={() => handleView(x)} style={{ width: '5px' }} title="detail"><i className="material-icons">view_list</i></a>
                                        <a onClick={() => handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="edit"><i className="material-icons">edit</i></a>
                                        <ConfirmNotification
                                            icon="question"
                                            title="Xóa thông tin hợp đồng"
                                            name="delete"
                                            className="text-red"
                                            content={`<h4>Delete ${x.name + " - " + x.code}</h4>`}
                                            func={() => props.deleteBiddingPackage(x._id)}
                                        />
                                    </td>
                                </tr>
                            )
                            )}
                    </tbody>

                </table>
                {contract.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listContract || listContract.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
            </div>
            {/* From thêm mới hợp đồng */}
            <CreateContract />

            {/* From import thông tin nhân viên */}
            {/* {
                importBiddingPackage && <BiddingPackageImportForm /> 
            } */}

            {/* From xem thông tin nhân viên */}
            {/* {
                <BiddingPackageDetailForm
                    _id={currentRowView ? currentRowView._id : ""}
                />
            } */}
            {/* From chinh sửa thông tin nhân viên */}
            {/* {
                <BiddingPackageEditFrom
                    _id={currentRow ? currentRow._id : ""}
                />
            } */}
        </div >
    );
}

function mapState(state) {
    const { contract, department, field, major, career, certificates } = state;
    return { contract, department, field, major, career, certificates };
}

const actionCreators = {
    getListContract: ContractActions.getListContract,
};

const contractManagement = connect(mapState, actionCreators)(withTranslate(ContractManagement));
export { contractManagement as ContractManagement };
