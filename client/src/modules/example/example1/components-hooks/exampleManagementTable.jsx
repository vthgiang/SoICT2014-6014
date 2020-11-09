import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";

import { ExampleCreateForm } from "./exampleCreateForm";
import { ExampleEditForm } from "./exampleEditForm";

import { exampleActions } from "../redux/actions";

function ExampleManagementTable(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: "",
        description: "",
        page: 0,
        limit: 5,
        currentRow: undefined
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
        setState({
            ...state,
            page: 0
        });
        props.getExamples({
            ...state,
            page: 0
        });
    }

    const setPage = (pageNumber) => {
        let currentPage = pageNumber - 1;
        setState({
            ...state,
            page: parseInt(currentPage)
        });

        props.getExamples({
            ...state,
            page: parseInt(currentPage)
        });
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: parseInt(number),
            page: 0
        });
        props.getExamples({
            ...state,
            limit: parseInt(number),
            page: 0
        });
    }

    const handleDelete = (id) => {
        props.deleteExample(id);
    }

    const handleEdit = (example) => {
        setState({
            ...state,
            currentRow: example
        });
        window.$('#modal-edit-example').modal('show');
    }

    let lists = [];
    if (example) {
        lists = example.lists
    }

    const totalPage = example && Math.ceil(example.totalList / limit);

    return (
        <React.Fragment>
            {
                currentRow &&
                <ExampleEditForm
                    exampleID={currentRow._id}
                    exampleName={currentRow.exampleName}
                    description={currentRow.description}
                />
            }
            <div className="box-body qlcv">
                <ExampleCreateForm />
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
                            <th>{translate('manage_example.index')}</th>
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
                                    <td>{index + 1 + page * limit}</td>
                                    <td>{example.exampleName}</td>
                                    <td>{example.description}</td>
                                    <td style={{ textAlign: "center" }}>
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
                <PaginateBar pageTotal={totalPage ? totalPage : 0} currentPage={page + 1} func={setPage} />
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