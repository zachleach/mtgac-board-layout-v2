import { Row, LibraryGraveyardExile, PlayerIcon } from '.'
import { sol_ring, three, seven, transform, dfc } from '../test_cards'

export const OpponentBoard = ({ board_state, width_p='100%' }) => {

	const container_style = {
		overflow: 'hidden',
		width: width_p,
		height: '100%',
	}

	board_state = {
		player_icon: "https://i.pinimg.com/564x/4f/1c/14/4f1c14fc86134a9c8b8c1b7fd30e927a.jpg",
		top_row: {
			card_arr: [three, seven]
		},
		left_row: {
			card_arr: []
		},
		right_row: {
			card_arr: [sol_ring]
		},
		hand_row: {
			card_arr: [dfc],
			is_hand: true,
		},
	}

	return (
		<div style={container_style}>

			{/* hand row */}
			<div style={{ display: 'flex', height: "20%", flexDirection: 'row' }}>
				{/* hand itself */}
				<Row width_p={"100%"} row_state={board_state.hand_row} />
			</div>

			<div style={{ display: 'flex', height: "30%", flexDirection: 'row' }}>
				{/* artifacts / enchantments  */}
				<Row height_p={"100%"} row_state={board_state.right_row} />
				{/* player icon */}
				<PlayerIcon icon_src={board_state.player_icon}/>
				{/* lands  */}
				<Row height_p={"100%"} row_state={board_state.left_row} />
			</div>

			{/* opponent creature row same height as player creature row (50% of 40% is 20% === 33.3% of 60%) */}
			<Row height_p={"50%"} row_state={board_state.top_row} />
		</div>
	)

}


