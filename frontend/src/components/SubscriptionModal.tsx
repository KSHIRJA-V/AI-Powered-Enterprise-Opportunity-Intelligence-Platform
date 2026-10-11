import React, { useState, useEffect } from 'react';
import { Mail, Bell, CheckCircle, Send, X, Loader2, FileText, AlertCircle, Key, Settings, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Outbound SMTP credentials
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('enterprise_smtp_user') || '';
    const savedPass = localStorage.getItem('enterprise_smtp_pass') || '';
    if (savedUser) setSmtpUsername(savedUser);
    if (savedPass) setSmtpPassword(savedPass);
  }, []);

  const handleSmtpUserChange = (val: string) => {
    setSmtpUsername(val);
    localStorage.setItem('enterprise_smtp_user', val);
  };

  const handleSmtpPassChange = (val: string) => {
    setSmtpPassword(val);
    localStorage.setItem('enterprise_smtp_pass', val);
  };

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
      setStatusMessage({ type: 'error', text: 'Please enter a valid recipient email address first.' });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await apiService.sendDigest(email, currentCompany, frequency, smtpUsername, smtpPassword);
      if (res.status === 'CONFIG_REQUIRED') {
        setShowSmtpConfig(true);
        setStatusMessage({
          type: 'warning',
          text: res.message || 'SMTP credentials required for real email transmission. Enter your Gmail address and 16-character App Password below.'
        });
      } else if (res.status === 'ERROR') {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to transmit email via SMTP server.'
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: res.message || `Digest dispatched to ${email} successfully.`
        });
      }
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
      setStatusMessage({ type: 'error', text: 'Please enter a valid recipient email address first.' });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await apiService.emailPdfReport(email, currentCompany, smtpUsername, smtpPassword);
      if (res.status === 'CONFIG_REQUIRED') {
        setShowSmtpConfig(true);
        setStatusMessage({
          type: 'warning',
          text: res.message || 'SMTP credentials required to attach and send the PDF. Enter your Gmail and 16-character App Password below.'
        });
      } else if (res.status === 'ERROR') {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to transmit PDF report via SMTP.'
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: res.message || `PDF report attached and delivered to ${email}.`
        });
      }
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
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden max-h-[92vh] overflow-y-auto">
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
                : statusMessage.type === 'warning'
                ? 'bg-amber-950/50 border border-amber-700 text-amber-200'
                : 'bg-rose-950/50 border border-rose-800 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            )}
            <span className="leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubscribe} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
              Recipient Stakeholder Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recipient@example.com"
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

          {/* Outbound SMTP Relay Configuration Drawer */}
          <div className="border border-slate-800 rounded-lg bg-slate-950/60 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSmtpConfig(!showSmtpConfig)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
                <Settings className="w-3.5 h-3.5 text-blue-400" />
                <span>Outbound Gmail SMTP Settings (For Real Email Sending)</span>
              </div>
              {showSmtpConfig ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showSmtpConfig && (
              <div className="p-3.5 pt-1 space-y-3 border-t border-slate-800 text-xs">
                <div className="p-2.5 bg-blue-950/30 border border-blue-900/50 rounded text-slate-300 text-[11px] leading-relaxed">
                  <p className="font-semibold text-blue-300 mb-1 flex items-center space-x-1">
                    <span>How to send real emails to your inbox:</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Google requires a <strong>16-character App Password</strong> rather than your standard Gmail password.</li>
                    <li>
                      Generate one in 5 seconds at{' '}
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline inline-flex items-center space-x-0.5 hover:text-blue-300"
                      >
                        <span>myaccount.google.com/apppasswords</span>
                        <ExternalLink className="w-3 h-3 inline ml-0.5" />
                      </a>
                    </li>
                    <li>Paste your Gmail address and 16-character App Password below. They are saved locally in your browser.</li>
                  </ol>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Sender Gmail Address
                  </label>
                  <input
                    type="email"
                    value={smtpUsername}
                    onChange={(e) => handleSmtpUserChange(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                    <span>16-Character Google App Password</span>
                    <span className="text-[10px] text-slate-500">e.g. abcd efgh ijkl mnop</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => handleSmtpPassChange(e.target.value)}
                      placeholder="•••• •••• •••• ••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
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
          <span>SMTP Engine: Gmail TLS / smtp.gmail.com:587</span>
          <span className="font-mono text-emerald-400">8 Guardrails Active</span>
        </div>
      </div>
    </div>
  );
};
