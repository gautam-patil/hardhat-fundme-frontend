import { ethers } from "./ethers-5.6.esm.min.js"
import {abi, contractAddress} from "./constant.js"

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

console.log("Connect")
connectButton.onclick = connect;
fundButton.onclick = fund
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {

	alert("Connect")
	if(typeof window.ethereum !== "undefined"){
		await window.ethereum.request({method: "eth_requestAccounts"})
		connectButton.innerHTML = "Connected!!"
	}else{
		alert("No -metamask")
		connectButton.innerHTML = "Install Metamask !!"
	}
}

//Balance
async function getBalance(){
	if(typeof window.ethereum !== "undefined"){
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const balance = await provider.getBalance(contractAddress)
		console.log("Ethers ", ethers.utils.formatEther(balance))
	}
}

//Fund Function
async function fund(ethAmount){
	alert("Call fund")
	ethAmount = document.getElementById("ethAmount").value
	if(typeof window.ethereum !== "undefined"){
		//provider / connection to the blockchain
		// wallet
		// contract that are we interating
		// ABI and address
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer)

		try{

			const transactionResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount)
			})
			//Listen for tx to be mined
			await listenForTransactionMine(transactionResponse, provider)
			console.log("Done")
		}catch(error){
			console.log(error)
		}
	}
}

function listenForTransactionMine(transactionResponse, provider){
	console.log("Mining ", transactionResponse.hash)

	return new Promise((resolve, reject) => {
		provider.once(transactionResponse.hash, (transactionReceipt) => {
	
			console.log("Completed with ", transactionReceipt.confirmations)
			resolve();
		})
	})
}

async function withdraw() {
	if(typeof window.ethereum !== "undefined"){

		console.log("Withdraww")
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, abi, signer)
		try{
			const transactionResponse = await contract.withdraw();
			await listenForTransactionMine(transactionResponse, provider)
		} catch(e){

			console.log(e)
		}
	}
}