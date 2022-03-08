import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DeleteNotification, PaginateBar, SmartTable } from "../../../../common-components";

import { ExampleCreateForm } from "./exampleCreateForm";
import { ExampleEditForm } from "./exampleEditForm";
import { ExampleDetailInfo } from "./exampleDetailInfo";
import { ExampleImportForm } from "./exampleImortForm";

import { exampleActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function ExampleManagementTable(props) {
    const getTableId = "table-manage-example1-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: "",
        page: 1,
        perPage: getLimit,
        tableId: getTableId,
    })
    const [selectedData, setSelectedData] = useState()

    const { example, translate } = props;
    const { exampleName, page, perPage, currentRow, curentRowDetail, tableId } = state;

    useEffect(() => {
        props.getExamples({ exampleName, page, perPage });
    }, [])

    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handleChangeExampleName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            exampleName: value
        });
    }


    /**
     * Hàm xử lý khi click nút tìm kiếm
     */
    const handleSubmitSearch = () => {
        props.getExamples({
            exampleName,
            perPage,
            page: 1
        });
        setState({
            ...state,
            page: 1
        });
    }


    /**
     * Hàm xử lý khi click chuyển trang
     * @param {*} pageNumber Số trang định chuyển
     */
    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getExamples({
            exampleName,
            perPage,
            page: parseInt(pageNumber)
        });
    }


    /**
     * Hàm xử lý thiết lập giới hạn hiển thị số bản ghi
     * @param {*} number số bản ghi sẽ hiển thị
     */
    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1
        });
        props.getExamples({
            exampleName,
            perPage: parseInt(number),
            page: 1
        });
    }


    /**
     * Hàm xử lý khi click xóa 1 ví dụ
     * @param {*} id của ví dụ cần xóa
     */
    const handleDelete = (id) => {
        props.deleteExamples({
            exampleIds: [id]
        });
        props.getExamples({
            exampleName,
            perPage,
            page: example && example.lists && example.lists.length === 1 ? page - 1 : page
        });
    }

    const onSelectedRowsChange = (value) => {
        setSelectedData(value)
    }

    const handleDeleteOptions = () => {
        props.deleteExamples({
            exampleIds: selectedData
        });
    }

    /**
     * Hàm xử lý khi click edit một ví vụ
     * @param {*} example thông tin của ví dụ cần chỉnh sửa
     */
    const handleEdit = (example) => {
        setState({
            ...state,
            currentRow: example
        });
        window.$('#modal-edit-example-hooks').modal('show');
    }

    /**
     * Hàm xử lý khi click xem chi tiết một ví dụ
     * @param {*} example thông tin của ví dụ cần xem
     */
    const handleShowDetailInfo = (example) => {
        setState({
            ...state,
            curentRowDetail: example,
        });
        window.$(`#modal-detail-info-example-hooks`).modal('show')
    }

    let lists = [];
    if (example) {
        lists = example.lists
    }

    const totalPage = example && Math.ceil(example.totalList / perPage);

    return (
        <React.Fragment>
            <ExampleEditForm
                exampleID={currentRow && currentRow._id}
                exampleName={currentRow && currentRow.exampleName}
                description={currentRow && currentRow.description}
            />

            <ExampleDetailInfo
                exampleID={curentRowDetail && curentRowDetail._id}
                exampleName={curentRowDetail && curentRowDetail.exampleName}
                description={curentRowDetail && curentRowDetail.description}
            />

            <ExampleCreateForm
                page={page}
                perPage={perPage}
            />

            <ExampleImportForm
                page={page}
                perPage={perPage}
            />

            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Button thêm mới */}
                    <div className="dropdown pull-right" style={{ marginTop: "5px" }}>
                        <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_example.add_title')} >{translate('manage_example.add')}</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-example-hooks').modal('show')} title={translate('manage_example.add_multi_example')}>
                                {translate('human_resource.salary.add_import')}</a></li>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-example-hooks').modal('show')} title={translate('manage_example.add_one_example')}>
                                {translate('manage_example.add_example')}</a></li>
                        </ul>
                    </div>
                    {selectedData?.length > 0 && <button type="button" className="btn btn-danger pull-right" title={translate('general.delete_option')} onClick={() => handleDeleteOptions()}>{translate("general.delete_option")}</button>}

                    {/* Tìm kiếm */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_example.exampleName')}</label>
                        <input type="text" className="form-control" name="exampleName" onChange={handleChangeExampleName} placeholder={translate('manage_example.exampleName')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch()}>{translate('manage_example.search')}</button>
                    </div>
                </div>

                <SmartTable
                    tableId={tableId}
                    columnData={{
                        index: translate('manage_example.index'),
                        exampleName: translate('manage_example.exampleName'),
                        description: translate('manage_example.description')
                    }}
                    tableHeaderData={{
                        index: <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>,
                        exampleName: <th>{translate('manage_example.exampleName')}</th>,
                        description: <th>{translate('manage_example.description')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={lists?.length > 0 && lists.map((item, index) => {
                        return {
                            id: item?._id,
                            index: <td>{index + 1}</td>,
                            exampleName: <td>{item?.exampleName}</td>,
                            description: <td>{item?.description}</td>,
                            action: <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(item)}><i className="material-icons">visibility</i></a>
                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('manage_example.delete')}
                                    data={{
                                        id: item._id,
                                        info: item.exampleName
                                    }}
                                    func={handleDelete}
                                />
                            </td>
                        }
                    })}
                    dataDependency={lists}
                    onSetNumberOfRowsPerpage={setLimit}
                    onSelectedRowsChange={onSelectedRowsChange}
                />

                {/* PaginateBar */}
                {example && example.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    display={lists && lists.length !== 0 && lists.length}
                    total={example && example.totalList}
                    func={setPage}
                />
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const example = state.example1;
    return { example }
}

const actions = {
    getExamples: exampleActions.getExamples,
    deleteExamples: exampleActions.deleteExamples
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ExampleManagementTable));
export { connectedExampleManagementTable as ExampleManagementTable };