import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { exampleActions } from "../redux/actions";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import ExampleCreateForm from "./exampleCreateForm";
import ExampleEditForm from "./exampleEditForm";
import ExampleDetailInfo from "./exampleDetailInfo";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

class ExampleManagementTable extends Component {
    constructor(props) {
        super(props);
        const tableId = "table-manage-example3-class";
        const defaultConfig = { limit: 5 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            exampleName: "",
            description: "",
            page: 1,
            perPage: limit,
            tableId
        };
    }

    componentDidMount() {
        let { exampleName, page, perPage } = this.state;
        this.props.getOnlyExampleName({ exampleName, page, perPage });
    }

    handleChangeExampleName = (e) => {
        const { value } = e.target;
        this.setState({
            exampleName: value
        });
    }

    handleSubmitSearch = async () => {
        await this.setState({
            page: 1
        });
        this.props.getOnlyExampleName(this.state);
    }

    setPage = async (pageNumber) => {
        await this.setState({
            page: parseInt(pageNumber)
        });

        this.props.getOnlyExampleName(this.state);
    }

    setLimit = async (number) => {
        await this.setState({
            perPage: parseInt(number)
        });
        this.props.getOnlyExampleName(this.state);
    }

    handleDelete = (id) => {
        const { example } = this.props;
        const { exampleName, perPage, page } = this.state;

        this.props.deleteExamples({
            exampleIds: [id]
        });
        this.props.getOnlyExampleName({
            exampleName,
            perPage,
            page: example?.lists?.length === 1 ? page - 1 : page
        });
    }

    handleEdit = async (example) => {
        await this.setState((state) => {
            return {
                ...state,
                exampleEditting: example?._id
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
        const { tableId, exampleId, perPage, page, exampleEditting } = this.state;
        let lists = [];
        if (example.isLoading === false) {
            lists = example.lists
        }

        const totalPage = Math.ceil(example.totalList / perPage);
        return (
            <React.Fragment>
                {
                    <ExampleEditForm
                        exampleId={exampleEditting}
                    />
                }
                {
                    <ExampleDetailInfo
                        exampleId={exampleId}
                    />
                }
                <div className="box-body qlcv">
                    <ExampleCreateForm 
                        page={page}
                        perPage={perPage}
                    />
                    <div className="form-inline">
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
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('manage_example.index'),
                                            translate('manage_example.exampleName')
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
                                        <td>{index + 1 + (page - 1) * this.state.perPage}</td>
                                        <td>{example.exampleName}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => this.handleShowDetailInfo(example._id)}><i className="material-icons">visibility</i></a>
                                            < a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => this.handleEdit(example)}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_example.delete')}
                                                data={{
                                                    id: example._id,
                                                    info: example.exampleName
                                                }}
                                                func={this.handleDelete}
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
                    <PaginateBar pageTotal={totalPage ? totalPage : 0} currentPage={page} func={this.setPage} />
                </div>
            </React.Fragment>
        )
    }
}


function mapStateToProps(state) {
    const example = state.example3;
    return { example }
}

const mapDispatchToProps = {
    getOnlyExampleName: exampleActions.getOnlyExampleName,
    deleteExamples: exampleActions.deleteExamples
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleManagementTable));