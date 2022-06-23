import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DialogModal } from '../../../../../common-components';
import { nonAccentVietnamese, stringToSlug } from '../../../../../helpers/stringMethod';
import { EmployeeDetailForm } from '../../../../human-resource/profile/employee-management/components/employeeDetailForm';

import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions';
import { taskManagementActions } from '../../../../task/task-management/redux/actions';
import getAllEmployeeSelectBoxItems, { getEmployeeInfoWithTask } from './employeeHelper';

const ModalViewEmployee = (props) => {
    const [state, setState] = useState({
        id: "",
        page: 1,
        limit: 10,
        nameSearch: "",
        currentRowView: null
    });
    const tableId = "list-employee-table-formated";
    const [listEmployee, setListEmployee] = useState([]);
    const [keyword, setKeyword] = useState("");
    const save = async () => {
        console.log(18, state);
    }

    const { employeesManager, tasks, translate } = props;
    const { id, currentRowView } = state;

    useEffect(() => {
        // props.getAllEmployee();
        // props.getPaginateTasks({ getAll: true });
        setState({ ...state, id: props.id })
    }, [props.id]);

    useEffect(() => {
        setListEmployee(props.listEmployee);
    }, [JSON.stringify(props.listEmployee)]);

    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    let allEmployeeCompany = getAllEmployeeSelectBoxItems(allEmployee);

    const handleChange = (e) => {
        const { name, value } = e?.target;
        setState({
            ...state,
            [name]: value,
        })
    }

    const handleSubmitSearch = (nameSearch) => {
        const newKey = nonAccentVietnamese(nameSearch)
        setKeyword(newKey)
    }

    const formatSkill = (skill) => {
        // Trình độ chuyên môn: intermediate_degree - Trung cấp, colleges - Cao đẳng, university - Đại học, bachelor - cử nhân, engineer - kỹ sư, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có
        switch (skill) {
            case "intermediate_degree": return "Trung cấp";
            case "colleges": return "Cao đẳng";
            case "university": return "Đại học";
            case "bachelor": return "Cử nhân";
            case "engineer": return "Kỹ sư";
            case "master_degree": return "Thạc sĩ";
            case "phd": return "Tiến sĩ";

            default:
                return "Không có dữ liệu";
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
            window.$(`#modal-detail-employee${value.empId}`).modal('show');
        }, 500);

    }

    return (
        <React.Fragment>
            <DialogModal
                size='100' modalID={`modal-view-employee-${id}`}
                formID={`form-view-employee-${id}`}
                title="Xem thông tin nhân viên"
                func={save}
                resetOnSave={true}
                resetOnClose={true}
                hasSaveButton={false}
                afterClose={() => {
                    setState({
                        ...state,
                        nameSearch: "",
                    });
                    setKeyword("")
                }}
            >
                <div className="box">
                    <div className="box-body qlcv">
                        <div className="form-inline">
                            {/* Tìm kiếm */}
                            <div className="form-group">
                                <label className="form-control-static">Tên:</label>
                                <input type="text" className="form-control" value={state.nameSearch} name="nameSearch" onChange={handleChange} placeholder={`Tên nhân viên...`} autoComplete="off" />
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch(state.nameSearch)}>{translate('manage_example.search')}</button>
                            </div>
                        </div>
                        <br />

                        <table id={tableId} className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Tên nhân viên</th>
                                    <th>Vai trò</th>
                                    <th>Trình độ chuyên môn</th>
                                    <th>Số lượng công việc cần làm</th>
                                    <th style={{ width: "120px", textAlign: "center" }}>
                                        {translate('table.action')}
                                        <DataTableSetting
                                            tableId={tableId}
                                            columnArr={[
                                                "Tên nhân viên",
                                                'Trình độ chuyên môn',
                                                'Số lượng công việc cần làm',
                                            ]}
                                        // setLimit={setLimit}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(listEmployee && listEmployee.length !== 0) &&
                                    listEmployee.filter(x => {
                                        const reg = new RegExp(keyword, "gi")
                                        return nonAccentVietnamese(x?.employeeInfo?.fullName)?.toLocaleLowerCase().match(reg)
                                    }).map((x, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{x?.fullName}</td>
                                                <td>{x?.isKeyPeople ? "Nhân sự chủ chốt" : "Không có dữ liệu"}</td>
                                                <td>{formatSkill(x?.employeeInfo?.professionalSkill)}</td>
                                                <td>{x?.task?.length || "không có công việc"}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <a style={{ width: '5px' }} onClick={() => handleView(x)} title="detail"><i className="material-icons">view_list</i></a>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )
                                }
                            </tbody>
                        </table>

                        {/* PaginateBar */}
                        {employeesManager && employeesManager.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (!listEmployee || listEmployee?.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                        {/* <PaginateBar
                            pageTotal={totalPage ? totalPage : 0}
                            currentPage={page}
                            display={lists && lists.length !== 0 && lists.length}
                            total={project && project.data.totalDocs}
                            func={setPage}
                        /> */}

                        {/* From xem thông tin nhân viên */
                            <EmployeeDetailForm
                                _id={currentRowView ? currentRowView.empId : ""}
                            />
                        }
                    </div>
                </div>

            </DialogModal>
        </React.Fragment>
    );
};


function mapState(state) {
    const { employeesManager, user, tasks } = state;
    return { employeesManager, user, tasks };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    getPaginateTasks: taskManagementActions.getPaginateTasks,
};

const connectComponent = connect(mapState, actionCreators)(withTranslate(ModalViewEmployee));
export { connectComponent as ModalViewEmployee };
