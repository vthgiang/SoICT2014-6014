const nodemailer = require("nodemailer");
const user = 'vnist.qlcv@gmail.com';
const pass = 'Vnist1234@1234';
let length = 0;
exports.sendEmail = (to, subject, text, html) => {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: user, pass: pass }
    });
    var mainOptions = {
        from: user,
        to: to,
        // inReplyTo: messageId,  
        subject: subject,
        text: text,
        html: html,
        // messageId: to 
    }
    length = length +1 
    const send = ()=>{
        console.log(length);
        transporter.sendMail(mainOptions,(err,success)=>{
            length = length -1;
            if (success) {
                console.log(success);
                let messageId=success.messageId;
                console.log(messageId);
            }
            if (err) {
                console.log(err)
            }
        });
    }
    setTimeout(send,length*5000)
}
