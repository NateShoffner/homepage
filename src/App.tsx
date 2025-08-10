import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@pages/Layout";
import Home from "@pages/Home";
import NoPage from "@pages/NoPage";
import Projects from "@pages/Projects";
import Blog from "@pages/Blog";
import BlogPost from "@pages/BlogPost";
import Project from "@pages/Project";
import Category from "@pages/Category";
import Tag from "@pages/Tag";
import Privacy from "@pages/Privacy";
import Disclosure from "@pages/Disclosure";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about/privacy" element={<Privacy />} />
          <Route path="about/disclosure" element={<Disclosure />} />
          <Route path="blog" element={<Blog />} />
          <Route
            path="blog/:year/:month/:slug"
            element={<BlogPost slug={""} />}
          />
          <Route path="blog/category/:category" element={<Category />} />
          <Route path="blog/tag/:tag" element={<Tag />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<Project />} />

          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
