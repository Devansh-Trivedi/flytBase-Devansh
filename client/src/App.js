import './App.css';
import post from "./Post";
import Header from "./Header";
import {Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {UserContextProvider} from "./UserContext";
import Createpost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import Editpost from "./pages/EditPost";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<Createpost/>} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<Editpost/>} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
