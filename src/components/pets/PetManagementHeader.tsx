import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PetManagementHeaderProps {
  onAddPet: () => void;
}

const PetManagementHeader = ({ onAddPet }: PetManagementHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#F0F4FF] to-[#E0ECFF] rounded-xl w-[100%] p-6 shadow-sm mb-8">
      <h1 className="text-2xl font-bold">Pet Management</h1>
      <Button className="flex items-center gap-2" onClick={onAddPet}>
        <Plus size={16} />
        Add Pet
      </Button>
    </div>
  );
};

export default PetManagementHeader;