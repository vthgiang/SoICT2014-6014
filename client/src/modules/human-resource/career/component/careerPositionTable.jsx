import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SearchBar, DeleteNotification, PaginateBar, DataTableSetting, ToolTip, ConfirmNotification } from '../../../../common-components';

import { CareerReduxAction } from '../redux/actions';
import EditForm from './editForm';
import CreateForm from './createForm';

import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import Swal from 'sweetalert2';
function CareerPositionTable(props) { 

    const tableId_constructor = "table-manage-career-position";
    const defaultConfig = { name: '', page: 0, limit: 100 }
    const limit = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        limit: limit,
        page: 0,
        name: '', // Mặc định tìm kiếm theo tên
    })

    let { careerPositionDuplicate, careerPositionDuplicateName } = state;
    // Cac ham xu ly du lieu voi modal
    const handleAddCareerPosition = async (careerPosition) => {
        await setState({
            ...state,
        });
        window.$('#modal-create-career-position').modal('show');
    }

    const handleEdit = async (careerPosition) => {
        await setState({
            ...state,
            currentRow: careerPosition
        });
        window.$('#edit-career-position').modal('show')
    }

    const handleDelete = (careerPosition) => {
        const { translate } = props;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            console.log('Confirm delete');
            props.deleteCareerPosition(careerPosition._id);            
        })
    }

    const setName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            name: value
        });
    }

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        let { name, limit } = state;
        const data = {
            limit,
            page,
            name: name,
        };
        props.get(data);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        let { name, page } = state;
        const data = {
            limit: number,
            page,
            name: name,
        };
        props.get(data);
    }

    const searchWithOption = async () => {
        const data = {
            limit: state.limit,
            page: state.page,
            name: state.name
        };
        await props.get(data);
    }

    useEffect(() => {
        props.get({ name: '', page: 0, limit: 1000 });
        // props.get({ name: state.name, page: state.page, limit: state.limit });
    }, [])

    const { career, translate } = props;
    let careerPosition = career;
    const { currentRow, tableId } = state;
    console.log("currentRow", currentRow)

    return (
        <React.Fragment>

            {/* Button thêm vị trí công việc mới */}
            <div style={{ display: 'flex', marginBottom: 6, marginTop: 20, float: 'right' }}>
                <a className="btn btn-success pull-right" href="#modal-create-career-position" title="Add careerPosition" onClick={handleAddCareerPosition}>Thêm</a>
            </div>

            {
                <CreateForm />
            }

            {/* Thanh tìm kiếm */}
            <div className="form-inline" style={{ marginBottom: '20px', marginTop: '20px' }}>
                <div className="form-group" style={{ marginRight: '20px' }}>
                    <label className="form-control-static"style={{ marginRight: '20px' }}>Vị trí công việc</label>
                    <input type="text" className="form-control" name="name" onChange={setName} placeholder={"Nhập tên vị trí công việc"} autoComplete="off" />
                </div>
                <div className="form-group">  
                    <label></label>
                    <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={searchWithOption}>{translate('asset.general_information.search')}</button>
                </div>
            </div>

            {/* Bảng dữ liệu vị trí công việc */}
            <table className="table table-hover table-striped table-bordered" id={tableId}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Code</th>
                        <th>Mô tả</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>
                            {translate('table.action')}
                            <DataTableSetting
                                columnName={translate('table.action')}
                                columnArr={[
                                    "Tên",
                                    "Code",
                                    "Các tên khác tương đương",
                                    "Mô tả"
                                ]}
                                setLimit={setLimit}
                                tableId={tableId}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {   career &&
                        career?.listPosition?.map(careerPosition =>
                            <tr key={`careerPositionList${careerPosition._id}`} style={careerPositionDuplicateName && careerPositionDuplicateName.includes(careerPosition.name.trim().toLowerCase().replaceAll(" ", "")) ? { color: "orangered", fontWeight: "bold" } : { color: "" }}>
                                <td> {careerPosition.name} </td>
                                <td> {careerPosition.code} </td>
                                <td> {careerPosition.description} </td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="edit" href={`#${careerPosition._id}`} onClick={() => handleEdit(careerPosition)}><i className="material-icons">edit</i></a>
                                    {
                                        <ConfirmNotification
                                            icon="question"
                                            title="Xóa vị trí công việc"
                                            name="delete"
                                            className="text-red"
                                            content={`<h4>Delete ${careerPosition.name + " - " + careerPosition.code}</h4>`}
                                            func={() => props.deleteCareerPosition(careerPosition._id)}
                                        />
                                    }
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            {/* Form chỉnh sửa thông tin vị trí công việc */}

            {
                currentRow &&
                <EditForm
                    careerPositionId={currentRow._id}
                    careerPositionName={currentRow.name}
                    careerPositionCode={currentRow.code}
                    careerPositionDescription={currentRow.description}
                />  
            }
            {
                careerPosition?.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    careerPosition?.listPaginate && careerPosition?.listPaginate.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
            {/* PaginateBar */}
            <PaginateBar display={careerPosition?.listPaginate?.length} total={careerPosition?.totalDocs} pageTotal={careerPosition?.totalPages} currentPage={careerPosition?.page} func={setPage} />
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { career } = state;
    return { career };
}

const mapDispatchToProps = {
    get: CareerReduxAction.getListCareerPosition,
    deleteCareerPosition: CareerReduxAction.deleteCareerPosition
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CareerPositionTable));
