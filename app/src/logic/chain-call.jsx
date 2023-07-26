import * as anchor from "@project-serum/anchor";
import idl from "./s_usd.json";
import * as web3 from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";

const sol_usd_price_account = new anchor.web3.PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");

export const getProvider = (wallet) => {

    if(!wallet) {
        return null;
    }
    const network = "https://api.devnet.solana.com";
    const connection = new web3.Connection(network, "processed");

    const provider = new anchor.AnchorProvider(
        connection, wallet, {"preflightCommitment" : "processed"},
    )
    return provider;
}

export const getCDPsOnChain = async (wallet) => {
    const provider = getProvider(wallet);
    if(!provider) {
      throw("Provider is null");
    }
    const temp = JSON.parse(JSON.stringify(idl));
    const program = new anchor.Program(temp, temp.metadata.address, provider);
    const cDPsOnChain = await program.account.cdp.all();
    return cDPsOnChain;
}

export const createSOLPDA = async (wallet) => {
    const provider = getProvider(wallet);
    if(!provider) {
      throw("Provider is null");
    }
    const temp = JSON.parse(JSON.stringify(idl));
    const program = new anchor.Program(temp, temp.metadata.address, provider);
    const [solPDA, solPDABump] = anchor.web3.PublicKey.findProgramAddressSync(
        [provider.wallet.publicKey.toBuffer()],
        program.programId
    );
    const tx = await program.methods.createSolPda()
    .accounts({
        signer : provider.wallet.publicKey,
        solPda : solPDA,
        systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
}

export const createCDP = async (wallet, amount, debtPercent) => {
    const provider = getProvider(wallet);
    if(!provider) {
      throw("Provider is null");
    }
    const temp = JSON.parse(JSON.stringify(idl));
    const program = new anchor.Program(temp, temp.metadata.address, provider);
    const cdp_program = anchor.web3.Keypair.generate();
    const [solPDA, solPDABump] = anchor.web3.PublicKey.findProgramAddressSync(
        [provider.wallet.publicKey.toBuffer()],
        program.programId
    );
    try {
        const tx = await program.methods.createCdp(new anchor.BN(amount * web3.LAMPORTS_PER_SOL), new anchor.BN(debtPercent))
        .accounts({
          newCdp : cdp_program.publicKey,
          solPda : solPDA,
          signer : provider.wallet.publicKey,
          solUsdPriceAccount : sol_usd_price_account,
          systemProgram : anchor.web3.SystemProgram.programId
        })
        .signers([cdp_program])
        .rpc();
        console.log("Created CDP - ", tx);
        alert("CDP created successfully!");
    } catch (error) {
        console.log(error);
        alert(error);
    }
}   