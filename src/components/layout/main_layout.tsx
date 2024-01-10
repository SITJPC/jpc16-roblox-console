import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Suspense fallback={<></>}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default MainLayout;
