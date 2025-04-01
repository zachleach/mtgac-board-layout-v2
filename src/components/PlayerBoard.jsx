import { Row, PlayerIcon, LibraryGraveyardExile } from '.'
import { sol_ring, three, seven, transform, dfc, adventure, adv_cr, dfc_cr_cr } from '../test_cards'


/**
 * in the end this will have to take a player's board state
 *
 */
export const PlayerBoard = ({ board_state }) => {

	const container_style = {
		overflow: 'hidden',
		height: '100%',
		width: '100%',
	}


	board_state = {
		player_icon: "https://64.media.tumblr.com/3b25d444a456339ccd9c0ebbbf46a042/132daf363c3c8729-16/s1280x1920/61160ca5bbad5b7463dbf82c6157361749825a3e.jpg",
		top_row: {
			card_arr: [seven, dfc_cr_cr]
		},
		left_row: {
			card_arr: []
		},
		right_row: {
			card_arr: [sol_ring]
		},
		hand_row: {
			card_arr: [dfc, transform, adventure, adv_cr, sol_ring],
			is_hand: true,
		},
	}


	return (
		<div style={container_style}>
			{/* creatures */}
			<Row height_p={"33.3%"} row_state={board_state.top_row} />

			<div style={{ display: 'flex', height: "33.3%", flexDirection: 'row' }}>
				{/* lands */}
				<Row height_p={"100%"} row_state={board_state.left_row} />
				{/* player icon */}
				<PlayerIcon icon_src={board_state.player_icon}/>
				{/* artifacts / enchantment */}
				<Row height_p={"100%"} row_state={board_state.right_row} />
			</div>

			<div style={{ display: 'flex', width: '100%', height: "33.3%", flexDirection: 'row' }}>
				<Row width_p={"100%"} row_state={board_state.hand_row} />
			</div>


		</div>
	)

}
