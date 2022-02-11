import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti, ExportExcel, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';

import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom, EmployeeImportForm } from './combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { CareerReduxAction } from '../../../career/redux/actions';
import { MajorActions } from '../../../major/redux/actions';
import { SearchDataImportForm } from './searchDataImportForm';
import { CertificateActions } from '../../../certificate/redux/actions';
import { BiddingPackageManagerActions } from '../../../biddingPackage/biddingPackageManagement/redux/actions';


const SearchEmployeeForPackage = (props) => {

    const [state, setState] = useState({
        status: 'active',
        package: null,
        keyPeopleRequires: {},
        page: 0,
        limit: 5,
        keyPeople: []
    })

    const [keyPeople, setKeyPeople] = useState([])

    useEffect(() => {
        props.getListMajor({ name: '', page: 1, limit: 1000 });
        props.getListCareerPosition({ name: '', page: 1, limit: 1000 });
        props.getListCertificate({ name: '', page: 1, limit: 1000 });
        props.getAllBiddingPackage({ name: '', page: 1, limit: 1000 });
    }, [])

    useEffect(() => {
        setState({
            ...state,
            keyPeople: props.employeesManager.listEmployeesPackage
        })
    }, [props.employeesManager.listEmployeesPackage])

    useEffect(() => {
        setState({
            ...state,
            keyPeopleRequires: {},
            page: 0,
            limit: 5,
            keyPeople: []
        })
    }, [state.package])

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
        window.$(`#modal-detail-employee${value._id}`).modal('show');
    }

    const handleKpiForManager = async (value) => {
        await setState(state => {
            return {
                ...state,
                kpiForManager: !state.kpiForManager
            }
        });
        window.$(`#modal-detail-employee${value._id}`).modal('show');
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
     */
    const handleEdit = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$(`#modal-edit-employee${value._id}`).modal('show');
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id đơn vị
     */
    const handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        setState({
            ...state,
            organizationalUnits: value
        })
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id trình độ
     */
    const handleChangeBiddingPackage = async (value) => {
        if (value.length === 0) {
            value = null
        };

        let a = props.biddingPackagesManager?.listBiddingPackages?.filter(x => x._id == value[0])
        console.log("biddingPackagesManager", a[0])

        setState({
            ...state,
            package: value[0],
            keyPeopleRequires: a[0]?.keyPersonnelRequires
        })

        // console.log("value", state)
    }

    const updateSearchData = async (data) => {
        setState({
            ...state,
            package: data.package,
        });
    }

    const setLimitTable = (limit) => {
        setState({...state, limit: limit});
    }

    /** Function bắt sự kiện tìm kiếm */
    const handleSunmitSearch = async () => {
        console.log("state", state)
        props.searchForPackage({ status: state.status, package: state.package });
    }

    /** Function bắt sự kiện tìm kiếm */
    const handleSunmit = async () => {
        let keyPeople = state.keyPeople.map(item => ({ "careerPosition": item?.careerPosition, "employees": item?.employees}))
        console.log("id", state.package)
        console.log("keyPeople", keyPeople)
        props.updateBiddingPackage(state.package, { addEmployeeForPackage: 1, keyPeople: keyPeople });

    }
    
    console.log('oppend', state);
    const { employeesManager, translate, career, major, certificate, biddingPackagesManager } = props;

    const listBiddingPackages = biddingPackagesManager?.listBiddingPackages;
    
    const { importEmployee, limit, page, currentRow, currentRowView } = state; // filterField, filterPosition, filterAction, 
    
    let listEmployees = [];
    if (employeesManager.listEmployees) {
        listEmployees = employeesManager.listEmployees;
    }

    let pageTotal = ((employeesManager.totalList % limit) === 0) ?
    parseInt(employeesManager.totalList / limit) :
    parseInt((employeesManager.totalList / limit) + 1);
    let currentPage = parseInt((page / limit) + 1);
    
    let listPosition = career?.listPosition?.listPosition;
    
    const listMajor = major.listMajor;
    const listCertificate = certificate.listCertificate;
    
    let professionalSkillArr = [
        { value: 1, text: "Trung cấp" },
        { value: 2, text: "Cao đẳng" },
        { value: 3, text: "Đại học" },
        { value: 4, text: "Cử nhân" },
        { value: 5, text: "Kỹ sư" },
        { value: 6, text: "Thạc sĩ" },
        { value: 7, text: "Tiến sĩ" },
        { value: 0, text: "Không có" },
    ];

    // Filter danh sách
    let filterPosition = listPosition;

    let posCodeArr = [];
    let dataTreePosition = [];

    // console.log('listEmployees', listEmployees);
    // console.log('listEmployeesPackage', employeesManager.listEmployeesPackage);
    // console.log('careerPosition', career);
    // console.log('major', major);
    // console.log('certificate', certificate);
    let listEmployeesPackage = employeesManager.listEmployeesPackage;

    return (
        <div className="box">
            <div className="box-body qlcv">

                <div className="form-inline" style={{ marginBottom: 15 }}>
                    {/* Tên gói thầu */}
                    <div className="form-group">
                        <label className="form-control-static">Chọn gói thầu</label>
                        <SelectBox
                        id={`package`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={listBiddingPackages?.map(x => {
                            return { text: x.name, value: x._id }
                        })}
                        options={{ placeholder: "Chọn gói thầu" }}
                        onChange={handleChangeBiddingPackage}
                        value={state.package}
                        multiple={false}
                    />
                    </div>
                    {/* Button tìm kiếm */}
                    <div className="form-group">
                        <label>
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={handleSunmitSearch} >{translate('general.search')}</button>
                        </label>
                    </div>
                </div>

                {
                    state.keyPeople && state.keyPeopleRequires && employeesManager.isSearchComplete && state.keyPeople.map((item, index) => (
                        <section className="col-lg-12 col-md-12" key={`section-${index}`}>
                            <div className="box">
                                <div className="box-header with-border">
                                    <p data-toggle="collapse" data-target={`#employee-table-${index}`} aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                                        window.$( `#arrow-up-${index}` ).toggle();
                                        window.$( `#arrow-down-${index}` ).toggle();
                                    }}>
                                    <span id={`arrow-up-${index}`} className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                        {`keyboard_arrow_up`}
                                    </span>
                                    <span id={`arrow-down-${index}`} className="material-icons" style={{ display: 'none', fontWeight: "bold", marginRight: '10px' }}>
                                        {`keyboard_arrow_down`}
                                    </span>
                                    Vị trí công việc: { `${career?.listPosition?.listPosition?.filter(x => x._id == item.careerPosition)[0]?.name}` }</p>
                                </div>
                                <div className="box-body collapse" data-toggle="collapse" id={`employee-table-${index}`}>

                                    <div className="box-body" style={{ border: '1px solid #ccc', marginBottom: '10px' }}>
                                        <div className="row" style={{ marginTop: '15px' }}>
                                            <div className="form-group col-md-6">
                                                <strong>Vị trí công việc&emsp; </strong>
                                                {career?.listPosition?.listPosition?.filter(x => x._id == state.keyPeopleRequires?.[index]?.careerPosition).map(y => y.name)}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <strong>Số lượng&emsp; </strong>
                                                {state.keyPeopleRequires?.[index]?.count}
                                            </div>
                                        </div>

                                        <div className="row" style={{ marginTop: '15px' }}>
                                            <div className="form-group col-md-6">
                                                <strong>Chuyên ngành&emsp; </strong>
                                                {listMajor.filter(x => x._id == state.keyPeopleRequires?.[index]?.majors ).map(y => y.name)}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <strong>Trình độ chuyên môn&emsp; </strong>
                                                { state.keyPeopleRequires?.[index]?.professionalSkill ? professionalSkillArr.filter(x => x.value == state.keyPeopleRequires?.[index]?.professionalSkill).map(y => y.text) : 'Không có'}
                                            </div>
                                        </div>

                                        <div className="row" style={{ marginTop: '15px' }}>
                                            <div className="form-group col-md-6">
                                                <strong>Năm kinh nghiệm&emsp; </strong>
                                                {state.keyPeopleRequires?.[index]?.numberYearsOfExperience}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <strong>Thời gian làm việc ở vị trí tương đương&emsp; </strong>
                                                { state.keyPeopleRequires?.[index]?.experienceWorkInCarreer}
                                            </div>
                                        </div>

                                        <div className="row" style={{ marginTop: '15px' }}>
                                            <div className="form-group col-md-6">
                                                <strong>Số dự án tối thiểu ở vị trí tương đương&emsp; </strong>
                                                {state.keyPeopleRequires?.[index]?.numblePackageWorkInCarreer}
                                            </div>
                                            <div className="form-group col-md-6">
                                                <strong>Thời gian làm việc ở vị trí tương đương&emsp; </strong>
                                                { state.keyPeopleRequires?.[index]?.experienceWorkInCarreer}
                                            </div>
                                        </div>

                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border">
                                                <h4 className="box-title">Yêu cầu chứng chỉ- bằng cấp</h4>
                                            </legend>
                                            
                                            <div className="row">
                                                <div className="form-group col-md-12">
                                                    <label >Danh sách chứng chỉ - bằng cấp</label>
                                                    <SelectBox
                                                        id={`certificate-${index}`}
                                                        lassName="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={listCertificate?.map(x => {
                                                            return { text: x.name, value: x._id }
                                                        })}
                                                        options={{ placeholder: "Chọn chứng chỉ - bằng cấp" }}
                                                        value={state.keyPeopleRequires?.[index]?.certificateRequirements?.certificates}
                                                        multiple={true}
                                                    />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label >Số chứng chỉ tối thiểu</label>
                                                    <input type="number" className="form-control" name="count" value={state.keyPeopleRequires?.[index]?.certificateRequirements?.count} autoComplete="off" disabled={true}/>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <table key={`table-${index}`} className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>{translate('human_resource.staff_name')}</th>
                                                <th>Vị trí công việc</th>
                                                <th>Trình độ chuyên môn</th>
                                                <th>Chuyên ngành</th>
                                                <th>Chứng chỉ</th>
                                                <th>Bằng cấp</th>
                                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                                    <DataTableSetting
                                                        tableId="employee-table"
                                                        columnArr={[
                                                            translate('human_resource.staff_name'),
                                                            "Vị trí công việc",
                                                            "Trình độ chuyên môn",
                                                            "Chuyên ngành",
                                                            "Chứng chỉ",
                                                            "Bằng cấp",
                                                        ]}
                                                        limit={state.limit}
                                                        setLimit={setLimitTable}
                                                        hideColumnOption={true}
                                                    />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.employees && item.employees.length !== 0 &&
                                                item.employees.map((x, index) => (
                                                    <tr key={index}>
                                                        <td>{x.fullName}</td>
                                                        <td>
                                                            {x.careerPositions?.length > 0 ? (x.careerPositions?.map((e, key) => {
                                                                return <li key={key}> {e?.careerPosition?.name} {e?.startDate ? "- Ngày bắt đầu: "+formatDate(e?.startDate) : ""} {e?.endDate ? "- Ngày kết thúc: "+formatDate(e?.endDate) : ""} </li>
                                                            })) : <p>Chưa có dữ liệu</p>
                                                            }
                                                        </td>
                                                        <td>{x.professionalSkill}</td>
                                                        <td>{x.degrees?.length > 0 ? (x.degrees?.map((e, key) => {
                                                            return <li key={key}> {e?.major?.name ? e?.major?.name : ""} </li>
                                                        })) : <p>Chưa có dữ liệu</p>}
                                                        </td>
                                                        <td>
                                                            {x.certificates?.length > 0 ? x.certificates?.map((e, key) => {
                                                                return <li key={key}> {e.certificate?.name}{e.certificate?.abbreviation ? "("+e.certificate?.abbreviation+")" : ""} - {e?.issuedBy} - hiệu lực: {formatDate(e?.endDate)} </li>
                                                            }) : <p>Chưa có dữ liệu</p>}
                                                        </td>
                                                        <td>
                                                            {x.degrees.length > 0 ? x.degrees?.map((e, key) => {
                                                                return <li key={key}> {formatDate(e?.year)} - {e?.name} - Loại: {e?.degreeType} - Chuyên ngành: {e.major?.name} - Bậc: {e.degreeQualification}</li>
                                                            }) : <p>Chưa có dữ liệu</p>}
                                                        </td>
                                                        <td>
                                                            <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </section>
                    )) 
                }

                {
                    employeesManager.isSearchComplete === 0 && (
                        <section className="col-lg-12 col-md-12">
                            <div className="box" style={{ padding: "20px", fontWeight: "bold", marginRight: '10px' }}>
                                Không đủ điều kiện tham gia dự thầu
                            </div>
                        </section>
                    )
                }

                {
                    employeesManager.isSearchComplete === 1 && state.keyPeople.length != 0 && (
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12" style={{ marginBottom: 15, marginRight: 20 }}>
                                <button type="button" className="btn btn-success pull-right" style={{ marginBottom: 15, marginRight: 20 }} title={translate('general.save')} onClick={handleSunmit} >{translate('general.save')}</button>
                            </div>
                        </div>
                    )
                }

                {employeesManager.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listEmployees || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

            </div>
            {/* From thêm mới thông tin nhân viên */}
            <EmployeeCreateForm />

            {/* From import thông tin nhân viên*/
                importEmployee && <EmployeeImportForm />
            }

            {/* From xem thông tin nhân viên */
                <EmployeeDetailForm
                    _id={currentRowView ? currentRowView._id : ""}
                />
            }
            {/* From chinh sửa thông tin nhân viên */
                <EmployeeEditFrom
                    _id={currentRow ? currentRow._id : ""}
                />
            }
            {/** modal import - export */
                state.importSearch && <SearchDataImportForm updateSearchData={updateSearchData} />
            }
        </div>
    );
}

function mapState(state) {
    const { employeesManager, department, career, major, certificate, biddingPackagesManager } = state;
    return { employeesManager, department, career, major, certificate, biddingPackagesManager };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    getListMajor: MajorActions.getListMajor,
    getListCertificate: CertificateActions.getListCertificate,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    searchForPackage: EmployeeManagerActions.searchForPackage,
    deleteEmployee: EmployeeManagerActions.deleteEmployee,
    getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
    updateBiddingPackage: BiddingPackageManagerActions.updateBiddingPackage
};

export default connect(mapState, actionCreators)(withTranslate(SearchEmployeeForPackage));