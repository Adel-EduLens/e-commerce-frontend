import { useEffect, useMemo, useState } from "react";
import { Check, PenLine, Plus, RotateCcwKey, X, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import type { AccountLayoutContext } from "../layouts/AccountLayout";
import { useAuthStore } from "../store/useAuthStore";
import { useTranslation } from "react-i18next";
import {
  useMyAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../hooks/queries/addressQuery";
import { Modal } from "../components/ui/modal";
import type { AxiosError } from "axios";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
};

type AddressItem = {
  id: string;
  country: string;
  city: string;
  area: string;
  streetAddress: string;
  apartment?: string | null;
};

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
  options,
}: {
  label: string;
  value: string;
  isEditing?: boolean;
  onChange?: (value: string) => void;
  type?: "text" | "email" | "tel";
  options?: string[];
}) {
  return (
    <div className="flex self-stretch flex-col items-start justify-start gap-4">
      <FieldLabel>{label}</FieldLabel>

      <div className="inline-flex items-center justify-start gap-2.5 self-stretch overflow-hidden border-b border-stroke pb-4">
        {isEditing ? (
          options ? (
            <select
              value={value}
              onChange={(event) => onChange?.(event.target.value)}
              className="w-full border-none bg-transparent font-['Montserrat'] text-xl font-medium text-foreground outline-none"
            >
              <option value="" disabled>
                Select {label}
              </option>

              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(event) => onChange?.(event.target.value)}
              className="w-full border-none bg-transparent font-['Montserrat'] text-xl font-medium text-foreground outline-none placeholder:text-gray-text"
            />
          )
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
      ? "text-urgent hover:bg-red-100"
      : tone === "success"
        ? "text-success hover:bg-green-100"
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
  isNew = false,
  isAddressLoading = false,
  onEdit,
  onSave,
  onDelete,
  onDraftChange,
}: {
  address: AddressItem;
  isEditing: boolean;
  draft: AddressItem;
  isNew?: boolean;
  isAddressLoading?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onDraftChange: (value: AddressItem) => void;
}) {
  const { t } = useTranslation("contact");
  const current = isEditing ? draft : address;

  const summary = [
    address.streetAddress,
    address.area,
    address.city,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={`w-full rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${isAddressLoading ? "pointer-eve nts-none opacity-50" : ""
        }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="mb-1 inline-flex rounded-full bg-gray-light px-2.5 py-1 text-[11px] font-medium text-gray-text">
            {t("Address")}
          </span>

          <h3 className="truncate text-base font-semibold text-foreground">
            {isEditing
              ? isNew
                ? t("Adding Address")
                : t("Editing Address")
              : summary || t("No address details")}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          {!isEditing && (
            <>
              <IconButton
                icon={PenLine}
                label={t("Edit address")}
                onClick={onEdit}
              />
              <IconButton
                icon={Trash2}
                tone="danger"
                label={t("Edit address")}
                onClick={onDelete}
              />

            </>
          )}
        </div>
      </div>
      {/* Details */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-3 border-t border-stroke pt-4 sm:grid-cols-2">
        <DetailField
          label={t("Country")}
          value={current.country}
          isEditing={isEditing}
          options={["Egypt", "Saudi Arabia", "UAE"]}
          onChange={(value) =>
            onDraftChange({
              ...draft,
              country: value,
            })
          }
        />

        <DetailField
          label={t("City")}
          value={current.city}
          isEditing={isEditing}
          onChange={(value) => onDraftChange({ ...draft, city: value })}
        />

        <DetailField
          label={t("Area")}
          value={current.area}
          isEditing={isEditing}
          onChange={(value) => onDraftChange({ ...draft, area: value })}
        />

        <DetailField
          label={t("Apartment")}
          value={current.apartment ?? ""}
          isEditing={isEditing}
          onChange={(value) => onDraftChange({ ...draft, apartment: value })}
        />

        <div className="sm:col-span-2">
          <DetailField
            label={t("Street Address")}
            value={current.streetAddress}
            isEditing={isEditing}
            onChange={(value) =>
              onDraftChange({
                ...draft,
                streetAddress: value,
              })
            }
          />
        </div>
      </div>
      {isEditing && (
        <div className="sm:col-span-2 mt-4 flex justify-end">
          <button
            type="button"
            onClick={onSave}
            disabled={isAddressLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-['Montserrat'] text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAddressLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Check className="h-5 w-5" />
            )}

            {isNew ? t("Add Address") : t("Save Address")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ContactDetailsPage() {
  const { t } = useTranslation("contact");
  const { setFooterConfig } = useOutletContext<AccountLayoutContext>();
  const { user, updateUser } = useAuthStore();
  const [contactDetails, setContactDetails] = useState<ContactForm>({
    name: String(user?.name ?? "Maan Galal"),
    email: String(user?.email ?? "maan@example.com"),
    phone: String(user?.phone ?? "+201024941663"),
  });
  const [contactDraft, setContactDraft] = useState<ContactForm>(contactDetails);
  const { data: addresses = [], isLoading: isAddressesLoading } =
    useMyAddresses();

  const { mutate: addAddress, isPending: isAddingAddress } = useAddAddress();

  const { mutate: updateAddress, isPending: isUpdatingAddress } =
    useUpdateAddress();

  const { mutate: deleteAddress, isPending: isDeletingAddress } =
    useDeleteAddress();
  const isAddressLoading =
    isAddingAddress || isUpdatingAddress || isDeletingAddress;
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const emptyAddress: AddressItem = {
    id: "",
    country: "",
    city: "",
    area: "",
    streetAddress: "",
    apartment: "",
  };

  const [addressDraft, setAddressDraft] = useState(emptyAddress);
  const [isAdding, setIsAdding] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  useEffect(() => {
    const func = async () => {
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
    };
    func();
  }, [user]);

  const footerTop = useMemo(
    () => 970 + Math.max(addresses.length - 2, 0) * 210,
    [addresses.length],
  );

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
      toast.error(t("Please complete all contact details"));
      return;
    }

    if (!trimmedEmail.includes("@")) {
      toast.error(t("Please enter a valid email address"));
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

    toast.success(t("Contact details updated"));
  };

  const handleStartEditingAddress = (address: AddressItem) => {
    setIsAdding(false);
    setEditingAddressId(address.id);
    setAddressDraft(address);
    setAddressModalOpen(true);
  };

  const handleCancelEditingAddress = () => {
    setEditingAddressId(null);
    setAddressDraft(emptyAddress);
    setAddressModalOpen(false);
    setIsAdding(false);
  };
  const handleSaveAddress = (addressId: string) => {
    const trimmedStreet = addressDraft.streetAddress.trim();
    const trimmedCity = addressDraft.city.trim();

    if (!trimmedStreet || !trimmedCity) {
      toast.error(t("Please complete the address details"));
      return;
    }

    updateAddress(
      {
        id: addressId,
        data: {
          country: addressDraft.country,
          city: trimmedCity,
          area: addressDraft.area,
          streetAddress: trimmedStreet,
          apartment: addressDraft.apartment ?? "",
        },
      },
      {
        onSuccess() {
          handleCancelEditingAddress();
          toast.success(t("Address updated"));
        },
        onError(error) {
          const axiosError = error as AxiosError<{ message?: string }>;
          toast.error(
            axiosError.response?.data?.message || t("Failed to update address"),
          );
        },
      },
    );
  };

  const handleDeleteAddress = (addressId: string) => {
    deleteAddress(addressId, {
      onSuccess() {
        toast.success(t("Address removed"));

        if (editingAddressId === addressId) {
          handleCancelEditingAddress();
        }
      },
    });
  };

  const handleAddAddress = () => {
    setAddressDraft(emptyAddress);
    setEditingAddressId(null);
    setIsAdding(true);
    setAddressModalOpen(true);
  };
  const handleCreateAddress = () => {
    addAddress(
      {
        country: addressDraft.country,
        city: addressDraft.city,
        area: addressDraft.area,
        streetAddress: addressDraft.streetAddress,
        apartment: addressDraft.apartment ?? undefined,
      },
      {
        onSuccess() {
          handleCancelEditingAddress();
          toast.success(t("Address added"));
        },

        onError(error) {
          const axiosError = error as AxiosError<{ message?: string }>;

          toast.error(
            axiosError.response?.data?.message || t("Failed to add address"),
          );
        },
      },
    );
  };
  const handleResetPassword = () => {
    toast.message("Password reset flow is coming soon");
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-8">
      <SectionHeader title={t("CONTACT DETAILS")} icon={PenLine} />
      <div className="flex self-stretch flex-col items-start justify-start gap-6">
        <DetailField
          label={t("Name")}
          value={contactDraft.name}
          isEditing
          onChange={(value) =>
            setContactDraft((current) => ({ ...current, name: value }))
          }
        />
        <DetailField
          label={t("Email")}
          value={contactDraft.email}
          type="email"
          isEditing
          onChange={(value) =>
            setContactDraft((current) => ({ ...current, email: value }))
          }
        />
        <DetailField
          label={t("Phone Number")}
          value={contactDraft.phone}
          type="tel"
          isEditing
          onChange={(value) =>
            setContactDraft((current) => ({ ...current, phone: value }))
          }
        />
        <div className="inline-flex items-center justify-start gap-4">
          <button
            type="button"
            onClick={handleSaveContact}
            disabled={!hasUnsavedContactChanges}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-['Montserrat'] text-base font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-5 w-5" strokeWidth={2} />
            {t("Save Changes")}
          </button>
          <button
            type="button"
            onClick={handleResetContact}
            disabled={!hasUnsavedContactChanges}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-['Montserrat'] text-base font-semibold text-foreground outline outline-1 outline-offset-[-1px] outline-stroke disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" strokeWidth={2} />
            {t("Reset")}
          </button>
        </div>
        <button
          type="button"
          onClick={handleResetPassword}
          className="inline-flex items-center justify-start gap-2"
        >
          <div className="relative h-6 w-6 overflow-hidden">
            <RotateCcwKey
              className="absolute left-[2px] top-[2px] h-5 w-5 text-urgent"
              strokeWidth={1.8}
            />
          </div>
          <div className="font-['Montserrat'] text-xl font-medium text-urgent">
            {t("Reset your password")}
          </div>
        </button>
      </div>
      <SectionHeader title={t("ADDRESSES")} icon={Plus}>
        <button
          type="button"
          onClick={handleAddAddress}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-['Montserrat'] text-sm font-semibold text-foreground"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          {t("Add Address")}
        </button>
      </SectionHeader>
      {isAddressesLoading && (
        <div className="p-10 text-center">{t("loadding")}</div>
      )}
      {!isAddressesLoading && addresses && addresses.length === 0 && (
        <div className="p-10 text-center">{t("noAddredddddsses")}</div>
      )}

      {addresses && addresses.length > 0 && (
        <div className="flex w-full max-w-2xl flex-col items-start justify-start gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isEditing={editingAddressId === address.id}
              isAddressLoading={isAddressLoading}
              draft={editingAddressId === address.id ? addressDraft : address}
              onEdit={() => handleStartEditingAddress(address)}
              onSave={() => handleSaveAddress(address.id)}
              onCancel={handleCancelEditingAddress}
              onDelete={() => handleDeleteAddress(address.id)}
              onDraftChange={setAddressDraft}
            />
          ))}
        </div>
      )}
      <Modal
        isOpen={addressModalOpen}
        onClose={handleCancelEditingAddress}
        title={isAdding ? t("Add Address") : t("Edit Address")}
      >
        <AddressCard
          address={
            isAdding
              ? emptyAddress
              : (addresses.find((item) => item.id === editingAddressId) ??
                emptyAddress)
          }
          draft={addressDraft}
          isEditing
          isNew={isAdding}
          isAddressLoading={isAddingAddress}
          onEdit={() => { }}
          onDraftChange={setAddressDraft}
          onCancel={handleCancelEditingAddress}
          onDelete={() => { }}
          onSave={
            isAdding
              ? handleCreateAddress
              : () => handleSaveAddress(editingAddressId!)
          }
        />
      </Modal>
    </div>
  );
}
