import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';
import './archive.css';
import BinEditForm from './binEditForm';
import BinCreateForm from './binCreateForm';

class BinManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            binParent: [],
            deleteNode: [],
        }
    }

    onChanged = async (e, data) => {
        await this.setState({
            currentBin: data.node,

        })
        window.$(`#edit-bin-location`).slideDown();
    }

    checkNode = (e, data) => {
        this.setState({
            binParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            binParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d],

        })
    }
    handleAddArchive = (event) => {
        event.preventDefault();
        window.$('#modal-create-bin-location').modal('show');
    }
    /**Mở modal import file excel */
    handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file_archive').modal('show');
    }
    deleteArchive = () => {
        const { translate } = this.props;
        const { deleteNode, binParent } = this.state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            if (result.value && binParent.length > 1) {
                this.props.deleteDocumentArchive(binParent, "many");
                this.setState({
                    deleteNode: []
                });
            } else if (result.value && binParent.length === 1) {
                this.props.deleteDocumentArchive(binParent, 'single');
                this.setState({
                    deleteNode: []
                });
            }
        })
    }
    convertDataToExportData = (data) => {
        data = data.map((x, index) => {
            return {
                STT: index + 1,
                name: x.name,
                description: x.description,
                path: x.path,
            }
        })
        let exportData = {
            fileName: "Bảng thống kê lưu trữ",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Bảng thống kê lưu trữ",
                            rowHeader: 1,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "name", value: "Tên danh mục" },
                                { key: "description", value: "Mô tả danh mục" },
                                { key: "path", value: "Đường dẫn danh mục" },
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }
        return exportData;
    }
    render() {
        const { translate } = this.props;
        const { binParent, deleteNode } = this.state;
        const dataTree = [
            {
                id: "1",
                code: "B1",
                name: "Nhà B1",
                description: "Nơi lưu trữ kho số 1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                enableGoods: [
                    {
                        good: "Jucca Nước",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                    {
                        good: "Jucca",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                ],
                text: "Nhà B1",
                state: { "open": true },
                parent: "#",
                child: "3"
            },
            {
                id: "2",
                code: "D5",
                name: "Nhà D5",
                description: "Nơi lưu trữ kho số 2",
                stock: "Trần Đại Nghĩa",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                enableGoods: [
                    {
                        good: "Jucca Nước",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                    {
                        good: "Jucca",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                ],
                text: "Nhà D5",
                state: { "open": true },
                parent: "#",
                child: "5"
            },
            {
                id: "3",
                code: "T1",
                name: "Tầng 1",
                description: "Nơi lưu trữ kho số B1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                enableGoods: [
                    {
                        good: "Jucca Nước",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                    {
                        good: "Jucca",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                ],
                text: "Tầng 1",
                state: { "open": true },
                parent: "1",
                child: "4"
            },
            {
                id: "4",
                code: "P101",
                name: "Phòng 101",
                description: "Nơi lưu trữ kho số 1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                enableGoods: [
                    {
                        good: "Jucca Nước",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                    {
                        good: "Jucca",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                ],
                text: "Phòng 101",
                state: { "open": true },
                parent: "3",
                child: "#"
            },
            {
                id: "5",
                code: "T2",
                name: "Tầng 2",
                description: "Nơi lưu trữ kho số 1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                enableGoods: [
                    {
                        good: "Jucca Nước",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                    {
                        good: "Jucca",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                ],
                text: "Tầng 2",
                state: { "open": true },
                parent: "2",
                child: "#"
            },
            {
                id: "6",
                code: "C1",
                name: "Nhà C1",
                description: "Nơi lưu trữ kho số 1",
                stock: "Tạ Quang Bửu",
                status: "Đang trống",
                users: ["Nguyễn Văn Thắng"],
                enableGoods: [
                    {
                        good: "Jucca Nước",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                    {
                        good: "Jucca",
                        type: "Nguyên Vật liệu",
                        capacity: "50 thùng",
                        contained: "10 thùng"
                    },
                ],
                text: "Nhà C1",
                state: { "open": true },
                parent: "#",
                child: "#"
            }
        ]
        return (
            <React.Fragment>
                <BinCreateForm />
                <div className="form-inline">
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('document.administration.domains.add')}
                           disabled={binParent.length > 1 ? true : false}>{translate('general.add')}</button>
                        <ul className="dropdown-menu pull-right">
                            <li><a href="#modal-create-document-archive" title="Add archive" onClick={(event) => { this.handleAddArchive(event) }}>{translate('task_template.add')}</a></li>
                            <li><a href="#modal_import_file_archive" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>ImportFile</a></li>
                        </ul>
                    </div>
                </div>

                {
                    binParent.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteArchive}>{translate('general.delete')}</button>
                }
                <div className="row"
                >
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="archive-tree" id="archive-tree">
                            <Tree
                                id="tree-qlcv-document-archive"
                                onChanged={this.onChanged}
                                checkNode={this.checkNode}
                                unCheckNode={this.unCheckNode}
                                data={dataTree}
                            />
                        </div>
                        <SlimScroll outerComponentId="archive-tree" innerComponentId="tree-qlcv-document-archive" innerComponentWidth={"100%"} activate={true} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        { this.state.currentBin && <BinEditForm />}

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

// export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationDocumentArchives));
export default connect(null, null)(withTranslate(BinManagementTable));