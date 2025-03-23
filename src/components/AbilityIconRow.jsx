import { AbilityIcon, util } from '.'

export const AbilityIconRow = ({ scryfall_json, face="front" }) => {

	console.log('face:', face)
	const scryfall_ability_str_arr = util.scryfall.json.parse_ability_keywords(scryfall_json, face)
	console.log(scryfall_ability_str_arr)

	const container_style = {
		width: '100%',
		display: 'flex',
		gap: '2%',
		alignItems: 'flex-start',
	}

	if (!scryfall_ability_str_arr) {
		return (
			<>
			</>
		)
	}

	return (
		<div style={container_style}>
			{scryfall_ability_str_arr.map((ability_str, index) => (
				<AbilityIcon key={index} scryfall_keyword={ability_str} />
			))}
		</div>
	)
}
