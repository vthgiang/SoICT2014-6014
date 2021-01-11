const {
    BankAccount
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

exports.createBankAccount = async (userId, data, portal) => {
    let newBankAccount = await BankAccount(connect(DB_CONNECTION, portal)).create({
        account: data.account,
        owner: data.owner,
        bankName: data.bankName,
        bankAcronym: data.bankAcronym,
        status: data.status,
        creator: userId
    })

    let bankAccount = await BankAccount(connect(DB_CONNECTION, portal)).findById({ _id: newBankAccount._id }) .populate([
        {
            path: "creator", select: "name"
        }])
    return {bankAccount};
}

exports.editBankAccount = async (userId, id, data, portal) => {
    let oldBankAccount = await BankAccount(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldBankAccount) {
        throw Error("Bank Account is not existing")
    }
    
    oldBankAccount.account = data.account;
    oldBankAccount.owner = data.owner;
    oldBankAccount.bankName = data.bankName;
    oldBankAccount.bankAcronym = data.bankAcronym;
    oldBankAccount.status = data.status;
    oldBankAccount.creator = userId;

    await oldBankAccount.save();

    let bankAccountUpdate =  await BankAccount(connect(DB_CONNECTION, portal)).findById(id) .populate([
        {
            path: "creator", select: "name"
        }]);

    return {bankAccount: bankAccountUpdate};
}

exports.getAllBankAccounts = async (query, portal) => {
    let { page, limit } = query;
    let option = {};

    if (query.account) {
        option.account =  new RegExp(query.account, "i")
    }
    if (query.bankName) {
        option.bankName =  new RegExp(query.bankName, "i")
    }
    if (query.bankAcronym) {
        option.bankAcronym =  new RegExp(query.bankAcronym, "i")
    }

    if ( !page || !limit ){
        let allBankAccounts = await BankAccount(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([
            {
                path: "creator", select: "name"
            }])
        return { allBankAccounts }
    } else {
        let allBankAccounts = await BankAccount(connect(DB_CONNECTION, portal)).paginate(option, {
            page,
            limit,
            populate: [{
                path: "creator", select: "name"
            }]
        })
        return { allBankAccounts }
    }
}