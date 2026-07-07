import { useEffect, useMemo, useState } from "react";
import { Check, PenLine, Plus, RotateCcwKey, Trash2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import type { AccountLayoutContext } from "../layouts/AccountLayout";
import { useAuthStore } from "../store/useAuthStore";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
};

type AddressItem = {
  id: string;
  label: string;
  value: string;
};

const ADDRESS_STORAGE_KEY = "contact-details-addresses";
const defaultAddresses: AddressItem[] = [
  { id: "home", label: "Home", value: "21 Example St, Cairo" },
  { id: "work", label: "Work", value: "15 Business Rd, Giza" },
];

function loadStoredAddresses(): AddressItem[] {
  if (typeof window === "undefined") {
    return defaultAddresses;
  }

  const stored = window.localStorage.getItem(ADDRESS_STORAGE_KEY);

  if (!stored) {
    return defaultAddresses;
  }

  try {
    const parsed = JSON.parse(stored) as AddressItem[];

    return Array.isArray(parsed) && parsed.length ? parsed : defaultAddresses;
  } catch {
    return defaultAddresses;
  }
}

function FieldLabel({ children }: { children: string }) {
  return (
    <div className="self-stretch font-['Montserrat'] text-xl font-medium text-gray-text">
      {children}
    </div>
  );
}

function DetailField({
  label,
  value,
  isEditing = false,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  isEditing?: boolean;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "tel";
}) {
  return (
    <div className="flex self-stretch flex-col items-start justify-start gap-4">
      <FieldLabel>{label}</FieldLabel>
      <div className="inline-flex items-center justify-start gap-2.5 self-stretch overflow-hidden border-b border-stroke pb-4">
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            className="w-full border-none bg-transparent font-['Montserrat'] text-xl font-medium text-foreground outline-none placeholder:text-gray-text"
          />
        ) : (
          <div className="font-['Montserrat'] text-xl font-medium text-foreground">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

function IconButton({
  icon: Icon,
  label,
  tone = "neutral",
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  tone?: "neutral" | "danger" | "success";
  onClick: () => void;
}) {
  const toneClassName =
    tone === "danger"
      ? "text-[#DC2626] hover:bg-[#FEE2E2]"
      : tone === "success"
        ? "text-[#15803D] hover:bg-[#DCFCE7]"
        : "text-foreground hover:bg-gray-light";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl p-2 transition-colors ${toneClassName}`}
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5" strokeWidth={1.8} />
    </button>
  );
}

function SectionHeader({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center justify-between self-stretch">
      <div className="inline-flex items-center justify-start gap-3">
        <div className="font-['Montserrat'] text-3xl font-bold text-foreground">
          {title}
        </div>
        <div className="relative h-8 w-8 overflow-hidden">
          <Icon className="absolute left-[4px] top-[4px] h-6 w-6 text-foreground" />
        </div>
      </div>
      {children}
    </div>
  );
}

function AddressCard({
  address,
  isEditing,
  draft,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDraftChange,
}: {
  address: AddressItem;
  isEditing: boolean;
  draft: AddressItem;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onDraftChange: (value: AddressItem) => void;
}) {
  return (
    <div className="flex w-full max-w-xl flex-col items-start justify-start gap-4 rounded-2xl bg-white p-5 shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)]">
      <div className="inline-flex w-full items-center justify-between">
        <div className="font-['Montserrat'] text-lg font-semibold text-foreground">
          {isEditing ? "Editing Address" : address.label}
        </div>
        <div className="inline-flex items-center justify-start gap-1">
          {isEditing ? (
            <>
              <IconButton icon={Check} label="Save address" tone="success" onClick={onSave} />
              <IconButton icon={X} label="Cancel address" onClick={onCancel} />
            </>
          ) : (
            <IconButton icon={PenLine} label="Edit address" onClick={onEdit} />
          )}
          <IconButton icon={Trash2} label="Delete address" tone="danger" onClick={onDelete} />
        </div>
      </div>
      <DetailField
        label="Label"
        value={isEditing ? draft.label : address.label}
        isEditing={isEditing}
        onChange={(value) => onDraftChange({ ...draft, label: value })}
      />
      <DetailField
        label="Address"
        value={isEditing ? draft.value : address.value}
        isEditing={isEditing}
        onChange={(value) => onDraftChange({ ...draft, value })}
      />
    </div>
  );
}

export default function ContactDetailsPage() {
  const { setFooterConfig } = useOutletContext<AccountLayoutContext>();
  const { user, updateUser } = useAuthStore();
  const [contactDetails, setContactDetails] = useState<ContactForm>({
    name: String(user?.name ?? "Maan Galal"),
    email: String(user?.email ?? "maan@example.com"),
    phone: String(user?.phone ?? "+201024941663"),
  });
  const [contactDraft, setContactDraft] = useState<ContactForm>(contactDetails);
  const [addresses, setAddresses] = useState<AddressItem[]>(loadStoredAddresses);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressDraft, setAddressDraft] = useState<AddressItem>({
    id: "",
    label: "",
    value: "",
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    const nextDetails = {
      name: String(user.name ?? "Maan Galal"),
      email: String(user.email ?? "maan@example.com"),
      phone: String(user.phone ?? "+201024941663"),
    };

    setContactDetails(nextDetails);
    setContactDraft(nextDetails);
  }, [user]);

  useEffect(() => {
    window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const footerTop = useMemo(() => 970 + Math.max(addresses.length - 2, 0) * 210, [addresses.length]);

  useEffect(() => {
    setFooterConfig({
      top: "top-0",
      style: { top: footerTop },
    });
  }, [footerTop, setFooterConfig]);

  const hasUnsavedContactChanges =
    contactDraft.name !== contactDetails.name ||
    contactDraft.email !== contactDetails.email ||
    contactDraft.phone !== contactDetails.phone;

  const handleResetContact = () => {
    setContactDraft(contactDetails);
  };

  const handleSaveContact = () => {
    const trimmedName = contactDraft.name.trim();
    const trimmedEmail = contactDraft.email.trim();
    const trimmedPhone = contactDraft.phone.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      toast.error("Please complete all contact details");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    const nextDetails = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
    };

    setContactDetails(nextDetails);
    setContactDraft(nextDetails);

    if (user) {
      updateUser({
        ...user,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
      });
    }

    toast.success("Contact details updated");
  };

  const handleStartEditingAddress = (address: AddressItem) => {
    setEditingAddressId(address.id);
    setAddressDraft(address);
  };

  const handleCancelEditingAddress = () => {
    setEditingAddressId(null);
    setAddressDraft({ id: "", label: "", value: "" });
  };

  const handleSaveAddress = (addressId: string) => {
    const trimmedLabel = addressDraft.label.trim();
    const trimmedValue = addressDraft.value.trim();

    if (!trimmedLabel || !trimmedValue) {
      toast.error("Please complete the address label and value");
      return;
    }

    const nextAddress = {
      ...addressDraft,
      id: addressId,
      label: trimmedLabel,
      value: trimmedValue,
    };

    setAddresses((currentAddresses) =>
      currentAddresses.map((address) =>
        address.id === addressId ? nextAddress : address
      )
    );
    handleCancelEditingAddress();
    toast.success("Address updated");
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses((currentAddresses) =>
      currentAddresses.filter((address) => address.id !== addressId)
    );

    if (editingAddressId === addressId) {
      handleCancelEditingAddress();
    }

    toast.success("Address removed");
  };

  const handleAddAddress = () => {
    const nextId = `address-${Date.now()}`;
    const nextAddress = {
      id: nextId,
      label: "New Address",
      value: "",
    };

    setAddresses((currentAddresses) => [...currentAddresses, nextAddress]);
    setEditingAddressId(nextId);
    setAddressDraft(nextAddress);
  };

  const handleResetPassword = () => {
    toast.message("Password reset flow is coming soon");
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-start justify-start gap-8">
      <SectionHeader title="CONTACT DETAILS" icon={PenLine} />
      <div className="flex self-stretch flex-col items-start justify-start gap-6">
        <DetailField
          label="Name"
          value={contactDraft.name}
          isEditing
          onChange={(value) => setContactDraft((current) => ({ ...current, name: value }))}
        />
        <DetailField
          label="Email"
          value={contactDraft.email}
          type="email"
          isEditing
          onChange={(value) => setContactDraft((current) => ({ ...current, email: value }))}
        />
        <DetailField
          label="Phone Number"
          value={contactDraft.phone}
          type="tel"
          isEditing
          onChange={(value) => setContactDraft((current) => ({ ...current, phone: value }))}
        />
        <div className="inline-flex items-center justify-start gap-4">
          <button
            type="button"
            onClick={handleSaveContact}
            disabled={!hasUnsavedContactChanges}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-['Montserrat'] text-base font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-5 w-5" strokeWidth={2} />
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleResetContact}
            disabled={!hasUnsavedContactChanges}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-['Montserrat'] text-base font-semibold text-foreground outline outline-1 outline-offset-[-1px] outline-stroke disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" strokeWidth={2} />
            Reset
          </button>
        </div>
        <button
          type="button"
          onClick={handleResetPassword}
          className="inline-flex items-center justify-start gap-2"
        >
          <div className="relative h-6 w-6 overflow-hidden">
            <RotateCcwKey
              className="absolute left-[2px] top-[2px] h-5 w-5 text-[#B91C1C]"
              strokeWidth={1.8}
            />
          </div>
          <div className="font-['Montserrat'] text-xl font-medium text-[#B91C1C]">
            Reset your password
          </div>
        </button>
      </div>
      <SectionHeader title="ADDRESSES" icon={Plus}>
        <button
          type="button"
          onClick={handleAddAddress}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-['Montserrat'] text-sm font-semibold text-foreground"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Address
        </button>
      </SectionHeader>
      <div className="flex w-full max-w-2xl flex-col items-start justify-start gap-6">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isEditing={editingAddressId === address.id}
            draft={editingAddressId === address.id ? addressDraft : address}
            onEdit={() => handleStartEditingAddress(address)}
            onSave={() => handleSaveAddress(address.id)}
            onCancel={handleCancelEditingAddress}
            onDelete={() => handleDeleteAddress(address.id)}
            onDraftChange={setAddressDraft}
          />
        ))}
      </div>
    </div>
  );
}
