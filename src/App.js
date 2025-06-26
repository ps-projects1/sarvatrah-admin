import { Route, Routes, Outlet } from "react-router-dom";
import Layout from "./layouts/Layout";
import ActivityLayout from "./layouts/ActivityLayout";
import React from "react";
import ProtectedRoute from "../src/components/Common/ProtectedRoute";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ToastContainer from "./components/Common/ToastContainer";

// Page components (lazy-loaded)
const LoginPage = React.lazy(() => import("./pages/Auth/Login"));
const Dashboard = React.lazy(() => import("./components/home/dashboard"));
const Hotel = React.lazy(() => import("./pages/Hotel/Hotel"));
const AddVehicle = React.lazy(() => import("./components/home/addVehicle"));
const AddCategory = React.lazy(() => import("./components/home/addCategory"));
const AddActivity = React.lazy(() => import("./components/home/addActivity"));
const AddAdvanture = React.lazy(() => import("./components/home/addAdvanture"));
const AddHolidayPackage = React.lazy(() =>
  import("./components/home/addHolidayPackage")
);
const AddPolicy = React.lazy(() => import("./components/home/policy"));
const ManageDriver = React.lazy(() => import("./components/home/manageDriver"));
const ManageOffer = React.lazy(() => import("./components/home/manageOffer"));
const ManageSeasonality = React.lazy(() =>
  import("./components/home/manageSeasonality")
);
const ManageVendor = React.lazy(() => import("./components/home/manageVendor"));
const ManageFooter = React.lazy(() => import("./components/home/manageFooter"));

// Activity components (lazy-loaded)
const Titel = React.lazy(() => import("./components/activityComponents/titel"));
const Duration = React.lazy(() =>
  import("./components/activityComponents/duration")
);
const Categories = React.lazy(() =>
  import("./components/activityComponents/categories")
);
const Location = React.lazy(() =>
  import("./components/activityComponents/location")
);
const Description = React.lazy(() =>
  import("./components/activityComponents/description")
);
const Photos = React.lazy(() =>
  import("./components/activityComponents/photos")
);
const Videos = React.lazy(() =>
  import("./components/activityComponents/video")
);
const Inclusions = React.lazy(() =>
  import("./components/activityComponents/Inclusions")
);
const Exclusions = React.lazy(() =>
  import("./components/activityComponents/exclusions")
);
const TimeDatePass = React.lazy(() =>
  import("./components/activityComponents/timeDatePass")
);
const OpeningHours = React.lazy(() =>
  import("./components/activityComponents/openingHours")
);
const BookingCutoff = React.lazy(() =>
  import("./components/activityComponents/bookingCutoff")
);
const Capacity = React.lazy(() =>
  import("./components/activityComponents/capacity")
);
const StartTime = React.lazy(() =>
  import("./components/activityComponents/startTime")
);
const PricingCategories = React.lazy(() =>
  import("./components/activityComponents/pricingCategories")
);
const Rates = React.lazy(() => import("./components/activityComponents/rates"));
const Pricing = React.lazy(() =>
  import("./components/activityComponents/pricing")
);
const MeetingPickup = React.lazy(() =>
  import("./components/activityComponents/meetingPickup")
);
const MeetingPoint = React.lazy(() =>
  import("./components/activityComponents/meetingPoint")
);
const Calender = React.lazy(() =>
  import("./components/activityComponents/Calender")
);

// Route configuration
const routes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/hotel", element: <Hotel /> },
  { path: "/addVehicle", element: <AddVehicle /> },
  { path: "/addCategory", element: <AddCategory /> },
  { path: "/addActivity", element: <AddActivity /> },
  { path: "/addAdvanture", element: <AddAdvanture /> },
  { path: "/addHolidayPackage", element: <AddHolidayPackage /> },
  { path: "/policy", element: <AddPolicy /> },
  { path: "/manageDriver", element: <ManageDriver /> },
  { path: "/manageOffer", element: <ManageOffer /> },
  { path: "/manageSeasonality", element: <ManageSeasonality /> },
  { path: "/manageVendor", element: <ManageVendor /> },
  { path: "/manageFooter", element: <ManageFooter /> },
];

const activityRoutes = [
  { path: "/titel", component: Titel },
  { path: "/duration", component: Duration },
  { path: "/categories", component: Categories },
  { path: "/location", component: Location },
  { path: "/description", component: Description },
  { path: "/photos", component: Photos },
  { path: "/videos", component: Videos },
  { path: "/inclusions", component: Inclusions },
  { path: "/exclusions", component: Exclusions },
  { path: "/timeDatePass", component: TimeDatePass },
  { path: "/openingHours", component: OpeningHours },
  { path: "/bookingCutoff", component: BookingCutoff },
  { path: "/capacity", component: Capacity },
  { path: "/startTime", component: StartTime },
  { path: "/calendar", component: Calender },
  { path: "/pricingCategories", component: PricingCategories },
  { path: "/rates", component: Rates },
  { path: "/pricing", component: Pricing },
  { path: "/meetingPickup", component: MeetingPickup },
  { path: "/meetingPoint", component: MeetingPoint },
];

// Main Layout wrapper for protected routes
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};

// Activity Layout wrapper
const ActivityRoutesWrapper = () => {
  return (
    <ActivityLayout>
      <Outlet />
    </ActivityLayout>
  );
};

function App() {
  return (
    <>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes without Layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes with Layout */}
          <Route element={<ProtectedLayout />}>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}

            {/* Activity routes with nested layout */}
            <Route element={<ActivityRoutesWrapper />}>
              {activityRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={`/activity${route.path}`}
                  element={<route.component />}
                />
              ))}
            </Route>
          </Route>
        </Routes>
      </React.Suspense>
      <ToastContainer />
    </>
  );
}

export default App;
