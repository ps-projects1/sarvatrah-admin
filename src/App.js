import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import ActivityLayout from "./layouts/ActivityLayout";
import React from "react";
import ProtectedRoute from "../src/components/Common/ProtectedRoute";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ToastContainer from "./components/Common/ToastContainer";
import "./assets/css/globalstyles.css";

// Page components (lazy-loaded)
const LoginPage = React.lazy(() => import("./pages/Auth/Login"));
const Dashboard = React.lazy(() => import("./components/home/dashboard"));
const Hotel = React.lazy(() => import("./pages/Hotel/Hotel"));
const City = React.lazy(() => import("./pages/City/City"));
const AddVehicle = React.lazy(() => import("./components/home/addVehicle"));
const AddCategory = React.lazy(() => import("./components/home/addCategory"));
const AddActivity = React.lazy(() => import("./components/home/addActivity"));
const AddAdvanture = React.lazy(() => import("./components/home/addAdvanture"));
const PackageListing = React.lazy(() =>
  import("./components/home/PackageComponents/PackageListing")
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

// Create a default component for activity index
const ActivityDefault = React.lazy(() => import("./components/activityComponents/ActivityDefault"));

// Main routes configuration
const mainRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/hotel", element: <Hotel /> },
  { path: "/city", element: <City /> },
  { path: "/addVehicle", element: <AddVehicle /> },
  { path: "/addCategory", element: <AddCategory /> },
  { path: "/addAdvanture", element: <AddAdvanture /> },
  { path: "/holiday-packages", element: <PackageListing /> },
  { path: "/policy", element: <AddPolicy /> },
  { path: "/manageDriver", element: <ManageDriver /> },
  { path: "/manageOffer", element: <ManageOffer /> },
  { path: "/manageSeasonality", element: <ManageSeasonality /> },
  { path: "/manageVendor", element: <ManageVendor /> },
  { path: "/manageFooter", element: <ManageFooter /> },
  { path: "/addactivity", element: <AddActivity /> },
];

// Activity routes configuration - only define them once
const activityRoutes = [
  { path: "titel", element: <Titel /> },
  { path: "duration", element: <Duration /> },
  { path: "categories", element: <Categories /> },
  { path: "location", element: <Location /> },
  { path: "description", element: <Description /> },
  { path: "photos", element: <Photos /> },
  { path: "videos", element: <Videos /> },
  { path: "inclusions", element: <Inclusions /> },
  { path: "exclusions", element: <Exclusions /> },
  { path: "timeDatePass", element: <TimeDatePass /> },
  { path: "openingHours", element: <OpeningHours /> },
  { path: "bookingCutoff", element: <BookingCutoff /> },
  { path: "capacity", element: <Capacity /> },
  { path: "startTime", element: <StartTime /> },
  { path: "pricingCategories", element: <PricingCategories /> },
  { path: "rates", element: <Rates /> },
  { path: "pricing", element: <Pricing /> },
  { path: "meetingPickup", element: <MeetingPickup /> },
  { path: "meetingPoint", element: <MeetingPoint /> },
  { path: "calendar", element: <Calender /> },
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
            {/* Main routes */}
            {mainRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}

            {/* Activity nested routes - Use ActivityLayout directly */}
            <Route path="/activity" element={<ActivityLayout />}>
              <Route index element={<ActivityDefault />} />
              {activityRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </React.Suspense>
      <ToastContainer />
    </>
  );
}

export default App;