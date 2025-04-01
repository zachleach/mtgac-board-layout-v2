import { Card } from '.'

export const Row = ({ height_p = '100%', width_p = '100%', row_state }) => {

	/* temporary for testing; will become stacks later */
	const scryfall_card_json_arr = row_state.card_arr

	const container_style = {
		border: '1px solid blue',
		overflow: 'visible',
		width: width_p,
		height: height_p,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	if (scryfall_card_json_arr.length == 0) {
		return (
			<div style={container_style}>
				Empty row 
			</div>
		)
	}

	console.log(scryfall_card_json_arr)

	return (
		<div style={container_style}>
			{scryfall_card_json_arr.map((card_json, index) => (
				<Card key={index} scryfall_json={card_json} in_hand={row_state.is_hand===true} />
			))}
		</div>
	)
}
