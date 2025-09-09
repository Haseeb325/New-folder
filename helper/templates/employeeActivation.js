
export default function employeeActivationTemplate(link) {
  return `
    <h2>Welcome to the HR Portal</h2>
    <p>You have been invited to join the HR Portal by the Admin.</p>
    <p>Click the button below to activate your account:</p>
    <a href="${link}" target="_blank" 
       style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">
       Activate Account
    </a>
    <p>This link will expire in 1 hour.</p>
  `;
}
