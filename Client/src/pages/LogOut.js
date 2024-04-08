import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

export default function LogOut() {
  const navigate = useNavigate();
  const { logOutUser } = useContext(AuthContext);

  useEffect(() => {
    const performLogout = async () => {
      await logOutUser();
      navigate("/HomePage");
    };

    performLogout();
  }, [logOutUser, navigate]);

  return (
    <DashboardLayout>
      <UpperNavBar />
      <h1>Home Page</h1>
      <Footer />
    </DashboardLayout>
  );
}