import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DataTableSetting, ExportExcel, PaginateBar, SelectBox } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import CreateCareCommonForm from '../../common/createCareCommonForm';
import { CrmLoyalCustomerActions } from '../redux/action';
import { connect } from 'react-redux';
import { UserActions } from '../../../super-admin/user/redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getStorage } from '../../../../config';
import PromotionAddForm from './promotionAddForm';
import { formatFunction } from '../../common';
import CustomerPromotionInfoForm from './customerPromotionInfoForm';



function LoyalCustomerHomePage(props) {
    const { translate, crm, user } = props;
    const [customerId, setCustomerId] = useState();
    const [customerGetPromotion, setCustomerGetPromotion] = useState();
    const [customerCode, setCustomerCode] = useState();
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const handleCreateCareAcrion = async (id) => {
        await setCustomerId(id);
        window.$('#modal-crm-care-common-create').modal('show')
    }
    const handleGetPromotion = async (customer) => {
        await setCustomerGetPromotion(customer);
        window.$('#modal-customer-promotion-info').modal('show')
    }
    const { loyalCustomers, } = crm;
    const [searchState, setSearchState] = useState({ page: 0, limit: 10 })
    let pageTotal
    if (loyalCustomers)
        pageTotal = (loyalCustomers.totalDocs / limit )
    useEffect(() => {
        props.getLoyalCustomers({ ...searchState, page, limit });
        const currentRole = getStorage('currentRole');
        if (user && user.organizationalUnitsOfUser) {
            let getCurrentUnit = user.organizationalUnitsOfUser.find(item =>
                item.managers[0] === currentRole
                || item.deputyManagers[0] === currentRole
                || item.employees[0] === currentRole);
            if (getCurrentUnit) {
                props.getChildrenOfOrganizationalUnits(getCurrentUnit._id);
            }
        }

    }, [])


    const handleSearchByCustomerCode = async (e) => {
        const value = e.target.value;
        setCustomerCode(value);
    }
    const search = () => {
        props.getLoyalCustomers({ customerCode, limit,page });
    }
    let listCustomerRankPoints;
    if (crm && crm.customerRankPoints) listCustomerRankPoints = crm.customerRankPoints.list;

    const formatRankPoint = (point) => {
        if (!listCustomerRankPoints) return 'Chưa có phân hạng khách hàng';
        let index;
        for (let i = 0; i < listCustomerRankPoints.length; i++) {
            if (point >= listCustomerRankPoints[i].point) {
                index = i;
                break;
            }

        }
        if (index != undefined) return listCustomerRankPoints[index].name
        else return 'Chưa có phân hạng khách hàng'
    }

    //xu ly xuat bao cao

    const convertDataToExportData = (data) => {
        if (data) {
            data = data.map((o, index) => ({
                STT: index + 1,
                customerCode: o.customer ? o.customer.code : '',
                customerName: o.customer ? o.customer.name : '',
                customerRank: formatRankPoint(o.rankPoint),
                customerPoint: o.rankPoint,
                totalOrder: o.totalOrder ? o.totalOrder : '',
                totalOrderValue: o.totalOrderValue ? `${o.totalOrderValue} VND` : '0 VND',
                totalPromotion: o.totalPromotion ? o.totalPromotion : '',


            }))
        }

        let exportData = {
            fileName: 'Thông tin khách hàng thân thiết',
            dataSheets: [
                {
                    sheetName: 'sheet1',
                    sheetTitle: 'Thông tin khách hàng thân thiết',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: 'STT', width: 7 },
                                { key: "customerCode", value: 'Mã khách hàng' },
                                { key: "customerName", value: "Tên khách hàng" },
                                { key: "customerRank", value: "Xếp hạng khách hàng", width: 25 },
                                { key: "customerPoint", value: "Điểm tích lúy" },
                                { key: "totalOrder", value: "Tổng số đơn hàng" },
                                { key: "totalOrderValue", value: "Tổng giá trị đơn hàng " },
                                { key: "totalPromotion", value: "Số khuyến mãi hiện có", width: 25 },


                            ],
                            data: data,
                        }
                    ]
                }
            ]
        }
        return exportData;

    }


    let exportData = [];
    if (loyalCustomers && loyalCustomers.list && loyalCustomers.list.length > 0) {
        exportData = convertDataToExportData(loyalCustomers.list);

    }
    //  phân trang 
    const setPageTable = (cr_page) => {
        setPage(cr_page);
        props.getLoyalCustomers({ ...searchState, limit, page: cr_page })
    }
    const setLimitTable = (limitTable) => {
        setLimit(limitTable);
        props.getLoyalCustomers({ ...searchState, limit: limitTable, page })
    }

    const getLoyalCustomersData = ()=>{
        props.getLoyalCustomers({ ...searchState, limit, page });
    }

    return (
        <div className="box">
            <div className="box-body qlcv">
                {customerId && <CreateCareCommonForm customerId={customerId} type={1}></CreateCareCommonForm>}
                {customerGetPromotion && <CustomerPromotionInfoForm customerId={customerGetPromotion._id} getLoyalCustomersData = {()=>getLoyalCustomersData()} />}
                <div className="form-inline">
                    {/* export excel danh sách khách hàng */}
                    <ExportExcel id="export-customer" buttonName={translate('human_resource.name_button_export')}
                        exportData={exportData}
                        style={{ marginTop: 0 }} />

                </div>
                {/* search form */}
                <div className="form-inline" >
                    <div className="form-group">
                        <label className="form-control-static">{'Mã khách hàng'}</label>
                        <input className="form-control" type="text" name="customerCode" placeholder={`Mã khách hàng`} onChange={handleSearchByCustomerCode} />
                    </div>
                    <div className="form-group" >
                        <label></label>
                        <button type="button" className="btn btn-success"
                            onClick={search}
                            title={'Tìm kiếm'}>{'Tìm kiếm'}</button>
                    </div>
                </div>

                {/* Bảng hiển thị thông tin khách hàng thân thiết */}
                <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group" style={{ marginTop: '10px' }}>
                    <thead>
                        <tr>

                            <th>{"Số thứ tự"}</th>
                            <th>{"Mã khách hàng"}</th>
                            <th>{"Tên khách hàng"}</th>
                            <th>{"Xếp hạng khách hàng"}</th>
                            <th>{"Điểm số"}</th>
                            <th>{"Tổng số đơn hàng"}</th>
                            <th>{"Tổng giá trị đơn hàng"}</th>
                            <th>{"Số khuyến mãi hiện có"}</th>
                            <th style={{ width: "120px" }}>
                                {translate('table.action')}
                                <DataTableSetting
                                    columnArr={[
                                        'Số thứ tự',
                                        'Mã khách hàng',
                                        'Tên khách hàng',
                                        'Tổng số đơn hàng',
                                        'Tổng giá trị đơn hàng'
                                    ]}
                                    limit={limit}
                                    setLimit={setLimitTable}
                                    tableId="table-manage-crm-loyal-customer"
                                />
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            loyalCustomers && loyalCustomers.list.map((o, index) => (
                                <tr >

                                    <td>{index + 1}</td>
                                    <td>{o.customer.code}</td>
                                    <td>{o.customer.name}</td>
                                    <td>{formatRankPoint(o.rankPoint)}</td>
                                    <td>{o.rankPoint}</td>
                                    <td>{o.totalOrder}</td>
                                    <td>{`${o.totalOrderValue} VND`}</td>
                                    <td>{o.totalPromotion ? o.totalPromotion : 0}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a className="text-green" title="Tạo hoạt động chăm sóc khách hàng"
                                            onClick={() => handleCreateCareAcrion(o.customer._id)}
                                        ><i className="material-icons">add_comment</i></a>
                                        <a className="text-orange" title="Khuyến mãi của khách hàng"
                                            onClick={() => handleGetPromotion(o.customer)}
                                        ><i className="material-icons">loyalty</i></a>
                                    </td>
                                </tr>
                            ))

                        }

                    </tbody>
                </table>
                <PaginateBar pageTotal={pageTotal} currentPage={page} func={setPageTable} />

            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getLoyalCustomers: CrmLoyalCustomerActions.getLoyalCustomers,
    getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,


}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(LoyalCustomerHomePage));