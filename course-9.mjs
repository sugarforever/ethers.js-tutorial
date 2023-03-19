/**
 * This is an example referring to https://github.com/WTFAcademy/WTF-Ethers/blob/main/09_EventFilter/EventFilter.js
 */

import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊网络
// 准备 alchemy API 可以参考https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL04_Alchemy/readme.md 
// const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';

// 本代码在WTF的原始示例代码的基础上替换为如下Infura主网endpoint
const INFURA_MAINNET_URL = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
const provider = new ethers.providers.JsonRpcProvider(INFURA_MAINNET_URL);

// 合约地址
const addressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7'
// 交易所地址
const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60'
// 构建ABI
const abi = [
  "event Transfer(address indexed from, address indexed to, uint value)",
  "function balanceOf(address) public view returns(uint)",
];
// 构建合约对象
const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);


(async () => {
  try {
    // 1. 读取币安热钱包USDT余额
    console.log("\n1. 读取币安热钱包USDT余额")
    const balanceUSDT = await contractUSDT.balanceOf(accountBinance)
    console.log(`USDT余额: ${ethers.utils.formatUnits(ethers.BigNumber.from(balanceUSDT),6)}\n`)

    // 2. 创建过滤器，监听转移USDT进交易所
    console.log("\n2. 创建过滤器，监听转移USDT进交易所")
    let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
    console.log("过滤器详情：")
    console.log(filterBinanceIn);
    contractUSDT.on(filterBinanceIn, (from, to, value) => {
      console.log('---------监听USDT进入交易所--------');
      console.log(
        `${from} -> ${to} ${ethers.utils.formatUnits(ethers.BigNumber.from(value),6)}`
      )
    }).on('error', (error) => {
      console.log(error)
    })

    // 3. 创建过滤器，监听交易所转出USDT
    let filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance, null);
    console.log("\n3. 创建过滤器，监听转移USDT出交易所")
    console.log("过滤器详情：")
    console.log(filterToBinanceOut);
    contractUSDT.on(filterToBinanceOut, (from, to, value) => {
      console.log('---------监听USDT转出交易所--------');
      console.log(
        `${from} -> ${to} ${ethers.utils.formatUnits(ethers.BigNumber.from(value),6)}`
      )
    }
    ).on('error', (error) => {
      console.log(error)
    });
  } catch (e) {
    console.log(e);
  }
})()