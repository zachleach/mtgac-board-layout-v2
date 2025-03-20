import './App.css'

const card_url = 'https://cards.scryfall.io/large/front/1/a/1a8c02ab-6348-4b04-8ce0-b36309a14a5e.jpg?1689995694'
const crop_url = 'https://cards.scryfall.io/art_crop/front/1/a/1a8c02ab-6348-4b04-8ce0-b36309a14a5e.jpg?1689995694'
const cardback_url = 'https://i.imgur.com/LdOBU1I.jpeg'

const Card = ({ url = card_url }) => {
	const container_style = {
		aspectRatio: 745 / 1040,
		border: '1px solid red',
		maxHeight: '90%',
		height: 'auto',
		overflow: 'hidden',
		flex: '0 1 auto',
		margin: '0.25%',
	}

	const image_style = {
		height: '100%',
		width: '100%',
		borderRadius: '3.5%',
		objectFit: 'cover',
	}

	return (
		<div style={container_style}>
			<img style={image_style}
				src={url}
			/>
		</div>
	)
}


const PlayerBoard = ({ height_p }) => {

	const container_style = {
		border: '1px solid green',
		overflow: 'hidden',
		height: height_p,
		width: '100%',
	}


	return (
		<div style={container_style}>
			<Row height_p={"33.3%"}/>

			<div style={{ display: 'flex', height: "33.3%", flexDirection: 'row' }}>
				<Row height_p={"100%"}/>
				<PlayerIcon />
				<Row height_p={"100%"}/>
			</div>

			{/* hand row */}
			<div style={{ display: 'flex', height: "33.3%", flexDirection: 'row' }}>
				<LibraryGraveyardExile width_p={'30%'}/>

				{/* hand itself */}
				<Row width_p={"60%"}/>

				<div style={{ width: '30%', border: '1px solid red'}}>
					Empty
				</div>
			</div>


		</div>
	)

}


const LibraryGraveyardExile = ({ height_p = '100%', width_p = '100%' }) => {
	const container_style = {
		border: '1px solid red',
		overflow: 'hidden',
		width: width_p,
		height: height_p,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<div style={container_style}>
			<Card url={cardback_url}/>
			<Card url={cardback_url}/>
			<Card url={cardback_url}/>
		</div>
	)
}


const PlayerIcon = ({ width_p }) => {

	const container_style = {
		border: '1px solid red',
		overflow: 'hidden',
		height: '100%',
		flexShrink: 0,
		aspectRatio: 1
	}

	/* rounded image */
	const image_style = {
		height: '100%',
		width: '100%',
		borderRadius: '50%',
		objectFit: 'cover',
	}

	return (
		<div style={container_style}>
			<img style={image_style} 
				src={'https://i.pinimg.com/236x/a8/6b/07/a86b07a7a05700c97d39768c016cd6c6.jpg'}
			/>
		</div>
	)
}



const OpponentBoard = ({ height_p }) => {

	const container_style = {
		border: '1px solid green',
		overflow: 'hidden',
		width: '100%',
		height: height_p
	}

	return (
		<div style={container_style}>

			{/* hand row */}
			<div style={{ display: 'flex', height: "20%", flexDirection: 'row' }}>
				<div style={{ width: '30%', border: '1px solid red'}}>
					Empty
				</div>

				{/* hand itself */}
				<Row width_p={"60%"}/>

				<LibraryGraveyardExile width_p={'30%'}/>
			</div>



			<div style={{ display: 'flex', height: "30%", flexDirection: 'row' }}>
				<Row height_p={"100%"}/>
				<PlayerIcon />
				<Row height_p={"100%"}/>
			</div>

			{/* opponent creature row same height as player creature row (50% of 40% is 20% === 33.3% of 60%) */}
			<Row height_p={"50%"}/>
		</div>
	)

}


const Row = ({ height_p = '100%', width_p = '100%', children }) => {
	const container_style = {
		border: '1px solid blue',
		overflow: 'hidden',
		width: width_p,
		height: height_p,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<div style={container_style}>
			<Card url={card_url}/>
			<Card url={card_url}/>
			<Card url={card_url}/>
			<Card url={card_url}/>
		</div>
	)
}


const App = () => {
	return (
		<div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
			<div style={{ height: '40%', display: 'flex', flexDirection: 'row' }}>
				<OpponentBoard height_p={'100%'}/>
				<OpponentBoard height_p={'100%'}/>
			</div>
			<PlayerBoard height_p={'60%'}/>
		</div>
	)
}

export default App
