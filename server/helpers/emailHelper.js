const nodemailer = require("nodemailer");
const user = 'vnist.qlcv@gmail.com';
const pass = 'Vnist1234@1234';
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

    transporter.sendMail(mainOptions,(err,success)=>{
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
