import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SUsd } from "../target/types/s_usd";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

describe("s-usd", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SUsd as Program<SUsd>;

  const w1 = anchor.web3.Keypair.generate();
  const w2 = anchor.web3.Keypair.generate();

  const [solPDA, solPDABump] = anchor.web3.PublicKey.findProgramAddressSync(
    [w1.publicKey.toBuffer()],
    program.programId
  );

  const [susd, susdBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("susd-token")],
    program.programId
  );

  const sol_usd_price_account = new anchor.web3.PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");

  it("Running Tests!!", async () => {
    console.log();
    console.log("Creating a CDP - ")

    const new_cdp = anchor.web3.Keypair.generate();
    // Add your test here.
    const tx = await program.methods.createCdp(new anchor.BN(LAMPORTS_PER_SOL), new anchor.BN(14000))
    .accounts({
      newCdp : new_cdp.publicKey,
      solPda : solPDA,
      susdMint : susd,
      signer : w1.publicKey,
      solUsdPriceAccount : sol_usd_price_account,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    console.log();
    console.log("Done - ", tx);
    console.log();

    const singer_susd = await getOrCreateAssociatedTokenAccount(provider.connection, w1, susd, w1.publicKey);

    const tx2 = await program.methods.issueSusd(new anchor.BN(2000000), susdBump)
    .accounts({
      cdp : new_cdp.publicKey,
      signer : w1.publicKey,
      susdMint : susd,
      signerSusd : singer_susd.address,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    console.log("Issued SUSD - ", tx2);
    console.log();

    const tx3 = await program.methods.removeCollateral(new anchor.BN(LAMPORTS_PER_SOL/10), solPDABump)
    .accounts({
      cdp : new_cdp.publicKey,
      signer : w1.publicKey,
      solPda : solPDA,
      solUsdPriceAccount : sol_usd_price_account,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc()
    console.log("Removed Collateral - ", tx3);
    console.log();

    const tx4 = await program.methods.repaySusd(new anchor.BN(1000000))
    .accounts({
      cdp : new_cdp.publicKey,
      signer : w1.publicKey,
      susdMint : susd,
      signerSusd : singer_susd.address,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    console.log("Repaying SUSD - ", tx4);
    console.log();

    const tx5 = await program.methods.addCollateral(new anchor.BN(LAMPORTS_PER_SOL/10))
    .accounts({
      cdp : new_cdp.publicKey,
      signer : w1.publicKey,
      solPda : solPDA,
      solUsdPriceAccount : sol_usd_price_account,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    console.log("Added Collateral - ", tx5);
    console.log();

    const tx6 = await program.methods.adjustDebtPercent(new anchor.BN(15000))
    .accounts({
      cdp : new_cdp.publicKey,
      signer : w1.publicKey,
      susdMint : susd,
      signerSusd : singer_susd.address,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    console.log("Adjusting Debt Percents - ", tx6);
    console.log();

    const tx7 = await program.methods.closePosition(solPDABump)
    .accounts({
      cdp : new_cdp.publicKey,
      signer : w1.publicKey,
      solPda : solPDA,
      susdMint : susd,
      signerSusd : singer_susd.address,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    console.log("Closing Position ", tx7);
    console.log();
  });
});
