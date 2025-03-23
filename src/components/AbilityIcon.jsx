

/**
 * TODO: refactor this to take in a scryfall ability keyword and render the corresponding svg
 *
 */
export const AbilityIcon = ({ scryfall_keyword }) => {

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
	console.log(svg_url)

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
