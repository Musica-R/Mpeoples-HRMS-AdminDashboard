import React, { useEffect, useState } from 'react';
import '../styles/EmpList.css';
import { FiEdit2, FiX, FiSave, FiSearch, FiChevronDown } from 'react-icons/fi';
import Lottie from "lottie-react";
import animationData from '../LottieFiles/Employee Search.json';
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_URL = `${BASE_URL}/employee-List`;
const UPDATE_URL = `${BASE_URL}/update-profile`;
const INACTIVE_URL = `${BASE_URL}/employees/inactive`;
const INTERN_ACTIVE_URL = `${BASE_URL}/employee-List-roles`;
const INTERN_INACTIVE_URL = `${BASE_URL}/employees/inactive/roles`;
const DELETE_URL = `${BASE_URL}/remove-user`;
const TEAM_LIST_URL = 'https://mps.mpdatahub.com/api/teams/team-list';
const TEAM_BY_ID_URL = 'https://mps.mpdatahub.com/api/team-by-id';

export default function EmpList() {
  /* ───────── Employee lists ───────── */
  const [employees, setEmployees] = useState([]);
  const [inactiveEmployees, setInactiveEmployees] = useState([]);
  const [activeInterns, setActiveInterns] = useState([]);
  const [inactiveInterns, setInactiveInterns] = useState([]);

  const navigate = useNavigate();

  /* ───────── Team state ───────── */
  const [teamList, setTeamList] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('all');   // 'all' or team id
  const [teamMembers, setTeamMembers] = useState([]);      // raw data from team-by-id
  const [teamLoading, setTeamLoading] = useState(false);

  /* ───────── UI state ───────── */
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  const [pwdConfirmModal, setPwdConfirmModal] = useState(false);
  const [pwdEmailModal, setPwdEmailModal] = useState(false);
  const [pwdEmail, setPwdEmail] = useState('');
  const [pwdSending, setPwdSending] = useState(false);
  const [pwdSendError, setPwdSendError] = useState('');
  const [pwdSendSuccess, setPwdSendSuccess] = useState('');
  const [pwdTargetEmp, setPwdTargetEmp] = useState(null);

  const [saveError, setSaveError] = useState('');

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  /* ───────── Lottie ───────── */
  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData,
  //   rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  // };

  /* ═══════════════════════════════════════════
     FETCH HELPERS
  ═══════════════════════════════════════════ */
  const fetchEmployees = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.success) setEmployees(json.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const fetchInactiveEmployees = async () => {
    try {
      const res = await fetch(INACTIVE_URL);
      const json = await res.json();
      if (json.success) setInactiveEmployees(json.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const fetchActiveInterns = async () => {
    try {
      const res = await fetch(INTERN_ACTIVE_URL);
      const json = await res.json();
      if (json.success) setActiveInterns(json.data);
    } catch (err) { console.log(err); }
  };

  const fetchInactiveInterns = async () => {
    try {
      const res = await fetch(INTERN_INACTIVE_URL);
      const json = await res.json();
      if (json.success) setInactiveInterns(json.data);
    } catch (err) { console.log(err); }
  };

  const fetchTeamList = async () => {
    try {
      const res = await fetch(TEAM_LIST_URL);
      const json = await res.json();
      if (json.success) setTeamList(json.data);
    } catch (err) { console.log(err); }
  };

  const fetchTeamById = async (teamId) => {
    setTeamLoading(true);
    try {
      const res = await fetch(`${TEAM_BY_ID_URL}?team_id=${teamId}`);
      const json = await res.json();
      if (json.success) setTeamMembers(json.data);
      else setTeamMembers([]);
    } catch (err) {
      console.log(err);
      setTeamMembers([]);
    }
    setTeamLoading(false);
  };

  const refreshAll = () => {
    fetchEmployees();
    fetchInactiveEmployees();
    fetchActiveInterns();
    fetchInactiveInterns();
    if (selectedTeam !== 'all') fetchTeamById(selectedTeam);
  };

  /* ───────── Initial load ───────── */
  useEffect(() => {
    fetchEmployees();
    fetchInactiveEmployees();
    fetchActiveInterns();
    fetchInactiveInterns();
    fetchTeamList();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const response = await fetch('https://mps.mpdatahub.com/api/roles');
        const result = await response.json();

        if (result.success) {
          setRoles(result.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
      setLoadingRoles(false);
    };

    fetchRoles();
  }, []);

  /* ───────── Team selection change ───────── */
  const handleTeamChange = (e) => {
    const val = e.target.value;
    setSelectedTeam(val);
    setSearchTerm('');
    if (val === 'all') {
      setTeamMembers([]);
      setFilterStatus('active');
    } else {
      fetchTeamById(val);
    }
  };

  /* ═══════════════════════════════════════════
     DELETE
  ═══════════════════════════════════════════ */
  const openDelete = (id) => { setDeleteId(id); setDeleteModal(true); };

  const deleteEmployee = async () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteModal(false);
    setDeleteId(null);
    try {
      setLoading(true);
      const res = await fetch(`${DELETE_URL}?id=${id}`);
      const json = await res.json();
      if (json.success) refreshAll();
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  /* ═══════════════════════════════════════════
     STATUS TOGGLE
  ═══════════════════════════════════════════ */
  const updateEmployeeStatus = async (id, status) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/update-Employee-Status?user_id=${id}&status=${status}`);
      const json = await res.json();
      if (json.success) refreshAll();
    } catch (err) { console.log(err); }
    setLoading(false);
  };

  const handleToggle = (id, status) => updateEmployeeStatus(id, status === 0 ? 1 : 0);

  /* ═══════════════════════════════════════════
     EDIT
  ═══════════════════════════════════════════ */
  const openEdit = (emp) => {
    setEditData({
      id: emp.id,
      name: emp.name || '',
      empid: emp.empid || '',
      email: emp.email || '',
      mobile: emp.mobile || '',
      position: emp.position || '',
      address: emp.address || '',
      dob: emp.dob || '',
      designation: emp.designation || '',
      qualification: emp.qualification || '',
      joining_date: emp.joining_date || '',
      experience: emp.experience || '',
      employee_status: emp.employee_status || '',
      start_time: emp.start_time ? emp.start_time.slice(0, 5) : '',
      end_time: emp.end_time ? emp.end_time.slice(0, 5) : '',

      role_id: emp.role_id || '',
      profile_img: null   // ✅ ADD THIS LINE

    });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    if (!editData?.id) { setSaveError('ID missing'); return; }
    setSaving(true);
    setSaveError('');
    try {
      const formData = new FormData();
      const toHMS = (t) => (!t ? '' : t.length === 8 ? t : t + ':00');
      formData.append('id', editData.id);
      if (editData.name) formData.append('name', editData.name);
      if (editData.empid) formData.append('empid', editData.empid);
      if (editData.email) formData.append('email', editData.email);
      if (editData.mobile) formData.append('mobile', editData.mobile);
      if (editData.position) formData.append('position', editData.position);
      if (editData.address) formData.append('address', editData.address);
      if (editData.dob) formData.append('dob', editData.dob);
      if (editData.start_time) formData.append('start_time', toHMS(editData.start_time));
      if (editData.end_time) formData.append('end_time', toHMS(editData.end_time));
      if (editData.designation) formData.append('designation', editData.designation);
      if (editData.qualification) formData.append('qualification', editData.qualification);
      if (editData.joining_date) formData.append('joining_date', editData.joining_date);
      if (editData.experience) formData.append('experience', editData.experience);
      if (editData.employee_status) formData.append('employee_status', editData.employee_status);

      if (editData.role_id) formData.append('role_id', editData.role_id);

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      if (editData.profile_img) {
        formData.append('profile_img', editData.profile_img);
      }

      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      const res = await fetch(UPDATE_URL, { method: 'POST', body: formData });
      const json = await res.json();

      if (json.success) {
        await refreshAll();
        setEditModal(false);
      } else {
        setSaveError(json.message || 'Update failed');
      }
    } catch {
      setSaveError('Network error');
    }
    setSaving(false);
  };


  const sendPasswordReset = async () => {
    if (!pwdEmail.trim()) { setPwdSendError('Please enter an email.'); return; }
    setPwdSending(true);
    setPwdSendError('');
    setPwdSendSuccess('');
    try {
      const res = await fetch('https://mps.mpdatahub.com/api/forgot-Password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pwdEmail }),
      });
      const json = await res.json();
      if (json.success) {
        setPwdSendSuccess('Password reset email sent successfully!');
        setTimeout(() => {
          setPwdEmailModal(false);
          setPwdEmail('');
          setPwdSendSuccess('');
        }, 2000);
      } else {
        setPwdSendError(json.message || 'Failed to send email.');
      }
    } catch {
      setPwdSendError('Network error. Please try again.');
    }
    setPwdSending(false);
  };

  /* ═══════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════ */
  const formatTime = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    let h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  const getDesignationLabel = (des) => {
    if (des === 'TL') return 'Team Lead';
    if (des === 'TM') return 'Team Member';
    return des;
  };

  /* ═══════════════════════════════════════════
     SEARCH FILTER  (normal tabs)
  ═══════════════════════════════════════════ */
  const normalize = (str) =>
    str.toLowerCase().replace(/\s+/g, ' ').trim();

  const search = (arr) =>
    arr.filter((emp) => {
      const term = normalize(searchTerm);

      return (
        normalize(emp.name || '').includes(term) ||
        normalize(emp.empid || '').includes(term)
      );
    });

  const active = search(employees);
  const inactive = search(inactiveEmployees);
  const activeInternFiltered = search(activeInterns);
  const inactiveInternFiltered = search(inactiveInterns);

  const counts = {
    active: employees.length,
    inactive: inactiveEmployees.length,
    activeIntern: activeInterns.length,
    inactiveIntern: inactiveInterns.length,
  };

  /* ═══════════════════════════════════════════
     TEAM VIEW — split TL / TM
  ═══════════════════════════════════════════ */
  const teamLeads = teamMembers.filter((m) => m.designation === 'TL');
  const teamMembersFiltered = teamMembers.filter((m) => m.designation !== 'TL');

  /* ═══════════════════════════════════════════
     EMPLOYEE CARD  (reusable)
  ═══════════════════════════════════════════ */
  const EmployeeCard = ({ emp, showDelete }) => (
    <div className="emp-card" key={emp.id}>
      <div className="emp-card-top">
        <img src={emp.profile_img} alt={emp.name} className="emp-avatar" />
        <div className="emp-badge">{emp.empid}</div>
      </div>

      <div className="emp-card-body">
        <h3>{emp.name}</h3>
        <span className="emp-position">{emp.position || 'N/A'}</span>

        <p><strong>Email:</strong>        {emp.email}</p>
        <p><strong>Phone:</strong>        {emp.mobile}</p>
        <p><strong>DOB:</strong>          {emp.dob || 'N/A'}</p>
        <p><strong>Address:</strong>      {emp.address}</p>
        <p>
          <strong>Work Time:</strong>{' '}
          {formatTime(emp.start_time)} to {formatTime(emp.end_time)}
        </p>
        <p><strong>Designation:</strong>  {getDesignationLabel(emp.designation) || 'N/A'}</p>
        <p><strong>Qualification:</strong>{emp.qualification || 'N/A'}</p>
        <p><strong>Joining Date:</strong> {emp.joining_date || 'N/A'}</p>
        <p><strong>Experience:</strong>   {emp.experience || 'N/A'}</p>
        <p><strong>Status:</strong>       {emp.employee_status || 'N/A'}</p>
        <p><strong>Role:</strong>       {emp.role_name || 'N/A'}</p>

       

        <div className="emp-card-actions">
          <label className="switch">
            <input
              type="checkbox"
              checked={emp.status === 1}
              onChange={() => handleToggle(emp.id, emp.status)}
            />
            <span className="slider"></span>
          </label>
          <span className="status-text">{emp.status === 1 ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      <div className="emp-card-actions">
        {showDelete ? (
          <button className="btn-delete" onClick={() => openDelete(emp.id)}>Delete</button>
        ) : (
          <button className="btn-edit" onClick={() => openEdit(emp)}>
            <FiEdit2 /> Edit
          </button>
        )}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <div className="emplist-page">

      {/* ── HEADER ── */}
      <div className="emplist-header">
        <div className="emplist-title">
          <Lottie animationData={animationData} style={{ width: "90px", height: "90px" }} />
          <div>
            <h1>Employee List</h1>
            <p>{employees.length} employees</p>
          </div>
        </div>

        <div className="emplist-header-right">

          <div className="topbar-actions">
            <button
              className="btn-add"
              onClick={() => navigate("/admin/add-employee")}
            >
              + Add Employee
            </button>

            <button
              className="btn-add"
              onClick={() => navigate("/admin/add-team")}
            >
              + Add Team
            </button>
          </div>
          {/* Team dropdown */}
          <div className="team-select-wrap">
            <select
              className="team-select"
              value={selectedTeam}
              onChange={handleTeamChange}
            >
              <option value="all">All Teams</option>
              {teamList.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <FiChevronDown className="team-select-icon" />
          </div>

          {/* Search */}
          <div className="emplist-search-wrap">
            <FiSearch className="search-icon" />
            <input
              className="emplist-search"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {/* ════════════════════════════════════
          ALL TEAMS VIEW  (default)
      ════════════════════════════════════ */}
      {selectedTeam === 'all' && (
        <>
          <div className="pl-tabs">
            {['active', 'inactive', 'activeIntern', 'inactiveIntern'].map((s) => (
              <button
                key={s}
                className={`pl-tab ${filterStatus === s ? 'pl-tab--active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="pl-tab-count">{counts[s]}</span>
              </button>
            ))}
          </div>

          <div className="emp-grid">
            {loading ? (
              <div className="emp-loader"><p>Loading employees...</p></div>
            ) : (
              (
                filterStatus === 'active' ? active
                  : filterStatus === 'inactive' ? inactive
                    : filterStatus === 'activeIntern' ? activeInternFiltered
                      : inactiveInternFiltered
              ).map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  emp={emp}
                  showDelete={filterStatus === 'inactive' || filterStatus === 'inactiveIntern'}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* ════════════════════════════════════
          SPECIFIC TEAM VIEW
      ════════════════════════════════════ */}

      {selectedTeam !== 'all' && (
        <>
          {teamLoading ? (
            <div className="emp-loader"><p>Loading team...</p></div>
          ) : (
            <>
              {/* ── Team Leads ── */}
              {teamLeads.length > 0 && (
                <div className="team-section">
                  <div className="team-section-header">
                    <span className="team-section-badge tl-badge">TL</span>
                    <h2 className="team-section-title">Team Lead</h2>
                    <span className="team-section-count">{teamLeads.length}</span>
                  </div>
                  <div className="emp-grid">
                    {teamLeads
                      .filter(
                        (emp) =>
                          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.empid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((emp) => (
                        <EmployeeCard key={emp.id} emp={emp} showDelete={false} />
                      ))}
                  </div>
                </div>
              )}

              {/* ── Team Members ── */}
              {teamMembersFiltered.length > 0 && (
                <div className="team-section">
                  <div className="team-section-header">
                    <span className="team-section-badge tm-badge">TM</span>
                    <h2 className="team-section-title">Team Members</h2>
                    <span className="team-section-count">{teamMembersFiltered.length}</span>
                  </div>
                  <div className="emp-grid">
                    {teamMembersFiltered
                      .filter(
                        (emp) =>
                          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.empid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((emp) => (
                        <EmployeeCard key={emp.id} emp={emp} showDelete={false} />
                      ))}
                  </div>
                </div>
              )}

              {teamLeads.length === 0 && teamMembersFiltered.length === 0 && (
                <div className="emp-loader"><p>No members in this team.</p></div>
              )}
            </>
          )}
        </>
      )}

      {/* ════════════════════════════════════
          EDIT MODAL
      ════════════════════════════════════ */}
      {editModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Edit Employee</h2>
              <button className="modal-close" onClick={() => setEditModal(false)} style={{ width: 100 }}>
                <FiX />
              </button>
            </div>

            {saveError && <div className="modal-api-error">{saveError}</div>}

            <div className="modal-form">
              <input name="name" value={editData.name} onChange={handleEditChange} placeholder="Name" />
              <input name="empid" value={editData.empid} onChange={handleEditChange} placeholder="Emp ID" />
              <input name="email" value={editData.email} onChange={handleEditChange} placeholder="Email" />
              <input name="mobile" value={editData.mobile} onChange={handleEditChange} placeholder="Mobile" />
              <input name="position" value={editData.position} onChange={handleEditChange} placeholder="Position" />
              <input type="date" name="dob" value={editData.dob} onChange={handleEditChange} />
              <input name="address" value={editData.address} onChange={handleEditChange} placeholder="Address" />
              <input type="time" name="start_time" value={editData.start_time} onChange={handleEditChange} />
              <input type="time" name="end_time" value={editData.end_time} onChange={handleEditChange} />
              <select name="designation" value={editData.designation} onChange={handleEditChange}>
                <option value="">Select Designation</option>
                <option value="TL">Team Lead (TL)</option>
                <option value="TM">Team Member (TM)</option>
              </select>
              <input name="qualification" value={editData.qualification} onChange={handleEditChange} placeholder="Qualification" />
              <input type="date" name="joining_date" value={editData.joining_date} onChange={handleEditChange} />
              <input name="experience" value={editData.experience} onChange={handleEditChange} placeholder="Experience" />
              <select name="employee_status" value={editData.employee_status} onChange={handleEditChange}>
                <option value="">Select Status</option>
                <option value="working">Working</option>
                <option value="notice_period">Notice Period</option>
                <option value="relieved">Relieved</option>
              </select>

              <input
                type="file"
                name="profile_img"
                accept="image/*"
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    profile_img: e.target.files[0],
                  }))
                }
              />
              <div className="form-group">
                <select
                  name="role_id"
                  value={editData.role_id}
                  onChange={handleEditChange}
                >
                  <option value="">
                    {loadingRoles ? 'Loading...' : 'Select Role'}
                  </option>

                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
           
            </div>
          

           {/* Change Password Button */}
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <button
            type="button"
            className="btn-change-pwd"
            onClick={() => {
              setPwdTargetEmp(editData);
              setPwdEmail(editData.email || '');
              setPwdConfirmModal(true);
            }}
          >
            Change Password
          </button>
        </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditModal(false)}>Cancel</button>
              <button className="btn-save" onClick={saveEdit} disabled={saving}>
                {saving ? 'Saving...' : <><FiSave /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          DELETE MODAL
      ════════════════════════════════════ */}
      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
            </div>
            <p>Are you sure you want to delete this employee?</p>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => { setDeleteModal(false); setDeleteId(null); }}>No</button>
              <button className="btn-delete" onClick={deleteEmployee}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PASSWORD CONFIRM MODAL ── */}
      {pwdConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2>Change Password</h2>
            </div>
            <p>Are you sure you want to change the password for <strong>{pwdTargetEmp?.name}</strong>?</p>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => { setPwdConfirmModal(false); setPwdTargetEmp(null); }}>No</button>
              <button className="btn-save" onClick={() => { setPwdConfirmModal(false); setPwdEmailModal(true); }}>Yes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PASSWORD EMAIL MODAL ── */}
      {pwdEmailModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2>Send Reset Email</h2>
              <button className="modal-close" onClick={() => { setPwdEmailModal(false); setPwdEmail(''); setPwdSendError(''); setPwdSendSuccess(''); }}>
                <FiX />
              </button>
            </div>

            {pwdSendError && <div className="modal-api-error">{pwdSendError}</div>}
            {pwdSendSuccess && (
              <div style={{ background: '#dcfce7', color: '#16a34a', padding: '10px 15px', borderRadius: 10, margin: '10px 0', fontSize: 13 }}>
                {pwdSendSuccess}
              </div>
            )}

            <div style={{ padding: '16px 0' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={pwdEmail}
                onChange={(e) => setPwdEmail(e.target.value)}
                placeholder="Enter employee email"
                style={{
                  width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0',
                  borderRadius: 10, fontFamily: 'Outfit, sans-serif', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => { setPwdEmailModal(false); setPwdEmail(''); setPwdSendError(''); setPwdSendSuccess(''); }}>Cancel</button>
              <button className="btn-save" onClick={sendPasswordReset} disabled={pwdSending}>
                {pwdSending ? 'Sending...' : '📨 Send Reset Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}