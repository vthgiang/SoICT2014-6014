import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import Swal from "sweetalert2";
import { DatePicker, DeleteNotification, PaginateBar, SelectMulti, SmartTable } from "../../../../../common-components";
import { getPropertyOfValue } from "../../../../../helpers/stringMethod";
import { getTableConfiguration } from "../../../../../helpers/tableConfiguration";
import { DepartmentActions } from "../../../../super-admin/organizational-unit/redux/actions";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { SuppliesActions } from "../../supplies/redux/actions";
import { AllocationHistoryActions } from "../redux/actions";
import { AllocationCreateForm } from "./AllocationCreateForm";
import { AllocationDetail } from "./AllocationDetail";
import { AllocationEditForm } from "./AllocationEditForm";

const getAllocationName = (listAllocation, idAllocation) => {
    let allocationName;
    if (listAllocation?.length && idAllocation) {
        for (let i = 0; i < listAllocation.length; i++) {
            if (listAllocation[i]?._id === idAllocation) {
                allocationName = `${formatDate(listAllocation[i].date)} - ${listAllocation[i].supplies && listAllocation[i].supplies.suppliesName}`;
                break;
            }
        }
    }
    return allocationName;
}

// Function format dữ liệu Date thành string
const formatDate = (date, monthYear = false) => {
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

    if (monthYear === true) {
        return [month, year].join('-');
    } else {
        return [day, month, year].join('-');
    }
}

