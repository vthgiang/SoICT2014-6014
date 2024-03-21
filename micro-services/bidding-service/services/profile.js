const {
    Employee,
    OrganizationalUnit,
    UserRole,
    User,
    Company,
} = require('../models');

const { connect } = require('../helpers/dbHelper');

/**
 * Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
 * @emailInCompany : Email công ty của nhân viên
 */
exports.getAllPositionRolesAndOrganizationalUnitsOfUser = async (
    portal,
    emailInCompany
) => {
    let roles = [],
        organizationalUnits = [];
    let user = await User(connect(DB_CONNECTION, portal)).findOne(
        {
            email: emailInCompany,
        },
        {
            _id: 1,
        }
    );
    if (user !== null) {
        roles = await UserRole(connect(DB_CONNECTION, portal))
            .find({
                userId: user._id,
            })
            .populate([
                {
                    path: 'roleId',
                },
            ]);
        let newRoles = roles.map((role) => role.roleId._id);
        organizationalUnits = await OrganizationalUnit(
            connect(DB_CONNECTION, portal)
        ).find({
            $or: [
                {
                    managers: {
                        $in: newRoles,
                    },
                },
                {
                    deputyManagers: {
                        $in: newRoles,
                    },
                },
                {
                    employees: {
                        $in: newRoles,
                    },
                },
            ],
        });
    }
    if (roles !== []) {
        let arrayRole = [
            'Admin',
            'Super Admin',
            'Employee',
            'Manager',
            'Deputy Manager',
        ];
        roles = roles.filter((role) => !arrayRole.includes(role.roleId.name));
    }

    return {
        roles,
        organizationalUnits,
    };
    // TODO: Còn có role tự tạo, cần loại bỏ Root roles và Company-Defined roles
};

exports.getEmployeeInforByListId = async (portal, listId, params) => {
    let listEmployees = await Employee(connect(DB_CONNECTION, portal))
        .find({
            _id: {
                $in: listId,
            },
        })
        .populate([
            {path: 'degrees.field'},
            {path: 'careerPositions.careerPosition'},
            {path: 'degrees.major'},
            {path: 'certificates.certificate'},
        ])
        .sort({
            createdAt: 1,
        })
        .skip(params.page * params.limit)
        .limit(params.limit);

    let totalList = await Employee(connect(DB_CONNECTION, portal)).countDocuments({
        _id: {
            $in: listId,
        },
    });

    let arrEmployee = [];
    for (let i = 0; i < listEmployees.length; i++) {
        let idCompany = listEmployees[i].company;
        let company = await Company(
            connect(DB_CONNECTION, process.env.DB_NAME)
        ).findById(idCompany);
        let contactPerson = await User(
            connect(DB_CONNECTION, company.shortName)
        ).findById(company.contactPerson);
        company.contactPerson = contactPerson;

        let email = listEmployees[i].emailInCompany;
        let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(
            portal,
            email
        );

        listEmployees[i].company = company;

        let newItem = Object.assign(listEmployees[i]._doc, value);
        arrEmployee.push(newItem);

        listEmployees[i] = {
            ...listEmployees[i]._doc, // sua lỗi thừa thuộc tính
            ...value,
            company,
        };
    }

    return {
        listEmployees,
        totalList,
    };
};
