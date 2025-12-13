import { useRef } from "react";
import emailjs from "emailjs-com";

const ContactForm = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_alug20r",
      "template_w0epjvn",
      form.current,
      "XbY-6mEHYkvwDVZcO"
    )
    .then(
      () => {
        alert("Email sent successfully!");
        form.current.reset();
      },
      (error) => {
        alert("Failed to send email: " + error.text);
      }
    );
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "auto",
      padding: "30px",
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>📧 Contact Us</h2>

      <form ref={form} onSubmit={sendEmail}>
        <label style={labelStyle}>Subject</label>
        <input type="text" name="title" required style={inputStyle} placeholder="e.g. Booking Inquiry" />

        <label style={labelStyle}>Name</label>
        <input type="text" name="name" required style={inputStyle} placeholder="Your Full Name" />

        <label style={labelStyle}>Email</label>
        <input type="email" name="email" required style={inputStyle} placeholder="you@example.com" />

        <label style={labelStyle}>Message</label>
        <textarea name="message" required rows="5" style={textareaStyle} placeholder="Type your message here..." />

        <button type="submit" style={buttonStyle}>Send Message</button>
      </form>

      <a
        href="https://wa.me/60123456789?text=Hello%2C%20I'm%20interested%20in%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
        style={whatsappButtonStyle}
      >
        💬 Chat on WhatsApp
      </a>
    </div>
  );
};

// Reusable styles
const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "bold",
  color: "#555"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontSize: "14px"
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#583603d7",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer"
};

const whatsappButtonStyle = {
  display: "block",
  marginTop: "20px",
  textAlign: "center",
  padding: "12px",
  backgroundColor: "#25D366",
  color: "#fff",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: "bold"
};

export default ContactForm;
