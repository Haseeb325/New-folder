
export default function employeeStatusActiveTemplate(link) {
  return `
    <h2>Welcome to the HR Portal</h2>
    <p>Congratulations You Are Approved By Admin</p>
    <p>Click the button below to Login your Account:</p>
    <a href="${link}" target="_blank" 
       style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">
       Activate Account
    </a>
    
  `;
}
