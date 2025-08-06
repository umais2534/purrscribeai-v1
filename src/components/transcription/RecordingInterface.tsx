import React, { useState, useRef, useEffect } from "react";

import {
  Mic,
  Pause,
  StopCircle,
  Play,
  Save,
  Edit,
  Trash2,
  AlertCircle,
  Plus,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { API_BASE_URL } from "@/config/apiConfig";
import VisitTypeTemplates, { VisitTypeTemplate } from "./VisitTypeTemplates";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age?: string;
  owner: string;
}

interface Clinic {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
}

interface RecordingInterfaceProps {
  onSave?: (transcription: {
    text: string;
    format: string;
    petId?: string;
    clinicId?: string;
    visitType?: string;
    templateId?: string;
  }) => void;
}

const RecordingInterface: React.FC<RecordingInterfaceProps> = ({
  
  onSave = () => {},
}) => {
  // State for recording
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [format, setFormat] = useState("raw");
  const [transcriptionText, setTranscriptionText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranscriptionComplete, setIsTranscriptionComplete] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
const [displayText, setDisplayText] = useState("");
  const transcriptionTexts = "Yahan tumhara text aayega, letter by letter.";
   useEffect(() => {
    let isCancelled = false;

    const animateText = async () => {
      setDisplayText("");
      for (let i = 0; i < transcriptionText.length; i++) {
        if (isCancelled) return;
        setDisplayText((prev) => prev + transcriptionText.charAt(i));
        await new Promise((res) => setTimeout(res, 30)); // Smooth delay
      }
    };

    animateText();

  return () => {
      isCancelled = true; // Clean up on unmount or new input
    };
  }, [transcriptionText]);

  // New state for pet and clinic selection
  const [selectedPet, setSelectedPet] = useState<string | undefined>();
  const [selectedClinic, setSelectedClinic] = useState<string | undefined>();
  const [visitType, setVisitType] = useState<string>("");
  const [isAddPetDialogOpen, setIsAddPetDialogOpen] = useState(false);
  const [isAddClinicDialogOpen, setIsAddClinicDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<VisitTypeTemplate | null>(null);
  const [newPet, setNewPet] = useState<Partial<Pet>>({
    name: "",
    species: "",
    breed: "",
    owner: "",
  });
  const [newClinic, setNewClinic] = useState<Partial<Clinic>>({
    name: "",
  });
  const [recordingUUID, setRecordingUUID] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  // Refs
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // Real waveform data
  const [waveformData, setWaveformData] = useState<number[]>(Array(50).fill(5));

  // Mock pets and clinics data
  const mockPets = [
    {
      id: "1",
      name: "Max",
      species: "Dog",
      breed: "Golden Retriever",
      age: "5 years",
      owner: "John Smith",
    },
    {
      id: "2",
      name: "Bella",
      species: "Cat",
      breed: "Siamese",
      age: "3 years",
      owner: "Sarah Johnson",
    },
    {
      id: "3",
      name: "Charlie",
      species: "Dog",
      breed: "Beagle",
      age: "2 years",
      owner: "Michael Brown",
    },
  ];

  const mockClinics = [
    {
      id: "1",
      name: "Main Street Veterinary Clinic",
      address: "123 Main St",
      city: "Springfield",
      state: "IL",
    },
    {
      id: "2",
      name: "Animal Care Center",
      address: "456 Oak Ave",
      city: "Riverdale",
      state: "IL",
    },
    {
      id: "3",
      name: "Pet Health Hospital",
      address: "789 Pine Rd",
      city: "Lakeside",
      state: "IL",
    },
  ];

  // Visit types
  const visitTypes = [
    "Annual Checkup",
    "Vaccination",
    "Illness",
    "Injury",
    "Surgery Follow-up",
    "Dental Cleaning",
    "Emergency",
    "Other",
  ];

  // Generate a UUID for the recording
  useEffect(() => {
    // Simple UUID generator for demo purposes
    const generateUUID = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
    };

    setRecordingUUID(generateUUID());
  }, []);

  // Setup audio context and analyser
  useEffect(() => {
    if (isRecording && !isPaused) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      if (audioStreamRef.current && audioContextRef.current) {
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 128;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const source = audioContextRef.current.createMediaStreamSource(
          audioStreamRef.current,
        );
        source.connect(analyser);

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        // Start visualization loop
        updateWaveform();
      }
    }

    return () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        // Clean up audio context when component unmounts
        audioContextRef.current.close();
      }
    };
  }, [isRecording, isPaused]);

  // Update waveform visualization
  const updateWaveform = () => {
    if (
      !isRecording ||
      isPaused ||
      !analyserRef.current ||
      !dataArrayRef.current
    )
      return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    // Convert frequency data to waveform heights
    const newWaveformData = Array(50).fill(0);
    const step = Math.floor(dataArrayRef.current.length / 50);

    for (let i = 0; i < 50; i++) {
      const index = i * step;
      if (index < dataArrayRef.current.length) {
        // Scale the value to a reasonable height percentage (0-80)
        newWaveformData[i] = (dataArrayRef.current[index] / 255) * 80;
      }
    }

    setWaveformData(newWaveformData);

    // Continue the visualization loop
    requestAnimationFrame(updateWaveform);
  };

  // Request microphone permissions and start recording
  const startRecording = async () => {
    // Pet, clinic, and visit type are now optional
    // They can be added later if not selected now

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Clear previous recording data
      audioChunksRef.current = [];

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);
      setIsTranscriptionComplete(false);
      setTranscriptionText("");
      setPermissionDenied(false);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setPermissionDenied(true);
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Restart timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    setIsRecording(false);
    setIsPaused(false);

    // Stop media recorder
    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Stop all audio tracks
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start transcription process
    setIsTranscribing(true);

    // Process the recorded audio
    setTimeout(() => {
      // In a real app, you would send the audio to a transcription service
      // For now, we'll use mock data based on the selected format
      let mockTranscription = "";
      const pet = mockPets.find((p) => p.id === selectedPet);
      const clinic = mockClinics.find((c) => c.id === selectedClinic);

      // If a template is selected, use that as the base
      if (selectedTemplate) {
        mockTranscription = selectedTemplate.template;

        // Replace placeholders with actual values if available
        mockTranscription = mockTranscription
          .replace(/\{PET_NAME\}/g, pet?.name || "")
          .replace(/\{OWNER_NAME\}/g, pet?.owner || "")
          .replace(/\{CLINIC_NAME\}/g, clinic?.name || "")
          .replace(/\{VISIT_TYPE\}/g, visitType || "")
          .replace(/\{DATE\}/g, new Date().toLocaleDateString());
      } else if (format === "soap") {
        mockTranscription = `SUBJECTIVE: ${pet?.name || "Patient"} presented with lethargy and decreased appetite for 3 days. Owner ${pet?.owner || ""} reports vomiting twice yesterday.\n\nOBJECTIVE: Temperature: 102.5°F, Heart Rate: 110 bpm, Respiratory Rate: 24 rpm. Mild dehydration noted.\n\nASSESSMENT: Suspected gastroenteritis with moderate dehydration.\n\nPLAN: Subcutaneous fluids administered. Prescribed metronidazole 250mg BID for 7 days. Recommend bland diet for 3-5 days.`;
      } else if (format === "medical") {
        mockTranscription = `Patient: ${pet?.name || ""} (${pet?.species || ""}, ${pet?.breed || ""})\nClinic: ${clinic?.name || ""}\nVisit Type: ${visitType}\nDate: ${new Date().toLocaleDateString()}\n\nPatient examination revealed mild dehydration with elevated heart rate. Abdominal palpation showed slight discomfort in the upper right quadrant. Mucous membranes slightly tacky. Administered 250ml subcutaneous fluids and prescribed metronidazole 250mg twice daily for 7 days. Owner instructed to feed bland diet of boiled chicken and rice for 3-5 days.`;
      } else {
        mockTranscription = `${pet?.name || "The patient"} has been showing signs of lethargy and decreased appetite for about 3 days. Upon examination at ${clinic?.name || "the clinic"}, I found mild dehydration and slight abdominal discomfort. I've administered subcutaneous fluids and prescribed metronidazole. The owner ${pet?.owner || ""} should feed a bland diet for a few days and monitor closely. If symptoms don't improve in 48 hours, a follow-up appointment is recommended.`;
      }

      setTranscriptionText(mockTranscription);
      setIsTranscribing(false);
      setIsTranscriptionComplete(true);
    }, 3000);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Confirm save transcription
  const confirmSaveTranscription = () => {
    setIsSaveDialogOpen(true);
  };

  // Save transcription
  const saveTranscription = () => {
    onSave({
      text: transcriptionText,
      format,
      petId: selectedPet,
      clinicId: selectedClinic,
      visitType: visitType,
      templateId: selectedTemplate?.id,
    });

    // Reset state
    setRecordingTime(0);
    setTranscriptionText("");
    setIsTranscriptionComplete(false);
    setSelectedPet(undefined);
    setSelectedClinic(undefined);
    setVisitType("");
    setSelectedTemplate(null);
    setIsSaveDialogOpen(false);
    setIsEditMode(false);
  };

  // Discard transcription
  const discardTranscription = () => {
    setTranscriptionText("");
    setIsTranscriptionComplete(false);
    setRecordingTime(0);
    setIsDiscardDialogOpen(false);
  };

  // Add new pet
  const handleAddPet = () => {
    if (!newPet.name || !newPet.species || !newPet.breed || !newPet.owner) {
      alert("Please fill in all required pet fields");
      return;
    }

    // In a real app, this would call an API to add the pet
    // For now, we'll just close the dialog
    setIsAddPetDialogOpen(false);

    // Reset the form
    setNewPet({
      name: "",
      species: "",
      breed: "",
      owner: "",
    });
  };

  // Add new clinic
  const handleAddClinic = () => {
    if (!newClinic.name) {
      alert("Please enter a clinic name");
      return;
    }

    // In a real app, this would call an API to add the clinic
    // For now, we'll just close the dialog
    setIsAddClinicDialogOpen(false);

    // Reset the form
    setNewClinic({
      name: "",
    });
  };
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
//animation

  return (
    <div className="bg-gradient-to-br from-[#f0f4ff] via-[#e8faff] to-[#fef6e4] p-6 rounded-xl shadow-md mt-10 mr-5">
      <div className="space-y-8">
        {/* Pet and Clinic Selection */}
        <motion.div variants={fadeInUp} initial="hidden" animate="show">
      <Card className="bg-white/80 backdrop-blur-lg shadow-xl border border-gray-200 rounded-2xl transition-all">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Visit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pet Selection */}
            <div className="space-y-2">
              <Label htmlFor="pet-select">Pet (Optional)</Label>
              <div className="flex gap-2 items-start">
                <Select
                  value={selectedPet}
                  onValueChange={setSelectedPet}
                  disabled={isRecording}
                >
                  <SelectTrigger id="pet-select" className="w-full">
                    <SelectValue placeholder="Select pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isAddPetDialogOpen} onOpenChange={setIsAddPetDialogOpen}>
                  <DialogTrigger asChild className="bg-[#E6EFFF] text-gray-900 hover:bg-[#c9defc] hover:text-[#1e293b] "
