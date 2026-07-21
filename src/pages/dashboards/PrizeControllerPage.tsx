import { useForm } from "react-hook-form";
import { handleApiError } from '../../lib/utils';
import { zodResolver } from "@hookform/resolvers/zod";
import { prizeSchema } from "../../schemas";
import { toast } from "sonner";
import type { PrizeFormValues } from "../../schemas";
import {
  usePrizes,
  useAddPrize,
  useDeletePrize,
} from "../../hooks/queries/prizequery";



const PrizeControllerPage = () => {
  const { data: prizes = [], isLoading } = usePrizes();
  const addPrize = useAddPrize();
  const deletePrize = useDeletePrize();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrizeFormValues>({
    resolver: zodResolver(prizeSchema),
  });

  const onSubmit = async (data: PrizeFormValues) => {
    try {
      await addPrize.mutateAsync({
        name: data.name,
        weight: data.weight,
      });

      toast.success("Prize added successfully");
      reset();
    } catch (error) {
      handleApiError(error, "حدث خطأ أثناء إضافة الجائزة");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePrize.mutateAsync(id);
      toast.success("Prize deleted successfully");
    } catch (error) {
      handleApiError(error, "حدث خطأ أثناء حذف الجائزة");
    }
  };

  if (isLoading) return <p className="p-6 text-gray-text">Loading...</p>;

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col gap-6">
      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 ">
        <div className="flex flex-col gap-1">
          <input
            placeholder="Name"
            {...register("name")}
            className="border border-stroke bg-background text-foreground placeholder:text-gray-text p-2 rounded-lg outline-none focus:border-primary transition-colors"
          />
          <p className="text-red-500 text-xs min-h-[1rem]">
            {errors.name?.message}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="number"
            placeholder="Weight"
            {...register("weight", { valueAsNumber: true })}
            className="border border-stroke bg-background text-foreground placeholder:text-gray-text p-2 rounded-lg outline-none focus:border-primary transition-colors"
          />
          <p className="text-red-500 text-xs min-h-[1rem]">
            {errors.weight?.message}
          </p>
        </div>

        <button
          type="submit"
          disabled={addPrize.isPending}
          className="bg-primary text-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {addPrize.isPending ? "Adding..." : "Add"}
        </button>
      </form>

      {/* LIST */}
      <div className="flex flex-col gap-3">
        {prizes.map((prize) => (
          <div
            key={prize.id}
            className="flex justify-between items-center bg-card border border-stroke rounded-xl p-3 shadow-[0_1px_4px_0_var(--color-shadow)]"
          >
            <div>
              <p className="font-bold text-foreground">{prize.name}</p>
              <p className="text-sm text-gray-text">Weight: {prize.weight}</p>
            </div>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this prize?")) {
                  handleDelete(prize.id);
                }
              }}
              disabled={deletePrize.isPending}
              className="border border-stroke text-foreground hover:bg-gray-light px-3 py-1 rounded-lg transition-colors disabled:opacity-50 cursor-pointer hover:bg-red-300"
            >
              Delete
            </button>
          </div>
        ))}

        {prizes.length === 0 && (
          <p className="text-gray-text text-sm text-center py-6">
            No prizes yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default PrizeControllerPage;
