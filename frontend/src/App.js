import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Feed from "./pages/Feed";
import Cookbooks from "./pages/Cookbooks";
import Planner from "./pages/Planner";
import AddRecipe from "./pages/AddRecipe";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/cookbooks" element={<Cookbooks />} />
        <Route path="/planner" element={<Planner />} />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddRecipe />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;