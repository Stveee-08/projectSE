import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, LogIn, UserCircle, Users, UserPlus, BookOpen } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [extraInfo, setExtraInfo] = useState(''); // Major or Department
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ALLOWED_DOMAIN = '@klabat.ac.id';

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isRegister && !email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      setError(`Email harus diakhiri dengan ${ALLOWED_DOMAIN}`);
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        await axios.post('http://localhost:8080/api/auth/register', {
          name,
          email,
          password,
          role,
          extraInfo
        });
        setSuccess('Registrasi berhasil! Silakan masuk.');
        setIsRegister(false);
      } else {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email,
          password,
          role
        });
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ maxWidth: '480px', width: '100%', padding: '2.5rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            width: '60px', 
            height: '60px', 
            borderRadius: '18px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.2rem',
            boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)'
          }}>
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.4rem' }}>
            {isRegister ? 'Buat Akun Baru' : 'Selamat Datang'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>EduConsult • Universitas Klabat</p>
        </div>

        {/* Role Toggle */}
        <div style={{ 
          display: 'flex', 
          background: '#E8EAF6', 
          padding: '4px', 
          borderRadius: '12px', 
          marginBottom: '1.5rem' 
        }}>
          <button 
            onClick={() => setRole('STUDENT')}
            style={{ 
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
              background: role === 'STUDENT' ? 'white' : 'transparent',
              color: role === 'STUDENT' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <UserCircle size={16} /> Mahasiswa
          </button>
          <button 
            onClick={() => setRole('LECTURER')}
            style={{ 
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
              background: role === 'LECTURER' ? 'white' : 'transparent',
              color: role === 'LECTURER' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <Users size={16} /> Dosen
          </button>
        </div>

        <form onSubmit={handleAuth}>
          <AnimatePresence mode="wait">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.85rem' }}>Nama Lengkap</label>
                  <input 
                    type="text" className="input-field" placeholder="Nama Lengkap"
                    value={name} onChange={(e) => setName(e.target.value)} required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.85rem' }}>
                    {role === 'STUDENT' ? 'Jurusan' : 'Departemen'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <BookOpen size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" className="input-field" style={{ paddingLeft: '40px' }}
                      placeholder={role === 'STUDENT' ? 'Contoh: Informatika' : 'Contoh: Fakultas Ilmu Komputer'}
                      value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)} required
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.85rem' }}>Email Universitas</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" className="input-field" style={{ paddingLeft: '40px' }}
                placeholder={`nama${ALLOWED_DOMAIN}`}
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', fontSize: '0.85rem' }}>Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" className="input-field" style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
            </div>
          </div>

          {error && <p style={{ color: '#D32F2F', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: '#2E7D32', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: '600', textAlign: 'center' }}>{success}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? 'Memproses...' : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                {isRegister ? 'Daftar Sekarang' : 'Masuk Sekarang'} 
                {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
              </span>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {isRegister ? 'Sudah punya akun?' : 'Belum memiliki akun?'} 
            <span 
              onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
              style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', marginLeft: '5px' }}
            >
              {isRegister ? 'Masuk di sini' : 'Daftar di sini'}
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
