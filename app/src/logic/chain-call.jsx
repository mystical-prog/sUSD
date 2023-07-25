import * as anchor from "@project-serum/anchor";
import idl from "./s_usd.json";
import * as web3 from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";

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