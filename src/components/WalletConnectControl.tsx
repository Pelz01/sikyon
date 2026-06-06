"use client";

import { ConnectButton } from "@mysten/dapp-kit";

export default function WalletConnectControl() {
  return (
    <div className="wallet-connect-shell">
      <ConnectButton connectText="Connect Wallet" />
    </div>
  );
}
