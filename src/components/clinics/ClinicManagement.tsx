import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  Users,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "@/components/ui/image-uploader";
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

interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  manager: string;
  logoUrl: string;
  petCount: number;
  type: string;
  notes?: string;
}

const ClinicManagement = () => {
  const [clinics, setClinics] = useState<Clinic[]>([
    {
      id: "1",
      name: "Main Street Veterinary Clinic",
      address: "123 Main Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      phone: "(555) 123-4567",
      email: "info@mainstreetvet.com",
      manager: "Dr. Sarah Johnson",
      logoUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=MSV&backgroundColor=4f46e5",
      petCount: 145,
      type: "Small Animal",
      notes:
        "Full-service veterinary clinic specializing in dogs, cats, and small mammals.",
    },
    {
      id: "2",
      name: "Downtown Animal Hospital",
      address: "456 Oak Avenue",
      city: "Springfield",
      state: "IL",
      zipCode: "62704",
      phone: "(555) 987-6543",
      email: "contact@downtownanimalhospital.com",
      manager: "Dr. Michael Brown",
      logoUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=DAH&backgroundColor=059669",
      petCount: 98,
      type: "Full Service",
      notes:
        "24-hour emergency services available. Specializing in surgery and critical care.",
    },
    {
      id: "3",
      name: "Countryside Veterinary Practice",
      address: "789 Rural Route",
      city: "Greenfield",
      state: "IL",
      zipCode: "62044",
      phone: "(555) 456-7890",
      email: "info@countrysidevet.com",
      manager: "Dr. Emily Davis",
      logoUrl:
        "https://api.dicebear.com/7.x/initials/svg?seed=CVP&backgroundColor=d97706",
      petCount: 210,
      type: "Mixed Practice",
      notes:
        "Serving both small and large animals. Mobile services available for farm visits.",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddClinicDialogOpen, setIsAddClinicDialogOpen] = useState(false);
  const [isViewClinicDialogOpen, setIsViewClinicDialogOpen] = useState(false);
  const [isEditClinicDialogOpen, setIsEditClinicDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [newClinic, setNewClinic] = useState<Partial<Clinic>>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    manager: "",
    logoUrl: "",
    type: "",
    notes: "",
  });

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinic.manager.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || clinic.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleAddClinic = () => {
    if (
      newClinic.name &&
      newClinic.address &&
      newClinic.city &&
      newClinic.manager
    ) {
      const clinicToAdd = {
        ...newClinic,
        id: Date.now().toString(),
        logoUrl:
          newClinic.logoUrl ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${newClinic.name?.substring(0, 3)}&backgroundColor=4f46e5`,
        petCount: 0,
      } as Clinic;

      setClinics([...clinics, clinicToAdd]);
      setNewClinic({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        manager: "",
        logoUrl: "",
        type: "",
        notes: "",
      });
      setIsAddClinicDialogOpen(false);
    }
  };

  const handleViewClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setIsViewClinicDialogOpen(true);
  };

  const openDeleteConfirmation = (id: string) => {
    setSelectedClinic(clinics.find((clinic) => clinic.id === id) || null);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClinic = () => {
    if (selectedClinic) {
      setClinics(clinics.filter((clinic) => clinic.id !== selectedClinic.id));
      setIsViewClinicDialogOpen(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditClinic = () => {
    if (selectedClinic) {
      setNewClinic({
        name: selectedClinic.name,
        address: selectedClinic.address,
        city: selectedClinic.city,
        state: selectedClinic.state,
        zipCode: selectedClinic.zipCode,
        phone: selectedClinic.phone,
        email: selectedClinic.email,
        manager: selectedClinic.manager,
        logoUrl: selectedClinic.logoUrl,
        type: selectedClinic.type,
        notes: selectedClinic.notes || "",
      });
      setIsEditClinicDialogOpen(true);
      setIsViewClinicDialogOpen(false);
    }
  };

  const saveEditedClinic = () => {
    if (
      selectedClinic &&
      newClinic.name &&
      newClinic.address &&
      newClinic.city &&
      newClinic.manager
    ) {
      const updatedClinics = clinics.map((clinic) => {
        if (clinic.id === selectedClinic.id) {
          return {
            ...clinic,
            name: newClinic.name!,
            address: newClinic.address!,
            city: newClinic.city!,
            state: newClinic.state!,
            zipCode: newClinic.zipCode!,
            phone: newClinic.phone!,
            email: newClinic.email!,
            manager: newClinic.manager!,
            logoUrl: newClinic.logoUrl || clinic.logoUrl,
            type: newClinic.type!,
            notes: newClinic.notes,
          };
        }
        return clinic;
      });

      setClinics(updatedClinics);
      setIsEditClinicDialogOpen(false);

      // Reset form
      setNewClinic({
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
        manager: "",
        logoUrl: "",
        type: "",
        notes: "",
      });
    }
  };

  return (
    <div className="bg-background p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clinic Management</h1>
        <Dialog
          open={isAddClinicDialogOpen}
          onOpenChange={setIsAddClinicDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Clinic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Clinic</DialogTitle>
              <DialogDescription>
                Enter the details of the new clinic to add to your records.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Clinic Name</Label>
                <Input
                  id="name"
                  value={newClinic.name}
                  onChange={(e) =>
                    setNewClinic({ ...newClinic, name: e.target.value })
                  }
                  placeholder="Main Street Veterinary Clinic"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={newClinic.address}
                    onChange={(e) =>
                      setNewClinic({ ...newClinic, address: e.target.value })
                    }
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newClinic.city}
                    onChange={(e) =>
                      setNewClinic({ ...newClinic, city: e.target.value })
                    }
                    placeholder="Springfield"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newClinic.state}
                    onChange={(e) =>
                      setNewClinic({ ...newClinic, state: e.target.value })
                    }
                    placeholder="IL"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={newClinic.zipCode}
                    onChange={(e) =>
                      setNewClinic({ ...newClinic, zipCode: e.target.value })
                    }
                    placeholder="62701"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="type">Clinic Type</Label>
                  <Select
                    value={newClinic.type}
                    onValueChange={(value) =>
                      setNewClinic({ ...newClinic, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small Animal">Small Animal</SelectItem>
                      <SelectItem value="Large Animal">Large Animal</SelectItem>
                      <SelectItem value="Mixed Practice">
                        Mixed Practice
                      </SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Specialty">Specialty</SelectItem>
                      <SelectItem value="Full Service">Full Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newClinic.phone}
                    onChange={(e) =>
                      setNewClinic({ ...newClinic, phone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={newClinic.email}
                    onChange={(e) =>
                      setNewClinic({ ...newClinic, email: e.target.value })
                    }
                    placeholder="info@clinic.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="manager">Clinic Manager</Label>
                <Input
                  id="manager"
                  value={newClinic.manager}
                  onChange={(e) =>
                    setNewClinic({ ...newClinic, manager: e.target.value })
                  }
                  placeholder="Dr. Sarah Johnson"
                />
              </div>

              <div className="flex flex-col gap-2">
                <ImageUploader
                  imageUrl={newClinic.logoUrl}
                  onImageChange={(url) =>
                    setNewClinic({ ...newClinic, logoUrl: url })
                  }
                  label="Clinic Logo"
                  placeholder="Upload a logo image or enter URL"
                  disabled={isUploading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={newClinic.notes}
                  onChange={(e) =>
                    setNewClinic({ ...newClinic, notes: e.target.value })
                  }
                  placeholder="Additional information about the clinic"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddClinicDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddClinic}>Add Clinic</Button>
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
            placeholder="Search clinics by name, city, or manager"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <SelectValue placeholder="All Types" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Small Animal">Small Animal</SelectItem>
            <SelectItem value="Large Animal">Large Animal</SelectItem>
            <SelectItem value="Mixed Practice">Mixed Practice</SelectItem>
            <SelectItem value="Emergency">Emergency</SelectItem>
            <SelectItem value="Specialty">Specialty</SelectItem>
            <SelectItem value="Full Service">Full Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredClinics.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No clinics found. Try adjusting your search or add a new clinic.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClinics.map((clinic) => (
            <Card key={clinic.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={clinic.logoUrl} alt={clinic.name} />
                    <AvatarFallback>
                      {clinic.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewClinic(clinic)}
                      >
                        <Eye className="mr-2" size={16} />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedClinic(clinic);
                          handleEditClinic();
                        }}
                      >
                        <Edit className="mr-2" size={16} />
                        Edit Clinic
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteConfirmation(clinic.id)}
                      >
                        <Trash2 className="mr-2" size={16} />
                        Delete Clinic
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-1">{clinic.name}</h3>
                  <Badge className="mb-2">{clinic.type}</Badge>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start">
                      <MapPin size={14} className="mr-2 mt-0.5" />
                      <span>
                        {clinic.address}, {clinic.city}, {clinic.state}{" "}
                        {clinic.zipCode}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={14} className="mr-2" />
                      <span>{clinic.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={14} className="mr-2" />
                      <span>{clinic.petCount} pets</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleViewClinic(clinic)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Clinic Dialog */}
      <Dialog
        open={isViewClinicDialogOpen}
        onOpenChange={setIsViewClinicDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedClinic && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedClinic.logoUrl}
                      alt={selectedClinic.name}
                    />
                    <AvatarFallback>
                      {selectedClinic.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedClinic.name}
                    </DialogTitle>
                    <Badge className="mt-1">{selectedClinic.type}</Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin
                          size={14}
                          className="mr-2 mt-0.5 text-muted-foreground"
                        />
                        <span>
                          {selectedClinic.address}, {selectedClinic.city},{" "}
                          {selectedClinic.state} {selectedClinic.zipCode}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone
                          size={14}
                          className="mr-2 text-muted-foreground"
                        />
                        <span>{selectedClinic.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail
                          size={14}
                          className="mr-2 text-muted-foreground"
                        />
                        <span>{selectedClinic.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Users
                          size={14}
                          className="mr-2 text-muted-foreground"
                        />
                        <span>Manager: {selectedClinic.manager}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Clinic Details</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedClinic.notes ||
                      "No additional details available for this clinic."}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Registered Pets
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedClinic.petCount}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Transcriptions
                        </p>
                        <p className="text-2xl font-bold">24</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Last Visit
                        </p>
                        <p className="text-lg font-medium">2 days ago</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => openDeleteConfirmation(selectedClinic.id)}
                  className="gap-2"
                >
                  <Trash2 size={16} />
                  Delete Clinic
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewClinicDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button className="gap-2" onClick={handleEditClinic}>
                    <Edit size={16} />
                    Edit Clinic
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Clinic Dialog */}
      <Dialog
        open={isEditClinicDialogOpen}
        onOpenChange={setIsEditClinicDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Clinic</DialogTitle>
            <DialogDescription>
              Update the details of {selectedClinic?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name">Clinic Name</Label>
              <Input
                id="edit-name"
                value={newClinic.name}
                onChange={(e) =>
                  setNewClinic({ ...newClinic, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-address">Street Address</Label>
                <Input
                  id="edit-address"
                  value={newClinic.address}
                  onChange={(e) =>
                    setNewClinic({ ...newClinic, address: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={newClinic.city}
                  onChange={(e) =>
                    setNewClinic({ ...newClinic, city: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={newClinic.state}
                  onChange={(e) =>
                    setNewClinic({ ...newClinic, state: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-zipCode">Zip Code</Label>
                <Input
                  id="edit-zipCode"
                  value={newClinic.zipCode}
                  onChange={(e) =>
                    setNewClinic({ ...newClinic, zipCode: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-type">Clinic Type</Label>
                <Select
                  value={newClinic.type}
                  onValueChange={(value) =>
                    setNewClinic({ ...newClinic, type: value })
                  }
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small Animal">Small Animal</SelectItem>
                    <SelectItem value="Large Animal">Large Animal</SelectItem>
                    <SelectItem value="Mixed Practice">
                      Mixed Practice
                    </SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Specialty">Specialty</SelectItem>
                    <SelectItem value="Full Service">Full Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={newClinic.phone}
                  onChange={(e) =>
                    setNewClinic({ ...newClinic, phone: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={newClinic.email}
                  onChange={(e) =>
                    setNewClinic({ ...newClinic, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-manager">Clinic Manager</Label>
              <Input
                id="edit-manager"
                value={newClinic.manager}
                onChange={(e) =>
                  setNewClinic({ ...newClinic, manager: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <ImageUploader
                imageUrl={newClinic.logoUrl}
                onImageChange={(url) =>
                  setNewClinic({ ...newClinic, logoUrl: url })
                }
                label="Clinic Logo"
                placeholder="Upload a logo image or enter URL"
                disabled={isUploading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={newClinic.notes}
                onChange={(e) =>
                  setNewClinic({ ...newClinic, notes: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditClinicDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveEditedClinic}>Save Changes</Button>
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
              This will permanently delete {selectedClinic?.name} from your
              records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClinic}
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

export default ClinicManagement;
