import { util } from '.'



/**
 * flex row that renders ability icons within a scryfall_json object for a given card face
 * notes: items start from the left 
 *
 */
export const AbilityIconRow = ({ scryfall_json, face="front" }) => {

	const scryfall_ability_str_arr = util.scryfall.json.parse_ability_keywords(scryfall_json, face)

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

/**
 * given a scryfall keyword string, renders an svg image for an ability keyword 
 *
 */
const AbilityIcon = ({ scryfall_keyword }) => {

	const ability_to_icon_map = {
		'Menace': './icons/ability-menace.svg',
		'Lifelink': './icons/ability-lifelink.svg',
		'Reach': './icons/ability-reach.svg',
		'Vigilance': './icons/ability-vigilance.svg',
		'First strike': './icons/ability-firststrike.svg',
		'Double strike': './icons/ability-doublestrike.svg',
		'Trample': './icons/ability-trample.svg',
		'Ward': './icons/ability-ward.svg',
		'Deathtouch': './icons/ability-deathtouch.svg',
		'Defender': './icons/ability-defender.svg',
		'Indestructable': './icons/ability-indestructable.svg',
		'Flying': './icons/ability-flying.svg',
		'Hexproof': './icons/ability-hexproof.svg',
		'Haste': './icons/ability-haste.svg',
		'Tap': './icons/ability-tap.svg',
	}

	const svg_url = ability_to_icon_map[scryfall_keyword]

	const icon_style = {
		width: '25%',
		aspectRatio: 1,
		backgroundColor: 'rgba(240, 240, 240, .9)',
		boxShadow: '0px 0px 2% rgba(0, 0, 0, .5)',
		borderRadius: '10%',
	}

	return (
		<img style={icon_style}
			src={svg_url}
		/>
	)
}
