import Project from "../modules/projects/project.model.js";

const baseProjects = [
  {
    name: "Atlas Revamp",
    clientName: "Nova Industries",
    status: "active",
    priority: "high",
    startDate: new Date("2025-11-01"),
    endDate: new Date("2026-04-15"),
  },
  {
    name: "Pulse Mobile",
    clientName: "Helios Labs",
    status: "planned",
    priority: "medium",
    startDate: new Date("2026-03-01"),
    endDate: new Date("2026-08-30"),
  },
];

const sampleProjects = [
  {name: "Healthcare Management System", clientName: "Medisoft Ltd", status: "active", priority: "high"},
  {name: "E-Commerce Web Platform", clientName: "ShopKart", status: "active", priority: "high"},
  {name: "Banking CRM Portal", clientName: "FinBank", status: "active", priority: "high"},
  {name: "HR Management System", clientName: "PeopleCore", status: "active", priority: "medium"},
  {name: "Inventory Control System", clientName: "StockPro", status: "active", priority: "medium"},
  {name: "School ERP System", clientName: "EduManage", status: "active", priority: "medium"},
  {name: "Hospital Appointment App", clientName: "CarePlus", status: "planned", priority: "medium"},
  {name: "Logistics Tracking System", clientName: "MoveFast", status: "active", priority: "high"},
  {name: "Food Delivery Platform", clientName: "QuickBite", status: "active", priority: "high"},
  {name: "Travel Booking Portal", clientName: "TripGo", status: "planned", priority: "medium"},
  {name: "Real Estate Listing Platform", clientName: "EstateHub", status: "active", priority: "medium"},
  {name: "Job Portal System", clientName: "HireLink", status: "active", priority: "medium"},
  {name: "Learning Management System", clientName: "LearnPro", status: "active", priority: "high"},
  {name: "Pharmacy Management", clientName: "MediStock", status: "active", priority: "medium"},
  {name: "Clinic Management System", clientName: "HealthDesk", status: "active", priority: "medium"},
  {name: "Vehicle Rental System", clientName: "RentWheels", status: "planned", priority: "low"},
  {name: "Event Management Platform", clientName: "EventPro", status: "active", priority: "medium"},
  {name: "Restaurant POS System", clientName: "DineTech", status: "active", priority: "medium"},
  {name: "Fitness Tracking App", clientName: "FitLife", status: "planned", priority: "medium"},
  {name: "Insurance Claim System", clientName: "SafeInsure", status: "active", priority: "high"},
  {name: "Payment Gateway Integration", clientName: "PayLink", status: "active", priority: "high"},
  {name: "Digital Wallet App", clientName: "WalletPro", status: "active", priority: "high"},
  {name: "Microfinance System", clientName: "MicroFund", status: "active", priority: "medium"},
  {name: "NGO Donation Portal", clientName: "HelpTrust", status: "planned", priority: "low"},
  {name: "Online Examination System", clientName: "ExamPro", status: "active", priority: "medium"},
  {name: "Recruitment Management", clientName: "TalentHire", status: "active", priority: "medium"},
  {name: "Employee Tracking System", clientName: "WorkTrack", status: "active", priority: "medium"},
  {name: "Project Management Tool", clientName: "TaskFlow", status: "active", priority: "high"},
  {name: "Customer Support Portal", clientName: "HelpDeskPro", status: "active", priority: "medium"},
  {name: "Document Management", clientName: "DocuStore", status: "active", priority: "medium"},
  {name: "Warehouse Management", clientName: "WarePro", status: "active", priority: "medium"},
  {name: "Fleet Management", clientName: "FleetTrack", status: "planned", priority: "medium"},
  {name: "Courier Tracking System", clientName: "ShipTrack", status: "active", priority: "high"},
  {name: "Subscription Billing Platform", clientName: "BillPro", status: "active", priority: "high"},
  {name: "Video Streaming Platform", clientName: "StreamHub", status: "planned", priority: "high"},
  {name: "Online Auction System", clientName: "BidZone", status: "planned", priority: "medium"},
  {name: "Ticket Booking System", clientName: "TicketGo", status: "active", priority: "high"},
  {name: "Complaint Management", clientName: "ResolveIT", status: "active", priority: "medium"},
  {name: "Vendor Management", clientName: "VendorLink", status: "active", priority: "medium"},
  {name: "Procurement System", clientName: "ProcurePro", status: "active", priority: "medium"},
  {name: "Sales CRM Dashboard", clientName: "SalesCore", status: "active", priority: "high"},
  {name: "Marketing Automation", clientName: "MarketPro", status: "active", priority: "medium"},
  {name: "Affiliate Tracking System", clientName: "AffilTrack", status: "planned", priority: "medium"},
  {name: "Survey Management", clientName: "SurveyPro", status: "active", priority: "low"},
  {name: "Feedback System", clientName: "FeedLoop", status: "active", priority: "low"},
  {name: "Knowledge Base Portal", clientName: "KnowHub", status: "active", priority: "low"},
  {name: "Community Forum Platform", clientName: "ForumSpace", status: "planned", priority: "low"},
  {name: "Chat Messaging App", clientName: "ChatFlow", status: "active", priority: "high"},
  {name: "Video Conference Tool", clientName: "MeetPro", status: "active", priority: "high"},
  {name: "Notification Service", clientName: "NotifyX", status: "active", priority: "medium"},
  {name: "API Gateway Platform", clientName: "APICore", status: "active", priority: "high"},
  {name: "Identity Access Management", clientName: "SecureAuth", status: "active", priority: "high"},
  {name: "Role Permission System", clientName: "RBACore", status: "active", priority: "high"},
  {name: "Audit Logging System", clientName: "LogSecure", status: "active", priority: "medium"},
  {name: "Data Analytics Dashboard", clientName: "DataVision", status: "active", priority: "high"},
  {name: "Business Intelligence Tool", clientName: "BIPro", status: "active", priority: "high"},
  {name: "Reporting Engine", clientName: "ReportFlow", status: "active", priority: "medium"},
  {name: "ETL Data Pipeline", clientName: "DataPipe", status: "active", priority: "high"},
  {name: "AI Chatbot Platform", clientName: "AIConnect", status: "planned", priority: "high"},
  {name: "Recommendation Engine", clientName: "SmartSuggest", status: "planned", priority: "high"},
  {name: "IoT Device Monitoring", clientName: "IoTWatch", status: "planned", priority: "medium"},
  {name: "Smart Home App", clientName: "HomeSense", status: "planned", priority: "medium"},
  {name: "Energy Monitoring System", clientName: "PowerTrack", status: "active", priority: "medium"},
  {name: "Agriculture Management", clientName: "AgroPro", status: "planned", priority: "low"},
  {name: "Weather Analytics", clientName: "WeatherInsight", status: "planned", priority: "low"},
  {name: "Map Navigation System", clientName: "MapRoute", status: "planned", priority: "medium"},
  {name: "Ride Sharing App", clientName: "RideLink", status: "planned", priority: "high"},
  {name: "Parking Management", clientName: "ParkEase", status: "active", priority: "medium"},
  {name: "Traffic Monitoring", clientName: "TrafficEye", status: "planned", priority: "medium"},
  {name: "Emergency Alert System", clientName: "AlertNow", status: "active", priority: "high"},
  {name: "Cybersecurity Scanner", clientName: "SecureScan", status: "active", priority: "high"},
  {name: "Vulnerability Tracker", clientName: "VulnTrack", status: "active", priority: "high"},
  {name: "Backup Recovery System", clientName: "SafeBackup", status: "active", priority: "medium"},
  {name: "Cloud Storage Platform", clientName: "CloudBox", status: "active", priority: "high"},
  {name: "File Sharing Service", clientName: "ShareSync", status: "active", priority: "medium"},
  {name: "DevOps Automation Tool", clientName: "DevAuto", status: "active", priority: "high"},
  {name: "CI/CD Pipeline System", clientName: "DeployFlow", status: "active", priority: "high"},
  {name: "Container Management", clientName: "DockManage", status: "active", priority: "high"},
  {name: "Server Monitoring", clientName: "ServerWatch", status: "active", priority: "high"},
  {name: "Performance Monitoring", clientName: "PerfTrack", status: "active", priority: "medium"},
  {name: "Bug Tracking System", clientName: "BugTrack", status: "active", priority: "medium"},
  {name: "Test Automation Platform", clientName: "TestPro", status: "active", priority: "high"},
  {name: "QA Reporting Tool", clientName: "QAMetrics", status: "active", priority: "medium"},
  {name: "Code Review Platform", clientName: "CodeCheck", status: "active", priority: "medium"},
  {name: "Documentation Portal", clientName: "DocuHub", status: "active", priority: "low"},
  {name: "Portfolio Website Builder", clientName: "WebFolio", status: "planned", priority: "low"},
  {name: "Landing Page Generator", clientName: "PageCraft", status: "planned", priority: "low"},
  {name: "CMS Platform", clientName: "ContentCore", status: "active", priority: "medium"},
  {name: "Blog Publishing System", clientName: "BlogPro", status: "active", priority: "low"},
  {name: "Newsletter Platform", clientName: "MailFlow", status: "active", priority: "medium"},
  {name: "Social Media Scheduler", clientName: "SocialPlan", status: "active", priority: "medium"},
  {name: "Influencer Management", clientName: "InfluHub", status: "planned", priority: "medium"},
  {name: "Ad Campaign Manager", clientName: "AdPro", status: "active", priority: "medium"},
  {name: "SEO Analytics Tool", clientName: "SEOInsight", status: "active", priority: "medium"},
  {name: "Keyword Tracking System", clientName: "RankWatch", status: "active", priority: "medium"},
  {name: "Web Analytics Platform", clientName: "WebTrack", status: "active", priority: "high"},
  {name: "Heatmap Tool", clientName: "UserHeat", status: "planned", priority: "medium"},
  {name: "Session Replay Tool", clientName: "SessionView", status: "planned", priority: "medium"},
  {name: "A/B Testing Platform", clientName: "SplitTest", status: "planned", priority: "medium"},
  {name: "Feature Flag System", clientName: "FlagCore", status: "active", priority: "high"},
];

