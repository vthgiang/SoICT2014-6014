import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SearchBar, DeleteNotification, PaginateBar, DataTableSetting, ToolTip } from '../../../../common-components';

import { BiddingPackageReduxAction } from '../redux/actions';
import EditForm from './editForm';
import CreateForm from './createForm';

import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import Swal from 'sweetalert2';
function BiddingPackageTable(props) { 

    const tableId_constructor = "table-manage-career-position";
    const defaultConfig = { name: '', page: 1, limit: 100 }
    const limit = getTableConfiguration(tableId_constructor, defaultConfig).limit;

    const [state, setState] = useState({
        tableId: tableId_constructor,
        limit: limit,
        page: 1,
        name: '', // Mặc định tìm kiếm theo tên
        page: ''
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

    useEffect(() => {
        props.get({ name: '', page: 1, limit: 1000 });
        // props.get({ name: state.name, page: state.page, limit: state.limit });
    }, [])

    const { career, translate } = props;
    let careerPosition = career;
    const { currentRow, tableId } = state;
    console.log("currentRow", currentRow)

    return (
        <React.Fragment>

            {/* Button kiểm tra tất cả vị trí công việc hợp lệ không*/}
            <div style={{ display: 'flex', marginBottom: 6, float: 'right' }}>
                <a className="btn btn-success pull-right" href="#modal-create-career-position" title="Add careerPosition" onClick={handleAddCareerPosition}>Thêm</a>
            </div>

            {/* Button thêm vị trí công việc mới */}
            {
                <CreateForm />
            }

            {/* Thanh tìm kiếm */}
            {/* <div className="form-inline">
                Mã tài sản
                <div className="form-group">
                    <label className="form-control-static">Chuyên ngành</label>
                    <input type="text" className="form-control" name="name" onChange={setName} placeholder={"Nhập tên vị trí công việc"} autoComplete="off" />
                </div>
                <div className="form-group">  
                    <label></label>
                    <button type="button" className="btn btn-success" title={translate('asset.general_information.search')} onClick={searchWithOption}>{translate('asset.general_information.search')}</button>
                </div>
            </div> */}

            {/* Kết quả kiểm tra trùng lặp */}
            {/* {careerPositionDuplicate && careerPositionDuplicate.length !== 0 && (
                <React.Fragment>
                    <br />
                    <p style={{ fontWeight: "bold", color: "orangered" }}>Các vị trí công việc sau bị trùng: {careerPositionDuplicate.join(', ')}</p>

                </React.Fragment>
            )}
            {careerPositionDuplicate && careerPositionDuplicate.length == 0 && (
                <React.Fragment>
                    <br />
                    <p style={{ fontWeight: "bold", color: "green" }}>Tất cả vị trí công việc đều hợp lệ</p>

                </React.Fragment>
            )} */}


            {/* Bảng dữ liệu vị trí công việc */}
            <table className="table table-hover table-striped table-bordered" id={tableId}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Code</th>
                        <th>Các tên khác tương đương</th>
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
                                <td> {careerPosition.otherNames} </td>
                                <td> {careerPosition.description} </td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="edit" href={`#${careerPosition._id}`} onClick={() => handleEdit(careerPosition)}><i className="material-icons">edit</i></a>
                                    <a className="delete" href={`#${careerPosition._id}`} onClick={() => handleDelete(careerPosition)}><i className="material-icons">delete</i></a>
                                    {/* {
                                        <DeleteNotification
                                            content={translate('human_resource.careerPosition.delete')}
                                            data={{ id: careerPosition._id, info: careerPosition.name }}
                                            func={props.destroy}
                                        />
                                    } */}
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
                    careerPositionOtherName={currentRow.otherNames}
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
    get: BiddingPackageReduxAction.getListBiddingPackage,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BiddingPackageTable));
