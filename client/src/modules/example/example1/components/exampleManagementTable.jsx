import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { exampleActions } from "../redux/actions";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";

import ExampleCreateForm from "./exampleCreateForm";
import ExampleEditForm from "./exampleEditForm";
import ExampleDetailInfo from "./exampleDetailInfo";
import ExampleImportForm from "./exampleImortForm";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

class ExampleManagementTable extends Component {
    constructor(props) {
        super(props);
        const tableId = "table-manage-example1-class";
        const defaultConfig = { limit: 5 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            exampleName: "",
            page: 1,
            limit: limit,
            tableId
        };
    }

    componentDidMount() {
        let { exampleName, page, limit } = this.state;
        this.props.getExamples({ exampleName, page, limit });
    }

    handleChangeExampleName = (e) => {
        const { value } = e.target;
        this.setState({
            exampleName: value
        });
    }

    handleSubmitSearch = () => {
        const { exampleName, limit } = this.state;

        this.setState(state => {
            return {
                ...state,
                page: 1
            }
        });
        this.props.getExamples({ exampleName, limit, page: 1 });
    }

    setPage = (pageNumber) => {
        const { exampleName, limit } = this.state;

        this.setState(state => {
            return {
                ...state,
                page: parseInt(pageNumber)
            }
        });

        this.props.getExamples({ exampleName, limit, page: parseInt(pageNumber) });
    }

    setLimit = (number) => {
        const { exampleName, page } = this.state;

        this.setState(state => {
            return {
                ...state,
                limit: parseInt(number)
            }
        });
        this.props.getExamples({ exampleName, limit: parseInt(number), page });
    }

    handleDelete = (id) => {
        const { example } = this.props;
        const { exampleName, limit, page } = this.state;

        this.props.deleteExample(id);
        this.props.getExamples({
            exampleName,
            limit,
            page: example && example.lists && example.lists.length === 1 ? page - 1 : page
        });
    }

    handleEdit = (example) => {
        this.setState((state) => {
            return {
                ...state,
                currentRow: example
            }
        });
        window.$('#modal-edit-example').modal('show');
    }

    handleShowDetailInfo = (id) => {
        this.setState((state) => {
            return {
                ...state,
                exampleId: id
            }
        });
        window.$(`#modal-detail-info-example`).modal('show');
    }

    render() {
        const { example, translate } = this.props;
        const { page, limit, currentRow, tableId } = this.state;

        let lists = [];
        if (example && example.isLoading === false) {
            lists = example.lists
        }

        const totalPage = Math.ceil(example.totalList / limit);
        return (
            <React.Fragment>
                <ExampleEditForm
                    exampleID={currentRow && currentRow._id}
                    exampleName={currentRow && currentRow.exampleName}
                    description={currentRow && currentRow.description}
                />
                <ExampleDetailInfo
                    exampleId={this.state.exampleId}
                />
                <ExampleCreateForm
                    page={page}
                    limit={limit}
                />
                <ExampleImportForm
                    page={page}
                    limit={limit}
                />

                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_example.add_title')} >{translate('manage_example.add')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-example').modal('show')} title={translate('human_resource.salary.add_multi_example')}>
                                    {translate('human_resource.salary.add_import')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-example').modal('show')} title={translate('manage_example.add_one_example')}>
                                    {translate('manage_example.add_example')}</a></li>
                            </ul>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_example.exampleName')}</label>
                            <input type="text" className="form-control" name="exampleName" onChange={this.handleChangeExampleName} placeholder={translate('manage_example.exampleName')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={this.handleSubmitSearch}>{translate('manage_example.search')}</button>
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
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map((example, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (page - 1) * limit}</td>
                                        <td>{example.exampleName}</td>
                                        <td>{example.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => this.handleShowDetailInfo(example._id)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => this.handleEdit(example)}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_example.delete')}
                                                data={{
                                                    id: example._id,
                                                    info: example.exampleName
                                                }}
                                                func={this.props.deleteExample}
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
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={lists && lists.length !== 0 && lists.length}
                        total={example && example.totalList}
                        func={this.setPage}
                    />
                </div>
            </React.Fragment>
        )
    }
}


function mapStateToProps(state) {
    const example = state.example1;
    return { example }
}

const mapDispatchToProps = {
    getExamples: exampleActions.getExamples,
    deleteExample: exampleActions.deleteExample
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleManagementTable));