export const taskManagementConstants = {
  GETALL_TASK_REQUEST: 'GETALL_TASK_REQUEST',
  GETALL_TASK_SUCCESS: 'GETALL_TASK_SUCCESS',
  GETALL_TASK_FAILURE: 'GETALL_TASK_FAILURE',

  GETTASK_BYID_REQUEST: 'GETTASK_BYID_REQUEST',
  GETTASK_BYID_SUCCESS: 'GETTASK_BYID_SUCCESS',
  GETTASK_BYID_FAILURE: 'GETTASK_BYID_FAILURE',

  GETTASK_BYROLE_REQUEST: 'GETTASK_BYROLE_REQUEST',
  GETTASK_BYROLE_SUCCESS: 'GETTASK_BYROLE_SUCCESS',
  GETTASK_BYROLE_FAILURE: 'GETTASK_BYROLE_FAILURE',

  GETTASK_RESPONSIBLE_BYUSER_REQUEST: 'GETTASK_RESPONSIBLE_BYUSER_REQUEST',
  GETTASK_RESPONSIBLE_BYUSER_SUCCESS: 'GETTASK_RESPONSIBLE_BYUSER_SUCCESS',
  GETTASK_RESPONSIBLE_BYUSER_FAILURE: 'GETTASK_RESPONSIBLE_BYUSER_FAILURE',

  GETTASK_ACCOUNTABLE_BYUSER_REQUEST: 'GETTASK_ACCOUNTABLE_BYUSER_REQUEST',
  GETTASK_ACCOUNTABLE_BYUSER_SUCCESS: 'GETTASK_ACCOUNTABLE_BYUSER_SUCCESS',
  GETTASK_ACCOUNTABLE_BYUSER_FAILURE: 'GETTASK_ACCOUNTABLE_BYUSER_FAILURE',

  GETTASK_CONSULTED_BYUSER_REQUEST: 'GETTASK_CONSULTED_BYUSER_REQUEST',
  GETTASK_CONSULTED_BYUSER_SUCCESS: 'GETTASK_CONSULTED_BYUSER_SUCCESS',
  GETTASK_CONSULTED_BYUSER_FAILURE: 'GETTASK_CONSULTED_BYUSER_FAILURE',

  GETTASK_INFORMED_BYUSER_REQUEST: 'GETTASK_INFORMED_BYUSER_REQUEST',
  GETTASK_INFORMED_BYUSER_SUCCESS: 'GETTASK_INFORMED_BYUSER_SUCCESS',
  GETTASK_INFORMED_BYUSER_FAILURE: 'GETTASK_INFORMED_BYUSER_FAILURE',

  GETTASK_CREATOR_BYUSER_REQUEST: 'GETTASK_CREATOR_BYUSER_REQUEST',
  GETTASK_CREATOR_BYUSER_SUCCESS: 'GETTASK_CREATOR_BYUSER_SUCCESS',
  GETTASK_CREATOR_BYUSER_FAILURE: 'GETTASK_CREATOR_BYUSER_FAILURE',

  GET_TASK_HAS_EVALUATION_REQUEST: 'GET_TASK_HAS_EVALUATION_REQUEST',
  GET_TASK_HAS_EVALUATION_SUCCESS: 'GET_TASK_HAS_EVALUATION_SUCCESS',
  GET_TASK_HAS_EVALUATION_FAILURE: 'GET_TASK_HAS_EVALUATION_FAILURE',

  GET_PAGINATE_TASK_BYUSER_REQUEST: 'GET_PAGINATE_TASK_BYUSER_REQUEST',
  GET_PAGINATE_TASK_BYUSER_SUCCESS: 'GET_PAGINATE_TASK_BYUSER_SUCCESS',
  GET_PAGINATE_TASK_BYUSER_FAILURE: 'GET_PAGINATE_TASK_BYUSER_FAILURE',

  GET_PAGINATE_TASK_REQUEST: 'GET_PAGINATE_TASK_REQUEST',
  GET_PAGINATE_TASK_SUCCESS: 'GET_PAGINATE_TASK_SUCCESS',
  GET_PAGINATE_TASK_FAILURE: 'GET_PAGINATE_TASK_FAILURE',

  GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_REQUEST: 'GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_REQUEST',
  GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_SUCCESS: 'GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_SUCCESS',
  GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_FAILURE: 'GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_FALIURE',

  ADDNEW_TASK_REQUEST: 'ADD_TASK_REQUEST',
  ADDNEW_TASK_SUCCESS: 'ADD_TASK_SUCCESS',
  ADDNEW_TASK_FAILURE: 'ADD_TASK_FAILURE',

  EDIT_TASK_REQUEST: 'EDIT_TASK_REQUEST',
  EDIT_TASK_SUCCESS: 'EDIT_TASK_SUCCESS',
  EDIT_TASK_FAILURE: 'EDIT_TASK_FAILURE',

  EDIT_ARCHIVED_STATUS_OF_TASK_REQUEST: 'EDIT_ARCHIVED_STATUS_OF_TASK_REQUEST',
  EDIT_ARCHIVED_STATUS_OF_TASK_SUCCESS: 'EDIT_ARCHIVED_STATUS_OF_TASK_SUCCESS',
  EDIT_ARCHIVED_STATUS_OF_TASK_FAILURE: 'EDIT_ARCHIVED_STATUS_OF_TASK_FAILURE',

  DELETE_TASK_REQUEST: 'DELETE_TASK_REQUEST',
  DELETE_TASK_SUCCESS: 'DELETE_TASK_SUCCESS',
  DELETE_TASK_FAILURE: 'DELETE_TASK_FAILURE',

  GET_SUBTASK_REQUEST: 'GET_SUBTASK_REQUEST',
  GET_SUBTASK_SUCCESS: 'GET_SUBTASK_SUCCESS',
  GET_SUBTASK_FAILURE: 'GET_SUBTASK_FAILURE',
  EDIT_TASK_BY_RESPONSIBLE_REQUEST: 'EDIT_TASK_BY_RESPONSIBLE_REQUEST',
  EDIT_TASK_BY_RESPONSIBLE_SUCCESS: 'EDIT_TASK_BY_RESPONSIBLE_SUCCESS',
  EDIT_TASK_BY_RESPONSIBLE_FAILURE: 'EDIT_TASK_BY_RESPONSIBLE_FAILURE',

  EDIT_TASK_BY_ACCOUNTABLE_REQUEST: 'EDIT_TASK_BY_ACCOUNTABLE_REQUEST',
  EDIT_TASK_BY_ACCOUNTABLE_SUCCESS: 'EDIT_TASK_BY_ACCOUNTABLE_SUCCESS',
  EDIT_TASK_BY_ACCOUNTABLE_FAILURE: 'EDIT_TASK_BY_ACCOUNTABLE_FAILURE',

  EVALUATE_TASK_BY_RESPONSIBLE_REQUEST: 'EVALUATE_TASK_BY_RESPONSIBLE_REQUEST',
  EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS: 'EVALUATE_TASK_BY_RESPONSIBLE_SUCCESS',
  EVALUATE_TASK_BY_RESPONSIBLE_FAILURE: 'EVALUATE_TASK_BY_RESPONSIBLE_FAILURE',

  EVALUATE_TASK_BY_CONSULTED_REQUEST: 'EVALUATE_TASK_BY_CONSULTED_REQUEST',
  EVALUATE_TASK_BY_CONSULTED_SUCCESS: 'EVALUATE_TASK_BY_CONSULTED_SUCCESS',
  EVALUATE_TASK_BY_CONSULTED_FAILURE: 'EVALUATE_TASK_BY_CONSULTED_FAILURE',

  EVALUATE_TASK_BY_ACCOUNTABLE_REQUEST: 'EVALUATE_TASK_BY_ACCOUNTABLE_REQUEST',
  EVALUATE_TASK_BY_ACCOUNTABLE_SUCCESS: 'EVALUATE_TASK_BY_ACCOUNTABLE_SUCCESS',
  EVALUATE_TASK_BY_ACCOUNTABLE_FAILURE: 'EVALUATE_TASK_BY_ACCOUNTABLE_FAILURE',

  GET_TASK_BY_USER_REQUEST: 'GET_TASK_BY_USER_REQUEST',
  GET_TASK_BY_USER_SUCCESS: 'GET_TASK_BY_USER_SUCCESS',
  GET_TASK_BY_USER_FAILURE: 'GET_TASK_BY_USER_FAILURE',

  GET_TASK_EVALUATION_REQUEST: 'GET_TASK_EVALUATION_REQUEST',
  GET_TASK_EVALUATION_SUCCESS: 'GET_TASK_EVALUATION_SUCCESS',
  GET_TASK_EVALUATION_FAILURE: 'GET_TASK_EVALUATION_FAILURE',

  GET_TASK_IN_ORGANIZATION_UNIT_REQUEST: 'GET_TASK_IN_ORGANIZATION_UNIT_REQUEST',
  GET_TASK_IN_ORGANIZATION_UNIT_SUCCESS: 'GET_TASK_IN_ORGANIZATION_UNIT_SUCCESS',
  GET_TASK_IN_ORGANIZATION_UNIT_FAILURE: 'GET_TASK_IN_ORGANIZATION_UNIT_FAILURE',

  GET_TASK_ANALYS_OF_USER_REQUEST: 'GET_TASK_ANALYS_OF_USER_REQUEST',
  GET_TASK_ANALYS_OF_USER_SUCCESS: 'GET_TASK_ANALYS_OF_USER_SUCCESS',
  GET_TASK_ANALYS_OF_USER_FAILE: 'GET_TASK_ANALYS_OF_USER_FAILE',

  GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_REQUEST: 'GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_REQUEST',
  GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_SUCCESS: 'GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_SUCCESS',
  GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_FAILURE: 'GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_FAILURE',

  GET_TIME_SHEET_OF_USER_REQUEST: 'GET_TIME_SHEET_OF_USER_REQUEST',
  GET_TIME_SHEET_OF_USER_SUCCESS: 'GET_TIME_SHEET_OF_USER_SUCCESS',
  GET_TIME_SHEET_OF_USER_FAILE: 'GET_TIME_SHEET_OF_USER_FAILE',

  GET_USER_TIME_SHEET_LOG_REQUEST: 'GET_USER_TIME_SHEET_LOG_REQUEST',
  GET_USER_TIME_SHEET_LOG_SUCCESS: 'GET_USER_TIME_SHEET_LOG_SUCCESS',
  GET_USER_TIME_SHEET_LOG_FAILURE: 'GET_USER_TIME_SHEET_LOG_FAILURE',

  GET_ALL_USER_TIME_SHEET_LOG_REQUEST: 'GET_ALL_USER_TIME_SHEET_LOG_REQUEST',
  GET_ALL_USER_TIME_SHEET_LOG_SUCCESS: 'GET_ALL_USER_TIME_SHEET_LOG_SUCCESS',
  GET_ALL_USER_TIME_SHEET_LOG_FAILE: 'GET_ALL_USER_TIME_SHEET_LOG_FAILE',

  UPDATE_TASK_SUCCESS: 'UPDATE_TASK_SUCCESS',

  GETTASK_BYPROJECT_REQUEST: 'GETTASK_BYPROJECT_REQUEST',
  GETTASK_BYPROJECT_SUCCESS: 'GETTASK_BYPROJECT_SUCCESS',
  GETTASK_BYPROJECT_FAILURE: 'GETTASK_BYPROJECT_FAILURE',

  GETTASK_BYPROJECT_PAGINATE_REQUEST: 'GETTASK_BYPROJECT_PAGINATE_REQUEST',
  GETTASK_BYPROJECT_PAGINATE_SUCCESS: 'GETTASK_BYPROJECT_PAGINATE_SUCCESS',
  GETTASK_BYPROJECT_PAGINATE_FAILURE: 'GETTASK_BYPROJECT_PAGINATE_FAILURE',

  IMPORT_TASKS_REQUEST: 'IMPORT_TASKS_REQUEST',
  IMPORT_TASKS_SUCCESS: 'IMPORT_TASKS_SUCCESS',
  IMPORT_TASKS_FAILURE: 'IMPORT_TASKS_FAILURE',

  GET_ORGANIZATION_TASK_DASHBOARD_CHART_REQUEST: 'GET_ORGANIZATION_TASK_DASHBOARD_CHART_REQUEST',
  GET_ORGANIZATION_TASK_DASHBOARD_CHART_SUCCESS: 'GET_ORGANIZATION_TASK_DASHBOARD_CHART_SUCCESS',
  GET_ORGANIZATION_TASK_DASHBOARD_CHART_FAILURE: 'GET_ORGANIZATION_TASK_DASHBOARD_CHART_FAILURE',

  SAVE_TASK_ATTRIBUTES_REQUEST: 'SAVE_TASK_ATTRIBUTES_REQUEST',
  SAVE_TASK_ATTRIBUTES_SUCCESS: 'SAVE_TASK_ATTRIBUTES_SUCCESS',
  SAVE_TASK_ATTRIBUTES_FAILURE: 'SAVE_TASK_ATTRIBUTES_FAILURE',

  ADD_TASK_DELEGATION_REQUEST: 'ADD_TASK_DELEGATION_REQUEST',
  ADD_TASK_DELEGATION_SUCCESS: 'ADD_TASK_DELEGATION_SUCCESS',
  ADD_TASK_DELEGATION_FAILURE: 'ADD_TASK_DELEGATION_FAILURE',

  DELETE_TASK_DELEGATION_REQUEST: 'DELETE_TASK_DELEGATION_REQUEST',
  DELETE_TASK_DELEGATION_SUCCESS: 'DELETE_TASK_DELEGATION_SUCCESS',
  DELETE_TASK_DELEGATION_FAILURE: 'DELETE_TASK_DELEGATION_FAILURE',

  REVOKE_TASK_DELEGATION_REQUEST: 'REVOKE_TASK_DELEGATION_REQUEST',
  REVOKE_TASK_DELEGATION_SUCCESS: 'REVOKE_TASK_DELEGATION_SUCCESS',
  REVOKE_TASK_DELEGATION_FAILURE: 'REVOKE_TASK_DELEGATION_FAILURE',

  REJECT_TASK_DELEGATION_REQUEST: 'REJECT_TASK_DELEGATION_REQUEST',
  REJECT_TASK_DELEGATION_SUCCESS: 'REJECT_TASK_DELEGATION_SUCCESS',
  REJECT_TASK_DELEGATION_FAILURE: 'REJECT_TASK_DELEGATION_FAILURE',

  CONFIRM_TASK_DELEGATION_REQUEST: 'CONFIRM_TASK_DELEGATION_REQUEST',
  CONFIRM_TASK_DELEGATION_SUCCESS: 'CONFIRM_TASK_DELEGATION_SUCCESS',
  CONFIRM_TASK_DELEGATION_FAILURE: 'CONFIRM_TASK_DELEGATION_FAILURE',

  EDIT_TASK_DELEGATION_REQUEST: 'EDIT_TASK_DELEGATION_REQUEST',
  EDIT_TASK_DELEGATION_SUCCESS: 'EDIT_TASK_DELEGATION_SUCCESS',
  EDIT_TASK_DELEGATION_FAILURE: 'EDIT_TASK_DELEGATION_FAILURE',

  PROPOSAL_PERSONNEL_REQUEST: 'PROPOSAL_PERSONNEL_REQUEST',
  PROPOSAL_PERSONNEL_SUCCESS: 'PROPOSAL_PERSONNEL_SUCCESS',
  PROPOSAL_PERSONNEL_FAILURE: 'PROPOSAL_PERSONNEL_FAILURE'
}