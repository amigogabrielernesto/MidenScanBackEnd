import { bech32, bech32m } from "bech32";

export function convertRespuestaToHex(respuesta: {
  d0: string;
  d1: string;
  d2: string;
  d3: string;
}): string {
  const parts = [respuesta.d0, respuesta.d1, respuesta.d2, respuesta.d3];

  // Convertimos cada decimal a 8 bytes y luego a hex
  const hexParts = parts.map((numStr) => {
    const bn = BigInt(numStr);
    // pasamos a little-endian u64
    const bytes: number[] = [];
    let temp = bn;
    for (let i = 0; i < 8; i++) {
      bytes.push(Number(temp & 0xffn));
      temp >>= 8n;
    }
    return Buffer.from(bytes).toString("hex");
  });

  // Concatenamos en orden inverso para big-endian de 256 bits
  //const fullHex = hexParts.reverse().join("");
  const fullHex = hexParts;
  return "0x" + fullHex.join("");
}

export function convertAllCommitments(blockHeader: any) {
  const result: Record<string, string> = {};

  // Iteramos cada propiedad del block_header
  for (const key in blockHeader) {
    const val = blockHeader[key];

    // Comprobamos que tenga los 4 campos d0-d3 (commitment típico)
    if (
      val &&
      typeof val === "object" &&
      ["d0", "d1", "d2", "d3"].every((k) => k in val)
    ) {
      result[key] = convertRespuestaToHex(val);
    }
  }

  return result;
}

export function decodeMidenAccountId(bech: string): Uint8Array {
  // Decodificamos con Bech32
  const { prefix, words } = require("bech32").bech32m.decode(bech);

  // Validamos que el prefijo sea `mtst` (testnet) o `mm` (mainnet)
  if (prefix !== "mtst" && prefix !== "mm") {
    throw new Error(`Prefijo no válido: ${prefix}. Se espera "mtst" o "mm".`);
  }

  // Convertimos grupos de palabras 5-bits a bytes 8-bits
  const data = Uint8Array.from(require("bech32").bech32m.fromWords(words));
  const padded = new Uint8Array(32);
  // Expandir a 32 bytes rellenando con ceros al inicio
  padded.set(data, 32 - data.length); // alinea a la derecha
  return padded;
}

// Ejemplo de uso
