const { RoleDelegationHandler } = require('./role.delegation.handler')
const { TaskDelegationHandler } = require('./task.delegation.handler')
const { ResourceDelegationHandler } = require('./resource.delegation.handler')

exports.createDelegationHandler = (type) => {
    switch (type) {
        case 'Role':
            return new RoleDelegationHandler();
        case 'Task':
            return new TaskDelegationHandler();
        case 'Resource':
            return new ResourceDelegationHandler();
        default:
            throw ['delegate_type_invalid'];
    }
}