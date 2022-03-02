 import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DegreeAddModal, CertificateAddModal, DegreeEditModal, CertificateEditModal } from './combinedContent';

import { AuthActions } from '../../../../auth/redux/actions';
import { FieldsActions } from '../../../field/redux/actions';
import dayjs from 'dayjs';
import { MajorActions } from '../../../major/redux/actions';
import { CertificateActions } from '../../../certificate/redux/actions';

function CertificateTab(props) {
    const [state, setState] = useState({

    });

    useEffect(() => {
        props.getListFields();
        props.getListMajor({ name: '', page: 0, limit: 1000 });
        props.getListCertificate({ name: '', page: 0, limit: 1000 });
    }, [])

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                degrees: props.employee?.degrees ? props.employee.degrees : [],
                certificates: props.employee?.certificates ? props.employee.certificates : []
            }
        })
    }, [props.id, props.employee?.degrees, props.employee?.certificates])

    const { translate, field, listMajors, listCertificates, listPositions } = props;

    const { id } = props;

    const { degrees, certificates, currentRow, currentRowCertificates } = state;
    let listFields = field.listFields;

    /**
     *  Function format dữ liệu Date thành string
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
        }
        return date;
    }

    /**
     * Bắt sự kiện click edit bằng cấp
     * @param {*} value : Dữ liệu bằng cấp
     * @param {*} index : Số thứ tự bằng cấp muốn chỉnh sửa
     */
    const handleEdit = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-certificate-editCertificate${index}`).modal('show');
    }

    /**
     * Bắt sự kiện click edit chứng chỉ
     * @param {*} value : Dữ liệu chứng chỉ
     * @param {*} index : Số thứ tự chứng chỉ muốn chỉnh sửa
     */
    const handleEditShort = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRowCertificates: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-certificateShort-editCertificateShort${index}`).modal('show');
    }

    /**
     * Function thêm thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp thêm
     */
    const handleAddDegree = async (data) => {
        let { degrees } = state;
        await setState(state => {
            return {
                ...state,
                degrees: [...degrees, {
                    ...data
                }]
            }
        })
        props.handleAddDegree(
            [...degrees, {
                ...data
            }]
            , data)

    }

    /**
     * Function chỉnh sửa thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     */
    const handleEditDegree = async (data) => {
        let { degrees } = state;
        degrees[data.index] = data;
        await setState(state => {
            return {
                ...state,
                degrees: degrees
            }
        })
        props.handleEditDegree(degrees, data)
    }

    /**
     * Function thêm thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ muốn thêm
     */
    const handleAddCertificate = async (data) => {
        let { certificates } = state;
        await setState(state => {
            return {
                ...state,
                certificates: [...certificates, {
                    ...data
                }]
            }
        })
        props.handleAddCertificate(
            [...certificates, {
                ...data
            }]
            , data)
    }

    /**
     * Function chỉnh sửa thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ muốn chỉnh sửa
     */
    const handleEditCertificate = async (data) => {
        let { certificates } = state;
        certificates[data.index] = data;
        await setState(state => {
            return {
                ...state,
                certificates: certificates
            }
        })
        props.handleEditCertificate(certificates, data)
    }

    /**
     * Function xoá bằng cấp
     * @param {*} index : Số thứ tự bằng cấp muốn xoá
     */
    const handleDeleteDegree = async (index) => {
        let { degrees } = state;
        let data = degrees[index];
        degrees.splice(index, 1);
        await setState(state => {
            return {
                ...state,
                degrees: [...degrees]
            }
        })
        props.handleDeleteDegree([...degrees], data)
    }

    /**
     * Function xoá chứng chỉ
     * @param {*} index : Số thứ tự chứng chỉ muốn xoá
     */
    const handleDeleteCertificate = async (index) => {
        let { certificates } = state;
        let data = certificates[index];
        certificates.splice(index, 1);
        await setState(state => {
            return {
                ...state,
                certificates: [...certificates]
            }
        })
        props.handleDeleteCertificate([...certificates], data)
    }


    /**
     * function dowload file
     * @param {*} e 
     * @param {*} path : Đường dẫn file
     * @param {*} fileName : Tên file dùng để lưu
     */
    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        props.downloadFile(path, fileName)
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

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                {/* Danh sách bằng cấp */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.diploma')}</h4></legend>
                    <DegreeAddModal handleChange={handleAddDegree} id={`addCertificate${id}`} />
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.name_diploma')}</th>
                                <th>{translate('human_resource.profile.diploma_issued_by')}</th>
                                <th>{translate('human_resource.profile.career_fields')}</th>
                                <th>Chuyên ngành</th>
                                <th>{translate('human_resource.profile.graduation_year')}</th>
                                <th>Trình độ chuyên môn</th>
                                <th>{translate('human_resource.profile.ranking_learning')}</th>
                                <th>{translate('human_resource.profile.attached_files')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {degrees && degrees.length !== 0 &&
                                degrees.map((x, index) => {
                                    let field = '';
                                    if (x.field) {
                                        field = listFields.find(y => y._id.toString() === x.field.toString());
                                        if (field) {
                                            field = field.name
                                        } else {
                                            field = 'DELETED'
                                        }
                                    }
                                    let major = '';
                                    if (x.major) {
                                        major = listMajors.find(y => y._id.toString() === x.major.toString());
                                        if (major) {
                                            major = major.name
                                        } else {
                                            major = 'DELETED'
                                        }
                                    }
                                    let degreeQualification = '';
                                    if (x.degreeQualification) {
                                        degreeQualification = professionalSkillArr.find(y => y.value === x.degreeQualification);
                                        if (degreeQualification) {
                                            degreeQualification = degreeQualification.text
                                        } else {
                                            degreeQualification = 'DELETED'
                                        }
                                    }
                                    return (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.issuedBy}</td>
                                            <td>{field}</td>
                                            <td>{major}</td>
                                            <td>{x?.year ? x?.year?.length > 10 ? dayjs(x.year).format("DD-MM-YYYY") : x?.year : null}</td>
                                            <td>{degreeQualification}</td>
                                            <td>{translate(`human_resource.profile.${x.degreeType}`)}</td>
                                            <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                                <a className='intable'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                            <td>
                                                <a onClick={() => handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_diploma')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteDegree(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    )
                                }
                                )}
                        </tbody>
                    </table>
                    {
                        (!degrees || degrees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>

                {/* Danh sách chứng chỉ */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.certificate')}</h4></legend>
                    <CertificateAddModal 
                        handleChange={handleAddCertificate} 
                        id={`addCertificateShort${id}`}
                    />
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.name_certificate')}</th>
                                <th>{translate('human_resource.profile.issued_by')}</th>
                                <th>{translate('human_resource.profile.date_issued')}</th>
                                <th>{translate('human_resource.profile.end_date_certificate')}</th>
                                <th>{translate('human_resource.profile.attached_files')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates && certificates.length !== 0 &&
                                certificates.map((x, index) => {
                                    let certificate = '';
                                    if (x.certificate) {
                                        certificate = listCertificates.find(y => y._id.toString() === x.certificate.toString());
                                        if (certificate) {
                                            certificate = certificate.name
                                        } else {
                                            certificate = 'DELETED'
                                        }
                                    }
                                    return (
                                    <tr key={index}>
                                        <td>{certificate}</td>
                                        <td>{x.issuedBy}</td>
                                        <td>{formatDate(x.startDate)}</td>
                                        <td>{formatDate(x.endDate)}</td>
                                        <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                            <a className='intable'
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                <i className="fa fa-download"> &nbsp;Download!</i>
                                            </a>
                                        }</td>
                                        <td>
                                            <a onClick={() => handleEditShort(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_certificate')}><i className="material-icons">edit</i></a>
                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteCertificate(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>
                                )}
                            )}
                        </tbody>
                    </table>
                    {
                        (!certificates || certificates.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>
            </div>
            {   /** Form chỉnh sửa thông tin bằng cấp */
                currentRow !== undefined &&
                <DegreeEditModal
                    id={`editCertificate${currentRow.index}`}
                    _id={currentRow._id}
                    index={currentRow.index}
                    name={currentRow.name}
                    issuedBy={currentRow.issuedBy}
                    fieldId={currentRow.field}
                    year={currentRow.year}
                    degreeType={currentRow.degreeType}
                    file={currentRow.file}
                    urlFile={currentRow.urlFile}
                    fileUpload={currentRow.fileUpload}
                    major={currentRow.major}
                    degreeQualification={currentRow.degreeQualification}
                    listMajors={listMajors}
                    listCertificates={listCertificates}
                    handleChange={handleEditDegree}
                />
            }
            {   /** Form chỉnh sửa thông tin chứng chỉ*/
                currentRowCertificates !== undefined &&
                <CertificateEditModal
                    id={`editCertificateShort${currentRowCertificates.index}`}
                    _id={currentRowCertificates._id}
                    index={currentRowCertificates.index}
                    name={currentRowCertificates.name}
                    issuedBy={currentRowCertificates.issuedBy}
                    startDate={formatDate(currentRowCertificates.startDate)}
                    endDate={formatDate(currentRowCertificates.endDate)}
                    certificate={currentRowCertificates.certificate}
                    file={currentRowCertificates.file}
                    urlFile={currentRowCertificates.urlFile}
                    fileUpload={currentRowCertificates.fileUpload}
                    listMajors={listMajors}
                    listCertificates={listCertificates}
                    handleChange={handleEditCertificate}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { field } = state;
    return { field };
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
    getListFields: FieldsActions.getListFields,
    getListMajor: MajorActions.getListMajor,
    getListCertificate: CertificateActions.getListCertificate,
};

const certificateTab = connect(mapState, actionCreators)(withTranslate(CertificateTab));
export { certificateTab as CertificateTab };