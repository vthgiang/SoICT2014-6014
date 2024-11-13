
const Attribute = {
    "type": "object",
    "properties": {
    "id": {
        "type": "string",
        "description": "Unique identifier for the attribute",
        "example": "attr123"
    },
    "name": {
        "type": "string",
        "description": "Name of the attribute",
        "example": "Sales Target"
    },
    "type": {
        "type": "string",
        "description": "Type of the attribute",
        "enum": ["position-related", "task-related", "policy-related"],
        "example": "task-related"
    },
    "tags": {
        "type": "array",
        "description": "Tags associated with the attribute",
        "items": {
        "type": "string"
        },
        "example": ["sales", "priority"]
    },
    "expiration": {
        "type": "string",
        "format": "date-time",
        "description": "Expiration date for task-related attributes only",
        "nullable": true,
        "example": "2025-01-01T00:00:00Z"
    }
    },
    "required": ["id", "name", "type"],
    "description": "Schema for an attribute with possible expiration date for task-related types."
}


const AuthorizationLog = {
    "type": "object",
    "properties": {
    "allow": {
        "type": "string",
        "description": "Indicates if the authorization was allowed or denied",
        "example": "true"
    },
    "type": {
        "type": "string",
        "description": "The type of authorization",
        "example": "mixed"
    },
    "entity": {
        "type": "string",
        "description": "Reference ID to an entity document",
        "example": "67337f05259beb64cc51dec6"
    },
    "object": {
        "type": "string",
        "description": "Reference ID to an object document",
        "example": "67337f05259beb64cc51deda"
    },
    "action": {
        "type": "string",
        "description": "Action attempted by the entity on the object",
        "example": "set_sale_target"
    },
    "policyApplied": {
        "type": "string",
        "description": "Reference ID to the applied policy document, if any",
        "nullable": true,
        "example": "67337cf61e17a9798421ada0"
    },
    "ruleApplied": {
        "type": "string",
        "description": "Reference ID to the applied rule document, if any",
        "nullable": true,
        "example": "67337cf61e17a9798421ad90"
    },
    "ipAddress": {
        "type": "string",
        "description": "IP address of the requester",
        "example": "::1"
    },
    "userAgent": {
        "type": "string",
        "description": "User agent string of the client",
        "example": "PostmanRuntime/7.42.0"
    },
    "location": {
        "type": "string",
        "description": "Location of the requester, if available",
        "nullable": true,
        "example": "Hanoi, Vietnam"
    },
    "accessTime": {
        "type": "string",
        "format": "date-time",
        "description": "Timestamp of the access attempt",
        "example": "2024-11-12T17:15:28.268Z"
    }
    },
    "required": ["allow", "type", "entity", "object", "action"],
    "description": "Schema for storing authorization log records detailing each authorization attempt and applied policies or rules."
}

const Entity = {
    "type": "object",
    "properties": {
    "name": {
        "type": "string",
        "description": "Name of the entity",
        "example": "John Doe"
    },
    "type": {
        "type": "string",
        "description": "Type of the entity, e.g., 'Human' or 'Service'",
        "example": "Human"
    },
    "attributes": {
        "type": "array",
        "description": "Array of attribute objects associated with the entity",
        "items": {
        "type": "object",
        "properties": {
            "key": {
            "type": "string",
            "description": "Key for the attribute",
            "example": "pos"
            },
            "value": {
            "type": "string",
            "description": "Value associated with the key",
            "example": "Sales Manager"
            },
            "dataType": {
            "type": "string",
            "description": "Data type of the attribute's value",
            "enum": ["int", "string"],
            "example": "string"
            }
        },
        "required": ["key", "value", "dataType"]
        }
    }
    },
    "required": ["name"],
    "description": "Schema representing an entity with a name, type, and list of attributes."
}


