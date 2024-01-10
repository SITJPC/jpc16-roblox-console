import { lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/main_layout";

const QuestionPage = lazy(() => import("./components/question/question"));
const SelectTeamPage = lazy(
  () => import("./components/selectTeam/select_team")
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/select" replace />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="select" element={<SelectTeamPage />} />
          <Route path="question" element={<QuestionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
