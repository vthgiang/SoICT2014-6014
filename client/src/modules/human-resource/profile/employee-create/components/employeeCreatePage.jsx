import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import { GeneralTab, ContactTab, TaxTab, InsurranceTab, DisciplineTab, ExperienceTab, CertificateTab, ContractTab, SalaryTab, FileTab } from './combinedContent';
import FamilyMemberTab from './familyMemberTab';

import { EmployeeManagerActions } from '../../employee-management/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { generateCode } from "../../../../../helpers/generateCode";

const initMember = {
    name: '',
    codeSocialInsurance: '',
    bookNumberSocialInsurance: '',
    gender: 'male',
    isHeadHousehold: 'no',
    relationshipWithHeadHousehold: '',
    cnss: '',
    birth: '',
    placeOfBirthCertificate: '',
    nationality: '',
    nation: '',
    numberPassport: '',
    note: ''
}

function EmployeeCreatePage(props) {

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về yyyy-mm, false trả về yyyy-mm-dd
     */
    const formatDate2 = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear) {
                return [year, month].join('-');
            } else return [year, month, day].join('-');
        }
        return date;

    }

    const regenerateCode = () => {
        let code = generateCode("NV");
        let { employeeNumber, employeeTimesheetId } = state.employee;
        if (!employeeNumber && !employeeTimesheetId)
            setState(state => {
                return {
                    ...state,
                    employee: {
                        ...state.employee,
                        employeeNumber: code,
                        employeeTimesheetId: code,
                    }
                }
            });
    }

    const [state, setState] = useState({
        img: './upload/human-resource/avatars/avatar5.png',
        avatar: "",
        employee: {
            avatar: '/upload/human-resource/avatars/avatar5.png',
            gender: "male",
            maritalStatus: "single",
            educationalLevel: "",
            professionalSkill: "unavailable",
            status: 'active',
            identityCardDate: formatDate2(Date.now()),
            birthdate: formatDate2(Date.now()),
            employeeNumber: generateCode("NV"),
            employeeTimesheetId: generateCode("NV"),
            fullName: "",
            emailInCompany: "",
            identityCardNumber: "",
            identityCardAddress: "",
            phoneNumber: "",
            experiences: [],
            socialInsuranceDetails: [],
            degrees: [],
            certificates: [],
            contracts: [],
            files: [],
            disciplines: [],
            commendations: [],
            annualLeaves: [],
            courses: [],
            // career:[],
            // major:[],
            houseHold: {}
        },
        courses: [],
        degrees: [],
        certificates: [],
        contracts: [],
        files: [],
        disciplines: [],
        commendations: [],
        annualLeaves: [],
        // major: [],
        // career: [],
        houseHold: {
            headHouseHoldName: '',
            documentType: '',
            houseHoldNumber: '',
            city: '',
            district: '',
            ward: '',
            houseHoldAddress: '',
            phone: '',
            houseHoldCode: '',
            familyMembers: []
        },
        editMember: initMember,
    });

    const { img, avatar, employee, degrees, certificates, contracts, courses, commendations, disciplines, annualLeaves, files, houseHold, editMember } = state;

    useEffect(() => {
        props.getDepartment();
    }, [])

    useEffect(() => {
        regenerateCode();
    }, [])

    const { translate } = props;

    /**
     * Function upload avatar
     * @param {*} img : 
     * @param {*} avatar :
     */
    const handleUpload = (img, avatar) => {
        setState(state => {
            return {
                ...state,
                img: img,
                avatar: avatar
            }
        })
    }

    /**
     * Function lưu các trường thông tin vào state
     * @param {*} name : Tên trường
     * @param {*} value : Giá trị của trường
     */
    const handleChange = (name, value) => {
        const { employee } = state;
        if (name === 'startingDate' || name === 'leavingDate' || name === 'birthdate' || name === 'identityCardDate' ||
            name === 'taxDateOfIssue' || name === 'healthInsuranceStartDate' || name === 'healthInsuranceEndDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            }
        }
        setState(state => {
            return {
                ...state,
                employee: {
                    ...employee,
                    [name]: value
                }
            }
        });
    }

    /**
     * Function thêm mới kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} addData : Kinh nghiệm làm việc muốn thêm
     */
    const handleChangeExperience = (data, addData) => {
        const { employee } = state;
        setState(state => {
            return {
                ...state,
                employee: {
                    ...employee,
                    experiences: [...data]
                }
            }
        })
        console.log("exp", employee);
    }

    /**
     * Function thêm, chỉnh sửa thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} addData : Bằng cấp muốn thêm
     */
    const handleChangeDegree = (data, addData) => {
        setState(state => {
            return {
                ...state,
                degrees: data
            }
        })
        console.log('degrees', data)
    }

    /**
     * Function thêm, chỉnh sửa thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} addData : Chứng chỉ muốn thêm
     */
    const handleChangeCertificate = (data, addData) => {
        setState(state => {
            return {
                ...state,
                certificates: data
            }
        })
    }

    /**
     * Function thêm, chỉnh sửa thông tin quá trình đóng BHXH
     * @param {*} data : Dữ liệu thông tin quá trình đóng BHXH
     * @param {*} addData : Quá trình đóng BHXH muốn thêm
     */
    const handleChangeBHXH = (data, addData) => {
        const { employee } = state;
        setState(state => {
            return {
                ...state,
                employee: {
                    ...employee,
                    socialInsuranceDetails: data
                }
            }
        })
    }

    /**
     *Function thêm thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng
     * @param {*} addData : Hợp đồng muốn thêm
     */
    const handleChangeContract = (data, addData) => {
        setState(state => {
            return {
                ...state,
                contracts: data
            }
        })
    }

    /**
     * Function thêm thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} addData : Khen thưởng muốn thêm
     */
    const handleChangeConmmendation = (data, addData) => {
        setState(state => {
            return {
                ...state,
                commendations: data
            }
        })
        console.log("commen", data);
    }

    /**
     * Function thêm thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} addData : Kỷ luật muốn thêm
     */
    const handleChangeDiscipline = (data, addData) => {
        setState(state => {
            return {
                ...state,
                disciplines: data
            }
        })
        console.log("dis", data);
    }

    /**
     * Function thêm thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} addData : thông tin nghỉ phép muốn thêm
     */
    const handleChangeAnnualLeave = (data, addData) => {
        setState(state => {
            return {
                ...state,
                annualLeaves: data
            }
        })
    }

    /**
     * Function thêm thông tin tài liệu đính kèm
     * @param {*} data : Dữ liệu thông tin tài liệu đính kèm
     * @param {*} addData : Tài liệu đính kèm muốn thêm
     */
    const handleChangeFile = (data, addData) => {
        setState(state => {
            return {
                ...state,
                files: data
            }
        })
    }

    /**
     * Function thêm thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu thông tin quá trình đào tạo
     */
    const handleChangeCourse = (data) => {
        setState(state => {
            return {
                ...state,
                courses: data
            }
        })
    }

    // /**
    //  * Function thêm, chỉnh sửa thông tin chuyên ngành tương đương
    //  * @param {*} data : Dữ liệu thông tin chuyên ngành tương đương
    //  * @param {*} addData : Chuyên ngành tương đương muốn thêm
    //  */
    // const handleChangeMajor = (data, addData) => {
    //     setState(state => {
    //         return {
    //             ...state,
    //             major: data
    //         }
    //     })
    // }

    // /**
    //  * Function thêm, chỉnh sửa thông tin công việc tương đương
    //  * @param {*} data : Dữ liệu thông tin công việc tương đương
    //  * @param {*} addData : Công việc tương đương muốn thêm
    //  */
    // const handleChangeCareer = (data, addData) => {
    //     setState(state => {
    //         return {
    //             ...state,
    //             career: data
    //         }
    //     })
    // }

    /**
     * Function thêm mới thông tin nhân viên
     */
    const handleSubmit = async () => {
        setState({
            ...state,
            employee: {
                ...employee,
                degrees: [...state.degrees],
                certificates: [...state.certificates],
                contracts: [...state.contracts],
                files: [...state.files],
                disciplines: [...state.disciplines],
                commendations: [...state.commendations],
                annualLeaves: [...state.annualLeaves],
                courses: [...state.courses],
                // career,
                // major,
                houseHold: { ...state.houseHold },
            }
        })


        let formData = convertJsonObjectToFormData({
            ...employee,
            degrees: [...state.degrees],
            certificates: [...state.certificates],
            contracts: [...state.contracts],
            files: [...state.files],
            disciplines: [...state.disciplines],
            commendations: [...state.commendations],
            annualLeaves: [...state.annualLeaves],
            courses: [...state.courses],
            // career,
            // major,
            houseHold: { ...state.houseHold },
        });
        degrees.forEach(x => {
            formData.append("fileDegree", x.fileUpload);
        })

        if (certificates && certificates.length !== 0) {
            certificates.forEach(x => {
                formData.append("fileCertificate", x.fileUpload);
            })
        }

        contracts.forEach(x => {
            formData.append("fileContract", x.fileUpload);
        })
        files.forEach(x => {
            formData.append("file", x.fileUpload);
        })
        // major.forEach(x => {
        //     formData.append("fileMajor", x.fileUpload);
        // })
        // career.forEach(x => {
        //     formData.append("fileCareer", x.fileUpload);
        // })
        formData.append("fileAvatar", avatar);
        employee && employee.healthInsuranceAttachment && employee.healthInsuranceAttachment.forEach(x => {
            formData.append('healthInsuranceAttachment', x.fileUpload)
        })
        props.addNewEmployee(formData);
        console.log(...formData);
        console.log(employee);
    }

    const _fm_saveMember = (data) => {
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    familyMembers: [...state.houseHold.familyMembers, data]
                }
            }
        })
    }

    const _fm_handleHeadHouseHoldName = (e) => {
        let headHouseHoldName = e.target.value;
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    headHouseHoldName
                }
            }
        });
    }

    const _fm_handleDocumentType = (e) => {
        let documentType = e.target.value
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    documentType
                }
            }
        });
    }

    const _fm_handleHouseHoldNumber = (e) => {
        let houseHoldNumber = e.target.value
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    houseHoldNumber
                }
            }
        })
    }

    const _fm_handleCity = (e) => {
        let city = e.target.value
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    city
                }
            }
        })
    }

    const _fm_handleDistrict = (e) => {
        let district = e.target.value
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    district
                }
            }
        });
    }

    const _fm_handleWard = (e) => {
        let ward = e.target.value
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    ward
                }
            }
        });
    }

    const _fm_handleHouseHoldAddress = (e) => {
        let houseHoldAddress = e.target.value
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    houseHoldAddress
                }
            }
        })
    }

    const _fm_handlePhone = (e) => {
        let phone = e.target.value
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    phone
                }
            }
        });
    }

    const _fm_handleHouseHoldCode = (e) => {
        let houseHoldCode = e.target.value
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    houseHoldCode
                }
            }
        });
    }


    const _fm_editMember = (index, data) => {
        let familyMembers = state.houseHold.familyMembers;
        familyMembers[index] = data;
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    familyMembers: familyMembers
                }
            }
        })
    }

    const _fm_deleteMember = (index) => {
        let familyMembers = state.houseHold.familyMembers;
        familyMembers = familyMembers.filter((node, i) => i !== index);
        setState(state => {
            return {
                ...state,
                houseHold: {
                    ...state.houseHold,
                    familyMembers: familyMembers
                }
            }
        })
    }
    // console.log(state);

    return (
        <div className=" qlcv">
            <div className="nav-tabs-custom" >
                <ul className="nav nav-tabs">
                    <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href="#page_general">{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                    <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href="#thongtinlienhe">{translate('human_resource.profile.tab_name.menu_contact_infor')}</a></li>
                    <li><a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle="tab" href="#kinhnghiem">{translate('human_resource.profile.tab_name.menu_education_experience')}</a></li>
                    <li><a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle="tab" href="#bangcap">{translate('human_resource.profile.tab_name.menu_diploma_certificate')}</a></li>
                    <li><a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle="tab" href="#taikhoan">{translate('human_resource.profile.tab_name.menu_account_tax')}</a></li>
                    <li><a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle="tab" href="#baohiem">{translate('human_resource.profile.tab_name.menu_insurrance_infor')}</a></li>
                    <li><a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle="tab" href="#hopdong">{translate('human_resource.profile.tab_name.menu_contract_training')}</a></li>
                    <li><a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle="tab" href="#khenthuong">{translate('human_resource.profile.tab_name.menu_reward_discipline')}</a></li>
                    <li><a title={translate('menu.annual_leave_personal')} data-toggle="tab" href="#historySalary">{translate('menu.annual_leave_personal')}</a></li>
                    {/* <li><a title={"Công việc - chuyên ngành tương đương"} data-toggle="tab" href="#major_career">Công việc - chuyên ngành tương đương</a></li> */}
                    <li><a title={"Thành viên hộ gia đình"} data-toggle="tab" href="#family_member">Thành viên hộ gia đình</a></li>
                    <li><a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle="tab" href="#pageAttachments">{translate('human_resource.profile.tab_name.menu_attachments')}</a></li>
                </ul>
                < div className="tab-content">
                    {/* Tab thông tin chung */}
                    <GeneralTab
                        id="page_general"
                        img={img}
                        handleChange={handleChange}
                        handleUpload={handleUpload}
                        employee={employee}
                    />
                    {/* Tab thông tin liên hệ */}
                    <ContactTab
                        id="thongtinlienhe"
                        handleChange={handleChange}
                        employee={employee}
                    />
                    {/* Tab học vẫn - kinh nghiệm làm việc*/}
                    <ExperienceTab
                        id="kinhnghiem"
                        employee={employee}
                        handleChange={handleChange}

                        handleAddExperience={handleChangeExperience}
                        handleEditExperience={handleChangeExperience}
                        handleDeleteExperience={handleChangeExperience}
                    />
                    {/* Tab bằng cấp - chứng chỉ */}
                    <CertificateTab
                        id="bangcap"
                        degrees={degrees}
                        certificates={certificates}
                        handleAddDegree={handleChangeDegree}
                        handleEditDegree={handleChangeDegree}
                        handleDeleteDegree={handleChangeDegree}

                        handleAddCertificate={handleChangeCertificate}
                        handleEditCertificate={handleChangeCertificate}
                        handleDeleteCertificate={handleChangeCertificate}
                    />
                    {/* Tab tài khoản - Thuế */}
                    <TaxTab
                        id="taikhoan"
                        employee={employee}
                        handleChange={handleChange} />
                    {/* Tab  bảo hiểm */}
                    <InsurranceTab
                        id="baohiem"
                        pageCreate={true}
                        socialInsuranceDetails={employee.socialInsuranceDetails}
                        employee={employee}
                        handleChange={handleChange}

                        handleAddBHXH={handleChangeBHXH}
                        handleEditBHXH={handleChangeBHXH}
                        handleDeleteBHXH={handleChangeBHXH}
                    />
                    {/* Tab hợp đồng - quá trình đào tạo */}
                    <ContractTab
                        id="hopdong"
                        pageCreate={true}
                        employee={employee}
                        contracts={contracts}
                        courses={courses}
                        handleChange={handleChange}

                        handleAddContract={handleChangeContract}
                        handleEditContract={handleChangeContract}
                        handleDeleteContract={handleChangeContract}

                        handleAddCourse={handleChangeCourse}
                        handleEditCourse={handleChangeCourse}
                        handleDeleteCourse={handleChangeCourse}
                    />
                    {/* Tab khen thưởnng - kỷ luật */}
                    <DisciplineTab
                        id="khenthuong"
                        commendations={commendations}
                        disciplines={disciplines}

                        handleAddConmmendation={handleChangeConmmendation}
                        handleEditConmmendation={handleChangeConmmendation}
                        handleDeleteConmmendation={handleChangeConmmendation}

                        handleAddDiscipline={handleChangeDiscipline}
                        handleEditDiscipline={handleChangeDiscipline}
                        handleDeleteDiscipline={handleChangeDiscipline}
                    />
                    {/* Tab lương thưởng - nghỉ phép */}
                    <SalaryTab
                        id="historySalary"
                        pageCreate={true}
                        annualLeaves={annualLeaves}

                        handleAddAnnualLeave={handleChangeAnnualLeave}
                        handleEditAnnualLeave={handleChangeAnnualLeave}
                        handleDeleteAnnualLeave={handleChangeAnnualLeave}
                    />
                    {/* Tab tài liệu đính kèm */}
                    <FileTab
                        id="pageAttachments"
                        files={files}
                        employee={employee}
                        handleChange={handleChange}

                        handleAddFile={handleChangeFile}
                        handleEditFile={handleChangeFile}
                        handleDeleteFile={handleChangeFile}
                        handleSubmit={handleSubmit}
                    />


                    {/* Tab thành viên hộ gia đình */}
                    <FamilyMemberTab
                        id="family_member"
                        tabEditMember="modal-edit-member-c"
                        editMember={editMember}
                        _fm_editMember={_fm_editMember}
                        _fm_deleteMember={_fm_deleteMember}
                        houseHold={state.houseHold}
                        _fm_handleHeadHouseHoldName={_fm_handleHeadHouseHoldName}
                        _fm_handleDocumentType={_fm_handleDocumentType}
                        _fm_handleHouseHoldNumber={_fm_handleHouseHoldNumber}
                        _fm_handleCity={_fm_handleCity}
                        _fm_handleDistrict={_fm_handleDistrict}
                        _fm_handleWard={_fm_handleWard}
                        _fm_handleHouseHoldAddress={_fm_handleHouseHoldAddress}
                        _fm_handlePhone={_fm_handlePhone}
                        _fm_handleHouseHoldCode={_fm_handleHouseHoldCode}
                        _fm_saveMember={_fm_saveMember}
                    />
                </div>
            </div>
        </div>
    );
};

function mapState(state) {
    const { employeesManager, } = state;
    return { employeesManager };
};

const actionCreators = {
    addNewEmployee: EmployeeManagerActions.addNewEmployee,
    getDepartment: DepartmentActions.get,
};

const createPage = connect(mapState, actionCreators)(withTranslate(EmployeeCreatePage));
export { createPage as EmployeeCreatePage };
