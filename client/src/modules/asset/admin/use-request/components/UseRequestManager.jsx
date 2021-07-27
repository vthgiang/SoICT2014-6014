import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, DatePicker, PaginateBar, DataTableSetting, SelectMulti, ExportExcel } from '../../../../../common-components';

import { UseRequestEditForm } from './UseRequestManagerEditForm';
import { AssetTypeActions } from "../../asset-type/redux/actions";
import { RecommendDistributeActions } from '../../../user/use-request/redux/actions';
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { AssetManagerActions } from "../../asset-information/redux/actions";
import { AssetEditForm } from '../../asset-information/components/assetEditForm';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { formatDate } from '../../../../../helpers/assetHelper.js';

function UseRequestManager(props) {

    const tableId_constructor = "table-use-request-manager";
    const defaultConfig = { limit: 5 }
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;
    const currentMonth = formatDate(Date.now())
    const [state, setState] = useState({
        tableId: tableId_constructor,
        recommendNumber: "",
        createReceiptsDate: currentMonth,
        status: ["approved", "waiting_for_approval", "disapproved"],
        page: 0,
        limit: limit_constructor,
        managedBy: props.managedBy ? props.managedBy : ''
    })
    const { translate, recommendDistribute, isActive } = props;
    const { page, limit, currentRow, currentRowEditAsset, managedBy, tableId, status, createReceiptsDate } = state;

    useEffect(() => {
        let { managedBy } = state;
        props.searchRecommendDistributes(state);
        props.getUser();
        props.getAssetTypes();
        props.getListBuildingAsTree();
        if (!props.isActive || props.isActive === "tab-pane active") {
            props.getAllAsset({
                code: "",
                assetName: "",
                assetType: null,
                status: null,
                page: 0,
                limit: 5,
                managedBy: managedBy
            });
        }
    }, [])

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    const handleEdit = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-recommenddistributemanage').modal('show');
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

    const formatDateTime = (date, typeRegisterForUse) => {
        if (!date) return null;
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
        if (typeRegisterForUse === 2) {
            let hour = d.getHours(),
                minutes = d.getMinutes();
            if (hour < 10) {
                hour = '0' + hour;
            }

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            let formatDate = [hour, minutes].join(":") + " " + [day, month, year].join("-")
            return formatDate;
        } else {
            let formatDate = [day, month, year].join("-")
            return formatDate;
        }
    }

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    const handleRecommendNumberChange = (event) => {
        const { name, value } = event.target;
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        });
    }

    // Function lưu giá trị mã  vào state khi thay đổi
    const handleCodeChange = (event) => {
        const { name, value } = event.target;
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        });
    }

    // Function lưu giá trị tên tài sản vào state khi thay đổi
    const handleAssetNameChange = (event) => {
        const { name, value } = event.target;
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        });
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    const handleMonthChange = (value) => {
        setState(state => {
            return {
                ...state,
                createReceiptsDate: value
            }
        });
    }

    // Function lưu giá trị status vào state khi thay đổi
    const handleReqForUsingEmployeeChange = (event) => {
        const { name, value } = event.target;
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        });
    }

    // Function lưu giá trị status vào state khi thay đổi
    const handleAppoverChange = (event) => {
        const { name, value } = event.target;
        setState(state => {
            return {
                ...state,
                [name]: value
            }
        });
    }
    // Function lưu giá trị status vào state khi thay đổi
    const handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };

        setState(state => {
            return {
                ...state,
                reqUseStatus: value
            }
        })
    }

    // Function bắt sự kiện tìm kiếm
    const handleSubmitSearch = async () => {
        if (state.month === "") {
            await setState(state => {
                return {
                    ...state,
                    month: formatDate(Date.now()),
                    page: 0
                }
            })
        }
        props.searchRecommendDistributes(state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState(state => {
            return {
                ...state,
                limit: parseInt(number),
            }
        });
        props.searchRecommendDistributes({ ...state, limit: parseInt(number) });
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * state.limit;
        await setState(state => {
            return {
                ...state,
                page: parseInt(page),
            }
        });
        props.searchRecommendDistributes({ ...state, page: parseInt(page) });
    }

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (data) => {
        let fileName = "Bảng quản lý thông tin đăng kí sử dụng tài sản ";
        if (data) {
            data = data.map((x, index) => {

                let code = x.recommendNumber;
                let assetName = (x.asset) ? x.asset.assetName : '';
                let approver = (x.approver) ? x.approver.email : '';
                let assigner = (x.proponent) ? x.proponent.email : ''
                let createDate = formatDateTime(x.dateCreate)
                let dateStartUse = formatDateTime(x.dateStartUse);
                let dateEndUse = formatDateTime(x.dateEndUse);
                let assetCode = (x.asset) ? x.asset.code : ''
                let status = formatStatus(x.status);

                return {
                    index: index + 1,
                    code: code,
                    createDate: createDate,
                    assigner: assigner,
                    assetName: assetName,
                    assetCode: assetCode,
                    dateStartUse: dateStartUse,
                    dateEndUse: dateEndUse,
                    approver: approver,
                    status: status
                }
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
                                { key: "assigner", value: "Người đăng kí" },
                                { key: "assetName", value: "Tên tài sản" },
                                { key: "assetCode", value: "Mã tài sản" },
                                { key: "dateStartUse", value: "Ngày bắt đầu sử dụng" },
                                { key: "dateEndUse", value: "Ngày kết thúc sử dụng" },
                                { key: "approver", value: "Người phê duyệt" },
                                { key: "status", value: "Trạng thái" },
                            ],
                            data: data
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

        // Mở tab thứ 3
        window.$('#modal-edit-asset').on('shown.bs.modal', function () {
            window.$('#nav-tabs li:eq(2) a').tab('show');
        });

    }

    const formatStatus = (status) => {
        const { translate } = props;

        switch (status) {
            case 'approved': return translate('asset.usage.approved');
            case 'waiting_for_approval': return translate('asset.usage.waiting_approval');
            case 'disapproved': return translate('asset.usage.not_approved');
        }
    }


    var listRecommendDistributes = "", exportData;
    if (recommendDistribute.isLoading === false) {
        listRecommendDistributes = recommendDistribute.listRecommendDistributes;
        exportData = convertDataToExportData(listRecommendDistributes);
    }

    var pageTotal = ((recommendDistribute.totalList % limit) === 0) ?
        parseInt(recommendDistribute.totalList / limit) :
        parseInt((recommendDistribute.totalList / limit) + 1);
    var currentPage = parseInt((page / limit) + 1);
    console.log(state)
    console.log(listRecommendDistributes)
    return (
        //Khi id !== undefined thi component nay duoc goi tu module user
        <div className={isActive ? isActive : "box"} >
            <div className="box-body qlcv">
                {/* Thanh tìm kiếm */}
                <div className="form-inline">
                    {/* Mã phiếu */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.form_code')}</label>
                        <input type="text" className="form-control" name="receiptsCode" onChange={handleRecommendNumberChange} placeholder={translate('asset.general_information.form_code')} autoComplete="off" />
                    </div>

                    {/* Mã tài sản */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.asset_code')}</label>
                        <input type="text" className="form-control" name="codeAsset" onChange={handleCodeChange} placeholder={translate('asset.general_information.asset_code')} autoComplete="off" />
                    </div>
                </div>

                <div className="form-inline">
                    {/* Người được đăng ký sử dụng */}
                    <div className="form-group">
                        <label className="form-control-static">Người đăng ký</label>
                        <input type="text" className="form-control" name="reqUseEmployee" onChange={handleReqForUsingEmployeeChange} placeholder="Người đăng ký" autoComplete="off" />
                    </div>

                    {/* Người phê duyệt đăng ký sử dụng */}
                    <div className="form-group">
                        <label className="form-control-static">Người phê duyệt</label>
                        <input type="text" className="form-control" name="approver" onChange={handleAppoverChange} placeholder="Người phê duyệt" autoComplete="off" />
                    </div>
                </div>

                <div className="form-inline" style={{ marginBottom: 10 }}>
                    {/* Trạng thái */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('page.status')}</label>
                        <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                            value={status}
                            options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
                            onChange={handleStatusChange}
                            items={[
                                { value: "approved", text: translate('asset.usage.approved') },
                                { value: "waiting_for_approval", text: translate('asset.usage.waiting_approval') },
                                { value: "disapproved", text: translate('asset.usage.not_approved') }
                            ]}
                        >
                        </SelectMulti>
                    </div>


                    {/* Tháng  lập phiếu*/}
                    <div className="form-group">
                        <label className="form-control-static">Ngày lập phiếu</label>
                        <DatePicker
                            value={createReceiptsDate}
                            id="month"
                            dateFormat="month-year"
                            // value={formatDate(Date.now())}
                            onChange={handleMonthChange}
                        />
                    </div>
                    {/* Button tìm kiếm */}
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => handleSubmitSearch()} >{translate('page.add_search')}</button>
                    </div>
                    {exportData && <ExportExcel id="export-asset-recommened-distribute-management" exportData={exportData} style={{ marginRight: 10 }} />}
                </div>

                {/* Bảng thông tin đăng kí sử dụng tài sản */}
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "17%" }}>{translate('asset.general_information.asset_code')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.form_code')}</th>
                            <th style={{ width: "15%" }}>{translate('asset.general_information.create_date')}</th>
                            <th style={{ width: "15%" }}>{translate('asset.usage.proponent')}</th>
                            <th style={{ width: "15%" }}>{translate('asset.general_information.asset_name')}</th>
                            <th style={{ width: "17%" }}>{translate('asset.general_information.handover_from_date')}</th>
                            <th style={{ width: "17%" }}>{translate('asset.general_information.handover_to_date')}</th>
                            <th style={{ width: "17%" }}>{translate('asset.usage.accountable')}</th>
                            <th style={{ width: "11%" }}>{translate('asset.general_information.status')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('asset.general_information.asset_code'),
                                        translate('asset.general_information.form_code'),
                                        translate('asset.general_information.create_date'),
                                        translate('asset.usage.proponent'),
                                        translate('asset.general_information.asset_name'),
                                        translate('asset.general_information.handover_from_date'),
                                        translate('asset.general_information.handover_to_date'),
                                        translate('asset.usage.accountable'),
                                        translate('asset.general_information.status'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(listRecommendDistributes && listRecommendDistributes.length !== 0) ?
                            listRecommendDistributes.map((x, index) => {
                                return (<tr key={index}>
                                    <td><a onClick={() => handleEditAsset(x.asset)}>{x.asset ? x.asset.code : ''}</a></td>
                                    <td>{x.recommendNumber}</td>
                                    <td>{formatDateTime(x.dateCreate)}</td>
                                    <td>{x.proponent ? x.proponent.email : ''}</td>
                                    <td>{x.asset ? x.asset.assetName : ''}</td>
                                    <td>{formatDateTime(x.dateStartUse, x.asset ? x.asset.typeRegisterForUse : undefined)}</td>
                                    <td>{formatDateTime(x.dateEndUse, x.asset ? x.asset.typeRegisterForUse : undefined)}</td>
                                    <td>{x.approver ? x.approver.email : ''}</td>
                                    <td>{formatStatus(x.status)}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a onClick={() => handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_usage_info')}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('asset.asset_info.delete_usage_info')}
                                            data={{
                                                id: x._id,
                                                info: x.recommendNumber
                                            }}
                                            func={props.deleteRecommendDistribute}
                                        />
                                    </td>
                                </tr>)
                            }) : null
                        }
                    </tbody>
                </table>
                {recommendDistribute.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listRecommendDistributes || listRecommendDistributes.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                {/* PaginateBar */}
                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
            </div>

            {/* Form chỉnh sửa phiếu đăng ký sử dụng */}
            {
                currentRow &&
                <UseRequestEditForm
                    _id={currentRow._id}
                    employeeId={managedBy}
                    recommendNumber={currentRow.recommendNumber}
                    dateCreate={currentRow.dateCreate}
                    proponent={currentRow.proponent}
                    reqContent={currentRow.reqContent}
                    asset={currentRow.asset}
                    dateStartUse={currentRow.dateStartUse}
                    dateEndUse={currentRow.dateEndUse}
                    approver={currentRow.approver}
                    status={currentRow.status}
                    note={currentRow.note}
                />
            }

            {/* Form chỉnh sửa thông tin tài sản */}
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

        </div >
    );
};

function mapState(state) {
    const { recommendDistribute, assetsManager, assetType, user, auth } = state;
    return { recommendDistribute, assetsManager, assetType, user, auth };
};

const actionCreators = {
    getAssetTypes: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    searchRecommendDistributes: RecommendDistributeActions.searchRecommendDistributes,
    deleteRecommendDistribute: RecommendDistributeActions.deleteRecommendDistribute,
    getListBuildingAsTree: AssetManagerActions.getListBuildingAsTree,
};

const connectedUseRequestManager = connect(mapState, actionCreators)(withTranslate(UseRequestManager));
export { connectedUseRequestManager as UseRequestManager };
