// templates/adminApproval.js
export default function adminApprovalTemplate(employeeEmail, link) {
  return `
    <h2>New Employee Pending Approval</h2>
    <p>HR has added a new employee with the email: <strong>${employeeEmail}</strong></p>
    <p>Click the button below to review and approve the employee:</p>
    <a href="${link}" target="_blank" 
       style="display:inline-block;padding:10px 20px;background-color:#EF4444;color:#fff;text-decoration:none;border-radius:5px;">
       Approve Employee
    </a>
    <p>This link will expire in 1 hour.</p>
  `;
}
