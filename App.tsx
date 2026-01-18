
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  UserRole, 
  Building, 
  Student, 
  Warden, 
  AttendanceRecord, 
  WardenReport,
  AppState 
} from './types';
import { dataService } from './services/dataService';
import { COLORS, TRANSLATIONS } from './constants';

// Views
import Landing from './views/Landing';
import JoinSchool from './views/JoinSchool';
import Onboarding from './views/Onboarding';
import Dashboard from './views/Dashboard';
import ManageData from './views/ManageData';
import Attendance from './views/Attendance';
import DailyReports from './views/DailyReports';
import WardenReportForm from './views/WardenReportForm';
import AdminDashboard from './views/AdminDashboard';
import GenerateReports from './views/GenerateReports';
import ManageWardens from './views/ManageWardens';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    schoolCode: localStorage.getItem('schoolCode') || '',
    schoolName: localStorage.getItem('schoolName') || '',
    userName: localStorage.getItem('userName') || '',
    userRole: (localStorage.getItem('userRole') as UserRole) || null,
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    language: (localStorage.getItem('language') as 'en' | 'ms') || 'en',
    buildings: [],
    students: [],
    wardens: [],
    reports: [],
    attendance: {},
    duties: {}
  });

  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (code: string) => {
    if (!code) return;
    setLoading(true);
    try {
      const info = await dataService.fetchSchoolInfo(code) as any;
      const buildings = await dataService.fetchAll(code, 'buildings') as Building[];
      const residents = await dataService.fetchAll(code, 'residents') as Student[];
      const wardens = await dataService.fetchAll(code, 'wardens') as Warden[];
      const reports = await dataService.fetchAll(code, 'reports') as WardenReport[];
      const att = await dataService.fetchAll(code, 'attendance') as AttendanceRecord[];
      const duties = await dataService.fetchAll(code, 'duties') as any[];

      const attMap: Record<string, AttendanceRecord> = {};
      att.forEach(a => attMap[a.id] = a);

      const dutyMap: Record<string, string[]> = {};
      duties.forEach(d => dutyMap[d.id] = d.wardenNames);

      setState(prev => ({
        ...prev,
        schoolName: info?.name || prev.schoolName,
        buildings,
        students: residents,
        wardens,
        reports,
        attendance: attMap,
        duties: dutyMap
      }));
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (state.isLoggedIn && state.schoolCode) {
      loadData(state.schoolCode);
    }
  }, [state.isLoggedIn, state.schoolCode, loadData]);

  const setLanguage = (lang: 'en' | 'ms') => {
    setState(prev => ({ ...prev, language: lang }));
    localStorage.setItem('language', lang);
  };

  const handleLogin = (code: string, name: string, role: UserRole, schoolName?: string) => {
    const newState = {
      ...state,
      schoolCode: code,
      userName: name,
      userRole: role,
      isLoggedIn: true,
      schoolName: schoolName || state.schoolName
    };
    setState(newState);
    localStorage.setItem('schoolCode', code);
    localStorage.setItem('userName', name);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isLoggedIn', 'true');
    if (schoolName) localStorage.setItem('schoolName', schoolName);
    loadData(code);
  };

  const handleLogout = () => {
    localStorage.clear();
    setState({
      schoolCode: '',
      schoolName: '',
      userName: '',
      userRole: null,
      isLoggedIn: false,
      language: 'en',
      buildings: [],
      students: [],
      wardens: [],
      reports: [],
      attendance: {},
      duties: {}
    });
  };

  const t = TRANSLATIONS[state.language];

  if (loading && state.isLoggedIn && state.buildings.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-gold rounded-full animate-spin mb-4" style={{ borderTopColor: COLORS.accent }}></div>
          <p className="text-slate-500 font-medium">{t.syncing}</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="h-full flex flex-col">
        <Routes>
          <Route path="/" element={state.isLoggedIn ? <Navigate to="/dashboard" /> : <Landing language={state.language} setLanguage={setLanguage} />} />
          <Route path="/join" element={<JoinSchool onLogin={handleLogin} isLoggedIn={state.isLoggedIn} language={state.language} setLanguage={setLanguage} />} />
          <Route path="/onboarding" element={<Onboarding onComplete={handleLogin} language={state.language} setLanguage={setLanguage} />} />
          
          <Route path="/dashboard" element={
            state.isLoggedIn ? <Dashboard state={state} onLogout={handleLogout} setLanguage={setLanguage} refresh={() => loadData(state.schoolCode)} /> : <Navigate to="/" />
          } />
          <Route path="/manage-data" element={
            state.isLoggedIn ? <ManageData state={state} refresh={() => loadData(state.schoolCode)} /> : <Navigate to="/" />
          } />
          <Route path="/attendance" element={
            state.isLoggedIn ? <Attendance state={state} refresh={() => loadData(state.schoolCode)} /> : <Navigate to="/" />
          } />
          <Route path="/reports" element={
            state.isLoggedIn ? <DailyReports state={state} /> : <Navigate to="/" />
          } />
          <Route path="/record-report" element={
            state.isLoggedIn ? <WardenReportForm state={state} refresh={() => loadData(state.schoolCode)} /> : <Navigate to="/" />
          } />
          <Route path="/admin-stats" element={
            state.isLoggedIn ? <AdminDashboard state={state} /> : <Navigate to="/" />
          } />
          <Route path="/generate" element={
            state.isLoggedIn ? <GenerateReports state={state} refresh={() => loadData(state.schoolCode)} /> : <Navigate to="/" />
          } />
          <Route path="/manage-wardens" element={
            state.isLoggedIn ? <ManageWardens state={state} refresh={() => loadData(state.schoolCode)} /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
