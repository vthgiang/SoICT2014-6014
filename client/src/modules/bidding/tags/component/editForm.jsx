import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import { EmployeeManagerActions } from '../../../human-resource/profile/employee-management/redux/actions';
import getAllEmployeeSelectBoxItems, { convertEmpIdToName } from '../../bidding-package/biddingPackageManagement/components/employeeHelper';
import { TagActions } from '../redux/actions';

const EditTag = (props) => {
    const { translate, tag, employeesManager } = props;

    const initState = {
        name: "",
        description: "",
        employees: [],
        employeeWithSuitability: []
    }
    const [state, setState] = useState(initState)
    const [id, setId] = useState(props.id);

    useEffect(() => {
        props.getAllEmployee();
    }, []);

    useEffect(() => {
        if (props.id) {
            const { tagItem } = props
            setState({
                ...state,
                id: props.id,
                name: tagItem?.name,
                description: tagItem?.description,
                employees: tagItem?.employees ?? [],
                employeeWithSuitability: tagItem?.employeeWithSuitability ?? [],
            });
            setId(props.id);
        }
    }, [props.id, JSON.stringify(props.tagItem)])

    const save = () => {
        let data = {
            tagId: state.id,
            name: state.name,
            description: state.description,
            employees: state.employees,
            employeeWithSuitability: state.employeeWithSuitability,
        }
        console.log(1718, state, data)
        props.editTag(data);
    }

    const isFormValidated = () => {
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, state.name, 1, 255).status) return false;
        if (state.employees.length === 0) return false;

        return true;
    }

    const handleChangeTagForm = (key, e) => {
        let { value } = e.target;

        setState({
            ...state,
            [key]: value,
        })
    }

    const handleChangeTagEmployee = (key, value) => {
        let { employeeWithSuitability } = state;
        let newEmployeeWithSuitability = value.map(x => {
            let existedEmp = employeeWithSuitability.find(item => String(item.employee) === String(x))
            return {
                employee: x,
                suitability: existedEmp ? existedEmp.suitability : 5,
            }
        })
        setState({
            ...state,
            [key]: value,
            employeeWithSuitability: newEmployeeWithSuitability
        })
    }

    const handleChangeSuitability = (index, e) => {
        let { value } = e.target;
        let { employeeWithSuitability } = state;
        let newList = employeeWithSuitability.map((x, idx) => {

            if (idx === index) {
                x = {
                    ...x,
                    suitability: Number(value),
                }
            }
            return x;
        })

        setState({
            ...state,
            employeeWithSuitability: newList
        })
    }

    const { name, description, employeeWithSuitability, employees } = state;
    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }
    let allEmployeeCompany = getAllEmployeeSelectBoxItems(allEmployee);

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-tag-${id}`}
                formID="form-edit-tag"
                title="Chỉnh sửa tag"
                disableSubmit={!isFormValidated()}
                func={save}
                size={50}
            >
                <form id="form-edit-tag">
                    <div >
                        <div className="form-group">
                            <label>Tên tag<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name={`name-tag`} onChange={(value) => handleChangeTagForm("name", value)} value={name} placeholder="Tên thẻ" autoComplete="off" />
                            <ErrorLabel content={state?.tagNameError} />
                        </div>
                        <div className="form-group">
                            <label>Mô tả tag</label>
                            <textarea type="text" rows={3} style={{ minHeight: '73.5px' }}
                                name={`desc-tag`}
                                onChange={(value) => handleChangeTagForm("description", value)}
                                value={description}
                                className="form-control"
                                placeholder="Mô tả thẻ"
                                autoComplete="off"
                            />
                        </div>
                        <div className={`form-group`}>
                            <label className="control-label">Nhân sự phù hợp<span className="text-red">*</span></label>
                            {allEmployeeCompany && <SelectBox
                                id={`tag-employees-edit-${id}`}
                                // ${currentTagIndex}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={allEmployeeCompany ? allEmployeeCompany : []}
                                onChange={(value) => handleChangeTagEmployee("employees", value)}
                                options={{ placeholder: "Chọn nhân sự" }}
                                value={employees}
                                multiple={true}
                            />}
                        </div>

                        <div><strong>Độ phù hợp của từng nhân viên:</strong><span className="text-red">*</span></div>
                        <table id="tags-employeeWithSuitability-edit" className="table not-has-action table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Nhân viên</th>
                                    <th>Độ phù hợp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    employeeWithSuitability?.map((item, listIndex) => {
                                        return (
                                            <tr key={`employeeWithSuitability-${listIndex}-${id}`}>
                                                <td>{listIndex + 1}</td>
                                                <td>{convertEmpIdToName(allEmployee, item.employee)}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name={`employeeWithSuitability`}
                                                        onChange={(value) => handleChangeSuitability(listIndex, value)}
                                                        value={item?.suitability} placeholder="Độ phù hợp" autoComplete="off" />
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {employeeWithSuitability?.length <= 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );

}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    editTag: TagActions.editTag,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditTag));