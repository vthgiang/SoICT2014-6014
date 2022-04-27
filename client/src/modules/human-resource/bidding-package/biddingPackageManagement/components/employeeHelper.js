var getAllEmployeeSelectBoxItems = (listAllEmployees)=>{
    let allEmployee = []
    allEmployee = listAllEmployees.map(item => {
        let text = item.fullName + " (" + item.emailInCompany + ")"
        return {
            value: item._id,
            text:text
        }
    })

    return allEmployee;
}

export default getAllEmployeeSelectBoxItems;