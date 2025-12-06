import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

export function getUmi() {
  const rpcUrl =
    process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

  // Base Umi client + token metadata plugin
  const umi = createUmi(rpcUrl).use(mplTokenMetadata());

  // Load your creator keypair from file
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

  // Turn the secret key into an Umi signer
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  const signer = createSignerFromKeypair(umi, keypair);

  // 🔥 This is the important part: set the signer identity
  umi.use(signerIdentity(signer));

  return umi;
}
