import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import './organizationalUnit.css';

import { DeleteNotification, ExportExcel, ApiImage } from '../../../../common-components';

import { DepartmentActions } from '../redux/actions';
import { CompanyActions } from '../../../system-admin/company/redux/actions';

import DepartmentCreateForm from './organizationalUnitCreateForm';
import DepartmentEditForm from './organizationalUnitEditForm';
import DepartmentCreateWithParent from './organizationalUnitCreateWithParent';
import { DepartmentImportForm } from './organizationalUnitImportForm';


function DepartmentTreeView(props) {
    const departmentId = React.createRef();

    const [state, setState] = useState({
        zoom: 13,
    })

    // Cac ham xu ly du lieu voi modal
    const convertDataToExportData = (data) => {
        // chuyen du lieu cay ve du lieu bang
        let listData = [];
        if (data) {
            for (let i = 0; i < data.length; i++) {
                listData = [...listData, data[i]];
                if (data[i].children) {
                    let da = data[i].children;
                    for (let j in da) {
                        da[j]["parentName"] = data[i].name;
                        listData = [...listData, da[j]];
                        if (da[j].children) {
                            let datas = da[j].children;
                            for (let k in datas) {
                                datas[k]["parentName"] = da[j].name;
                                listData = [...listData, datas[k]];
                            }
                        }
                    }
                }

            }
        }
        let datas = [];
        if (listData.length !== 0) {
            for (let k = 0; k < listData.length; k++) {
                let x = listData[k];
                let length = 1;
                let name = x.name;
                let description = x.description;
                let managers = x.managers.map(item => item.name);
                if (managers.length > length) {
                    length = managers.length;
                }
                let deputyManagers = x.deputyManagers.map(item => item.name);
                if (deputyManagers.length > length) {
                    length = deputyManagers.length;
                }
                let employees = x.employees.map(item => item.name);
                if (employees.length > length) {
                    length = employees.length;
                }
                let parent = "";
                if (x.parentName) {
                    parent = x.parentName;
                }
                let out = {
                    STT: k + 1,
                    name: name,
                    description: description,
                    parent: parent,
                    managers: managers[0],
                    deputyManagers: deputyManagers[0],
                    employees: employees[0]
                };
                datas = [...datas, out];
                if (length > 1) {
                    for (let i = 1; i < length; i++) {
                        out = {
                            STT: "",
                            name: "",
                            description: "",
                            parent: "",
                            managers: managers[i],
                            deputyManagers: deputyManagers[i],
                            employees: employees[i]
                        };
                        datas = [...datas, out];
                    }
                }
            }
        }
        let exportData = {
            fileName: "Bảng thống kê cơ cấu tổ chức",
            dataSheets: [
                {
                    sheetTitle: "Bảng thống kê cơ cấu tổ chức",
                    sheetName: "sheet1",
                    tables: [{
                        rowHeader: 1,
                        columns: [
                            { key: "STT", value: "STT" },
                            { key: "name", value: "Tên đơn vị" },
                            { key: "description", value: "Mô tả đơn vị" },
                            { key: "parent", value: "Đơn vị cha" },
                            { key: "managers", value: "Tên các chức danh trưởng đơn vị" },
                            { key: "deputyManagers", value: "Tên các chức danh phó đơn vị" },
                            { key: "employees", value: "Tên các chức danh nhân viên đơn vị" }
                        ],
                        data: datas
                    }]
                },
            ]
        }
        return exportData
    }

    const handleCreate = (event) => {
        event.preventDefault();
        window.$('#modal-create-department').modal('show');
    }

    const handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file').modal('show');
    }

    const handleEdit = async (department) => {
        await setState({
            ...state,
            currentRow: department
        });
        window.$('#modal-edit-department').modal('show')
    }

    const handleCreateWithParent = async (department) => {
        await setState({
            ...state,
            currentRow: department
        });
        window.$('#modal-create-department-with-parent').modal('show')
    }

    const toggleSetting = (id) => {
        if (document.getElementById(id).style.display === 'none') {
            document.getElementById(id).style.display = 'block';
        } else {
            document.getElementById(id).style.display = 'none';
        }
    }

    const zoomIn = () => {
        if (state.zoom < 72) {
            setState({
                ...state,
                zoom: state.zoom + 1
            });
        }
    }

    const zoomOut = () => {
        if (state.zoom > 0) {
            setState({
                ...state,
                zoom: state.zoom - 1
            });
        }
    }

    const showNodeContent = (data, translate) => {
        return (
            <div className="tf-nc bg bg-primary" style={{
                minWidth: '120px',
                border: 'none',
                padding: '0px',
                textAlign: 'center',
                fontWeight: '900',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
            }}>
                <div style={{ padding: '8px' }}>
                    <span id={`department-${data.id}`} title={data.name} className="pull-right" style={{ paddingLeft: '5px' }}>
                        <a href="#abc" style={{ color: 'white' }} title="Ẩn/hiện điều khiển" onClick={() => toggleSetting(`department-setting-${data.id}`)}><i className="fa fa-gears"></i></a>
                    </span>
                    {`${data.name}`}
                </div>

                <div style={{ backgroundColor: '#fff', paddingTop: '2px', display: 'none', borderTop: '0.5px solid #c1c1c1' }} id={`department-setting-${data.id}`}>
                    <a href="#setting-organizationalUnit" className="edit text-green" onClick={() => handleCreateWithParent(data)} title={translate('manage_department.add_title')}><i className="material-icons">library_add</i></a>
                    <a href="#setting-organizationalUnit" className="edit text-yellow" onClick={() => handleEdit(data)} title={translate('manage_department.edit_title')}><i className="material-icons">ballot</i></a>
                    <DeleteNotification
                        content={translate('manage_department.delete')}
                        data={{
                            id: data.id,
                            info: data.name
                        }}
                        func={props.destroy}
                    />
                </div>
            </div>
        )
    }

    const displayTreeView = (data, translate) => {
        if (data) {
            if (!data.children) {
                return (
                    <li key={data.id}>
                        {showNodeContent(data, translate)}
                    </li>
                )
            }

            return (
                <li key={data.id}>
                    {showNodeContent(data, translate)}
                    <ul>
                        {
                            data.children.map(tag => displayTreeView(tag, translate))
                        }
                    </ul>
                </li>
            )
        } else {
            return null
        }
    }

    const handleUploadImage = () => {
        let formData = new FormData();
        const { organizationalUnitImage } = state;
        if (state.organizationalUnitImage) {
            formData.append('organizationalUnitImage', organizationalUnitImage);
        }
        props.uploadOrganizationalUnitImage(formData);
    }

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            let fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                setState({
                    ...state,
                    organizationalUnitImagePreview: fileLoad.result,
                    organizationalUnitImage: file,
                });
            };
        }

    }

    useEffect(() => {
        //const { item } = props.company;
        if (props.company.image != state.image) {
            return {
                organizationalUnitImagePreview: props.company.image ? `.${props.company.image}` : null,
                image: props.company.image
            }
        }
    }, [props.company.image])

    useEffect(() => {
        props.getCompanyInformation();
    }, [])

    const { translate, department, company } = props;
    const { tree } = props.department;
    const { currentRow, organizationalUnitImagePreview } = state;
    let data = [];
    if (tree) {
        data = tree;
    }
    const organizationalUnitImageStyle = {
        objectFit: "cover",
        maxWidth: "100%",
        maxHeight: "100%"
    }

    let exportData = convertDataToExportData(data);

    return (
        <React.Fragment>
            {<ExportExcel id="export-organizationalUnit" exportData={exportData} style={{ marginLeft: 5 }} />}
            {/* Button thêm mới một phòng ban */}
            <DepartmentCreateForm />
            <DepartmentImportForm />
            <div className="form-inline">
                <div className="dropdown pull-right" >
                    <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title='Thêm'>{translate('manage_department.add_title')}</button>
                    <ul className="dropdown-menu pull-right">
                        <li><a href="#modal-create-department" title={translate('manage_department.add_title')} onClick={(event) => { handleCreate(event) }}>{translate('manage_department.add_title')}</a></li>
                        <li><a href="#modal_import_file" title="ImportForm" onClick={(event) => { handImportFile(event) }}>{translate('manage_department.import')}</a></li>
                    </ul>
                </div>
            </div>

            {/* Kiểm tra có dữ liệu về các đơn vị, phòng ban hay không */}
            {
                department.list && department.list.length > 0 ?
                    <React.Fragment >
                        <div className="pull-left">
                            <i className="btn btn-sm btn-default fa fa-plus" onClick={zoomIn} title={translate('manage_department.zoom_in')}></i>
                            <i className="btn btn-sm btn-default fa fa-minus" onClick={zoomOut} title={translate('manage_department.zoom_out')}></i>
                        </div>
                    </React.Fragment>
                    : department.isLoading ?
                        <p className="text-center">{translate('confirm.loading')}</p> :
                        <p className="text-center">{translate('confirm.no_data')}</p>
            }

            {/* Hiển thị cơ cấu tổ chức của công ty */}
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    {
                        tree &&
                        tree.map((tree, index) =>
                            <div key={index} className="tf-tree example" style={{ textAlign: 'left', fontSize: state.zoom, marginTop: '50px' }}>
                                <ul>
                                    {
                                        displayTreeView(tree, translate)
                                    }
                                </ul>
                            </div>
                        )
                    }
                </div>
            </div>

            {
                company && company.isLoading === false &&
                <div className="row">
                    <div className="col-md-12">
                        <div className="organizationalUnitImageWrapper">
                            <div className="organizationalUnitImageButton">
                                {/* <input className="custom-file-input" type="file" id="file" onChange={handleUpload} /> */}
                                <input type="file" id="files" onChange={handleUpload} style={{ display: 'none' }} />
                                {organizationalUnitImagePreview &&
                                    <>
                                        <label style={{ marginBottom: 0 }} className="custom-file-input" htmlFor="files">
                                            <span className="material-icons icon_upload">
                                                cloud_upload
                                            </span>
                                            Cập nhật ảnh cơ cấu tổ chức
                                        </label>
                                        <button style={{ marginLeft: '10px' }} type="button" className="btn btn-success pull-right" title='Thêm' onClick={handleUploadImage}>Lưu</button>
                                    </>
                                }
                            </div>
                            <div style={{ height: '500px', textAlign: "center" }}>
                                {
                                    organizationalUnitImagePreview ?
                                        <ApiImage style={organizationalUnitImageStyle} src={organizationalUnitImagePreview} alt={""} />
                                        :
                                        <>
                                            <h4 style={{ fontWeight: 'bold' }}>Chưa có ảnh cơ cấu tổ chức</h4>
                                            <label className="upload_now" style={{ cursor: 'pointer' }} htmlFor="files">Cập nhật ngay</label>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Các form edit và thêm mới một phòng ban mới với phòng ban cha được chọn */}
            {
                currentRow &&
                <React.Fragment>
                    <DepartmentCreateWithParent
                        // departmentId={currentRow.id}
                        departmentParent={currentRow.id}
                    />
                    <DepartmentEditForm
                        departmentId={currentRow.id}
                        departmentName={currentRow.name}
                        departmentDescription={currentRow.description}
                        departmentParent={currentRow.parent_id}
                        managers={currentRow.managers}
                        deputyManagers={currentRow.deputyManagers}
                        employees={currentRow.employees}
                    />
                </React.Fragment>
            }
        </React.Fragment>
    );
}

function mapState(state) {
    const { department, company } = state;
    return { department, company };
}

const getState = {
    destroy: DepartmentActions.destroy,
    uploadOrganizationalUnitImage: CompanyActions.uploadOrganizationalUnitImage,
    getCompanyInformation: CompanyActions.getCompanyInformation
}

export default connect(mapState, getState)(withTranslate(DepartmentTreeView));
