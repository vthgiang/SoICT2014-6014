import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { DialogModal } from '../../../../../common-components';

import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, DisciplineTab,
    ExperienceTab, CertificateTab, ContractTab, SalaryTab, FileTab,
} from '../../employee-create/components/combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import { EmployeeInfoActions } from '../../employee-info/redux/actions';
import FamilyMemberTab from '../../employee-create/components/familyMemberTab';

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

const EmployeeEditFrom = (props) => {

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };

    const [state, setState] = useState({
        dataStatus: DATA_STATUS.NOT_AVAILABLE,
        img: './upload/human-resource/avatars/avatar5.png',
        avatar: "",
        employee: {
            employeeNumber: "",
            employeeTimesheetId: "",
            fullName: "",
            emailInCompany: "",
            phoneNumber: "",
            avatar: '/upload/human-resource/avatars/avatar5.png',
            gender: "male",
            maritalStatus: "single",
            educationalLevel: "",
            professionalSkill: "unavailable",
            status: 'active',
            identityCardNumber: "",
            identityCardAddress: "",
            identityCardDate: "",
            birthdate: "",
        },
        roles: [],
        experiences: [],
        socialInsuranceDetails: [],
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
        editAnnualLeaves: [],
        editCertificates: [],
        editConmmendations: [],
        editContracts: [],
        editCourses: [],
        editDegrees: [],
        editDisciplines: [],
        editSocialInsuranceDetails: [],
        editExperiences: [],
        editFiles: [],
        deleteAnnualLeaves: [],
        deleteCertificates: [],
        deleteConmmendations: [],
        deleteContracts: [],
        deleteCourses: [],
        deleteDegrees: [],
        deleteDisciplines: [],
        deleteSocialInsuranceDetails: [],
        deleteExperiences: [],
        deleteFiles: []
    })

    const mountedRef = useRef(true)

    useEffect(() => {
        const shouldUpdate = async () => {
            if (props._id !== state._id && !props.employeesInfo.isLoading) {
                await props.getEmployeeProfile({ id: props._id, callAPIByUser: false });
                setState({
                    ...state,
                    _id: props?._id,
                    dataStatus: DATA_STATUS.QUERYING,
                    img: undefined,
                    avatar: "",
                    employee: '',
                    experiences: [],
                    degrees: [],
                    certificates: [],
                    // career: [],
                    // major: [],
                    contracts: [],
                    files: [],
                    socialInsuranceDetails: [],
                    annualLeaves: [],
                    commendations: [],
                    disciplines: [],
                    courses: [],
                    roles: [],
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
                    }
                })
            };
            if (state.dataStatus === DATA_STATUS.QUERYING && !props.employeesInfo.isLoading) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE,
                    img: `.${props.employeesInfo?.employees?.[0]?.avatar}`,
                    avatar: "",
                    employee: props.employeesInfo.employees?.[0],
                    experiences: props.employeesInfo.employees?.[0]?.experiences,
                    degrees: props.employeesInfo.employees?.[0]?.degrees,
                    certificates: props.employeesInfo.employees?.[0]?.certificates,
                    // career: props.employeesInfo.employees?.[0]?.career,
                    // major: props.employeesInfo.employees?.[0]?.major,
                    contracts: props.employeesInfo?.employees?.[0]?.contracts,
                    files: props.employeesInfo?.employees?.[0]?.files,
                    socialInsuranceDetails: props.employeesInfo?.employees?.[0]?.socialInsuranceDetails,
                    annualLeaves: props.employeesInfo?.annualLeaves,
                    commendations: props.employeesInfo?.commendations,
                    disciplines: props.employeesInfo?.disciplines,
                    courses: props.employeesInfo?.courses,
                    roles: props.employeesInfo?.roles?.length > 0 ? props.employeesInfo?.roles.map(x => x?.roleId?.id) : [],
                    organizationalUnits: props.employeesInfo?.organizationalUnits?.length > 0 && props.employeesInfo?.organizationalUnits.map(x => x._id),
                    houseHold: props.employeesInfo?.employees?.[0]?.houseHold
                });
            };
        }
        shouldUpdate();
        return () => {
            mountedRef.current = false;
        }
    }, [props._id, props.employeesInfo.isLoading, state.dataStatus]);

    const { translate, employeesInfo } = props;

    let { _id, img, employee, experiences, degrees, certificates, socialInsuranceDetails, contracts, courses,
        organizationalUnits, roles, commendations, disciplines, annualLeaves, files, houseHold, editMember } = state;



    /**
     * Function upload avatar 
     * @param {*} img 
     * @param {*} avatar 
     */
    const handleUpload = (img, avatar) => {
        setState({
            ...state,
            img: img,
            avatar: avatar
        })
    }

    /**
     * Function lưu các trường thông tin vào state
     * @param {*} name : Tên trường
     * @param {*} value : Giá trị của trường
     */
    const handleChange = (name, value) => {
        const { employee } = state;
        if (name === 'startingDate' || name === 'leavingDate' || name === 'birthdate' || name === 'identityCardDate' || name === 'taxDateOfIssue' || name === 'healthInsuranceStartDate' || name === 'healthInsuranceEndDate'
            || name === 'contractEndDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            }
        }
        setState({
            ...state,
            employee: {
                ...employee,
                [name]: value
            }
        });
    }

    /**
    * Function lưu thông tin chức danh vào state
    * @param {*} data : dữ liệu về chức danh
    */
    const handleChangeRole = (data) => {
        setState({
            ...state,
            roles: [...data]
        })
    }

    /**
     * Function thêm kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} addData : Kinh nghiệm làm việc muốn thêm
     */
    const handleCreateExperiences = (data, addData) => {
        setState({
            ...state,
            experiences: [...experiences, addData]
        })
    }

    /**
     * Function chỉnh sửa kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} editData : Kinh nghiệm làm việc muốn chỉnh sửa
     */
    const handleEditExperiences = (data, editData) => {
        const { editExperiences } = state;
        if (editData._id) {
            setState({
                ...state,
                editExperiences: [...editExperiences, editData]
            })
        } else {
            setState({
                ...state,
                experiences: data
            })
        }
    }

    /**
     * Function xoá kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} deleteData : Kinh nghiệm làm việc muốn xoá
     */
    const handleDeleteExperiences = (data, deleteData) => {
        const { deleteExperiences, editExperiences } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteExperiences: [...deleteExperiences, deleteData],
                editExperiences: editExperiences.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                experiences: data
            })
        }
    }


    /**
     * Function thêm thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} addData : Bằng cấp muốn thêm 
     */
    const handleCreateDegree = (data, addData) => {
        setState({
            ...state,
            degrees: [...degrees, addData]
        })
    }

    /**
     * Function chỉnh sửa thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} editData : bằng cấp muốn chỉnh sửa
     */
    const handleEditDegree = (data, editData) => {
        const { editDegrees } = state;
        if (editData._id) {
            setState({
                ...state,
                editDegrees: [...editDegrees, editData]
            })
        } else {
            setState({
                ...state,
                degrees: data
            })
        }
    }

    /**
     * Function xoá thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} deleteData : Bằng cấp muốn xoá
     */
    const handleDeleteDegree = (data, deleteData) => {
        const { deleteDegrees, editDegrees } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteDegrees: [...deleteDegrees, deleteData],
                editDegrees: editDegrees.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                degrees: data
            })
        }
    }

    // /**
    //  * Function thêm thông tin chuyên ngành tuowg đương
    //  * @param {*} data : Dữ liệu thông tin chuyên ngành tuowg đương
    //  * @param {*} addData : Chuyên ngành tuowg đương muốn thêm 
    //  */
    // const handleAddMajor = (data, addData) => {
    //     setState({
    //         ...state,
    //         major: data
    //     })
    // }

    // /**
    //  * Function chỉnh sửa thông tin chuyên ngành tuowg đương
    //  * @param {*} data : Dữ liệu thông tin chuyên ngành tuowg đương
    //  * @param {*} editData : chuyên ngành tuowg đương muốn chỉnh sửa
    //  */
    // const handleEditMajor = (data, editData) => {
    //     const { editMajor } = state;
    //     if (editData._id) {
    //         setState({
    //             ...state,
    //             editMajor: [...editMajor, editData]
    //         })
    //     } else {
    //         setState({
    //             ...state,
    //             major: data
    //         })
    //     }
    // }

    // /**
    //  * Function xoá thông tin chuyên ngành tuowg đương
    //  * @param {*} data : Dữ liệu thông tin chuyên ngành tuowg đương
    //  * @param {*} deleteData : chuyên ngành tuowg đương muốn xoá
    //  */
    // const handleDeleteMajor = (data, deleteData) => {
    //     const { deleteMajor, editMajor } = state;
    //     if (deleteData._id) {
    //         setState({
    //             ...state,
    //             deleteMajor: [...deleteMajor, deleteData],
    //             editMajor: editMajor.filter(x => x._id !== deleteData._id)
    //         })
    //     } else {
    //         setState({
    //             ...state,
    //             major: data
    //         })
    //     }
    // }

    // /**
    //  * Function thêm thông tin Công việc đương tương
    //  * @param {*} data : Dữ liệu thông tin Công việc đương tương
    //  * @param {*} addData : Công việc đương tương muốn thêm 
    //  */
    // const handleAddCareer = (data, addData) => {
    //     setState({
    //         ...state,
    //         career: data
    //     })
    // }

    // /**
    //  * Function chỉnh sửa thông tin bằng cấp
    //  * @param {*} data : Dữ liệu thông tin bằng cấp
    //  * @param {*} editData : bằng cấp muốn chỉnh sửa
    //  */
    // const handleEditCareer = (data, editData) => {
    //     const { editCareer } = state;
    //     if (editData._id) {
    //         setState({
    //             ...state,
    //             editCareer: [...editCareer, editData]
    //         })
    //     } else {
    //         setState({
    //             ...state,
    //             career: data
    //         })
    //     }
    // }

    // /**
    //  * Function xoá thông tin Công việc đương tương
    //  * @param {*} data : Dữ liệu thông tin Công việc đương tương
    //  * @param {*} deleteData : Công việc đương tương muốn xoá
    //  */
    // const handleDeleteCareer = (data, deleteData) => {
    //     const { deleteCareer, editCareer } = state;
    //     if (deleteData._id) {
    //         setState({
    //             ...state,
    //             deleteCareer: [...deleteCareer, deleteData],
    //             editCareer: editCareer.filter(x => x._id !== deleteData._id)
    //         })
    //     } else {
    //         setState({
    //             ...state,
    //             career: data
    //         })
    //     }
    // }


    /**
     * Function thêm thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} addData : Chứng chỉ muốn thêm
     */
    const handleCreateCertificate = (data, addData) => {
        setState({
            ...state,
            certificates: [...certificates, addData]
        })
    }

    /**
     * Function chỉnh sửa thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} editData : Chứng chỉ muốn chỉnh sửa
     */
    const handleEditCertificate = (data, editData) => {
        const { editCertificates } = state;
        if (editData._id) {
            setState({
                ...state,
                editCertificates: [...editCertificates, editData]
            })
        } else {
            setState({
                ...state,
                certificates: data
            })
        }
    }

    /**
     * Function xoá thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} deleteData : Chứng chỉ muốn xoá
     */
    const handleDeleteCertificate = (data, deleteData) => {
        const { deleteCertificates, editCertificates } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteCertificates: [...deleteCertificates, deleteData],
                editCertificates: editCertificates.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                certificates: data
            })
        }
    }


    /**
     * Function thêm quá trình đóng bảo hiểm xã hội
     * @param {*} data : Dữ liệu quá trình đóng bảo hiểm xã hội
     * @param {*} addData : Quá trình bảo hiểm xã hội muốn thêm
     */
    const handleCreateBHXH = (data, addData) => {
        setState({
            ...state,
            socialInsuranceDetails: [...socialInsuranceDetails, addData]
        })
    }

    /**
     * Function chỉnh sửa quá trình đóng bảo hiểm xã hội
     * @param {*} data : Dữ liệu quá trình đóng bảo hiểm xã hội
     * @param {*} editData : Quá trình đóng bảo hiểm xã hội muốn thêm
     */
    const handleEditBHXH = (data, editData) => {
        const { editSocialInsuranceDetails } = state;
        if (editData._id) {
            setState({
                ...state,
                editSocialInsuranceDetails: [...editSocialInsuranceDetails, editData]
            })
        } else {
            setState({
                ...state,
                socialInsuranceDetails: data
            })
        }
    }

    /**
     * Function xoá quá trình đóng bảo hiểm xã hội
     * @param {*} data : Dữ liệu quá trình đóng bảo hiểm xã hội
     * @param {*} deleteData : Quá trình đóng bảo hiểm xã hội muốn xoá
     */
    const handleDeleteBHXH = (data, deleteData) => {
        const { deleteSocialInsuranceDetails, editSocialInsuranceDetails } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteSocialInsuranceDetails: [...deleteSocialInsuranceDetails, deleteData],
                editSocialInsuranceDetails: editSocialInsuranceDetails.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                socialInsuranceDetails: data
            })
        }
    }


    /**
     * Function thêm thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu hợp đồng lao động
     * @param {*} addData : Hợp đồng lao động muốn thêm
     */
    const handleCreateContract = (data, addData) => {
        setState({
            ...state,
            contracts: [...contracts, addData]
        })
    }

    /**
     * Function chỉnh sửa thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng lao động
     * @param {*} editData : Hợp đồng lao động muốn chỉnh sửa
     */
    const handleEditContract = (data, editData) => {
        const { editContracts } = state;
        if (editData._id) {
            setState({
                ...state,
                editContracts: [...editContracts, editData]
            })
        }
        else {
            setState({
                ...state,
                contracts: data
            })
        }
    }

    /**
     * Function xoá thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng lao động
     * @param {*} deleteData : Hợp đồng lao động muốn xoá
     */
    const handleDeleteContract = (data, deleteData) => {
        const { deleteContracts, editContracts } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteContracts: [...deleteContracts, deleteData],
                editContracts: editContracts.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                contracts: data
            })
        }
    }


    /**
     * Function thêm thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} addData : Khen thưởng muốn thêm
     */
    const handleCreateConmmendation = (data, addData) => {
        setState({
            ...state,
            commendations: [...commendations, addData]
        })
    }

    /**
     * Function chỉnh sửa thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} editData : Khen thưởng muốn chỉnh sửa
     */
    const handleEditConmmendation = (data, editData) => {
        const { editConmmendations } = state;
        if (editData._id) {
            setState({
                ...state,
                editConmmendations: [...editConmmendations, editData]
            })
        } else {
            setState({
                ...state,
                commendations: data
            })
        }
    }

    /**
     * Function xoá thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} deleteData : Khen thưởng muốn xoá
     */
    const handleDeleteConmmendation = (data, deleteData) => {
        const { editConmmendations, deleteConmmendations } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteConmmendations: [...deleteConmmendations, deleteData],
                editConmmendations: editConmmendations.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                commendations: data
            })
        }
    }


    /**
     * Function thêm thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} addData : Kỷ luật muốn thêm
     */
    const handleCreateDiscipline = (data, addData) => {
        setState({
            ...state,
            disciplines: [...disciplines, addData]
        })
    }

    /**
     * Function chỉnh sửa thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} editData : Kỷ luật muốn chỉnh sửa
     */
    const handleEditDiscipline = (data, editData) => {
        const { editDisciplines } = state;
        if (editData._id) {
            setState({
                ...state,
                editDisciplines: [...editDisciplines, editData]
            })
        } else {
            setState({
                ...state,
                disciplines: data
            })
        }
    }

    /**
     *  Function xoá thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} deleteData : Kỷ luật muốn xoá
     */
    const handleDeleteDiscipline = (data, deleteData) => {
        const { editDisciplines, deleteDisciplines } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteDisciplines: [...deleteDisciplines, deleteData],
                editDisciplines: editDisciplines.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                disciplines: data
            })
        }
    }

    /**
     * Function thêm thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} addData : Nghỉ phép muốn thêm
     */
    const handleCreateAnnualLeave = (data, addData) => {
        setState({
            ...state,
            annualLeaves: [...annualLeaves, addData]
        })
    }

    /**
     * Function chỉnh sửa thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} editData : Nghỉ phép muốn chỉnh sửa
     */
    const handleEditAnnualLeave = (data, editData) => {
        const { editAnnualLeaves } = state;
        if (editData._id) {
            setState({
                ...state,
                editAnnualLeaves: [...editAnnualLeaves, editData]
            })
        } else {
            setState({
                ...state,
                annualLeaves: data
            })
        }
    }

    /**
     * Function xoá thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} deleteData : Nghỉ phép muốn xoá
     */
    const handleDeleteAnnualLeave = (data, deleteData) => {
        const { editAnnualLeaves, deleteAnnualLeaves } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteAnnualLeaves: [...deleteAnnualLeaves, deleteData],
                editAnnualLeaves: editAnnualLeaves.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                annualLeaves: data
            })
        }
    }


    /**
     * Function thêm tài liệu đính kèm
     * @param {*} data : Dữ liệu tài liệu đính kềm
     * @param {*} addData : Tài liệu đính kèm muốn thêm
     */
    const handleCreateFile = (data, addData) => {
        setState({
            ...state,
            files: [...files, addData]
        })
    }

    /**
     * Function chỉnh sửa tài liệu đính kèm
     * @param {*} data : Dữ liệu tài liệu đính kèm
     * @param {*} editData : Tài liệu đính kèm muốn chỉnh sửa
     */
    const handleEditFile = (data, editData) => {
        const { editFiles } = state;
        if (editData._id) {
            setState({
                ...state,
                editFiles: [...editFiles, editData]
            })
        } else {
            setState({
                ...state,
                files: data
            })
        }
    }

    /**
     * Function xoá tài liệu đính kèm
     * @param {*} data : Dữ liệu tài liệu đính kèm
     * @param {*} deleteData : Tài liệu đính kèm muốn xoá
     */
    const handleDeleteFile = (data, deleteData) => {
        const { editFiles, deleteFiles } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteFiles: [...deleteFiles, deleteData],
                editFiles: editFiles.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                files: data
            })
        }
    }


    /**
     * Function thêm thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu quá trình đào tạo
     * @param {*} addData : Quá trình đào tạo muốn thêm
     */
    const handleCreateCourse = (data, addData) => {
        setState({
            ...state,
            courses: [...courses, addData]
        })
    }

    /**
     * Function chỉnh sửa thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu quá trình đào tạo
     * @param {*} editData : Quá trình đào tạo muốn chỉnh sửa
     */
    const handleEditCourse = (data, editData) => {
        const { editCourses } = state;
        if (editData._id) {
            setState({
                ...state,
                editCourses: [...editCourses, editData]
            })
        } else {
            setState({
                ...state,
                courses: data
            })
        }
    }

    /**
     * Function xoá thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu quá trình đào tạo
     * @param {*} deleteData : Quá trình đào tạo muốn xoá
     */
    const handleDeleteCourse = (data, deleteData) => {
        const { editCourses, deleteCourses } = state;
        if (deleteData._id) {
            setState({
                ...state,
                deleteCourses: [...deleteCourses, deleteData],
                editCourses: editCourses.filter(x => x._id !== deleteData._id)
            })
        } else {
            setState({
                ...state,
                courses: data
            })
        }
    }



    /**
     * Function kiểm tra các trường bắt buộc phải nhập
     * @param {*} value : Giá trị của trường cần kiểm tra
     */
    const validatorInput = (value) => {
        if (value && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { employee } = state;
        let result = true;
        if (employee) {
            result = validatorInput(employee.employeeNumber) &&
                validatorInput(employee.fullName);

            if (employee.healthInsuranceStartDate && employee.healthInsuranceEndDate) {
                if (new Date(employee.healthInsuranceEndDate).getTime() < new Date(employee.healthInsuranceStartDate).getTime()) {
                    return false;
                }
            } else if ((employee.healthInsuranceStartDate && !employee.healthInsuranceEndDate) ||
                (!employee.healthInsuranceStartDate && employee.healthInsuranceEndDate)) {
                return false;
            }
            if (employee.leavingDate && employee.startingDate) {
                if (new Date(employee.leavingDate).getTime() < new Date(employee.startingDate).getTime()) {
                    return false;
                }
            } else if (employee.leavingDate && !employee.startingDate) {
                return false;
            }
        }
        return result;
    }

    const save = async () => {
        let { _id, experiences, degrees, certificates, contracts, files, avatar,
            disciplines, commendations, annualLeaves, socialInsuranceDetails, courses } = state;

        console.log('degrees', degrees);
        let degreesConvert = [];
        const createDegrees = degrees?.length ? degrees.filter(x => x._id === undefined) : [];
        createDegrees.forEach(x => {
            const splitDate = x?.year ? x.year.split("-") : x.year;
            degreesConvert = [
                ...degreesConvert,
                {
                    ...x,
                    year: [splitDate[2], splitDate[1], splitDate[0]].join("-"),
                }
            ]
        });

        let formData = convertJsonObjectToFormData({
            ...state,
            createExperiences: experiences.filter(x => x._id === undefined),
            createDegrees: degreesConvert,
            createCertificates: certificates.filter(x => x._id === undefined),
            // createCareer: career.filter(x => x._id === undefined),
            // createMajor: major.filter(x => x._id === undefined),
            createContracts: contracts.filter(x => x._id === undefined),
            createDisciplines: disciplines.filter(x => x._id === undefined),
            createCommendations: commendations.filter(x => x._id === undefined),
            createAnnualLeaves: annualLeaves.filter(x => x._id === undefined),
            createCourses: courses.filter(x => x._id === undefined),
            createSocialInsuranceDetails: socialInsuranceDetails.filter(x => x._id === undefined),
            createFiles: files.filter(x => x._id === undefined),
        });
        degrees.forEach(x => {
            formData.append("fileDegree", x.fileUpload);
        })
        certificates.forEach(x => {
            formData.append("fileCertificate", x.fileUpload);
        })
        // career.forEach(x => {
        //     formData.append("fileCareer", x.fileUpload);
        // })
        // major.forEach(x => {
        //     formData.append("fileMajor", x.fileUpload);
        // })
        contracts.forEach(x => {
            formData.append("fileContract", x.fileUpload);
        })
        files.forEach(x => {
            formData.append("file", x.fileUpload);
        })
        formData.append("fileAvatar", avatar);
        await props.updateInformationEmployee(_id, formData);
        await props.getEmployeeProfile({ id: props._id, callAPIByUser: false });
        setState({
            ...state,
            dataStatus: DATA_STATUS.QUERYING
        })
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

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={`modal-edit-employee${props._id}`} isLoading={employeesInfo.isLoading}
                formID={`form-edit-employee${_id}`}
                title={translate('human_resource.profile.employee_management.edit_employee')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* <form className="form-group" id="form-edit-employee"> */}
                {employee &&
                    <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href={`#edit_general${_id}`}>{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href={`#edit_contact${_id}`}>{translate('human_resource.profile.tab_name.menu_contact_infor')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle="tab" href={`#edit_experience${_id}`}>{translate('human_resource.profile.tab_name.menu_education_experience')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle="tab" href={`#edit_diploma${_id}`}>{translate('human_resource.profile.tab_name.menu_diploma_certificate')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle="tab" href={`#edit_account${_id}`}>{translate('human_resource.profile.tab_name.menu_account_tax')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle="tab" href={`#edit_insurrance${_id}`}>{translate('human_resource.profile.tab_name.menu_insurrance_infor')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle="tab" href={`#edit_contract${_id}`}>{translate('human_resource.profile.tab_name.menu_contract_training')}</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle="tab" href={`#edit_reward${_id}`}>{translate('human_resource.profile.tab_name.menu_reward_discipline')}</a></li>
                            <li><a title={translate('menu.annual_leave_personal')} data-toggle="tab" href={`#edit_salary${_id}`}>{translate('menu.annual_leave_personal')}</a></li>
                            <li><a title={"Thành viên hộ gia đình"} data-toggle="tab" href={`#edit_family_member${_id}`}>Thành viên hộ gia đình</a></li>
                            <li><a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle="tab" href={`#edit_attachments${_id}`}>{translate('human_resource.profile.tab_name.menu_attachments')}</a></li>
                        </ul>
                        <div className="tab-content">
                            {/* Tab thông tin chung */
                                <GeneralTab
                                    id={`edit_general${_id}`}
                                    img={img}
                                    handleChange={handleChange}
                                    handleUpload={handleUpload}
                                    handleChangeRole={handleChangeRole}
                                    employee={employee}
                                    roles={roles}
                                />}
                            {/* Tab thông tin liên hệ */}
                            <ContactTab
                                id={`edit_contact${_id}`}
                                handleChange={handleChange}
                                employee={employee}
                            />
                            {/* Tab học vấn - kinh nghiệm */}
                            <ExperienceTab
                                id={`edit_experience${_id}`}
                                employee={employee}
                                handleChange={handleChange}

                                handleAddExperience={handleCreateExperiences}
                                handleEditExperience={handleEditExperiences}
                                handleDeleteExperience={handleDeleteExperiences}
                            />
                            {/* Tab bằng cấp - chứng chỉ */}
                            <CertificateTab
                                id={`edit_diploma${_id}`}
                                degrees={degrees}
                                certificates={certificates}
                                employee={employee}
                                handleAddDegree={handleCreateDegree}
                                handleEditDegree={handleEditDegree}
                                handleDeleteDegree={handleDeleteDegree}

                                handleAddCertificate={handleCreateCertificate}
                                handleEditCertificate={handleEditCertificate}
                                handleDeleteCertificate={handleDeleteCertificate}
                            />
                            {/* Tab Tài khoản - thuế */}
                            <TaxTab
                                id={`edit_account${_id}`}
                                employee={employee}
                                handleChange={handleChange} />
                            {/* Tab thông tin bảo hiểm */}
                            <InsurranceTab
                                id={`edit_insurrance${_id}`}
                                socialInsuranceDetails={socialInsuranceDetails}
                                employee={employee}
                                handleChange={handleChange}

                                handleAddBHXH={handleCreateBHXH}
                                handleEditBHXH={handleEditBHXH}
                                handleDeleteBHXH={handleDeleteBHXH}
                            />
                            {/* Tab hợp đồng - quá trình đào tạo*/}
                            <ContractTab
                                id={`edit_contract${_id}`}
                                // pageCreate={false}
                                employee={employee}
                                contracts={contracts}
                                courses={courses}
                                organizationalUnits={organizationalUnits}
                                roles={roles}
                                handleChange={handleChange}

                                handleAddContract={handleCreateContract}
                                handleEditContract={handleEditContract}
                                handleDeleteContract={handleDeleteContract}

                                handleAddCourse={handleCreateCourse}
                                handleEditCourse={handleEditCourse}
                                handleDeleteCourse={handleDeleteCourse}
                            />
                            {/* Tab khen thưởng - kỷ luật*/}
                            <DisciplineTab
                                id={`edit_reward${_id}`}
                                commendations={commendations}
                                disciplines={disciplines}
                                handleAddConmmendation={handleCreateConmmendation}
                                handleEditConmmendation={handleEditConmmendation}
                                handleDeleteConmmendation={handleDeleteConmmendation}

                                handleAddDiscipline={handleCreateDiscipline}
                                handleEditDiscipline={handleEditDiscipline}
                                handleDeleteDiscipline={handleDeleteDiscipline}
                            />
                            {/* Tab lương thưởng - nghỉ phép*/}
                            <SalaryTab
                                id={`edit_salary${_id}`}
                                annualLeaves={annualLeaves}

                                handleAddAnnualLeave={handleCreateAnnualLeave}
                                handleEditAnnualLeave={handleEditAnnualLeave}
                                handleDeleteAnnualLeave={handleDeleteAnnualLeave}
                            />
                            {/* Tab tài liệu đính kèm */}
                            <FileTab
                                id={`edit_attachments${_id}`}
                                files={files}
                                employee={employee}
                                handleChange={handleChange}

                                handleAddFile={handleCreateFile}
                                handleEditFile={handleEditFile}
                                handleDeleteFile={handleDeleteFile}
                            />
                            {/* Tab thành viên hộ gia đình */}
                            <FamilyMemberTab
                                id={`edit_family_member${_id}`}
                                tabEditMember="modal-edit-member-e"
                                editMember={editMember}
                                _fm_editMember={_fm_editMember}
                                _fm_deleteMember={_fm_deleteMember}
                                houseHold={houseHold}
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
                    </div>}
                {/* </form> */}
            </DialogModal>
        </React.Fragment>
    )
};

function mapState(state) {
    const { employeesInfo, employeesManager } = state;
    return { employeesInfo, employeesManager };
};

const actionCreators = {
    updateInformationEmployee: EmployeeManagerActions.updateInformationEmployee,
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
};

const editFrom = connect(mapState, actionCreators)(withTranslate(EmployeeEditFrom));
export { editFrom as EmployeeEditFrom };
