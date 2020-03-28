const Action = require('./action.model');
const Company = require('./company.model');
const Component = require('./component.model');
const ComponentDefault = require('./componentDefault.model');
const Department = require('./department.model');
const Link = require('./link.model');
const LinkDefault = require('./linkDefault.model');
const Privilege = require('./privilege.model');
const Role = require('./role.model');
const RoleDefault = require('./roleDefault.model');
const RoleType = require('./role_type.model');
const User = require('./user.model');
const UserRole = require('./user_role.model');

exports.data = {
    Action,
    Company,
    Component,
    ComponentDefault,
    Department,
    Link,
    LinkDefault,
    Privilege,
    Role,
    RoleDefault,
    RoleType,
    User,
    UserRole
} 