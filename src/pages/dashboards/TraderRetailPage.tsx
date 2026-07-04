import { useState } from "react";

export default function TraderRetailPage() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="font-['Montserrat'] text-2xl font-semibold text-[#111827]">
          Retail Operations
        </h1>
        <p className="text-[#6B7280]">
          Manage your retail sales, physical store integrations, and in-person transactions.
        </p>

        <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center shadow-[0_6px_20px_-2px_rgba(30,37,45,0.08)]">
          <h2 className="mb-2 font-['Montserrat'] text-xl font-medium text-[#111827]">Coming Soon</h2>
          <p className="text-sm text-[#6B7280]">The retail operations module is currently under development.</p>
        </div>
      </div>
    </>
  );
}