function AllocationManagement(props) {
    const tableId_constructor = "table-allocation-management";
    const defaultConfig = { limit: 5 };
    const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit;
    const getAll = true;
    const [state, setState] = useState({
        tableId: tableId_constructor,

        date: null,
        supplies: "",
        allocationToOrganizationalUnit: "",
        allocationToUser: "",

        page: 0,
        limit: limit_constructor,
    });

    const [selectedData, setSelectedData] = useState();
    const onSelectedRowsChange = (value) => {
        setSelectedData(value)
    }

    const { allocationHistoryReducer, suppliesReducer, translate, user, department, } = props;
    const { page, limit, tableId, currentRow, currentRowEdit, date, supplies, allocationToOrganizationalUnit, allocationToUser, } = state;

    useEffect(() => {
        props.searchAllocation(state);
        props.searchSupplies(getAll);
        props.getUser();
        props.getAllDepartments();

    }, []);

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        await setState({
            ...state,
            limit: parseInt(number),
        });
        props.searchAllocation({ ...state, limit: parseInt(number) });
    }
    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * state.limit;
        await setState({
            ...state,
            page: parseInt(page),
        });

        props.searchAllocation({ ...state, page: parseInt(page) });
    }

    // Function lưu giá trị loại tài sản vào state khi thay đổi
    const handleSuppliesChange = (value) => {
        if (value.length === 0) {
            value = null
        }
        setState({
            ...state,
            supplies: value
        })
    }


    // Function lưu giá trị tháng vào state khi thay đổi
    const handleDateChange = async (value) => {
        if (!value) {
            value = null
        }

        await setState({
            ...state,
            date: value
        });
    }

    // Function lưu giá trị người sử dụng vào state khi thay đổi
    const handleAllocationToUserChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });

    }

    // Function lưu giá trị đơn vị sử dụng vào state khi thay đổi
    const handleAllocationToOrganizationalUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        setState({
            ...state,
            allocationToOrganizationalUnit: value
        })
    }

    // Bắt sự kiện tìm kiếm
    const handleSubmitSearch = async () => {
        await setState({
            ...state,
            page: 0,
        });
        props.searchAllocation({ page: 0, ...state });
    }

    const handleDeleteAnAllocation = (id) => {
        props.deleteAllocations({
            ids: [id]
        });
    }

    const handleDeleteOptions = () => {
        const shortTitle = `<h4 style="color: red"><div>${translate('supplies.allocation_management.delete_info')} "${selectedData?.length && selectedData.length === 1 ? getAllocationName(props.allocationHistoryReducer?.listAllocation, selectedData[0]) : ""}" ?</div></h4>`;
        const longTitle = `<h4 style="color: red"><div>Xóa ${selectedData?.length > 1 ? selectedData.length : ""} thông tin cấp phát ?</div></h4>`;

        Swal.fire({
            html: selectedData?.length === 1 ? shortTitle : longTitle,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value && selectedData.length > 0) {
                props.deleteAllocations({
                    ids: selectedData
                });
            }
        })

    }

    // Bắt sự kiện click xem thông tin cấp phát
    const handleView = async (value) => {
        await setState({
            ...state,
            currentRow: value
        });
        window.$('#modal-view-allocation').modal('show');
    }

    // Bắt sự kiện click sửa thông tin cấp phát
    const handleEdit = async (value) => {
        await setState({
            ...state,
            currentRowEdit: value
        });
        window.$('#modal-edit-allocation').modal('show');
    }

    const getDepartment = () => {
        let { department } = props;
        let listUnit = department && department.list
        let unitArr = [];

        listUnit.map(item => {
            unitArr.push({
                value: item._id,
                text: item.name
            })
        })

        return unitArr;
    }

    const getSupplies = () => {
        let { suppliesReducer } = props;
        let listSupplies = suppliesReducer && suppliesReducer.listSupplies;
        let suppliesArr = [];

        listSupplies.map(item => {
            suppliesArr.push({
                value: item._id,
                text: item.suppliesName
            })
        })

        return suppliesArr;
    }

    let suppliesArr = getSupplies();
    let suppliesList = suppliesReducer.listSupplies;
    var userlist = user.list, departmentlist = department.list;
    let dataSelectBox = getDepartment();

    var pageTotal = ((allocationHistoryReducer.totalList % limit) === 0) ?
        parseInt(allocationHistoryReducer.totalList / limit) :
        parseInt((allocationHistoryReducer.totalList / limit) + 1);
    var currentPage = parseInt((page / limit) + 1);

    return (
        <div className="box">
            <div className="box-body qlcv">
                {/* Thêm lich su cap phat mới */}
                <div className="dropdown pull-right">
                    <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('menu.add_allocation')}>
                        {translate('menu.add_allocation')}
                    </button>
                    <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                        <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-allocation').modal('show')}>{translate('menu.add_allocation')}</a></li>
                    </ul>
                </div>
                <AllocationCreateForm />

                {/* Tìm kiếm */}
                <div className="form-inline">
                    {/* Tên vật tư */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('supplies.allocation_management.supplies')}</label>
                        <SelectMulti
                            id={`suppliesInPurchaseInvoice`}
                            multiple="multiple"
                            options={{ nonSelectedText: translate('supplies.general_information.select_supplies'), allSelectedText: translate('supplies.general_information.select_all_supplies') }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={suppliesArr}
                            onChange={handleSuppliesChange}
                        />
                    </div>

                    {/* Ngày cấp phát */}
                    <div className="form-group">
                        <label className="form-control-static" style={{ padding: 0 }}>{translate('supplies.allocation_management.date')}</label>
                        <DatePicker
                            id="disposal-month"
                            dateFormat="month-year"
                            value={date}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    {/* Đơn vị được cấp phát */}
                    <div className="form-group">
                        <label>{translate('supplies.allocation_management.allocationToOrganizationalUnit')}</label>
                        <SelectMulti
                            id={`unitInManagement`}
                            multiple="multiple"
                            options={{ nonSelectedText: translate('asset.general_information.select_organization_unit'), allSelectedText: translate('asset.general_information.select_all_organization_unit') }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={dataSelectBox}
                            onChange={handleAllocationToOrganizationalUnitChange}
                        />
                    </div>

                    {/* Người được được cấp phát */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('supplies.allocation_management.allocationToUser')}</label>
                        <input type="text" className="form-control" name="allocationToUser" onChange={handleAllocationToUserChange} placeholder={translate('supplies.allocation_management.allocationToUser')} autoComplete="off" />
                    </div>
                </div>
                <div className="form-inline">
                    {/* Nút tìm kiếm */}
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('supplies.general_information.search')} onClick={handleSubmitSearch}>{translate('supplies.general_information.search')}</button>
                    </div>
                    {selectedData?.length > 0 && <button type="button" className="btn btn-danger pull-right" title={translate('general.delete_option')} onClick={() => handleDeleteOptions()}>{translate("general.delete_option")}</button>}
                </div>

                {/* Bảng thông tin lịch sử cấp phát */}
                <SmartTable
                    tableId={tableId}
                    columnData={{
                        index: translate('manage_example.index'),
                        date: translate('supplies.allocation_management.date'),
                        supplies: translate('supplies.allocation_management.supplies'),
                        quantity: translate('supplies.allocation_management.quantity'),
                        allocationToOrganizationalUnit: translate('supplies.allocation_management.allocationToOrganizationalUnit'),
                        allocationToUser: translate('supplies.allocation_management.allocationToUser'),

                    }}
                    tableHeaderData={{
                        index: <th>{translate('manage_example.index')}</th>,
                        date: <th>{translate('supplies.allocation_management.date')}</th>,
                        supplies: <th>{translate('supplies.allocation_management.supplies')}</th>,
                        quantity: <th>{translate('supplies.allocation_management.quantity')}</th>,
                        allocationToOrganizationalUnit: <th>{translate('supplies.allocation_management.allocationToOrganizationalUnit')}</th>,
                        allocationToUser: <th>{translate('supplies.allocation_management.allocationToUser')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={allocationHistoryReducer.listAllocation?.length > 0 && allocationHistoryReducer.listAllocation.map((item, index) => {
                        return {
                            id: item?._id,
                            index: <td>{index + 1}</td>,
                            date: <td>{formatDate(item.date)}</td>,
                            supplies: <td>{getPropertyOfValue(item.supplies, 'suppliesName', false, suppliesList)}</td>,
                            quantity: <td>{item.quantity}</td>,
                            allocationToOrganizationalUnit: <td>{getPropertyOfValue(item.allocationToOrganizationalUnit, 'name', false, departmentlist)}</td>,
                            allocationToUser: <th>{getPropertyOfValue(item.allocationToUser, 'email', false, userlist)}</th>,
                            action: <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleView(item)}><i className="material-icons">visibility</i></a>
                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('asset.general_information.delete_info')}
                                    data={{
                                        id: item._id,
                                        info: formatDate(item.date) + " - " + getPropertyOfValue(item.supplies, 'suppliesName', false, suppliesList)
                                    }}
                                    func={handleDeleteAnAllocation}
                                />
                            </td>
                        }
                    })}
                    dataDependency={allocationHistoryReducer.listAllocation}
                    onSetNumberOfRowsPerpage={setLimit}
                    onSelectedRowsChange={onSelectedRowsChange}
                />

                {allocationHistoryReducer.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!allocationHistoryReducer.listAllocation || allocationHistoryReducer.listAllocation.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                {/* PaginateBar */}
                <PaginateBar
                    display={allocationHistoryReducer.listAllocation ? allocationHistoryReducer.listAllocation.length : null}
                    total={allocationHistoryReducer.totalList ? allocationHistoryReducer.totalList : null}
                    pageTotal={pageTotal ? pageTotal : 0}
                    currentPage={currentPage}
                    func={setPage}
                />
            </div>
            {/* Form xem thông tin cấp phát */}
            {
                currentRow &&
                <AllocationDetail
                    _id={currentRow._id}
                    supplies={currentRow.supplies}
                    allocationToOrganizationalUnit={currentRow.allocationToOrganizationalUnit}
                    quantity={currentRow.quantity}
                    allocationToUser={currentRow.allocationToUser}
                    date={currentRow.date}
                />
            }

            {/* Form sửa thông tin cấp phát */}
            {
                currentRowEdit &&
                <AllocationEditForm
                    id={currentRowEdit.id}
                    _id={currentRowEdit._id}
                    supplies={getPropertyOfValue(currentRowEdit.supplies, '_id', true, suppliesList)}
                    quantity={currentRowEdit.quantity}
                    date={currentRowEdit.date}
                    allocationToOrganizationalUnit=
                    {getPropertyOfValue(currentRowEdit.allocationToOrganizationalUnit, '_id', true, userlist)}
                    allocationToUser=
                    {getPropertyOfValue(currentRowEdit.allocationToUser, '_id', true, departmentlist)}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { allocationHistoryReducer, suppliesReducer, user, department, auth } = state;
    return { allocationHistoryReducer, suppliesReducer, user, department, auth };
};

const actionCreators = {
    searchSupplies: SuppliesActions.searchSupplies,
    searchAllocation: AllocationHistoryActions.searchAllocation,
    deleteAllocations: AllocationHistoryActions.deleteAllocations,

    getUser: UserActions.get,
    getAllDepartments: DepartmentActions.get,
};

const connectAllocationManagement = connect(mapState, actionCreators)(withTranslate(AllocationManagement));
export { connectAllocationManagement as AllocationManagement };

