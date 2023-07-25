import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SUsd } from "../target/types/s_usd";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import * as web3 from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

describe("s-usd", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SUsd as Program<SUsd>;

  const w1 = web3.Keypair.fromSecretKey(new Uint8Array([229,75,151,149,149,182,138,167,29,196,38,249,151,71,63,12,180,231,8,6,22,151,32,34,154,84,139,115,197,32,170,61,13,91,137,246,12,29,167,216,129,141,250,60,201,31,110,162,204,131,95,241,192,250,96,94,120,52,199,24,43,6,77,234]));
  
  const w2 = anchor.web3.Keypair.generate();

  const [solPDA, solPDABump] = anchor.web3.PublicKey.findProgramAddressSync(
    [w1.publicKey.toBuffer()],
    program.programId
  );

  const [susd, susdBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("susd")],
    program.programId
  );

  const sol_usd_price_account = new anchor.web3.PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");

  const new_cdp = new anchor.web3.PublicKey("2f5gnoJzyxWKp4qGFAGRyFDrhNdECRLQWdgsXcnbs3Pq");

  it("Running Tests!!", async () => {
    const singer_susd = await getOrCreateAssociatedTokenAccount(provider.connection, w1, susd, w1.publicKey);
    try {
    // Add your test here.
/*    console.log("Creating a CDP - ")

    const tx = await program.methods.createCdp(new anchor.BN(LAMPORTS_PER_SOL), new anchor.BN(15000))
    .accounts({
      newCdp : new_cdp.publicKey,
      solPda : solPDA,
      signer : w1.publicKey,
      solUsdPriceAccount : sol_usd_price_account,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([w1, new_cdp])
    .rpc();
    console.log();
    console.log("Done - ", tx);
    console.log();

    const tx2 = await program.methods.issueSusd(new anchor.BN(5500000), susdBump)
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

    const tx3 = await program.methods.removeCollateral(new anchor.BN((LAMPORTS_PER_SOL) /10))
    .accounts({
      cdp : new_cdp,
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

    const tx6 = await program.methods.adjustDebtPercent(new anchor.BN(14000))
    .accounts({
      cdp : new_cdp,
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
*/
    const [list, listBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [new_cdp.toBuffer()],
      program.programId
    );

    const tx7 = await program.methods.liquidatePosition()
    .accounts({
      cdp : new_cdp,
      signer : w1.publicKey,
      solPda : solPDA,
      susdMint : susd,
      signerSusd : singer_susd.address,
      solUsdPriceAccount : sol_usd_price_account,
      listing : list,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    console.log("Liquidating Position ", tx7);
    console.log();
    } catch (error) {
      console.log(error);
    }
  });
});
