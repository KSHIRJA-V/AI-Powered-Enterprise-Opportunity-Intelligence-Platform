import React, { useState } from 'react';
import { Mail, Bell, CheckCircle, Send, X, Loader2, FileText, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentCompany
}) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('WEEKLY');
  const [threshold, setThreshold] = useState(75);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid business email address.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await apiService.subscribeToAlerts(email, currentCompany, frequency, threshold);
      setStatusMessage({
        type: 'success',
        text: res.message || `Subscribed ${email} to ${frequency.toLowerCase()} intelligence digests for ${currentCompany}.`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.response?.data?.detail || 'Failed to register subscription. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendDigestNow = async () => {
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address first.' });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await apiService.sendDigest(email, currentCompany, frequency);
      setStatusMessage({
        type: 'success',
        text: res.message || `Digest dispatched to ${email} successfully.`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.response?.data?.detail || 'Failed to send digest.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPdfNow = async () => {
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address first.' });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await apiService.emailPdfReport(email, currentCompany);
      setStatusMessage({
        type: 'success',
        text: res.message || `PDF report attached and emailed to ${email}.`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.response?.data?.detail || 'Failed to email PDF report.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Subscription Alerts & Email Delivery</h3>
              <p className="text-xs text-slate-400">Automated frequency digests & direct PDF delivery for {currentCompany}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-lg text-xs flex items-start space-x-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/50 border border-rose-800 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubscribe} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
              Stakeholder Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="executive@enterprise.com"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                Digest Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="DAILY">Daily Morning Digest</option>
                <option value="WEEKLY">Weekly Executive Brief</option>
                <option value="MONTHLY">Monthly Board Report</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                Alert Threshold (Min %)
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 px-3 rounded-lg shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
              <span>Save Subscription</span>
            </button>

            <button
              type="button"
              onClick={handleSendDigestNow}
              disabled={isLoading}
              className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2 px-3 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>Test Digest</span>
            </button>

            <button
              type="button"
              onClick={handleEmailPdfNow}
              disabled={isLoading}
              className="flex items-center justify-center space-x-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-medium py-2 px-3 rounded-lg border border-emerald-800/80 transition-colors disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Email PDF</span>
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>SMTP Engine: Gmail TLS / Verified Gateway</span>
          <span className="font-mono text-emerald-400">8 Guardrails Active</span>
        </div>
      </div>
    </div>
  );
};
