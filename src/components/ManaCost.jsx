import { util } from '.'

const ManaIcon = ({ tailwind, scale_factor }) => {

	const size = .12 * scale_factor

	const container_style = {
		fontSize: size,
		margin: '0 1px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}

	return (
		<i style={container_style} 
			className={tailwind}> 
		</i>
	)
}

const Slash = ({ scale_factor }) => {

	const size = .25 * scale_factor

	const container_style = {
		fontSize: size,
		fontFamily: 'belerin',
		color: 'red',
		position: 'absolute',
		transform: 'translateY(2%) translateX(-2%)'
	}

	return (
		<div style={container_style}> / </div>
	)
}


export const ManaCost = ({ scryfall_json, scale_factor, face="front" }) => {

	const container_style = {
		display: 'flex',
		justifyContent: 'flex-end',			/* expand left, not right */
		gap: `${scale_factor / 32}px`
	}

	const mana_cost_style = {
		display: 'flex',
		height: 'auto',
		width: 'auto',
		alignItems: 'center', 
		justifyContent: 'center', 
	}


	const { front, back } = util.scryfall.json.parse_mana_cost_expr(scryfall_json)
	const front_mana_cost_tailwind_str_arr = front ? util.andrew_gioia.scryfall_mana_cost_expr_to_tailwind_str_arr(front) : []
	const back_mana_cost_tailwind_str_arr = back ? util.andrew_gioia.scryfall_mana_cost_expr_to_tailwind_str_arr(back) : []

	if (face !== 'front') {
		return (
			<>
			</>
		)
	}


	return (
		<div style={container_style}>
			<div style={mana_cost_style}>
				{front_mana_cost_tailwind_str_arr.map((tailwind_str, index) => (
					<ManaIcon key={index} tailwind={tailwind_str} scale_factor={scale_factor} />
				))}
			</div>
			{back && (
				<>
					<div style={mana_cost_style}>
						<Slash scale_factor={scale_factor} />
					</div>
					<div style={mana_cost_style}>
						{back_mana_cost_tailwind_str_arr.map((tailwind_str, index) => (
								<ManaIcon key={index} tailwind={tailwind_str} scale_factor={scale_factor} />
						))}
					</div>
				</>
			)}
		</div>
	)

}
