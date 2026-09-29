import { JsonRpcProvider, parseEther } from 'ethers';

const chainId = 91562037;
let provider;

export function isValidTmstcPrice(value) {
  const price = Number(value);
  return Number.isFinite(price)
    && price >= 0.000001
    && price <= 1_000_000
    && Math.abs(price * 1_000_000 - Math.round(price * 1_000_000)) < 0.000001;
}

export async function verifyDirectTmstcPayment(txHash, buyerWallet, sellerWallet, price) {
  if (!/^0x[0-9a-fA-F]{64}$/.test(String(txHash || ''))) {
    throw Object.assign(new Error('Provide the confirmed MST Testnet payment transaction hash.'), { status: 400 });
  }
  provider ??= new JsonRpcProvider(process.env.MST_RPC_URL || 'https://testnetrpc.mstblockchain.com', chainId);

  let transaction;
  let receipt;
  try {
    [transaction, receipt] = await Promise.all([
      provider.getTransaction(txHash),
      provider.getTransactionReceipt(txHash),
    ]);
  } catch {
    throw Object.assign(new Error('Could not verify the payment on MST Testnet. Retry after the network responds.'), { status: 503 });
  }

  if (!transaction || !receipt || receipt.status !== 1) {
    throw Object.assign(new Error('The payment is not confirmed on MST Testnet.'), { status: 409 });
  }
  if (Number(transaction.chainId) !== chainId
    || transaction.from.toLowerCase() !== buyerWallet.toLowerCase()
    || !transaction.to
    || transaction.to.toLowerCase() !== sellerWallet.toLowerCase()
    || transaction.value !== parseEther(String(price))) {
    throw Object.assign(new Error('The transaction does not match this buyer, seller, and tMSTC amount.'), { status: 400 });
  }
  return receipt;
}
