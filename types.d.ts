interface Category {
  id: number;
  name: string;
  assigned_budget: number;
  icon: string;
  color: string;
  created_by: string;
  created_at: string;
}
interface CategoryItem {
  id: number;
  name: string;
  cost: number;
  url: string;
  image: string;
  note: string;
  category_id: number;
}
interface CategoryDetail {
  category: Category | null;
  items: CategoryItem[];
}

type CombinedCategoryList = Category & {
  items: CategoryItem[];
};
