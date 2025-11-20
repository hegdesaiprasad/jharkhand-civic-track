import React, { createContext, useContext, useState } from "react";

type Language = "en" | "hi";

interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = {
  en: {
    dashboard: "Dashboard",
    issues: "Issues",
    analytics: "Analytics",
    settings: "Settings",
    logout: "Logout",
    profile: "Profile",
    totalIssues: "Total Issues",
    resolvedIssues: "Resolved Issues",
    avgResponseTime: "Avg Response Time",
    avgResolutionTime: "Avg Resolution Time",
    openSLABreached: "Open SLA Breached",
    issueId: "Issue ID",
    category: "Category",
    title: "Title",
    location: "Location",
    reportedDate: "Reported Date",
    status: "Status",
    assignedDept: "Assigned Dept",
    age: "Age",
    actions: "Actions",
    viewDetails: "View Details",
    filters: "Filters",
    search: "Search",
    department: "Department",
    dateRange: "Date Range",
    assignIssue: "Assign Issue",
    updateStatus: "Update Status",
    assign: "Assign",
    update: "Update",
    notes: "Notes",
    assignTo: "Assign To",
    issueDetails: "Issue Details",
    reportedBy: "Reported By",
    description: "Description",
    photos: "Photos",
    statusHistory: "Status History",
    issuesReportedPerDay: "Issues Reported Per Day",
    issuesByCategory: "Issues by Category",
    departmentPerformance: "Department Performance",
    reports: "Reports",
    issuesHandled: "Issues Handled",
    resolvedPercentage: "Resolved %",
    potholes: "Potholes",
    garbage: "Garbage",
    streetlights: "Street Lights",
    water: "Water",
    sewage: "Sewage",
    other: "Other",
    new: "New",
    acknowledged: "Acknowledged",
    inProgress: "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
    roads: "Roads",
    sanitation: "Sanitation",
    electricity: "Electricity",
    all: "All",
    login: "Login",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    email: "Email",
    password: "Password",
    cityLocation: "City/Location",
    loginButton: "Login as Authority",
    welcomeBack: "Welcome Back",
    loginDescription: "Login to access the Municipality Dashboard",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    issues: "समस्याएं",
    analytics: "विश्लेषण",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    profile: "प्रोफ़ाइल",
    totalIssues: "कुल समस्याएं",
    resolvedIssues: "हल की गई समस्याएं",
    avgResponseTime: "औसत प्रतिक्रिया समय",
    avgResolutionTime: "औसत समाधान समय",
    openSLABreached: "खुले SLA उल्लंघन",
    issueId: "समस्या ID",
    category: "श्रेणी",
    title: "शीर्षक",
    location: "स्थान",
    reportedDate: "रिपोर्ट की तारीख",
    status: "स्थिति",
    assignedDept: "विभाग",
    age: "आयु",
    actions: "कार्य",
    viewDetails: "विवरण देखें",
    filters: "फिल्टर",
    search: "खोजें",
    department: "विभाग",
    dateRange: "तारीख सीमा",
    assignIssue: "समस्या असाइन करें",
    updateStatus: "स्थिति अपडेट करें",
    assign: "असाइन करें",
    update: "अपडेट करें",
    notes: "नोट्स",
    assignTo: "को असाइन करें",
    issueDetails: "समस्या विवरण",
    reportedBy: "द्वारा रिपोर्ट",
    description: "विवरण",
    photos: "फोटो",
    statusHistory: "स्थिति इतिहास",
    issuesReportedPerDay: "प्रति दिन रिपोर्ट की गई समस्याएं",
    issuesByCategory: "श्रेणी के अनुसार समस्याएं",
    departmentPerformance: "विभाग का प्रदर्शन",
    reports: "रिपोर्ट",
    issuesHandled: "संभाली गई समस्याएं",
    resolvedPercentage: "हल %",
    potholes: "गड्ढे",
    garbage: "कचरा",
    streetlights: "स्ट्रीट लाइट",
    water: "पानी",
    sewage: "सीवेज",
    other: "अन्य",
    new: "नया",
    acknowledged: "स्वीकृत",
    inProgress: "प्रगति में",
    resolved: "हल",
    rejected: "अस्वीकृत",
    roads: "सड़कें",
    sanitation: "स्वच्छता",
    electricity: "बिजली",
    all: "सभी",
    login: "लॉगिन",
    fullName: "पूरा नाम",
    phoneNumber: "फोन नंबर",
    email: "ईमेल",
    password: "पासवर्ड",
    cityLocation: "शहर/स्थान",
    loginButton: "अथॉरिटी के रूप में लॉगिन",
    welcomeBack: "वापसी पर स्वागत है",
    loginDescription: "नगरपालिका डैशबोर्ड एक्सेस करने के लिए लॉगिन करें",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
