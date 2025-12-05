import { getUmi } from "../config/solana";
import {
  createNft,
  createV1,
  mintV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import "dotenv/config";

async function main() {
  const umi = getUmi();

  console.log("Minting Korbski Labs Supporter test NFT on devnet...");

  // Where this NFT's metadata JSON lives (devnet test)
  const uri =
    process.env.SUPPORTER_METADATA_URI ||
    "https://example.com/supporter-template.json";

  // The mint account (new NFT)
  const mint = generateSigner(umi);

  // Create NFT with on-chain metadata
  const builder = createNft(umi, {
    mint,
    name: "Korbski Labs Supporter #TEST",
    symbol: "KLSUP",
    uri, // points to JSON metadata
    sellerFeeBasisPoints: percentAmount(5, 2), // 5%
    tokenStandard: TokenStandard.NonFungible,
    isMutable: true,
  });

  await builder.sendAndConfirm(umi);

  console.log("Minted NFT with mint address:", mint.publicKey.toString());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
