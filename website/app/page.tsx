import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PlayableDemo from "@/components/PlayableDemo";
import TaskBoard from "@/components/TaskBoard";
import RecommendationBoard from "@/components/RecommendationBoard";
import TechStackMatrix from "@/components/TechStackMatrix";
import CollaboratorPortal from "@/components/CollaboratorPortal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PlayableDemo />
        <TaskBoard />
        <RecommendationBoard />
        <TechStackMatrix />
        <CollaboratorPortal />
      </main>
      <Footer />
    </div>
  );
}
