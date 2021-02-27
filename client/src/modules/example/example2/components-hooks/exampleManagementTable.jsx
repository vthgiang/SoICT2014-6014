import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { exampleActions } from "../redux/actions";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import ExampleCreateForm from "./exampleCreateForm";
import ExampleEditForm from "./exampleEditForm";
import ExampleDetailInfo from "./exampleDetailInfo";
import { useEffect } from "react";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

const ExampleManagementTable = (props) => {
    const getTableId = "table-manage-example2-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const [state, setState] = useState({
        exampleName: "",
        description: "",
        page: 1,
        perPage: getLimit,
        tableId: getTableId,
    })

    useEffect(() => {
        let { exampleName, perPage } = state;
        props.getOnlyExampleName({ exampleName, page, perPage });
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
            page: 1
        });
        props.getOnlyExampleName(state);
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getOnlyExampleName(state);
    }

    const setLimit = (number) => {
        setState({
            state,
            perPage: parseInt(number)
        });
        props.getOnlyExampleName(state);
    }

    const handleDelete = (id) => {
        props.deleteExample(id);
    }

    const handleEdit = (example) => {
        console.log("edit opened");

        setState({
            ...state,
            exampleEdit: example
        });
        window.$('#modal-edit-example').modal('show');
    }

    const handleShowDetailInfo = (id) => {

        setState({
            ...state,
            exampleId: id
        });

        window.$(`#modal-detail-info-example`).modal('show');
    }


    const { example, translate, deleteExample } = props;
    let lists = [];
    if (example.isLoading === false) {
        lists = example.lists
    }

    const totalPage = Math.ceil(example.totalList / state.perPage);
    const page = state.page;
    const { tableId } = state;
    return (
        <React.Fragment>
            {
                <ExampleEditForm
                    exampleEdit={state.exampleEdit}
                />
            }
            {
                <ExampleDetailInfo
                    exampleId={state.exampleId}
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
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={handleSubmitSearch}>{translate('manage_example.search')}</button>
                    </div>
                </div>
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                            <th>{translate('manage_example.exampleName')}</th>
                            <th>{translate('manage_example.description')}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_example.index'),
                                        translate('manage_example.exampleName'),
                                        translate('manage_example.description'),

                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(lists && lists.length !== 0) &&
                            lists.map((example, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * state.perPage}</td>
                                    <td>{example.exampleName}</td>
                                    <td>{example.description}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(example._id)}><i className="material-icons">visibility</i></a>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(example._id)}><i className="material-icons">edit</i></a>
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
                {example.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={totalPage ? totalPage : 0} currentPage={page} func={setPage} />
            </div>
        </React.Fragment>
    )

}


function mapStateToProps(state) {
    const example = state.example2;
    return { example }
}

const mapDispatchToProps = {
    getOnlyExampleName: exampleActions.getOnlyExampleName,
    deleteExample: exampleActions.deleteExample
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleManagementTable));