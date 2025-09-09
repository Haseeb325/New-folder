
export async function passwordResetTemplate(link) {
    
    return `
    
        <h2>Please Reset your Password</h2>
        
        <p>Click the button below to reset your password:</p>
        <a href="${link}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">Reset Passwod</a>
        <p>This link will expire in 1 hour.</p>

    `

}