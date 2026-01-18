
export enum UserRole {
  WARDEN = 'Warden',
  ADMIN = 'School Administrator',
  SUPERVISOR = 'Supervisor',
  MAIN_ADMIN = 'Main Admin'
}

export interface Building {
  id: string;
  name: string;
  dorms: string[];
}

export interface Student {
  id: string;
  name: string;
  building: string;
  dorm: string;
}

export interface Warden {
  id: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  absent: string[]; // Array of student IDs
  present: string[]; // Array of student IDs
  wardenName: string;
  submittedAt: string;
}

export interface WardenReport {
  id: string;
  date: string;
  wardenName: string;
  schoolName: string;
  ratings: {
    [key: string]: number;
  };
  remarks: {
    [key: string]: string;
  };
  submittedAt: string;
  updatedAt?: string;
}

export interface DutyAssignment {
  id: string;
  date: string;
  wardenNames: string[];
  assignedAt: string;
}

export interface AppState {
  schoolCode: string;
  schoolName: string;
  userName: string;
  userRole: UserRole | null;
  isLoggedIn: boolean;
  language: 'en' | 'ms';
  buildings: Building[];
  students: Student[];
  wardens: Warden[];
  reports: WardenReport[];
  attendance: Record<string, AttendanceRecord>;
  duties: Record<string, string[]>;
}
