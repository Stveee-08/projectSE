import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Clock, 
  History, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  GraduationCap,
  BookOpen,
  LogOut,
  Bell,
  Link as LinkIcon,
  Video,
  MapPin,
  MessageSquare,
  FileText,
  BarChart3,
  TrendingUp,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Save,
  Lock
} from 'lucide-react';
import Login from './components/Login';

const API_BASE = 'http://localhost:8080/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [consultationType, setConsultationType] = useState('Tugas Akhir');
  const [meetingType, setMeetingType] = useState('Offline');
  const [attachment, setAttachment] = useState('');
  const [history, setHistory] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [showSettings, setShowSettings] = useState(false);

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    if (user) {
      fetchLecturers();
      if (role === 'STUDENT') fetchHistory();
      if (role === 'LECTURER') fetchQueue();
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user, role]);

  const fetchLecturers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/lecturers`);
      setLecturers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/consultations/student/${user.id}/history`);
      setHistory(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${API_BASE}/consultations/lecturer/${user.id}/queue`);
      setQueue(res.data);
    } catch (err) { console.error(err); }
  };

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setRole(data.role);
  };

  const handleLogout = () => {
    setUser(null);
    setRole(null);
    setShowSettings(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/update-profile`, {
        id: user.id,
        role: role,
        name: editName,
        email: editEmail,
        password: editPassword
      });
      setUser(res.data);
      alert("Profil berhasil diperbarui!");
      setShowSettings(false);
      setEditPassword('');
    } catch (err) {
      alert(err.response?.data || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingTopic || !bookingDate) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/consultations/book`, {
        studentId: user.id,
        lecturerId: lecturers[0]?.id,
        topic: bookingTopic,
        type: consultationType,
        meeting: meetingType,
        attachment: attachment,
        dateTime: bookingDate
      });
      setBookingTopic('');
      setBookingDate('');
      setAttachment('');
      fetchHistory();
      alert("Booking Professional Berhasil Dikirim!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const notes = feedback[id] || '';
    try {
      await axios.patch(`${API_BASE}/consultations/${id}/status?status=${status}&notes=${encodeURIComponent(notes)}`);
      fetchQueue();
      setFeedback(prev => {
        const next = {...prev};
        delete next[id];
        return next;
      });
    } catch (err) { console.error(err); }
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '14px', borderRadius: '18px', boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)' }}>
            <GraduationCap size={36} />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.5px' }}>EduConsult Pro</h1>
            <p style={{ color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Academic Excellence System • {role}
            </p>
          </div>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem' }}>{user.name}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>{user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button onClick={() => setShowSettings(!showSettings)} className="btn-primary" style={{ background: '#E8EAF6', color: 'var(--primary)', padding: '12px' }}>
              <SettingsIcon size={20} />
            </button>
            <button onClick={handleLogout} className="btn-primary" style={{ background: '#F5F5F5', color: '#D32F2F', padding: '12px 20px' }}>
              <LogOut size={20} /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', color: 'var(--primary)' }}>
                <SettingsIcon /> Pengaturan Profil
              </h2>
              <form onSubmit={handleUpdateProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Nama Lengkap</label>
                    <input type="text" className="input-field" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Email (@klabat.ac.id)</label>
                    <input type="email" className="input-field" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
                  </div>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Kata Sandi Baru (Kosongkan jika tidak diubah)</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="password" className="input-field" style={{ paddingLeft: '36px' }} placeholder="••••••••" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                    <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button type="button" onClick={() => setShowSettings(false)} className="btn-primary" style={{ background: '#F5F5F5', color: 'var(--text-muted)' }}>
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          ) : role === 'STUDENT' ? (
            <div key="student" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem' }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', color: 'var(--primary)' }}>
                  <FileText /> Form Bimbingan Pro
                </h2>
                <form onSubmit={handleBooking}>
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Dosen Pembimbing</label>
                    <select className="input-field" disabled>
                      <option>Alex Don (Software Architecture & AI)</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Jenis Konsultasi</label>
                    <select className="input-field" value={consultationType} onChange={(e) => setConsultationType(e.target.value)}>
                      <option>Tugas Akhir / Skripsi</option>
                      <option>Kerja Praktek (Internship)</option>
                      <option>Konsultasi Mata Kuliah</option>
                      <option>Proposal Penelitian</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Topik / Judul</label>
                    <input type="text" className="input-field" placeholder="Topik spesifik bimbingan" value={bookingTopic} onChange={(e) => setBookingTopic(e.target.value)} required />
                  </div>
                  <div style={{ marginBottom: '1.2rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Metode</label>
                      <div style={{ display: 'flex', background: '#F5F5F5', padding: '4px', borderRadius: '10px' }}>
                        <button type="button" onClick={() => setMeetingType('Online')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: meetingType === 'Online' ? 'white' : 'transparent', fontWeight: '600', cursor: 'pointer' }}>Online</button>
                        <button type="button" onClick={() => setMeetingType('Offline')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: meetingType === 'Offline' ? 'white' : 'transparent', fontWeight: '600', cursor: 'pointer' }}>Offline</button>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Jadwal</label>
                      <input type="datetime-local" className="input-field" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
                    </div>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Lampiran (Link GDrive)</label>
                    <input type="url" className="input-field" placeholder="https://..." value={attachment} onChange={(e) => setAttachment(e.target.value)} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading}>
                    {loading ? 'Mengirim Pengajuan...' : 'Ajukan Bimbingan Resmi'}
                  </button>
                </form>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
                  <History className="text-primary" /> Histori Akademik
                </h2>
                <table className="custom-table">
                  <thead>
                    <tr><th>Informasi Sesi</th><th>Metode</th><th>Status</th><th>Catatan</th></tr>
                  </thead>
                  <tbody>
                    {history.map(item => (
                      <tr key={item.id}>
                        <td><p style={{ fontWeight: '700', color: 'var(--primary)' }}>{item.topic}</p><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.consultationType} • {new Date(item.dateTime).toLocaleString()}</p></td>
                        <td><span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>{item.meetingType === 'Online' ? <Video size={16} /> : <MapPin size={16} />}{item.meetingType}</span></td>
                        <td><span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span></td>
                        <td style={{ maxWidth: '200px', fontSize: '0.85rem' }}>{item.lecturerNotes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>
          ) : (
            <div key="lecturer" style={{ display: 'grid', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {[
                  { label: 'Total Mahasiswa', value: '42', icon: UsersIcon, color: '#3F51B5' },
                  { label: 'Antrian Pending', value: queue.length, icon: Clock, color: '#FFC107' },
                  { label: 'Selesai Bulan Ini', value: '18', icon: CheckCircle, color: '#43A047' },
                  { label: 'Engagement Rate', value: '94%', icon: TrendingUp, color: '#E91E63' }
                ].map((stat, i) => (
                  <motion.div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ background: stat.color + '15', color: stat.color, padding: '12px', borderRadius: '14px' }}><stat.icon size={24} /></div>
                    <div><p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>{stat.label}</p><p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{stat.value}</p></div>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}><BarChart3 className="text-primary" /> Antrian Bimbingan</h2>
                <div style={{ display: 'grid', gap: '1.2rem' }}>
                  {queue.map((item, index) => (
                    <div key={item.id} className="glass-card" style={{ padding: '1.5rem', background: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1.2rem' }}>
                          <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{item.student.name.charAt(0)}</div>
                          <div><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><h3 style={{ fontWeight: '800' }}>{item.student.name}</h3><span className="badge badge-priority">Score: {item.student.priorityScore}</span></div><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.student.major} • {new Date(item.dateTime).toLocaleString()}</p></div>
                        </div>
                        <div style={{ textAlign: 'right' }}><span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)' }}>{item.meetingType === 'Online' ? <Video size={16} /> : <MapPin size={16} />}{item.meetingType} • {item.consultationType}</span></div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>Feedback</label><textarea className="input-field" style={{ height: '60px' }} placeholder="Catatan untuk mahasiswa..." value={feedback[item.id] || ''} onChange={(e) => setFeedback({...feedback, [item.id]: e.target.value})} /></div>
                        <div style={{ display: 'flex', gap: '0.8rem' }}><button className="btn-accent" onClick={() => updateStatus(item.id, 'APPROVED')}><CheckCircle size={18} /> Approve</button><button style={{ background: '#FFEBEE', color: '#D32F2F', border: 'none', padding: '12px', borderRadius: '12px' }} onClick={() => updateStatus(item.id, 'REJECTED')}><XCircle size={18} /></button></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
