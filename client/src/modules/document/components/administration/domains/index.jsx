import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { DocumentActions } from '../../../redux/actions';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import CreateForm from './createForm';
import EditForm from './editForm';
import { DomainImportForm } from './domainImportForm';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import './domains.css'
function AdministrationDocumentDomains(props) {
    const [state, setState] = useState({
        domainParent: [],
        deleteNode: [],
    })
    // useEffect(() => {
    //     props.getDepartment();
    // }, [])

    const onChanged = (e, data) => {
        setState({
            ...state,
            currentDomain: data.node
        });
        window.$(`#edit-document-domain`).slideDown();
    }

    const checkNode = (e, data) => { //chọn xóa một node và tất cả các node con của nó
        setState({
            ...state,
            domainParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    const unCheckNode = (e, data) => {
        setState({
            ...state,
            domainParent: [...data.selected],
            deleteNode: [...data.selected]
        })
    }

    const deleteDomains = () => {
        const { translate } = props;
        const { deleteNode } = state;
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('document.administration.domains.delete')}</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value && deleteNode.length > 0) {
                props.deleteDocumentDomain(deleteNode, "many");
                setState({
                    ...state,
                    deleteNode: []
                });
            }
        })
    }
    /**Mở modal import file excel */
    const handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file-domain').modal('show');
    }
    const handleAddDomain = (event) => {
        event.preventDefault();
        window.$('#modal-create-document-domain').modal('show');
    }
    const convertDataToExportData = (data) => {
        let department = props.department.list;
        data = data ? data.map((x, index) => {
            
            if (x.parent!=="#"){
                let parent=null
                let index = data.findIndex(value=>value.id===x.parent)
                if (index !== -1) parent = data[index].name
                
                return {
                    name: x.name,
                    description: x.description,
                    parent:parent
                }
            } else {
                return {
                    name: x.name,
                    description: x.description,
                }
            }
            
        }) : "";
        department = department ? department.map((x, index) => {
            return {
                STT: index + 1,
                name: x.name,
                description: x.description,
            }
        }) : "";
        let exportData = {
            fileName: "Bảng thống kê lĩnh vực",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    sheetTitle: "Danh sách lĩnh vực",
                    tables: [{
                        rowHeader: 1,
                        columns: [
                            { key: "name", value: "Tên lĩnh vực", width: 40, vertical: 'middle', horizontal: 'center' },
                            { key: "description", value: "Mô tả lĩnh vực", width: 60, vertical: 'middle', horizontal: 'center' },
                            { key: "parent", value: "Tên lĩnh vực cha", width: 40, vertical: 'middle', horizontal: 'center' },
                        ],
                        styleColumn: {
                            STT: {                                  // Khoá tương ứng của tiêu đề bảng (key)
                                vertical: 'middle',
                                horizontal: 'center'
                            },
                            name: {                                  // Khoá tương ứng của tiêu đề bảng (key)
                                vertical: 'middle',
                                //horizontal: 'center'
                            },
                            description: {                                  // Khoá tương ứng của tiêu đề bảng (key)
                                vertical: 'middle',
                                //  horizontal: 'center'
                            },
            
                        },
                        data:data
                    }]
            
                }
            ]
        }
        return exportData;
    }
    // tìm các node con cháu
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
    const { deleteNode, currentDomain } = state;
    const { translate } = props;
    const { list } = props.documents.administration.domains;
    const { documents } = props;
    const dataTree = list ? list.map(node => {
        return {
            ...node,
            text: node.name,
            state: { "opened": true },
            parent: node.parent ? node.parent.toString() : "#"
        }
    }) : null
    let dataExport = [];
    if (documents.isLoading === false) {
        dataExport = dataTree;
    }
    let exportData = convertDataToExportData(dataExport);
    let unChooseNode = currentDomain ? findChildrenNode(list, currentDomain) : [];

    return (
        <React.Fragment>
            <div className="form-inline">
                <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                    <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('document.administration.domains.add')}>{translate('general.add')}</button>
                    <ul className="dropdown-menu pull-right">
                        <li><a href="#form-create-document-domain" title="ImportForm" onClick={(event) => { handleAddDomain(event) }}>{translate('task_template.add')}</a></li>
                        <li><a href="#modal_import_file-domain" title="ImportForm" onClick={(event) => { handImportFile(event) }}>{translate('document.import')}</a></li>
                    </ul>
                </div>
            </div>
            {
                deleteNode.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={deleteDomains}>{translate('general.delete')}</button>
            }
            <ExportExcel id="export-document-domain" exportData={exportData} style={{ marginRight: 5 }} buttonName={translate('document.export')} />
            <CreateForm />
            <DomainImportForm />
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                    <div className="domain-tree" id="domain-tree">
                        <Tree
                            id="tree-qlcv-document"
                            onChanged={onChanged}
                            checkNode={checkNode}
                            unCheckNode={unCheckNode}
                            data={dataTree}
                        />
                    </div>
                    <SlimScroll outerComponentId="domain-tree" innerComponentId="tree-qlcv-document" innerComponentWidth={"100%"} activate={true} />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                    {
                        state.currentDomain &&
                        <EditForm
                            domainId={state.currentDomain.id}
                            domainName={state.currentDomain.text}
                            domainDescription={state.currentDomain.original.description ? state.currentDomain.original.description : ""}
                            domainParent={state.currentDomain.parent}
                            unChooseNode={unChooseNode}
                        />
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDocumentDomains: DocumentActions.getDocumentDomains,
    editDocumentDomain: DocumentActions.editDocumentDomain,
    deleteDocumentDomain: DocumentActions.deleteDocumentDomain,

    getDepartment: UserActions.getDepartmentOfUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationDocumentDomains));