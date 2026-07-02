import { CheckCircle, ChevronDown } from "lucide-react";

function LanguageField() {
  return (
    <div className="inline-flex h-14 items-center justify-between self-stretch">
      <div className="text-center font-['Montserrat'] text-base font-medium leading-4 tracking-tight text-[#1A1A1A]">
        Language
      </div>
      <div className="relative h-14 w-96 overflow-hidden rounded-xl outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
        <div className="absolute left-[16px] top-[20px] inline-flex w-96 items-center justify-between">
          <div className="text-center font-['Poppins'] text-base font-normal leading-4 tracking-tight text-[#6B7280]">
            EN
          </div>
          <div className="relative h-6 w-6 overflow-hidden">
            <ChevronDown
              className="absolute left-0 top-0 h-6 w-6 text-[#6B7280]"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeMockup({ selected = false }: { selected?: boolean }) {
  return (
    <div
      className={`relative h-52 w-60 overflow-hidden bg-[#E0E0E0] outline outline-2 outline-offset-[-2px] ${
        selected ? "outline-[#BBFF63]" : "outline-[#E0E0E0]"
      }`}
    >
      <div className="absolute left-[16px] top-[16px] h-36 w-56 overflow-hidden bg-white">
        <div className="absolute left-[32px] top-[24px] h-32 w-48 overflow-hidden bg-[#F9FAFB]">
          <div className="absolute left-[8px] top-[8px] h-12 w-16 bg-[#BBFF63]" />
          <div className="absolute left-[8px] top-[71px] h-12 w-16 bg-[#BBFF63]" />
          <div className="absolute left-[94px] top-[8px] h-12 w-16 bg-[#BBFF63]" />
          <div className="absolute left-[94px] top-[71px] h-12 w-16 bg-[#BBFF63]" />
        </div>
        <div className="absolute left-[4px] top-[25px] h-2.5 w-6 bg-[#BBFF63]" />
      </div>
    </div>
  );
}

function ThemeCard({
  label,
  selected = false,
}: {
  label: "Light Mode " | "Dark Mode ";
  selected?: boolean;
}) {
  return (
    <div
      className={`relative h-52 w-60 overflow-hidden bg-[#E0E0E0] outline outline-2 outline-offset-[-2px] ${
        selected ? "outline-[#BBFF63]" : "outline-[#E0E0E0]"
      }`}
    >
      <ThemeMockup selected={selected} />
      <div className="absolute left-0 top-[166px] h-12 w-60 overflow-hidden border-t border-[#F9FAFB] bg-white">
        <div
          className={`absolute left-[8px] inline-flex w-56 items-center justify-between ${
            selected ? "top-[12px]" : "top-[16px]"
          }`}
        >
          <div className="text-center font-['Montserrat'] text-base font-medium leading-4 tracking-tight text-[#1A1A1A]">
            {label}
          </div>
          {selected ? (
            <div className="relative h-6 w-6 overflow-hidden">
              <CheckCircle className="absolute left-[1px] top-[1px] h-5 w-5 fill-[#BBFF63] text-[#BBFF63]" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <>
      <div className="absolute left-[378px] top-[122px] inline-flex w-[613px] items-center justify-between">
        <div className="font-['Montserrat'] text-3xl font-bold text-[#1A1A1A]">
          Settings
        </div>
      </div>
      <div className="absolute left-[378px] top-[177px] inline-flex w-[1032px] flex-col items-start justify-start gap-6">
        <div className="flex self-stretch flex-col items-start justify-start gap-4">
          <LanguageField />
          <div className="flex w-[494px] flex-col items-start justify-start gap-4">
            <div className="self-stretch text-center font-['Montserrat'] text-base font-medium leading-4 tracking-tight text-[#1A1A1A]">
              Select Theme
            </div>
            <div className="inline-flex items-center justify-start gap-6 self-stretch">
              <ThemeCard label="Light Mode " selected />
              <ThemeCard label="Dark Mode " />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SettingsPage() {
  return <SettingsPanel />;
}
