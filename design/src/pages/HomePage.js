// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

export default function HomePage() {
  return (
    <DashboardLayout>
      <UpperNavBar />
      <h1>Home Page</h1>
      <p>texto</p>
      <Footer />
    </DashboardLayout>
  );
}