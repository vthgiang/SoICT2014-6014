const Task = {
    type: "object",
    properties: {
        creator:  {
            type: "string"
        },
        name: {
            type: "string"
        },
        description: {
            type: "string"
        },
        tags: {
            type: "array",
            items: {
                type: "string"
            }
        },
        startDate: {
            type: "string",
            format: "date",
        },
        endDate: {
            type: "string",
            format: "date",
        },
        priority: {
            type: "number",
            default: 3
        },
        isArchived: {
            type: "boolean",
            default: false
        },
        isArchived: {
            type: "string",
            default: "inprocess"
        },
        taskTemplate: {
            //ref: 
            type: "string",
        },
        parent: {
            type: "string",
        },
        level: {
            type: "number",
        },
        inactiveEmployees: {
            type: "array",
            items: {
                type: "string"
                //ref: User
            }
        },
        responsibleEmployees: {
            type: "array",
            items: {
                type: "string"
                //ref: User
            }
        },
        accountableEmployees: {
            type: "array",
            items: {
                type: "string"
                //ref: User
            }
        },
        consultedEmployees: {
            type: "array",
            items: {
                type: "string"
                //ref: User
            }
        },
        informedEmployees: {
            type: "array",
            items: {
                type: "string"
                //ref: User
            }
        },
        confirmedByEmployees: {
            type: "array",
            items: {
                type: "string"
                //ref: User
            }
        },
        requestToCloseTask: {
            type: "object",
            properties: {
                requestedBy: {
                    type: "string"
                    //ref: User
                },
                createdAt: {
                    type: "string",
                    format: "date",
                    default: Date.now()
                },
                description: {
                    type: "string"
                },
                taskStatus: {
                    type: "string"
                },
                requestStatus: {
                    type: "Number",
                    defaul: 0
                },
                responsibleUpdatedAt: {
                    type: "string",
                    format: "date",
                },
                accountableUpdatedAt: {
                    type: "string",
                    format: "date",
                },
            },
        },
        evaluations: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    date: {
                        type: "string",
                        format: "date",
                    },
                    evaluatingMonth: {
                        type: "string",
                        format: "date",
                    },
                    startDate: {
                        type: "string",
                        format: "date",
                    },
                    endDate: {
                        type: "string",
                        format: "date",
                    },
                    progress: {
                        type: "number",
                        default: 0
                    },
                    results: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                employee: {
                                    type: "string"
                                    //ref: User
                                },
                                organizationalUnit: {
                                    type: "string"
                                    //ref: OrganizationalUnit
                                },
                                role: {
                                    type: "string"
                                },
                                kpis: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                        //ref: EmployeeKpi
                                    }
                                },
                                automaticPoint: {
                                    type: 'number',
                                    default: 0
                                },
                                employeePoint: {
                                    type: 'number',
                                    default: 0
                                },
                                approvedPoint: {
                                    type: 'number',
                                    default: 0
                                },
                                contribution: {
                                    type: 'number',
                                },
                                hoursSpent: {
                                    type: 'number',
                                },
                                taskImportanceLevel: {
                                    type: 'number',
                                    default: -1
                                },

                            }
                        }
                    },
                    taskInformations: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                code: {
                                    type: 'string',
                                },
                                name: {
                                    type: 'string',
                                },
                                filledByAccountableEmployeesOnly: {
                                    type: 'boolean',
                                    default: true
                                },
                                extra: {
                                    type: 'string',
                                },
                                type: {
                                    type: 'string',
                                },
                                value: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        },
        overallEvaluation: {
            type: 'object',
            properties: {
                automaticPoint: {
                    type: 'number',
                    default: null
                },
                responsibleEmployees: {
                    type: 'array',
                    items: {
                        type: "object",
                        properties: {
                            employee: {
                                type: "string"
                                //ref: User
                            },
                            automaticPoint: {
                                type: 'number',
                                default: null
                            },
                            employeePoint: {
                                type: 'number',
                                default: null
                            },
                            accountablePoint: {
                                type: 'number',
                                default: null
                            },
                            contribution: {
                                type: 'number',
                            },
                            hoursSpent: {
                                type: 'number',
                            }

                        }
                    }
                },
                responsibleEmployees: {
                    type: 'array',
                    items: {
                        type: "object",
                        properties: {
                            employee: {
                                type: "string"
                                //ref: User
                            },
                            automaticPoint: {
                                type: 'number',
                                default: null
                            },
                            employeePoint: {
                                type: 'number',
                                default: null
                            },
                            contribution: {
                                type: 'number',
                            },
                            hoursSpent: {
                                type: 'number',
                            }

                        }
                    }
                },
                taskInformations: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'string',
                        },
                        name: {
                            type: 'string',
                        },
                        filledByAccountableEmployeesOnly: {
                            type: 'boolean',
                            default: true
                        },
                        extra: {
                            type: 'string',
                        },
                        type: {
                            type: 'string',
                        },
                        value: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        formula: {
            type: "string",
            default: "progress / (daysUsed / totalDays) - (10 - averageActionRating) * 10"
        },
        progress: {
            type: "number",
            default: 0
        },
        point: {
            type: "number",
            default: -1
        },
        documents: {
            type: 'array',
            items: {
                type: "object",
                properties: {
                    files: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                url: {
                                    type: "string"
                                },
                            }
                        }
                    },
                    description: {
                        type: "string"
                    },
                    creator: {
                        type: "string",
                        //ref: User
                    },
                    isOutput: {
                        type: "boolean",
                        default: false
                    }
                }
            }
        },
        hoursSpentOnTask: {
            type: 'object',
            properties: {
                
                totalHoursSpent: {
                    type: 'number',
                    default: 0
                },
                extra: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            employee: {
                                type: "string",
                                //ref: User
                            },
                            hoursSpent: {
                                type: "number",
                            }
                        }
                    }
                },
                
            }
        },
        timesheetLogs: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    creator: {
                        type: "string",
                        //ref: User
                    },
                    startAt: {
                        type: "string",
                        format: "date"
                    },
                    stopAt: {
                        type: "string",
                        format: "date"
                    },
                    description: {
                        type: "string",
                    },
                    duration: {
                        type: "number",
                    },
                    autoStopped: {
                        type: "number",
                        default: 1
                    },
                    acceptLog: {
                        type: "boolean",
                        default: false
                    },
                }
            }
        },
        taskInformations: {
            type: 'array',
            items: {
                required: ["code"],
                type: 'object',
                properties: {
                    code: {
                        type: 'string',
                    },
                    name: {
                        type: 'string',
                    },
                    description: {
                        type: 'string',
                    },
                    filledByAccountableEmployeesOnly: {
                        type: 'boolean',
                        default: true
                    },
                    extra: {
                        type: 'string',
                    },
                    type: {
                        type: 'string',
                    },
                    value: {
                        type: 'string'
                    },
                    isOutput: {
                        type: 'boolean',
                        default: false
                    }
                }
            }
        },
        taskActions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    creator: {
                        type: "string",
                        //ref: User
                    },
                    name: {
                        type: "string"
                    },
                    description: {
                        type: "string"
                    },
                    mandatory: {
                        type: "boolean",
                        default: true
                    },
                    createdAt: {
                        type: "string",
                        format: "date",
                        default: Date.now()
                    },
                    updatedAt: {
                        type: "string",
                        format: "date",
                        default: Date.now()
                    },
                    rating: {
                        type: "number",
                        default: -1
                    },
                    actionImportanceLevel: {
                        type: "number",
                        default: 10
                    },
                    files: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                url: {
                                    type: "string"
                                },
                            }
                        }
                    },
                    evaluations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                creator: {
                                    type: "string"
                                    //ref: User
                                },
                                role: {
                                    type: "string"
                                },
                                createdAt: {
                                    type: "string",
                                    format: "date",
                                    default: Date.now()
                                },
                                updatedAt: {
                                    type: "string",
                                    format: "date",
                                    default: Date.now()
                                },
                                rating: {
                                    type: 'number',
                                    default: -1
                                },
                                actionImportanceLevel: {
                                    type: 'number',
                                    default: 10
                                },
                            }
                        }
                    },
                    comments: {
                        type: "object",
                        properties: {
                            creator: {
                                type: "string"
                                //ref: User
                            },
                            description: {
                                type: "string"
                            },
                            createdAt: {
                                type: "string",
                                format: "date",
                                default: Date.now()
                            },
                            updatedAt: {
                                type: "string",
                                format: "date",
                                default: Date.now()
                            },
                            files: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string"
                                        },
                                        url: {
                                            type: "string"
                                        },
                                    }
                                }
                            },
                        }
                    },
                    timesheetLogs: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                creator: {
                                    type: "string"
                                    //ref: User
                                },
                                description: {
                                    type: "string"
                                },
                                startedAt: {
                                    type: "string",
                                    format: "date",
                                },
                                stopedAt: {
                                    type: "string",
                                    format: "date",
                                },
                                duration: {
                                    type: "number"
                                },
                                autoStopped: {
                                    type: "number",
                                    default: 1
                                },
                                acceptLog: {
                                    type: "boolean",
                                    default: true
                                }, 
                            }
                        }
                    }
                }
            }
        },
        taskComments: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    creator: {
                        type: "string"
                        //ref: User
                    },
                    description: {
                        type: "string"
                    },
                    createdAt: {
                        type: "string",
                        format: "date",
                        default: Date.now()
                    },
                    updatedAt: {
                        type: "string",
                        format: "date",
                        default: Date.now()
                    },
                    files: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                url: {
                                    type: "string"
                                },
                            }
                        }
                    },
                    comments: {
                        type: "object",
                        properties: {
                            creator: {
                                type: "string"
                                //ref: User
                            },
                            description: {
                                type: "string"
                            },
                            createdAt: {
                                type: "string",
                                format: "date",
                                default: Date.now()
                            },
                            updatedAt: {
                                type: "string",
                                format: "date",
                                default: Date.now()
                            },
                            files: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string"
                                        },
                                        url: {
                                            type: "string"
                                        },
                                    }
                                }
                            },
                        }
                    },
                }
            }
        },
        logs: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    creator: {
                        type: "string"
                        //ref: User
                    },
                    description: {
                        type: "string"
                    },
                    createdAt: {
                        type: "string",
                        format: "date",
                        default: Date.now()
                    },
                    title: {
                        type: "string"
                    },
                },
            }
        },
        taskProject: {
            type: "string",
            //ref: 'Project'
        },
        taskPhase: {
            type: "string",
            //ref: 'ProjectPhase'
        },
        estimateNormalTime: {
            type: "number",
        },
        //thời gian ước lượng ít nhất để hoàn thành task
        estimateOptimisticTime: {
            type: "number",
        },
        //chi phí ước lượng thông thường của task
        estimateNormalCost: {
            type: "number",
        },
        //chi phí ước lượng nhiều nhất có thể cho phép của task
        estimateMaxCost: {
            type: "number",
        },
        //chi phí thực cho task đó
        actualCost: {
            type: "number",
        },
        actorsWithSalary: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        //ref: User
                    },
                    salary: {
                        type: "number",
                    },
                    weight: {
                        type: "number",
                    },
                    actualCost: {
                        type: "number",
                    },
                }
            }
        },
        estimateAssetCost: {
            type: "number",
        },
        totalResWeight: {
            type: "number",
        },
        isFromCPM: {
            type: "boolean",
        },
        formulaProjectTask: {
            type: "string",
            default: "taskTimePoint + taskQualityPoint + taskCostPoint",
        },
        formulaProjectMember: {
            type: "string",
            default: "memberTimePoint + memberQualityPoint + memberCostPoint + memberTimedistributionPoint",
        },
        taskWeight: {
            type: "object",
            properties: {
                timeWeight: {
                    type: "number",
                    default: 1/3,
                },
                // Số bé hơn 1
                qualityWeight: {
                    type: "number",
                    default: 1/3,
                },
                // Số bé hơn 1
                costWeight: {
                    type: "number",
                    default: 1/3,
                },
            }
        },
        memberWeight: {
            type: "object",
            properties: {
                timeWeight: {
                    type: "number",
                    default: 0.25,
                },
                // Số bé hơn 1
                qualityWeight: {
                    type: "number",
                    default: 0.25,
                },
                // Số bé hơn 1
                costWeight: {
                    type: "number",
                    default: 0.25,
                },
                timedistributionWeight: {
                    type: "number",
                    default: 0.25,
                },
            }
        },
    }     
}

module.exports = {
    Task
}