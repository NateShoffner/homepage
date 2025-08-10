import { Outlet } from "react-router-dom";
import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { Helmet } from "react-helmet";

const Layout = () => {
  return (
    <>
      <Helmet
        titleTemplate="%s &bull; Nate Shoffner"
        defaultTitle="Nate Shoffner"
      />
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default Layout;
