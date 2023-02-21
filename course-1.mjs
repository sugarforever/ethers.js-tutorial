/**
 * This is an example referring to https://github.com/WTFAcademy/WTF-Ethers/tree/main/01_HelloVitalik
 */

import { ethers } from "ethers";
const provider = ethers.getDefaultProvider();
const main = async () => {
    const balance = await provider.getBalance(`vitalik.eth`);
    console.log(`ETH Balance of vitalik: ${ethers.utils.formatEther(balance)} ETH`);
}
main()