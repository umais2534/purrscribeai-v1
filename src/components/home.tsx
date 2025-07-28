import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mic,
  History,
  PawPrint,
  Building2,
  User,
  ChevronRight,
  Phone,
  FileText,
  NotebookPen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userName, setUserName] = useState("Dr. Smith");
  const navigate = useNavigate();

  const quickAccessCards = [
    {
      title: "New Transcription",
      description: "Record and transcribe a new audio note",
      icon: <Mic className="h-8 w-8 text-purrscribe-blue" />,
      action: () => navigate("/transcribe"),
      color: "bg-primary-50",
    },
    {
      title: "Transcription History",
      description: "View and manage your past transcriptions",
      icon: <History className="h-8 w-8 text-accent-purple-500" />,
      action: () => navigate("/history"),
      color: "bg-accent-purple-50",
    },
    {
      title: "Manage Pets",
      description: "Add, edit, or view pet profiles",
      icon: <PawPrint className="h-8 w-8 text-accent-teal-500" />,
      action: () => navigate("/pets"),
      color: "bg-accent-teal-50",
    },
    {
      title: "Owner Calls",
      description: "Call pet owners and record conversations",
      icon: <Phone className="h-8 w-8 text-primary-600" />,
      action: () => navigate("/calls"),
      color: "bg-primary-50",
    },
    {
      title: "File Management",
      description: "Upload, view, and share documents",
      icon: <FileText className="h-8 w-8 text-accent-purple-500" />,
      action: () => navigate("/files"),
      color: "bg-accent-purple-50",
    },
    {
      title: "Manage Clinics",
      description: "Organize your veterinary clinics",
      icon: <Building2 className="h-8 w-8 text-accent-teal-600" />,
      action: () => navigate("/clinics"),
      color: "bg-accent-teal-50",
    },
    {
      title: "Manage Templates",
      description: "Organize your transcription templates",
      icon: <NotebookPen className="h-8 w-8 text-accent-teal-600" />,
      action: () => navigate("/templates"),
      color: "bg-accent-teal-50",
    },
    {
      title: "Profile Settings",
      description: "Update your profile and preferences",
      icon: <User className="h-8 w-8 text-accent-purple-600" />,
      action: () => navigate("/profile"),
      color: "bg-accent-purple-50",
    },
  ];

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const recentTranscriptions = [
    {
      id: 1,
      title: "Max - Annual Checkup",
      date: "Today, 2:30 PM",
      format: "SOAP Notes",
      preview:
        "S: Owner reports increased water consumption and urination. O: Weight 32kg, temp 38.5°C...",
    },
    {
      id: 2,
      title: "Bella - Vaccination",
      date: "Yesterday, 10:15 AM",
      format: "Medical Notes",
      preview:
        "Administered DHPP vaccine. Patient tolerated procedure well. Next vaccination due in 3 weeks...",
    },
    {
      id: 3,
      title: "Charlie - Skin Condition",
      date: "2 days ago",
      format: "Raw Text",
      preview:
        "Observed multiple lesions on dorsal surface. Taking skin scraping for analysis. Prescribed...",
    },
  ];

  return (
    <div className="bg-background min-h-screen p-6 bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground">
            Manage your veterinary transcriptions and patient records
          </p>
        </section>

        {/* Quick Access Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickAccessCards.map((card, index) => (
              <Card
                key={index}
                className="overflow-hidden transition-all hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div
                    className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 ${card.color}`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {card.description}
                  </p>
                  <Button
                    onClick={card.action}
                    className="w-full bg-purrscribe-blue hover:bg-primary-700"
                  >
                    Go to {card.title.split(" ").pop()}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Transcriptions */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Transcriptions</h2>
            <Button variant="outline" onClick={() => navigate("/history")}>
              View All
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentTranscriptions.map((transcription) => (
              <Card
                key={transcription.id}
                className="hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/history/${transcription.id}`)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {transcription.title}
                      </CardTitle>
                      <CardDescription>
                        {transcription.date} • {transcription.format}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {transcription.preview}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transcriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Registered Pets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Clinics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Home;
