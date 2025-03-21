import './App.css'
import 'mana-font/css/mana.css'
import { useRef, useState, useEffect } from 'react'

const card_url = 'https://cards.scryfall.io/large/front/1/a/1a8c02ab-6348-4b04-8ce0-b36309a14a5e.jpg?1689995694'
const crop_url = 'https://cards.scryfall.io/art_crop/front/1/a/1a8c02ab-6348-4b04-8ce0-b36309a14a5e.jpg?1689995694'
const sire_seven = 'https://cards.scryfall.io/large/front/1/b/1b486b75-4680-4a94-af8c-c1c335c9782b.jpg?1730489690'
const cardback_url = 'https://i.imgur.com/LdOBU1I.jpeg'


const PowerToughness = ({ p = '99', t = '9', scale_factor }) => {

	const compute_font_size_multiplier = (num_digits) => {
		return num_digits === 2 ? 0.15 : 0.35 / num_digits
	}
	const num_digits = (p + t).length
	const font_size = compute_font_size_multiplier(num_digits) * scale_factor

	const container_style = {
		position: 'absolute',
		right: '2%',
		bottom: '2%',
		width: '26%',
		height: '12%',
		backgroundColor: 'rgba(240, 240, 240, .9)',
		borderRadius: '10%',
    boxShadow: '0px 0px 2% rgba(0, 0, 0, .5)',
		zIndex: 2,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		outline: '1px solid rgba(240, 240, 240, 1)',
		whiteSpace: 'nowrap',

		fontFamily: 'belerin',
		fontSize: font_size,
		color: 'rgba(68, 68, 68, 1)',
		fontWeight: 'bold',
	}

	return (
		<div style={container_style}>
			{p}/{t}
		</div>
	)
}


const AndrewGioia = ({ tailwind, scale_factor }) => {

	const size = 0.15 * scale_factor

	const container_style = {
		fontSize: size,
	}

	return (
			<i style={container_style} 
				className={tailwind}>
			</i>
	)
}



/**
 * TODO: 
 * refactor power, toughness, mana symbols, and abilitiy icons to be pulled from scryfall data (combine props into a card_info object prop)
 * refactor mana symbols to only be displayed when card is in-hand
 *
 *
 */
const Card = ({ img_url = card_url, abilities, power, toughness, mana }) => {

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


	const container_style = {
		aspectRatio: 745 / 1040,
		border: '1px solid red',
		maxHeight: '90%',
		height: 'auto',
		flex: '0 1 auto',
		margin: '0.25%',
		position: 'relative',
	}

	const card_image_style = {
		height: '100%',
		width: '100%',
		borderRadius: '3.5%',
		objectFit: 'cover',
	}

	/* flex row for rendering an array of growing/shrinking icons */
	const icon_row_style = {
		position: 'absolute',
		display: 'flex',
		width: '68%',
		bottom: '2%',
		left: '2%',
		gap: '2%',
		alignItems: 'flex-start',
	}

	return (
		<div ref={ref} style={container_style}>
			<img style={card_image_style}
				src={img_url}
			/>

			{/* https://mana.andrewgioia.com/attributes.html */}
			<div style={{ display: 'flex', position: 'absolute', top: '-3%', right: '-4.5%', gap: '2%'}}>
				<AndrewGioia scale_factor={card_width} tailwind={'ms ms-wu ms-cost ms-shadow'}/>
				<AndrewGioia scale_factor={card_width} tailwind={'ms ms-2b ms-cost ms-shadow'}/>
				<AndrewGioia scale_factor={card_width} tailwind={'ms ms-u ms-cost ms-shadow'}/>
			</div>

			<div style={icon_row_style}>
				<AbilityIcon svg_url={'./ability-trample.svg'} l={`${2 + (15 + 2) * 3}%`}/>
				<AbilityIcon svg_url={'./ability-trample.svg'} l={`${2 + (15 + 2) * 3}%`}/>
				<AbilityIcon svg_url={'./ability-trample.svg'} l={`${2 + (15 + 2) * 3}%`}/>
			</div>

			<PowerToughness scale_factor={card_width}/>
		</div>
	)
}




/**
 * TODO: refactor this to take in a scryfall ability keyword and render the corresponding svg
 *
 */
