import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

export default function MyProfilePage() {
  return (
    <DashboardLayout>
      <UpperNavBar />
      <h1>Profile Page</h1>
      <p>texto</p>
      <Footer />
    </DashboardLayout>
  );
}
