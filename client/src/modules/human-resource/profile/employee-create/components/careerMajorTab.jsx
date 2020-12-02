import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DegreeAddModal, CertificateAddModal, DegreeEditModal, CertificateEditModal } from './combinedContent';

import { AuthActions } from '../../../../auth/redux/actions';
import { CareerAddModal } from './careerAddModal';
import { MajorAddModal } from './majorAddModal';
import { CareerEditModal } from './careerEditModal';
import { MajorEditModal } from './majorEditModal';

class CareerMajorTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     *  Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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
     * Bắt sự kiện click edit chuyên ngành tương đương
     * @param {*} value : Chuyên ngành tương đương
     * @param {*} index : Số thứ tự chuyên ngành tương đương muốn chỉnh sửa
     */
    handleEditMajorModal = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowMajor: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-major-editMajor${index}`).modal('show');
    }

    /**
     * Bắt sự kiện click edit công việc tương đương
     * @param {*} value : Dữ liệu công việc tương đương
     * @param {*} index : Số thứ tự công việc tương đương muốn chỉnh sửa
     */
    handleEditCareerModal = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowCareer: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-career-editCareer${index}`).modal('show');
    }

    /**
     * Function thêm thông tin chuyên ngành tương đương
     * @param {*} data : Dữ liệu thông tin chuyên ngành tương đương thêm
     */
    handleAddMajor = async (data) => {
        let { major } = this.state;
        await this.setState({
            major: [...major, {
                ...data
            }]
        })
        this.props.handleAddMajor(this.state.major, data)

    }

    /**
     * Function chỉnh sửa thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     */
    handleEditMajor = async (data) => {
        let { major } = this.state;
        major[data.index] = data;
        await this.setState({
            major: major
        })
        this.props.handleEditMajor(major, data)
    }

    /**
     * Function xoá bằng cấp
     * @param {*} index : Số thứ tự bằng cấp muốn xoá
     */
    handleDeleteMajor = async (index) => {
        let { major } = this.state;
        let data = major[index];
        major.splice(index, 1);
        await this.setState({
            ...this.state,
            major: [...major]
        })
        this.props.handleDeleteMajor(major, data)
    }

    /**
     * Function thêm thông tin công việc tương đương
     * @param {*} data : Dữ liệu thông tin công việc tương đương muốn thêm
     */
    handleAddCareer = async (data) => {
        let { career } = this.state;
        await this.setState({
            career: [...career, {
                ...data
            }]
        })
        console.log('career---', data, career);
        this.props.handleAddCareer(this.state.career, data)
    }

    /**
     * Function chỉnh sửa thông tin công việc tương đương
     * @param {*} data : Dữ liệu thông tin công việc tương đương muốn chỉnh sửa
     */
    handleEditCareer = async (data) => {
        let { career } = this.state;
        career[data.index] = data;
        await this.setState({
            career: career
        })
        this.props.handleEditCareer(career, data)
    }


    /**
     * Function xoá chứng chỉ
     * @param {*} index : Số thứ tự chứng chỉ muốn xoá
     */
    handleDeleteCareer = async (index) => {
        let { career } = this.state;
        let data = career[index];
        career.splice(index, 1);
        await this.setState({
            ...this.state,
            career: [...career]
        })
        this.props.handleDeleteCareer(career, data)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                major: nextProps.major,
                career: nextProps.career,
            }
        } else {
            return null;
        }
    }

    /**
     * function dowload file
     * @param {*} e 
     * @param {*} path : Đường dẫn file
     * @param {*} fileName : Tên file dùng để lưu
     */
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    render() {
        const { translate } = this.props;

        const { id } = this.props;

        const { major, career, currentRowMajor, currentRowCareer } = this.state;
        console.log('careerrrr', this.state);

        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    {/* Danh sách bằng cấp */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Chuyên ngành tương đương</h4></legend>
                        <MajorAddModal handleChange={this.handleAddMajor} id={`addMajor${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>Nhóm chuyên ngành</th>
                                    <th>Chuyên ngành</th>
                                    <th>File đính kèm</th>
                                    <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {major && major.length !== 0 &&
                                    major.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.group?.name}</td>
                                            <td>{x.specialized?.name}</td>
                                            <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                                <a className='intable'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => this.requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                            <td>
                                                <a onClick={() => this.handleEditMajorModal(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_diploma')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteMajor(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (!major || major.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>

                    {/* Danh sách chứng chỉ */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Công việc tương đương</h4></legend>
                        <CareerAddModal handleChange={this.handleAddCareer} id={`addCareer${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>Lĩnh vực công việc</th>
                                    <th>Vị trí công việc</th>
                                    <th>Hành động công việc</th>
                                    <th>Ngày bắt đầu</th>
                                    <th>Ngày kết thúc</th>
                                    <th>{translate('human_resource.profile.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {career && career.length !== 0 &&
                                    career.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.field?.name}</td>
                                            <td>{x.position?.name}</td>
                                            <td>{x.action?.map((e, key) => { 
                                                    return <li key={key}> {e?.name} </li> 
                                                })}
                                            </td>
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
                                            <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                                <a className='intable'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => this.requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                            <td>
                                                <a onClick={() => this.handleEditCareerModal(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_certificate')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteCareer(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (!career || career.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {   /** Form chỉnh sửa thông tin chuyên ngành tương đương */
                    currentRowMajor !== undefined &&
                    <MajorEditModal
                        id={`editMajor${currentRowMajor.index}`}
                        _id={currentRowMajor._id}
                        index={currentRowMajor.index}
                        group={currentRowMajor.group}
                        specialized={currentRowMajor.specialized}
                        file={currentRowMajor.file}
                        urlFile={currentRowMajor.urlFile}
                        fileUpload={currentRowMajor.fileUpload}
                        handleChange={this.handleEditMajor}
                    />
                }
                {   /** Form chỉnh sửa thông tin công việc tương đương*/
                    currentRowCareer !== undefined &&
                    <CareerEditModal
                        id={`editCareer${currentRowCareer.index}`}
                        _id={currentRowCareer._id}
                        index={currentRowCareer.index}
                        package={currentRowCareer.package}
                        position={currentRowCareer.position}
                        field={currentRowCareer.field}
                        action={currentRowCareer.action}
                        startDate={this.formatDate(currentRowCareer.startDate)}
                        endDate={this.formatDate(currentRowCareer.endDate)}
                        file={currentRowCareer.file}
                        urlFile={currentRowCareer.urlFile}
                        fileUpload={currentRowCareer.fileUpload}
                        handleChange={this.handleEditCareer}
                    />
                }
            </div>
        );
    }
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const careerMajorTab = connect(null, actionCreators)(withTranslate(CareerMajorTab));
export { careerMajorTab as CareerMajorTab };