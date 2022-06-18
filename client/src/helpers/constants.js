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
    { name: "CONTAINS", value: "CONTAINS" },
    { name: "EQUALS", value: "EQUALS" },
    { name: "BELONGS", value: "BELONGS" }
]

export const ATTRIBUTE_TYPE = [
    { name: "Authorization", value: "Authorization" },
    { name: "Delegation", value: "Delegation" },
    { name: "Mixed", value: "Mixed" }
]