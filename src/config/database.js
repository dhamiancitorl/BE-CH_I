import { connect } from "mongoose";

export async function mongoConnect() {
  try {
    await connect(
      //⚠️⚠️⚠️A FINES PRACTICOS Y DE ESTUDIO ESTO ESTA HARDCODEADO ASI ⚠️⚠️⚠️
      //NO APLICA A CUESTIONES PRODUCTIVAS, para eso se usa un archivo .env
      "mongodb+srv://romlodamrica_db_user:KUtBYOmfHDQ59Ueo@cluster0.8gcjoo4.mongodb.net/?appName=Cluster0",
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error conectando MongoDB:", error);
    process.exit(1);
  }
}
