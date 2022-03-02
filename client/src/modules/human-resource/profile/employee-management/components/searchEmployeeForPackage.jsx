import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti, ExportExcel, DatePicker, SelectBox, TreeSelect, ConfirmNotification } from '../../../../../common-components';

import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom, EmployeeImportForm,SearchEmployeeByCareerPositionTab } from './combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { CareerReduxAction } from '../../../career/redux/actions';
import { MajorActions } from '../../../major/redux/actions';
import { SearchDataImportForm } from './searchDataImportForm';
import { CertificateActions } from '../../../certificate/redux/actions';
import { BiddingPackageManagerActions } from '../../../bidding-package/biddingPackageManagement/redux/actions';
import { assign } from 'lodash';
import { RoleActions } from '../../../../super-admin/role/redux/actions';


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
        let listRoles = role?.list.filter(x => x.type.name !== "Root");
        props.getListMajor({ name: '', page: 0, limit: 1000 });
        props.getListCareerPosition({ name: '', page: 0, limit: 1000 });
        props.getListCertificate({ name: '', page: 0, limit: 1000 });
        props.getAllBiddingPackage({ name: '', page: 0, limit: 1000 });
    }, [])

    useEffect(() => {
        setState({
            ...state,
            keyPeople: props.employeesManager.listEmployeesPackage,
            // listPeople = 
        })
    }, [props.employeesManager.listEmployeesPackage])

    useEffect(() => {
        let value = []; 
        if (state.keyPeople)
            state.keyPeople.forEach(item => item.employees.forEach(x => value.push(x._id)))
        setState({
            ...state,
            listPeople: value,
        })
    }, [state.keyPeople])

    useEffect(() => {
        let a = props.biddingPackagesManager?.listBiddingPackages?.filter(x => x._id == state.package)
        setState({
            ...state,
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

    const handleChangeEmployee = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRowView: value,
                keySearch: state.keyPeopleRequires[index]
            }
        });
        window.$(`#modal-change-employee-package${value._id}`).modal('show');
    }

    const handleKeyPeople = async (id, value) => {
        let a = state.keyPeople.map(item => {
            return {
                ...item,
                employees: item.employees.map(x => {
                    if(x._id == id) return value
                    else return x
                })
            }
        });
       
        await setState(state => {
            return {
                ...state,
                keyPeople: a
            }
        });
        window.$(`#modal-change-employee-package${value._id}`).modal('show');
    }


    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id trình độ
     */
    const handleChangeBiddingPackage = (value) => {
        if (value.length === 0) {
            value = null
        };

        let a = props.biddingPackagesManager?.listBiddingPackages?.filter(x => x._id == value[0])

        setState({
            ...state,
            package: value[0],
            keyPeopleRequires: a[0]?.keyPersonnelRequires
        })
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
        props.searchForPackage({ status: state.status, package: state.package });
    }

    /** Function bắt sự kiện tìm kiếm */
    const handleSunmit = async () => {
        let keyPeople = state.keyPeople.map(item => ({ "careerPosition": item?.careerPosition, "employees": item?.employees.map(x => x._id)}))
        props.updateBiddingPackage(state.package, { addEmployeeForPackage: 1, keyPeople: keyPeople });

    }

    const handleDeleteEmployeeInPackage =  (id, ind) => {
        let key = state.keyPeople?.map((value, index) => {
            if (index == ind) return {
                careerPosition: value.careerPosition,
                employees: value?.employees.filter(item => item._id != id)
            } 

            return value
        });
        setState({
            ...state,
            keyPeople: key
        })
    }
    
    console.log('oppend', state);
    const { employeesManager, translate, career, major, certificate, biddingPackagesManager, role } = props;

    let listRoles = role?.list.filter(x => x.type.name !== "Root");

    const listBiddingPackages = biddingPackagesManager?.listBiddingPackages;
    
    const { importEmployee, limit, page, currentRow, currentRowView } = state; // filterField, filterPosition, filterAction, 
    
    let listEmployees = [];
    if (employeesManager.listEmployees) {
        listEmployees = employeesManager.listEmployees;
    }
    
    const listMajor = major.listMajor;
    const listCertificate = certificate.listCertificate;
    
    let professionalSkillArr = [
        { value: null, text: "Chọn trình độ" },
        { value: 1, text: "Trình độ phổ thông" },
        { value: 2, text: "Trung cấp" },
        { value: 3, text: "Cao đẳng" },
        { value: 4, text: "Đại học / Cử nhân" },
        { value: 5, text: "Kỹ sư" },
        { value: 6, text: "Thạc sĩ" },
        { value: 7, text: "Tiến sĩ" },
        { value: 8, text: "Giáo sư" },
        { value: 0, text: "Không có" },
    ];
    
    const convertDataExport = () => {
        let datas = [];
        let experiencesSheet = [];
        let professionalExperienceSheet = [];
        let contactName = props.auth?.user?.name;
        let contactNumber = props.auth?.user?.phoneNumber;
        let contactEmail = props.auth?.user?.email;

        let { keyPeople } = state;
        if (keyPeople) {
            let stt1 = 0;
            let stt2 = 0;
            let stt3 = 0;
            keyPeople.map((o, index) => {
                return o.employees?.map(item => {
                    let position = career?.listPosition?.filter(x => x._id == o.careerPosition)[0].name
                    stt1 = stt1 + 1;
                    datas.push( {
                        STT: stt1, 
                        name: item.fullName,
                        position: position,
                    })
                })
            })

            keyPeople.map((o, index) => {
                return o.employees?.map(item => {
                    let position = career?.listPosition?.filter(x => x._id == o.careerPosition)[0].name;
                    let roles = ''
                    for  (let i of item.roles) {
                        if (roles != '') {
                            roles = roles + ', '
                        }
                        roles = roles + i.roleId.name
                    }
                    let professionalSkill = 0
                    if (item.degrees) {
                        for(let y of item.degrees) {
                            if (state.keyPeopleRequires?.[index]?.majors && y.majors) {
                                if (state.keyPeopleRequires?.[index]?.majors?.includes(y.majors) && y.degreeQualification > professionalSkill)
                                    professionalSkill = y.degreeQualification
                            } else if (y.major) {
                                if (y.degreeQualification > professionalSkill) professionalSkill = y.degreeQualification
                            }
                        }
                    }

                    let currentDate = new Date();
                    let timeWorking = 0;
                    timeWorking = Math.round((Math.abs(new Date(item.startingDate) - currentDate)/(1000 * 60 * 60 * 24 * 365)) * 2 ) / 2

                    professionalSkill = professionalSkillArr.find(item => item.value == professionalSkill).text ? professionalSkillArr.find(item => item.value == professionalSkill).text : "Không có"
                    stt2 = stt2 + 1;
                    experiencesSheet.push( {
                        STT: stt2, 
                        name: item.fullName,
                        identityCardNumber: item.identityCardNumber,
                        position: position,
                        roles: roles,
                        birthdate: formatDate(item.birthdate),
                        professionalSkill: professionalSkill,
                        type: "Nhân sự công ty",
                        workingYear: timeWorking,
                        status: item.status == 'active' ? "Còn hiệu lực" : "Hết hiệu lực",
                        directorName: "Vũ Thị Hương Giang",
                        directorAdress: "30 Tạ Quang Bửu, Bách Khoa, Hai Bà Trưng, Hà Nội, Việt Nam",
                        directorRole: "Giám đốc",
                        contactName: contactName,
                        contactNumber: contactNumber,
                        contactEmail: contactEmail,
                        contactFax: ''
                    })
                })
            })
            keyPeople.map((o, index) => {
                return o.employees?.map(item => {
                    return item.careerPositions?.map(x => {
                        let professionalExperience  = 'Công ty ' + `${x.company ? x.company : 'vnist'}` + '; Dự án ' + `${x.project ? x.project : ''}` + '; Vị trí công việc ' + `${x.careerPosition.name}` + '; Kinh nghiệm ' + `${x.professionalExperience ? x.professionalExperience : ''}`;

                        stt3 = stt3 + 1
                        professionalExperienceSheet.push( {
                            STT: stt3,
                            name: item.fullName,
                            identityCardNumber: item.identityCardNumber,
                            startDate: formatDate(x.startDate),
                            endDate: formatDate(x.endDate),
                            professionalExperience: professionalExperience
                        })
                    })
                    
                })
            })
        }

        
        let res = {
            fileName: "Nhân sự chủ chốt",
            dataSheets: [
                {
                    sheetName: "Bảng đề xuất nhân sự chủ chốt",
                    tables: [{
                        rowHeader: 1,
                        merges: [2],
                        columns: [
                            { key: "STT", value: "STT", width: 7 },
                            { key: "name", value: "Họ và tên", width: 36 },
                            { key: "position", value: "Vị trí công việc", width: 36 },
                        ],
                        data: datas
                    }]
                },
                {
                    
                    sheetName: "Sơ yếu lí lịch nhân sự chủ chốt",
                    tables: [{
                        merges: [
                            {
                                key: "position",
                                columnName: "Thông tin nhân sự",
                                keyMerge: "identityCardNumber",
                                colspan: 7
                            },
                            {
                                key: "director",
                                columnName: "Thông tin người sử dụng lao động",
                                keyMerge: "directorName",
                                colspan: 7
                            },
                        ],
                        rowHeader: 2,
                        styleColumn: {                                  
                            STT: {                                  // Khoá tương ứng của tiêu đề bảng (key)
                                vertical: 'middle',
                                horizontal: 'center'   
                            },
                            name: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            identityCardNumber: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            roles: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            birthdate: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            professionalSkill: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            type: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            workingYear: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            status: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                        },
                        columns: [
                            { key: "STT", value: "STT", width: 7 },
                            { key: "name", value: "Tên" },
                            { key: "identityCardNumber", value: "Số định danh/CMTND" },
                            { key: "roles", value: "Vị trí/ Chức danh nhân sự" },
                            { key: "birthdate", value: "Ngày, tháng, năm sinh" },
                            { key: "professionalSkill", value: "Trình độ chuyên môn"},
                            { key: "type", value: "Loại nhân sự"},
                            { key: "workingYear", value: "Số năm làm việc cho người sử dụng lao động hiện tại"},
                            { key: "status", value: "Trạng thái nhân sự"},
                            { key: "directorName", value: "Tên người sử dụng lao động"},
                            { key: "directorAdress", value: "Địa chỉ của người sử dụng lao động", width: 32},
                            { key: "directorRole", value: "Chức danh người sử dụng lao động"},
                            { key: "contactName", value: "Người liên lạc"},
                            { key: "contactNumber", value: "Điện thoại"},
                            { key: "contactEmail", value: "Email"},
                            { key: "contactFax", value: "Fax"},
                        ],
                        data: experiencesSheet
                    }]
                },
                {
                    
                    sheetName: "Bảng kinh nghiệm chuyên môn của nhân sự",
                    tables: [{
                        tableName: "Bảng Kinh nghiệm chuyên môn của nhân sự",
                        rowHeader: 1,
                        styleColumn: {                                  
                            STT: {                                  // Khoá tương ứng của tiêu đề bảng (key)
                                vertical: 'middle',
                                horizontal: 'center'   
                            },
                            name: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            identityCardNumber: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            startDate: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            endDate: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            professionalExperience: {
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                        },
                        columns: [
                            { key: "STT", value: "STT", width: 7 },
                            { key: "name", value: "Tên nhân sự" },
                            { key: "identityCardNumber", value: "Số định danh/CMTND" },
                            { key: "startDate", value: "Từ ngày" },
                            { key: "endDate", value: "Đến ngày" },
                            { key: "professionalExperience", value: "Công ty/Dự án/Vị trí công việc/Kinh nghiệm chuyên môn và quản lý có liên quan", width: 56},
                        ],
                        data: professionalExperienceSheet
                    }]
                }
            ],
        }
        return res;
    }

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
                    <div className="form-group pull-right" style={{padding: '6px 12px', margin: '5px'}}>
                        <ExportExcel id="download_template_search_package" type='link' exportData={convertDataExport()}
                        buttonName='Lưu hồ sơ nhân sự' />
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
                                    Vị trí công việc: { `${career?.listPosition?.filter(x => x._id == item.careerPosition)[0]?.name}` }</p>
                                </div>
                                <div className="box-body collapse" data-toggle="collapse" id={`employee-table-${index}`}>
                                    <div className="box-header with-border">
                                        <p data-toggle="collapse" data-target={`#employee-require-${index}`} aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                                            window.$( `#arrow-up-1-${index}` ).toggle();
                                            window.$( `#arrow-down-1-${index}` ).toggle();
                                        }}>
                                        <span id={`arrow-up-1-${index}`} className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {`keyboard_arrow_up`}
                                        </span>
                                        <span id={`arrow-down-1-${index}`} className="material-icons" style={{ display: 'none', fontWeight: "bold", marginRight: '10px' }}>
                                            {`keyboard_arrow_down`}
                                        </span>
                                        Yêu cầu chi tiết</p>
                                    </div>
                                    <div className="box-body collapse" data-toggle="collapse" id={`employee-require-${index}`} style={{ border: '1px solid #ccc', marginBottom: '10px' }}>
                                        <div className="row" style={{ marginTop: '15px' }}>
                                            <div className="form-group col-md-6">
                                                <strong>Vị trí công việc&emsp; </strong>
                                                {career?.listPosition?.filter(x => x._id == state.keyPeopleRequires?.[index]?.careerPosition).map(y => y.name)}
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
                                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.employees && item.employees.length !== 0 &&
                                                item.employees.map((x, index1) => {
                                                    let professionalSkill = 0
                                                    if (x.degrees) {
                                                        for(let y of x.degrees) {
                                                            if (state.keyPeopleRequires?.[index]?.majors && y.majors) {
                                                                if (state.keyPeopleRequires?.[index]?.majors?.includes(y.majors) && y.degreeQualification > professionalSkill)
                                                                    professionalSkill = y.degreeQualification
                                                            } else if (y.major) {
                                                                if (y.degreeQualification > professionalSkill) professionalSkill = y.degreeQualification
                                                            }
                                                        }
                                                    }

                                                    professionalSkill = professionalSkillArr.find(item => item.value == professionalSkill).text ? professionalSkillArr.find(item => item.value == professionalSkill).text : "Không có"


                                                    return (
                                                    <tr key={index1}>
                                                        <td>{x.fullName}</td>
                                                        <td>
                                                            {x.careerPositions?.length > 0 ? (x.careerPositions?.map((e, key) => {
                                                                return <li key={key}> {e?.careerPosition?.name} {e?.startDate ? "- Ngày bắt đầu: "+formatDate(e?.startDate) : ""} {e?.endDate ? "- Ngày kết thúc: "+formatDate(e?.endDate) : ""} </li>
                                                            })) : <p>Chưa có dữ liệu</p>
                                                            }
                                                        </td>
                                                        <td>{professionalSkill}</td>
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
                                                                let degreeQualification = ''
                                                                if (e.degreeQualification) {

                                                                    degreeQualification = professionalSkillArr.find(item => item.value == e.degreeQualification).text
                                                                } else {
                                                                    degreeQualification = "Không có"
                                                                }
                                                                return <li key={key}> {formatDate(e?.year)} - {e?.name} - Loại: {e?.degreeType} - Chuyên ngành: {e.major?.name} - Bậc: {degreeQualification}</li>
                                                            }) : <p>Chưa có dữ liệu</p>}
                                                        </td>
                                                        <td>
                                                            <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
                                                            <a onClick={() => handleChangeEmployee(x, index)} className="edit text-yellow" style={{ width: '5px' }} title="change-employee"><i className="material-icons">find_replace</i></a>
                                                        </td>
                                                    </tr>
                                                )})}
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
                    employeesManager.isSearchComplete === 1 && state.keyPeople?.length != 0 && (
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
                <SearchEmployeeByCareerPositionTab
                    _id={currentRowView ? currentRowView._id : ""}
                    listPeople={state.listPeople}
                    keySearch={state.keySearch}
                    handleChange={handleKeyPeople}
                />
            }
            {/** modal import - export */
                state.importSearch && <SearchDataImportForm updateSearchData={updateSearchData} />
            }
        </div>
    );
}

function mapState(state) {
    const { employeesManager, department, career, major, certificate, biddingPackagesManager, role, company, auth } = state;
    return { employeesManager, department, career, major, certificate, biddingPackagesManager, role, company, auth };
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
    updateBiddingPackage: BiddingPackageManagerActions.updateBiddingPackage,
    getAllRoles: RoleActions.get
};

export default connect(mapState, actionCreators)(withTranslate(SearchEmployeeForPackage));