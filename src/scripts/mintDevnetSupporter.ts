import { getUmi } from "../config/solana";
import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";

function getNextSupporterNumber(): number {
  const statePath = path.join(__dirname, "..", "state", "supporterCounter.json");
  const raw = fs.readFileSync(statePath, "utf8");
  const json = JSON.parse(raw) as { last: number };
  const next = json.last + 1;
  json.last = next;
  fs.writeFileSync(statePath, JSON.stringify(json, null, 2));
  return next;
}

async function main() {
  const umi = getUmi();

  console.log("Minting Korbski Labs Supporter test NFT on devnet...");

  const supporterNumber = getNextSupporterNumber();

  const uri =
    process.env.SUPPORTER_METADATA_URI ||
    "https://your-hosted-url/supporter-template.json";

  const mint = generateSigner(umi);

  const name = `Korbski Labs Supporter #${supporterNumber}`;

  const builder = createNft(umi, {
    mint,
    name,
    symbol: "KLSUP",
    uri,
    sellerFeeBasisPoints: percentAmount(5, 2), // 5%
    tokenStandard: TokenStandard.NonFungible,
    isMutable: true,
  });

  await builder.sendAndConfirm(umi);

  console.log(
    `Minted ${name} with mint address:`,
    mint.publicKey.toString()
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
