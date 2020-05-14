import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DeleteNotification, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';
import { EducationProgramCreateForm, EducationProgramEditForm, EducationProgramDetailForm } from './combinedContent';

import { EducationActions } from '../redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';


class ListEducation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            organizationalUnit: null,
            page: 0,
            limit: 5,
            hideColumn: []

        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.props.getListEducation(this.state);
        this.props.getDepartment();
    }
    // Function bắt sự kiện chỉnh sửa chương trình đào tạo
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentEditRow: value
        })
        window.$('#modal-edit-education').modal('show');
    }

    // Function bắt sự kiện xem thông tin chương trình đào tạo
    handleView = async (value) => {
        await this.setState({
            ...this.state,
            currentViewRow: value
        })
        window.$('#modal-view-education').modal('show');
    }


    // Function lưu giá trị unit vào state khi thay đổi
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnit: value
        })
    }

    // Function lưu giá trị chức vụ vào state khi thay đổi
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleSunmitSearch = () => {
        this.props.getListEducation(this.state);
    }

    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getListEducation(this.state);
    }

    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListEducation(this.state);
    }

    render() {
        const { translate, education } = this.props;
        const { list } = this.props.department;
        var listEducations = "", listPosition = [];
        if (this.state.organizationalUnit !== null) {
            let organizationalUnit = this.state.organizationalUnit;
            organizationalUnit.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let position = [
                            { _id: x.dean._id, name: x.dean.name },
                            { _id: x.viceDean._id, name: x.viceDean.name },
                            { _id: x.employee._id, name: x.employee.name }
                        ]
                        listPosition = listPosition.concat(position)
                    }
                })
            })
        }
        if (education.isLoading === false) {
            listEducations = education.listEducations;
        }
        var pageTotal = (education.totalList % this.state.limit === 0) ?
            parseInt(education.totalList / this.state.limit) :
            parseInt((education.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <EducationProgramCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <h4 className="box-title">Danh sách chương trình đào tạo bắt buộc:</h4>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.position')}</label>
                            <SelectMulti id={`multiSelectPosition`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_position'), allSelectedText: translate('human_resource.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                        <button type="button" className="btn btn-success" onClick={this.handleSunmitSearch} title="Tìm kiếm" >Tìm kiếm</button>
                    </div>
                    <table id="education-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th title="Mã chương trình đào tạo">Mã chương trình</th>
                                <th title="Tên chương trình đào tạo">Tên chương trình</th>
                                <th>Áp dụng cho đơn vị</th>
                                <th>Áp dụng cho chức vụ</th>
                                <th>Tổng số khoá học</th>
                                <th style={{ width: '120px' }}>Hành động
                                <DataTableSetting
                                        tableId="education-table"
                                        columnArr={[
                                            "Mã chương trình",
                                            "Tên chương trình đào tạo",
                                            "Áp dụng cho đơn vị",
                                            "Áp dụng cho chức vụ"
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listEducations !== 'undefined' && listEducations.length !== 0) &&
                                listEducations.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.programId}</td>
                                        <td>{x.name}</td>
                                        <td>{(typeof x.applyForOrganizationalUnits === 'undefined' || x.applyForOrganizationalUnits.length === 0) ? "" :
                                            x.applyForOrganizationalUnits.map((y, indexs) => {
                                                if (indexs === 0) {
                                                    return y.name
                                                }
                                                return ", " + y.name
                                            })}
                                        </td>
                                        <td>{(typeof x.applyForPositions === 'undefined' || x.applyForPositions.length === 0) ? "" :
                                            x.applyForPositions.map((y, indexs) => {
                                                if (indexs === 0) {
                                                    return y.name
                                                }
                                                return ", " + y.name
                                            })}
                                        </td>
                                        <td>{x.totalList}</td>
                                        <td>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title="Thông tin chương trình đào tạo"><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa chương trình đào tạo"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xoá chương trình đào tạo"
                                                data={{
                                                    id: x._id,
                                                    info: x.name + " - " + x.programId
                                                }}
                                                func={this.props.deleteEducation}
                                            />
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {education.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listEducations === 'undefined' || listEducations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                {
                    this.state.currentEditRow !== undefined &&
                    <EducationProgramEditForm
                        _id={this.state.currentEditRow._id}
                        name={this.state.currentEditRow.name}
                        programId={this.state.currentEditRow.programId}
                        organizationalUnit={this.state.currentEditRow.applyForOrganizationalUnits}
                        position={this.state.currentEditRow.applyForPositions}
                    />
                }
                {
                    this.state.currentViewRow !== undefined &&
                    <EducationProgramDetailForm
                        _id={this.state.currentViewRow._id}
                        name={this.state.currentViewRow.name}
                        programId={this.state.currentViewRow.programId}
                        listCourses={this.state.currentViewRow.listCourses}
                        totalList={this.state.currentViewRow.listCourse}
                        data={this.state.currentViewRow}
                    />
                }
            </div>
        );
    };
};

function mapState(state) {
    const { education, department } = state;
    return { education, department };
};

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getListEducation: EducationActions.getListEducation,
    deleteEducation: EducationActions.deleteEducation,
};

const connectedListEducation = connect(mapState, actionCreators)(withTranslate(ListEducation));
export { connectedListEducation as ListEducation };