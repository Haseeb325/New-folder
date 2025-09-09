
export default function employeeStatusRejectTemplate( RejectReason, empEmail) {
  return `
    <h2>Welcome to the HR Portal</h2>
    <p>This Employee ${empEmail} Rejected by this reason ${RejectReason}</p>
    
  `;
}
