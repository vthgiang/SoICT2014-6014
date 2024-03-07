const { connect } = require(`../helpers/dbHelper`);
const Delegation = require("@/models/delegation.model");

const checkDelegationCreate = async (portal, delegationName) => {
  return await Delegation(connect(DB_CONNECTION, portal))
    .findOne({ delegationName: delegationName })
    .collation({
      locale: "vi",
      strength: 2,
      alternate: "shifted",
      maxVariable: "space",
    });
};

const checkDelegationExist = async (portal, delegator, delegateRole) => {
  return await Delegation(connect(DB_CONNECTION, portal)).find({
    delegator: delegator,
    delegateType: "Role",
    delegateRole: delegateRole,
    status: {
      $in: [
        "activated", // Đang hoạt động
        "pending", // Chờ xác nhận
      ],
    },
  });
};

const newDelegation = async (
  portal,
  delegationName,
  description,
  delegator,
  delegatee,
  delegateRole,
  allPrivileges,
  delegatePrivileges,
  delegationStart,
  delegationEnd,
  delegatePolicy,
  logs
) => {
  return await Delegation(connect(DB_CONNECTION, portal)).create({
    delegationName: delegationName,
    description: description,
    delegator: delegator,
    delegatee: delegatee,
    delegateType: "Role",
    delegateRole: delegateRole,
    allPrivileges: allPrivileges,
    delegatePrivileges:
      delegatePrivileges != null ? delegatePrivileges.map((p) => p._id) : null,
    startDate: delegationStart,
    endDate: delegationEnd,
    status: isToday(new Date(delegationStart)) ? "activated" : "pending",
    delegatePolicy: delegatePolicy,
    logs: logs,
  });
};

const delegationFindById = async (portal, _id) => {
  return await Delegation(connect(DB_CONNECTION, portal))
    .findById({ _id })
    .populate([
      { path: "delegateRole", select: "_id name" },
      { path: "delegateTask" },
      { path: "delegatee", select: "_id name" },
      { path: "delegatePolicy", select: "_id policyName" },
      { path: "delegator", select: "_id name company" },
      {
        path: "delegatePrivileges",
        select: "_id resourceId resourceType",
        populate: {
          path: "resourceId",
          select: "_id url category description",
        },
      },
    ]);
};

const allDelegations = async (portal) => {
  return await Delegation(connect(DB_CONNECTION, portal)).find({
    status: { $in: ["pending", "activated"] },
  });
};

const updatedDelegation = async (
  portal,
  _id,
  logs,
  delegationName,
  endDate
) => {
  return await Delegation(connect(DB_CONNECTION, portal)).updateOne(
    //Repo
    { _id: _id },
    {
      logs: [
        ...logs,
        {
          createdAt: new Date(),
          user: null,
          content: delegationName,
          time: new Date(endDate),
          category: "revoke",
        },
      ],
    }
  );
};

const totalListDelegation = async (portal, keySearch) => {
  return await Delegation(connect(DB_CONNECTION, portal)).countDocuments(
    keySearch
  );
};

const delegations = async (portal, keySearch, page, perPage) => {
  return await Delegation(connect(DB_CONNECTION, portal)) //Repo
    .find(keySearch)
    .populate([
      { path: "delegateRole", select: "_id name" },
      {
        path: "delegateTask",
        select: "_id name taskActions logs timesheetLogs",
        populate: [
          { path: "taskActions.creator", select: "name email avatar" },
          {
            path: "taskActions.evaluations.creator",
            select: "name email avatar ",
          },
          {
            path: "taskActions.timesheetLogs.creator",
            select: "_id name email avatar",
          },
          { path: "timesheetLogs.creator", select: "name avatar _id email" },
          { path: "logs.creator", select: "_id name avatar email " },
        ],
      },
      { path: "delegatee", select: "_id name" },
      { path: "delegatePolicy", select: "_id policyName" },
      { path: "delegator", select: "_id name company" },
      {
        path: "delegatePrivileges",
        select: "_id resourceId resourceType",
        populate: {
          path: "resourceId",
          select: "_id url category description",
        },
      },
    ])
    .skip((page - 1) * perPage)
    .limit(perPage);
};

