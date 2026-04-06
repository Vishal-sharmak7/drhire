export type UserRole = 'doctor' | 'hospital' | 'admin';

export interface User {
  _id: string;
  email: string;
  name?: string;
  hospitalName?: string;
  role: UserRole;
  specialization?: string;
  experience?: number;
  licenseNumber?: string;
  skills?: string[];
  location?: string;
  phone?: string;
  description?: string;
  website?: string;
  status?: 'pending' | 'approved' | 'rejected';
  appliedJobs?: string[];
  resume?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  specialization: string;
  location: string;
  experienceRequired: number;
  salaryRange?: string;
  requirements?: string[];
  hospitalId: {
    _id: string;
    hospitalName: string;
    email: string;
    location?: string;
  };
  applicants?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  registerDoctor: (data: RegisterDoctorData) => Promise<User>;
  registerHospital: (data: RegisterHospitalData) => Promise<User>;
  setUser: (user: User | null) => void;
}

export interface RegisterDoctorData {
  name: string;
  email: string;
  password: string;
  specialization?: string;
  experience?: number;
  licenseNumber?: string;
  skills?: string[];
  location?: string;
  phone?: string;
}

export interface RegisterHospitalData {
  hospitalName: string;
  email: string;
  password: string;
  location?: string;
  phone?: string;
  description?: string;
  website?: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}