const Object = {
    "type": "object",
    "properties": {
    "name": {
        "type": "string",
        "description": "Name of the object",
        "example": "Sales Report"
    },
    "type": {
        "type": "string",
        "description": "Type of the object, e.g., 'Resource', 'Action', etc.",
        "example": "Resource"
    },
    "attributes": {
        "type": "array",
        "description": "Array of attribute objects associated with the object",
        "items": {
        "type": "object",
        "properties": {
            "key": {
            "type": "string",
            "description": "Key for the attribute",
            "example": "department"
            },
            "value": {
            "type": "string",
            "description": "Value associated with the key",
            "example": "Sales"
            },
            "operation": {
            "type": "string",
            "description": "Operation to be performed on the attribute value",
            "enum": [">", "<", "=", ">=", "<=", "<>"],
            "example": "="
            }
        },
        "required": ["key", "value", "operation"]
        }
    },
    "relatedEntities": {
        "type": "object",
        "properties": {
        "owner": {
            "type": "string",
            "description": "Reference ID to the owner entity",
            "example": "67337f05259beb64cc51dec6"
        }
        },
        "nullable": true
    }
    },
    "required": ["name"],
    "description": "Schema representing an object with a name, type, attributes, and related entities."
}


const Policy = {
    "type": "object",
    "properties": {
    "name": {
        "type": "string",
        "description": "Name of the policy",
        "example": "Sales Department Action Policy"
    },
    "priority": {
        "type": "integer",
        "description": "Priority level of the policy",
        "example": 100
    },
    "authorizationRules": {
        "type": "array",
        "description": "List of authorization rules associated with the policy",
        "items": {
        "type": "string",
        "description": "ObjectId reference to a Rule",
        "example": "60d5f5dbe319bd001f6a528c"
        }
    },
    "delegationRules": {
        "type": "array",
        "description": "List of delegation rules associated with the policy",
        "items": {
        "type": "string",
        "description": "ObjectId reference to a Rule",
        "example": "60d5f5dbe319bd001f6a528d"
        }
    }
    },
    "required": ["name", "priority"],
    "description": "Schema representing a policy with a name, priority, and lists of authorization and delegation rules."
}


const Rule = {
    "type": "object",
    "properties": {
    "action": {
        "type": "string",
        "description": "The action to be performed (e.g., read, write, delete)",
        "example": "set_sale_target"
    },
    "entityConditions": {
        "type": "array",
        "description": "List of conditions related to entities",
        "items": {
        "type": "object",
        "properties": {
            "key": {
            "type": "string",
            "description": "The key for the entity condition (e.g., position, department)",
            "example": "pos"
            },
            "value": {
            "type": "string",
            "description": "The value associated with the entity condition",
            "example": "Sales Representative"
            },
            "operation": {
            "type": "string",
            "enum": [">", "<", "=", ">=", "<=", "<>"],
            "description": "The operation to be performed for this entity condition",
            "example": "="
            }
        },
        "required": ["key", "value", "operation"]
        }
    },
    "objectConditions": {
        "type": "array",
        "description": "List of conditions related to objects",
        "items": {
        "type": "object",
        "properties": {
            "key": {
            "type": "string",
            "description": "The key for the object condition (e.g., department, type)",
            "example": "type"
            },
            "value": {
            "type": "string",
            "description": "The value associated with the object condition",
            "example": "sales_report"
            },
            "operation": {
            "type": "string",
            "enum": [">", "<", "=", ">=", "<=", "<>"],
            "description": "The operation to be performed for this object condition",
            "example": "="
            }
        },
        "required": ["key", "value", "operation"]
        }
    },
    "conditionType": {
        "type": "string",
        "enum": ["allow", "deny"],
        "description": "The type of condition (whether the action is allowed or denied)",
        "example": "allow"
    },
    "delegation": {
        "type": "boolean",
        "description": "Whether delegation is allowed for the rule",
        "example": false
    }
    },
    "required": ["action", "entityConditions", "objectConditions", "conditionType"],
    "description": "Schema representing a rule with action, conditions for entities and objects, condition type (allow/deny), and delegation."
}

module.exports = {
    Attribute,
    AuthorizationLog,
    Entity,
    Object,
    Policy,
    Rule
}