>
                    <Button variant="outline" size="icon" disabled={isRecording}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                 <DialogContent
  className="transition-all duration-300 ease-out scale-95 opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100"
>
                    <DialogHeader>
                      <DialogTitle>Add New Pet</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="pet-name">Pet Name</Label>
                          <Input
                            id="pet-name"
                            value={newPet.name}
                            onChange={(e) =>
                              setNewPet({ ...newPet, name: e.target.value })
                            }
                            placeholder="Max"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="species">Species</Label>
                          <Select
                            value={newPet.species}
                            onValueChange={(value) =>
                              setNewPet({ ...newPet, species: value })
                            }
                          >
                            <SelectTrigger id="species">
                              <SelectValue placeholder="Select species" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dog">Dog</SelectItem>
                              <SelectItem value="Cat">Cat</SelectItem>
                              <SelectItem value="Bird">Bird</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="breed">Breed</Label>
                          <Input
                            id="breed"
                            value={newPet.breed}
                            onChange={(e) =>
                              setNewPet({ ...newPet, breed: e.target.value })
                            }
                            placeholder="Golden Retriever"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="owner">Owner</Label>
                          <Input
                            id="owner"
                            value={newPet.owner}
                            onChange={(e) =>
                              setNewPet({ ...newPet, owner: e.target.value })
                            }
                            placeholder="John Smith"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setIsAddPetDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddPet}>Add Pet</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {selectedPet && (
                <p className="text-sm text-gray-500 mt-1">
                  {mockPets.find((p) => p.id === selectedPet)?.breed}, Owner:{" "}
                  {mockPets.find((p) => p.id === selectedPet)?.owner}
                </p>
              )}
            </div>

            {/* Clinic Selection */}
            <div className="space-y-2">
              <Label htmlFor="clinic-select">Clinic (Optional)</Label>
              <div className="flex gap-2 items-start">
                <Select
                  value={selectedClinic}
                  onValueChange={setSelectedClinic}
                  disabled={isRecording}
                >
                  <SelectTrigger id="clinic-select" className="w-full">
                    <SelectValue placeholder="Select clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClinics.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isAddClinicDialogOpen} onOpenChange={setIsAddClinicDialogOpen}>
                  <DialogTrigger asChild className="bg-[#E6EFFF] text-gray-900 hover:bg-[#c9defc] hover:text-[#1e293b] ">
                    <Button variant="outline" size="icon" disabled={isRecording}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Clinic</DialogTitle>
                    </DialogHeader>
                    <div className="py-2 space-y-4">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="clinic-name">Clinic Name</Label>
                        <Input
                          id="clinic-name"
                          value={newClinic.name}
                          onChange={(e) =>
                            setNewClinic({ ...newClinic, name: e.target.value })
                          }
                          placeholder="Main Street Veterinary Clinic"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setIsAddClinicDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddClinic}>Add Clinic</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {selectedClinic && (
                <p className="text-sm text-gray-500 mt-1">
                  {mockClinics.find((c) => c.id === selectedClinic)?.address},{" "}
                  {mockClinics.find((c) => c.id === selectedClinic)?.city}
                </p>
              )}
            </div>

            {/* Visit Type */}
            <div className="space-y-2">
              <Label htmlFor="visit-type">Visit Type (Optional)</Label>
              <Select
                value={visitType}
                onValueChange={setVisitType}
                disabled={isRecording}
              >
                <SelectTrigger id="visit-type">
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
                <SelectContent>
                  {visitTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
 <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Card className="bg-white/80 backdrop-blur-lg shadow-xl border border-gray-200 rounded-2xl transition-all"  >
          <CardHeader>
            {/* <CardTitle className="flex justify-between items-center">
              <span>Audio Recording</span>
              <div className="text-sm font-normal bg-[#E6EFFF] px-3 py-1 rounded-full">
                {formatTime(recordingTime)}
              </div>
            </CardTitle> */}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
              

                <Dialog
                  open={isTemplateDialogOpen}
                  onOpenChange={setIsTemplateDialogOpen}
                >
                 <div className="max-w-full flex flex-wrap sm:flex-nowrap">
  <DialogTrigger asChild>
    <Button
      variant="outline"
      className="flex items-center gap-2 max-w-full sm:max-w-none overflow-hidden"
    >
      <FileText size={16} />
      {selectedTemplate ? "Change Template" : "Select Template"}
    </Button>
  </DialogTrigger>
</div>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select a Template</DialogTitle>
                      <DialogDescription>
                        Choose a template to use for your transcription
                      </DialogDescription>
                    </DialogHeader>
                    <VisitTypeTemplates
                      onSelectTemplate={(template) => {
                        setSelectedTemplate(template);
                        setIsTemplateDialogOpen(false);
                      }}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsTemplateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {selectedTemplate && (
                <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                  <div>
                    <span className="text-sm font-medium">
                      Selected Template:{" "}
                    </span>
                    <span className="text-sm">{selectedTemplate.name}</span>
                    {selectedTemplate.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedTemplate.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Clear
                  </Button>
                </div>
              )}

              {/* Waveform visualization */}
              <div className="h-24 bg-muted/30 rounded-md flex items-center justify-center p-4">
                {permissionDenied ? (
                  <div className="flex flex-col items-center justify-center text-destructive">
                    <AlertCircle className="h-10 w-10 mb-2" />
                    <p className="text-center">
                      Microphone access denied. Please allow microphone access
                      in your browser settings.
                    </p>
                  </div>
                ) : isRecording ? (
                  <div className="flex items-end h-full w-full space-x-1">
                    {waveformData.map((height, index) => (
                      <motion.div
                        key={index}
                        className="bg-primary w-1"
                        style={{ height: `${height}%` }}
                        animate={{
                          height: `${height}%`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    {isTranscribing ? "Processing audio..." : "Ready to record"}
                  </div>
                )}
              </div>

              {isTranscribing && (
                <div className="space-y-2">
                  <div className="text-sm text-center">
                    Transcribing audio...
                  </div>
                  <Progress value={66} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
         <CardFooter className="flex justify-center">
  {!isRecording ? (
    <Button onClick={startRecording} disabled={isTranscribing}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
        }}
        className="mr-2"
      >
        <Mic className="h-4 w-4" />
      </motion.div>
      Start Recording
    </Button>
  ) : isPaused ? (
    <div className="flex sm:flex-row max-[400px]:flex-col gap-2">
      <Button variant="outline" onClick={resumeRecording}>
        <Play className="mr-2 h-4 w-4 bg-[#E6EFFF] text-black hover:bg-[#cbdcf8]" />
        Resume
      </Button>
      <Button variant="destructive" onClick={stopRecording}>
        <StopCircle className="mr-2 h-4 w-4" />
        Stop
      </Button>
    </div>
  ) : (
    <div className="flex sm:flex-row max-[400px]:flex-col gap-2">
      <Button variant="outline" onClick={pauseRecording}>
        <Pause className="mr-2 h-4 w-4" />
        Pause
      </Button>
      <Button onClick={stopRecording} variant="destructive">
        <StopCircle className="mr-2 h-4 w-4" />
        Stop
      </Button>
    </div>
  )}
</CardFooter>

        </Card></motion.div>

        {isTranscriptionComplete && (
          <div className="mt-8 space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>
                    {format === "soap"
                      ? "SOAP Notes"
                      : format === "medical"
                        ? "Medical Notes"
                        : "Raw Text"}
                  </span>
                  <div className="text-sm font-normal bg-primary/10 px-3 py-1 rounded-full">
                    {formatTime(recordingTime)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 ">
                {isEditMode && (
                  <div className="mb-4 space-y-4 p-4 border rounded-md bg-muted/20">
                    <h3 className="text-sm font-medium">
                      Edit Recording Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Pet Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-pet-select">Pet</Label>
                        <Select
                          value={selectedPet}
                          onValueChange={setSelectedPet}
                        >
                          <SelectTrigger
                            id="edit-pet-select"
                            className="w-full"
                          >
                            <SelectValue placeholder="Select pet" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPets.map((pet) => (
                              <SelectItem key={pet.id} value={pet.id}>
                                {pet.name} ({pet.species})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Clinic Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-clinic-select">Clinic</Label>
                        <Select
                          value={selectedClinic}
                          onValueChange={setSelectedClinic}
                        >
                          <SelectTrigger
                            id="edit-clinic-select"
                            className="w-full"
                          >
                            <SelectValue placeholder="Select clinic" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockClinics.map((clinic) => (
                              <SelectItem key={clinic.id} value={clinic.id}>
                                {clinic.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Visit Type Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="edit-visit-type">Visit Type</Label>
                        <Select value={visitType} onValueChange={setVisitType}>
                          <SelectTrigger id="edit-visit-type">
                            <SelectValue placeholder="Select visit type" />
                          </SelectTrigger>
                          <SelectContent>
                            {visitTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                <Textarea
                  value={displayText}
                  onChange={(e) => setTranscriptionText(e.target.value)}
                  className="min-h-[200px] font-mono"
                />
              </CardContent>
             <CardFooter className="flex justify-between max-[550px]:flex-col max-[550px]:items-stretch max-[550px]:space-y-2">
  <AlertDialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
    <AlertDialogTrigger asChild>
      <Button variant="destructive" className="max-[550px]:w-full">
        <Trash2 className="mr-2 h-4 w-4" />
        Discard
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Discard Transcription</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to discard this transcription? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={discardTranscription}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Discard
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  <div className="flex space-x-2 max-[550px]:flex-col max-[550px]:space-x-0 max-[550px]:space-y-2 max-[550px]:w-full">
    <Button
      className="transition-transform duration-300 transform hover:scale-105 max-[550px]:w-full"
      variant="outline"
      onClick={() => setIsEditMode(!isEditMode)}
    >
      <Edit className="mr-2 h-4 w-4" />
      {isEditMode ? "Done Editing" : "Edit"}
    </Button>

    <AlertDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button className="transition-transform duration-300 transform hover:scale-105 max-[550px]:w-full">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Transcription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to save this transcription?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={saveTranscription}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</CardFooter>

            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingInterface;
