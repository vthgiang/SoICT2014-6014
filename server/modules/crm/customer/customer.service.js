const mongoose = require("mongoose");
const { Customer } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);


exports.createCustomer = async (portal, companyId, data, userId) => {
    const {
        owner, code, name, gender, avatar, company, taxNumber, customerSource, companyEstablishmentDate,
        birthDate, telephoneNumber, mobilephoneNumber, email, email2, group, status, address, address2, location, website, linkedIn
    } = data;

    const newCustomer = await Customer(connect(DB_CONNECTION, portal)).create({
        // owner: owner,
        code: code,
        name: name,
        // status: status,
        creator: userId,
        gender: gender ? gender : '',
        company: company ? company : '',
        taxNumber: taxNumber ? taxNumber : '',
        customerSource: customerSource ? customerSource : '',
        companyEstablishmentDate: companyEstablishmentDate ? companyEstablishmentDate : null,
        birthDate: birthDate ? birthDate : null,
        telephoneNumber: telephoneNumber ? telephoneNumber : null,
        mobilephoneNumber: mobilephoneNumber ? mobilephoneNumber : 0,
        email: email ? email : '',
        email2: email2 ? email2 : '',
        // group: group ? group : '',
        address: address ? address : '',
        address2: address2 ? address2 : '',
        location: location ? location : null,
        website: website ? website : '',
        linkedIn: linkedIn ? linkedIn : ''
    });

    const getNewCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(newCustomer._id);
    return getNewCustomer;
}

exports.getCustomers = async (portal, companyId, query) => {
    const { page, limit } = query;
    let keySearch = {};
    const listDocsTotal = await Customer(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    const customers = await Customer(connect(DB_CONNECTION, portal)).find(keySearch).sort({ 'createdAt': 'desc' })
        .skip(parseInt(page)).limit(parseInt(limit));
    return { listDocsTotal, customers };

}