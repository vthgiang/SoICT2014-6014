import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, DataTableSetting, DatePicker, ExportExcel, SelectBox } from '../../../../../common-components';
import { BiddingPackageManagerActions } from '../../biddingPackageManagement/redux/actions';
import { BiddingPackageReduxAction } from '../../redux/actions';

function KeyPeople(props) {
    const [state, setState] = useState({
        keyPeople: []
    });

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
        }
    }, [props.id])
    
    const { translate, listMajor, listCareer, listCertificate, keyPersonnelRequires, keyPeople, career } = props;
    const { id } = state;

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

    const convertDataExport = () => {
        let datas = [];
        let experiencesSheet = [];
        let professionalExperienceSheet = [];
        let contactName = props.auth?.user?.name;
        let contactNumber = props.auth?.user?.phoneNumber;
        let contactEmail = props.auth?.user?.email;

        let { keyPeople } = state;
            console.log('state', state);
            console.log('props', props);
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
        <div id = {id} className="tab-pane">
            <div className="form-group pull-right" style={{padding: '6px 12px', margin: '5px', width: '100%'}}>
                <ExportExcel id="download_template_search_package" type='link' exportData={convertDataExport()} buttonName='Download hồ sơ nhân sự chủ chốt' />
                <a className="btn btn-success" style={{ paddingLeft: '15px', marginLeft: '15px'}} onClick={() => props.downLoadDocument(props._id)} title="Tải xuống file minh chứng">
                    Tải xuống file minh chứng
                </a>
            </div>
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
                                            <table key={`table-${index}`} className="table table-striped table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>{translate('human_resource.staff_name')}</th>
                                                        <th>Vị trí công việc</th>
                                                        <th>Trình độ chuyên môn</th>
                                                        <th>Chuyên ngành</th>
                                                        <th>Chứng chỉ</th>
                                                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
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
                                                                            return <li key={key}> {formatDate(e?.year)} - {e?.name} - Loại: {e?.degreeType} - Chuyên ngành: {e.major?.name} - Bậc: {degreeQualification}</li>
                                                                        }) : <p>Chưa có dữ liệu</p>}
                                                                    </td>
                                                                    <td>
                                                                        {x.certificates?.length > 0 ? x.certificates?.map((e, key) => {
                                                                            return <li key={key}> {`${e.certificate?.name}`}{e.certificate?.abbreviation ? "("+`${e.certificate.abbreviation}`+")" : ""} - {e?.issuedBy} - hiệu lực: {formatDate(e?.endDate)} </li>
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

            </div>
        </div>
    );
};

const mapState = (state) => {
    const { career, auth } = state;
    return {  career, auth };
}

const keyPeople = connect(mapState, null)(withTranslate(KeyPeople));
export { keyPeople as KeyPeople };