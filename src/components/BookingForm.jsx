import React, { useState } from 'react';
import { Send, AlertCircle, Sparkles, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    symptoms: '',
    appointmentTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For now, mapping simplified fields to the entity structure
      const payload = {
        patient: { name: formData.patientName }, // Simplified for demo
        symptoms: formData.symptoms,
        appointmentTime: formData.appointmentTime + ":00", // LocalDateTime format
        status: "PENDING"
      };
      
      const response = await axios.post('http://localhost:8080/api/appointments', payload);
      setResult(response.data);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-12 pb-32 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary-light rounded-2xl text-primary">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Booking Jadwal Cerdas</h2>
            <p className="text-text-muted text-sm">AI kami akan membantu menentukan urgensi jadwal Anda.</p>
          </div>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="input-field"
                placeholder="Masukkan nama Anda"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Ceritakan Gejala Anda</label>
              <textarea 
                required
                className="input-field min-h-[120px]"
                placeholder="Contoh: Gusi bengkak di bagian belakang sejak kemarin malam, terasa sangat nyeri sampai tidak bisa tidur."
                value={formData.symptoms}
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Rencana Waktu Kedatangan</label>
              <input 
                type="datetime-local" 
                required
                className="input-field"
                value={formData.appointmentTime}
                onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-lg"
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Clock size={20} />
                </motion.div>
              ) : (
                <>
                  <Send size={20} />
                  Buat Janji Temu
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className={`inline-flex p-4 rounded-full mb-4 ${
              result.priorityLevel >= 4 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              <AlertCircle size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2">Booking Berhasil!</h3>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-text-muted">Analisis Prioritas AI:</span>
                <span className={`badge ${
                  result.priorityLevel >= 4 ? 'badge-emergency' : 
                  result.priorityLevel >= 3 ? 'badge-soon' : 'badge-routine'
                }`}>
                  Level {result.priorityLevel} / 5
                </span>
              </div>
              <p className="text-text-main leading-relaxed italic">
                "{result.aiRecommendation}"
              </p>
            </div>
            <button 
              onClick={() => setResult(null)}
              className="text-primary font-semibold hover:underline"
            >
              Buat Booking Baru
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingForm;
