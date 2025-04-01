const card_back = './card_back.jpg'

export const LibraryGraveyardExile = ({ board_state }) => {

	const container_style = {
		border: '1px solid red',
		overflow: 'hidden',
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<div style={container_style}>
			<Pile/>
		</div>
	)
}



const Pile = () => {

	const card_container_style = {
		aspectRatio: 745 / 1040,
		border: '1px solid red',
		maxHeight: '90%',
		height: 'auto',
		flex: '0 1 auto',
		margin: '0.25%',
		position: 'relative',
		zIndex: '10',
	}

	const card_image_style = {
		aspectRatio: 745 / 1040,
		height: '100%',
		width: '100%',
		borderRadius: '3.5%',
		objectFit: 'fill',
		display: 'block',
	}

	console.log(card_back)

	return (
		<div style={card_container_style}>
			{/* card image */}
			<img style={card_image_style} 
				src={card_back} 
			/>
		</div>
	)

}
