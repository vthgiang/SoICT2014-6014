const Document = {
    required: ["name", "creator"],
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        domains: {
            type: "array",
            items: {
                type: "string"

            }
        },
        company: { type: "string" },
        category: { type: "string" },
        description: { type: "string" },
        issuingBody: { type: "string" },
        signer: { type: "string" },
        officialNumber: { type: "string", },
        views: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    viewer: { type: "string" },
                    time: {
                        type: "string",
                        format: "date",
                    },
                }
            }
        },
        downloads: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    downloader: { type: "string" },
                    time: {
                        type: "string",
                        format: "date",
                    },
                }
            }
        },
        numberOfView: {
            type: "number",
            default: 0
        },
        numberOfDownload: {
            type: "number",
            default: 0
        },
        versions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    versionName: { type: "string" },
                    issuingDate: {
                        type: "string",
                        format: "date",
                    },
                    effectiveDate: {
                        type: "string",
                        format: "date",
                    },
                    expiredDate: {
                        type: "string",
                        format: "date",
                    },
                    file: {
                        type: "string",
                        format: "date",
                    },
                    scannedFileOfSignedDocument: {
                        type: "string",
                        format: "date",
                    },
                }
            }
        },
        relationshipDescription: { type: "string" },
        relationshipDocuments: { type: "string" },
        roles: {
            type: "array",
            items: { type: "string" },
        },
        archives: {
            type: "array",
            items: {
                ref: "#/components/schemas/DocumentArchive"
            }
        },
        archivedRecordPlaceOrganizationalUnit: { type: "string" },
        archivedRecordPlaceManager: { type: "string" },
        logs: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    createdAt: {
                        type: "string",
                        format: "date",
                    },
                    creator: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                }
            }
        }
    }
}

const DocumentArchive = {
    require: ["name"],
    type: "object",
    properties: {
        name: { type: "string" },
        description: { type: "string" },
        path: { type: "string" },
        parent: { type: "string" },
    }
}

const DocumentCategory = {
    require: ["name"],
    type: "object",
    properties: {
        name: {
            type: "string",
            example: "Văn bản"
        },
        description: {
            type: "string",
            example: "Mô tả văn bản"
        }
    }
}

const DocumentDomain = {
    require: ["name"],
    properties: {
        name: { type: "string" },
        description: { type: "string" },
        parent: { type: "string" },
    }
}

module.exports = {
    Document,
    DocumentArchive,
    DocumentCategory,
    DocumentDomain
}