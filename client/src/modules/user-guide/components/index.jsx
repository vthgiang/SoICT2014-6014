import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import Swal from 'sweetalert2';
import { UserGuideSystem, UserGuideKpi, UserGuideTask, UserGuideDocument, UserGuideAsset, UserGuideHr } from './config.js';
import DetailGuide from './detailGuide';
const UserGuide = (props) => {


    const [taskForUser, setTaskForUser] = useState(false);
    const [taskForManager, setTaskForManager] = useState(false);

    const [assetForUser, setAssetForUser] = useState(false);
    const [assetForManager, setAssetForManager] = useState(false);

    const [documentForUser, setDocumentForUser] = useState(false);
    const [documentForManager, setDocumentForManager] = useState(false);

    const [kpiForUser, setKpiForUser] = useState(false);
    const [kpiForManager, setKpiForManager] = useState(false);

    const [humanResourceForUser, sethumanResourceForUser] = useState(false);
    const [humanResourceForManager, sethumanResourceForManager] = useState(false);

    const [managerSystem, setManagerSystem] = useState(false);

    const [currentLink, setCurrentLink] = useState("");



    const showUserGuideTaskForUser = () => {
        setTaskForUser(!taskForUser);
    }
    const showUserGuideTaskForManager = () => {
        setTaskForManager(!taskForManager);
    }

    const showUserGuideAssetForUser = () => {
        setAssetForUser(!assetForUser);
    }
    const showUserGuideAssetForManager = () => {
        setAssetForManager(!assetForManager);
    }

    const showUserGuideDocumentForUser = () => {
        setDocumentForUser(!documentForUser);
    }
    const showUserGuideDocumentForManager = () => {
        setDocumentForManager(!documentForManager);
    }

    const showUserGuideKpiForUser = () => {
        setKpiForUser(!kpiForUser);
    }
    const showUserGuideKpiForManager = () => {
        setKpiForManager(!kpiForManager);
    }


    const showUserGuideHumanresourceForUser = () => {
        sethumanResourceForUser(!humanResourceForUser);
    }
    const showUserGuideHumanresourceForManager = () => {
        sethumanResourceForManager(!humanResourceForManager);
    }

    const showUserGuideSystem = () => {
        setManagerSystem(!managerSystem);
    }

    const showFilePreview = (data) => {
        console.log('aaaaaaaaaa', data);
        const { translate } = props;
        const link = process.env.REACT_APP_SERVER + data.url;
        Swal.fire({
            html: ` 
            <h3>${data.pageName}</h3>
               <iframe
                        width= "100%" height= "600"
                        src= ${link}
                    />`,
            //  icon: 'warning',
            width: "100%",
            //showCancelButton: true,
            // confirmButtonColor: '#3085d6',
            // cancelButtonColor: '#d33',
            // cancelButtonText: translate('general.no'),
            // confirmButtonText: translate('general.yes'),
        })
    }

    // const deleteDocument = (id, info) => {
    //     const { translate } = this.props;
    //     Swal.fire({
    //         html: `    <iframe
    //                     width="100%" height="700"
    //                     src= ${link}
    //                 />`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         cancelButtonText: translate('general.no'),
    //         confirmButtonText: translate('general.yes'),
    //     }).then((result) => {
    //         if (result.value) {
    //             this.props.deleteDocument(id);
    //         }
    //     })
    // }

    //  console.log('pppppppp', currentL)
    return (
        <React.Fragment>
            {
                currentLink &&
                <DetailGuide
                    link={currentLink}
                />

            }
            <div className="box">
                <div className="box-body qlcv">
                    <div className="row">
                        {/* Module công việc */}
                        <section className="col-lg-6 col-md-6">
                            <div className="box">
                                <div className="box-header with-border">
                                    <h3 className="box-title" style={{ fontWeight: 600 }}>
                                        Module công việc
                                                </h3>
                                </div>
                                <div className="box-body">
                                    <p data-toggle="collapse" data-target="#show-asset-guide-task-for-manager" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideTaskForManager()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {taskForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`Manager (${UserGuideTask.manager.length})`}</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-task-for-manager">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideTask.manager.length > 0 && UserGuideTask.manager.map((obj, index) => (
                                                    <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                            </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=task&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>


                                    <p data-toggle="collapse" data-target="#show-asset-guide-task-for-user" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideTaskForUser()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {taskForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`User (${UserGuideTask.user.length})`}</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-task-for-user">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideTask.user.length > 0 && UserGuideTask.user.map((obj, index) => (
                                                    <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                    </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=task&type=user&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" title="Xem chi tiet" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                ))
                                            }

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Module Kpi */}
                        <section className="col-lg-6 col-md-6">
                            <div className="box">
                                <div className="box-header with-border">
                                    <h3 className="box-title" style={{ fontWeight: 600 }}>
                                        Module KPI
                                    </h3>
                                </div>
                                <div className="box-body">
                                    <p data-toggle="collapse" data-target="#show-asset-guide-kpi-for-manager" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideKpiForManager()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {kpiForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`Manager (${UserGuideKpi.manager.length})`}</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-kpi-for-manager">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideKpi.manager.length > 0 && UserGuideKpi.manager.map((obj, index) => (
                                                    <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                            </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=KPI&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" title="Xem chi tiet" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>


                                    <p data-toggle="collapse" data-target="#show-asset-guide-kpi-for-user" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideKpiForUser()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {kpiForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`User (${UserGuideKpi.user.length})`}</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-kpi-for-user">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideKpi.user.length > 0 && UserGuideKpi.user.map((obj, index) => {
                                                    return <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                    </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=KPI&type=user&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" title="Xem chi tiet" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="row">
                        {/* Module tài liệu */}
                        <section className="col-lg-6 col-md-6">
                            <div className="box">
                                <div className="box-header with-border">
                                    <h3 className="box-title" style={{ fontWeight: 600 }}>
                                        Module tài liệu
                                    </h3>
                                </div>
                                <div className="box-body">
                                    {/* Quanr lys */}
                                    <p data-toggle="collapse" data-target="#show-asset-guide-document-for-manager" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideDocumentForManager()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {documentForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`Manager (${UserGuideDocument.manager.length})`}</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-document-for-manager">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideDocument.manager.length > 0 && UserGuideDocument.manager.map((obj, index) => (
                                                    <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                            </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=document&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" title="Xem chi tiet" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>

                                    {/* Nguoiwf dung */}
                                    <p data-toggle="collapse" data-target="#show-asset-guide-document-for-user" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideDocumentForUser()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {documentForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`User (${UserGuideDocument.user.length})`}</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-document-for-user">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideDocument.manager.length > 0 && UserGuideDocument.manager.map((obj, index) => (
                                                    <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                            </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=document&type=user&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" title="Xem chi tiet" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Module tài sản */}
                        <section className="col-lg-6 col-md-6">
                            <div className="box">
                                <div className="box-header with-border">
                                    <h3 className="box-title" style={{ fontWeight: 600 }}>
                                        Module tài sản
                                    </h3>
                                </div>
                                <div className="box-body">
                                    <p data-toggle="collapse" data-target="#show-asset-guide-asset-for-manager" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideAssetForManager()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {assetForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`Manager (${UserGuideAsset.manager.length})`}</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-asset-for-manager">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideAsset.manager.length > 0 && UserGuideAsset.manager.map((obj, index) => (
                                                    <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                    </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=asset&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" title="Xem chi tiet" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>

                                    <p data-toggle="collapse" data-target="#show-asset-guide-asset-for-user" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideAssetForUser()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {assetForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`User (${UserGuideAsset.user.length})`}</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-asset-for-user">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideAsset.user.length > 0 && UserGuideAsset.user.map((obj, index) => (
                                                    <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                            </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=asset&type=user&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" title="Xem chi tiet" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="row">
                        {/* Module nhân sự */}
                        <section className="col-lg-6 col-md-6">
                            <div className="box">
                                <div className="box-header with-border">
                                    <h3 className="box-title" style={{ fontWeight: 600 }}>
                                        Module nhân sự
                                    </h3>
                                </div>
                                <div className="box-body">
                                    <p data-toggle="collapse" data-target="#show-asset-guide-hr-for-manager" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideHumanresourceForManager()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {humanResourceForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`Manager (${UserGuideHr.manager.length})`}</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-hr-for-manager">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideHr.manager.length > 0 && UserGuideHr.manager.map((obj, index) => (
                                                    <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                            </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=hr&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" title="Xem chi tiet" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>

                                    <p data-toggle="collapse" data-target="#show-asset-guide-hr-for-user" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideHumanresourceForUser()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {humanResourceForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>User</p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-hr-for-user">
                                        <ul className="todo-list" data-widget="todo-list">
                                            <li style={{ borderLeft: 'none', cursor: "pointer" }}>
                                                <div className="icheck-primary" style={{ display: "flex" }}>
                                                    <span className="material-icons" style={{ marginRight: '10px' }}>
                                                        link
                                                    </span>
                                                    <a href="#" title="Xem chi tiet" target="_blank">Chưa có dữ liệu</a>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Module QTHT */}
                        <section className="col-lg-6 col-md-6">
                            <div className="box">
                                <div className="box-header with-border">
                                    <h3 className="box-title" style={{ fontWeight: 600 }}>
                                        Module quản trị hệ thống
                                    </h3>
                                </div>
                                <div className="box-body">
                                    <p data-toggle="collapse" data-target="#show-asset-guide-system-for-user" aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "bold", cursor: "pointer" }} onClick={() => showUserGuideSystem()}>
                                        <span className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                            {managerSystem ? `keyboard_arrow_up` : `keyboard_arrow_down`}

                                        </span>{`Super admin (${UserGuideSystem.length})`} </p>
                                    <div className="collapse" data-toggle="collapse " id="show-asset-guide-system-for-user">
                                        <ul className="todo-list" data-widget="todo-list">
                                            {
                                                UserGuideSystem.length > 0 && UserGuideSystem.map((obj, index) => (
                                                    <li style={{ borderLeft: 'none', cursor: "pointer" }} key={index}>
                                                        <div className="icheck-primary" style={{ display: "flex" }}>
                                                            <span className="material-icons" style={{ marginRight: '10px' }}>
                                                                link
                                                        </span>
                                                            {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=System&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                                            <a href="#show-detail" title="Xem chi tiet" onClick={() => showFilePreview(obj)}>{obj.pageName}</a>
                                                        </div>
                                                    </li>
                                                ))
                                            }

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default connect(null, null)(withTranslate(UserGuide));
