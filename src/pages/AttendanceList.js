import React, { useState, useEffect } from 'react';
import '../styles/AttendanceList.css';
import Lottie from "lottie-react";
import animationData from '../LottieFiles/Completing Tasks.json';
import * as XLSX from "xlsx-js-style";
import { useLocation } from "react-router-dom";
import { createPortal } from 'react-dom';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AttendanceList = () => {

  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const [userType, setUserType] = useState(
    location.state?.userType || 'emp_present'
  );

  const now = new Date();
  const [selfiePopup, setSelfiePopup] = useState({ show: false, img: null });
  // const [showModal, setShowModal] = useState(false);
  // const [employees, setEmployees] = useState([]);
  // const [selectedUser, setSelectedUser] = useState('');
  // const [month, setMonth] = useState(new Date().getMonth() + 1);
  // const [year, setYear] = useState(new Date().getFullYear());
  // const [report, setReport] = useState([]);

  const [dateFilter, setDateFilter] = useState(now.toISOString().split('T')[0]);

  const handleDate = (e) => {
    const { value } = e.target;
    setDateFilter(value);
  };

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice',
  //   },
  // };


  useEffect(() => {

    let isMounted = true;
    let timeoutId;

    const fetchAttendance = async () => {
      try {

        let url = '';

        switch (userType) {
          case 'emp_present':
            url = `${BASE_URL}/attendance-list?date=${dateFilter}`;
            break;

          case 'intern_present':
            url = `${BASE_URL}/attendance-list-intern?date=${dateFilter}`;
            break;

          case 'emp_absent':
            url = `${BASE_URL}/attendance-List-absent?date=${dateFilter}`;
            break;

          case 'intern_absent':
            url = `${BASE_URL}/attendance-List-absentinten?date=${dateFilter}`;
            break;

          default:
            url = `${BASE_URL}/attendance-list?date=${dateFilter}`;
        }
        const response = await fetch(url);

        const result = await response.json();

        if (isMounted && result.success && result.data) {
          setAttendanceData(result.data);
          setLoading(false);
        }

      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        if (isMounted) {
          timeoutId = setTimeout(fetchAttendance, 10000);
        }
      }
    };

    fetchAttendance();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };

  }, [dateFilter, userType]); // ✅ ADD userType HERE

  // ✅ FETCH EMPLOYEE / INTERN LIST
  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const url =
  //         userType === 'intern'
  //           ? `${BASE_URL}/employee-List-roles`
  //           : `${BASE_URL}/employee-List`;

  //       const res = await fetch(url);
  //       const data = await res.json();

  //       if (data.success) {
  //         setEmployees(data.data);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchEmployees();
  // }, [userType]);

  // ✅ FETCH MONTHLY REPORT
  // const fetchMonthlyReport = async () => {
  //   if (!selectedUser) return alert("Select Employee");

  //   try {
  //     const res = await fetch(
  //       `${BASE_URL}/get-Monthly-Summary?user_id=${selectedUser}&month=${month}&year=${year}`
  //     );

  //     const data = await res.json();

  //     if (data.success) {
  //       setReport(data.data.attendance);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const getReportTitle = () => {
    switch (userType) {
      case 'emp_present':
        return 'Employee Check-in List';
      case 'intern_present':
        return 'Intern Check-in List';
      case 'emp_absent':
        return 'Employee Non Check-in List';
      case 'intern_absent':
        return 'Intern Non Check-in List';
      default:
        return 'Attendance Report';
    }
  };

  // ✅ DAILY EXPORT
  const exportDailyReport = () => {
    const worksheetData = attendanceData.map((item, index) => ({
      "S.No": index + 1,
      "Employee Name": item.name || "-",
      "Date": item.attendance_date || "-",
      "Check In": formatTime(item.check_in),
      "Break In": formatTime(item.break_in),
      "Break Out": formatTime(item.break_out),
      "Check Out": formatTime(item.check_out),
      "Status": item.type || "-",
      "Worked Hours": formatDuration(item.worked_hours),
    }));

    // Create worksheet starting from row 5
    const worksheet = XLSX.utils.json_to_sheet(worksheetData, { origin: "A5" });

    // Add Company Name + Report Title + Date
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["MPeoples Business Solutions Pvt Ltd"],
      [getReportTitle()],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      []
    ], { origin: "A1" });


    // Apply styles for header
    ["A1", "A2", "A3"].forEach(cell => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, sz: cell === "A1" ? 16 : 14 },
          alignment: { horizontal: "center" }
        };
      }
    });
    // Merge rows for clean centered header look
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Company Name
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Report Title
      { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }  // Date
    ];

    // Column widths
    worksheet["!cols"] = [
      { wch: 6 },   // S.No
      { wch: 25 },  // Employee Name
      { wch: 15 },  // Date
      { wch: 15 },  // Check In
      { wch: 15 },  // Check Out
      { wch: 15 },  // Status
      { wch: 18 },  // Worked Hours
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    // Export file
    XLSX.writeFile(
      workbook,
      `${getReportTitle().replace(/\s+/g, '_')}_${dateFilter}.xlsx`
    );
  };

  const exportDailyPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(14);
    doc.text("MPeoples Business Solutions Pvt Ltd", 14, 10);
    doc.setFontSize(12);
    doc.text(getReportTitle(), 14, 18);
    doc.text(`Date: ${dateFilter}`, 14, 25);

    // Table
    const columns = [
      "S.No",
      "Employee Name",
      "Date",
      "Check In",
      "Break In",
      "Break Out",
      "Check Out",
      "Status",
      "Worked Hours"
    ];

    const rows = attendanceData.map((item, index) => [
      index + 1,
      item.name || "-",
      item.attendance_date || "-",
      formatTime(item.check_in),
      formatTime(item.break_in),
      formatTime(item.break_out),
      formatTime(item.check_out),
      item.type || "-",
      formatDuration(item.worked_hours)
    ]);

    autoTable(doc, {
      startY: 30,
      head: [columns],
      body: rows,
      styles: { fontSize: 8 },
    });

    doc.save(`${getReportTitle().replace(/\s+/g, "_")}_${dateFilter}.pdf`);
  };

  // const exportMonthlyReport = () => {
  //   const worksheetData = report.map((r, index) => ({
  //     "S.No": index + 1,
  //     "Date": r.date || "-",
  //     "Check In": formatTime(r.check_in),
  //     "Check Out": formatTime(r.check_out),
  //     "Status": r.type || "-",
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(worksheetData, { origin: "A5" });

  //   // Header
  //   XLSX.utils.sheet_add_aoa(worksheet, [
  //     ["MPeoples Business Solutions Pvt Ltd"],
  //     ["Monthly Attendance Report"],
  //     [`Generated on: ${new Date().toLocaleDateString()}`],
  //     []
  //   ], { origin: "A1" });

  //   // Merge (center alignment)
  //   worksheet["!merges"] = [
  //     { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
  //     { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
  //     { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }
  //   ];

  //   // Style (BOLD + CENTER)
  //   ["A1", "A2", "A3"].forEach(cell => {
  //     if (worksheet[cell]) {
  //       worksheet[cell].s = {
  //         font: { bold: true, sz: cell === "A1" ? 16 : 14 },
  //         alignment: { horizontal: "center" }
  //       };
  //     }
  //   });

  //   // Column width
  //   worksheet["!cols"] = [
  //     { wch: 6 },
  //     { wch: 15 },
  //     { wch: 15 },
  //     { wch: 15 },
  //     { wch: 15 }
  //   ];

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Report");

  //   XLSX.writeFile(workbook, "Monthly_Attendance_Report.xlsx");
  // };

  // FORMAT TIME
  const formatTime = (timeString) => {
    if (!timeString || timeString === '00:00:00') return '--';

    const parts = timeString.split(':');

    if (parts.length < 2) return '--';

    let hour = parseInt(parts[0], 10);
    let minute = parts[1];

    if (isNaN(hour) || !minute) return '--';

    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  };

  // FORMAT DATE
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // GET USER INITIALS
  // const getInitials = (name) => {
  //   if (!name) return 'UN';
  //   return name.substring(0, 2).toUpperCase();
  // };

  const openMonthlyPage = () => {
    navigate("/admin/monthly-report", {
      state: { userType }
    });
  };

  // const closeModal = () => {
  //   setShowModal(false);
  //   setReport([]);
  // };

  if (loading) {
    return (
      <div className="attendance-page loading-container">
        <div className="loader-pulse"></div>
        <p>Loading attendance records...</p>
      </div>
    );
  }

  // FORMAT WORKED HOURS
  const formatDuration = (timeString) => {
    if (!timeString || timeString === '00:00:00') return '--';

    const [hours, minutes] = timeString.split(':').map(Number);

    if (hours === 0 && minutes === 0) return '--';

    if (hours === 0) {
      return `${minutes} min`;
    }

    if (minutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${minutes} min`;
  };

  return (
    <div className="attendance-page fade-in-up">
      {/* HEADER */}
      <div className="page-header glass-panel">
        <div className="header-content">
          <div className="permission-title-group">
            {/* <Lottie options={defaultOptions} height={70} width={70} /> */}
            <Lottie animationData={animationData} style={{ width: "70px", height: "70px" }} />
            <div>
              <h1>Attendance Records</h1>
              <p>Track and manage employee daily presence and work hours.</p>
            </div>
          </div>

          <div className="header-actions">

            <button className="primary-btn" onClick={exportDailyPDF}>
              Daily PDF
            </button>

            <button className="primary-btn" onClick={exportDailyReport}>
              Daily Excel
            </button>

            <button className="success-btn" onClick={openMonthlyPage}>
              Monthly Report
            </button>
          </div>

          <div className="header-actions">
            <div className="stat-badge">
              <span className="badge-label">CHECK-INS TODAY</span>
              <span className="badge-value">{attendanceData.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', width: '100%', gap: '30px', padding: '10px' }}>
        <div className="form-group">
          <label>Date Filter</label>
          <input
            type="date"
            name="attendance_date"
            value={dateFilter}
            onChange={handleDate}
            required
          />
        </div>
      </div>

      <div className="attendance-toggle">

        <button className={userType === 'emp_present' ? 'active-toggle' : ''}
          onClick={() => {
            setUserType('emp_present');
            setLoading(true);
          }}> Employee Check-in List </button>

        <button className={userType === 'intern_present' ? 'active-toggle' : ''}
          onClick={() => {
            setUserType('intern_present');
            setLoading(true);
          }}> Intern Check-in List </button>

        <button className={userType === 'emp_absent' ? 'active-toggle' : ''}
          onClick={() => {
            setUserType('emp_absent');
            setLoading(true);
          }}> Employee Non Check-in List </button>

        <button className={userType === 'intern_absent' ? 'active-toggle' : ''}
          onClick={() => {
            setUserType('intern_absent');
            setLoading(true);
          }}> Intern Non Check-in List </button>

      </div>

      {/* TABLE */}
      <div className="attendance-content glass-panel">
        <div className="table-responsive">
          <table className="elegant-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Employee</th>
                <th>Attendance Date</th>
                <th>Check In</th>
                <th>Break In</th>
                <th>Break Out</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Late By</th>
                <th>Worked Hours</th>
                <th>Shortfall / Overtime</th>
              </tr>
            </thead>

            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((record, index) => (
                  <tr key={record.id} className="table-row">
                    {/* EMPLOYEE */}
                    <td>{index + 1}</td>
                    <td>
                      <div className="employee-cell">
                        {/* <div className="avatar-circle">
                          {getInitials(record.name)}
                        </div> */}

                        <span className="employee-name">{record.name}</span>
                      </div>
                    </td>

                    {/* DATE */}
                    <td>{formatDate(record.attendance_date)}</td>

                    {/* CHECK IN */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {record.type !== 'ABSENT' && record.selfie_img ? (
                          <img
                            src={record.selfie_img}
                            alt="selfie"
                            onClick={() => setSelfiePopup({ show: true, img: record.selfie_img })}
                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb', cursor: 'pointer' }}
                          />
                        ) : (
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#dbeafe',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 13, color: '#2563eb'
                          }}>
                            {record.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                        <div className="time-badge in">
                          {record.type === 'ABSENT' ? '--' : formatTime(record.check_in)}
                        </div>
                      </div>
                    </td>

                    <td>
                      {record.type === 'ABSENT' ? '--' : formatTime(record.break_in)}
                    </td>

                    <td>
                      {record.type === 'ABSENT' ? '--' : formatTime(record.break_out)}
                    </td>

                    {/* CHECK OUT */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {record.type !== 'ABSENT' && record.checkout_selfie_img ? (
                          <img
                            src={record.checkout_selfie_img}
                            alt="checkout selfie"
                            onClick={() => setSelfiePopup({ show: true, img: record.checkout_selfie_img })}
                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #16a34a', cursor: 'pointer' }}
                          />
                        ) : (
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#dcfce7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 13, color: '#16a34a'
                          }}>
                            {record.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                        <div className="time-badge out">
                          {record.type === 'ABSENT' ? '--' : formatTime(record.check_out)}
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td>
                      <div className="status-flex">
                        <span
                          className={`status-pill ${record.type === 'PRESENT'
                              ? 'present'
                              : record.type === 'ABSENT'
                                ? 'absent'
                                : record.type === 'ONDUTY'
                                  ? 'onduty'
                                  : 'holiday'
                            }`}
                        >
                          {{
                            'L-H': 'Local Holiday',
                            'C-H': 'Casual Holiday',
                            'W-H': 'Weekend Holiday',
                            'PRESENT': 'Present',
                            'ABSENT': 'Absent',
                            'ONDUTY': 'On Duty'
                          }[record.type] || '—'}
                        </span>

                        {record.late_checkin === 1 && (
                          <span
                            className="late-indicator"
                            title={`Late by ${record.late_checkin_time}`}
                          >
                            Late
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {record.late_checkin === 1
                        ? formatDuration(record.late_checkin_time)
                        : '--'}
                    </td>

                    {/* WORKED HOURS */}
                    <td>
                      <span className="hours-text">
                        {formatDuration(record.worked_hours)}
                      </span>
                    </td>

                    {/* SHORTFALL / OVERTIME */}
                    <td>
                      <span className="hours-text">
                        {formatDuration(record.overtimed_hours)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No attendance records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>


        </div>
      </div>
      {/* {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>Monthly Report</h2>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>

            <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} />
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />

            <button onClick={fetchMonthlyReport}>Get Report</button>
            <button onClick={exportMonthlyReport}>Export Excel</button>
            <button onClick={closeModal}>Close</button>
            <div className="modal-table">
              {report.length === 0 ? (
                <p style={{ marginTop: "10px" }}>No data available</p>
              ) : (
                <table className="elegant-table" style={{ marginTop: "10px" }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.map((r, i) => (
                      <tr key={i}>
                        <td>{formatDate(r.date)}</td>
                        <td>{formatTime(r.check_in)}</td>
                        <td>{formatTime(r.check_out)}</td>
                        <td>{r.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      )} */}
      {selfiePopup.show && createPortal(
        <div
          onClick={() => setSelfiePopup({ show: false, img: null })}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: '14px', padding: '16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
            }}
          >
            <img
              src={selfiePopup.img}
              alt="selfie preview"
              style={{ width: 300, height: 300, objectFit: 'cover', borderRadius: '10px', display: 'block' }}
            />
            <button
              onClick={() => setSelfiePopup({ show: false, img: null })}
              style={{
                width: '100%', padding: '8px 0', borderRadius: '8px', border: 'none',
                background: '#1e293b', color: '#fff', fontWeight: 600,
                fontSize: 14, cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AttendanceList;
