import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { exampleActions } from "../redux/actions";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import ExampleCreateForm from "./exampleCreateForm";
import ExampleEditForm from "./exampleEditForm";
import ExampleDetailInfo from "./exampleDetailInfo";
import { useEffect } from "react";

const ExampleManagementTable = (props) => {

    const [state, setState] = useState({
        exampleName: "",
        description: "",
        page: 0,
        limit: 5
    })

    useEffect(() => {
        let { exampleName, limit } = state;
        props.getOnlyExampleName({ exampleName, page, limit });
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
        props.getOnlyExampleName(state);
    }

    const setPage = (pageNumber) => {
        let currentPage = pageNumber - 1;
        setState({
            ...state,
            page: parseInt(currentPage)
        });

        props.getOnlyExampleName(state);
    }

    const setLimit = (number) => {
        setState({
            state,
            limit: parseInt(number)
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

    const totalPage = Math.ceil(example.totalList / state.limit);
    const page = state.page;

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
                                    limit={state.limit}
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
                                    <td>{index + 1 + page * state.limit}</td>
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
                <PaginateBar pageTotal={totalPage ? totalPage : 0} currentPage={page + 1} func={setPage} />
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