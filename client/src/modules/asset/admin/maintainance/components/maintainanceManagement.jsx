import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar, SelectMulti,ExportExcel } from '../../../../../common-components';

import { MaintainanceCreateForm } from './maintainanceCreateForm';
import { MaintainanceEditForm } from './maintainanceEditForm';

import { AssetManagerActions } from '../../asset-information/redux/actions';
import { MaintainanceActions } from '../redux/actions';
import { AssetEditForm } from '../../asset-information/components/assetEditForm';

class MaintainanceManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maintainanceCode: "",
            month: "",
            type: null,
            status: null,
            page: 0,
            limit: 100,
            managedBy : this.props.managedBy?this.props.managedBy:''
        }
    }

    componentDidMount() {
        this.props.getAllAsset({
            code: "",
            assetName: "",
            assetType: null,
            month: null,
            status: null,
            page: 0,
            limit: 100,
        });
    }

    // Bắt sự kiện click chỉnh sửa thông tin phiếu đề nghị
    handleEdit = async (value, asset) => {
        value.asset = asset;
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-maintainance').modal('show');
    }

    // Function format dữ liệu Date thành string
    formatDate2(date, monthYear = false) {
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
    formatDate(date) {
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

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    handleMaintainanceCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleCodeChange = (event) => {
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

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            type: value
        })
    }

    // Function lưu giá trị status vào state khi thay đổi
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSubmitSearch = async () => {
        await this.setState({
            ...this.state,

        })
        this.props.getAllAsset(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getAllAsset(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),

        });
        this.props.getAllAsset(this.state);
    }

    deleteMaintainance = (assetId, maintainanceId) => {
        this.props.deleteMaintainance(assetId, maintainanceId).then(({ response }) => {
            if (response.data.success) {
                this.props.getAllAsset({
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

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    convertDataToExportData = (data) => {
        let fileName = "Bảng quản lý thông tin bảo trì tài sản ";
        let convertedData=[];
        if (data) {           
            data = data.forEach(asset => {     
                if(asset.maintainanceLogs.length!==0)
                {
                    let assetLog= asset.maintainanceLogs.map((x,index)=>{
                        let code =x.maintainanceCode;
                        let assetName = asset.assetName;  
                        let type =x.type;   
                        let description = x.description;          
                        let createDate = this.formatDate2(x.createDate)
                        let startDate =this.formatDate2(x.startDate);
                        let endDate =this.formatDate2(x.endDate);
                        let cost =parseInt(x.expense);
                        let assetCode = asset.code;
                        let status = x.status; 
        
                        return  {
                            index : index+1,
                            code : code,
                            createDate:createDate,    
                            type: type,                
                            assetName: assetName,
                            assetCode:assetCode,
                            des:description,
                            createDate:createDate,
                            startDate:startDate,
                            endDate:endDate,
                            cost:cost,
                            status:status
        
                        }
                    })
                    for(let i=0;i<assetLog.length;i++){
                        convertedData.push(assetLog[i]);
                    }
                }              
                
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle : fileName,
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
                                { key : "des", value : "Nội dung"},
                                { key: "startDate", value: "Ngày bắt đầu" },
                                { key: "endDate", value: "Ngày kết thúc" },
                                { key: "cost", value: "chi phí" },                               
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
    handleEditAsset = async (value) => {
        console.log(value);
        await this.setState(state => {
            return {
                ...state,
                currentRowEditAsset: value
            }
        });
        window.$('#modal-edit-asset').modal('show');

        // Mở tab thứ 3
        window.$('.nav-tabs li:eq(2) a').tab('show');

    }

    render() {
        const { translate, assetsManager } = this.props;
        const { page, limit, currentRow, currentRowEditAsset, managedBy } = this.state;

        var lists = "", exportData;
        var formater = new Intl.NumberFormat();
        if (assetsManager.isLoading === false) {
            lists = assetsManager.listAssets;
            exportData=this.convertDataToExportData(lists);
        }

        var pageTotal = ((assetsManager.totalList % limit) === 0) ?
            parseInt(assetsManager.totalList / limit) :
            parseInt((assetsManager.totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);

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
                            <input type="text" className="form-control" name="maintainceCode" onChange={this.handleMaintainanceCodeChange} placeholder={translate('asset.general_information.form_code')} autoComplete="off" />
                        </div>

                        {/* Mã tài sản */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.asset_code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('asset.general_information.asset_code')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        {/* Phân loại */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('asset.general_information.type')}</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả các loại phiếu" }}
                                onChange={this.handleTypeChange}
                                items={[
                                    { value: "Sửa chữa", text: translate('asset.asset_info.repair') },
                                    { value: "Thay thế", text: translate('asset.asset_info.replace') },
                                    { value: "Nâng cấp", text: translate('asset.asset_info.upgrade') }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Tháng */}
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
                        {/* Trạng thái */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "Đã thực hiện", text: translate('asset.asset_info.made') },
                                    { value: "Đang thực hiện", text: translate('asset.asset_info.processing') },
                                    { value: "Chưa thực hiện", text: translate('asset.asset_info.unfulfilled') }
                                ]}
                            >
                            </SelectMulti>
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={() => this.handleSubmitSearch()}>{translate('asset.general_information.search')}</button>
                        </div>
                        {exportData&&<ExportExcel id="export-asset-maintainance-management" exportData={exportData} style={{ marginRight:10 }} />}
                    </div>

                    {/* Bảng thông tin bảo trì tài sản */}
                    <table id="maintainance-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.form_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.create_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.type')}</th>
                                <th style={{ width: "8%" }}>{translate('asset.general_information.asset_code')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.asset_name')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.start_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.end_date')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.expense')}</th>
                                <th style={{ width: "10%" }}>{translate('asset.general_information.status')}</th>
                                <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                        tableId="maintainance-table"
                                        columnArr={[
                                            translate('asset.general_information.form_code'),
                                            translate('asset.general_information.create_date'),
                                            translate('asset.general_information.type'),
                                            translate('asset.general_information.asset_code'),
                                            translate('asset.general_information.asset_name'),
                                            translate('asset.general_information.content'),
                                            translate('asset.general_information.start_date'),
                                            translate('asset.general_information.end_date'),
                                            translate('asset.general_information.expense'),
                                            translate('asset.general_information.status')
                                        ]}
                                        limit={limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map(asset => {
                                    return asset.maintainanceLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.maintainanceCode}</td>
                                            <td>{x.createDate ? this.formatDate2(x.createDate) : ''}</td>
                                            <td>{x.type}</td>
                                            <td><a onClick={() => this.handleEditAsset(asset)}>{asset.code}</a></td>
                                            <td>{asset.assetName}</td>
                                            <td>{x.description}</td>
                                            <td>{x.startDate ? this.formatDate2(x.startDate) : ''}</td>
                                            <td>{x.endDate ? this.formatDate2(x.endDate) : ''}</td>
                                            <td>{x.expense ? formater.format(parseInt(x.expense)) : ''} VNĐ</td>
                                            <td>{x.status}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a onClick={() => this.handleEdit(x, asset)} className="edit text-yellow" style={{ width: '5px' }} title={translate('asset.asset_info.edit_maintenance_card')}><i
                                                    className="material-icons">edit</i></a>
                                                <DeleteNotification
                                                    content={translate('asset.asset_info.delete_maintenance_card')}
                                                    data={{
                                                        id: x._id,
                                                        info: x.maintainanceCode ? x.maintainanceCode : '' + " - "
                                                    }}
                                                    func={() => this.deleteMaintainance(asset._id, x._id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                })
                            }
                        </tbody>
                    </table>
                    {assetsManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    {/* PaginateBar */}
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>

                {/* Form chỉnh sửa phiếu bảo trì */}
                {
                    currentRow &&
                    <MaintainanceEditForm
                        _id={currentRow._id}
                        asset={currentRow.asset}
                        maintainanceCode={currentRow.maintainanceCode}
                        createDate={this.formatDate2(currentRow.createDate)}
                        type={currentRow.type}
                        description={currentRow.description}
                        startDate={this.formatDate2(currentRow.startDate)}
                        endDate={this.formatDate2(currentRow.endDate)}
                        expense={currentRow.expense}
                        status={currentRow.status}
                    />
                }

                {
                    currentRowEditAsset &&
                    <AssetEditForm
                        _id={currentRowEditAsset._id}
                        employeeId ={managedBy}
                        avatar={currentRowEditAsset.avatar}
                        code={currentRowEditAsset.code}
                        assetName={currentRowEditAsset.assetName}
                        serial={currentRowEditAsset.serial}
                        assetType={currentRowEditAsset.assetType}
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
                        canRegisterForUse={currentRowEditAsset.canRegisterForUse}
                        detailInfo={currentRowEditAsset.detailInfo}
                        readByRoles={currentRowEditAsset.readByRoles}
                        cost={currentRowEditAsset.cost}
                        residualValue={currentRowEditAsset.residualValue}
                        startDepreciation={currentRowEditAsset.startDepreciation}
                        usefulLife={currentRowEditAsset.usefulLife}
                        depreciationType={currentRowEditAsset.depreciationType}
                        estimatedTotalProduction={currentRowEditAsset.estimatedTotalProduction}
                        unitsProducedDuringTheYears={currentRowEditAsset.unitsProducedDuringTheYears && currentRowEditAsset.unitsProducedDuringTheYears.map((x) => ({
                            month: this.formatDate2(x.month),
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
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { assetsManager } = state;
    return { assetsManager };
};

const actionCreators = {
    deleteMaintainance: MaintainanceActions.deleteMaintainance,
    getAllAsset: AssetManagerActions.getAllAsset,
};

const connectedListMaintainance = connect(mapState, actionCreators)(withTranslate(MaintainanceManagement));
export { connectedListMaintainance as MaintainanceManagement };
