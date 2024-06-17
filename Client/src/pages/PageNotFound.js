// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import MDBox from "components/MDBox";

export default function PageNotFound() {
  return (
    <DashboardLayout>
      <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <MDBox ml={3} mt={3} textAlign="left">
          <h1>404: Page Not Found</h1>
        </MDBox>
        <MDBox ml={3} textAlign="left">
          <h2>:\ Oops... Something went wrong...</h2>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
