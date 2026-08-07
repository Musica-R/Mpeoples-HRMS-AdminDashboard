import React from 'react';
import '../styles/LegalPage.css';
import { useNavigate } from 'react-router-dom';

const AccountDeletion = () => {
    const navigate = useNavigate();
    return (
        <div className="legal-page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Remove User Account</h1>

            <div className="legal-content">
                <h2>Want to delete your account?</h2>
                <p>If you wish to permanently delete your MPeoples HRMS account, please send an email to the address below using your registered email address or registered mobile number. Please include the reason for requesting account deletion.</p>

                <p><strong>📧 Contact us at:</strong> <a href="mailto:p2pswap786@gmail.com">p2pswap786@gmail.com</a></p>

                <h2>1. Submit Your Request</h2>
                <p>Send an email to <strong>p2pswap786@gmail.com</strong> with the subject: <strong>"Account Deletion Request"</strong></p>
                <p>Please include the following details:</p>
                <ul>
                    <li>Full Name</li>
                    <li>Employee ID (if applicable)</li>
                    <li>Registered Mobile Number</li>
                    <li>Registered Email Address</li>
                    <li>Reason for Account Deletion</li>
                </ul>

                <h2>2. Identity Verification</h2>
                <p>Our support team will verify your identity using the information provided. You may be contacted for additional verification if required. Verification is usually completed within <strong>2 business days</strong>.</p>

                <h2>3. Account Deletion</h2>
                <p>Once your identity has been verified, your account deletion request will be processed. Your account and associated personal information will be permanently deleted within <strong>7 business days</strong>, unless retention is required by applicable law or company policy.</p>

                <h2>Important Notice</h2>
                <ul>
                    <li>Account deletion is permanent and irreversible.</li>
                    <li>Once deleted, your account cannot be restored.</li>
                    <li>Employment records, payroll records, attendance records, leave records, tax records, or other information that the Company is legally required to retain may be preserved in accordance with applicable laws and organizational policies.</li>
                    <li>Any remaining personal information that is not legally required will be permanently removed from our systems.</li>
                </ul>

                <h2>Need Assistance?</h2>
                <p><strong>Email:</strong> p2pswap786@gmail.com<br />
                <strong>Company:</strong> MPeoples Business Solution Private Limited<br />
                <strong>Application:</strong> MPeoples HRMS</p>

                <p className="thank-you">Thank you for trusting Mpeoples.in.</p>
            </div>
        </div>
    );
};

export default AccountDeletion;