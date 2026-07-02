import { useState } from "react";
import {
  FileText,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";

type Tab = "active" | "completed" | "returns";

const orderItems = [
  { id: 1, name: "Amber Blaze Classic Tee", price: "$250", size: "XXL", color: "bg-red-200", qty: 1 },
  { id: 2, name: "Amber Blaze Classic Tee", price: "$250", size: "XXL", color: "bg-red-200", qty: 1 },
  { id: 3, name: "Amber Blaze Classic Tee", price: "$250", size: "XXL", color: "bg-red-200", qty: 1 },
];

const orderSteps = [
  { icon: FileText, label: "New Order", date: "25 Sep, 2025", completed: true },
  { icon: CheckCircle2, label: "Confirmed", date: "25 Sep, 2025", completed: true },
  { icon: Package, label: "Shipped", date: "25 Sep, 2025", completed: true },
  { icon: Truck, label: "Delivered", date: "Pending Delivery", completed: false },
];

function OrderTabs({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (tab: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "returns", label: "Returns" },
  ];

  return (
    <div className="relative">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`pb-4 font-['Montserrat'] text-base font-bold cursor-pointer ${
              activeTab === tab.key
                ? "text-[#1A1A1A] border-b-[3px] border-[#1A1A1A]"
                : "text-[#6B7280]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-80 h-px bg-[#E0E0E0]" />
    </div>
  );
}

function OrderHeader() {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-[#1A1A1A] p-4">
      <div className="flex flex-col gap-2">
        <span className="font-['Montserrat'] text-base font-bold text-[#BBFF63]">
          Order #24653565
        </span>
        <div className="flex items-center gap-4">
          <span className="font-['Montserrat'] text-base font-medium text-white/70">
            25 Sep, 2025
          </span>
          <span className="font-['Montserrat'] text-base font-medium text-white/70">15:04</span>
        </div>
      </div>
    </div>
  );
}

function OrderItemCard({ item }: { item: typeof orderItems[0] }) {
  return (
    <div className="flex rounded-lg bg-white shadow-[0px_6px_20px_-2px_rgba(30,37,45,0.10)] overflow-hidden">
      <div className="p-2 shrink-0">
        <div className="h-[166px] w-[140px] rounded-lg bg-[#F0F0F0]" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="font-['Montserrat'] text-xl font-medium text-[#1A1A1A]">
          {item.name}
        </span>
        <span className="font-['Montserrat'] text-xl font-semibold text-[#1A1A1A]">
          {item.price}
        </span>
        <div className="flex items-center gap-4 rounded-lg bg-white p-2 outline outline-1 outline-offset-[-1px] outline-[#E0E0E0]">
          <span className="font-['Montserrat'] text-base">
            <span className="font-medium text-[#1A1A1A]">Size: </span>
            <span className="font-bold text-[#1A1A1A]">{item.size}</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="font-['Montserrat'] text-base font-medium text-[#1A1A1A]">
              Color:
            </span>
            <div className={`h-6 w-6 rounded-full ${item.color}`} />
          </div>
        </div>
        <span className="font-['Montserrat'] text-sm font-semibold text-[#1A1A1A]">
          ({item.qty})
        </span>
      </div>
    </div>
  );
}

function OrderStatus() {
  return (
    <div className="w-80 shrink-0 rounded-lg bg-[#1A1A1A] p-4 self-start">
      <span className="font-['Montserrat'] text-base font-bold text-[#BBFF63]">Order Status</span>

      <div className="mt-8 flex flex-col">
        {orderSteps.map((step, index) => (
          <div key={step.label}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#2A2D35]`}
                >
                  <step.icon
                    className={`h-8 w-8 ${step.completed ? "text-[#BBFF63]" : "text-zinc-400"}`}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`font-['Montserrat'] text-base font-bold ${
                      step.completed ? "text-[#BBFF63]" : "text-zinc-400"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`font-['Montserrat'] text-sm font-medium ${
                      step.completed ? "text-white/70" : "text-zinc-400"
                    }`}
                  >
                    {step.date}
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 flex items-center justify-center">
                {step.completed ? (
                  <div className="h-8 w-8 rounded-full bg-[#BBFF63] flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-black" strokeWidth={2} />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-zinc-400" />
                )}
              </div>
            </div>
            {index < orderSteps.length - 1 && (
              <div
                className={`ml-[35px] h-12 w-0.5 ${
                  step.completed && orderSteps[index + 1]?.completed
                    ? "bg-[#BBFF63]"
                    : step.completed
                      ? "bg-[#BBFF63]"
                      : "bg-zinc-400"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>("active");

  return (
    <div className="absolute left-[378px] top-[122px] right-[24px]">
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6 flex gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <OrderHeader />
          {orderItems.map((item) => (
            <OrderItemCard key={item.id} item={item} />
          ))}
        </div>
        <OrderStatus />
      </div>
    </div>
  );
}
