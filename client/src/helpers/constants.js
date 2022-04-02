export const COMPONENT = {
    CREATE_NOTIFICATION: 'create-notification',
}

export const ROLE_TYPE = {
    ROOT: 'Root',
    POSITION: 'Position',
    COMPANY_DEFINED: 'Company-Defined'
}

export const ROOT_ROLE = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    DEPUTY_MANAGER: 'Deputy Manager',
    EMPLOYEE: 'Employee',
}

export const POLICY_ATTRIBUTE_RULE_CHECK = [
    { name: "EQUALS", value: "EQUALS" },
    { name: "BELONGS", value: "BELONGS" },
    { name: "CONTAINS", value: "CONTAINS" }
]