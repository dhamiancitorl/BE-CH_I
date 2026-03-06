import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mongoConnect } from "../src/config/database.js";
import { ProductModel } from "../src/models/Products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seed() {
  try {
    await mongoConnect();

    const jsonPath = join(__dirname, "..", "data", "products.json");
    const data = await readFile(jsonPath, "utf-8");
    const products = JSON.parse(data);

    // Quitar "id" del JSON; Mongo usa _id y tu schema no tiene "id"
    const productsForDb = products.map(({ id, ...rest }) => rest);

    const result = await ProductModel.insertMany(productsForDb);
    console.log(`✅ Insertados ${result.length} productos en la DB.`);

    process.exit(0);
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  }
}

seed();
