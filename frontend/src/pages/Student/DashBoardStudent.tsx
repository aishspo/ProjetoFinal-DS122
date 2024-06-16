import { Header } from "@/components/Header";
import { StudentFolders } from "@/components/StudentFolders";
import { Footer } from "@/components/Footer";
import { DocumentsList } from "@/components/DocumentsList";

export const DashBoardStudent = () => {
  return (
    <>
      <div className="min-h-screen">
        <Header />
        <StudentFolders />
        <DocumentsList
          onDocumentDelete={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
        <Footer />
      </div>
    </>
  );
};
