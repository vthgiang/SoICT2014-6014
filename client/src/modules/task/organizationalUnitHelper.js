var getEmployeeSelectBoxItems = (usersOfChildrenOrganizationalUnit, includeManager=true, includeDeputyManager=true, includeEmployee=true)=>{
    let unitMembers;
    let structEmployee=[];

    if(usersOfChildrenOrganizationalUnit){
        let units={}; // // Map: key-id nhân viên, value-phòng/ban nhân viên
        let employees={}; // Map: key-id nhân viên, value-tên nhân viên
        let roles={}; // Map: key-id nhân viên, value-các chức danh của nhân viên
          
        for (let  i=0;i< usersOfChildrenOrganizationalUnit.length;i++){
            var unit = usersOfChildrenOrganizationalUnit[i];

            if (includeManager && unit){
                for (let key in unit.managers){ // Xử lý managers
                    let value = unit.managers[key];
                    for (let j=0; j<value.members.length; j++){
                        let member = value.members[j];
                        if(employees[member._id]){
                            roles[member._id] += ", " + value.name;
                        } else{
                            employees[member._id]=member.name;
                            roles[member._id]=value.name;                        
                            units[member._id]= units[member._id] ? units[member._id]:unit.department;
                        }
                    }
                }
            }

            if (includeDeputyManager){
                for (let key in unit.deputyManagers){ // Xử lý deputyManagers
                    let value = unit.deputyManagers[key];
                    for (let j=0; j<value.members.length; j++){
                        let member = value.members[j];
                        if(employees[member._id]){
                            roles[member._id] += ", " + value.name;
                        } else{
                            employees[member._id]=member.name;
                            roles[member._id]=value.name;                        
                            units[member._id]= units[member._id] ? units[member._id]:unit.department;
                        }
                    }
                }
            }
            

            if (includeEmployee){
                for (let key in unit.employees){ // Xử lý employees
                    let value = unit.employees[key];
                    for (let j=0; j<value.members.length; j++){
                        let member = value.members[j];
                        if(employees[member._id]){
                            roles[member._id] += ", " + value.name;
                        } else{
                            employees[member._id]=member.name;
                            roles[member._id]=value.name;                        
                            units[member._id]= units[member._id] ? units[member._id]:unit.department;
                        }
                    }
                }
            }
        }

        for (let item in employees){
            structEmployee.push({
                id : item,
                name : employees[item],
                role: roles[item],
                department: units[item]
            });
        }
    }

    if(usersOfChildrenOrganizationalUnit){
        unitMembers=usersOfChildrenOrganizationalUnit.map(unitMember=>{
            var temp=[];
            for(let i=0;i<structEmployee.length;i++){
                let item=structEmployee[i];
                if(item.department === unitMember.department){
                    temp.push({
                        text: item.name +" ("+item.role+")",
                        value : item.id
                    });
                }
            }
            var unit ={
                text : unitMember && unitMember.department,
                value : temp
            };

            return unit;                
        });
    }

    return unitMembers;
}

export const getProjectName = (id, listProject) => {
    if (id && listProject && listProject.length > 0) {
        const projectLength = listProject.length;
        for (let i = 0; i < projectLength; i++){
            if (listProject[i]._id === id) 
                return listProject[i].name
        }
    }
}

export default getEmployeeSelectBoxItems;