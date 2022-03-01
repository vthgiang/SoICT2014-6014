import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, DataTableSetting, DatePicker, SelectBox } from '../../../../../common-components';

function KeyPeople(props) {
    const [state, setState] = useState({
        keyPeople: []
    });

    const [list, setList] = useState([{
        careerPosition: '',
        majors: [],
        count: 0,
        numberYearsOfExperience: 0,
        experienceWorkInCarreer: 0,
        numblePackageWorkInCarreer: 0,
        certificateRequirements: {
            certificates: [],
            count: 0,
            certificatesEndDate: ''
        }
    }])
    
    const { translate, listMajor, listCareer, listCertificate, keyPersonnelRequires } = props;
    const { id,  biddingPackage, keyPeople } = state;

    useEffect(() => {
        setState(state => {
                return {
                    ...state,
                    keyPeople : list
                }
        })

    }, [list])

    useEffect(() => {
        
        if (props.biddingPackage) {
            setState(state => {
                return {
                    ...state,
                    id: props.id,
                    keyPeople: props.biddingPackage ? props.biddingPackage.keyPeople : [],
                    keyPeopleRequires: props.biddingPackage ? props.biddingPackage.keyPersonnelRequires : []
                }
            })

            setList(props.biddingPackage ? props.biddingPackage.keyPeople : [])
        }
    }, [])

    useEffect(() => {
        
        if (props.biddingPackage) {
            setState(state => {
                return {
                    ...state,
                    id: props.id,
                    keyPeople: props.biddingPackage ? props.biddingPackage.keyPeople : []
                }
            })

            setList(props.biddingPackage ? props.biddingPackage.keyPeople : [])
        }
    }, [props.id, props.biddingPackage])


    /** Function lưu các trường thông tin vào state */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => {
            return {
                ...state,
                [name]: value,
            }
        })
        props.handleChange(name, value);
    }

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
            return date;
        }
    }

    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleCareer = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    careerPosition: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPeople", newList);
    }

    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleCount = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    count: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPeople", newList);
    }

    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleYearOfExperiment = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    numberYearsOfExperience: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPeople", newList);
    }
    
    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleExperimentWorkInCareer = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    experienceWorkInCarreer: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPeople", newList);
    }

    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleNumberBiddingPackageInCareer = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    numblePackageWorkInCarreer: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPeople", newList);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    const handleMajor = (value, listIndex) => {

        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    majors: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPeople", newList);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    const handleCertificates = (value, listIndex) => {

        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    certificateRequirements: {
                        ...item.certificateRequirements,
                        certificates: value
                    }
                }
            }
            return item;
        })
        setList(newList);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    const handleCertificateCount = (e, listIndex) => {
        let { value } = e.target;

        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    certificateRequirements: {
                        ...item.certificateRequirements,
                        count: value
                    }
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPeople", newList);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    const handleCertificateEndDate = (value, listIndex) => {
        if (value) {
            let partValue = value.split('-');
            let endDate = [partValue[2], partValue[1], partValue[0]].join('-');

            let newList = list.map((item, index) => {
                if (index === listIndex) {
                    return {
                        ...item,
                        certificateRequirements: {
                            ...item.certificateRequirements,
                            certificatesEndDate: endDate
                        }
                    }
                }
                return item;
            })

            setList(newList);
            props.handleChange("keyPeople", newList);
        }
    }

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

    const handleView = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRowView: value
            }
        });
        window.$(`#modal-detail-employee${value._id}`).modal('show');
    }

    console.log("biddingPackage", biddingPackage)
    console.log("state", state)

    return (
        <div id = {id} className="tab-pane">
            <div className="box-body qlcv">
                {
                    state.keyPeople && state.keyPeopleRequires && state.keyPeopleRequires.map((x, index) => 
                        {
                            let item = state.keyPeople?.[index] ? state.keyPeople?.[index] : [];
                            return (
                            
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
                                            Vị trí công việc: { `${listCareer?.filter(x => x._id == item.careerPosition)[0]?.name}` }</p>
                                        </div>
                                        <div className="box-body collapse" data-toggle="collapse" id={`employee-table-${index}`}>
                                            <div className="col-lg-12 col-md-12 col-sm-12" style={{marginTop: "10px", padding: '10px'}}>
                                                {/* Button thêm mới nhân viên */}
                                                <div className="dropdown">
                                                    <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title="Thêm gói thầu" >Thêm nhân viên</button>
                                                </div>
                                                {/* <button type="button" style={{ marginRight: 15, marginTop: 0 }} className="btn btn-primary pull-right" onClick={handleExportExcel} >{translate('human_resource.name_button_export')}<i className="fa fa-fw fa-file-excel-o"> </i></button> */}
                                            </div>
                                            
                                            <table key={`table-${index}`} className="table table-striped table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>{translate('human_resource.staff_name')}</th>
                                                        <th>Vị trí công việc</th>
                                                        <th>Trình độ chuyên môn</th>
                                                        <th>Chuyên ngành</th>
                                                        <th>Chứng chỉ</th>
                                                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                                            {/* <DataTableSetting
                                                                tableId="employee-table"
                                                                columnArr={[
                                                                    translate('human_resource.staff_name'),
                                                                    "Vị trí công việc",
                                                                    "Trình độ chuyên môn",
                                                                    "Chuyên ngành",
                                                                    "Chứng chỉ",
                                                                    "Bằng cấp",
                                                                ]}
                                                                limit={500}
                                                                hideColumnOption={true}
                                                            /> */}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.employees && item.employees.length !== 0 &&
                                                        item.employees.map((x, index) => {
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
                                                                <tr key={index}>
                                                                    <td>{x.fullName}</td>
                                                                    <td>
                                                                        {x.careerPositions?.length > 0 ? (x.careerPositions?.map((e, key) => {
                                                                            return <li key={key}> {listCareer?.filter(x => x._id == item.careerPosition)[0]?.name} {e?.startDate ? "- Ngày bắt đầu: "+formatDate(e?.startDate) : ""} {e?.endDate ? "- Ngày kết thúc: "+formatDate(e?.endDate) : ""} </li>
                                                                        })) : <p>Chưa có dữ liệu</p>
                                                                        }
                                                                    </td>
                                                                    <td>{professionalSkill}</td>
                                                                    <td>
                                                                        {x.degrees.length > 0 ? x.degrees?.map((e, key) => {
                                                                            let degreeQualification = ''
                                                                            if (e.degreeQualification) {

                                                                                degreeQualification = professionalSkillArr.find(item => item.value == e.degreeQualification).text
                                                                            } else {
                                                                                degreeQualification = "Không có"
                                                                            }
                                                                            let degreeMajor = ''
                                                                            if (e.major) {

                                                                                degreeMajor = listMajor?.find(item => item._id == e.major)?.name
                                                                            } else {
                                                                                degreeMajor = "Không có"
                                                                            }
                                                                            if (!degreeMajor) return
                                                                            else
                                                                            return <li key={key}> {degreeMajor} ({degreeQualification} - {formatDate(e?.year)})</li>
                                                                        }) : <p>Chưa có dữ liệu</p>}
                                                                    </td>
                                                                    <td>
                                                                        {x.certificates?.length > 0 ? x.certificates?.map((e, key) => {
                                                                            let certificate = listCertificate.find(x => x._id == e.certificate)
                                                                            return <li key={key}> {certificate?.name}{certificate?.abbreviation ? "("+e.certificate?.abbreviation+")" : ""} - {e?.issuedBy} - hiệu lực: {formatDate(e?.endDate)} </li>
                                                                        }) : <p>Chưa có dữ liệu</p>}
                                                                    </td>
                                                                    <td>
                                                                        <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
                                                                        <ConfirmNotification
                                                                            icon="question"
                                                                            title="Xóa nhân viên"
                                                                            name="delete"
                                                                            className="text-red"
                                                                            content={`<h4>Delete ${x.fullName} ?</h4>`}
                                                                            func={() => props.deleteBiddingPackage(x._id)}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        )}
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>
                                </section>
                            );
                        }
                    ) 
                }

                {/* {
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
                } */}

                {/* {employeesManager.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listEmployees || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                } */}

            </div>
            {/* From thêm mới thông tin nhân viên */}
            {/* <EmployeeCreateForm /> */}

            {/* From import thông tin nhân viên*/
                // importEmployee && <EmployeeImportForm />
            }

            {/* From xem thông tin nhân viên */
                // <EmployeeDetailForm
                    // _id={currentRowView ? currentRowView._id : ""}
                // />
            }
            {/* From chinh sửa thông tin nhân viên */
                // <EmployeeEditFrom
                //     _id={currentRow ? currentRow._id : ""}
                // />
            }
            {/** modal import - export */
                // state.importSearch && <SearchDataImportForm updateSearchData={updateSearchData} />
            }
        </div>
    );
};

const  mapState = state => state;

const keyPeople = connect(mapState, null)(withTranslate(KeyPeople));
export { keyPeople as KeyPeople };