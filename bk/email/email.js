import { transporter } from "./email.config.js";
import { Verification_Email_Template, Welcome_Email_Template } from "./email_template.js";


export const sendVerificationEamil=async(email,verificationCode)=>{
    try {
     const response=   await transporter.sendMail({
            from: `${process.env.EMAIL}`,
            to: email,
            subject: "Verify your Email",
            text: "Verify your Email",
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}
export const senWelcomeEmail=async(email,name)=>{
    try {
     const response=   await transporter.sendMail({
            from: `${process.env.EMAIL}`,

            to: email,
            subject: "Welcome Email",
            text: "Welcome Email",
            html: Welcome_Email_Template.replace("{name}",name)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}