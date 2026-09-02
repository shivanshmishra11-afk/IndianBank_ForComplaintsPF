/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewType, UserSession, ComplaintTicket } from './types';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { ComplaintView } from './components/ComplaintView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShieldCheck, PhoneCall, Lock } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [user, setUser] = useState<UserSession | null>(null);
  const [recentTickets, setRecentTickets] = useState<ComplaintTicket[]>([]);

  // Restore stored session on mount
  useEffect(() => {
    try {
      const storedEmail =
        localStorage.getItem('indiabank_user_email') ||
        localStorage.getItem('intellect_bank_user_email');

      if (storedEmail) {
        const namePart = storedEmail.split('@')[0] || 'Client';
        const formattedName = namePart
          .split(/[._-]/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');

        setUser({
          email: storedEmail,
          name: formattedName,
          accountNumber: 'AC1000234567',
          loginTime: new Date().toLocaleTimeString('en-IN'),
        });
        setCurrentView('dashboard');
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleLogin = (email: string) => {
    const namePart = email.split('@')[0] || 'Client';
    const formattedName = namePart
      .split(/[._-]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const newSession: UserSession = {
      email: email,
      name: formattedName,
      accountNumber: 'AC1000234567',
      loginTime: new Date().toLocaleTimeString('en-IN'),
    };

    try {
      localStorage.setItem('indiabank_user_email', email);
    } catch {
      // safe fallback
    }

    setUser(newSession);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('indiabank_user_email');
      localStorage.removeItem('intellect_bank_user_email');
    } catch {
      // safe fallback
    }
    setUser(null);
    setCurrentView('login');
  };

  const handleTicketCreated = (ticket: ComplaintTicket) => {
    setRecentTickets((prev) => [ticket, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col font-sans selection:bg-blue-900 selection:text-white">
      {/* Universal India Bank NetBanking Header */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        user={user}
        onLogout={handleLogout}
        ticketCount={recentTickets.length}
      />

      {/* Main Single-Page View Container */}
      <main className="flex-1 flex flex-col relative">
        <ErrorBoundary>
          {/* VIEW 1: Login Page */}
          <div
            id="container-view-login"
            className={currentView === 'login' ? 'flex-1 flex flex-col' : 'hidden'}
          >
            <LoginView
              onLogin={handleLogin}
              savedEmail={
                localStorage.getItem('indiabank_remember_email') ||
                localStorage.getItem('intellect_bank_remember_email') ||
                ''
              }
            />
          </div>

          {/* VIEW 2: Customer Dashboard */}
          <div
            id="container-view-dashboard"
            className={currentView === 'dashboard' ? 'block' : 'hidden'}
          >
            {user && (
              <DashboardView
                user={user}
                onNavigateToComplaint={() => setCurrentView('complaint')}
                recentTickets={recentTickets}
              />
            )}
          </div>

          {/* VIEW 3: Complaint & Grievance Redressal Portal */}
          <div
            id="container-view-complaint"
            className={currentView === 'complaint' ? 'block' : 'hidden'}
          >
            {user && (
              <ComplaintView
                user={user}
                onReturnToDashboard={() => setCurrentView('dashboard')}
                onTicketCreated={handleTicketCreated}
              />
            )}
          </div>
        </ErrorBoundary>
      </main>

      {/* India Bank Institutional Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif font-bold text-slate-800">India Bank</span>
            <span>&bull;</span>
            <span>A Scheduled Commercial Bank Licensed by RBI</span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Deposits Insured by DICGC (upto ₹5,00,000)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              <span>24x7 Care: <strong>1800 202 6161</strong></span>
            </div>
            <span>&bull;</span>
            <span>CIN: L65110MH1994PLC080801</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
