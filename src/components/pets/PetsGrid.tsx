import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Edit, Trash2, Phone } from "lucide-react";
import { Pet } from "./types/petTypes";
import React from "react";

interface PetsGridProps {
  pets: Pet[];
  onViewPet: (pet: Pet) => void;
  onEditPet: (pet: Pet) => void;
  onDeletePet: (id: string) => void;
}

const PetsGrid = ({ pets, onViewPet, onEditPet, onDeletePet }: PetsGridProps) => {
  if (pets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No pets found. Try adjusting your search or add a new pet.
        </p>
      </div>
    );
  }

    const [isViewPetDialogOpen, setIsViewPetDialogOpen] = React.useState(false);

    const [selectedPet, setSelectedPet] = React.useState<Pet | null>(null);

    function handleEditPet() {
        if (selectedPet) {
            onEditPet(selectedPet);
        }
    }

    function handleViewPet(pet: Pet): void {
        setSelectedPet(pet);
        setIsViewPetDialogOpen(true);
        onViewPet(pet);
    }

    function openDeleteConfirmation(id: string): void {
        if (window.confirm("Are you sure you want to delete this pet?")) {
            onDeletePet(id);
        }
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pets.map((pet) => (
        <Card
          key={pet.id}
          className="overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-transform transform hover:scale-105 group"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-x-[-1]"
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
                  <DropdownMenuItem onClick={() => onEditPet(pet)}>
                    <Edit className="mr-2" size={16} />
                    Edit Pet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeletePet(pet.id)}>
                    <Trash2 className="mr-2" size={16} />
                    Delete Pet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onViewPet(pet)}>
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
  );
};

export default PetsGrid;