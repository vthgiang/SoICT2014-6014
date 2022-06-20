import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DeleteNotification, PaginateBar, SmartTable } from "../../../../common-components";

import { PageCreateForm } from "./pageCreateForm";

import { SystemPageActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function TableSystemAdminPage(props) {
    const getTableId = "table-manage-example1-hooks";
    const defaultConfig = { limit: 20 }
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
        props.getSystemAdminPage({ exampleName, page, perPage });
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
        props.getSystemAdminPage({
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

        props.getSystemAdminPage({
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
        props.getSystemAdminPage({
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
        props.deleteSystemAdminPage({
            exampleIds: [id]
        });
        props.getSystemAdminPage({
            exampleName,
            perPage,
            page: example && example.lists && example.lists.length === 1 ? page - 1 : page
        });
    }

    const onSelectedRowsChange = (value) => {
        setSelectedData(value)
    }

    const handleDeleteOptions = () => {
        props.deleteSystemAdminPage({
            exampleIds: selectedData,
        });
        setSelectedData(null)
        props.getSystemAdminPage({
            exampleName,
            perPage,
            page: example && example.lists && example.lists.length === 1 ? page - 1 : page
        });
    }

    let lists = [];
    if (example) {
        lists = example.lists
    }

    const totalPage = example && Math.ceil(example.totalList / perPage);

    console.log("props----", example);

    return (
        <React.Fragment>
            <PageCreateForm
                page={page}
                perPage={perPage}
            />


            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Button thêm mới */}
                    <div className="pull-right" style={{ marginTop: "5px" }}>
                        <button 
                            type="button" className="btn btn-success pull-right" 
                            data-toggle="dropdown" aria-expanded="true" 
                            title={translate('system_admin.system_page.add_title')} 
                            onClick={() => window.$('#modal-create-example-hooks').modal('show')} >
                            {translate('system_admin.system_page.add')}
                        </button>
                    </div>
                    {selectedData?.length > 0 && <button type="button" className="btn btn-danger pull-right" title={translate('general.delete_option')} onClick={() => handleDeleteOptions()}>{translate("general.delete_option")}</button>}

                    {/* Tìm kiếm */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('system_admin.system_page.URL')}</label>
                        <input type="text" className="form-control" name="exampleName" onChange={handleChangeExampleName} placeholder={translate('system_admin.system_page.URL')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('system_admin.system_page.search')} onClick={() => handleSubmitSearch()}>{translate('system_admin.system_page.search')}</button>
                    </div>
                </div>

                <SmartTable
                    tableId={tableId}
                    columnData={{
                        index: translate('system_admin.system_page.index'),
                        exampleName: translate('system_admin.system_page.URL'),
                        description: translate('system_admin.system_page.description')
                    }}
                    tableHeaderData={{
                        index: <th className="col-fixed" style={{ width: 60 }}>{translate('system_admin.system_page.index')}</th>,
                        exampleName: <th>{translate('system_admin.system_page.URL')}</th>,
                        description: <th>{translate('system_admin.system_page.description')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={lists?.length > 0 && lists.map((item, index) => {
                        return {
                            id: item?._id,
                            index: <td>{index + 1}</td>,
                            exampleName: <td>{item?.url}</td>,
                            description: <td>{item?.description}</td>,
                            action: <td style={{ textAlign: "center" }}>
                                <DeleteNotification
                                    content={translate('system_admin.system_page.delete')}
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
    const example = state.systemAdminPage;
    return { example }
}

const actions = {
    getSystemAdminPage: SystemPageActions.getSystemAdminPage,
    deleteSystemAdminPage: SystemPageActions.deleteSystemAdminPage,
}

const connectedTableSystemAdminPage = connect(mapState, actions)(withTranslate(TableSystemAdminPage));
export { connectedTableSystemAdminPage as TableSystemAdminPage };