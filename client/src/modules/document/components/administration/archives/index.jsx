import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { DocumentActions } from '../../../redux/actions';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';
import CreateForm from './createForm';
import EditForm from './editForm';
import { ArchiveImportForm } from './archiveImportForm'
import './archive.css';

function AdministrationDocumentArchives(props) {

    const [state, setState] = useState({
        archiveParent: [],
        deleteNode: [],
    })

    const onChanged = async (e, data) => {
        await setState({
            ...state,
            currentArchive: data.node,
        })
        window.$(`#edit-document-archive`).slideDown();
    }

    const checkNode = (e, data) => {
        setState({
            ...state,
            archiveParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    const unCheckNode = (e, data) => {
        setState({
            ...state,
            archiveParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d],

        })
    }
    const handleAddArchive = (event) => {
        event.preventDefault();
        window.$('#modal-create-document-archive').modal('show');
    }
    /**Mở modal import file excel */
    const handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file_archive').modal('show');
    }
    const deleteArchive = () => {
        const { translate } = props;
        const { deleteNode, archiveParent } = state;
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
                props.deleteDocumentArchive(archiveParent, "many");
                setState({
                    ...state,
                    deleteNode: []
                });
            } else if (result.value && archiveParent.length === 1) {
                props.deleteDocumentArchive(archiveParent, 'single');
                setState({
                    ...state,
                    deleteNode: []
                });
            }
        })
    }
    const convertDataToExportData = (data) => {
        data = data.map((x, index) => {
            return {
                name: x.name,
                description: x.description,
                pathParent: x.path,
            }
        })
        let exportData = {
            fileName: "Mẫu import vị trí lưu trữ",
            dataSheets: [{
                sheetName: "Sheet1",
                sheetTitle: "Danh sách vị trí lưu trữ",
                tables: [{
                    rowHeader: 1,
                    columns: [
                        { key: "name", value: "Tên vị trí lưu trữ" },
                        { key: "description", value: "Mô tả vị trí lưu trữ" },
                        { key: "pathParent", value: "Đường dẫn vị trí lưu trữ" },
                    ],
                    data: data
                }]

            }]
        }
        return exportData;
    }
    const findChildrenNode = (list, node) => {
        let array = [];
        let queue_children = [];
        queue_children = [node];
        while (queue_children.length > 0) {
            let tmp = queue_children.shift();
            array = [...array, tmp._id];
            let children = list.filter(child => child.parent === tmp.id);
            queue_children = queue_children.concat(children);
        }
        array.shift();
        array.unshift(node.id);
        return array;
    }

    const { archiveParent, currentArchive } = state;
    const { translate } = props;
    const { documents } = props;
    const { list } = props.documents.administration.archives;
    let dataExport = [];
    if (documents.isLoading === false) {
        dataExport = list;
    }
    let exportData = convertDataToExportData(dataExport);
    const dataTree = list.map(node => {
        return {
            ...node,
            text: node.name,
            state: { "open": true },
            parent: node.parent ? node.parent.toString() : "#"
        }
    })
    let unChooseNode = currentArchive ? findChildrenNode(list, currentArchive) : [];
    return (
        <React.Fragment>

            <div className="form-inline">
                <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                    <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('document.administration.domains.add')}>{translate('general.add')}</button>
                    <ul className="dropdown-menu pull-right">
                        <li><a href="#modal-create-document-archive" title="Add archive" onClick={(event) => { handleAddArchive(event) }}>{translate('document.add')}</a></li>
                        <li><a href="#modal_import_file_archive" title="ImportForm" onClick={(event) => { handImportFile(event) }}>{translate('document.import')}</a></li>
                    </ul>
                </div>
            </div>

            {
                archiveParent.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={deleteArchive}>{translate('general.delete')}</button>
            }
            <ExportExcel id="export-document-archive" exportData={exportData} style={{ marginRight: 5 }} buttonName={translate('document.export')} />
            <CreateForm />
            <ArchiveImportForm />
            <div className="row"
            >
                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                    <div className="archive-tree" id="archive-tree">
                        <Tree
                            id="tree-qlcv-document-archive"
                            onChanged={onChanged}
                            checkNode={checkNode}
                            unCheckNode={unCheckNode}
                            data={dataTree}
                        />
                    </div>
                    <SlimScroll outerComponentId="archive-tree" innerComponentId="tree-qlcv-document-archive" innerComponentWidth={"100%"} activate={true} />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                    {
                        state.currentArchive &&
                        <EditForm
                            archiveId={state.currentArchive.id}
                            archiveName={state.currentArchive.text}
                            archiveDescription={state.currentArchive.original.description ? state.currentArchive.original.description : ""}
                            archiveParent={state.currentArchive.parent}
                            archivePath={state.currentArchive.original.path}
                            unChooseNode={unChooseNode}
                        />
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentArchive: DocumentActions.getDocumentArchive,
    editDocumentArchive: DocumentActions.editDocumentArchive,
    deleteDocumentArchive: DocumentActions.deleteDocumentArchive,
}

// export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationDocumentArchives));
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationDocumentArchives));