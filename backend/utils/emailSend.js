const { jsPDF } = require("jspdf");
const nodemailer = require("nodemailer");
const dataParserForItems = require("./dataParser");
require("jspdf-autotable");

////////////////////////////////////////////////////////////////////////////////////////////////
// Generate PDF
function generatePDF(data) {
  const doc = new jsPDF({ orientation: "vertical" });

  doc.setFontSize(24);
  doc.text("Your Expenses In Last One Month", 105, 20, { align: "center" });
  doc.line(20, 25, 190, 25);

  doc.autoTable({
    startY: 40,
    head: [["S.No", "Date", "Amount", "Category"]],
    body: data.body,
    foot: [["", "Total", data.total, ""]],
    theme: "grid",
    styles: {
      textColor: [0, 0, 0],
      fontSize: 12
    }
  });

  return doc.output("dataurlstring").split(",")[1];
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Send Email with PDF
async function sendEmailWithAttachment(recipient, items) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const body = dataParserForItems(items);
    const pdfContent = generatePDF(body);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: "Monthly Expense Report",
      text: "Please find attached your expense report for this month.",
      attachments: [
        {
          filename: "expense_report.pdf",
          content: pdfContent,
          encoding: "base64"
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    return true;

  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return false;
  }
}

module.exports = sendEmailWithAttachment;
