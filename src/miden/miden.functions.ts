import { FieldElement } from "./miden.interfaces";

export function fieldElementToHex(field: FieldElement): string {
  try {
    // 1. Convertir cada limb a hex de 16 caracteres (64 bits cada uno)
    const limbHexes = [
      BigInt(field.d0).toString(16).padStart(16, "0"),
      BigInt(field.d1).toString(16).padStart(16, "0"),
      BigInt(field.d2).toString(16).padStart(16, "0"),
      BigInt(field.d3).toString(16).padStart(16, "0"),
    ];

    // 2. Combinar en el orden: d3 + d2 + d1 + d0
    const combinedHex =
      limbHexes[3] + limbHexes[2] + limbHexes[1] + limbHexes[0];

    // 3. Revertir el orden de TODOS los bytes (cada 2 caracteres)
    let reversedHex = "";
    for (let i = 0; i < combinedHex.length; i += 2) {
      reversedHex = combinedHex.substr(i, 2) + reversedHex;
    }

    return "0x" + reversedHex;
  } catch (error) {
    console.error("Error converting field element to hex:", error, field);
    return "0x" + "0".repeat(64);
  }
}

export function timestampToDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "long",
    timeStyle: "long",
  });
}
