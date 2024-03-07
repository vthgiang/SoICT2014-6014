const {
  createDelegation,
  getNewlyCreateDelegation,
  autoActivateDelegation,
  autoRevokeDelegation,
  assignDelegation,
  updateMissedDelegation,
  checkDelegationPolicy,
  getDelegations,
  getDelegationsReceive,
  getDelegationsReceiveTask,
  getOnlyDelegationName,
  getDelegationById,
  cancelJobDelegation,
  deleteDelegations,
  revokeDelegation,
  rejectDelegation,
  confirmDelegation,
  saveLog,
  createTaskDelegation,
  getNewlyCreateTaskDelegation,
  editTaskDelegation,
  autoActivateTaskDelegation,
  assignTaskDelegation,
  autoRevokeTaskDelegation,
  revokeTaskDelegation,
  deleteTaskDelegation,
  deleteTaskDelegationWhenTaskIsDeleted,
  handleDelegatorLosesRole,
  sendNotification
} = require("../services")

// Thêm mới một ví dụ
const createDelegation = async (req, res) => {
  try {
    let newDelegation = await createDelegation(req.portal, req.body);

    newDelegation = await saveLog(req.portal, newDelegation, newDelegation.delegator, newDelegation.delegationName, "create", newDelegation.createdAt)
    await sendNotification(req.portal, newDelegation, "create")
    // await Log.info(req.user.email, 'CREATED_NEW_DELEGATION', req.portal);

    res.status(201).json({
      success: true,
      messages: ["add_success"],
      content: newDelegation
    });
  } catch (error) {
    console.log(error)
    // await Log.error(req.user.email, "CREATED_NEW_DELEGATION", req.portal);

    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["add_fail"],
      content: error.message
    })
  }
}

const createTaskDelegation = async (req, res) => {
  try {
    let newDelegation = await createTaskDelegation(req.portal, req.body);

    newDelegation = await saveLog(req.portal, newDelegation, newDelegation.delegator, newDelegation.delegationName, "create", newDelegation.createdAt)
    await sendNotification(req.portal, newDelegation, "create")

    // await Log.info(req.user.email, 'add_task_delegation_success', req.portal);

    res.status(201).json({
      success: true,
      messages: ["add_task_delegation_success"],
      content: newDelegation
    });
  } catch (error) {
    console.log(error)
    // await Log.error(req.user.email, "add_task_delegation_faile", req.portal);

    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["add_task_delegation_faile"],
      content: error.message
    })
  }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
const getDelegations = async (req, res) => {
  try {
    let data = await getDelegations(req.portal, req.query);

    // await Log.info(req.user.email, "GET_ALL_DELEGATIONS", req.portal);

    res.status(200).json({
      success: true,
      messages: ["get_all_delegations_success"],
      content: data
    });
  } catch (error) {
    console.log(error)
    // await Log.error(req.user.email, "GET_ALL_DELEGATIONS", req.portal);

    res.status(400).json({
      success: false,
      messages: ["get_all_delegations_fail"],
      content: error.message
    });
  }
}



const getDelegationsReceive = async (req, res) => {
  try {
    let data = await getDelegationsReceive(req.portal, req.query);

    // await Log.info(req.user.email, "GET_ALL_DELEGATIONS", req.portal);

    res.status(200).json({
      success: true,
      messages: ["get_all_delegations_success"],
      content: data
    });
  } catch (error) {
    console.log(error)
    // await Log.error(req.user.email, "GET_ALL_DELEGATIONS", req.portal);

    res.status(400).json({
      success: false,
      messages: ["get_all_delegations_fail"],
      content: error.message
    });
  }
}

const getDelegationsReceiveTask = async (req, res) => {
  try {
    let data = await getDelegationsReceiveTask(req.portal, req.query);

    // await Log.info(req.user.email, "GET_ALL_DELEGATIONS", req.portal);

    res.status(200).json({
      success: true,
      messages: ["get_all_delegations_success"],
      content: data
    });
  } catch (error) {
    console.log(error)
    // await Log.error(req.user.email, "GET_ALL_DELEGATIONS", req.portal);

    res.status(400).json({
      success: false,
      messages: ["get_all_delegations_fail"],
      content: error.message
    });
  }
}

const rejectDelegation = async (req, res) => {
  try {
    let rejectedDelegation = await rejectDelegation(req.portal, req.body.delegationId, req.body.reason);
    rejectedDelegation = await saveLog(req.portal, rejectedDelegation, rejectedDelegation.delegatee, rejectedDelegation.delegationName, "reject", new Date())
    await sendNotification(req.portal, rejectedDelegation, "reject")

    if (rejectedDelegation) {
      // await Log.info(req.user.email, "REJECTED_DELEGATION", req.portal);
      res.status(200).json({
        success: true,
        messages: rejectedDelegation.delegateType == "Role" ? ["reject_success"] : ["reject_task_delegation_success"],
        content: rejectedDelegation
      });
    } else {
      throw Error("Delegation is invalid");
    }
  } catch (error) {
    console.log(error)
    // await Log.error(req.user.email, "REJECTED_DELEGATION", req.portal);
    res.status(400).json({
      success: false,
      messages: rejectedDelegation.delegateType == "Role" ? ["reject_fail"] : ["reject_task_delegation_faile"],
      content: error.message
    });
  }
}

const confirmDelegation = async (req, res) => {
  try {
    let confirmedDelegation = await confirmDelegation(req.portal, req.body.delegationId);
    confirmedDelegation = await saveLog(req.portal, confirmedDelegation, confirmedDelegation.delegatee, confirmedDelegation.delegationName, "confirm", new Date())
    await sendNotification(req.portal, confirmedDelegation, "confirm")

    if (confirmedDelegation) {
      // await Log.info(req.user.email, "CONFIRMED_DELEGATION", req.portal);
      res.status(200).json({
        success: true,
        messages: confirmedDelegation.delegateType == "Role" ? ["confirm_success"] : ["confirm_task_delegation_success"],
        content: confirmedDelegation
      });
    } else {
      throw Error("Delegation is invalid");
    }
  } catch (error) {
    console.log(error)
    // await Log.error(req.user.email, "CONFIRMED_DELEGATION", req.portal);
    res.status(400).json({
      success: false,
      messages: confirmedDelegation.delegateType == "Role" ? ["confirm_fail"] : ["confirm_task_delegation_faile"],
      content: error.message
    });
  }
}

//  Lấy ra Ví dụ theo id
const getDelegationById = async (req, res) => {
  try {
    let { id } = req.params;
    let delegation = await getDelegationById(req.portal, id);
    if (delegation !== -1) {
      // await Log.info(req.user.email, "GET_DELEGATION_BY_ID", req.portal);
      res.status(200).json({
        success: true,
        messages: ["get_delegation_by_id_success"],
        content: delegation
      });
    } else {
      throw Error("delegation is invalid")
    }
  } catch (error) {
    // await Log.error(req.user.email, "GET_DELEGATION_BY_ID", req.portal);

    res.status(400).json({
      success: false,
      messages: ["get_delegation_by_id_fail"],
      content: error.message
    });
  }
}

// Sửa Ví dụ
const editDelegation = async (req, res) => {
  try {
    let { id } = req.params;
    let data = req.body;
    let updatedDelegation = await getNewlyCreateDelegation(id, data, req.portal);
    await sendNotification(req.portal, updatedDelegation, "create")

    if (updatedDelegation !== -1) {
      cancelJobDelegation(id)
      await revokeDelegation(req.portal, [id]);
      await deleteDelegations(req.portal, [id]);
      updatedDelegation = await saveLog(req.portal, updatedDelegation, updatedDelegation.delegator, updatedDelegation.delegationName, "edit", updatedDelegation.createdAt)
      // await Log.info(req.user.email, "UPDATED_DELEGATION", req.portal);
      res.status(200).json({
        success: true,
        messages: ["edit_delegation_success"],
        content: [id, updatedDelegation]
      });
    } else {
      throw Error("Delegation is invalid");
    }

  } catch (error) {
    // await Log.error(req.user.email, "UPDATED_DELEGATION", req.portal);
    console.log(error)
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["edit_delegation_fail"],
      content: error.message
    });
  }
}

const editTaskDelegation = async (req, res) => {
  try {
    let { id } = req.params;
    let data = req.body;
    let updatedDelegation = await getNewlyCreateTaskDelegation(id, data, req.portal);
    await sendNotification(req.portal, updatedDelegation, "create")

    if (updatedDelegation !== -1) {
      cancelJobDelegation(id)
      await revokeTaskDelegation(req.portal, [id]);
      await deleteTaskDelegation(req.portal, [id]);
      updatedDelegation = await saveLog(req.portal, updatedDelegation, updatedDelegation.delegator, updatedDelegation.delegationName, "edit", updatedDelegation.createdAt)
      // await Log.info(req.user.email, "edit_task_delegation_success", req.portal);
      res.status(200).json({
        success: true,
        messages: ["edit_task_delegation_success"],
        content: [id, updatedDelegation]
      });
    } else {
      throw Error("Delegation is invalid");
    }

  } catch (error) {
    // await Log.error(req.user.email, "edit_task_delegation_faile", req.portal);
    console.log(error)
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["edit_task_delegation_faile"],
      content: error.message
    });
  }
}

// Xóa Ví dụ
const deleteDelegations = async (req, res) => {
  try {
    let deletedDelegation = await deleteDelegations(req.portal, req.body.delegationIds);
    if (deletedDelegation) {
      // await Log.info(req.user.email, "DELETED_DELEGATION", req.portal);
      res.status(200).json({
        success: true,
        messages: ["delete_success"],
        content: deletedDelegation
      });
    } else {
      throw Error("Delegation is invalid");
    }
  } catch (error) {
    // await Log.error(req.user.email, "DELETED_DELEGATION", req.portal);
    res.status(400).json({
      success: false,
      messages: ["delete_fail"],
      content: error.message
    });
  }
}

const revokeDelegation = async (req, res) => {
  try {
    let revokedDelegation = await revokeDelegation(req.portal, req.body.delegationIds, req.body.reason);
    revokedDelegation = await saveLog(req.portal, revokedDelegation, revokedDelegation.delegator, revokedDelegation.delegationName, "revoke", revokedDelegation.revokedDate)
    await sendNotification(req.portal, revokedDelegation, "revoke")

    if (revokedDelegation) {
      // await Log.info(req.user.email, "REVOKED_DELEGATION", req.portal);
      res.status(200).json({
        success: true,
        messages: ["revoke_success"],
        content: revokedDelegation
      });
    } else {
      throw Error("Delegation is invalid");
    }
  } catch (error) {
    console.log(error)
    // await Log.error(req.user.email, "REVOKED_DELEGATION", req.portal);
    res.status(400).json({
      success: false,
      messages: ["revoke_fail"],
      content: error.message
    });
  }
}

const deleteTaskDelegations = async (req, res) => {
  try {
    let deletedDelegation = await deleteTaskDelegation(req.portal, req.body.delegationIds);
    if (deletedDelegation) {
      // await Log.info(req.user.email, "delete_task_delegation_success", req.portal);
      res.status(200).json({
        success: true,
        messages: ["delete_task_delegation_success"],
        content: deletedDelegation
      });
    } else {
      throw Error("Delegation is invalid");
    }
  } catch (error) {
    // await Log.error(req.user.email, "delete_task_delegation_faile", req.portal);
    res.status(400).json({
      success: false,
      messages: ["delete_task_delegation_faile"],
      content: error.message
    });
  }
}

const revokeTaskDelegation = async (req, res) => {
  try {
    let revokedDelegation = await revokeTaskDelegation(req.portal, req.body.delegationIds, req.body.reason);
    revokedDelegation = await saveLog(req.portal, revokedDelegation, revokedDelegation.delegator, revokedDelegation.delegationName, "revoke", revokedDelegation.revokedDate)
    await sendNotification(req.portal, revokedDelegation, "revoke")

    if (revokedDelegation) {
      // await Log.info(req.user.email, "revoke_task_delegation_success", req.portal);
      res.status(200).json({
        success: true,
        messages: ["revoke_task_delegation_success"],
        content: revokedDelegation
      });
    } else {
      throw Error("Delegation is invalid");
    }
  } catch (error) {
    console.log(error)
    // await Log.error(req.user.email, "revoke_task_delegation_faile", req.portal);
    res.status(400).json({
      success: false,
      messages: ["revoke_task_delegation_faile"],
      content: error.message
    });
  }
}

// Lấy ra tên của tất cả các Ví dụ
const getOnlyDelegationName = async (req, res) => {
  try {
    let data;
    data = await getOnlyDelegationName(req.portal, req.query);

    // await Log.info(req.user.email, "GET_ONLY_NAME_ALL_DELEGATIONS", req.portal);
    res.status(200).json({
      success: true,
      messages: ["get_only_name_all_delegations_success"],
      content: data
    });
  } catch (error) {
    // await Log.error(req.user.email, "GET_ONLY_NAME_ALL_DELEGATIONS", req.portal);

    res.status(400).json({
      success: false,
      messages: ["get_only_name_all_delegations_fail"],
      content: error.message
    });
  }
}

module.exports = {
  createDelegation,
  createTaskDelegation,
  getDelegations,
  getDelegationsReceive,
  getDelegationsReceiveTask,
  rejectDelegation,
  confirmDelegation,
  getDelegationById,
  editDelegation,
  editTaskDelegation,
  deleteDelegations,
  revokeDelegation,
  deleteTaskDelegations,
  revokeTaskDelegation,
  getOnlyDelegationName
}
