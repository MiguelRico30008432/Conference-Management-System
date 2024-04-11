// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export default function HomePage() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <DashboardLayout>
      <UpperNavBar />
      <h1>Home Page</h1>
      <p>texto</p>
      {isLoggedIn ? <p>User is loged in</p> : <p>User is not loged in</p>}
      <Footer />
    </DashboardLayout>
  );
}
