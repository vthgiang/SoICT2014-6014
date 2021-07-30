import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PaginateBar, DataTableSetting } from '../../../../../common-components';
import { EducationProgramDetailForm } from '../components/combinedContent';

import { EducationActions } from '../../../education-program/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';


const ListTrainingProgram = (props) => {
    const [state, setState] = useState({
        name: null,
        programId: null,
        position: null,
        organizationalUnit: null,
        page: 0,
        limit: 5,
    })

    useEffect(() => {
        props.getListEducation(state);
        props.getDepartment();
    }, [])

    /**
     * Function bắt sự kiện xem thông tin chương trình đào tạo
     * @param {*} value : Thông tin chương trình đào tạo
     */
    const handleView = async (value) => {
        await setState({
            ...state,
            currentViewRow: value
        })
        window.$(`#modal-view-education${value._id}`).modal('show');
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setState({
            ...state,
            [name]: value
        });
    }

    /**
     * Bắt sự kiện tìm kiếm chương trình đào tạo
     */
    const handleSunmitSearch = () => {
        props.getListEducation(state);
    }

    /**
     * Function thay đổi số dòng hiện thị trên 1 trang
     * @param {*} number : Số dòng hiện thị trên 1 trang
     */
    const setLimit = async (number) => {
        await setState({
            limit: parseInt(number),
        });
        props.getListEducation(state);
    }

    /**
     * Function thay đổi số trang muốn xem
     * @param {*} pageNumber : Số trang muốn xem
     */
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (state.limit);
        await setState({
            page: parseInt(page),
        });
        props.getListEducation(state);
    }

    const { translate, education, department } = props;

    const { limit, page, organizationalUnit, currentEditRow, currentViewRow } = state;

    const { list } = department;
    let listEducations = [], listPosition = [{ value: "", text: translate('human_resource.not_unit'), disabled: true }];

    if (organizationalUnit !== null) {
        listPosition = [];
        organizationalUnit.forEach(u => {
            list.forEach(x => {
                if (x._id === u) {
                    let roleManagers = x.managers.map(y => { return { _id: y._id, name: y.name } });
                    let roleDeputyManagers = x.deputyManagers.map(y => { return { _id: y._id, name: y.name } });
                    let roleEmployees = x.employees.map(y => { return { _id: y._id, name: y.name } });
                    listPosition = listPosition.concat(roleManagers).concat(roleDeputyManagers).concat(roleEmployees);
                }
            })
        })
    }

    if (education.isLoading === false) {
        listEducations = education.listEducations;
    }

    let pageTotal = (education.totalList % limit === 0) ?
        parseInt(education.totalList / limit) :
        parseInt((education.totalList / limit) + 1);
    let crurrentPage = parseInt((page / limit) + 1);

    return (
        <div className="box">
            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Mã chương trình đào tạo */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('training.education_program.table.program_code')}</label>
                        <input type="text" className="form-control" name="programId" onChange={handleChange} placeholder={translate('training.education_program.table.program_code')} autoComplete="off" />
                    </div>
                    {/* Tên chương trình đào tạo  */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('training.education_program.table.program_name')}</label>
                        <input type="text" className="form-control" name="name" onChange={handleChange} placeholder={translate('training.education_program.table.program_name')} autoComplete="off" />
                    </div>
                </div>

                <div className="form-inline" style={{ marginBottom: 10 }}>
                    {/* button tìm kiếm */}
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" onClick={handleSunmitSearch} >{translate('general.search')}</button>
                    </div>
                </div>

                <table id="education-table" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th title={translate('training.education_program.education_program_code')}>{translate('training.education_program.table.program_code')}</th>
                            <th title={translate('training.education_program.education_program_name')}>{translate('training.education_program.table.program_name')}</th>
                            <th>{translate('training.education_program.table.total_courses')}</th>
                            <th style={{ width: '120px' }}>{translate('general.action')}
                                <DataTableSetting
                                    tableId="education-table"
                                    columnArr={[
                                        translate('training.education_program.table.program_code'),
                                        translate('training.education_program.table.program_name'),
                                        translate('training.education_program.table.total_courses')
                                    ]}
                                    limit={state.limit}
                                    setLimit={setLimit}
                                    hideColumnOption={true}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listEducations && listEducations.length !== 0 &&
                            listEducations.map((x, index) => (
                                <tr key={index}>
                                    <td>{x.programId}</td>
                                    <td>{x.name}</td>
                                    <td>{x.totalList}</td>
                                    <td>
                                        <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('training.education_program.view_education_program')}><i className="material-icons">view_list</i></a>
                                    </td>
                                </tr>))
                        }
                    </tbody>
                </table>
                {education.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listEducations || listEducations.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={crurrentPage} func={setPage} />
            </div>
            {   /* Form xem thông tin chương trình đào tạo */
                currentViewRow &&
                <EducationProgramDetailForm
                    _id={currentViewRow._id}
                    programName={currentViewRow.name}
                    programId={currentViewRow.programId}
                    listCourses={currentViewRow.listCourses}
                    totalList={currentViewRow.totalList}
                    data={currentViewRow}
                />
            }
        </div>
    );
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

const listTrainingProgram = connect(mapState, actionCreators)(withTranslate(ListTrainingProgram));

export { listTrainingProgram as TabListTrainingProgram }
