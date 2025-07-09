import { CategoryManagement } from "@/components/category-management";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kategori Wisata</h1>
        <p className="text-muted-foreground">
          Kelola kategori untuk paket wisata
        </p>
      </div>
      <CategoryManagement />
    </div>
  );
}
