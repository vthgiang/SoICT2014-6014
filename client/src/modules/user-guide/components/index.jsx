import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import { UserGuideSystem, UserGuideKpi, UserGuideTask, UserGuideDocument, UserGuideAsset, UserGuideHr } from './config.js'
import DetailGuide from './detailGuide'
import { getStorage } from '../../../config'
import { RoleActions } from '../../super-admin/role/redux/actions'

function UserGuide(props) {
  const [taskForUser, setTaskForUser] = useState(false)
  const [taskForManager, setTaskForManager] = useState(false)

  const [assetForUser, setAssetForUser] = useState(false)
  const [assetForManager, setAssetForManager] = useState(false)

  const [documentForUser, setDocumentForUser] = useState(false)
  const [documentForManager, setDocumentForManager] = useState(false)
  const [documentForAdmin, setDocumentForAdmin] = useState(false)

  const [kpiForUser, setKpiForUser] = useState(false)
  const [kpiForManager, setKpiForManager] = useState(false)

  const [humanResourceForUser, sethumanResourceForUser] = useState(false)
  const [humanResourceForManager, sethumanResourceForManager] = useState(false)

  const [managerSystem, setManagerSystem] = useState(false)

  const [currentLink, setCurrentLink] = useState('')

  const showUserGuideTaskForUser = () => {
    setTaskForUser(!taskForUser)
  }
  const showUserGuideTaskForManager = () => {
    setTaskForManager(!taskForManager)
  }

  const showUserGuideAssetForUser = () => {
    setAssetForUser(!assetForUser)
  }
  const showUserGuideAssetForManager = () => {
    setAssetForManager(!assetForManager)
  }

  const showUserGuideDocumentForUser = () => {
    setDocumentForUser(!documentForUser)
  }
  const showUserGuideDocumentForManager = () => {
    setDocumentForManager(!documentForManager)
  }
  const showUserGuideDocumentForAdmin = () => {
    setDocumentForAdmin(!documentForAdmin)
  }

  const showUserGuideKpiForUser = () => {
    setKpiForUser(!kpiForUser)
  }
  const showUserGuideKpiForManager = () => {
    setKpiForManager(!kpiForManager)
  }

  const showUserGuideHumanresourceForUser = () => {
    sethumanResourceForUser(!humanResourceForUser)
  }
  const showUserGuideHumanresourceForManager = () => {
    sethumanResourceForManager(!humanResourceForManager)
  }

  const showUserGuideSystem = () => {
    setManagerSystem(!managerSystem)
  }

  useEffect(() => {
    props.getAllRole()
  }, [])

  const showFilePreview = (data) => {
    const link = process.env.REACT_APP_SERVER + data.url
    Swal.fire({
      html: ` 
            <h4>${data.pageName}</h4>
            <div style="margin:0px;padding:0px;overflow:hidden">
               <iframe  frameborder="0" style="overflow:hidden;height:90vh;width:100%" height="100vh" width="100%"
                        src= ${link}
                    />
            </div>`,
      width: '100%',
      showCancelButton: false,
      showConfirmButton: false,
      showCloseButton: true,
      focusConfirm: false
    })
  }

  let currentRole = getStorage('currentRole')

  const { auth, role } = props

  let rolesUser = [],
    roles = role.list
  rolesUser = auth?.user?.roles
  let currentRoleInfo = rolesUser
    ?.filter((elem) => elem.roleId.id === currentRole)
    .map((elem) => {
      return elem.roleId
    })[0]

  let TaskGuide = { user: [], manager: [] },
    DocumentGuide = { user: [], manager: [], Administrator: [] },
    HrGuide = { user: [], manager: [] },
    kpiGuide = { user: [], manager: [] },
    AssetGuide = { user: [], manager: [] },
    SystemGuide = []
  let roleAdmin = roles.find((x) => x.name === 'Admin')
  let roleSuperAdmin = roles.find((x) => x.name === 'Super Admin')
  let roleManager = roles.find((x) => x.name === 'Manager')

  if (roleAdmin && roleManager) {
    if (
      currentRoleInfo?.id === roleAdmin?.id ||
      currentRoleInfo?.parents?.includes(roleAdmin?.id) ||
      currentRoleInfo?.id === roleSuperAdmin?.id ||
      currentRoleInfo?.parents?.includes(roleSuperAdmin?.id)
    ) {
      TaskGuide = UserGuideTask
      DocumentGuide = UserGuideDocument
      HrGuide = UserGuideHr
      kpiGuide = UserGuideKpi
      AssetGuide = UserGuideAsset
      AssetGuide = UserGuideAsset
      SystemGuide = UserGuideSystem
    } else if (currentRoleInfo?.id === roleManager?.id || currentRoleInfo?.parents?.includes(roleManager?.id)) {
      TaskGuide = UserGuideTask
      DocumentGuide = {
        manager: [...UserGuideDocument.manager],
        user: [...UserGuideDocument.user]
      }
      HrGuide = UserGuideHr
      kpiGuide = UserGuideKpi
      AssetGuide = UserGuideAsset
      AssetGuide = UserGuideAsset
      SystemGuide = []
    } else {
      TaskGuide.user = UserGuideTask.user
      DocumentGuide.user = UserGuideDocument.user
      HrGuide.user = UserGuideHr.user
      kpiGuide.user = UserGuideKpi.user
      AssetGuide.user = UserGuideAsset.user

      TaskGuide.manager = []
      DocumentGuide.manager = []
      HrGuide.manager = []
      kpiGuide.manager = []
      AssetGuide.manager = []
      SystemGuide = []
    }
  }

  return (
    <React.Fragment>
      {currentLink && <DetailGuide link={currentLink} />}
      <div className='box'>
        <div className='box-body qlcv'>
          <div className='row'>
            {/* Module công việc */}
            {TaskGuide.manager.length || TaskGuide.user.length ? (
              <section className='col-lg-6 col-md-6'>
                <div className='box'>
                  <div className='box-header with-border'>
                    <h3 className='box-title' style={{ fontWeight: 600 }}>
                      Quản lý công việc
                    </h3>
                  </div>
                  <div className='box-body'>
                    {TaskGuide.manager.length ? (
                      <div>
                        <p
                          data-toggle='collapse'
                          data-target='#show-asset-guide-task-for-manager'
                          aria-expanded='false'
                          style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => showUserGuideTaskForManager()}
                        >
                          <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                            {taskForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                          </span>
                          {`Manager (${TaskGuide.manager.length})`}
                        </p>
                        <div className='collapse' data-toggle='collapse ' id='show-asset-guide-task-for-manager'>
                          <ul className='todo-list' data-widget='todo-list'>
                            {TaskGuide.manager.length > 0 &&
                              TaskGuide.manager.map((obj, index) => (
                                <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                                  <div className='icheck-primary' style={{ display: 'flex' }}>
                                    <span className='material-icons' style={{ marginRight: '10px' }}>
                                      link
                                    </span>
                                    {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=task&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                    <a href='#show-detail' onClick={() => showFilePreview(obj)}>
                                      {obj.pageName}
                                    </a>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <> </>
                    )}

                    <p
                      data-toggle='collapse'
                      data-target='#show-asset-guide-task-for-user'
                      aria-expanded='false'
                      style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => showUserGuideTaskForUser()}
                    >
                      <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                        {taskForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                      </span>
                      {`User (${TaskGuide.user.length})`}
                    </p>
                    <div className='collapse' data-toggle='collapse ' id='show-asset-guide-task-for-user'>
                      <ul className='todo-list' data-widget='todo-list'>
                        {TaskGuide.user.length > 0 &&
                          TaskGuide.user.map((obj, index) => (
                            <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                              <div className='icheck-primary' style={{ display: 'flex' }}>
                                <span className='material-icons' style={{ marginRight: '10px' }}>
                                  link
                                </span>
                                {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=task&type=user&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                  {obj.pageName}
                                </a>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <> </>
            )}

            {/* Module Kpi */}
            {kpiGuide.manager.length || kpiGuide.user.length ? (
              <section className='col-lg-6 col-md-6'>
                <div className='box'>
                  <div className='box-header with-border'>
                    <h3 className='box-title' style={{ fontWeight: 600 }}>
                      Quản lý KPI
                    </h3>
                  </div>
                  <div className='box-body'>
                    {kpiGuide.manager.length ? (
                      <div>
                        <p
                          data-toggle='collapse'
                          data-target='#show-asset-guide-kpi-for-manager'
                          aria-expanded='false'
                          style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => showUserGuideKpiForManager()}
                        >
                          <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                            {kpiForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                          </span>
                          {`Manager (${kpiGuide.manager.length})`}
                        </p>
                        <div className='collapse' data-toggle='collapse ' id='show-asset-guide-kpi-for-manager'>
                          <ul className='todo-list' data-widget='todo-list'>
                            {kpiGuide.manager.length > 0 &&
                              kpiGuide.manager.map((obj, index) => (
                                <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                                  <div className='icheck-primary' style={{ display: 'flex' }}>
                                    <span className='material-icons' style={{ marginRight: '10px' }}>
                                      link
                                    </span>
                                    {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=KPI&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                    <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                      {obj.pageName}
                                    </a>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <> </>
                    )}

                    <p
                      data-toggle='collapse'
                      data-target='#show-asset-guide-kpi-for-user'
                      aria-expanded='false'
                      style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => showUserGuideKpiForUser()}
                    >
                      <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                        {kpiForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                      </span>
                      {`User (${kpiGuide.user.length})`}
                    </p>
                    <div className='collapse' data-toggle='collapse ' id='show-asset-guide-kpi-for-user'>
                      <ul className='todo-list' data-widget='todo-list'>
                        {kpiGuide.user.length > 0 &&
                          kpiGuide.user.map((obj, index) => {
                            return (
                              <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                                <div className='icheck-primary' style={{ display: 'flex' }}>
                                  <span className='material-icons' style={{ marginRight: '10px' }}>
                                    link
                                  </span>
                                  {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=KPI&type=user&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                  <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                    {obj.pageName}
                                  </a>
                                </div>
                              </li>
                            )
                          })}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <></>
            )}
          </div>

          <div className='row'>
            {/* Module tài liệu */}
            {DocumentGuide?.Administrator?.length || DocumentGuide.manager.length || DocumentGuide.user.length ? (
              <section className='col-lg-6 col-md-6'>
                <div className='box'>
                  <div className='box-header with-border'>
                    <h3 className='box-title' style={{ fontWeight: 600 }}>
                      Quản lý tài liệu
                    </h3>
                  </div>
                  <div className='box-body'>
                    {/* Administrator */}
                    {DocumentGuide?.Administrator?.length ? (
                      <div>
                        <p
                          data-toggle='collapse'
                          data-target='#show-asset-guide-document-for-admin'
                          aria-expanded='false'
                          style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => showUserGuideDocumentForAdmin()}
                        >
                          <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                            {documentForAdmin ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                          </span>
                          {`Administrator (${DocumentGuide?.Administrator?.length})`}
                        </p>
                        <div className='collapse' data-toggle='collapse ' id='show-asset-guide-document-for-admin'>
                          <ul className='todo-list' data-widget='todo-list'>
                            {DocumentGuide?.Administrator?.length > 0 &&
                              DocumentGuide?.Administrator?.map((obj, index) => (
                                <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                                  <div className='icheck-primary' style={{ display: 'flex' }}>
                                    <span className='material-icons' style={{ marginRight: '10px' }}>
                                      link
                                    </span>
                                    {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=document&type=user&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                    <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                      {obj.pageName}
                                    </a>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <> </>
                    )}

                    {/* Quanr lys */}
                    {DocumentGuide.manager.length ? (
                      <div>
                        <p
                          data-toggle='collapse'
                          data-target='#show-asset-guide-document-for-manager'
                          aria-expanded='false'
                          style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => showUserGuideDocumentForManager()}
                        >
                          <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                            {documentForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                          </span>
                          {`Manager (${DocumentGuide.manager.length})`}
                        </p>
                        <div className='collapse' data-toggle='collapse ' id='show-asset-guide-document-for-manager'>
                          <ul className='todo-list' data-widget='todo-list'>
                            {DocumentGuide.manager.length > 0 &&
                              DocumentGuide.manager.map((obj, index) => (
                                <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                                  <div className='icheck-primary' style={{ display: 'flex' }}>
                                    <span className='material-icons' style={{ marginRight: '10px' }}>
                                      link
                                    </span>
                                    {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=document&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                    <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                      {obj.pageName}
                                    </a>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <> </>
                    )}

                    {/* Nguoiwf dung */}
                    <p
                      data-toggle='collapse'
                      data-target='#show-document-guide-for-user'
                      aria-expanded='false'
                      style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => showUserGuideDocumentForUser()}
                    >
                      <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                        {documentForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                      </span>
                      {`User (${DocumentGuide.user.length})`}
                    </p>
                    <div className='collapse' data-toggle='collapse ' id='show-document-guide-for-user'>
                      <ul className='todo-list' data-widget='todo-list'>
                        {DocumentGuide.user.length > 0 &&
                          DocumentGuide.user.map((obj, index) => (
                            <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                              <div className='icheck-primary' style={{ display: 'flex' }}>
                                <span className='material-icons' style={{ marginRight: '10px' }}>
                                  link
                                </span>
                                {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=document&type=user&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                  {obj.pageName}
                                </a>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <> </>
            )}

            {/* Module tài sản */}
            {AssetGuide.manager.length || AssetGuide.user.length ? (
              <section className='col-lg-6 col-md-6'>
                <div className='box'>
                  <div className='box-header with-border'>
                    <h3 className='box-title' style={{ fontWeight: 600 }}>
                      Quản lý tài sản
                    </h3>
                  </div>
                  <div className='box-body'>
                    {AssetGuide.manager.length ? (
                      <div>
                        <p
                          data-toggle='collapse'
                          data-target='#show-asset-guide-asset-for-manager'
                          aria-expanded='false'
                          style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => showUserGuideAssetForManager()}
                        >
                          <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                            {assetForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                          </span>
                          {`Manager (${AssetGuide.manager.length})`}
                        </p>
                        <div className='collapse' data-toggle='collapse ' id='show-asset-guide-asset-for-manager'>
                          <ul className='todo-list' data-widget='todo-list'>
                            {AssetGuide.manager.length > 0 &&
                              AssetGuide.manager.map((obj, index) => (
                                <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                                  <div className='icheck-primary' style={{ display: 'flex' }}>
                                    <span className='material-icons' style={{ marginRight: '10px' }}>
                                      link
                                    </span>
                                    {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=asset&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                    <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                      {obj.pageName}
                                    </a>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <> </>
                    )}

                    <p
                      data-toggle='collapse'
                      data-target='#show-asset-guide-asset-for-user'
                      aria-expanded='false'
                      style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => showUserGuideAssetForUser()}
                    >
                      <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                        {assetForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                      </span>
                      {`User (${AssetGuide.user.length})`}
                    </p>

                    <div className='collapse' data-toggle='collapse ' id='show-asset-guide-asset-for-user'>
                      <ul className='todo-list' data-widget='todo-list'>
                        {AssetGuide.user.length > 0 &&
                          AssetGuide.user.map((obj, index) => (
                            <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                              <div className='icheck-primary' style={{ display: 'flex' }}>
                                <span className='material-icons' style={{ marginRight: '10px' }}>
                                  link
                                </span>
                                {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=asset&type=user&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                  {obj.pageName}
                                </a>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <></>
            )}
          </div>

          <div className='row'>
            {/* Module nhân sự */}
            {HrGuide.manager.length ? (
              <section className='col-lg-6 col-md-6'>
                <div className='box'>
                  <div className='box-header with-border'>
                    <h3 className='box-title' style={{ fontWeight: 600 }}>
                      Quản lý nhân sự
                    </h3>
                  </div>
                  <div className='box-body'>
                    {HrGuide.manager.length ? (
                      <div>
                        <p
                          data-toggle='collapse'
                          data-target='#show-asset-guide-hr-for-manager'
                          aria-expanded='false'
                          style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => showUserGuideHumanresourceForManager()}
                        >
                          <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                            {humanResourceForManager ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                          </span>
                          {`Manager (${HrGuide.manager.length})`}
                        </p>
                        <div className='collapse' data-toggle='collapse ' id='show-asset-guide-hr-for-manager'>
                          <ul className='todo-list' data-widget='todo-list'>
                            {HrGuide.manager.length > 0 &&
                              HrGuide.manager.map((obj, index) => (
                                <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                                  <div className='icheck-primary' style={{ display: 'flex' }}>
                                    <span className='material-icons' style={{ marginRight: '10px' }}>
                                      link
                                    </span>
                                    {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=hr&type=manager&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                    <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                      {obj.pageName}
                                    </a>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}

                    <p
                      data-toggle='collapse'
                      data-target='#show-asset-guide-hr-for-user'
                      aria-expanded='false'
                      style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => showUserGuideHumanresourceForUser()}
                    >
                      <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                        {humanResourceForUser ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                      </span>
                      {`User (${HrGuide.manager.length})`}
                    </p>
                    <div className='collapse' data-toggle='collapse ' id='show-asset-guide-hr-for-user'>
                      <ul className='todo-list' data-widget='todo-list'>
                        {HrGuide.user.length > 0 &&
                          HrGuide.user.map((obj, index) => (
                            <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                              <div className='icheck-primary' style={{ display: 'flex' }}>
                                <span className='material-icons' style={{ marginRight: '10px' }}>
                                  link
                                </span>
                                <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                  {obj.pageName}
                                </a>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <> </>
            )}

            {/* Module QTHT */}
            {SystemGuide.length ? (
              <section className='col-lg-6 col-md-6'>
                <div className='box'>
                  <div className='box-header with-border'>
                    <h3 className='box-title' style={{ fontWeight: 600 }}>
                      Quản trị hệ thống
                    </h3>
                  </div>
                  <div className='box-body'>
                    <p
                      data-toggle='collapse'
                      data-target='#show-asset-guide-system-for-user'
                      aria-expanded='false'
                      style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer' }}
                      onClick={() => showUserGuideSystem()}
                    >
                      <span className='material-icons' style={{ fontWeight: 'bold', marginRight: '10px' }}>
                        {managerSystem ? `keyboard_arrow_up` : `keyboard_arrow_down`}
                      </span>
                      {`Administrator (${SystemGuide.length})`}{' '}
                    </p>
                    <div className='collapse' data-toggle='collapse ' id='show-asset-guide-system-for-user'>
                      <ul className='todo-list' data-widget='todo-list'>
                        {SystemGuide.length > 0 &&
                          SystemGuide.map((obj, index) => (
                            <li style={{ borderLeft: 'none', cursor: 'pointer' }} key={index}>
                              <div className='icheck-primary' style={{ display: 'flex' }}>
                                <span className='material-icons' style={{ marginRight: '10px' }}>
                                  link
                                </span>
                                {/* <a href={`${process.env.REACT_APP_WEBSITE + obj.detailPage}?name=System&id=${obj.id}&fileName=${obj.fileName}`} title="Xem chi tiet" target="_blank">{obj.pageName}</a> */}
                                <a href='#show-detail' title='Xem chi tiet' onClick={() => showFilePreview(obj)}>
                                  {obj.pageName}
                                </a>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <> </>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
function mapState(state) {
  const { auth, role } = state

  return { auth, role }
}

const mapDispatchToProps = {
  getAllRole: RoleActions.get
}

export default connect(mapState, mapDispatchToProps)(withTranslate(UserGuide))
