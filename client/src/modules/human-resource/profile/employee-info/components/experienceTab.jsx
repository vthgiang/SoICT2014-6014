import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CareerReduxAction } from '../../../career/redux/actions';

function ExperiencTab(props) {
    const [state, setState] = useState({

    })

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
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
     * function dowload file
     * @param {*} e 
     * @param {*} path : Đường dẫn file
     * @param {*} fileName : Tên file dùng để lưu
     */
    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        props.downloadFile(path, fileName)
    }

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                experiences: props.employee.experiences,
                careerPositions: props.employee.careerPositions,
                educationalLevel: props.employee.educationalLevel,
                foreignLanguage: props.employee.foreignLanguage,
                professionalSkill: props.employee.degrees,
            }
        })
    }, [props.id])

    const { translate, listMajor, listPosition } = props;
    console.log("listPosition", listPosition)

    const { id, educationalLevel, foreignLanguage, professionalSkill, experiences, careerPositions } = state;

    // console.log("professionalSkill", professionalSkill)

    let professionalSkills= '';
    
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

    if (professionalSkill) {
        professionalSkill.map(item => {
            professionalSkills = professionalSkills + professionalSkillArr.find(x => x.value == item.degreeQualification).text + " (" + listMajor.find(y => item.major == y._id).name + ", " + item.issuedBy + ", " + new Date(item.year).getFullYear() + ")" + `; `
        })
    }

    


    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.academic_level')}</h4></legend>
                    {/* Trình độ văn hoá */}
                    <div className="form-group">
                        <strong>{translate('human_resource.profile.educational_level')}&emsp; </strong>
                        {educationalLevel}
                    </div>
                    {/* Trình độ ngoại ngữ */}
                    <div className="form-group" >
                        <strong>{translate('human_resource.profile.language_level')}&emsp; </strong>
                        {foreignLanguage}
                    </div>
                    {/* Trình độ chuyên môn */}
                    <div className="form-group">
                        <strong>{translate('human_resource.profile.qualification')}&emsp; </strong>
                        {professionalSkills}
                    </div>
                </fieldset>
                {/* Danh sách kinh nghiệm làm việc */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.Working_process')}</h4></legend>
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.from_month_year')}</th>
                                <th>{translate('human_resource.profile.to_month_year')}</th>
                                <th>{translate('human_resource.profile.unit')}</th>
                                <th>{translate('table.position')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (experiences && experiences.length !== 0) &&
                                experiences.map((x, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(x.startDate, true)}</td>
                                        <td>{formatDate(x.endDate, true)}</td>
                                        <td>{x.company}</td>
                                        <td>{x.position}</td>
                                    </tr>

                                ))
                            }

                        </tbody>
                    </table>
                    {
                        (!experiences || experiences.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>
                {/* Danh sách vị trí công việc */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">Dự án từng tham gia</h4></legend>
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.from_month_year')}</th>
                                <th>{translate('human_resource.profile.to_month_year')}</th>
                                <th>{translate('human_resource.profile.unit')}</th>
                                <th>Gói thầu</th>
                                <th>Vị trí công việc</th>
                                <th>{translate('human_resource.profile.attached_files')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (careerPositions && careerPositions.length !== 0) &&
                                careerPositions.map((x, index) => {
                                    let position = ''
                                    if (x.careerPosition) {
                                        position = listPosition.listPosition?.find(y => y._id.toString() === x.careerPosition.toString())
                                        if (position) {
                                            position = position.name
                                        } else {
                                            position = 'DELETED'
                                        }
                                    }
                                    return (
                                    <tr key={index}>
                                        <td>{formatDate(x.startDate, true)}</td>
                                        <td>{formatDate(x.endDate, true)}</td>
                                        <td>{x.company}</td>
                                        <td>{x.biddingPackageName}</td>
                                        <td>{position}</td>
                                        <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                            <a className='intable'
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                <i className="fa fa-download"> &nbsp;Download!</i>
                                            </a>
                                        }</td>
                                    </tr>

                                )})
                            }

                        </tbody>
                    </table>
                    {
                        (!experiences || experiences.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>
            </div>
        </div>
    );
};

function mapState(state) {
    const { career } = state;
    return { career };
};

const actionCreators = {
    getListCareerPosition: CareerReduxAction.getListCareerPosition
};

const tabExperience = connect(mapState, actionCreators)(withTranslate(ExperiencTab));
export { tabExperience as ExperiencTab };