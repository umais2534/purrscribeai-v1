import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Play,
  Pause,
  MoreVertical,
  Edit,
  Trash2,
  Share,
  Printer,
  Download,
  FileText,
  Phone,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getCallRecordings,
  transcribeCallRecording,
  summarizeTranscription,
  deleteCallRecording,
  approveTranscription,
  rejectTranscription,
  CallRecording,
} from "@/services/callService";

// Sample pets data for the dialog
const pets = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    owner: "John Smith",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  },
  {
    id: "2",
    name: "Bella",
    breed: "Siamese Cat",
    owner: "Emily Johnson",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
  },
  {
    id: "3",
    name: "Charlie",
    breed: "Beagle",
    owner: "Michael Williams",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
  },
  {
    id: "4",
    name: "Luna",
    breed: "Maine Coon",
    owner: "Sophia Brown",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  },
];

const CallHistory = () => {
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecording, setSelectedRecording] =
    useState<CallRecording | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isNewCallDialogOpen, setIsNewCallDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<{
    id: string;
    name: string;
    owner: string;
  } | null>(null);

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    setIsLoading(true);
    try {
      const data = await getCallRecordings();
      setRecordings(data);
    } catch (error) {
      console.error("Failed to load call recordings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscribe = async (recordingId: string) => {
    setIsTranscribing(true);
    try {
      const updatedRecording = await transcribeCallRecording(recordingId);
      setRecordings(
        recordings.map((rec) =>
          rec.id === recordingId ? updatedRecording : rec,
        ),
      );
      if (selectedRecording?.id === recordingId) {
        setSelectedRecording(updatedRecording);
      }
    } catch (error) {
      console.error("Failed to transcribe recording:", error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSummarize = async (recordingId: string) => {
    setIsSummarizing(true);
    try {
      const updatedRecording = await summarizeTranscription(recordingId);
      setRecordings(
        recordings.map((rec) =>
          rec.id === recordingId ? updatedRecording : rec,
        ),
      );
      if (selectedRecording?.id === recordingId) {
        setSelectedRecording(updatedRecording);
      }
    } catch (error) {
      console.error("Failed to summarize transcription:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Approve transcription
  const handleApprove = async (recordingId: string) => {
    setIsApproving(true);
    try {
      const updatedRecording = await approveTranscription(recordingId);
      setRecordings(
        recordings.map((rec) =>
          rec.id === recordingId ? updatedRecording : rec,
        ),
      );
      if (selectedRecording?.id === recordingId) {
        setSelectedRecording(updatedRecording);
      }
    } catch (error) {
      console.error("Failed to approve transcription:", error);
    } finally {
      setIsApproving(false);
    }
  };

  // Reject transcription
  const handleReject = async (recordingId: string) => {
    setIsRejecting(true);
    try {
      const updatedRecording = await rejectTranscription(recordingId);
      setRecordings(
        recordings.map((rec) =>
          rec.id === recordingId ? updatedRecording : rec,
        ),
      );
      if (selectedRecording?.id === recordingId) {
        setSelectedRecording(updatedRecording);
      }
    } catch (error) {
      console.error("Failed to reject transcription:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecording) return;

    try {
      await deleteCallRecording(selectedRecording.id);
      setRecordings(
        recordings.filter((rec) => rec.id !== selectedRecording.id),
      );
      setIsDetailsOpen(false);
      setIsDeleteDialogOpen(false);
      setSelectedRecording(null);
    } catch (error) {
      console.error("Failed to delete recording:", error);
    }
  };

  const toggleAudio = (recordingId: string, audioUrl?: string) => {
    if (!audioUrl) return;

    if (audioPlaying === recordingId) {
      audioRef.current?.pause();
      setAudioPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      audioRef.current.onended = () => setAudioPlaying(null);
      setAudioPlaying(recordingId);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredRecordings = recordings.filter((recording) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      recording.petName.toLowerCase().includes(searchLower) ||
      recording.ownerName.toLowerCase().includes(searchLower) ||
      (recording.transcription &&
        recording.transcription.toLowerCase().includes(searchLower)) ||
      (recording.summary &&
        recording.summary.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Call History</h1>
        <Dialog
          open={isNewCallDialogOpen}
          onOpenChange={setIsNewCallDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Call
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Select a Pet to Call</DialogTitle>
              <DialogDescription>
                Choose a pet to make a call to their owner.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPet?.id === pet.id ? "border-primary bg-primary/10" : "border-gray-200 hover:border-primary/50"}`}
                  onClick={() =>
                    setSelectedPet({
                      id: pet.id,
                      name: pet.name,
                      owner: pet.owner,
                    })
                  }
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={pet.imageUrl} />
                      <AvatarFallback>
                        {pet.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{pet.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed} • Owner: {pet.owner}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewCallDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsNewCallDialogOpen(false);
                  // Open the call interface with the selected pet
                  if (selectedPet) {
                    // This would typically navigate to a call interface or open another dialog
                    // For now, we'll just show an alert
                    alert(
                      `Starting call with ${selectedPet.owner} about ${selectedPet.name}`,
                    );
                  }
                }}
                disabled={!selectedPet}
              >
                Start Call
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder="Search calls by pet name, owner, or content..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredRecordings.length === 0 ? (
        <div className="text-center py-12">
          <Phone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No call recordings found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or make a new call
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecordings.map((recording) => (
            <Card
              key={recording.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {recording.petName} - Owner Call
                    </CardTitle>
                    <CardDescription>
                      {format(
                        new Date(recording.date),
                        "MMM d, yyyy 'at' h:mm a",
                      )}{" "}
                      • {formatDuration(recording.duration)}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRecording(recording);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <FileText className="mr-2" size={16} />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRecording(recording);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2" size={16} />
                        Delete Recording
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recording.petName}`}
                    />
                    <AvatarFallback>
                      {recording.petName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{recording.ownerName}</p>
                    <p className="text-xs text-muted-foreground">Pet Owner</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    {recording.audioUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAudio(recording.id, recording.audioUrl);
                        }}
                      >
                        {audioPlaying === recording.id ? (
                          <Pause size={16} className="mr-2" />
                        ) : (
                          <Play size={16} className="mr-2" />
                        )}
                        {audioPlaying === recording.id ? "Pause" : "Play"}
                      </Button>
                    )}
                    {recording.transcription && (
                      <Badge
                        variant={
                          recording.status === "approved"
                            ? "success"
                            : recording.status === "rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {recording.status === "approved"
                          ? "Approved"
                          : recording.status === "rejected"
                            ? "Rejected"
                            : "Pending"}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedRecording(recording);
                      setIsDetailsOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>

                {recording.transcription && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-xs font-medium mb-1">
                      Transcription Preview:
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {recording.transcription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recording Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedRecording && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{selectedRecording.petName} - Owner Call</span>
                </DialogTitle>
                <DialogDescription>
                  {format(
                    new Date(selectedRecording.date),
                    "MMMM d, yyyy 'at' h:mm a",
                  )}{" "}
                  • {formatDuration(selectedRecording.duration)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRecording.petName}`}
                    />
                    <AvatarFallback>
                      {selectedRecording.petName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {selectedRecording.ownerName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Owner of {selectedRecording.petName}
                    </p>
                  </div>
                </div>

                {selectedRecording.audioUrl && (
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="text-sm font-medium mb-2">
                      Audio Recording
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          toggleAudio(
                            selectedRecording.id,
                            selectedRecording.audioUrl,
                          )
                        }
                      >
                        {audioPlaying === selectedRecording.id ? (
                          <Pause size={16} className="mr-2" />
                        ) : (
                          <Play size={16} className="mr-2" />
                        )}
                        {audioPlaying === selectedRecording.id
                          ? "Pause"
                          : "Play"}
                      </Button>
                      <Button variant="outline">
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Transcription</h3>
                    {!selectedRecording.transcription ? (
                      <Button
                        onClick={() => handleTranscribe(selectedRecording.id)}
                        disabled={isTranscribing}
                      >
                        {isTranscribing ? "Transcribing..." : "Transcribe"}
                      </Button>
                    ) : null}
                  </div>

                  {selectedRecording.transcription ? (
                    <div className="p-4 bg-card border rounded-md whitespace-pre-line">
                      {selectedRecording.transcription}
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-md text-center">
                      <p className="text-muted-foreground">
                        {isTranscribing
                          ? "Transcribing audio..."
                          : "No transcription available. Click 'Transcribe' to generate one."}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Summary</h3>
                    {selectedRecording.transcription &&
                    !selectedRecording.summary ? (
                      <Button
                        onClick={() => handleSummarize(selectedRecording.id)}
                        disabled={isSummarizing}
                      >
                        {isSummarizing ? "Summarizing..." : "Summarize"}
                      </Button>
                    ) : null}
                  </div>

                  {selectedRecording.summary ? (
                    <div className="p-4 bg-card border rounded-md">
                      {selectedRecording.summary}
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-md text-center">
                      <p className="text-muted-foreground">
                        {isSummarizing
                          ? "Generating summary..."
                          : selectedRecording.transcription
                            ? "No summary available. Click 'Summarize' to generate one."
                            : "Transcribe the audio first to generate a summary."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Transcription Status and Approval Section */}
                {selectedRecording.transcription && (
                  <div className="space-y-4 mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">
                          Transcription Status
                        </h3>
                        <Badge
                          variant={
                            selectedRecording.status === "approved"
                              ? "success"
                              : selectedRecording.status === "rejected"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {selectedRecording.status === "approved"
                            ? "Approved"
                            : selectedRecording.status === "rejected"
                              ? "Rejected"
                              : "Pending"}
                        </Badge>
                      </div>

                      {selectedRecording.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="gap-2 border-green-500 text-green-500 hover:bg-green-50"
                            onClick={() => handleApprove(selectedRecording.id)}
                            disabled={isApproving}
                          >
                            {isApproving ? "Approving..." : "Approve"}
                          </Button>
                          <Button
                            variant="outline"
                            className="gap-2 border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleReject(selectedRecording.id)}
                            disabled={isRejecting}
                          >
                            {isRejecting ? "Rejecting..." : "Reject"}
                          </Button>
                        </div>
                      )}

                      {selectedRecording.status === "approved" &&
                        selectedRecording.approvedBy && (
                          <div className="text-sm text-muted-foreground">
                            Approved by {selectedRecording.approvedBy} on{" "}
                            {selectedRecording.approvedDate &&
                              format(
                                new Date(selectedRecording.approvedDate),
                                "MMM d, yyyy 'at' h:mm a",
                              )}
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button className="gap-2">
                    <Share size={16} />
                    Share
                  </Button>
                  <Button className="gap-2">
                    <Printer size={16} />
                    Print
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this recording?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              recording
              {selectedRecording?.transcription && " and its transcription"}
              {selectedRecording?.summary && " and summary"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CallHistory;
