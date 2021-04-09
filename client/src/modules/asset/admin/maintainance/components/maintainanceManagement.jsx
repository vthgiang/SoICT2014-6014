import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti, ExportExcel } from '../../../../../common-components';

import { MaintainanceCreateForm } from './maintainanceCreateForm';
import { MaintainanceEditForm } from './maintainanceEditForm';

import { MaintainanceActions } from '../redux/actions';
import { AssetEditForm } from '../../asset-information/components/assetEditForm';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { formatDate } from '../../../../../helpers/assetHelper.js';
function MaintainanceManagement(props) {
    
    const tableId_constructor = "table-maintainance-manager";
    const defaultConfig = { limit: 5 }
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;
    const currentDate = formatDate(Date.now())
    const [state, setState] = useState({
        tableId: tableId_constructor,
        code: "",
        maintainanceCode: "",
        maintainCreateDate: currentDate,
        type: [1, 2, 3],
        status: [1, 2, 3], 
        page: 1,
        limit: limit_constructor,
        managedBy: props.managedBy ? props.managedBy : ''
    })

    const { translate, mintainanceManager } = props;
    const { page, limit, currentRow, currentRowEditAsset, managedBy, tableId, type, status, maintainCreateDate } = state;

    

    useEffect(() => {
        props.getMaintainances(state);
    }, [])
    

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    const handleEdit = async (value, asset) => {
        value.asset = asset;
        await setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-maintainance').modal('show');
    }

    // Function format dữ liệu Date thành string
    const formatDate2 = (date, monthYear = false) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    const handleMaintainanceCodeChange = (event) => {
        const { name, value } = event.target;
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        })
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    const handleCodeChange = (event) => {
        const { name, value } = event.target;
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        })
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    const handleMaintainCreateDateChange = (value) => {
        setState(state => {
            return {
                ...state,
                maintainCreateDate: value
            }
        })
    }

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    const handleTypeChange = (value) => {
        if (value.length === 0) {
            value = ''
        }

        setState(state =>{
            return{
                ...state,
                type: value
            }
        })
    }

    // Function lưu giá trị status vào state khi thay đổi
    const handleStatusChange = (value) => {
        if (value.length === 0) {
            value = ''
        }
        
        setState(state =>{
           return{
            ...state,
            status: value
           }
        })
    }

    // Function bắt sự kiện tìm kiếm
    const handleSubmitSearch = async () => {
        await setState(state =>{
            return{
                ...state,
                page: 1
            }
        })
        props.getMaintainances(state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState(state =>{
            return{
                ...state,
                limit: parseInt(number),
            }
        });
        props.getMaintainances({...state, limit:parseInt(number)});
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        await setState(state =>{
            return{
                ...state,
                page: parseInt(pageNumber),
            }

        });
        props.getMaintainances({...state, page:parseInt(pageNumber)});
    }

    const deleteMaintainance = (assetId, maintainanceId) => {
        props.deleteMaintainance(assetId, maintainanceId).then(({ response }) => {
            if (response.data.success) {
                props.getMaintainances(state);
            }
        });
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (data) => {
        let fileName = "Bảng quản lý thông tin bảo trì tài sản ";
        let convertedData = [];
        if (data) {
            console.log(data)
            data = data.forEach((x, index) => {
                let code = x.maintainanceCode;
                let assetName = x.asset.assetName;
                let type = convertMaintainType(x.type);
                let description = x.description;
                let createDate = formatDate2(x.createDate)
                let startDate = formatDate2(x.startDate);
                let endDate = formatDate2(x.endDate);
                let cost = x.expense ? new Intl.NumberFormat().format(parseInt(x.expense)) : '';
                let assetCode = x.asset.code;
                let status = convertMaintainStatus(x.status);

                let item = {
                    index: index + 1,
                    code,
                    type,
                    assetName,
                    assetCode,
                    des: description,
                    createDate,
                    startDate,
                    endDate,
                    cost,
                    status

                }

                convertedData.push(item);

            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: fileName,
                    tables: [
                        {
                            rowHeader: 2,
                            columns: [
                                { key: "index", value: "STT" },
                                { key: "code", value: "Mã phiếu" },
                                { key: "createDate", value: "Ngày tạo" },
                                { key: "type", value: "Phân loại" },
                                { key: "assetCode", value: "Mã tài sản" },
                                { key: "assetName", value: "Tên tài sản" },
                                { key: "des", value: "Nội dung" },
                                { key: "startDate", value: "Ngày bắt đầu" },
                                { key: "endDate", value: "Ngày kết thúc" },
                                { key: "cost", value: "Chi phí" },
                                { key: "status", value: "Trạng thái" },
                            ],
                            data: convertedData
                        }
                    ]
                },
            ]
        }
        return exportData;

    }

    // Bắt sự kiện click chỉnh sửa thông tin tài sản
    const handleEditAsset = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRowEditAsset: value
            }
        });
        window.$('#modal-edit-asset').modal('show');

        // Mở tab thứ 5
        window.$('#modal-edit-asset').on('shown.bs.modal', function (){
            window.$('#nav-tabs li:eq(4) a').tab('show');
        });

    }

    const convertMaintainStatus = (status) => {
        const { translate } = props;

        if (status === "1") {
            return translate('asset.asset_info.unfulfilled');
        }
        else if (status === "2") {
            return translate('asset.asset_info.processing')
        }
        else if (status === "3") {
            return translate('asset.asset_info.made')
        }
    }

    const convertMaintainType = (type) => {
        const { translate } = props;

        if (type === "1") {
            return translate('asset.asset_info.repair')
        }
        else if (type === "2") {
            return translate('asset.asset_info.replace')
        }
        else if (type === "3") {
            return translate('asset.asset_info.upgrade')
        }
    }

    var lists = "", exportData;
    var formater = new Intl.NumberFormat();
    if (mintainanceManager.isLoading === false) {
        lists = mintainanceManager.mintainanceList;
        exportData = convertDataToExportData(lists);
    }

    var pageTotal = ((mintainanceManager.mintainanceLength % limit) === 0) ?
        parseInt(mintainanceManager.mintainanceLength / limit) :
        parseInt((mintainanceManager.mintainanceLength / limit) + 1);

        console.log(state)
        console.log(lists)
        return (
            <div className="box">
                <div className="box-body qlcv">

                    {/* Form thêm phiếu bảo trì */}
                    <MaintainanceCreateForm />

                    {/* Thanh tìm kiếm */}
                    <div className="form-inline">
                        {/* Mã phiếu */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.form_code')}</label>
                            <input type="text" className="form-control" name="maintainanceCode" onChange={handleMaintainanceCodeChange} placeholder={translate('asset.general_information.form_code')} autoComplete="off" />
                        </div>

                        {/* Mã tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={handleCodeChange} placeholder={translate('asset.general_information.asset_code')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        {/* Phân loại */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.type')}</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                value = {type}
                                options={{ nonSelectedText: translate('asset.general_information.select_reception_type'), allSelectedText: translate('asset.general_information.select_all_reception_type') }}
                                onChange={handleTypeChange}
                                items={[
                                    { value: 1, text: translate('asset.asset_info.repair') },
                                    { value: 2, text: translate('asset.asset_info.replace') },
                                    { value: 3, text: translate('asset.asset_info.upgrade') }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Tháng */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.create_reception_date')}</label>
                            <DatePicker
                                id="maintain-month"
                                dateFormat="month-year"
                                value={formatDate(Date.now())}
                                onChange={handleMaintainCreateDateChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        {/* Trạng thái */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                value= {status}
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
                                onChange={handleStatusChange}
                                items={[
                                    { value: 1, text: translate('asset.asset_info.unfulfilled') },
                                    { value: 2, text: translate('asset.asset_info.processing') },
                                    { value: 3, text: translate('asset.asset_info.made') },
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
                        </div>
                        {exportData && <ExportExcel id="export-asset-maintainance-management" exportData={exportData} style={{ marginRight: 10 }} />}
                    </div>

                    {/* Bảng thông tin bảo trì tài sản */}
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.form_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.create_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.type')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.start_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.end_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.expense')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.form_code'),
                                            translate('asset.general_information.create_date'),
                                            translate('asset.general_information.type'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.content'),
                                            translate('asset.general_information.start_date'),
                                            translate('asset.general_information.end_date'),
                                            translate('asset.general_information.expense'),
                                            translate('asset.general_information.status')
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) ?
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td><span onClick={() => handleEditAsset(x.asset)} style={{ color: '#367FA9', cursor: 'pointer' }}>{x.asset.code}</span></td>
                                        <td>{x.maintainanceCode}</td>
                                        <td>{x.createDate ? formatDate2(x.createDate) : ''}</td>
                                        <td>{convertMaintainType(x.type)}</td>
                                        <td>{x.asset.assetName}</td>
                                        <td>{x.description}</td>
                                        <td>{x.startDate ? formatDate2(x.startDate) : ''}</td>
                                        <td>{x.endDate ? formatDate2(x.endDate) : ''}</td>
                                        <td>{x.expense ? formater.format(parseInt(x.expense)) : ''}</td>
                                        <td>{convertMaintainStatus(x.status)}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => handleEdit(x, x.asset)} className="edit text-yellow" style={{ width: '5px', cursor: 'pointer' }} title={translate('asset.asset_info.edit_maintenance_card')}><i
                                                className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('asset.asset_info.delete_maintenance_card')}
                                                data={{
                                                    id: x._id,
                                                    info: x.maintainanceCode ? x.maintainanceCode : '' + " - "
                                                }}
                                                func={() => deleteMaintainance(x.asset._id, x._id)}
                                            />
                                        </td>
                                    </tr>
                                )) : null
                            }
                        </tbody>
                    </table>
                    {mintainanceManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={setPage} />
                </div>

                {/* Form chỉnh sửa phiếu bảo trì */}
                {
                    currentRow &&
                    <MaintainanceEditForm
                        _id={currentRow._id}
                        asset={currentRow.asset}
                        maintainanceCode={currentRow.maintainanceCode}
                        createDate={formatDate2(currentRow.createDate)}
                        type={currentRow.type}
                        description={currentRow.description}
                        startDate={formatDate2(currentRow.startDate)}
                        endDate={formatDate2(currentRow.endDate)}
                        expense={currentRow.expense}
                        status={currentRow.status}
                    />
                }

                {
                    currentRowEditAsset &&
                    <AssetEditForm
                        _id={currentRowEditAsset._id}
                        employeeId={managedBy}
                        avatar={currentRowEditAsset.avatar}
                        code={currentRowEditAsset.code}
                        assetName={currentRowEditAsset.assetName}
                        serial={currentRowEditAsset.serial}
                        assetType={JSON.stringify(currentRowEditAsset.assetType)}
                        group={currentRowEditAsset.group}
                        purchaseDate={currentRowEditAsset.purchaseDate}
                        warrantyExpirationDate={currentRowEditAsset.warrantyExpirationDate}
                        managedBy={currentRowEditAsset.managedBy}
                        assignedToUser={currentRowEditAsset.assignedToUser}
                        assignedToOrganizationalUnit={currentRowEditAsset.assignedToOrganizationalUnit}
                        handoverFromDate={currentRowEditAsset.handoverFromDate}
                        handoverToDate={currentRowEditAsset.handoverToDate}
                        location={currentRowEditAsset.location}
                        description={currentRowEditAsset.description}
                        status={currentRowEditAsset.status}
                        typeRegisterForUse={currentRowEditAsset.typeRegisterForUse}
                        detailInfo={currentRowEditAsset.detailInfo}
                        readByRoles={currentRowEditAsset.readByRoles}
                        cost={currentRowEditAsset.cost}
                        residualValue={currentRowEditAsset.residualValue}
                        startDepreciation={currentRowEditAsset.startDepreciation}
                        usefulLife={currentRowEditAsset.usefulLife}
                        depreciationType={currentRowEditAsset.depreciationType}
                        estimatedTotalProduction={currentRowEditAsset.estimatedTotalProduction}
                        unitsProducedDuringTheYears={currentRowEditAsset.unitsProducedDuringTheYears && currentRowEditAsset.unitsProducedDuringTheYears.map((x) => ({
                            month: formatDate2(x.month),
                            unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
                        })
                        )}

                        disposalDate={currentRowEditAsset.disposalDate}
                        disposalType={currentRowEditAsset.disposalType}
                        disposalCost={currentRowEditAsset.disposalCost}
                        disposalDesc={currentRowEditAsset.disposalDesc}

                        maintainanceLogs={currentRowEditAsset.maintainanceLogs}
                        usageLogs={currentRowEditAsset.usageLogs}
                        incidentLogs={currentRowEditAsset.incidentLogs}
                        archivedRecordNumber={currentRowEditAsset.archivedRecordNumber}
                        files={currentRowEditAsset.documents}
                        linkPage={"management"}
                        page={page}
                    />
                }
            </div>
        );
};

function mapState(state) {
    const { mintainanceManager } = state;
    return { mintainanceManager };
};

const actionCreators = {
    getMaintainances: MaintainanceActions.getMaintainances,
    deleteMaintainance: MaintainanceActions.deleteMaintainance,
};

const connectedListMaintainance = connect(mapState, actionCreators)(withTranslate(MaintainanceManagement));
export { connectedListMaintainance as MaintainanceManagement };
