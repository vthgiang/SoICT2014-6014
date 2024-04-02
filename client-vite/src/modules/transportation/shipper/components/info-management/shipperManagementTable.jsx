import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti } from "../../../../../common-components";
import { useEffect } from "react";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { ShipperActions } from "../../redux/actions";
import ShipperEditForm from "./shipperEditForm";
import ShipperCalendar from "./shipperCalendar";

const ShipperManagementTable = (props) => {
    const getTableId = "table-manage-shipper-admin";

    const { translate , user, shipper} = props;

    const [state, setState] = useState({
        shipperName: "",
        description: "",
        page: 1,
        perPage: 5,
        shipperEdit: null,
        shipperId: null,
        tableId: getTableId,
        shipperList: [],
        searchingLicenses: [],
        shipperCalendarInfo: "",
        isShowCalendar: false
    })
    const { shipperName, page, perPage, shipperEdit, shipperId, tableId, searchingLicenses, shipperCalendarInfo, isShowCalendar } = state;

    useEffect(() => {
        let currentRole = localStorage.getItem("currentRole")
        // props.getAllEmployeeOfUnitByRole(currentRole);
        props.getAllDriversNotConfirm({currentRole: currentRole})
        props.getAllShipperWithCondition({page: page, perPage: perPage});
    }, []);

    const handleChangeSearchingName = (e) => {
        setState({
            ...state,
            shipperName: e.target.value
        })
    }

    const handleSubmitSearch = () => {
        props.getAllShipperWithCondition({
            name: shipperName,
            searchingLicenses: searchingLicenses
        })
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getAllShipperWithCondition({page: pageNumber, perPage: perPage});
    }

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number)
        });
        props.getAllShipperWithCondition({page: page, perPage: number});
    }

    const  handleChangeSearchingLicense = (value) => {
        if (value.length === 0) {
            value = null
        }
        setState({
            ...state,
            searchingLicenses: value
        })
    }

    const handleEdit = (shipper) => {
        setState({
            ...state,
            shipperEdit: shipper
        });
        window.$('#modal-edit-shipper-info').modal('show');
    }

    const handleConfirmShipper = (dataUser) => {
        props.createShipper({dataUser: dataUser});
        // console.log(dataUser);
    }

    const handleShowCalendar = (shipper) => {
        // setState({
        //     ...state,
        //     shipperCalendarInfo: shipper,
        //     isShowCalendar: true
        // });
        let dataCalendar = [
            {endDate: "19-08-2022", endTime: "11:50 AM", nameField: "Journey 1", startDate: "19-08-2022", startTime: "7:15 AM", workAssignmentStaffs: ['62db721767de64656d83ff94']}
        ];
        setState({
            ...state,
            shipperCalendarInfo: dataCalendar
        })
        window.$('#modal-calendar-shipper-info').modal('show');
    }


    let lists = [], totalPage = 0;

    if (shipper.lists) {
        lists = shipper.lists.map((driver) => {
            let listLicenseText = "";
            if (driver.drivingLicense) {
                driver.drivingLicense.forEach((license) => listLicenseText+= `Hạng ${license}, `);
                listLicenseText = listLicenseText.slice(0, -2);
            }
            return {
                _id: driver._id,
                name: driver?.driver?.fullName,
                email: driver?.driver?.emailInCompany,
                listLicense: listLicenseText,
                status: 2,
                salary: driver.salary,
                originalLicenses: driver.drivingLicense
            }
        })
    }
    if (shipper?.driversNotConfirm.length > 0) {
        let notConfirmShippers = shipper.driversNotConfirm;
        notConfirmShippers.forEach((shipper) => {
            lists.push({
                _id: shipper._id,
                name: shipper.name,
                email: shipper.email,
                status: 1
            })
        });
    }
    totalPage = totalPage = ((shipper.totalList % perPage) === 0) ?
    parseInt(shipper.totalList  / perPage) :
    parseInt((shipper.totalList  / perPage) + 1);

    const itemSelectSearchingLicense = [
        {value: 'A2', text: "Bằng xe máy A2"},
        {value: 'B1', text: "Bằng ô tô hạng B1"},
        {value: 'B2', text: "Bằng ô tô hạng B2"},
        {value: 'C', text: "Bằng ô tô hạng C"},
        {value: 'FB1', text: "Bằng ô tô hạng FB1"},
        {value: 'FB2', text: "Bằng ô tô hạng FB2"},
        {value: 'FC', text: "Bằng ô tô hạng FC"},
    ]



    return (
        <React.Fragment>
            {
                <ShipperEditForm
                    shipperEdit={shipperEdit}
                />
            }
            {
                isShowCalendar && <></>
            }
            <ShipperCalendar
                dataChart={shipperCalendarInfo}
                // dataChart={dataCalendar}
            />
            <div className="box-body qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_transportation.shipper.searching_license')}</label>
                        <SelectMulti
                            id={`select-license-to-search`}
                            className="form-control select2"
                            multiple="multiple"
                            options={{ nonSelectedText: translate('production.request_management.select_status'), allSelectedText: translate('production.request_management.select_all') }}
                            style={{ width: "100%" }}
                            items={itemSelectSearchingLicense}
                            onChange={handleChangeSearchingLicense}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_transportation.shipper.shipper_name')}</label>
                        <input type="text" className="form-control" value={shipperName} name="shipperName" placeholder={translate('manage_transportation.shipper.shipper_name')} autoComplete="off" onChange={(e) => handleChangeSearchingName(e)}/>
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_transportation.shipper.searching_shipper')} onClick={handleSubmitSearch}>{translate('manage_example.search')}</button>
                    </div>
                </div>
                <table id={tableId} className="table table-striped table-bordered table-hover" style={{marginTop: "20px"}}>
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                            <th>{translate('manage_transportation.shipper.shipper_name')}</th>
                            {/* <th>{translate('manage_transportation.shipper.time_working_month')}</th>
                            <th>{translate('manage_transportation.shipper.number_order_deliveried')}</th>
                            <th>{translate('manage_transportation.shipper.rate_order_complete')}</th> */}
                            <th>{translate('manage_transportation.shipper.driver_license')}</th>
                            <th>{translate('manage_transportation.shipper.salary')}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_example.index'),
                                        translate('manage_transportation.shipper.shipper_name'),
                                        // translate('manage_transportation.shipper.time_working_month'),
                                        // translate('manage_transportation.shipper.number_order_deliveried'),
                                        // translate('manage_transportation.shipper.rate_order_complete'),
                                        translate('manage_transportation.shipper.driver_license'),
                                        translate('manage_transportation.shipper.salary'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(lists && lists.length !== 0) &&
                            lists.map((driver, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * state.perPage}</td>
                                    <td>{driver.name}</td>
                                    {/* <td>{driver?.timeWorkingInMonth}</td>
                                    <td>{driver?.orderDelivered}</td>
                                    <td>{driver?.rateDeliveryComplete}</td> */}
                                    <td>
                                        {driver?.listLicense}
                                    </td>
                                    <td>{driver?.salary}</td>
                                    <td style={{ textAlign: "center" }}>
                                        { driver?.status == 1 &&
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_transportation.shipper.approve')} onClick={() => handleConfirmShipper(driver)}><i className="material-icons">check_circle</i></a>
                                        }
                                        { driver?.status == 2 &&
                                            <>
                                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_transportation.shipper.edit_info')} onClick={() => handleEdit(driver)}><i className="material-icons">edit</i></a>
                                                <a style={{ width: '5px' }} title={translate('manage_transportation.shipper.edit_info')} onClick={() => handleShowCalendar(driver)}><i className="material-icons">event</i></a>
                                            </>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {user.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    func={setPage}
                    display={lists && lists.length !== 0 && lists.length}
                    total={user && user.totalDocs}
                />
            </div>
        </React.Fragment>
    )

}


function mapStateToProps(state) {
    const user = state.user;
    const shipper = state.shipper;
    return { user, shipper }
}

const mapDispatchToProps = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
    createShipper: ShipperActions.createShipper,
    getAllShipperWithCondition: ShipperActions.getAllShipperWithCondition,
    getAllDriversNotConfirm: ShipperActions.getAllDriversNotConfirm
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ShipperManagementTable));