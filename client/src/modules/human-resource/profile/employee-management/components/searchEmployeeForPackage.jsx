import React, { Component } from 'react';
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


class SearchEmployeeForPackage extends Component {
    constructor(props) {
        super(props);
        let search = window.location.search.split('?')
        let keySearch = 'organizationalUnits';
        let organizationalUnits = null;
        for (let n in search) {
            let index = search[n].lastIndexOf(keySearch);
            if (index !== -1) {
                organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length);
                if (organizationalUnits !== 'null' && organizationalUnits.trim() !== '') {
                    organizationalUnits = organizationalUnits.split(',')
                } else organizationalUnits = null
                break;
            }
        }

        this.state = {
            searchForPackage: true,
            organizationalUnits: organizationalUnits,
            status: 'active',
            biddingPackageId: '',
            page: 0,
            limit: 5,
            kpiForManager: false
        }
    }

    componentDidMount() {
        this.props.getListMajor({ name: '', page: 1, limit: 1000 });
        this.props.getListCareerPosition({ name: '', page: 1, limit: 1000 });
        this.props.getListCertificate({ name: '', page: 1, limit: 1000 });
        this.props.getAllBiddingPackage({ name: '', page: 1, limit: 1000 });
    }

    /**
     * Function format dữ liệu Date thành string
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
        } else {
            return date
        }
    }

    /**
     *  Bắt sự kiện click xem thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn xem
     */
    handleView = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowView: value
            }
        });
        window.$(`#modal-detail-employee${value._id}`).modal('show');
    }

    handleKpiForManager = async (value) => {
        await this.setState(state => {
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
    handleEdit = async (value) => {
        await this.setState(state => {
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
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnits: value
        })
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id trình độ
     */
    handleChangeBiddingPackage = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            package: value[0]
        })
    }

    updateSearchData = async (data) => {
        this.setState({
            package: data.package,
        });

    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        this.props.searchForPackage(this.state);
    }
    
    render() {
        console.log('oppend', this.state);
        const { employeesManager, translate, career, major, certificate, biddingPackagesManager } = this.props;

        const listBiddingPackages = biddingPackagesManager?.listBiddingPackages;
        
        const { importEmployee, limit, page, currentRow, currentRowView } = this.state; // filterField, filterPosition, filterAction, 
        
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
            { value: "", text: "Chọn trình độ" },
            { value: "intermediate_degree", text: "Trung cấp" },
            { value: "colleges", text: "Cao đẳng" },
            { value: "university", text: "Đại học" },
            { value: "bachelor", text: "Cử nhân" },
            { value: "engineer", text: "Kỹ sư" },
            { value: "master_degree", text: "Thạc sĩ" },
            { value: "phd", text: "Tiến sĩ" },
            { value: "unavailable", text: "Không có" },
        ];

        // Filter danh sách
        let filterPosition = listPosition;

        let posCodeArr = [];
        let dataTreePosition = [];

        // console.log('listEmployees', listEmployees);
        // console.log('listEmployeesPackage', employeesManager.listEmployeesPackage);
        // console.log('careerPosition', career);
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
                            onChange={this.handleChangeBiddingPackage}
                            value={this.state.package}
                            multiple={false}
                        />
                        </div>
                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label>
                                <button type="button" className="btn btn-success" title={translate('general.search')} onClick={this.handleSunmitSearch} >{translate('general.search')}</button>
                            </label>
                        </div>
                    </div>

                    {
                        listEmployeesPackage && listEmployeesPackage.length !== 0 && listEmployeesPackage.map((item, index) => (
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
                                                            limit={this.state.limit}
                                                            setLimit={this.setLimit}
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
                                                                    return <li key={key}> {e?.careerPosition?.name} {e?.startDate ? "- Ngày bắt đầu: "+this.formatDate(e?.startDate) : ""} {e?.endDate ? "- Ngày kết thúc: "+this.formatDate(e?.endDate) : ""} </li>
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
                                                                    return <li key={key}> {e.certificate?.name}{e.certificate?.abbreviation ? "("+e.certificate?.abbreviation+")" : ""} - {e?.issuedBy} - hiệu lực: {this.formatDate(e?.endDate)} </li>
                                                                }) : <p>Chưa có dữ liệu</p>}
                                                            </td>
                                                            <td>
                                                                {x.degrees.length > 0 ? x.degrees?.map((e, key) => {
                                                                    return <li key={key}> {this.formatDate(e?.year)} - {e?.name} - Loại: {e?.degreeType} - Chuyên ngành: {e.major?.name} - Bậc: {e.degreeQualification}</li>
                                                                }) : <p>Chưa có dữ liệu</p>}
                                                            </td>
                                                            <td>
                                                                <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
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
                    this.state.importSearch && <SearchDataImportForm updateSearchData={this.updateSearchData} />
                }
            </div>
        );
    };
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
    getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage
};

export default connect(mapState, actionCreators)(withTranslate(SearchEmployeeForPackage));