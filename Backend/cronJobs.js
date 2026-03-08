import cron from "node-cron";
import nodemailer from "nodemailer";
import appointmentModel from "./models/appointmentModel.js";

// Setup mail transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER || "gabriellamuloshi@gmail.com",
        pass: process.env.SMTP_PASS || "xlnxakwejkoeqrzk",
    },
});

export const initCronJobs = () => {
    // Run every day at 8:00 AM
    cron.schedule("0 8 * * *", async () => {
        console.log("⏰ Running automated CRON Job: Daily Appointment Reminders...");

        try {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            // Start and end of exactly tomorrow
            const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
            const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

            const appointments = await appointmentModel.find({
                slotDate: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
                cancelled: false, // Don't remind canceled folks
            });

            if (!appointments || appointments.length === 0) {
                console.log("📝 No appointments for tomorrow to remind.");
                return;
            }

            console.log(`✉️ Sending out ${appointments.length} reminder emails to customers...`);

            for (const appointment of appointments) {
                // Skip if there's no email or it's somehow missing
                if (!appointment.userData || !appointment.userData.email) continue;

                const email = appointment.userData.email;

                const mailOptions = {
                    from: process.env.SMTP_USER || "gabriellamuloshi@gmail.com",
                    to: email,
                    subject: "Aura Time: Upcoming Appointment Reminder",
                    text: `Hello ${appointment.userData.name},

This is an automated friendly reminder that you have an appointment for **${appointment.serviceData.service_name}** scheduled for **tomorrow at ${appointment.slotTime}**.

Please try to arrive 10 minutes early to ensure a perfectly smooth experience!

We look forward to hosting you!

Warm regards,
AuraTime & Glow Spa`
                };

                // Send email silently in the background
                await transporter.sendMail(mailOptions);
            }

            console.log("✅ Automated reminders complete!");
        } catch (error) {
            console.error("❌ Error in Automated Cron Reminder:", error.message);
        }
    });

    console.log("⚙️ Cron Jobs initialized (Reminders scheduled for 8:00 AM Daily)");
};
