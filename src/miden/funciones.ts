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
