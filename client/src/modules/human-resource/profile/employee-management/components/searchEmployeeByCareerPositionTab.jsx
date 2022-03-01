import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, PaginateBar, DataTableSetting } from '../../../../../common-components';

import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom, EmployeeImportForm } from './combinedContent';

import ValidationHelper from '../../../../../helpers/validationHelper';
import { CareerReduxAction } from '../../../career/redux/actions';
import { CertificateActions } from '../../../certificate/redux/actions';
import { MajorActions } from '../../../major/redux/actions';
import { EmployeeManagerActions } from '../redux/actions';

function SearchEmployeeByCareerPositionTab(props) {

    const [state, setState] = useState({ 
        searchForPackage: true,
        set: 0,
        limit: 5
    });

    const { translate, employeesManager, keySearch, listPeople, career, major, certificate } = props;
    const listPosition = career?.listPosition;
                
    const listMajor = major?.listMajor;
    const listCertificate = certificate?.listCertificate;
    
    const { limit, page, currentRowView } = state;

    let pageTotal = ((employeesManager.totalList % limit) === 0) ?
            parseInt(employeesManager.totalList / limit) :
            parseInt((employeesManager.totalList / limit) + 1);
    let currentPage = parseInt((page / limit) + 1);

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
    
    useEffect(() => {
        props.getAllEmployee({...state, careerPosition: keySearch?.careerPosition , certificates: keySearch?.certificateRequirements?.certificates, certificatesCount: keySearch?.certificateRequirements?.certificatesCount, majors: keySearch?.majors, exp: keySearch?.numberYearsOfExperience, sameExp: keySearch?.experienceWorkInCarreer,listPeople: props.listPeople, page: 0, limit: 5})

        
    }, [props._id])

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
        setTimeout(() => {
            window.$(`#modal-detail-employee${value._id}`).modal('show');
        })
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng trên 1 trang
     */
    const setLimit = async (number) => {
        await setState({
            limit: parseInt(number),
        });
        props.getAllEmployee({...state, careerPosition: keySearch?.careerPosition , certificates: keySearch?.certificateRequirements?.certificates, certificatesCount: keySearch?.certificateRequirements?.certificatesCount, majors: keySearch?.majors, exp: keySearch?.numberYearsOfExperience, sameExp: keySearch?.experienceWorkInCarreer,listPeople: props.listPeople});
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang muốn xem
     */
    const setPage = async (pageNumber) => {
        let keySearch = props.keySearch
        let page = (pageNumber - 1) * (state.limit);
        await setState({
            page: parseInt(page),
        });
        props.getAllEmployee({...state, careerPosition: keySearch?.careerPosition , certificates: keySearch?.certificateRequirements?.certificates, certificatesCount: keySearch?.certificateRequirements?.certificatesCount, majors: keySearch?.majors, exp: keySearch?.numberYearsOfExperience, sameExp: keySearch?.experienceWorkInCarreer,listPeople: props.listPeople});
    }

    const save = (value) => {
        props.handleChange(props._id, value);
        handleCloseModal(props?._id)
    }

    const handleCloseModal = (id) => {
        setTimeout(() => {
            window.$(`#modal-change-employee-package${id}`).modal('hide');
        }, 10);
    }

    const isValidateForm = () => {
        
        return true;
    }

    const listEmployees = employeesManager.listEmployees;

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={`modal-change-employee-package${props?._id}`} isLoading={employeesManager.isLoading}
                formID="form-create-employee"
                title={translate('human_resource.profile.add_staff')}
                func={save}
                hasSaveButton={false}
                hasNote={false}
            >
                <div className="box">
                <div className="box-body qlcv">
                    
                    <table id="employee-table" className="table table-striped table-bordered table-hover">
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
                                        setLimit={setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listEmployees && listEmployees?.length !== 0 &&
                                listEmployees.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.fullName}</td>
                                        <td>
                                            {x.careerPositions?.length > 0 ? (x.careerPositions?.map((e, key) => {
                                                return <li key={key}> {e?.careerPosition?.name} {e?.startDate ? "- Ngày bắt đầu: "+ formatDate(e?.startDate) : ""} {e?.endDate ? "- Ngày kết thúc: "+ formatDate(e?.endDate) : ""} </li>
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
                                                return <li key={key}> {e.certificate?.name}{e.certificate?.abbreviation ? "("+e.certificate?.abbreviation+")" : ""} - {e?.issuedBy} - hiệu lực: { formatDate(e?.endDate)} </li>
                                            }) : <p>Chưa có dữ liệu</p>}
                                        </td>
                                        <td>
                                            {x.degrees?.length > 0 ? x.degrees?.map((e, key) => {
                                                return <li key={key}> { formatDate(e?.year)} - {e?.name} - Loại: {e?.degreeType} - Chuyên ngành: {e.major?.name} - Bậc: {professionalSkillArr.filter(item => item.value == e.degreeQualification).name }</li>
                                            }) : <p>Chưa có dữ liệu</p>}
                                        </td>
                                        <td>
                                            <a onClick={() =>  handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() =>  save(x)} style={{ width: '5px' }}  className="add text-green" title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">check</i></a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>

                    </table>
                    {employeesManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listEmployees || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
                </div>

                {/* From xem thông tin nhân viên */
                    <EmployeeDetailForm
                        _id={currentRowView ? currentRowView._id : ""}
                    />
                }
                
            </div>
            </DialogModal>
        </React.Fragment>
        
    );
};

function  mapState(state) {
    const { employeesManager, career, major, certificate } = state;
    return { employeesManager, career, major, certificate };
};

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    searchForPackage: EmployeeManagerActions.searchForPackage,
    deleteEmployee: EmployeeManagerActions.deleteEmployee,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    getListMajor: MajorActions.getListMajor,
    getListCertificate: CertificateActions.getListCertificate,

};

const searchEmployeeByCareerPositionTab = connect(mapState, actionCreators)(withTranslate(SearchEmployeeByCareerPositionTab));
export { searchEmployeeByCareerPositionTab as SearchEmployeeByCareerPositionTab };