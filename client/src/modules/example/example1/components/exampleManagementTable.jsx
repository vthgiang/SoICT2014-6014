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
            perPage: limit,
            tableId
        };
    }

    componentDidMount() {
        let { exampleName, page, perPage } = this.state;
        this.props.getExamples({ exampleName, page, perPage });
    }

    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    handleChangeExampleName = (e) => {
        const { value } = e.target;
        this.setState({
            exampleName: value
        });
    }


    /**
     * Hàm xử lý khi click nút tìm kiếm
     */
    handleSubmitSearch = () => {
        const { exampleName, perPage } = this.state;

        this.setState(state => {
            return {
                ...state,
                page: 1
            }
        });
        this.props.getExamples({ exampleName, perPage, page: 1 });
    }


    /**
     * Hàm xử lý khi click chuyển trang
     * @param {*} pageNumber Số trang định chuyển
     */
    setPage = (pageNumber) => {
        const { exampleName, perPage } = this.state;

        this.setState(state => {
            return {
                ...state,
                page: parseInt(pageNumber)
            }
        });

        this.props.getExamples({ exampleName, perPage, page: parseInt(pageNumber) });
    }


    /**
     * Hàm xử lý thiết lập giới hạn hiển thị số bản ghi 
     * @param {*} number số bản ghi sẽ hiển thị
     */
    setLimit = (number) => {
        const { exampleName, page } = this.state;

        this.setState(state => {
            return {
                ...state,
                perPage: parseInt(number)
            }
        });
        this.props.getExamples({ exampleName, perPage: parseInt(number), page });
    }


    /**
     * Hàm xử lý khi click xóa 1 ví dụ
     * @param {*} id của ví dụ cần xóa
     */
    handleDelete = (id) => {
        const { example } = this.props;
        const { exampleName, perPage, page } = this.state;

        this.props.deleteExample(id);
        console.log("55555")
        this.props.getExamples({
            exampleName,
            perPage,
            page: example?.lists?.length === 1 ? page - 1 : page
        });
    }


    /**
     * Hàm xử lý khi click edit một ví vụ
     * @param {*} example thông tin của ví dụ cần chỉnh sửa
     */
    handleEdit = (example) => {
        this.setState({
            currentRow: example
        }, () => window.$('#modal-edit-example').modal('show'));
    }


    /**
     * Hàm xử lý khi click xem chi tiết một ví dụ
     * @param {*} example thông tin của ví dụ cần xem
     */
    handleShowDetailInfo = (example) => {
        this.setState({
            currentRowDetail: example
        }, () => window.$(`#modal-detail-info-example`).modal('show'))
    }

    render() {
        const { example, translate } = this.props;
        const { page, perPage, currentRow, tableId, currentRowDetail } = this.state;
        let lists = [];

        if (example && example.isLoading === false) {
            lists = example.lists
        }

        const totalPage = Math.ceil(example.totalList / perPage);
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

                {currentRowDetail &&
                    <ExampleDetailInfo
                        exampleID={currentRowDetail._id}
                        exampleName={currentRowDetail.exampleName}
                        description={currentRowDetail.description}
                    />
                }

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
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            {/* button thêm mới */}
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_example.add_title')} >{translate('manage_example.add')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-example').modal('show')} title={translate('human_resource.salary.add_multi_example')}>
                                    {translate('human_resource.salary.add_import')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-example').modal('show')} title={translate('manage_example.add_one_example')}>
                                    {translate('manage_example.add_example')}</a></li>
                            </ul>
                        </div>

                        {/* Tên ví dụ cần tìm kiếm*/}
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_example.exampleName')}</label>
                            <input type="text" className="form-control" name="exampleName" onChange={this.handleChangeExampleName} placeholder={translate('manage_example.exampleName')} autoComplete="off" />
                        </div>

                        {/* Nút tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={this.handleSubmitSearch}>{translate('manage_example.search')}</button>
                        </div>
                    </div>

                    {/* Bảng hiển thị danh sách ví dụ */}
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
                                        <td>{index + 1 + (page - 1) * perPage}</td>
                                        <td>{example.exampleName}</td>
                                        <td>{example.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => this.handleShowDetailInfo(example)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => this.handleEdit(example)}><i className="material-icons">edit</i></a>
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