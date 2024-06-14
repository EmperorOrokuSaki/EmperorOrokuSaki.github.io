
# Building Trill: A TUI Memory Profiler for EVM Using Geth's Debug API

A while back, I randomly saw [this tweet](https://x.com/0xkarmacoma/status/1773385937323786662) and noticed a growing interest in EVM profilers. The timing was perfect—I'd been itching to build something that not only serves the need but does it with a twist: a TUI (terminal user interface) app. TUIs are just cooler and more accessible.

![](https://nimara.xyz/assets/Gandalf.jpg)

Starting off, I needed a catchy name for my Rust project. I settled on [Trill](https://youtu.be/hA7rnjTGgZE) as a placeholder, but it stuck because it's short, memorable, and sort of fits—don't you think?

## Why is this useful?

Visualizing EVM contract execution in real-time helps pinpoint inefficiencies and areas for optimization. I'm pushing towards the first release of [Trill (v0.1)](https://github.com/EmperorOrokuSaki/trill), aiming to make it as intuitive and useful as possible.

## Choosing the TUI crate

After checking out several TUI crates, I landed on [Ratatui](https://github.com/ratatui-org/ratatui). Its solid documentation and flexibility won me over, though [cursive](https://github.com/gyscos/Cursive) was a close second.

## Designing the interface

![](https://nimara.xyz/assets/Trill_overview.gif)

My goal was a clean, uncluttered UI. I thought about what essential information might look like for the user. Here’s what I came up with:

### Memory Slots and Their Status

Colors seemed the best way to communicate the state of each slot—white for untouched slots, green for accessed ones, blue for those being read, and red for active writes. Trill also offers a raw view of the slots that only displays the color coded bytes.

### Transaction Info

Basic yet crucial details like transaction hash, block number, and addresses.

### Active Opcode

Displays the opcode name, its arguments, gas cost, and program counter. To simplify decoding arguments from their hex format and identifying them in the stack, I abstracted this functionality into a [separate crate](https://github.com/EmperorOrokuSaki/opcode-parser). This allows others in the community to reuse and benefit from this specific utility.

### Opcode History

A scrollable log of all executed opcodes.

### Read and Write Charts

Charts illustrating the number of slots that have been written to or read from during the execution.

## Tracing Transactions

Using Geth's debug API, Trill traces execution steps, offering insights into the stack and memory states at any point. Initially, finding a free RPC provider supporting this API was a hassle, so Trill defaults to Anvil's local endpoint unless specified otherwise by the `--rpc` flag.

Here's a typical JSON response from the API:
```json
{
  "failed": false,
  "gas": "0xaff1",
  "returnValue": "0x",
  "structLogs": [
    {
      "depth": 1,
      "gas": 23971,
      "gasCost": 12,
      "memory": [],
      "op": "MSTORE",
      "pc": 4,
      "stack": [
        "0x80",
        "0x40"
      ]
    },
    {
      "depth": 1,
      "gas": 23959,
      "gasCost": 3,
      "memory": [
        "0000000000000000000000000000000000000000000000000000000000000000",
        "0000000000000000000000000000000000000000000000000000000000000000",
        "0000000000000000000000000000000000000000000000000000000000000080"
      ],
      "op": "PUSH1",
      "pc": 5,
      "stack": []
    },
  ]
}
```
The JSON details every step, showing opcode effects on the memory and stack, which is crucial for debugging and optimization. The arguments for each opcode are pulled from the top of the stack, and you can see the effect of each opcode on the memory in the subsequent object. For instance, in the provided JSON example, the MSTORE opcode uses `0x40` as the destination offset and `0x80` as the value.

## CLI 

Settings can be customized via Trill's CLI arguments and options.

```
A TUI memory profiler tool for EVM smart contracts

Usage: trill [OPTIONS] --transaction <TRANSACTION>

Options:
  -t, --transaction <TRANSACTION>  Transaction hash
  -f, --fps <FPS>                  Frames per second [default: 4]
  -i, --iteration <ITERATION>      Operations to process with each frame [default: 1]
  -r, --rpc <RPC>                  The JSON-RPC endpoint URL [default: http://127.0.0.1:8545]
  -h, --help                       Print help
  -V, --version                    Print version
```

## What’s next?

I’m eager to gather feedback from EVM developers to further refine Trill. Some feature ideas that I have been thinking of are:

-   **Side-by-side view:** Comparing two implementations (like mETH vs wETH).
-   **Color differentiation for unwritten slots:** Highlighting unused but written slots.
-   **Stack overview:** Showing the stack's size and contents throughout execution.
-   **Flamegraph support:** Integrating TUI flamegraphs for performance visualization.
-   **Performance enhancements:** As Anvil can be resource-intensive, optimizing to handle heavy loads efficiently is on the agenda. I'm planning on re-writing the [evm-trace](https://github.com/apeworx/evm-trace) library in Rust to enhance this. I'm also exploring the idea of an EVM implementation in Rust that is optimized for tracing.

Feedback is crucial, and I’m looking forward to hearing different views on this. If you want to collaborate on the project feel free to open a discussion post on the repository or reach out to me on [Twitter](https://twitter.com/0xNimaRa) or [Telegram](https://t.me/Emperororokusaki).
