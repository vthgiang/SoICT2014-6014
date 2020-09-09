module.exports = {
    Company: require('./system-admin/company.model'),
    Configuration: require('./system-admin/configuration.model'),
    SystemComponent: require('./system-admin/systemComponent.model'),
    SystemLink: require('./system-admin/systemLink.model'),
    RootRole: require('./system-admin/rootRole.model'),

    Privilege: require('./auth/privilege.model'),
    Role: require('./auth/role.model'),
    User: require('./auth/user.model'),
    UserRole: require('./auth/userRole.model'),

    Component: require('./super-admin/component.model'),
    Link: require('./super-admin/link.model'),
    OrganizationalUnit: require('./super-admin/organizationalUnit.model'),
    RoleType: require('./super-admin/roleType.model'),
}