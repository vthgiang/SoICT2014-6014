const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    owner: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    gender: {
        type: Number,
    },
    avatar: {
        type: String,
    },
    customerType: {
        type: Number,
    },
    company: {
        type: String,
    },
    represent: {
        type: String,
    },
    taxNumber: {
        type: String,
    },
    customerSource: {
        type: String,
    },
    companyEstablishmentDate: {
        type: Date,
    },
    birthDate: {
        type: Date,
    },
    telephoneNumber: {
        type: Number,
    },
    mobilephoneNumber: {
        type: Number,
    },
    email: {
        type: String,
    },
    email2: {
        type: String,
    },
    address: {
        type: String
    },
    address2: {
        type: String
    },
    location: {
        type: Number,
    },
    website: {
        type: String,
    },
    linkedIn: {
        type: String,
    },
    customerGroup: {
        type: Schema.Types.ObjectId,
        ref: 'CustomerGroup',
    },
    customerStatus: [{
        type: Schema.Types.ObjectId,
        ref: 'CustomerStatus'
    }],
    point: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    rankPoints: [{
        point: {
            type: Number
        },
        expirationDate: {
            type: Date
        }
    }],
    files: [{
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String
        },
        description: {
            type: String
        },
        fileName: {
            type: String,
        },
        url: {
            type: String
        }
    }],
    statusHistories: [{
        oldValue: {
            type: Schema.Types.ObjectId,
            ref: 'CustomerStatus'
        },
        newValue: {
            type: Schema.Types.ObjectId,
            ref: 'CustomerStatus'
        },
        createdAt: {
            type: Date,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        description: {
            type: String
        }
    }],
    updatedAt: {
        type: Date,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    note: {
        type: String,
    },
    promotions: [{
        code: {
            type: String,
            require: false
        },
        value: {
            type: Number
        },
        description: {
            type: String
        },
        minimumOrderValue: {
            type: Number
        },
        promotionalValueMax: {
            type: Number
        },
        expirationDate: {
            type: Date
        },
        status: {
            type: Number
        }
    }],
    canUsedPromotions: [{
        code: {
            type: String,
            require: false
        },
        value: {
            type: Number
        },
        description: {
            type: String
        },
        minimumOrderValue: {
            type: Number
        },
        promotionalValueMax: {
            type: Number
        },
        expirationDate: {
            type: Date
        },
        exceptCustomer: [{
            type: Schema.Types.ObjectId,
            ref: "Customer"
        }],
        status: {
            type: Number
        },
        customerUsed: [{
            type: Schema.Types.ObjectId,
            ref: "Customer"
        }]
    }],
    customerCareUnit: {
        type: Schema.Types.ObjectId,
        ref: "CustomerCareUnit",
    },
    startWorkingTime: {
        type: String
    },
    endWorkingTime: {
        type: String
    },
    latePenaltyCost: {
        type: Number
    }
}, {
    timestamps: true,
});

CustomerSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Customer)
        return db.model('Customer', CustomerSchema);
    return db.models.Customer;
};
