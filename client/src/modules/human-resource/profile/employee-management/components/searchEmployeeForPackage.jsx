import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti, ExportExcel, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';

import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom, EmployeeImportForm } from './combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { CareerReduxAction } from '../../../career/redux/actions';
import { MajorActions } from '../../../major/redux/actions';


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
            // organizationalUnits: organizationalUnits,
            status: 'active',
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.getAllEmployee(this.state);
        this.props.getDepartment();
        this.props.getListMajor({ name: '', page: 1, limit: 1000 });
        this.props.getListCareerPosition({ name: '', page: 1, limit: 1000 });
        this.props.getListCareerAction({ name: '', page: 1, limit: 1000 });
        this.props.getListCareerField({ name: '', page: 1, limit: 1000 });
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
    handleChangeProfessionalSkill = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            professionalSkill: value
        })
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id Chuyên ngành
     */
    handleMajor = (value) => {
        let { major } = this.props;
        const listMajor = major.listMajor;
        let dataTreeMajor = []
        for (let i in listMajor) {
            let groupMap = listMajor[i].group;
            let group = listMajor[i].group.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    parent: "#",
                }
            });
            dataTreeMajor = [...dataTreeMajor, ...group];
            for (let x in groupMap) {
                let specializedMap = groupMap[x].specialized;
                let specialized = groupMap[x].specialized.map(elm => {
                    return {
                        ...elm,
                        id: elm._id,
                        text: elm.name,
                        state: { "opened": true },
                        parent: groupMap[x]._id.toString(),
                    }
                });
                dataTreeMajor = [...dataTreeMajor, ...specialized];
            }
        }

        let majorSearch;
        let tmp = dataTreeMajor.find(e => e.id === value[0])
        if(tmp.specialized) { // là group
            majorSearch = tmp.id
        } else { // là specialize
            majorSearch = tmp.parent;
        }

        this.setState({ majorID: value[0], majorInfo: majorSearch });
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id Vị trí công việc
     */

    handleAction = (value) => {
        // let { career } = this.props;
        // let listAction = career?.listAction.map(elm => { return { ...elm, id: elm._id } });

        // let action = listAction?.filter(e => value.indexOf(e._id) !== -1);

        console.log('action', value);
        this.setState({ action: value });
    };

    handleField = (value) => {
        // let { career } = this.props;
        // let listField = career?.listField.map(elm => { return { ...elm, id: elm._id } });
        // let listPosition = career?.listPosition.map(elm => { return { ...elm, id: elm._id } });
        // let field = listField?.find(e => e._id === value[0]);

        this.setState({ field: value, position: undefined });
    };

    handlePosition = (value) => {
        // let { career } = this.props;
        // let listPosition = career?.listPosition.map(elm => { return { ...elm, id: elm._id } });
        // let position = listPosition?.find(e => e._id === value[0]);

        this.setState({ position: value });
    };

    // handleCareer = (value) => {
    //     this.setState({ careerInfo: value[0] });
    // }

    /**
     * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
     * @param {*} value : Tháng hết hạn hợp đồng
     */
    handleEndDateOfCertificateChange = (value) => {
        // if (value) {
        //     let partMonth = value.split('-');
        //     value = [partMonth[1], partMonth[0]].join('-');
        // }
        this.setState({
            ...this.state,
            endDateOfCertificate: value
        });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        this.props.getAllEmployee(this.state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng trên 1 trang
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getAllEmployee(this.state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang muốn xem
     */
    setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getAllEmployee(this.state);
    }

    /** show more option search */
    clickShowMore = () => {
        this.setState(state => {
            return {
                ...state,
                showMore: !state.showMore,
            }
        });
    }


    render() {
        const { employeesManager, translate, department, career, major } = this.props;

        const { showMore, importEmployee, limit, page, certificatesEndDate, organizationalUnits, professionalSkill, majorInfo, majorID, field, position, action, currentRow, currentRowView } = this.state; // filterField, filterPosition, filterAction, 

        let listEmployees = [];
        if (employeesManager.listEmployees) {
            listEmployees = employeesManager.listEmployees;
        }

        let pageTotal = ((employeesManager.totalList % limit) === 0) ?
            parseInt(employeesManager.totalList / limit) :
            parseInt((employeesManager.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        let listField = career.listField;
        let dataTreeField = []
        let lField = listField.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.name,
                state: { "opened": true },
                parent: "#",
            }
        });
        dataTreeField = [...dataTreeField, ...lField];
        // for (let i in listField) {
        //     let posMap = listField[i].position;
        //     let position = posMap.map(elm => {
        //         return {
        //             ...elm,
        //             id: elm._id,
        //             text: elm.name,
        //             state: { "opened": true },
        //             parent: listField[i]._id.toString(),
        //         }
        //     });
        //     dataTreeField = [...dataTreeField, ...position];
        // }

        let listPosition = career.listPosition;
        let dataTreePosition = []
        let pos = listPosition.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.name,
                state: { "opened": true },
                parent: "#",
            }
        });
        dataTreePosition = [...dataTreePosition, ...pos];
        // for (let i in listPosition) {
        //     let desMap = listPosition[i].description;
        //     let description = desMap.map(elm => {
        //         return {
        //             ...elm,
        //             id: elm._id,
        //             text: elm.name,
        //             state: { "opened": true },
        //             parent: listPosition[i]._id.toString(),
        //         }
        //     });
        //     dataTreePosition = [...dataTreePosition, ...description];

        // }
        let listAction = career.listAction;
        let dataTreeAction = []
        let act = listAction.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.name,
                state: { "opened": true },
                parent: "#",
            }
        });
        dataTreeAction = [...dataTreeAction, ...act];
        // for (let i in listAction) {
        //     let detailMap = listAction[i].detail;
        //     let detail = detailMap.map(elm => {
        //         return {
        //             ...elm,
        //             id: elm._id,
        //             text: elm.name,
        //             state: { "opened": true },
        //             parent: listAction[i]._id.toString(),
        //         }
        //     });
        //     dataTreeAction = [...dataTreeAction, ...detail];
        // }

        const listMajor = major.listMajor;
        let dataTreeMajor = []
        for (let i in listMajor) {
            let groupMap = listMajor[i].group;
            let group = listMajor[i].group.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    parent: "#",
                }
            });
            dataTreeMajor = [...dataTreeMajor, ...group];
            for (let x in groupMap) {
                let specializedMap = groupMap[x].specialized;
                let specialized = groupMap[x].specialized.map(elm => {
                    return {
                        ...elm,
                        id: elm._id,
                        text: elm.name,
                        state: { "opened": true },
                        parent: groupMap[x]._id.toString(),
                    }
                });
                dataTreeMajor = [...dataTreeMajor, ...specialized];
            }
        }

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
        let filterField = dataTreeField;
        let filterPosition = dataTreePosition;
        let filterAction = dataTreeAction;

        let posCodeArr = [];
        if (field?.id) {
            for (let x in field.position) {
                posCodeArr = [...posCodeArr, ...field.position[x].code];
            }
            filterPosition = listPosition.filter((item) => posCodeArr.find(e => e === item.code));
            dataTreePosition = [];
            let pos = filterPosition.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    parent: "#",
                }
            });
            dataTreePosition = [...dataTreePosition, ...pos];
            for (let i in filterPosition) {
                let desMap = filterPosition[i].description;
                let description = desMap.map(elm => {
                    return {
                        ...elm,
                        id: elm._id,
                        text: elm.name,
                        state: { "opened": true },
                        parent: filterPosition[i]._id.toString(),
                    }
                });
                dataTreePosition = [...dataTreePosition, ...description];
            } console.log('possss', posCodeArr, filterPosition, dataTreePosition);
        }


        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Vị trí công việc  */}
                        <div className="form-group">
                            <label className="form-control-static">Vị trí công việc</label>
                            <TreeSelect data={dataTreePosition} value={position} handleChange={this.handlePosition} mode="radioSelect" />
                        </div>
                        {/* Trình độ chuyên môn  */}
                        <div className="form-group">
                            <label className="form-control-static">Trình độ chuyên môn</label>
                            <SelectBox id={`professionalSkillArr-selectbox`}
                                multiple={false}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={professionalSkill}
                                items={professionalSkillArr} onChange={this.handleChangeProfessionalSkill}>
                            </SelectBox>
                        </div>
                        {/* Chuyên ngành  */}
                        <div className="form-group">
                            <label className="form-control-static">Chuyên ngành</label>
                            <TreeSelect data={dataTreeMajor} value={[majorID]} handleChange={this.handleMajor} mode="radioSelect" />
                        </div>
                    </div>

                    <div className="form-inline">
                        {/* Loại chứng chỉ */}
                        <div className="form-group">
                            <label className="form-control-static">Loại chứng chỉ</label>
                            <input type="text" className="form-control" name="certificatesType" onChange={this.handleChange} placeholder={"Oracal Database"} />
                        </div>
                        {/* Loại hợp đồng lao động */}
                        <div className="form-group">
                            <label className="form-control-static">Tên chứng chỉ</label>
                            <input type="text" className="form-control" name="certificatesName" onChange={this.handleChange} />
                        </div>
                        {/* Tháng hết hạn chứng chỉ */}
                        <div className="form-group">
                            <label className="form-control-static">Hiệu lực chứng chỉ</label>
                            <DatePicker
                                id="month-endDate-certificate"
                                // dateFormat="month-year"
                                value={certificatesEndDate}
                                onChange={this.handleEndDateOfCertificateChange}
                            />
                        </div>
                    </div>

                    <div className="form-inline">
                        {/* Số năm kinh nghiệm */}
                        <div className="form-group">
                            <label className="form-control-static">Số năm KN</label>
                            <input type="number" className="form-control" name="exp" onChange={this.handleChange} placeholder={"Số năm kinh nghiệm"} />
                        </div>
                        {/* Số năm kinh nghiệm công việc tương đương */}
                        <div className="form-group">
                            <label className="form-control-static">Số năm KN công việc tương đương</label>
                            <input type="number" className="form-control" name="sameExp" onChange={this.handleChange} placeholder={"Kinh nghiệm công việc tương tự"} />
                        </div>
                    </div>

                    {/* <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">
                                <a style={{ cursor: "pointer" }} onClick={this.clickShowMore}>
                                    {showMore ?
                                        <span>
                                            Show less <i className="fa fa-angle-double-up"></i>
                                        </span>
                                        : <span>
                                            Show more <i className="fa fa-angle-double-down"></i>
                                        </span>
                                    }
                                </a>
                            </label>
                        </div>
                    </div> */}

                    {showMore &&
                        <div className="form-inline">
                            {/* Lĩnh vực công việc  */}
                            <div className="form-group">
                                <label className="form-control-static">Lĩnh vực công việc</label>
                                <TreeSelect data={dataTreeField} value={field} handleChange={this.handleField} mode="radioSelect" />
                            </div>
                            {/* Tên gói thầu */}
                            <div className="form-group">
                                <label className="form-control-static">Tên gói thầu</label>
                                <input type="text" className="form-control" name="package" onChange={this.handleChange} />
                            </div>
                            {/* Hoạt động công việc  */}
                            <div className="form-group">
                                <label className="form-control-static">Hoạt động công việc</label>
                                {/* <TreeSelect data={dataTreeAction} value={action?.id} handleChange={this.handleAction} mode="radioSelect" /> */}
                                <SelectBox
                                    id={`select-career-action-select`}
                                    lassName="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listAction.map(x => {
                                        return { text: x.name, value: x._id }
                                    })}
                                    options={{ placeholder: "Chọn hoạt động công việc" }}
                                    onChange={this.handleAction}
                                    value={action}
                                    multiple={true}
                                />
                            </div>
                            {/* Vị trí công việc  */}
                            {/* <div className="form-group">
                            <label className="form-control-static">Vị trí công việc</label>
                            <TreeSelect data={dataTreePosition} value={position} handleChange={this.handlePosition} mode="radioSelect" />
                        </div> */}
                            {/* Hoạt động công việc  */}
                            {/* <div className="form-group">
                            <label className="form-control-static">Hoạt động công việc</label>
                            <TreeSelect data={dataTreeAction} value={action?.id} handleChange={this.handleAction} mode="radioSelect" />
                        </div> */}
                        </div>
                    }
                    <div className="form-inline" style={{ marginBottom: 15 }}>
                        {/* Button show more */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-primary" title={translate('general.search')} onClick={this.clickShowMore} >
                                { showMore ?
                                    <span>
                                        Show less <i className="fa fa-angle-double-up"></i>
                                    </span>
                                    : <span>
                                        Show more <i className="fa fa-angle-double-down"></i>
                                    </span>
                                }    
                            </button>
                        </div>
                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            {/* <label></label> */}
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={this.handleSunmitSearch} >{translate('general.search')}</button>
                        </div>
                    </div>

                    <table id="employee-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_number')}</th>
                                <th>{translate('human_resource.staff_name')}</th>
                                <th>{translate('human_resource.profile.gender')}</th>
                                <th>{translate('human_resource.profile.date_birth')}</th>
                                <th>{translate('human_resource.profile.contract_end_date')}</th>
                                <th>{translate('human_resource.profile.type_contract')}</th>
                                <th>{translate('human_resource.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="employee-table"
                                        columnArr={[
                                            translate('human_resource.staff_number'),
                                            translate('human_resource.staff_name'),
                                            translate('human_resource.profile.gender'),
                                            translate('human_resource.profile.date_birth'),
                                            translate('human_resource.profile.contract_end_date'),
                                            translate('human_resource.profile.type_contract'),
                                            translate('human_resource.status'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listEmployees && listEmployees.length !== 0 &&
                                listEmployees.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employeeNumber}</td>
                                        <td>{x.fullName}</td>
                                        <td>{translate(`human_resource.profile.${x.gender}`)}</td>
                                        <td>{this.formatDate(x.birthdate)}</td>
                                        <td>{this.formatDate(x.contractEndDate)}</td>
                                        <td>{x.contractType}</td>
                                        <td style={{ color: x.status === "active" ? "#00a65a" : '#dd4b39' }}>{translate(`human_resource.profile.${x.status}`)}</td>
                                        <td>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
                                            {/* <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.edit_employee')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('human_resource.profile.employee_management.delete_employee')}
                                                data={{
                                                    id: x._id,
                                                    info: x.fullName + " - " + x.employeeNumber
                                                }}
                                                func={this.props.deleteEmployee}
                                            /> */}
                                        </td>
                                    </tr>
                                )
                                )}
                        </tbody>

                    </table>
                    {employeesManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listEmployees || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
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
            </div>
        );
    };
}

function mapState(state) {
    const { employeesManager, department, career, major } = state;
    return { employeesManager, department, career, major };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    getListCareerAction: CareerReduxAction.getListCareerAction,
    getListCareerField: CareerReduxAction.getListCareerField,
    getListMajor: MajorActions.getListMajor,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    deleteEmployee: EmployeeManagerActions.deleteEmployee,
};

const searchEmployeeForPackage = connect(mapState, actionCreators)(withTranslate(SearchEmployeeForPackage));
export { searchEmployeeForPackage as SearchEmployeeForPackage };