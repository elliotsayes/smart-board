# SmartBoard

## Installation

Prerequisites: node 18, pnpm

- `pnpm install`
- `pnpm run dev` for development, `pnpm run dragbuild` for permaweb deployment (upload dist folder)

## Inspiration

Warp SonAR (https://sonar.warp.cc/) provides an easy way to view the current state of SmartWeave contracts, but lacks the ability to easily visualise and step through the history of changes to the contract state. SmartBoard aims to provide an intuitive way to do exactly this.

## What it does

SmartBoard loads all the contract data, and displays it to the user in a dashboard.
After checking general metadata about the contract, the user is able to filter and select interactions from both a list and a timeline, and see how each interaction affects the contract state. Advanced filtering & linking out to viewblock & warp are available to power users.

## How we built it

All SmartWeave functionality is loaded via the warp-contracts package.

## Challenges we ran into

Computing the entire state history of large contracts with good performance was difficult out of the box with warp-contracts, as it is optimised for only calculating the final state, and has some overhead for each call. Therefore a custom fork was developed (https://github.com/elliotsayes/warp/tree/history) that allows easily evaluating the entire history using a special `evalHistory` method.

## Accomplishments that we're proud of

The killer accomplishment for this project is the dual interface of list + timeline. The two work in tandem to provide an intuitive way to browse the history of interactions. Both required a lot of performance optimisation for very large contracts (8K+ interactions) to keep the UI from stuttering or crashing.

## What we learned

Working with large amounts of data in the browser requires rethinking how to build a responsive App & UI. The first thing to do with a similar project is to make sure the interop between the various components scales with large amounts of data.

## What's next for SmartBoard: Smartweave Contract Interaction History Explorer

When loading the contract, the UI freezes while warp-contracts calculates the state history. To avoid this, the computation can be done in the background via Web Workers (which is already implemented), however warp-contracts is incompatible with that environment. After this issue is fixed (https://github.com/warp-contracts/warp/issues/451), loading will be done seamlessly in the background, keeping the dashboard interactive in the meantime.
In addition, countless enhancements can be made including options for contract evaluation, and more
information about contract errors etc.
