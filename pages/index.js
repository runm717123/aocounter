import Head from 'next/head';
import { useState } from 'react';

export default function Home({ data }) {
	const [equipmentPrice, setEquipmentPrice] = useState(false);
	const [stonePrice, setStonePrice] = useState(false);

	// const formatCurr = (strNum) => Number(strNum).toLocaleString('en');
	const formatCurr = (strNum) => strNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	const onPriceType = (e, rawNum) => {
		rawNum = formatCurr(rawNum);
		e.target.value = rawNum;
	};

	const onStonePriceChange = (e) => {
		let rawNum = e.target.value.replace(/\D/g, '');
		setStonePrice(rawNum);
		onPriceType(e, rawNum);
	};

	const onEquipmentPriceChange = (e) => {
		let rawNum = e.target.value.replace(/\D/g, '');
		setEquipmentPrice(rawNum);
		onPriceType(e, rawNum);
	};

	const getPrice = (eq, st) => {
		if (!equipmentPrice || !stonePrice) {
			return 'please specify the price';
		}

		const price = st * stonePrice + eq * equipmentPrice;

		return price.toLocaleString('en');
	};

	const onCellClick = (e) => {
		var text = e.target.innerText;
		navigator.clipboard.writeText(text).then(
			function () {
				console.log('Async: Copying to clipboard was successful!');
			},
			function (err) {
				console.error('Async: Could not copy text: ', err);
			}
		);
	};

	return (
		<div className="p-2">
			<Head>
				<title>Equipment level Counter</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="grid grid-cols-10 gap-2 items-center w-full md:w-[45vw]" action="">
				<label className="col-span-3" htmlFor="equipmentPrice">
					Equipment Price
				</label>
				<span className="text-center">:</span>
				<input className="col-span-6 text-right" type="text" name="equipmentPrice" id="equipmentPrice" placeholder="type the equipment price here ..." onChange={onEquipmentPriceChange} />
				<label className="col-span-3" htmlFor="stonePrice">
					Enchant Stones Price
				</label>
				<span className="text-center">:</span>
				<input className="col-span-6 text-right" type="text" name="stonePrice" id="stonePrice" placeholder="type the enchant stone price here ..." onChange={onStonePriceChange} />
				<div className="col-span-3">Cara baca</div>
				<span className="text-center">:</span>
				<div className="col-span-6 text-sm">membutuhkan 2 buah equip polos dan 1 enchant stone untuk membuat equip +1, sehingga total harganya adalah {getPrice(2, 1)}</div>
			</div>

			<table className="mt-10">
				<thead>
					<tr>
						<td className="py-2 px-4">+</td>
						<td className="py-2 px-4">Total Equipment</td>
						<td className="py-2 px-4">Total Enchant Stone</td>
						<td className="py-2 px-4">Total Price</td>
					</tr>
				</thead>
				<tbody>
					{data.map((item, i) => {
						return (
							<tr key={item.stone} className="hover:font-bold" onClick={onCellClick}>
								<td className="py-2 px-4">{++i}</td>
								<td className="py-2 px-4">{item.equipment}</td>
								<td className="py-2 px-4">{item.stone}</td>
								<td className="py-2 px-4">{getPrice(item.equipment, item.stone)}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export async function getStaticProps() {
	const countStonesReq = (lvl) => {
		if (lvl > 1) {
			return lvl + countStonesReq(lvl - 1) * 2;
		}

		return lvl;
	};

	const countEquipmentReq = (lvl) => {
		return 2 ** lvl;
	};

	const maxLvl = 11;
	const priceList = [];
	for (let i = 1; i <= maxLvl; i++) {
		priceList.push({ equipment: countEquipmentReq(i), stone: countStonesReq(i) });
	}

	return {
		props: { data: priceList },
	};
}
