import {Route, Routes} from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import RequirePermission from "../features/auth/components/RequirePermission";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import EmployeeList from "../features/employees/pages/EmployeeList";
import EmployeeCreate from "../features/employees/pages/EmployeeCreate";
import EmployeeEdit from "../features/employees/pages/EmployeeEdit";
import EmployeeProfile from "../features/employees/pages/EmployeeProfile";
import ProjectList from "../features/projects/pages/ProjectList";
import ProjectCreate from "../features/projects/pages/ProjectCreate";
import ProjectEdit from "../features/projects/pages/ProjectEdit";
import AllocationList from "../features/allocations/pages/AllocationList";
import AllocationCreate from "../features/allocations/pages/AllocationCreate";
import AvailabilityPage from "../features/availability/pages/AvailabilityPage";
import ReportsPage from "../features/reports/pages/ReportsPage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";
import RolesPage from "../features/roles/pages/RolesPage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import EmployeeHome from "../features/employees/pages/EmployeeHome";
import TaskList from "../features/tasks/pages/TaskList";
import TaskCreate from "../features/tasks/pages/TaskCreate";
import TaskEdit from "../features/tasks/pages/TaskEdit";
import MyTasks from "../features/tasks/pages/MyTasks";
import DepartmentsPage from "../features/departments/pages/DepartmentsPage";
import SkillsPage from "../features/skills/pages/SkillsPage";
import TimesheetsPage from "../features/timesheets/pages/TimesheetsPage";
import LeavesPage from "../features/leaves/pages/LeavesPage";
import AnalyticsPage from "../features/analytics/pages/AnalyticsPage";
import CalendarPage from "../features/calendar/pages/CalendarPage";
import AuditPage from "../features/audit/pages/AuditPage";
import SearchPage from "../features/search/pages/SearchPage";
import MyTeam from "../features/employees/pages/MyTeam";
import RequestsPage from "../features/requests/pages/RequestsPage";
import EmployeeWorkspace from "../features/employees/pages/EmployeeWorkspace";
import {PERMISSIONS} from "../shared/utils/permissions";

const AppRoutes = () => {
  return (
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
          path="/my-planning"
          element={
            <RequirePermission permission={PERMISSIONS.DASHBOARD_READ}>
              <EmployeeWorkspace />
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
  );
};

export default AppRoutes;

