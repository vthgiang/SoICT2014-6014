const BankAccountService = require('./bankAccount.service');
const Log = require(`../../../../logs`);

exports.createBankAccount = async (req, res) => {
    try {
        let data = req.body;
        let bankAccount = await BankAccountService.createBankAccount(req.user._id, data, req.portal)

        await Log.info(req.user.email, "CREATED_NEW_BANK_ACCOUNT", req.portal);

        res.status(201).json({
            success: true,
            messages: ["create_successfully"],
            content: bankAccount
        });
    }  catch (error) {
        await Log.error(req.user.email, "CREATED_NEW_BANK_ACCOUNT", req.portal);

        res.status(400).json({
            success: false,
            messages: ["create_failed"],
            content: error.message
        });
    }
}

exports.editBankAccount = async (req, res) => {
    try {
        let id = req.params.id;
        data = req.body;
        let bankAccount = await BankAccountService.editBankAccount(req.user._id, id, data, req.portal);

        await Log.info(req.user.email, "EDIT_BANK_ACCOUNT", req.portal);
        res.status(200).json({
            success: true,
            messages: ["edit_successfully"],
            content: bankAccount
        });
    } catch (error) {
        await Log.error(req.user.email, "EDIT_SLA", req.portal);
        res.status(400).json({
            success: false,
            messages: ["edit_failed"],
            content: error.message
        });
    }
}

exports.getAllBankAccounts = async ( req, res ) => {
    try {
        let query = req.query;
        let allBankAccounts = await BankAccountService.getAllBankAccounts( query , req.portal)

        await Log.info(req.user.email, "GET_ALL_BANK_ACCOUNTS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_successfully"],
            content: allBankAccounts
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ALL_BANK_ACCOUNTS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_failed"],
            content: error.message
        });
    }
}
