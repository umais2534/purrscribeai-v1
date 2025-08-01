import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import { PetFormData } from "./types/petTypes";

interface AddPetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pet: PetFormData;
  onPetChange: (pet: PetFormData) => void;
  onAddPet: () => void;
}

const AddPetDialog = ({ isOpen, onOpenChange, pet, onPetChange, onAddPet }: AddPetDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="relative -mt-6 bg-[#272E3F] text-white text-center pt-0 pb-0 rounded-b-[110px] overflow-hidden w-[40%] mx-auto">
            <h2 className="text-lg font-semibold z-10 relative">Add New Pet</h2>
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 500 50"
              preserveAspectRatio="none"
            >
              <path d="M0,0 C125,50 375,50 500,0 L500,50 L0,50 Z" fill="#272E3F" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the details of the new pet to add to your records.
          </p>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Form fields... */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddPet}>Add Pet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetDialog;