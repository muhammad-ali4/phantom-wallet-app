import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export const getBalance = async (pubKey) => {
  try {
    let connection = new Connection(clusterApiUrl("devnet"));
    let walletPublicKey = new PublicKey(pubKey);
    let bal = await connection.getBalance(walletPublicKey);
    let lamportBalance = bal / LAMPORTS_PER_SOL;
    return lamportBalance;
  } catch (err) {
    throw err;
  }
};
