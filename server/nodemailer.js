const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: 'wedzigew777@gmail.com',
        pass: 'thboiwhbbufbgmxh'
    }
});
const mailer = (message) => {
    transporter.sendMail(message, (err, info) => {
        if(err){
            console.log("Email sent: ", info);
            
            return console.log(err);

        }
    })
}



module.exports = mailer