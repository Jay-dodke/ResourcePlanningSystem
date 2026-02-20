import {BrowserRouter, Route, Routes} from "react-router-dom";
import ToastHost from "./components/ui/Toast/ToastHost";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute/ProtectedRoute";
import RequirePermission from "./components/auth/RequirePermission/RequirePermission";
import LoginPage from "./modules/auth/pages/LoginPage";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";
import EmployeeList from "./modules/employees/pages/EmployeeList";
import EmployeeCreate from "./modules/employees/pages/EmployeeCreate";
import EmployeeEdit from "./modules/employees/pages/EmployeeEdit";
import EmployeeProfile from "./modules/employees/pages/EmployeeProfile";
import ProjectList from "./modules/projects/pages/ProjectList";
import ProjectCreate from "./modules/projects/pages/ProjectCreate";
import ProjectEdit from "./modules/projects/pages/ProjectEdit";
import AllocationList from "./modules/allocations/pages/AllocationList";
import AllocationCreate from "./modules/allocations/pages/AllocationCreate";
import AvailabilityPage from "./modules/availability/pages/AvailabilityPage";
import ReportsPage from "./modules/reports/pages/ReportsPage";
import NotificationsPage from "./modules/notifications/pages/NotificationsPage";
import RolesPage from "./modules/roles/pages/RolesPage";
import SettingsPage from "./modules/settings/pages/SettingsPage";
import EmployeeHome from "./modules/employee/pages/EmployeeHome";
import TaskList from "./modules/tasks/pages/TaskList";
import TaskCreate from "./modules/tasks/pages/TaskCreate";
import TaskEdit from "./modules/tasks/pages/TaskEdit";
import MyTasks from "./modules/tasks/pages/MyTasks";
import DepartmentsPage from "./modules/departments/pages/DepartmentsPage";
import SkillsPage from "./modules/skills/pages/SkillsPage";
import TimesheetsPage from "./modules/timesheets/pages/TimesheetsPage";
import LeavesPage from "./modules/leaves/pages/LeavesPage";
import AnalyticsPage from "./modules/analytics/pages/AnalyticsPage";
import CalendarPage from "./modules/calendar/pages/CalendarPage";
import AuditPage from "./modules/audit/pages/AuditPage";
import SearchPage from "./modules/search/pages/SearchPage";
import MyTeam from "./modules/employee/pages/MyTeam";
import RequestsPage from "./modules/requests/pages/RequestsPage";
import {PERMISSIONS} from "./utils/permissions";

