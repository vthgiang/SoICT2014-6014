import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, Loading, SelectBox, ToolTip, TreeTable } from "../../../../common-components";
import { ProjectActions } from "../../projects/redux/actions";
import { proposalAlgorithmItems, scheduleOptions } from "../consts"; 
import { getStorage } from "../../../../config";
import { getTableConfiguration } from "../../../../helpers/tableConfiguration";
import { ProjectProposalActions } from "../redux/actions";
import dayjs from 'dayjs'
import ProposalScheduleGanttEmployee from "./proposalScheduleGanttEmployee";
import KpiBarChart from "./kpiStatistic";
import ProposalScheduleGanttAsset from "./proposalScheduleGanttAsset";
import ProposalScheduleGanttTask from "./proposalScheduleGanttTask";
import { ProjectCreateEditForm } from "../../project-create/components/projectCreateEditForm";
import { PROJECT_ACTION_FORM } from "../../projects/constants";
import { KPIEmployees } from "./kpiEmployees";
import AlgorithmModal from "./algorithmModal";
import { useLocation } from 'react-router-dom';
import './timelineStyle.css'
import Swal from "sweetalert2";


function ProjectProposalPage(props) {
  const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatCurrencyUSD = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const { project, translate, user, projectProposal } = props
  const userId = getStorage('userId')

  const tableId = 'project-proposal-table'
  const defaultConfig = { limit: 100, hiddenColumns: [] }
  const limit = getTableConfiguration(tableId, defaultConfig).limit
  const projectData = project?.data?.paginate 

  const projectOptions = projectData && projectData?.length > 0 ? projectData.map((item) => {{
    return {
      text: item.name,
      value: item._id
    }
  }}) : []

  const [state, setState] = useState({
    page: 1,
    perPage: limit || defaultConfig.limit,
    currentProject: {
      proposals: {}
    }
  })
  const [algorithm, setAlgorithm] = useState()
  const [isShowPrevProposal, setIsShowPrevProposal] = useState(false)
  const [isShowPreviewProject, setIsShowPreviewProject] = useState(false)
  const [scheduleType, setScheduleType] = useState(scheduleOptions[0]?.value)
  const [isShowShedule, setIsShowSchedule] = useState(false)
  const [isSuccessAssign, setIsSuccessAssign] = useState(false)

  const {
    page, 
    perPage,
    currentProject
  } = state

  const {
    isLoading, 
    isAssignProposalLoading,
    projectProposalData
  } = projectProposal

  const [algorithmParams, setAlgorithmParams] = useState({
    hs: {
      HMS: 60,
      bw: 1,
      PAR: 0.5,
      HMCR: 0.9,
      maxIter: 30000
    },
    dlhs: {
      HMS: 60,
      Max_FEs: 30000,
      R: 100,
      numOfSub: 4,
      PSLSize: 5,
      BW_max: 2,
      BW_min: 1,
    }
  })

  const { proposals } = currentProject || {}

  const column = [
    { name: 'Mã công việc', key: 'code' },
    { name: 'Tên công việc', key: 'name' },
    { name: 'Công việc tiền nhiệm', key: 'preceedingTasks'},
    { name: 'Ngày bắt đầu', key: 'startDate' },
    { name: 'Ngày kết thúc', key: 'endDate' },
    { name: 'Nhân viên', key: 'assignee' },
    { name: 'Tài sản', key: 'assets' },
  ]

  const location = useLocation()  

  const handleChangeCurrentProject = (e) => {
    setState(prevState => ({
      ...prevState,
      currentProject: projectData.find(item => item._id === e[0])
    }));
  }

  const handleChangeAlgorithm = (e) => {
    setAlgorithm(e[0])
  }

  const isValidateSubmit = () => {
    if (!currentProject || !currentProject?._id || !algorithm || isLoading) {
      return false
    }
    return true
  }

  const handleProposalForProject = () => {
    props.proposalForProjectDispatch(currentProject._id, {
      algorithm,
      algorithmParams: algorithm === proposalAlgorithmItems[0]?.value ? algorithmParams.dlhs : algorithmParams.hs 
    })
    setIsShowSchedule(false)
    setIsShowPrevProposal(false)
    setScheduleType(scheduleOptions[0]?.value)
  }

  useEffect(() => {
    props.getProjectsDispatch({ calledId: 'paginate', page, perPage, userId });
  }, [page, perPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setState({
        ...state,
        currentProject: projectData && projectData?.length ? projectData?.find((item) => item?._id === id) : {}
      })
    }
  }, [location, projectData?.length]);

  useEffect(() => {
    if (!isLoading && projectProposalData) {
      // Update the project state with the new allocation data
      setState((prevState) => ({
        ...prevState,
        currentProject: {
          ...prevState.currentProject,
          proposals: projectProposalData?.proposalData,
        },
      }));
    }
  }, [isLoading, projectProposalData]);

  const convertAssignmentToTableData = (assignments) => {
    let data = []
    if (assignments && assignments?.length > 0) {
      for(let i = 0; i < assignments?.length; i++) {
        let dataItem = assignments[i]
        data[i] = {
          rawData: dataItem,
          code: dataItem?.task?.code,
          name: dataItem?.task?.name,
          preceedingTasks: dataItem?.task?.preceedingTasks && 
            dataItem?.task?.preceedingTasks?.length > 0 ? (
              <ToolTip dataTooltip={dataItem?.task?.preceedingTasks?.map((item) => item?.link)}/> 
            ) : null,
          startDate: dayjs(dataItem?.task?.startDate).format('HH:mm A DD/MM/YYYY') || [],
          endDate: dayjs(dataItem?.task?.endDate).format('HH:mm A DD/MM/YYYY') || [],
          assignee: dataItem?.assignee?.fullName,
          assets: dataItem?.assets?.length > 0 ? (
            <ToolTip dataTooltip={dataItem?.assets.map((item) => item?.assetName)}/> 
          ) : null
        }
      }
    }
    return data
  }

  const convertAssignmentToScheduleData = (assignments) => {
    let data = []
    if (assignments && assignments?.length > 0) {
      for(const assignment of assignments) {
        const {task, assets, assignee} = assignment
        let dataItem = {
          ...task,
          assignee: assignee?.fullName,
          assets: assets || []
        }
        data.push({
          ...dataItem
        })
      }
    }

    return data
  }


  const getLastestEndTime = (assignment) => {
    let lastEndTime = new Date(0)
    if (!assignment || !assignment?.length) {
      return lastEndTime
    }
    for(let i = 0; i < assignment.length; i++) {
      const { task } = assignment[i]
      const { endDate } = task
      if (lastEndTime < new Date(endDate)) {
        lastEndTime = new Date(endDate)
      }
    }

    return lastEndTime
  }

  const getNumberOfKpiWillReachTarget = (kpiTarget, kpiAssignment) => {
    let count = 0;
    for(const kpi of kpiTarget) {
      if (kpi.targetKPIValue <= kpiAssignment[kpi?.type?._id]) {
        count++
      }
    }
    return count;
  }

  const renderSchedule = (option, proposals) => {
    const tasksProject = convertAssignmentToScheduleData(proposals?.assignment);
  
    if (option === 'task_schedule') {
      return <ProposalScheduleGanttTask tasksProject={tasksProject} />;
    } else if (option === 'employee_schedule') {
      return <ProposalScheduleGanttEmployee tasksProject={tasksProject} />;
    } else if (option === 'asset_schedule') {
      return <ProposalScheduleGanttAsset tasksProject={tasksProject} />;
    }
  };

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const hue =  160 +  ((i * 240) / numColors); // Hues between 120 (green) and 240 (blue)
      colors.push(`hsla(${hue}, 100%, 50%, 0.4)`);
    }
    return colors;
  };

  const converDataKPIOfEmployees = (currentProject, kpiOfEmployees) => {
    const { responsibleEmployees, kpiTarget, usersInProject} = currentProject
      
    let labels = [];
    let datasets = [];

    if (responsibleEmployees && kpiOfEmployees && kpiTarget && usersInProject) {
      // Create a mapping of employee _id to their names
      const employeeNameMap = responsibleEmployees.reduce((acc, employee) => {
        const userFind = usersInProject.find((item) => item.userId === employee?._id)
        acc[userFind.employeeId] = employee?.name;
        return acc;
      }, {});

      // Create a mapping of KPI _id to their names
      const kpiNameMap = kpiTarget.reduce((acc, kpi) => {
        acc[kpi._id] = kpi?.type?.name;
        return acc;
      }, {});

      // Get the KPI labels (names) from the kpiNameMap
      labels = Object.keys(kpiNameMap).map(kpiId => kpiNameMap[kpiId]);

      // Iterate through kpiOfEmployees to structure the data
      Object.keys(kpiOfEmployees).forEach((employeeId) => {
        const employeeData = kpiOfEmployees[employeeId];
        const dataEntry = {
          label: employeeNameMap[employeeId],
          data: Object.keys(employeeData).map(kpiId => employeeData[kpiId]),
          backgroundColor: '',
          borderColor: '',
          borderWidth: 1
        };
        datasets.push(dataEntry);
      });

      // Generate colors for each employee
      const colors = generateColors(datasets.length);

      // Assign colors to each dataset
      datasets = datasets.map((entry, index) => ({
        ...entry,
        backgroundColor: colors[index],
        borderColor: colors[index].replace('0.4', '1')
      }));
    }

    return { labels, datasets };
  };

  const openModal = (algorithm) => {
    window.$(`#modal-params-${algorithm}`).modal('show')
  }

  const [stepState, setStepState] = useState({
    steps: [
      {
        label: 'Phân bổ nguồn lực',
        active: true
      },
      {
        label: 'Tạo lập công việc và phân công',
        active: false
      },
    ],
    currentStep: 0
  })
  
  const { steps, currentStep } = stepState

  const handleGoToStep = (index, e = undefined) => {
    if (e) e.preventDefault()
    if (index === 0) {
      setStepState({
        ...stepState,
        currentStep: index,
        steps: steps.map((oldStepItem, oldStepIndex) => {
          return {
            ...oldStepItem,
            active: oldStepIndex === index ? true : false
          }
        })
      })
    } else {
      if (!currentProject?._id || !proposals || !proposals?.assignment) {
        return
      }
      setStepState({
        ...stepState,
        currentStep: index,
        steps: steps.map((oldStepItem, oldStepIndex) => {
          return {
            ...oldStepItem,
            active: oldStepIndex === index ? true : oldStepItem.active
          }
        })
      })
    }
  }

  
  const handleCreateTasksAndAssign = () => {
    Swal.fire({
      title: `Bạn có chắc chắn tạo công việc và phân công cho dự án "${currentProject.name}"?`,
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: props.translate('general.no'),
      confirmButtonText: props.translate('general.yes')
    }).then((result) => {
      if (result.value) {
        props.assignForProjectFromProposal(currentProject?._id)
        setIsSuccessAssign(true)
      }
    })
  }

  return (
    <React.Fragment>
      <div className='timeline'>
          <div className='timeline-progress' style={{ width: `${Number((currentStep * 100) / (steps.length - 1))}%` }}></div>
          <div className='timeline-items'>
            {steps.map((item, index) => (
              <div
                className={`timeline-item ${item.active ? 'active' : ''}`}
                key={index} onClick={(e) => handleGoToStep(index, e)}
                disabled={index === 1 && !currentProject?._id || !proposals || !proposals?.assignment}
              >
                <div className='timeline-contain'>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      <div className="box">
        <div className="box-body qlcv h-full">
          {
            currentStep === 0 ? (
              <div>
                <form className="flex flex-wrap py-2 gap-x-10 gap-y-8">
                  {/* <div> */}
                    <div className="min-w-[300px]">
                      <label>
                        {'Chọn dự án'}
                        <span className='text-red'>*</span>
                      </label>
                      <SelectBox
                        id={`proposal-project-id`}
                        className='form-control select'
                        style={{ width: '100%' }}
                        items={projectOptions}
                        options={{
                          placeholder: "--- Chọn dự án ---"
                        }}
                        value={currentProject?._id}
                        onChange={handleChangeCurrentProject}
                      />
                    </div>
                    <div className="min-w-[300px]">
                      <label>
                        {'Chiến lược phân bổ'}
                        <span className='text-red'>*</span>
                        <span>
                          <a 
                            className="inline-block cursor-pointer ml-2" 
                            onClick={() => openModal(algorithm)}
                            aria-haspopup="true"
                            aria-expanded="true"
                          > Xem thông tin và cấu hình tham số
                          </a>
                        </span>
                      </label>
                      <SelectBox
                        id={`proposal-project-algorithm-id`}
                        className='form-control select'
                        style={{ width: '100%' }}
                        items={proposalAlgorithmItems}
                        options={{
                          placeholder: "--- Chọn chiến lược ---"
                        }}
                        value={algorithm}
                        onChange={handleChangeAlgorithm}
                      />
                    </div>
                  <div className="flex items-end">
                    <button
                      type='button'
                      className='btn btn-success dropdown-toggle pull-right'
                      onClick={handleProposalForProject}
                      data-toggle='dropdown'
                      aria-expanded='true'
                      title={(currentProject?.status !== 'proposal' && currentProject?.status !== 'wait_for_approval') ? "Đã phân công, không thể thực hiện phân bổ nữa" : "Phân bổ"}
                      disabled={!isValidateSubmit() || (currentProject?.status !== 'proposal' && currentProject?.status !== 'wait_for_approval')}
                    >
                      {"Phân bổ"}
                    </button>
                  </div>
                  {/* </div> */}
                </form>
                <div>
                  {currentProject && currentProject?._id && (
                    <div>
                      <a 
                        className="inline-block mt-8 cursor-pointer ml-2" 
                        onClick={() => setIsShowPreviewProject((prev) => !prev)}
                        aria-haspopup="true"
                        aria-expanded="true"
                      >
                        <div className="flex items-center">
                          <span>{isShowPreviewProject ? 'Ẩn thông tin dự án' : 'Xem thông tin dự án'}</span>
                          {isShowPreviewProject ? (
                            <svg
                              className="-mr-1 ml-2 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 12.707a1 1 0 001.414 0L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="-mr-1 ml-2 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </a> 
                      {isShowPreviewProject && 
                        <div>
                          <ProjectCreateEditForm 
                            actionType={PROJECT_ACTION_FORM.EDIT}
                            projectEdit={currentProject}
                            projectEditId={currentProject?._id}
                            submitFunction={props.editProjectDispatch}
                          />
                        </div>
                      }
                      <AlgorithmModal algorithm={algorithm} algorithmParams={algorithmParams} setAlgorithmParams={setAlgorithmParams} />
                    </div>
                  )}
                
                </div>
                {proposals && proposals?.assignment?.length && 
                  <a 
                    className="inline-block mt-8 cursor-pointer ml-2" 
                    onClick={() => setIsShowPrevProposal((prev) => !prev)}
                    aria-haspopup="true"
                    aria-expanded="true"
                  >
                    <div className="flex items-center">
                      <span>{isShowPrevProposal ? 'Ẩn thông tin phân bổ' : 'Xem thông tin phân bổ'}</span>
                      {isShowPrevProposal ? (
                        <svg
                          className="-mr-1 ml-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 12.707a1 1 0 001.414 0L10 9.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="-mr-1 ml-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </a> 
                }
                {isLoading && (
                  <div className="min-height-96 flex justify-center mt-8">
                    <span className="pr-2">Đang thực hiện phân bổ ...</span>
                    <div className="mt-[1.5px]">
                      <Loading />
                    </div>
                  </div>
                )}
                {!isLoading && isShowPrevProposal && proposals && proposals?.assignment && proposals?.assignment?.length && (
                  <div className="mt-8">
                    {/* <div>
                      {currentProject?.proposals?.distanceWithKPIEmployeesTarget}
                    </div> */}
                    <div className="box">
                      <div className="box-body">
                        <label className="text-3xl">
                          Thông tin phân bổ nguồn lực dự án
                        </label>
      
                      {/* {currentProject && !currentProject?.proposals && <>Chưa có thông tin phân bổ</>}
                      {currentProject && currentProject?.proposals && currentProject?.proposals?.assignment && <>Đã có thông tin phân bổ</>} */}
                        <div className='qlcv StyleScrollDiv StyleScrollDiv-y mt-4' style={{ maxHeight: '500px' }}>
                          <TreeTable
                            behaviour='show-children'
                            tableId={`table-proposal-project-${currentProject?._id}`}
                            column={column}
                            actions={false}
                            data={convertAssignmentToTableData(proposals?.assignment)}
                          />
                        </div>
                      </div>
                    </div>
      
                    <div className="box">
                      <div className="box-body mt-10">
                        <label className="text-3xl">Kết quả phân bổ</label>
                        <div className="w-full flex flex-wrap">
                          <div className="w-full lg:w-[35%]">
                            {/* Nội dung bổ sung tại đây */}
                            <div className="p-8">
                              <div>
                                <label className="text-blue-600">Tên dự án: </label>
                                <span> {currentProject?.name}</span>
                              </div>
      
                              <div>
                                <label className="text-blue-600">Thời gian bắt đầu: </label>
                                <span>{` ${dayjs(currentProject?.startDate).format('HH:mm A DD/MM/YYYY')}`}</span>
                              </div>
      
                              <div>
                                <label className="text-blue-600">Thời gian kết thúc (Theo phân bổ): </label>
                                <span>{` ${dayjs(getLastestEndTime(proposals?.assignment)).format('HH:mm A DD/MM/YYYY')}`}</span>
                              </div>
      
                              <div>
                                <label className="text-blue-600">Chi phí dự tính: </label>
                                <span>{` ${currentProject?.unitCost === 'VND' ? formatCurrencyVND(proposals?.totalCost) : formatCurrencyUSD(proposals?.totalCost)}`}</span>
                              </div>
      
                              <div>
                                <label className="text-blue-600">Số chỉ tiêu KPI đạt: </label>
                                <span className="text-green-600">{` ${getNumberOfKpiWillReachTarget(currentProject?.kpiTarget, proposals?.kpiAssignment)}`}</span>
                                <span>/</span>
                                <span className="text-red-500">{`${currentProject?.kpiTarget?.length}`}</span>
                              </div>
                            </div>
                          </div>
                          <div className="w-full lg:w-[65%] bg-gray-100 content-box">
                            <KpiBarChart kpiTarget={currentProject?.kpiTarget} kpiAssignment={proposals?.kpiAssignment} />
                          </div>
                        </div>
                        <div className="text-center py-4 font-semibold">KPI cho nhân viên</div>
                        <div className="flex justify-center">
                          <KPIEmployees data={converDataKPIOfEmployees(currentProject, proposals?.kpiOfEmployees)} />
                        </div>
                      </div>
                    </div>
      
                    <div className="box">
                      <div className="box-body mt-10">
                        <label className="text-3xl">Lịch thực hiện</label>
                        <button
                          type='button'
                          className='btn btn-success dropdown-toggle mx-6'
                          onClick={() => setIsShowSchedule(true)}
                          data-toggle='dropdown'
                          aria-expanded='true'
                          title={"Lập lịch thực hiện công việc"}
                          disabled={isLoading || !proposals || !isShowPrevProposal}
                          // disabled={!isValidateSubmit()}
                        >
                          {"Lập lịch thực hiện công việc"}
                        </button>
      
                        
                        {isShowShedule && proposals?.assignment && (
                          <>
                            <div className="flex w-full justify-between mt-8">
                              <SelectBox 
                                id={`schedule-project-${scheduleType}-${currentProject?._id}`}
                                items={scheduleOptions}
                                style={{ padding: 20 }}
                                value={scheduleType}
                                onChange={(e) => setScheduleType(e[0])}
                              />
                            </div>
                            {
                              renderSchedule(scheduleType, proposals)
                            }
                          </>
                        )
                        }
                      </div>
                    </div>
      
                  </div>
                )}
              </div>
            ) : (
              <div>
                {proposals && proposals?.assignment && proposals?.assignment?.length && (
                  <div className="mt-8">
                    <div className="py-3">
                      <button
                        type='button'
                        className='btn btn-success'
                        onClick={handleCreateTasksAndAssign}
                        data-toggle='dropdown'
                        aria-expanded='true'
                        title={"Tạo lập công việc và phân công"}
                        disabled={isSuccessAssign || isLoading || !proposals || !proposals?.assignment || !proposals?.assignment?.length || (currentProject?.status !== 'proposal' && currentProject?.status !== 'wait_for_approval')}
                      >
                        {"Tạo lập công việc và phân công"}
                      </button>
                      
                      {(isSuccessAssign || (currentProject?.status !== 'proposal' && currentProject?.status !== 'wait_for_approval')) &&
                        <div class="italic p-2">
                          Đã thực hiện phân công 
                          <span class="text-green-500">✔</span>
                        </div>
                      }
                      {isAssignProposalLoading &&
                        <div className="min-height-96 flex justify-center mt-8">
                          <span className="pr-2">Đang thực hiện phân công ...</span>
                          <div className="mt-[1.5px]">
                            <Loading />
                          </div>
                        </div> 
                      }
                    </div>
                    
                    <div className="box">
                      <div className="box-body">
                        <label className="text-3xl">
                          Thông tin phân bổ nguồn lực dự án
                        </label>
      
                      {/* {currentProject && !currentProject?.proposals && <>Chưa có thông tin phân bổ</>}
                      {currentProject && currentProject?.proposals && currentProject?.proposals?.assignment && <>Đã có thông tin phân bổ</>} */}
                        <div className='qlcv StyleScrollDiv StyleScrollDiv-y mt-4' style={{ maxHeight: '500px' }}>
                          <TreeTable
                            behaviour='show-children'
                            tableId={`table-proposal-project-${currentProject?._id}`}
                            column={column}
                            actions={false}
                            data={convertAssignmentToTableData(proposals?.assignment)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { project, user, projectProposal } = state
  return { project, user, projectProposal }
}

const actions = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  proposalForProjectDispatch: ProjectProposalActions.proposalForProjectDispatch,
  editProjectDispatch: ProjectActions.editProjectDispatch,
  assignForProjectFromProposal: ProjectProposalActions.assignProjectFromProposalDataDispatch
}

export default connect(mapState, actions)(withTranslate(ProjectProposalPage))
