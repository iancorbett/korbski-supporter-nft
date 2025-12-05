import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { Keypair } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

export function getUmi() {
  const rpcUrl =
    process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

  const umi = createUmi(rpcUrl).use(mplTokenMetadata());

  // creator wallet from secret key file (devnet)
  const keypairPath =
    process.env.SOLANA_KEYPAIR_PATH ||
    path.join(process.cwd(), "creator-keypair.json");

  if (!fs.existsSync(keypairPath)) {
    throw new Error(
      `Keypair file not found at ${keypairPath}. Run 'solana-keygen new -o creator-keypair.json' first.`
    );
  }

  const secretKeyString = fs.readFileSync(keypairPath, "utf8");
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = Keypair.fromSecretKey(secretKey);

  umi.use({
    install(umiInstance) {
      // @ts-ignore
      umiInstance.identity = umiInstance.eddsa.createKeypairFromSecretKey(
        keypair.secretKey
      );
    },
  });

  return umi;
}
