import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { DocumentActions } from '../../../redux/actions';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';
import CreateForm from './createForm';
import EditForm from './editForm';
import './archive.css';

class AdministrationDocumentArchives extends Component {
    constructor(props) {
        super(props);
        this.state = {
            archiveParent: [],
            deleteNode: [],
        }
    }

    componentDidMount() {
        this.props.getDocumentArchive();
    }
    onChanged = async (e, data) => {
        await this.setState({
            currentArchive: data.node,

        })
        window.$(`#edit-document-archive`).slideDown();
    }

    checkNode = (e, data) => {
        this.setState({
            archiveParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            archiveParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d],

        })
    }

    deleteArchive = () => {
        const { translate } = this.props;
        const { deleteNode, archiveParent } = this.state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            if (result.value && archiveParent.length > 1) {
                this.props.deleteDocumentArchive(archiveParent, "many");
                this.setState({
                    deleteNode: []
                });
            } else if (result.value && archiveParent.length === 1) {
                console.log('iiiiiiiiiiii', archiveParent)
                this.props.deleteDocumentArchive(archiveParent, 'single');
                this.setState({
                    deleteNode: []
                });
            }
        })
    }
    convertDataToExportData = (data) => {
        console.log(data);
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
        const { archiveParent, deleteNode } = this.state;
        const { translate } = this.props;
        const { documents } = this.props;
        const { list, tree } = this.props.documents.administration.archives;
        console.log('deleteNOde', deleteNode);
        console.log('alo', archiveParent);
        let dataExport = [];
        if (documents.isLoading === false) {
            dataExport = list;
        }
        let exportData = this.convertDataToExportData(dataExport);
        const dataTree = list.map(node => {
            return {
                ...node,
                text: node.name,
                state: { "open": true },
                parent: node.parent ? node.parent.toString() : "#"
            }
        })
        return (
            <React.Fragment>
                <button className="btn btn-success" onClick={() => {
                    window.$('#modal-create-document-archive').modal('show');
                }} title={`Thêm`} disable={archiveParent.length > 1 ? true : false}>{translate('general.add')}</button>
                {
                    archiveParent.length > 0 && <button class="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteArchive}>{translate('general.delete')}</button>
                }
                {<ExportExcel id="export-document-archive" exportData={exportData} style={{ marginRight: 5, marginTop: 2 }} />}
                <CreateForm domainParent={this.state.archiveParent[0]} />
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
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
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                        {
                            this.state.currentArchive &&
                            <EditForm
                                archiveId={this.state.currentArchive.id}
                                archiveName={this.state.currentArchive.text}
                                archiveDescription={this.state.currentArchive.original.description ? this.state.currentArchive.original.description : ""}
                                archiveParent={this.state.currentArchive.parent}
                                archivePath={this.state.currentArchive.original.path}
                                tree={tree}
                            />
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentArchive: DocumentActions.getDocumentArchive,
    editDocumentArchive: DocumentActions.editDocumentArchive,
    deleteDocumentArchive: DocumentActions.deleteDocumentArchive,
}

// export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationDocumentArchives));
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationDocumentArchives));