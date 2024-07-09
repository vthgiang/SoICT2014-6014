const { RoleDelegationHandler } = require('./role.delegation.handler')
const { TaskDelegationHandler } = require('./task.delegation.handler')
const { ResourceDelegationHandler } = require('./resource.delegation.handler')

let roleDelegationHandler = new RoleDelegationHandler();
let taskDelegationHandler = new TaskDelegationHandler();
let resourceDelegationHandler = new ResourceDelegationHandler();
exports.createDelegationHandler = (type) => {
    switch (type) {
        case 'Role':
            if (!roleDelegationHandler) {
                roleDelegationHandler = new RoleDelegationHandler();
            }
            return roleDelegationHandler;
        case 'Task':
            if (!taskDelegationHandler) {
                taskDelegationHandler = new TaskDelegationHandler();
            }
            return taskDelegationHandler;
        case 'Resource':
            if (!resourceDelegationHandler) {
                resourceDelegationHandler = new ResourceDelegationHandler();
            }
            return resourceDelegationHandler;
        default:
            throw ['delegate_type_invalid'];
    }
}
