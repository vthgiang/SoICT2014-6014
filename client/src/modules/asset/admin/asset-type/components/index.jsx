import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import './domains.css'

import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';

import { AssetTypeActions } from '../redux/actions';

import CreateAssetTypeModal from './createAssetTypeModal';
import EditForm from './editForm';
import { ImportAssetTypeModal } from './importAssetTypeModal'

class AdministrationAssetTypes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domainParent: [],
            deleteNode: []
        }
    }

    componentDidMount() {
        this.props.getAssetTypes();
    }

    onChanged = async (e, data) => {
        console.log("##1##", data.node);
        await this.setState({ currentDomain: data.node })

        window.$(`#edit-asset-type`).slideDown();
    }

    checkNode = (e, data) => { // Chọn xóa một node và tất cả các node con của nó
        this.setState({
            domainParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            domainParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    deleteDomains = () => {
        const { translate } = this.props;
        const { deleteNode } = this.state;
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
                this.props.deleteAssetTypes(deleteNode, "many");
                this.setState({
                    deleteNode: []
                });
            }
        })
    }

    formatAssetTypeInformations = (informations) => {
        let list = !informations ? '' : informations.reduce((value, cur) => {
            if (!value) {
                if (!cur) return value;
                else return cur.nameField ? value + cur.nameField : value;
            }
            else return value + ', ' + cur.nameField
        }, '');
        return list;
    }

    getAssetTypeParentName = (parentId, data) => {
        let name;
        for (let i = 0; i < data.length; i++) {
            if (String(parentId) === String(data[i].id)) {
                name = data[i].typeName;
                break;
            }
        }
        return name;
    }

    convertDataToExportData = (dataTree) => {
        let data = dataTree.map((item, index) => {
            let information = "";
            item.defaultInformation.map(info => {
                information = information + info.nameField + '\n';
            })

            return {
                STT: index + 1,
                code: item.typeNumber,
                name: item.typeName,
                description: item.description,
                information: this.formatAssetTypeInformations(item.defaultInformation),
                parent: this.getAssetTypeParentName(item.parent, dataTree)
            }
        })
        let exportData = {
            fileName: "Danh sách loại tài sản",
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    tables: [
                        {
                            tableName: "Danh sách loại tài sản",
                            rowHeader: 2,
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "code", value: "Mã loại tài sản" },
                                { key: "name", value: "Tên loại tài sản" },
                                { key: "parent", value: "Tên loại tài sản cha" },
                                { key: "description", value: "Mô tả" },
                                { key: "information", value: "Thuộc tính mặc định" }
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }

        return exportData;
    }

    //Kiểm tra mã id của tài sản cha có tồn tại
    checkValidParentAsset = (data, id) => {
        let check = data.filter(node => node._id === id);
        if (check.length !== 0) return true;
        else return false;
    }

    render() {
        const { translate } = this.props;
        const { list } = this.props.assetType.administration.types;
        const { domainParent, currentDomain, deleteNode } = this.state;

        const dataTree = list.map(node => {
            const result = this.checkValidParentAsset(list, node.parent);

            return {
                ...node,
                id: node._id,
                icon: 'glyphicon glyphicon-oil',
                text: node.typeName,
                state: { "opened": true },
                parent: !node.parent || !result ? '#' : node.parent.toString()
            }
        })

        let exportData;
        exportData = this.convertDataToExportData(dataTree);

        return (
            <div className="box">
                <div className="box-header with-border">
                    {/* Xóa */}
                    {
                        deleteNode.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteDomains}>{translate('asset.general_information.delete')}</button>
                    }

                    {/* Xuất báo cáo */}
                    <ExportExcel id="export-asset-type" exportData={exportData} style={{ marginLeft: '5px' }} />

                    {/* Thêm */}
                    <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title='Thêm'>{translate('task_template.add')}</button>
                    <ul className="dropdown-menu pull-right">
                        <li><a style={{ cursor: "pointer" }} onClick={() => { window.$('#modal-create-asset-type').modal('show') }}>{translate('task_template.add')}</a></li>
                        <li><a style={{ cursor: "pointer" }} onClick={() => { window.$('#import_asset_type').modal('show') }}>{translate('human_resource.profile.employee_management.add_import')}</a></li>
                    </ul>
                    <ImportAssetTypeModal />
                    <CreateAssetTypeModal domainParent={domainParent} />
                </div>

                <div className="box-body">
                    <div className="row">
                        {/* Cây các loại tài sản */}
                        <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                            <div className="domain-tree" id="domain-tree">
                                <Tree
                                    id="tree-qlcv-document"
                                    onChanged={this.onChanged}
                                    checkNode={this.checkNode}
                                    unCheckNode={this.unCheckNode}
                                    data={dataTree}
                                />
                            </div>
                            <SlimScroll outerComponentId="domain-tree" innerComponentId="tree-qlcv-document" innerComponentWidth={"100%"} activate={true} />
                        </div>

                        {/* Form chỉnh sửa loại tài sản */}
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                            {
                                currentDomain &&
                                <EditForm
                                    domainChild={currentDomain.children_d}
                                    domainId={currentDomain.id}
                                    domainCode={currentDomain.original.typeNumber}
                                    domainName={currentDomain.text}
                                    domainDescription={currentDomain.original.description ? currentDomain.original.description : ""}
                                    domainParent={currentDomain.parent}
                                    defaultInformation={currentDomain.original.defaultInformation}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { assetType } = state;
    return { assetType };
}

const mapDispatchToProps = {
    getAssetTypes: AssetTypeActions.getAssetTypes,
    editAssetType: AssetTypeActions.editAssetType,
    deleteAssetTypes: AssetTypeActions.deleteAssetTypes,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AdministrationAssetTypes));