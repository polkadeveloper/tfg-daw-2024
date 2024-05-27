import { column, defineDb, defineTable, NOW } from "astro:db";

const Collections = defineTable({
  columns: {
    collection_id: column.number({ primaryKey: true, autoIncrement: true }),
    collection_name: column.text(),
  },
});

const Users = defineTable({
  columns: {
    user_id: column.number({ primaryKey: true, autoIncrement: true }),
    user_name: column.text(),
    user_password: column.text(),
    first_name: column.text(),
    last_name: column.text(),
    user_email: column.text(),
    address: column.text(),
    floor: column.text({ optional: true }),
    postal_code: column.text(),
    city: column.text(),
    province: column.text(),
    country: column.text(),
  },
});

const UserSession = defineTable({
  columns: {
    user_id: column.text({ primaryKey: true }),
    expires_at: column.date(),
  },
  foreignKeys: [
    {
      columns: ["user_id"],
      references: () => [Users.columns.user_id],
    },
  ],
});

const Cart = defineTable({
  columns: {
    cart_id: column.number({ primaryKey: true, autoIncrement: true }),
    user_id: column.number(),
  },
  foreignKeys: [
    {
      columns: ["user_id"],
      references: () => [Users.columns.user_id],
    },
  ],
});

const Transactions = defineTable({
  columns: {
    transaction_id: column.number({ primaryKey: true, autoIncrement: true }),
    transaction_date: column.date({ default: NOW }),
    cart_id: column.number(),
    payment_method: column.text(),
    status: column.text(),
  },
  foreignKeys: [
    {
      columns: ["cart_id"],
      references: () => [Cart.columns.cart_id],
    },
  ],
});

const TransactionsUsers = defineTable({
  columns: {
    transaction_id: column.number({ primaryKey: true }),
    user_id: column.number({ primaryKey: true }),
  },
  foreignKeys: [
    {
      columns: ["transaction_id"],
      references: () => [Transactions.columns.transaction_id],
    },
    {
      columns: ["user_id"],
      references: () => [Users.columns.user_id],
    },
  ],
});

const Items = defineTable({
  columns: {
    item_id: column.number({ primaryKey: true, autoIncrement: true }),
    collection_id: column.number(),
    item_name: column.text(),
    item_description: column.text(),
    item_price: column.number(),
    item_discounted: column.boolean({ default: false }),
    item_img_name: column.text(),
  },
  foreignKeys: [
    {
      columns: ["collection_id"],
      references: () => [Collections.columns.collection_id],
    },
  ],
});

const CartItems = defineTable({
  columns: {
    cart_id: column.number({ primaryKey: true }),
    item_id: column.number({ primaryKey: true }),
    quantity: column.number(),
    price: column.number(),
  },
  foreignKeys: [
    {
      columns: ["cart_id"],
      references: () => [Cart.columns.cart_id],
    },
    {
      columns: ["item_id"],
      references: () => [Items.columns.item_id],
    },
  ],
});

const Sizes = defineTable({
  columns: {
    size_id: column.number({ primaryKey: true, autoIncrement: true }),
    size_name: column.text(),
  },
});

const Admins = defineTable({
  columns: {
    admin_id: column.number({ primaryKey: true, autoIncrement: true }),
    admin_name: column.text(),
    admin_password: column.text(),
  },
});

const AdminsCrudOperations = defineTable({
  columns: {
    admin_id: column.number({ primaryKey: true }),
    item_id: column.number({ primaryKey: true }),
    operation_date: column.date({ default: NOW }),
  },
  foreignKeys: [
    {
      columns: ["admin_id"],
      references: () => [Admins.columns.admin_id],
    },
    {
      columns: ["item_id"],
      references: () => [Items.columns.item_id],
    },
  ],
});

const ItemsSizesStock = defineTable({
  columns: {
    item_id: column.number({ primaryKey: true }),
    size_id: column.number({ primaryKey: true }),
    quantity: column.number(),
  },
  foreignKeys: [
    {
      columns: ["item_id"],
      references: () => [Items.columns.item_id],
    },
    {
      columns: ["size_id"],
      references: () => [Sizes.columns.size_id],
    },
  ],
});

export default defineDb({
  tables: {
    Collections,
    Users,
    UserSession,
    Cart,
    Transactions,
    TransactionsUsers,
    Items,
    CartItems,
    Sizes,
    Admins,
    AdminsCrudOperations,
    ItemsSizesStock,
  },
});
