"use client";

import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletConnectControl() {
  const account = useCurrentAccount();

  return (
    <div className="flex items-center gap-2">
      {account && (
        <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-[10px] text-emerald-700 sm:inline-flex">
          {shortenAddress(account.address)}
        </span>
      )}
      <div className="wallet-connect-shell">
        <ConnectButton />
      </div>
    </div>
  );
}
