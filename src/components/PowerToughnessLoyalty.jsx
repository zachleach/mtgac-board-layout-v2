import { util } from '.'

/* not sure how power = '*' works; need to look at that */
/* for now just assume that it's a creature; add planeswalker support in a sec */
export const PowerToughnessLoyalty = ({ scryfall_json, scale_factor, face="front" }) => {

	const power = util.scryfall.json.parse_base_power(scryfall_json, face)
	const toughness = util.scryfall.json.parse_base_toughness(scryfall_json, face)

	/* if power and toughness both not undefined */
	if (power && toughness) {
		const compute_font_size_multiplier = (num_digits) => {
			return num_digits === 2 ? 0.15 : 0.35 / num_digits
		}
		const num_digits = (power + toughness).length
		const font_size = compute_font_size_multiplier(num_digits) * scale_factor

		const container_style = {
			backgroundColor: 'rgba(240, 240, 240, .9)',
			borderRadius: '10%',
			boxShadow: '0px 0px 2% rgba(0, 0, 0, .5)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			whiteSpace: 'nowrap',
			fontFamily: 'belerin',
			fontSize: font_size,
			color: 'rgba(68, 68, 68, 1)',
			fontWeight: 'bold',
		}

		return (
			<div style={container_style}>
				{power}/{toughness}
			</div>
		)
	}

}