const AbilityIcon = ({ svg_url }) => {

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





const PlayerBoard = ({ height_p, icon_src }) => {

	const container_style = {
		border: '1px solid green',
		overflow: 'hidden',
		height: height_p,
		width: '100%',
	}


	return (
		<div style={container_style}>
			<Row height_p={"33.3%"}/>

			<div style={{ display: 'flex', height: "33.3%", flexDirection: 'row' }}>
				<Row height_p={"100%"}/>
				<PlayerIcon icon_src={icon_src}/>
				<Row height_p={"100%"}/>
			</div>

			{/* hand row */}
			<div style={{ display: 'flex', height: "33.3%", flexDirection: 'row' }}>
				<LibraryGraveyardExile width_p={'30%'}/>

				{/* hand itself */}
				<Row width_p={"60%"}/>

				<div style={{ width: '30%', border: '1px solid red'}}>
					Spell Stack
				</div>
			</div>


		</div>
	)

}



const PlayerIcon = ({ health = "20", icon_src }) => {

	const ref = useRef(null)
	const [icon_width, set_icon_width] = useState(0)


	useEffect(() => {
		const update_size = () => {
			if (ref.current) {
				set_icon_width(ref.current.offsetWidth)
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

	const scale_factor = icon_width
	const compute_font_size_multiplier = (num_digits) => {
		return num_digits <= 2 ? 0.15 : 0.35 / num_digits
	}
	const num_digits = health.length
	const font_size = compute_font_size_multiplier(num_digits) * scale_factor

	const container_style = {
		border: '1px solid red',
		overflow: 'hidden',
		height: '100%',
		flexShrink: 0,
		aspectRatio: 1,
		position: 'relative',
	}

	/* rounded image */
	const image_style = {
		height: '100%',
		width: '100%',
		borderRadius: '50%',
		objectFit: 'cover',
	}

	const text_style = {
		position: 'absolute',
		right: '2%',
		bottom: '2%',
		height: '20%',
		width: '25%',
		backgroundColor: 'rgba(240, 240, 240, .9)',
		borderRadius: '10%',
    boxShadow: '0px 0px 2% rgba(0, 0, 0, .5)',
		zIndex: 2,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		outline: '1px solid rgba(240, 240, 240, 1)',
		whiteSpace: 'nowrap',

		fontFamily: 'belerin',
		fontSize: font_size,
		color: 'rgba(68, 68, 68, 1)',
		fontWeight: 'bold',
	}


	return (
		<div ref={ref} style={container_style}>
			<img style={image_style} 
				src={icon_src}
			/>
			
			<div style={text_style}>
				{health}
			</div>

		</div>
	)
}



const OpponentBoard = ({ height_p, icon_src }) => {

	const container_style = {
		overflow: 'hidden',
		width: '100%',
		height: height_p
	}

	return (
		<div style={container_style}>

			{/* hand row */}
			<div style={{ display: 'flex', height: "20%", flexDirection: 'row' }}>
				<div style={{ width: '30%', border: '1px solid red'}}>
					Spell Stack
				</div>

				{/* hand itself */}
				<Row width_p={"60%"}/>

				<LibraryGraveyardExile width_p={'30%'}/>
			</div>



			<div style={{ display: 'flex', height: "30%", flexDirection: 'row' }}>
				<Row height_p={"100%"}/>
				<PlayerIcon icon_src={icon_src}/>
				<Row height_p={"100%"}/>
			</div>

			{/* opponent creature row same height as player creature row (50% of 40% is 20% === 33.3% of 60%) */}
			<Row height_p={"50%"}/>
		</div>
	)

}


const LibraryGraveyardExile = ({ height_p = '100%', width_p = '100%' }) => {
	const container_style = {
		border: '1px solid red',
		overflow: 'hidden',
		width: width_p,
		height: height_p,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<div style={container_style}>
			<Card img_url={cardback_url}/>
			<Card img_url={cardback_url}/>
			<Card img_url={cardback_url}/>
		</div>
	)
}



const Row = ({ height_p = '100%', width_p = '100%', children }) => {
	const container_style = {
		border: '1px solid blue',
		overflow: 'hidden',
		width: width_p,
		height: height_p,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<div style={container_style}>
			<Card img_url={sire_seven}/>
		</div>
	)
}


const App = () => {

	const belerin_font = new FontFace('belerin', 'url(mplantin.woff)')
	belerin_font.load().then((font) => {
		document.fonts.add(font)
		console.log('belerin font loaded successfully')
	}).catch((error) => {
		console.error('failed to load font:', error)
	})
	

	return (
		<div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
			<div style={{ height: '40%', display: 'flex', flexDirection: 'row' }}>
				<OpponentBoard icon_src={'https://avatarfiles.alphacoders.com/370/370780.png'} height_p={'100%'}/>
			</div>
			<PlayerBoard icon_src={'https://i.pinimg.com/236x/a8/6b/07/a86b07a7a05700c97d39768c016cd6c6.jpg'} height_p={'60%'}/>
		</div>
	)
}

export default App