const baseDate = new Date();
baseDate.setHours(0, 0, 0, 0);

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const buildProjectDates = (status, index) => {
  const seedIndex = index + 1;
  const normalizedStatus = (status || "planned").toLowerCase();
  const offsetA = seedIndex % 120;
  const offsetB = seedIndex % 180;
  const offsetC = seedIndex % 150;

  switch (normalizedStatus) {
    case "planned": {
      const startDate = addDays(baseDate, 30 + offsetA);
      const endDate = addDays(startDate, 90 + offsetB);
      return {startDate, endDate};
    }
    case "completed": {
      const startDate = addDays(baseDate, -540 - offsetB);
      const endDate = addDays(startDate, 90 + offsetC);
      return {startDate, endDate};
    }
    case "active":
    default: {
      const startDate = addDays(baseDate, -120 - offsetB);
      const endDate = addDays(baseDate, 30 + offsetC);
      return {startDate, endDate};
    }
  }
};

export const seedProjects = async ({adminUser} = {}) => {
  if (!adminUser) {
    throw new Error("seedProjects requires adminUser");
  }

  const projectSeedList = [...baseProjects, ...sampleProjects];

  const projectData = projectSeedList.map((item, index) => {
    const status = (item.status || "planned").toLowerCase();
    const priority = (item.priority || "medium").toLowerCase();
    const dates = item.startDate
      ? {startDate: item.startDate, endDate: item.endDate}
      : buildProjectDates(status, index);

    return {
      name: item.name,
      clientName: item.clientName,
      status,
      priority,
      ...dates,
      managerId: item.managerId ?? adminUser._id,
      createdBy: item.createdBy ?? adminUser._id,
    };
  });

  const projects = [];
  for (const data of projectData) {
    let project = await Project.findOne({name: data.name});
    if (!project) {
      project = await Project.create(data);
    }
    projects.push(project);
  }

  return projects;
};

export const getSeedProjects = () => [...baseProjects, ...sampleProjects];
