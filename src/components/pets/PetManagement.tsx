import React, { useState } from "react";
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
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CallOwner from "@/components/CallOwner";
import { saveCallRecording } from "@/services/callService";
import { ImageUploader } from "@/components/ui/image-uploader";
import { useState as useReactState } from "react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  owner: string;
  imageUrl: string;
  notes?: string;
}

const PetManagement = () => {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "1",
      name: "Max",
      species: "Dog",
      breed: "Golden Retriever",
      age: "5 years",
      owner: "John Smith",
      imageUrl:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=80",
      notes: "Friendly and energetic. Regular checkups for hip dysplasia.",
    },
    {
      id: "2",
      name: "Luna",
      species: "Cat",
      breed: "Siamese",
      age: "3 years",
      owner: "Sarah Johnson",
      imageUrl:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80",
      notes: "Indoor cat. Dental cleaning scheduled for next month.",
    },
    {
      id: "3",
      name: "Buddy",
      species: "Dog",
      breed: "Labrador",
      age: "2 years",
      owner: "Michael Brown",
      imageUrl:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80",
      notes: "Very active. Recent vaccination completed.",
    },
    {
      id: "4",
      name: "Bella",
      species: "Cat",
      breed: "Maine Coon",
      age: "4 years",
      owner: "Emily Davis",
      imageUrl:
        "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&q=80",
      notes: "Long-haired cat. Regular grooming required.",
    },
    {
      id: "5",
      name: "Charlie",
      species: "Dog",
      breed: "Beagle",
      age: "6 years",
      owner: "David Wilson",
      imageUrl:
        "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&q=80",
      notes: "Ear infection history. On special diet.",
    },
    {
      id: "6",
      name: "Oliver",
      species: "Cat",
      breed: "Tabby",
      age: "2 years",
      owner: "Jessica Taylor",
      imageUrl:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
      notes: "Rescue cat. Fully vaccinated.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [isAddPetDialogOpen, setIsAddPetDialogOpen] = useState(false);
  const [isViewPetDialogOpen, setIsViewPetDialogOpen] = useState(false);
  const [isEditPetDialogOpen, setIsEditPetDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [newPet, setNewPet] = useState<Partial<Pet>>({
    name: "",
    species: "",
    breed: "",
    age: "",
    owner: "",
    imageUrl: "",
    notes: "",
  });

  const [isUploading, setIsUploading] = useReactState<boolean>(false);

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecies =
      selectedSpecies === "all" || pet.species === selectedSpecies;

    return matchesSearch && matchesSpecies;
  });

  const handleAddPet = () => {
    if (newPet.name && newPet.species && newPet.breed && newPet.owner) {
      const petToAdd = {
        ...newPet,
        id: Date.now().toString(),
        imageUrl:
          newPet.imageUrl ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${newPet.name}`,
      } as Pet;

      setPets([...pets, petToAdd]);
      setNewPet({
        name: "",
        species: "",
        breed: "",
        age: "",
        owner: "",
        imageUrl: "",
        notes: "",
      });
      setIsAddPetDialogOpen(false);
    }
  };

  const handleViewPet = (pet: Pet) => {
    setSelectedPet(pet);
    setIsViewPetDialogOpen(true);
  };

  const openDeleteConfirmation = (id: string) => {
    setSelectedPet(pets.find((pet) => pet.id === id) || null);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePet = () => {
    if (selectedPet) {
      setPets(pets.filter((pet) => pet.id !== selectedPet.id));
      setIsViewPetDialogOpen(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditPet = () => {
    if (selectedPet) {
      setNewPet({
        name: selectedPet.name,
        species: selectedPet.species,
        breed: selectedPet.breed,
        age: selectedPet.age,
        owner: selectedPet.owner,
        imageUrl: selectedPet.imageUrl,
        notes: selectedPet.notes || "",
      });
      setIsEditPetDialogOpen(true);
      setIsViewPetDialogOpen(false);
    }
  };

  const saveEditedPet = () => {
    if (
      selectedPet &&
      newPet.name &&
      newPet.species &&
      newPet.breed &&
      newPet.owner
    ) {
      const updatedPets = pets.map((pet) => {
        if (pet.id === selectedPet.id) {
          return {
            ...pet,
            name: newPet.name!,
            species: newPet.species!,
            breed: newPet.breed!,
            age: newPet.age!,
            owner: newPet.owner!,
            imageUrl: newPet.imageUrl || pet.imageUrl,
            notes: newPet.notes,
          };
        }
        return pet;
      });

      setPets(updatedPets);
      setIsEditPetDialogOpen(false);

      // Reset form
      setNewPet({
        name: "",
        species: "",
        breed: "",
        age: "",
        owner: "",
        imageUrl: "",
        notes: "",
      });
    }
  };

  return (
    <div className="bg-background p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pet Management</h1>
        <Dialog open={isAddPetDialogOpen} onOpenChange={setIsAddPetDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Pet</DialogTitle>
              <DialogDescription>
                Enter the details of the new pet to add to your records.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Pet Name</Label>
                  <Input
                    id="name"
                    value={newPet.name}
                    onChange={(e) =>
                      setNewPet({ ...newPet, name: e.target.value })
                    }
                    placeholder="Max"
                  />
                </div>
                <div className="flex flex-col gap-2">
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
                      <SelectItem value="Rabbit">Rabbit</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={newPet.age}
                    onChange={(e) =>
                      setNewPet({ ...newPet, age: e.target.value })
                    }
                    placeholder="5 years"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2">
                <ImageUploader
                  imageUrl={newPet.imageUrl}
                  onImageChange={(url) =>
                    setNewPet({ ...newPet, imageUrl: url })
                  }
                  label="Pet Image"
                  placeholder="Upload a pet image or enter URL"
                  disabled={isUploading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={newPet.notes}
                  onChange={(e) =>
                    setNewPet({ ...newPet, notes: e.target.value })
                  }
                  placeholder="Any additional information about the pet"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddPetDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddPet}>Add Pet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Search pets by name, breed, or owner"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <SelectValue placeholder="All Species" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Species</SelectItem>
            <SelectItem value="Dog">Dogs</SelectItem>
            <SelectItem value="Cat">Cats</SelectItem>
            <SelectItem value="Bird">Birds</SelectItem>
            <SelectItem value="Rabbit">Rabbits</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPets.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No pets found. Try adjusting your search or add a new pet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${pet.name}`;
                  }}
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-background/80 backdrop-blur-sm rounded-full"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewPet(pet)}>
                        <Eye className="mr-2" size={16} />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPet(pet);
                          handleEditPet();
                        }}
                      >
                        <Edit className="mr-2" size={16} />
                        Edit Pet
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteConfirmation(pet.id)}
                      >
                        <Trash2 className="mr-2" size={16} />
                        Delete Pet
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPet(pet);
                          setIsViewPetDialogOpen(true);
                        }}
                      >
                        <Phone className="mr-2" size={16} />
                        Call Owner
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{pet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pet.breed} • {pet.age}
                    </p>
                    <p className="text-sm mt-1">Owner: {pet.owner}</p>
                  </div>
                  <div className="bg-primary/10 px-2 py-1 rounded text-xs font-medium">
                    {pet.species}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Pet Dialog */}
      <Dialog open={isViewPetDialogOpen} onOpenChange={setIsViewPetDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedPet && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{selectedPet.name}</span>
                  <span className="bg-primary/10 px-2 py-1 rounded text-xs font-medium">
                    {selectedPet.species}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  {selectedPet.breed} • {selectedPet.age}
                </DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-[1fr_2fr] gap-6 py-4">
                <div>
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img
                      src={selectedPet.imageUrl}
                      alt={selectedPet.name}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPet.name}`;
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        Owner Information
                      </h4>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPet.owner}`}
                          />
                          <AvatarFallback>
                            {selectedPet.owner.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedPet.owner}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Notes</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedPet.notes ||
                          "No notes available for this pet."}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        Recent Transcriptions
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        No recent transcriptions found for this pet.
                      </p>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Call Owner</h4>
                      <CallOwner
                        ownerName={selectedPet.owner}
                        petName={selectedPet.name}
                        onCallRecorded={(audioBlob, duration) => {
                          // Save the call recording
                          saveCallRecording(audioBlob, {
                            petId: selectedPet.id,
                            petName: selectedPet.name,
                            ownerName: selectedPet.owner,
                            duration: duration,
                          })
                            .then((recording) => {
                              console.log("Call recording saved:", recording);
                              // You could show a success toast here
                            })
                            .catch((error) => {
                              console.error(
                                "Failed to save call recording:",
                                error,
                              );
                              // You could show an error toast here
                            });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => openDeleteConfirmation(selectedPet.id)}
                  className="gap-2"
                >
                  <Trash2 size={16} />
                  Delete Pet
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewPetDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button className="gap-2" onClick={handleEditPet}>
                    <Edit size={16} />
                    Edit Pet
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Pet Dialog */}
      <Dialog open={isEditPetDialogOpen} onOpenChange={setIsEditPetDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Pet</DialogTitle>
            <DialogDescription>
              Update the details of {selectedPet?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-name">Pet Name</Label>
                <Input
                  id="edit-name"
                  value={newPet.name}
                  onChange={(e) =>
                    setNewPet({ ...newPet, name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-species">Species</Label>
                <Select
                  value={newPet.species}
                  onValueChange={(value) =>
                    setNewPet({ ...newPet, species: value })
                  }
                >
                  <SelectTrigger id="edit-species">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dog">Dog</SelectItem>
                    <SelectItem value="Cat">Cat</SelectItem>
                    <SelectItem value="Bird">Bird</SelectItem>
                    <SelectItem value="Rabbit">Rabbit</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-breed">Breed</Label>
                <Input
                  id="edit-breed"
                  value={newPet.breed}
                  onChange={(e) =>
                    setNewPet({ ...newPet, breed: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-age">Age</Label>
                <Input
                  id="edit-age"
                  value={newPet.age}
                  onChange={(e) =>
                    setNewPet({ ...newPet, age: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-owner">Owner</Label>
              <Input
                id="edit-owner"
                value={newPet.owner}
                onChange={(e) =>
                  setNewPet({ ...newPet, owner: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <ImageUploader
                imageUrl={newPet.imageUrl}
                onImageChange={(url) => setNewPet({ ...newPet, imageUrl: url })}
                label="Pet Image"
                placeholder="Upload a pet image or enter URL"
                disabled={isUploading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={newPet.notes}
                onChange={(e) =>
                  setNewPet({ ...newPet, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditPetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveEditedPet}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedPet?.name} from your
              records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePet}
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

export default PetManagement;
