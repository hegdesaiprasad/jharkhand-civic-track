export type IssueStatus = "NEW" | "ACKNOWLEDGED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";

export type Department = "ROADS" | "SANITATION" | "WATER" | "ELECTRICITY" | "OTHER";

export type IssueCategory = 
  | "POTHOLES" 
  | "GARBAGE" 
  | "STREETLIGHTS" 
  | "WATER" 
  | "SEWAGE" 
  | "OTHER";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: {
    address: string;
    ward: string;
    city: string;
    lat: number;
    lng: number;
  };
  reporter: {
    name: string;
    phone: string;
  };
  assignedTo?: {
    department: Department;
    officerName: string;
  };
  images: string[];
  reportedDate: string;
  updatedDate: string;
  history: IssueHistoryEntry[];
  slaBreached: boolean;
  ageInHours: number;
}

export interface IssueHistoryEntry {
  timestamp: string;
  status: IssueStatus;
  updatedBy: string;
  department: string;
  notes?: string;
}

export interface Authority {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  municipalityType: "Municipal Corporation" | "Municipal Council" | "Nagar Panchayat";
}

export interface KPIData {
  totalIssues: number;
  resolvedIssues: number;
  avgResponseTime: string;
  avgResolutionTime: string;
  openSLABreached: number;
}

export interface DepartmentPerformance {
  department: string;
  issuesHandled: number;
  avgResolutionTime: string;
  resolvedPercentage: number;
}
