// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

export default function PageNotFound() {
  return (
    <DashboardLayout>
      <UpperNavBar />
      <h1>404: Page Not found</h1>
      <h2>Ups... Something went wrong...</h2>
      <Footer />
    </DashboardLayout>
  );
}