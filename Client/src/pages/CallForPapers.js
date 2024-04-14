import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

import CompleteTable from "OurComponents/Table/CompleteTable";

export default function CallForPapers() {
  const columns = [
    { field: "confname", headerName: "Conference Name", width: 200 },
    { field: "confRole", headerName: "Your Role", width: 200 },
  ];
  const rows = [];

  return (
    <DashboardLayout>
      <UpperNavBar />
      <CompleteTable columns={columns} rows={rows} numerOfRowsPerPage={5} />
      <Footer />
    </DashboardLayout>
  );
}