function App() {
  return (
    <BrowserRouter>
      <ToastHost />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <RequirePermission permission={PERMISSIONS.DASHBOARD_READ}>
                <DashboardPage />
              </RequirePermission>
            }
          />
          <Route
            path="/employees"
            element={
              <RequirePermission permission={PERMISSIONS.USERS_READ}>
                <EmployeeList />
              </RequirePermission>
            }
          />
          <Route
            path="/employees/new"
            element={
              <RequirePermission permission={PERMISSIONS.USERS_WRITE}>
                <EmployeeCreate />
              </RequirePermission>
            }
          />
          <Route
            path="/employees/:id/edit"
            element={
              <RequirePermission permission={PERMISSIONS.USERS_WRITE}>
                <EmployeeEdit />
              </RequirePermission>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <RequirePermission permission={PERMISSIONS.USERS_WRITE}>
                <EmployeeProfile />
              </RequirePermission>
            }
          />
          <Route
            path="/projects"
            element={
              <RequirePermission permission={PERMISSIONS.PROJECTS_READ}>
                <ProjectList />
              </RequirePermission>
            }
          />
          <Route
            path="/projects/new"
            element={
              <RequirePermission permission={PERMISSIONS.PROJECTS_WRITE}>
                <ProjectCreate />
              </RequirePermission>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <RequirePermission permission={PERMISSIONS.PROJECTS_WRITE}>
                <ProjectEdit />
              </RequirePermission>
            }
          />
          <Route
            path="/allocations"
            element={
              <RequirePermission permission={PERMISSIONS.ALLOCATIONS_READ}>
                <AllocationList />
              </RequirePermission>
            }
          />
          <Route
            path="/allocations/new"
            element={
              <RequirePermission permission={PERMISSIONS.ALLOCATIONS_WRITE}>
                <AllocationCreate />
              </RequirePermission>
            }
          />
          <Route
            path="/requests"
            element={
              <RequirePermission permission={PERMISSIONS.PROJECT_REQUESTS_READ}>
                <RequestsPage />
              </RequirePermission>
            }
          />
          <Route
            path="/availability"
            element={
              <RequirePermission permission={PERMISSIONS.AVAILABILITY_READ}>
                <AvailabilityPage />
              </RequirePermission>
            }
          />
          <Route
            path="/tasks"
            element={
              <RequirePermission permission={PERMISSIONS.TASKS_READ}>
                <TaskList />
              </RequirePermission>
            }
          />
          <Route
            path="/tasks/new"
            element={
              <RequirePermission permission={PERMISSIONS.TASKS_WRITE}>
                <TaskCreate />
              </RequirePermission>
            }
          />
          <Route
            path="/tasks/:id/edit"
            element={
              <RequirePermission permission={PERMISSIONS.TASKS_WRITE}>
                <TaskEdit />
              </RequirePermission>
            }
          />
          <Route
            path="/departments"
            element={
              <RequirePermission permission={PERMISSIONS.DEPARTMENTS_WRITE}>
                <DepartmentsPage />
              </RequirePermission>
            }
          />
          <Route
            path="/skills"
            element={
              <RequirePermission permission={PERMISSIONS.SKILLS_WRITE}>
                <SkillsPage />
              </RequirePermission>
            }
          />
          <Route
            path="/timesheets"
            element={
              <RequirePermission permission={PERMISSIONS.TIMESHEETS_READ}>
                <TimesheetsPage />
              </RequirePermission>
            }
          />
          <Route
            path="/leaves"
            element={
              <RequirePermission permission={PERMISSIONS.LEAVES_READ}>
                <LeavesPage />
              </RequirePermission>
            }
          />
          <Route
            path="/analytics"
            element={
              <RequirePermission permission={PERMISSIONS.ANALYTICS_READ}>
                <AnalyticsPage />
              </RequirePermission>
            }
          />
          <Route
            path="/calendar"
            element={
              <RequirePermission permission={PERMISSIONS.DASHBOARD_READ}>
                <CalendarPage />
              </RequirePermission>
            }
          />
          <Route
            path="/audit"
            element={
              <RequirePermission permission={PERMISSIONS.AUDIT_READ}>
                <AuditPage />
              </RequirePermission>
            }
          />
          <Route
            path="/search"
            element={
              <RequirePermission permission={PERMISSIONS.SEARCH_READ}>
                <SearchPage />
              </RequirePermission>
            }
          />
          <Route
            path="/reports"
            element={
              <RequirePermission permission={PERMISSIONS.REPORTS_READ}>
                <ReportsPage />
              </RequirePermission>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequirePermission permission={PERMISSIONS.NOTIFICATIONS_READ}>
                <NotificationsPage />
              </RequirePermission>
            }
          />
          <Route
            path="/roles"
            element={
              <RequirePermission permission={PERMISSIONS.ROLES_READ}>
                <RolesPage />
              </RequirePermission>
            }
          />
          <Route
            path="/settings"
            element={
              <RequirePermission permission={PERMISSIONS.SETTINGS_WRITE}>
                <SettingsPage />
              </RequirePermission>
            }
          />
          <Route
            path="/me"
            element={
              <RequirePermission permission={PERMISSIONS.DASHBOARD_READ}>
                <EmployeeHome />
              </RequirePermission>
            }
          />
          <Route
            path="/my-tasks"
            element={
              <RequirePermission permission={PERMISSIONS.TASKS_READ}>
                <MyTasks />
              </RequirePermission>
            }
          />
          <Route
            path="/my-team"
            element={
              <RequirePermission permission={PERMISSIONS.ALLOCATIONS_READ}>
                <MyTeam />
              </RequirePermission>
            }
          />
          <Route
            path="*"
            element={
              <RequirePermission permission={PERMISSIONS.DASHBOARD_READ}>
                <DashboardPage />
              </RequirePermission>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
