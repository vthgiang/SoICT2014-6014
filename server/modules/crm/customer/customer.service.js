const { Customer } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);


exports.createCustomer = async (portal, companyId, data, userId) => {
    let {
        owner, code, name, gender, avatar, company, taxNumber, customerSource, companyEstablishmentDate,
        birthDate, telephoneNumber, mobilephoneNumber, email, email2, group, status, address, address2, location, website, linkedIn
    } = data;

    //format birthDate
    if (birthDate) {
        let date = birthDate.split('-');
        birthDate = [date[2], date[1], date[0]].join("-");
    }

    // format companyEstablishmentDate
    if (companyEstablishmentDate) {
        let date = companyEstablishmentDate.split('-');
        companyEstablishmentDate = [date[2], date[1], date[0]].join('-');
    }

    const newCustomer = await Customer(connect(DB_CONNECTION, portal)).create({
        owner: '',
        code: code,
        name: name,
        // status: status,
        creator: userId,
        gender: gender ? gender : '',
        taxNumber: taxNumber ? taxNumber : '',
        customerSource: customerSource ? customerSource : '',
        companyEstablishmentDate: companyEstablishmentDate ? companyEstablishmentDate : null,
        birthDate: birthDate ? birthDate : null,
        telephoneNumber: telephoneNumber ? telephoneNumber : null,
        mobilephoneNumber: mobilephoneNumber ? mobilephoneNumber : null,
        email: email ? email : '',
        email2: email2 ? email2 : '',
        group: group,
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
        .skip(parseInt(page)).limit(parseInt(limit))
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name' });
    return { listDocsTotal, customers };

}

exports.getCustomerById = async (portal, companyId, id) => {
    const getCustomer = await Customer(connect(DB_CONNECTION, portal)).findById(id)
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name' });
    return getCustomer;
}

exports.editCustomer = async (portal, companyId, id, data, userId) => {
    let {
        owner, code, name, gender, avatar, company, taxNumber, customerSource, companyEstablishmentDate,
        birthDate, telephoneNumber, mobilephoneNumber, email, email2, group, status, address, address2, location, website, linkedIn
    } = data;

    //format birthDate
    if (birthDate) {
        let date = birthDate.split('-');
        birthDate = [date[2], date[1], date[0]].join("-");
    }

    // format companyEstablishmentDate
    if (companyEstablishmentDate) {
        let date = companyEstablishmentDate.split('-');
        companyEstablishmentDate = [date[2], date[1], date[0]].join('-');
    }

    await Customer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            owner: owner,
            code: code,
            name: name,
            // status: status,
            creator: userId,
            gender: gender ? gender : '',
            taxNumber: taxNumber ? taxNumber : '',
            customerSource: customerSource ? customerSource : '',
            companyEstablishmentDate: companyEstablishmentDate ? companyEstablishmentDate : null,
            birthDate: birthDate ? birthDate : null,
            telephoneNumber: telephoneNumber ? telephoneNumber : null,
            mobilephoneNumber: mobilephoneNumber ? mobilephoneNumber : null,
            email: email ? email : '',
            email2: email2 ? email2 : '',
            group: group,
            address: address ? address : '',
            address2: address2 ? address2 : '',
            location: location ? location : null,
            website: website ? website : '',
            linkedIn: linkedIn ? linkedIn : ''
        }
    }, { new: true });

    return await Customer(connect(DB_CONNECTION, portal)).findOne({ _id: id })
        .populate({ path: 'group', select: '_id name' })
        .populate({ path: 'status', select: '_id name' })
        .populate({ path: 'owner', select: '_id name' });
}


exports.deleteCustomer = async (portal, companyId, id) => {
    let delCustomer = await Customer(connect(DB_CONNECTION, portal)).findOneAndDelete({ _id: id });
    return delCustomer;
}