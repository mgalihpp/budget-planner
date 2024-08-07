import { SQLiteDatabase } from 'expo-sqlite';
import { ToastAndroid } from 'react-native';

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            assigned_budget REAL,
            icon TEXT,
            color TEXT,
            created_by TEXT,
            created_at TEXT
            );
            CREATE TABLE IF NOT EXISTS categories_items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              cost REAL,
              url TEXT,
              image TEXT,
              note TEXT,
              category_id INTEGER,
              FOREIGN KEY (category_id) REFERENCES categories(id)
            );
        `);
    console.log('Database initialised');
  } catch (error) {
    console.log('Error while initializing database : ', error);
  }
}

export const getAllCategory = async (
  db: SQLiteDatabase
): Promise<CombinedCategoryList[]> => {
  try {
    const categories: Category[] = await db.getAllAsync(
      `SELECT * FROM categories ORDER BY id DESC`
    );

    const categoryIds = categories.map((category: Category) => category.id);

    // Fetch items for each category
    const categoryItemsPromises: Promise<CategoryItem[]>[] = categoryIds.map(
      (categoryId) =>
        db.getAllAsync(`SELECT * FROM categories_items WHERE category_id = ?`, [
          categoryId as number,
        ])
    );

    const categoryItemsResults = await Promise.all(categoryItemsPromises);
    // Combine categories and items
    const categoryList: CombinedCategoryList[] = categories.map(
      (category: Category, index: number) => ({
        ...category,
        items: categoryItemsResults[index],
      })
    );

    console.log('Database fetched, found :', categoryList);
    return categoryList;
  } catch (error) {
    console.log('Error while fetching categories : ', error);
    return [];
  }
};

export const addCategory = async (
  category: Omit<Category, 'id'>,
  db: SQLiteDatabase
): Promise<Category | null> => {
  try {
    // Insert the category into the database
    const result = await db.runAsync(
      `INSERT INTO categories (name, assigned_budget, icon, color, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
      [
        category.name,
        category.assigned_budget,
        category.icon,
        category.color,
        category.created_by,
        category.created_at,
      ]
    );
    console.log('Database inserted');

    // Get the ID of the newly inserted category
    const insertedId = result.lastInsertRowId;

    // Fetch the newly inserted category
    const categoryResult: Category | null = await db.getFirstAsync(
      `SELECT * FROM categories WHERE id = ?`,
      [insertedId]
    );

    console.log('Database fetched, found :', categoryResult);

    return categoryResult;
  } catch (error) {
    console.error('Error while adding category : ', error);
    ToastAndroid.show('Error while adding category', ToastAndroid.SHORT);
    return null;
  }
};

export const addCategoryItem = async (
  item: Omit<CategoryItem, 'id'>,
  db: SQLiteDatabase
): Promise<CategoryItem | null> => {
  try {
    const result = await db.runAsync(
      `INSERT INTO categories_items (name, cost, url, image, note, category_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [item.name, item.cost, item.url, item.image, item.note, item.category_id]
    );

    console.log('Database inserted');

    const insertedItemId = result.lastInsertRowId;

    const categoryItemResult: CategoryItem | null = await db.getFirstAsync(
      `SELECT * FROM categories_items WHERE id = ?`,
      [insertedItemId]
    );
    console.log('Database fetched, found :', categoryItemResult);

    return categoryItemResult;
  } catch (error) {
    console.log('Error while adding category item : ', error);
    ToastAndroid.show('Error while adding category item', ToastAndroid.SHORT);
    return null;
  }
};

export const getCategoryDetail = async (
  categoryId: number,
  db: SQLiteDatabase
): Promise<CategoryDetail> => {
  // Fetch the category and its related items
  try {
    const categoryQuery = `
    SELECT * FROM categories WHERE id = ?;
  `;
    const itemsQuery = `
    SELECT * FROM categories_items WHERE category_id = ?;
  `;

    const categoryResult: Category | null = await db.getFirstAsync(
      categoryQuery,
      [categoryId]
    );
    console.log('Database fetched, found :', categoryResult);

    const itemsResult: CategoryItem[] = await db.getAllAsync(itemsQuery, [
      categoryId,
    ]);
    console.log('Database fetched, found :', itemsResult);

    return {
      category: categoryResult,
      items: itemsResult,
    };
  } catch (error) {
    console.error('Error while fetching category : ', error);
    ToastAndroid.show('Error while fetching category', ToastAndroid.SHORT);
    return {
      category: null,
      items: [],
    };
  }
};

export const deleteCategory = async (
  categoryId: number,
  db: SQLiteDatabase
): Promise<{
  success: boolean;
}> => {
  try {
    const itemsDelete = `
    DELETE FROM categories_items WHERE category_id = ?
  `;

    const categoryDelete = `DELETE FROM categories WHERE id = ?`;

    await db.runAsync(itemsDelete, [categoryId]);

    await db.runAsync(categoryDelete, [categoryId]);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    // Handle the error (e.g., show an error message)
    return {
      success: false,
    };
  }
};
