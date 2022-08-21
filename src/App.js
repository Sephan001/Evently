import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import Evently from "./contract/Evently.abi.json";
import CreateEvents from "./components/CreateEvents";
import Events from "./components/Events";

const ERC20_DECIMALS = 18;

const contractAddress = "0x2D940dD7636DEd896AeEF099F6b6c014B5a8e5E2";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
	const [contract, setcontract] = useState(null);
	const [address, setAddress] = useState(null);
	const [kit, setKit] = useState(null);
	const [cUSDBalance, setcUSDBalance] = useState(0);
	const [events, setEvents] = useState([]);

	const connectToWallet = async () => {
		if (window.celo) {
			try {
				await window.celo.enable();
				const web3 = new Web3(window.celo);
				let kit = newKitFromWeb3(web3);

				const accounts = await kit.web3.eth.getAccounts();
				const user_address = accounts[0];

				kit.defaultAccount = user_address;

				await setAddress(user_address);
				await setKit(kit);
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log("Error Occurred");
		}
	};

	useEffect(() => {
		connectToWallet();
	}, []);

	useEffect(() => {
		if (kit && address) {
			getBalance();
		}
	}, [kit, address]);

	useEffect(() => {
		if (contract) {
			getEvents();
		}
	}, [contract]);

	const getBalance = async () => {
		try {
			const balance = await kit.getTotalBalance(address);
			const USDBalance = balance.cUSD
				.shiftedBy(-ERC20_DECIMALS)
				.toFixed(2);
			const contract = new kit.web3.eth.Contract(
				Evently,
				contractAddress
			);
			setcontract(contract);
			setcUSDBalance(USDBalance);
		} catch (error) {
			console.log(error);
		}
	};

	const getEvents = async () => {
		const eventsLength = await contract.methods.getEventsLength().call();
		const _evento = [];
		for (let index = 0; index < eventsLength; index++) {
			let _events = new Promise(async (resolve, reject) => {
				let event = await contract.methods.getEvent(index).call();

				resolve({
					index: index,
					owner: event[0],
					image: event[1],
					theme: event[2],
					location: event[3],
					follow: event[4],
					price: event[5],
					sale: event[6],
					hasFollowed: event[7],
				});
			});
			_evento.push(_events);
		}
		const _events = await Promise.all(_evento);
		setEvents(_events);
	};

	const CreateEvent = async (_image, _theme, _location, price) => {
		const _price = new BigNumber(price)
			.shiftedBy(ERC20_DECIMALS)
			.toString();
		try {
			await contract.methods
				.createEvent(_image, _theme, _location, _price)
				.send({ from: address });
			getEvents();
		} catch (error) {
			console.log(error);
		}
	};

	const followEvent = async (_index) => {
		try {
			await contract.methods.followEvent(_index).send({ from: address });
			getEvents();
			getBalance();
		} catch (error) {
			alert.log(error);
		}
	};

	const unFollowEvent = async (_index) => {
		try {
			await contract.methods
				.unfollowEvent(_index)
				.send({ from: address });
			getEvents();
			getBalance();
		} catch (error) {
			alert.log(error);
		}
	};

	const buyTicket = async (_index) => {
		try {
			const cUSDContract = new kit.web3.eth.Contract(
				IERC,
				cUSDContractAddress
			);

			await cUSDContract.methods
				.approve(contractAddress, events[_index].price)
				.send({ from: address });
			await contract.methods.buyTicket(_index).send({ from: address });
			getEvents();
			getBalance();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<Navbar balance={cUSDBalance} />
			<Events
				events={events}
				buyTicket={buyTicket}
				followEvent={followEvent}
				unFollowEvent={unFollowEvent}
			/>
			<CreateEvents CreateEvent={CreateEvent} />
		</div>
	);
}

export default App;