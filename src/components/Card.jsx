import { ManaCost, LibraryGraveyardExile, AbilityIconRow, PowerToughnessLoyalty, util } from '.'
import { useRef, useState, useEffect } from 'react'

export const Card = ({ scryfall_json, in_hand }) => {

	const [face, set_face] = useState('front')

	/* keep track of card width in pixels for child components that need it as a scale factor */
	const ref = useRef(null)
	const [card_width, set_card_width] = useState(0)

	useEffect(() => {
		const update_size = () => {
			if (ref.current) {
				set_card_width(ref.current.offsetWidth)
			}
		}

		/* on mount setup resize observer */
		const resize_observer = new ResizeObserver(update_size)
		if (ref.current) {
			resize_observer.observe(ref.current)
		}

		/* unmount remove observer */
		return () => {
			if (ref.current) {
				resize_observer.unobserve(ref.current)
			}
			resize_observer.disconnect()
		}

	}, [])

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

	if (in_hand) {
		const mana_cost_positioning = {
			position: 'absolute',
			right: '-2.5%',
			top: '-10%',
			height: 'auto',
			width: 'auto',
			boxShadow: '0px 0px 5% rgba(0, 0, 0, 1)',
		}

		return (
			<div ref={ref} style={card_container_style}>
				{/* card image */}
				<img style={card_image_style} 
					src={util.scryfall.json.parse_img_url(scryfall_json, face)} 
				/>

				{/* mana cost for in hand cards */}
				<div style={mana_cost_positioning}>
					<ManaCost scryfall_json={scryfall_json} scale_factor={card_width} face={face} />
				</div>
			</div>
		)
	}

	else {

		/* flex row for rendering an array of growing/shrinking icons */
		const ability_icon_row_positioning = {
			position: 'absolute',
			display: 'flex',
			width: '68%',
			bottom: '1.5%',
			left: '2%',
		}

		const power_toughness_loyality_positioning = {
			position: 'absolute',
			right: '2%',
			bottom: '2%',
			width: '26%',
			height: '12%',
		}

		return (
			<div ref={ref} style={card_container_style}>
				{/* card image */}
				<img style={card_image_style} 
					src={util.scryfall.json.parse_img_url(scryfall_json, face)} 
				/>

				{/* ability icons */}
				<div style={ability_icon_row_positioning}>
					<AbilityIconRow scryfall_json={scryfall_json} face={face}/>
				</div>

				{/* power/toughness, loyality, or none */}
				<div style={power_toughness_loyality_positioning}>
					<PowerToughnessLoyalty scryfall_json={scryfall_json} scale_factor={card_width} face={face} />
				</div>

			</div>
		)
	}
}

