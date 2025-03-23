

export const Row = ({ height_p = '100%', width_p = '100%', scryfall_card_json_arr }) => {
	const container_style = {
		border: '1px solid blue',
		overflow: 'hidden',
		width: width_p,
		height: height_p,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	if (!scryfall_card_json_arr) {
		return (
			<div style={container_style}>
				Empty row 
			</div>
		)
	}

	return (
		<div style={container_style}>
			{scryfall_card_json_arr.map((card_json, index) => (
				<Card key={index} scryfall_json={card_json} />
			))}
		</div>
	)
}
