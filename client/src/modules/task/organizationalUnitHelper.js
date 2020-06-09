var getEmployeeSelectBoxItems = (usersOfChildrenOrganizationalUnit)=>{
    let unitMembers;
    let structEmployee=[];

    if(usersOfChildrenOrganizationalUnit){
        let units={};
        let employees={}; // Map: key-id nhân viên, value-tên nhân viên
        let roles={}; // Map: key-id nhân viên, value-các chức danh của nhân viên
          
        for (let  i=0;i< usersOfChildrenOrganizationalUnit.length;i++){
            var unit = usersOfChildrenOrganizationalUnit[i];

            for( let j=0;j < unit.deans.length;j++){ // Xử lý deans
                let dean = unit.deans[j];
                if(employees[dean._id]){
                    roles[dean._id] += ", " + unit.roles.dean.name;
                } else{
                    employees[dean._id]=dean.name;
                    roles[dean._id]=unit.roles.dean.name;                        
                    units[dean._id]= units[dean._id] ? units[dean._id]:unit.department;
                }
            }

            for( let j=0;j < unit.viceDeans.length;j++){ // Xử lý viceDeans
                let viceDean = unit.viceDeans[j];

                if(employees[viceDean._id]){
                    roles[viceDean._id] +=  ", "+unit.roles.viceDean.name;
                } else{
                    employees[viceDean._id]=viceDean.name;
                    roles[viceDean._id]=unit.roles.viceDean.name;                        
                    units[viceDean._id]= units[viceDean._id] ? units[viceDean._id]:unit.department;
                }
            }

            for( let j=0;j < unit.employees.length;j++){ // Xử lý employees
                let employee = unit.employees[j];
                
                if(employees[employee._id]){
                    roles[employee._id ]+=  ", "+unit.roles.employee.name;
                } else{
                    employees[employee._id]=employee.name;
                    roles[employee._id]=unit.roles.employee.name;                        
                    units[employee._id]= units[employee._id] ? units[employee._id]:unit.department;
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
                text : unitMember.department,
                value : temp
            };

            return unit;                
        });
    }

    return unitMembers;
}

export default getEmployeeSelectBoxItems;