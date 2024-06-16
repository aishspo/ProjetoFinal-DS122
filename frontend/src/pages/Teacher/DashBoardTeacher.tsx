import { Header } from "@/components/Header";
import { DocumentsList } from "@/components/DocumentsList";
import { StudentsList } from "@/components/StudentsList";
import { Footer } from "@/components/Footer";

export const DashBoardTeacher = () => {
  return (
    <>
      <div className="min-h-screen">
        <Header />
        <div className="mt-8 container sm:flex sm:flex-col md:grid md:grid-cols-2 gap-8 justify-items-center justify-center items-star">
          <StudentsList />
          <DocumentsList
            onDocumentDelete={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
        <Footer />
      </div>
    </>
  );
};