const delegationCollection = async (portal, keySearch, page, perPage) => {
  return await Delegation(connect(DB_CONNECTION, portal))
    .find(keySearch, { delegationName: 1 })
    .skip((page - 1) * perPage)
    .limit(perPage);
};

const getDelegationById = async (portal, id) => {
  return await Delegation(connect(DB_CONNECTION, portal)) //Repo
    .findById({ _id: id })
    .populate([
      { path: "delegateRole", select: "_id name" },
      {
        path: "delegateTask",
        select: "_id name taskActions logs timesheetLogs",
        populate: [
          { path: "taskActions.creator", select: "name email avatar" },
          {
            path: "taskActions.evaluations.creator",
            select: "name email avatar ",
          },
          {
            path: "taskActions.timesheetLogs.creator",
            select: "_id name email avatar",
          },
          { path: "timesheetLogs.creator", select: "name avatar _id email" },
          { path: "logs.creator", select: "_id name avatar email " },
        ],
      },
      { path: "delegatee", select: "_id name" },
      { path: "delegatePolicy", select: "_id policyName" },
      { path: "delegator", select: "_id name company" },
      {
        path: "delegatePrivileges",
        select: "_id resourceId resourceType",
        populate: {
          path: "resourceId",
          select: "_id url category description",
        },
      },
    ]);
};

const deleteDelegations = async (portal, delegationIds) => {
  return await Delegation(connect(DB_CONNECTION, portal)).deleteMany({
    _id: { $in: delegationIds.map((item) => mongoose.Types.ObjectId(item)) },
  });
};

const newRevokeDelegation = async (portal, delegationIds) => {
  return await Delegation(connect(DB_CONNECTION, portal)) //Repo
    .findOne({ _id: delegationIds })
    .populate([
      { path: "delegateRole", select: "_id name" },
      { path: "delegateTask" },
      { path: "delegatee", select: "_id name" },
      { path: "delegatePolicy", select: "_id policyName" },
      { path: "delegator", select: "_id name company" },
      {
        path: "delegatePrivileges",
        select: "_id resourceId resourceType",
        populate: {
          path: "resourceId",
          select: "_id url category description",
        },
      },
    ]);
};

const rejectDelegation = async (portal, delegationId) => {
  return await Delegation(connect(DB_CONNECTION, portal)).findOne({
    _id: delegationId,
  });
};

const newConfirmDelegation = async (portal, delegationId) => {
  return await Delegation(connect(DB_CONNECTION, portal))
    .findOne({ _id: delegationId })
    .populate([
      { path: "delegateRole", select: "_id name" },
      {
        path: "delegateTask",
        select: "_id name taskActions logs timesheetLogs",
        populate: [
          { path: "taskActions.creator", select: "name email avatar" },
          {
            path: "taskActions.evaluations.creator",
            select: "name email avatar ",
          },
          {
            path: "taskActions.timesheetLogs.creator",
            select: "_id name email avatar",
          },
          { path: "timesheetLogs.creator", select: "name avatar _id email" },
          { path: "logs.creator", select: "_id name avatar email " },
        ],
      },
      { path: "delegatee", select: "_id name" },
      { path: "delegatePolicy", select: "_id policyName" },
      { path: "delegator", select: "_id name company" },
      {
        path: "delegatePrivileges",
        select: "_id resourceId resourceType",
        populate: {
          path: "resourceId",
          select: "_id url category description",
        },
      },
    ]);
};

const saveLogDelegation = async (
  portal,
  delegationId,
  delegationLogs,
  userId,
  content,
  time,
  category
) => {
  return await Delegation(connect(DB_CONNECTION, portal)).updateOne(
    //Repo
    { _id: delegationId },
    {
      logs: [
        ...delegationLogs,
        {
          createdAt: new Date(),
          user: userId,
          content: content,
          time: new Date(time),
          category: category,
        },
      ],
    }
  );
};

const checkDelegationExistValid = async (portal, delegator, delegateTask) => {
  return await Delegation(
    //Repo
    connect(DB_CONNECTION, portal)
  ).find({
    delegator: delegator,
    // delegatee: delArray[i].delegatee,
    delegateType: "Task",
    delegateTask: delegateTask,
    status: {
      $in: [
        "activated", // Đang hoạt động
        "pending", // Chờ xác nhận
      ],
    },
  });
};

