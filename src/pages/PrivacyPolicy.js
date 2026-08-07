import React from 'react';
import '../styles/LegalPage.css';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    return (
        <div className="legal-page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Privacy Policy</h1>
            <p className="effective-date"><strong>Effective Date:</strong> 06/08/2026</p>

            <div className="legal-content">
                <p><strong>Mpeoples Business Solutions Pvt. Ltd.</strong> ("Company", "we", "our", or "us") is committed to protecting the privacy and security of employee information. This Privacy Policy explains how the Mpeoples HRMS mobile application ("Application") collects, uses, stores, and protects your personal information.</p>
                <p>By using the Application, you acknowledge that you have read and understood this Privacy Policy.</p>

                <h2>1. Information We Collect</h2>
                <ul>
                    <li>Full Name</li>
                    <li>Employee ID</li>
                    <li>Email Address</li>
                    <li>Phone Number</li>
                    <li>Department and Designation</li>
                    <li>Profile Photograph</li>
                    <li>Attendance Records</li>
                    <li>Leave Records</li>
                    <li>Payroll Information</li>
                    <li>Location Information</li>
                    <li>Biometric or Selfie Verification</li>
                    <li>Application Usage Logs</li>
                    <li>Push Notification Token</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>The collected information is used solely for official business purposes, including:</p>
                <ul>
                    <li>Employee authentication</li>
                    <li>Attendance and time tracking</li>
                    <li>Leave management</li>
                    <li>Payroll processing</li>
                    <li>Employee profile management</li>
                    <li>Internal communication</li>
                    <li>Company announcements and notifications</li>
                    <li>Security monitoring</li>
                    <li>Compliance with company policies and legal obligations</li>
                </ul>

                <h2>3. Data Sharing</h2>
                <p>We do <strong>not</strong> sell, rent, or trade employee personal information. Information may only be shared:</p>
                <ul>
                    <li>Within Mpeoples Business Solutions Pvt. Ltd. for HR and administrative purposes.</li>
                    <li>With authorized service providers supporting the Application.</li>
                    <li>When required by applicable law or government authorities.</li>
                </ul>

                <h2>4. Data Security</h2>
                <p>We implement reasonable administrative, technical, and organizational safeguards to protect employee information against unauthorized access, loss, misuse, alteration, or disclosure. Despite these measures, no electronic storage or internet transmission is completely secure.</p>

                <h2>5. User Responsibilities</h2>
                <ul>
                    <li>Keeping login credentials confidential.</li>
                    <li>Reporting unauthorized account access immediately.</li>
                    <li>Ensuring the information they provide is accurate and up to date.</li>
                </ul>

                <h2>6. Data Retention</h2>
                <p>Employee information will be retained only for as long as necessary to:</p>
                <ul>
                    <li>Maintain employment records.</li>
                    <li>Comply with legal and regulatory requirements.</li>
                    <li>Fulfill legitimate business purposes.</li>
                </ul>
                <p>Data may be securely deleted when it is no longer required.</p>

                <h2>7. Permissions Used</h2>
                <ul>
                    <li><strong>Camera</strong> – For profile photo, attendance selfie, or document capture.</li>
                    <li><strong>Location</strong> – For attendance verification and office location validation.</li>
                    <li><strong>Storage/Photos</strong> – For uploading profile pictures or documents.</li>
                    <li><strong>Notifications</strong> – To receive company announcements and important HR updates.</li>
                    <li><strong>Internet Access</strong> – To communicate securely with company servers.</li>
                </ul>
                <p>Permissions are used only for their intended HR-related functionality.</p>

                <h2>8. Children's Privacy</h2>
                <p>The Application is intended exclusively for authorized employees and is not designed for individuals under 18 years of age.</p>

                <h2>9. Changes to this Privacy Policy</h2>
                <p>Mpeoples Business Solutions Pvt. Ltd. reserves the right to modify this Privacy Policy at any time. Updated versions will be published within the Application and will become effective immediately upon publication.</p>

                <h2>10. Consent</h2>
                <p>By accessing or using the Mpeoples HRMS Application, you consent to the collection, processing, storage, and use of your information as described in this Privacy Policy.</p>

                <h2>11. Contact Us</h2>
                <p>If you have any questions regarding this Privacy Policy or the handling of your personal information, please contact us:</p>
                <p><strong>Company:</strong> Mpeoples Business Solutions Pvt. Ltd.<br />
                <strong>Application:</strong> Mpeoples HRMS<br />
                <strong>Email:</strong> mpeoplesofficial@gmail.com<br />
                <strong>Phone:</strong> +91 9487812715</p>

                <p className="thank-you">Thank you for trusting Mpeoples.in.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;