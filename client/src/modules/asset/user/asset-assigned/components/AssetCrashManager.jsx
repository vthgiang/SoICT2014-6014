import React, { Component , useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti } from '../../../../../common-components';

import { IncidentEditForm } from './incidentEditForm';

import { IncidentActions } from '../redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';
import { AssetTypeActions } from "../../../admin/asset-type/redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

function AssetCrashManager(props) {

    const tableId_constructor = "table-asset-crash-manager";
    const defaultConfig = { limit: 5 }
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        code: "",
        assetName: "",
        month: null,
        type: null,
        limit: limit_constructor,
        page:0
    })

    useEffect(() => {
        props.searchAssetTypes({ typeNumber: "", typeName: "", limit: 0 });
        props.getUser();
        props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: "",
            page: 0,
        });
    }, [])

    

    // Bắt sự kiện click chỉnh sửa thông tin sự cố
    const handleEdit = async (value, asset) => {
        value.asset = asset;
        await setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-incident').modal('show');
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

    // Function format ngày hiện tại thành dạnh mm-yyyy
    const formatDate = (date)  => {
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

        return [month, year].join('-');
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    const handleCodeChange = (event) => {
        const { name, value } = event.target;
        setState(state =>{
            return{ 
                ...state,
                [name]: value
            }
        });
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    const handleAssetNameChange = (event) => {
        const { name, value } = event.target;
        setState(state =>{
            return{
                ...state,
                [name]: value
            }
        });
    }

    // Function lưu giá trị tháng vào state khi thay đổi
    const handleMonthChange = (value) => {
        setState(state =>{
            return{
                ...state,
                incidentDate: value   
            }
        });
    }

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    const handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        setState(state =>{
            return{
                ...state,
                incidentType: value
            }
        })
    }

    // Function bắt sự kiện tìm kiếm
    const handleSubmitSearch = async () => {
        await setState(state =>{
            return{
                ...state,
            }

        })
        props.getAllAsset(state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState(state =>{
            return{
                ...state,
                limit: parseInt(number),
            }
        });
        props.getAllAsset({...state, limit: 10000,page:0});
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * state.limit;
        await setState(state =>{
            return{
                ...state,
                page: parseInt(page),
            }

        });
        props.getAllAsset({...state, page: 0,limit:10000});
    }

    const deleteIncident = (assetId, incidentId) => {
        props.deleteIncident(assetId, incidentId).then(({ response }) => {
            if (response.data.success) {
                props.getAllAsset({
                    code: "",
                    assetName: "",
                    month: null,
                    status: "",
                    page: 0,
                    limit: 5,
                });
            }
        });
    }

    const convertIncidentType = (type) => {
        const { translate } = props;
        if (type == 1) {
            return translate('asset.general_information.damaged');
        } else if (type == 2) {
            return translate('asset.general_information.lost')
        } else {
            return ''
        }
    }

    const convertIncidentStatus = (stt) => {
        const { translate } = props;
        if (stt == 1) {
            return translate('asset.general_information.waiting');
        } else if (stt == 2) {
            return translate('asset.general_information.processed')
        } else {
            return ''
        }
    }

        const { translate, assetsManager, assetType, user, auth } = props;
        const { page, limit, currentRow, tableId } = state;

        var lists = "";
        var userlist = user.list;
        var assettypelist = assetType.listAssetTypes;
        var formater = new Intl.NumberFormat();
        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
        }
        let listAssetAssignShow,listAssetAssigns,pageTotal;
        var currentPage = parseInt((page / limit) + 1);

        if (lists && lists.length !== 0) {
            listAssetAssigns = lists.filter(item => item.assignedToUser === auth.user._id)
            listAssetAssigns=listAssetAssigns.filter(value=>value.incidentLogs.some(value1=>value1.reportedBy===auth.user._id)===true)
            pageTotal = ((listAssetAssigns.length % limit) === 0) ?
            parseInt(listAssetAssigns.length / limit) :
            parseInt((listAssetAssigns.length / limit) + 1);
            listAssetAssignShow=listAssetAssigns.slice((currentPage-1)*limit,currentPage*limit)
        }
        // console.log(pageTotal,listAssetAssignShow,page,limit);
    return (
        <div id="assetcrash" className="tab-pane">
            <div className="box-body qlcv">

                {/* Thanh tìm kiếm */}
                <div className="form-inline">

                    {/* Mã tài sản */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.asset_code')}</label>
                        <input type="text" className="form-control" name="code" onChange={handleCodeChange} placeholder={translate('asset.general_information.asset_code')} autoComplete="off" />
                    </div>

                    {/* Tên tài sản */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.asset_name')}</label>
                        <input type="text" className="form-control" name="assetName" onChange={handleAssetNameChange} placeholder={translate('asset.general_information.asset_name')} autoComplete="off" />
                    </div>
                </div>

                <div className="form-inline" style={{ marginBottom: 10 }}>
                    {/* Phân loại */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.type')}</label>
                        <SelectMulti id={`multiSelectType1`} multiple="multiple"
                            options={{ nonSelectedText: translate('asset.general_information.select_incident_type'), allSelectedText: translate('asset.general_information.select_all_incident_type') }}
                            onChange={handleTypeChange}
                            items={[
                                { value: "1", text: translate('asset.general_information.damaged') },
                                { value: "2", text: translate('asset.general_information.lost') }
                            ]}
                        >
                        </SelectMulti>
                    </div>

                    {/* Tháng */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('asset.general_information.date_incident')}</label>
                        <DatePicker
                            id="month"
                            dateFormat="month-year"
                            onChange={handleMonthChange}
                        />
                    </div>

                    {/* Button tìm kiếm */}
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
                    </div>
                </div>

                {/* Bảng thông tin sự cố */}
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.asset_code')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.incident_code')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.incident_type')}</th>
                            <th style={{ width: "10%" }}>{translate('general.status')}</th>
                            <th style={{ width: "8%" }}>{translate('asset.general_information.reported_by')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.date_incident')}</th>
                            <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                            <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('asset.general_information.asset_code'),
                                        translate('asset.general_information.asset_name'),
                                        translate('asset.general_information.incident_code'),
                                        translate('asset.general_information.incident_type'),
                                        translate('general.status'),
                                        translate('asset.general_information.reported_by'),
                                        translate('asset.general_information.date_incident'),
                                        translate('asset.general_information.content'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(listAssetAssignShow && listAssetAssignShow.length) ?
                            listAssetAssignShow.map(asset => {
                                return asset.incidentLogs.filter(item => item.reportedBy === auth.user._id).map((x, index) => (
                                    <tr key={index}>
                                        <td>{asset.code}</td>
                                        <td>{asset.assetName}</td>
                                        <td>{x.incidentCode}</td>
                                        <td>{convertIncidentType(x.type)}</td>
                                        <td>{convertIncidentStatus(x.statusIncident)}</td>
                                        <td>{x.reportedBy && userlist.length && userlist.filter(item => item._id === x.reportedBy).pop() ? userlist.filter(item => item._id === x.reportedBy).pop().name : ''}</td>
                                        <td>{formatDate2(x.dateOfIncident)}</td>
                                        <td>{x.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => handleEdit(x, asset)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_incident_info')}><i
                                                className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('asset.asset_info.delete_incident_info')}
                                                data={{
                                                    id: x._id,
                                                    info: asset.code + " - " + x.incidentCode
                                                }}
                                                func={() => deleteIncident(asset._id, x._id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }) : null

                        }
                    </tbody>
                </table>
                {assetsManager.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                {/* PaginateBar */}
                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
            </div>

            {/* Form chỉnh sửa thông tin sự cố */}
            {
                currentRow &&
                <IncidentEditForm
                    _id={currentRow._id}
                    asset={currentRow.asset}
                    incidentCode={currentRow.incidentCode}
                    type={currentRow.type}
                    reportedBy={currentRow.reportedBy}
                    dateOfIncident={formatDate2(currentRow.dateOfIncident)}
                    description={currentRow.description}
                    statusIncident={currentRow.statusIncident}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { assetsManager, assetType, user, auth } = state;
    return { assetsManager, assetType, user, auth };
};

const actionCreators = {
    deleteIncident: IncidentActions.deleteIncident,
    searchAssetTypes: AssetTypeActions.searchAssetTypes,
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
};

const connectedListIncident = connect(mapState, actionCreators)(withTranslate(AssetCrashManager));
export { connectedListIncident as AssetCrashManager };
