
# On Internet Computer's Native Integration with Ethereum

Since I joined [Code & State](https://www.codeandstate.com/) in early May, I've been diving deep into the so-called [chain fusion](https://internetcomputer.org/chainfusion), more specifically the IC<>ETH integration. After banging my head against the wall for a bit of time, I figured it out and got it running. In this post, I'm sharing my experience with the IC<>EVM integration for anyone interested in the tech and to hopefully help others who might face the same challenges I did.

## Why care about this at all?

> "Just because I don't care doesn't mean I don't understand."
>  – Homer Simpson

TL;DR: Fast, cheap, on-chain computation and storage for EVM smart contracts, what's there not to like? 

The Internet Computer Protocol (ICP) aims to position itself as an EVM sidechain, rather than just another Layer 1 blockchain. There's not much use for isolated blockchain networks these days. This integration uses JSON-RPC API calls through the HTTPS outcalls feature, meaning you can interact with the EVM however you like.

## Choosing tools

Since November 2022, I had not written any IC canisters, so I had a bit of catching up to do with the latest updates. I prefer writing my code in Rust for a multitude of reasons, even though I like Motoko. Previously the Rust crate `ic-kit` which we had created as Psychedelic provided a layer of enhancement to the interface of the `ic-cdk` crate developed by DFINITY. This included features that provided mock testing interfaces in Rust and macros that helped with abstraction of repetetive logic. It was a pleasant surprise to see that the `canister-sdk` by Bitfinity picked up the task where we left off! So I decided to use the `canister-sdk` crate for now.
Some bits of their documentation is out-dated but I may submit a PR for that, but anyone else is welcome to do so as well.
Other than that, there's not much to dwell on. My preferred RPC provider is Alchemy for no special reason other than my experience with it.

## Getting started with chainfusion

Logically the first step to follow was checking the official docs. The docs provide a good overview of how the integration works and can be used, but some bits of the docs are hard to follow as the code snippets included in [this section](https://internetcomputer.org/docs/current/developer-docs/multi-chain/ethereum/evm-rpc/evm-rpc-canister) are not complete. Like the types that I needed to interact with the canister are not a part of the sdk and it wasn't mentioned in the documentation where I could find the code for that, so I had to go to the canister's repository and get it from there.
The [starter template](https://github.com/letmejustputthishere/chain-fusion-starter) built by [Moritz](https://twitter.com/cryptoschindler) was a great help in this phase and provided almost all the types that I needed in [this file](https://github.com/letmejustputthishere/chain-fusion-starter/blob/main/src/chain_fusion_backend/src/evm_rpc.rs).

## How does it work?
![IC-EVM Diagram](https://nimara.xyz/assets/IC-EVM.png)

In short, IC canisters can make inter-canister calls to the EVM RPC canisters. The calls should contain the RPC request payload including the JSON hex encoded parameters and can be made to the smart contract canister's preffered RPC provider.

Important note: The execution is replicated by every node in the subnet, thus resulting in a multitude of calls being made to each selected RPC provider. If using private RPCs, make sure you understand the rate limitation of your provider.

## RPC Canisters

The DFINITY foundation has deployed three EVM RPC canisters, two on Fiduciary subnets and one on a standard subnet:

- `7hfb6-caaaa-aaaar-qadga-cai`: Production RPC canister on a Fiduciary subnet
- `xhcuo-6yaaa-aaaar-qacqq-cai`: Test RPC canister on a Fiduciary subnet
- `a6d44-nyaaa-aaaap-abp7q-cai`: Test RPC canister on a standard subnet 

Note: the standard subnet here has 13 nodes and the Fiduciary subnets have 28 nodes. Using the Fiduciary subnet results in more security as each request is replicated 15 more times. If you don't care much for that, there should not be a serious problem with using the standard subnet test canister in your production environment.

**What happens if I run my own EVM RPC canister?**

The source code of these canisters has been made [public](https://github.com/internet-computer-protocol/evm-rpc-canister) by the foundation. So, I had the idea of deploying my own rpc canister just to see if it's going to be usable and weigh the advantagous of using one's own canister.

Well, it seems like it's possible to run your own EVM RPC canister as it uses the HTTPS outcalls feature under the hood and there's no secret magic. With running your own canister you can add your own providers using the `registerProvider` method.

## Signature

In order to send a raw signed transaction, you need to generate the private key for your canister. The great thing about chainfusion is that you can generate your canister's signature on-chain without any need for a trusted setup, actually this is the core of IC's security. If you're interested more about the details of the key generation and how it works in larger scale of the IC network such as generating the key for subnet nodes, I recommend watching [this video](https://www.youtube.com/watch?v=vUcDRFC09J0) (I highly recommend it!)

## Alloy and Ethers dependencies

There is a great issue with the `ethers-rs` crate that is used to interact with Ethereum types and functions, as it is being deprecated soon in favor of the `alloy-rs` package. There are several reasons for this but it may be summarized as `ethers-rs` being bloated and inconsistent while `alloy-rs` aims at fixing this by providing lean and more efficient solutions. Both crates are being developed by Paradigm and I am an active open-source contributor to them (yay! but not yay because issues!)
In the starter kit and docs the `ethers-rs` crate is used and this causes problems as many helper functions are missing there + the documention of ethers is not good at all. So I decided to use alloy and everything was well, until I tried to deploy my canister.

The deployment failed and I had to write a forum post about it. The DFINITY team was very fast with responding to it and helping me uncover the issue. It turns out alloy uses a dependency that is in conflict with the WASM that the ICP accepts:
![](https://nimara.xyz/assets/WASM_BINDGEN_RESP.png)

So, I just decided to write the encoding/decoding of the hex data manually myself and keep the other alloy features that did not have the same issue.

## Performance metrics

I decided to use a custom RPC provider (Alchemy) so that I could access the logs of each request regardless of failure or success for debugging purposes and I recommend everyone to do this at least in the development phase.

