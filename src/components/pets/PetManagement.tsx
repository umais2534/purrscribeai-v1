import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import PetManagementHeader from "./PetManagementHeader";
import PetSearchFilter from "./PetSearchFilter";
import PetsGrid from "./PetsGrid";
import AddPetDialog from "./AddPetDialog";
import ViewPetDialog from "./ViewPetDialog";
import EditPetDialog from "./EditPetDialog";
import DeletePetDialog from "./DeletePetDialog";
import { Pet, PetFormData } from "./types/petTypes";

const PetManagement = () => {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "1",
      name: "Max",
      species: "Dog",
      breed: "Golden Retriever",
      age: "5 years",
      owner: "John Smith",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=80",
      notes: "Friendly and energetic. Regular checkups for hip dysplasia.",
    },
    {
      id: "2",
      name: "Luna",
      species: "Cat",
      breed: "Siamese",
      age: "3 years",
      owner: "Sarah Johnson",
      imageUrl: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80",
      notes: "Indoor cat. Dental cleaning scheduled for next month.",
    },
    {
      id: "3",
      name: "Buddy",
      species: "Dog",
      breed: "Labrador",
      age: "2 years",
      owner: "Michael Brown",
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80",
      notes: "Very active. Recent vaccination completed.",
    },
    {
      id: "4",
      name: "Bella",
      species: "Cat",
      breed: "Maine Coon",
      age: "4 years",
      owner: "Emily Davis",
      imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&q=80",
      notes: "Long-haired cat. Regular grooming required.",
    },
    {
      id: "5",
      name: "Charlie",
      species: "Dog",
      breed: "Beagle",
      age: "6 years",
      owner: "David Wilson",
      imageUrl: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&q=80",
      notes: "Ear infection history. On special diet.",
    },
    {
      id: "6",
      name: "Oliver",
      species: "Cat",
      breed: "Tabby",
      age: "2 years",
      owner: "Jessica Taylor",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
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

  const [newPet, setNewPet] = useState<PetFormData>({
    name: "",
    species: "",
    breed: "",
    age: "",
    owner: "",
    imageUrl: "",
    notes: "",
  });

  const [editFormData, setEditFormData] = useState<PetFormData>({
    name: "",
    species: "",
    breed: "",
    age: "",
    owner: "",
    imageUrl: "",
    notes: "",
  });

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
        imageUrl: newPet.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newPet.name}`,
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

  const handleDeletePet = () => {
    if (selectedPet) {
      setPets(pets.filter((pet) => pet.id !== selectedPet.id));
      setIsViewPetDialogOpen(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditPet = () => {
    if (selectedPet) {
      setEditFormData({
        name: selectedPet.name,
        species: selectedPet.species,
        breed: selectedPet.breed,
        age: selectedPet.age,
        owner: selectedPet.owner,
        imageUrl: selectedPet.imageUrl,
        notes: selectedPet.notes || "",
      });
      setIsEditPetDialogOpen(true);
    }
  };

  const saveEditedPet = () => {
    if (
      selectedPet &&
      editFormData.name &&
      editFormData.species &&
      editFormData.breed &&
      editFormData.owner
    ) {
      const updatedPets = pets.map((pet) => {
        if (pet.id === selectedPet.id) {
          return {
            ...pet,
            name: editFormData.name,
            species: editFormData.species,
            breed: editFormData.breed,
            age: editFormData.age,
            owner: editFormData.owner,
            imageUrl: editFormData.imageUrl || pet.imageUrl,
            notes: editFormData.notes,
          };
        }
        return pet;
      });

      setPets(updatedPets);
      setIsEditPetDialogOpen(false);
      setEditFormData({
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

  const handleNewPetChange = (updatedFields: Partial<PetFormData>) => {
    setNewPet((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleEditFormChange = (updatedFields: Partial<PetFormData>) => {
    setEditFormData((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <div className="bg-background p-6 rounded-lg w-full">
      <PetManagementHeader onAddPet={() => setIsAddPetDialogOpen(true)} />

      <PetSearchFilter
        searchTerm={searchTerm}
        selectedSpecies={selectedSpecies}
        onSearchChange={setSearchTerm}
        onSpeciesChange={setSelectedSpecies}
      />

      <PetsGrid
        pets={filteredPets}
        onViewPet={handleViewPet}
        onEditPet={(pet) => {
          setSelectedPet(pet);
          handleEditPet();
        }}
        onDeletePet={(id) => {
          setSelectedPet(pets.find((p) => p.id === id) || null);
          setIsDeleteDialogOpen(true);
        }}
        onCallOwner={handleViewPet} // ✅ Shows ViewPetDialog when "Call Owner" is clicked
      />

      <AddPetDialog
        isOpen={isAddPetDialogOpen}
        onOpenChange={setIsAddPetDialogOpen}
        pet={newPet}
        onPetChange={handleNewPetChange}
        onAddPet={handleAddPet}
      />

      <ViewPetDialog
        isOpen={isViewPetDialogOpen}
        onOpenChange={setIsViewPetDialogOpen}
        pet={selectedPet}
        onEdit={handleEditPet}
        onDelete={(id) => {
          setSelectedPet(pets.find((p) => p.id === id) || null);
          setIsDeleteDialogOpen(true);
        }}
      />

      <EditPetDialog
        isOpen={isEditPetDialogOpen}
        onOpenChange={setIsEditPetDialogOpen}
        pet={editFormData}
        onPetChange={handleEditFormChange}
        onSave={saveEditedPet}
      />

      <DeletePetDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        pet={selectedPet}
        onDelete={handleDeletePet}
      />
    </div>
  );
};

export default PetManagement;
