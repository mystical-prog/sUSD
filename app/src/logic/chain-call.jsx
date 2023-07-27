import * as anchor from "@project-serum/anchor";
import idl from "./s_usd.json";
import * as web3 from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const sol_usd_price_account = new anchor.web3.PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");

const nonceAuthKP = web3.Keypair.fromSecretKey(new Uint8Array([229,75,151,149,149,182,138,167,29,196,38,249,151,71,63,12,180,231,8,6,22,151,32,34,154,84,139,115,197,32,170,61,13,91,137,246,12,29,167,216,129,141,250,60,201,31,110,162,204,131,95,241,192,250,96,94,120,52,199,24,43,6,77,234]));

export const createNonce = async (wallet) => {
    const provider = getProvider(wallet);
    if(!provider) {
      throw("Provider is null");
    }
    const nonceKeypair = anchor.web3.Keypair.generate();
    const tx = new web3.Transaction();
    tx.feePayer = nonceAuthKP.publicKey;
    tx.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
    tx.add(
        web3.SystemProgram.createAccount({
          fromPubkey: nonceAuthKP.publicKey,
          newAccountPubkey: nonceKeypair.publicKey,
          lamports: 0.0015 * web3.LAMPORTS_PER_SOL,
          space: web3.NONCE_ACCOUNT_LENGTH,
          programId: web3.SystemProgram.programId,
        }),
        web3.SystemProgram.nonceInitialize({
          noncePubkey: nonceKeypair.publicKey,
          authorizedPubkey: nonceAuthKP.publicKey,
        })
    );
    tx.sign(nonceKeypair, nonceAuthKP);
    const sig = await web3.sendAndConfirmRawTransaction(provider.connection, tx.serialize({requireAllSignatures: false}));
    console.log("Nonces initiated: ", sig);
    let accountInfo = await provider.connection.getAccountInfo(nonceKeypair.publicKey);
    let nonce = web3.NonceAccount.fromAccountData(accountInfo.data);
    return [nonceKeypair.publicKey, nonce.nonce];
}

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
    let temp_cdps = [];
    for(const i in cDPsOnChain) {
      if(cDPsOnChain[i].account.debtor.toBase58() == provider.wallet.publicKey) {
        temp_cdps.push(cDPsOnChain[i]);
      }
    }
    return temp_cdps;
}

export const getSpecificCDP = async (wallet, addr) => {
  const provider = getProvider(wallet);
  if(!provider) {
    throw("Provider is null");
  }
  const temp = JSON.parse(JSON.stringify(idl));
  const program = new anchor.Program(temp, temp.metadata.address, provider);
  const cdp = await program.account.cdp.fetch(addr);
  return cdp;
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

export const createLimitCDP = async (wallet, amount, debtPercent, noncePubKey, nonce, key, signTransaction) => {
    const provider = getProvider(wallet);
    if(!provider) {
      throw("Provider is null");
    }
    const temp = JSON.parse(JSON.stringify(idl));
    const program = new anchor.Program(temp, temp.metadata.address, provider);
    const new_cdp = anchor.web3.Keypair.generate();
    const [solPDA, solPDABump] = anchor.web3.PublicKey.findProgramAddressSync(
        [provider.wallet.publicKey.toBuffer()],
        program.programId
    );
    const ix = program.instruction.createCdp(new anchor.BN(amount * web3.LAMPORTS_PER_SOL), new anchor.BN(debtPercent), {
      accounts : {
        newCdp : new_cdp.publicKey,
        solPda : solPDA,
        signer : provider.wallet.publicKey,
        solUsdPriceAccount : sol_usd_price_account,
        systemProgram : anchor.web3.SystemProgram.programId
      }
    });

    const advanceIX = web3.SystemProgram.nonceAdvance({
        authorizedPubkey: nonceAuthKP.publicKey,
        noncePubkey: noncePubKey
    })

    const tx = new web3.Transaction();
    tx.add(advanceIX);
    tx.add(ix);
    tx.recentBlockhash = nonce;
    tx.feePayer = key;
    tx.sign(nonceAuthKP, new_cdp);
    const signedtx = await signTransaction(tx);
    const serialisedTx = signedtx.serialize({requireAllSignatures: false});
    console.log(serialisedTx);
    return serialisedTx;
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

export const sendDurableTx = async (wallet, rawTx) => {
  const provider = getProvider(wallet);
  if(!provider) {
    throw("Provider is null");
  }
  const sig = await provider.connection.sendRawTransaction(rawTx);
  console.log("Sent durable transaction: ", sig);
}

export const addCollateralTx = async (wallet, amount, cdp) => {
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
  try {
    const tx = await program.methods.addCollateral(new anchor.BN(amount * web3.LAMPORTS_PER_SOL))
    .accounts({
      cdp : cdp,
      signer : provider.wallet.publicKey,
      solPda : solPDA,
      solUsdPriceAccount : sol_usd_price_account,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    alert("Added Collateral - ", tx);
    console.log(tx);
  } catch (error) {
    console.log(error);
    alert(error);
  }
}

export const removeCollateralTx = async (wallet, amount, cdp) => {
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
  try {
    const tx = await program.methods.removeCollateral(new anchor.BN(amount * web3.LAMPORTS_PER_SOL))
    .accounts({
      cdp : cdp,
      signer : provider.wallet.publicKey,
      solPda : solPDA,
      solUsdPriceAccount : sol_usd_price_account,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    alert("Removed Collateral - ", tx);
    console.log(tx);
  } catch (error) {
    console.log(error);
    alert(error);
  }
}

export const issueSUSDTx = async (wallet, amount, cdp) => {
  const provider = getProvider(wallet);
  if(!provider) {
    throw("Provider is null");
  }
  const temp = JSON.parse(JSON.stringify(idl));
  const program = new anchor.Program(temp, temp.metadata.address, provider);
  const [susd, susdBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("susd")],
    program.programId
  );
  const singer_susd = await getOrCreateAssociatedTokenAccount(provider.connection, nonceAuthKP, susd, provider.wallet.publicKey);
  try {
    const tx = await program.methods.issueSusd(new anchor.BN(amount * 1000000), susdBump)
    .accounts({
      cdp : cdp,
      signer : provider.wallet.publicKey,
      susdMint : susd,
      signerSusd : singer_susd.address,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId
    })
    .signers([])
    .rpc();
    alert("Issued SUSD - ", tx);
    console.log(tx);
  } catch (error) {
    console.log(error);
    alert(error);
  }
}