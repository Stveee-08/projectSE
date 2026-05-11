import React, { useEffect, useState } from 'react';
import { Clock, User, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/appointments/queue');
      setAppointments(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-32 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Antrean Pasien</h2>
          <p className="text-text-muted text-sm">Diurutkan berdasarkan prioritas AI dan waktu.</p>
        </div>
        <button 
          onClick={fetchQueue}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-primary"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 && !loading ? (
          <div className="text-center py-20 glass-card">
            <p className="text-text-muted">Tidak ada antrean saat ini.</p>
          </div>
        ) : (
          appointments.map((apt, index) => (
            <motion.div 
              key={apt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card flex flex-col md:flex-row md:items-center gap-6 p-6"
            >
              <div className={`w-2 h-24 rounded-full hidden md:block ${
                apt.priorityLevel >= 4 ? 'bg-red-500' : 
                apt.priorityLevel >= 3 ? 'bg-orange-500' : 'bg-green-500'
              }`} />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{apt.patient?.name || 'Pasien Anonim'}</h3>
                  <span className={`badge ${
                    apt.priorityLevel >= 4 ? 'badge-emergency' : 
                    apt.priorityLevel >= 3 ? 'badge-soon' : 'badge-routine'
                  }`}>
                    {apt.priorityLevel >= 4 ? 'Emergency' : 
                     apt.priorityLevel >= 3 ? 'Urgent' : 'Routine'}
                  </span>
                </div>
                
                <p className="text-text-muted text-sm mb-3 flex items-center gap-2">
                  <Clock size={14} />
                  {new Date(apt.appointmentTime).toLocaleString('id-ID', {
                    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <p className="text-sm text-text-main">
                    <span className="font-semibold text-primary">Gejala:</span> {apt.symptoms}
                  </p>
                </div>
              </div>

              <div className="md:w-64 border-l border-slate-100 pl-6 hidden md:block">
                <p className="text-xs font-bold text-primary uppercase mb-2 flex items-center gap-1">
                  <AlertCircle size={12} /> AI Insight
                </p>
                <p className="text-xs text-text-muted leading-tight">
                  {apt.aiRecommendation}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