const delegationTaskFindById = async (portal, newDelegation) => {
  return await Delegation(connect(DB_CONNECTION, portal)) //Repo
    .findById({ _id: newDelegation })
    .populate([
      {
        path: "delegateTask",
        select: "_id name taskActions logs timesheetLogs",
        populate: [
          { path: "taskActions.creator", select: "name email avatar" },
          {
            path: "taskActions.evaluations.creator",
            select: "name email avatar ",
          },
          {
            path: "taskActions.timesheetLogs.creator",
            select: "_id name email avatar",
          },
          { path: "timesheetLogs.creator", select: "name avatar _id email" },
          { path: "logs.creator", select: "_id name avatar email " },
        ],
      },
      { path: "delegatee", select: "_id name" },
      { path: "delegatePolicy", select: "_id policyName" },
      { path: "delegator", select: "_id name company" },
    ]);
};

const assignTaskDelegation = async (
  portal,
  delegationId,
  delegatorHasInformed
) => {
  return await Delegation(connect(DB_CONNECTION, portal)).updateOne(
    //Repo
    { _id: delegationId },
    {
      delegatorHasInformed: delegatorHasInformed,
      status: "activated",
    }
  );
};

const revokeTaskDelegation = async (portal, delegationIds) => {
  return await Delegation(connect(DB_CONNECTION, portal)).find({
    _id: { $in: delegationIds.map((item) => mongoose.Types.ObjectId(item)) },
  });
};

const revokeNewDelegation = async (portal, delegationIds) => {
  return await Delegation(connect(DB_CONNECTION, portal)) //Repo
    .findOne({ _id: delegationIds[0] })
    .populate([
      {
        path: "delegateTask",
        select: "_id name taskActions logs timesheetLogs",
        populate: [
          { path: "taskActions.creator", select: "name email avatar" },
          {
            path: "taskActions.evaluations.creator",
            select: "name email avatar ",
          },
          {
            path: "taskActions.timesheetLogs.creator",
            select: "_id name email avatar",
          },
          { path: "timesheetLogs.creator", select: "name avatar _id email" },
          { path: "logs.creator", select: "_id name avatar email " },
        ],
      },
      { path: "delegatee", select: "_id name" },
      { path: "delegatePolicy", select: "_id policyName" },
      { path: "delegator", select: "_id name company" },
    ]);
};

const delegationDeleteTask = async (portal, taskId) => {
  return await Delegation(connect(DB_CONNECTION, portal)).deleteMany({
    delegateTask: taskId,
  });
};

const checkDelegationRole = async (portal, users, roles) => {
  return await Delegation(connect(DB_CONNECTION, portal)) //Repo
    .find({
      delegator: { $nin: users },
      delegateRole: roles,
      status: { $in: ["pending", "activated"] },
    })
    .populate([
      { path: "delegateRole", select: "_id name" },
      {
        path: "delegateTask",
        select: "_id name taskActions logs timesheetLogs",
        populate: [
          { path: "taskActions.creator", select: "name email avatar" },
          {
            path: "taskActions.evaluations.creator",
            select: "name email avatar ",
          },
          {
            path: "taskActions.timesheetLogs.creator",
            select: "_id name email avatar",
          },
          { path: "timesheetLogs.creator", select: "name avatar _id email" },
          { path: "logs.creator", select: "_id name avatar email " },
        ],
      },
      { path: "delegatee", select: "_id name" },
      { path: "delegatePolicy", select: "_id policyName" },
      { path: "delegator", select: "_id name company" },
      {
        path: "delegatePrivileges",
        select: "_id resourceId resourceType",
        populate: {
          path: "resourceId",
          select: "_id url category description",
        },
      },
    ]);
};
module.exports = {
  checkDelegationCreate,
  checkDelegationExist,
  newDelegation,
  delegationFindById,
  allDelegations,
  updatedDelegation,
  totalListDelegation,
  delegations,
  delegationCollection,
  getDelegationById,
  deleteDelegations,
  newRevokeDelegation,
  rejectDelegation,
  newConfirmDelegation,
  saveLogDelegation,
  checkDelegationExistValid,
  delegationTaskFindById,
  assignTaskDelegation,
  revokeTaskDelegation,
  revokeNewDelegation,
  delegationDeleteTask,
  checkDelegationRole,
};
