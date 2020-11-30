import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";

import { ExampleCreateForm } from "./exampleCreateForm";
import { ExampleEditForm } from "./exampleEditForm";
import { ExampleDetailInfo } from "./exampleDetailInfo";

import { exampleActions } from "../redux/actions";

function ExampleManagementTable(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: "",
        page: 1,
        limit: 5,
    })

    const { example, translate } = props;
    const { exampleName, page, limit, currentRow } = state;

    useEffect(() => {
        props.getExamples({ exampleName, page, limit });
    }, [])

    const handleChangeExampleName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            exampleName: value
        });
    }

    const handleSubmitSearch = () => {
        props.getExamples({
            exampleName,
            limit,
            page: 1
        });
        setState({
            ...state,
            page: 1
        });
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getExamples({
            exampleName,
            limit,
            page: parseInt(pageNumber)
        });
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: parseInt(number),
            page: 1
        });
        props.getExamples({
            exampleName,
            limit: parseInt(number),
            page: 1
        });
    }

    const handleDelete = (id) => {
        props.deleteExample(id);
        props.getExamples({
            exampleName,
            limit,
            page: example && example.lists && example.lists.length === 1 ? page - 1 : page
        });
    }

    const handleEdit = (example) => {
        setState({
            ...state,
            currentRow: example
        });
        console.log(111)
        window.$('#modal-edit-example-hooks').modal('show');
    }

    const handleShowDetailInfo = (id) => {
        setState({
            ...state,
            exampleId: id
        });

        window.$(`#modal-detail-info-example-hooks`).modal('show');
    }

    let lists = [];
    if (example) {
        lists = example.lists
    }

    const totalPage = example && Math.ceil(example.totalList / limit);

    return (
        <React.Fragment>
            <ExampleEditForm
                exampleID={currentRow && currentRow._id}
                exampleName={currentRow && currentRow.exampleName}
                description={currentRow && currentRow.description}
            />
            <ExampleDetailInfo
                exampleId={state.exampleId}
            />
            
            <div className="box-body qlcv">
                <ExampleCreateForm
                    page={page}
                    limit={limit}
                />
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_example.exampleName')}</label>
                        <input type="text" className="form-control" name="exampleName" onChange={handleChangeExampleName} placeholder={translate('manage_example.exampleName')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch()}>{translate('manage_example.search')}</button>
                    </div>
                </div>
                <table id="example-table" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                            <th>{translate('manage_example.exampleName')}</th>
                            <th>{translate('manage_example.description')}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId="example-table"
                                    columnArr={[
                                        translate('manage_example.index'),
                                        translate('manage_example.exampleName'),
                                        translate('manage_example.description'),
                                    ]}
                                    limit={limit}
                                    hideColumnOption={true}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(lists && lists.length !== 0) &&
                            lists.map((example, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page-1) * limit}</td>
                                    <td>{example.exampleName}</td>
                                    <td>{example.description}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(example._id)}><i className="material-icons">visibility</i></a>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(example)}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('manage_example.delete')}
                                            data={{
                                                id: example._id,
                                                info: example.exampleName
                                            }}
                                            func={handleDelete}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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
    deleteExample: exampleActions.deleteExample
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ExampleManagementTable));
export { connectedExampleManagementTable as ExampleManagementTable };