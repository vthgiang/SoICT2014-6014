import Swal from 'sweetalert2';

export const showListInSwal = (lists, title) => {
    if (lists?.length > 0) {
        Swal.fire({
            html: `<h3 style="color: red"><div>${title}</div> </h3>
                <ul style="text-align:left;font-size: 16px;">
                    ${lists.map(o => (
                        `<li style="padding: 7px">${o}</li>`
                        )).join('')
                    }
                </ul>
            `,
            width: "40%"
        })
    }
}