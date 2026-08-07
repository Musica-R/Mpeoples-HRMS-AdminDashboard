import React from 'react';
import '../styles/LegalPage.css';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
    const navigate = useNavigate();
    return (
        <div className="legal-page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <h1>Terms and Conditions</h1>
            <p className="effective-date"><strong>Effective Date:</strong> 06/08/2026</p>

            <div className="legal-content">
                <p>Welcome to the <strong>Mpeoples HRMS Mobile Application</strong> ("Application"), owned and operated by <strong>Mpeoples Business Solutions Pvt. Ltd.</strong> By accessing, registering, or using this Application, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these Terms, you must discontinue use of the Application immediately.</p>

                <h2>1. Authorized Access</h2>
                <p>The Mpeoples HRMS Application is intended exclusively for authorized employees, contractors, and personnel of Mpeoples Business Solutions Pvt. Ltd. Unauthorized access, use, or distribution of the Application is strictly prohibited.</p>

                <h2>2. Employee Account Responsibility</h2>
                <p>Each employee is responsible for maintaining the confidentiality of their login credentials. Sharing account credentials or allowing unauthorized access to your account is prohibited.</p>

                <h2>3. Official Business Use</h2>
                <p>The Application shall be used solely for official business purposes, including attendance management, leave requests, payroll viewing, employee profile management, company announcements, notifications, and other HR-related services provided by Mpeoples Business Solutions Pvt. Ltd.</p>

                <h2>4. Accurate Information</h2>
                <p>Employees must ensure that all personal, attendance, leave, and employment-related information submitted through the Application is accurate, complete, and up to date. Submission of false or misleading information may result in disciplinary action in accordance with company policies.</p>

                <h2>5. Attendance and Leave</h2>
                <p>Attendance records, work location, biometric verification, selfie verification (where applicable), and leave requests submitted through the Application constitute official employment records and are subject to company approval procedures and HR policies.</p>

                <h2>6. Data Privacy</h2>
                <p>Mpeoples Business Solutions Pvt. Ltd. collects and processes employee information, including personal details, attendance records, payroll information, location data (where applicable), and employment-related records solely for human resource administration, payroll processing, regulatory compliance, and official business operations.</p>

                <h2>7. Security</h2>
                <p>Employees shall not:</p>
                <ul>
                    <li>Access unauthorized company information.</li>
                    <li>Modify, reverse engineer, or disrupt the Application.</li>
                    <li>Upload malicious software or harmful content.</li>
                    <li>Misuse confidential company information or employee data.</li>
                    <li>Attempt to bypass security mechanisms implemented within the Application.</li>
                </ul>
                <p>Mpeoples Business Solutions Pvt. Ltd. reserves the right to monitor system usage and investigate suspected security violations.</p>

                <h2>8. Intellectual Property</h2>
                <p>The Mpeoples HRMS Application, including its software, design, content, trademarks, logos, source code, and related intellectual property, is the exclusive property of Mpeoples Business Solutions Pvt. Ltd. Unauthorized reproduction, distribution, modification, or commercial use is strictly prohibited.</p>

                <h2>9. Suspension or Termination</h2>
                <p>Mpeoples Business Solutions Pvt. Ltd. reserves the right to suspend or terminate user access without prior notice in cases of policy violations, security concerns, misuse of company resources, fraudulent activities, or termination of employment.</p>

                <h2>10. Limitation of Liability</h2>
                <p>Mpeoples Business Solutions Pvt. Ltd. shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of, or inability to use, the Application, except where required by applicable law.</p>

                <h2>11. Changes to the Terms</h2>
                <p>Mpeoples Business Solutions Pvt. Ltd. reserves the right to modify these Terms and Conditions at any time. Continued use of the Application after such modifications constitutes acceptance of the revised Terms.</p>

                <h2>12. Governing Law</h2>
                <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of India.</p>

                <h2>13. Contact Information</h2>
                <p>For any questions regarding these Terms and Conditions, employees may contact the Human Resources Department or the IT Support Team.</p>
                <p><strong>Company:</strong> Mpeoples Business Solutions Pvt. Ltd.<br />
                <strong>HRMS Application:</strong> Mpeoples HRMS<br />
                <strong>Email:</strong> mpeoplesofficial@gmail.com<br />
                <strong>Contact:</strong> 9487812715</p>

                <p className="thank-you">Thank you for trusting Mpeoples.in.</p>
            </div>
        </div>
    );
};

export default TermsAndConditions;