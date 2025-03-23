import './App.css'
import 'mana-font/css/mana.css'
import { useRef, useState, useEffect } from 'react'




const card_url = 'https://cards.scryfall.io/large/front/1/a/1a8c02ab-6348-4b04-8ce0-b36309a14a5e.jpg?1689995694'
const crop_url = 'https://cards.scryfall.io/art_crop/front/1/a/1a8c02ab-6348-4b04-8ce0-b36309a14a5e.jpg?1689995694'
const sire_seven = 'https://cards.scryfall.io/large/front/1/b/1b486b75-4680-4a94-af8c-c1c335c9782b.jpg?1730489690'
const cardback_url = 'https://i.imgur.com/LdOBU1I.jpeg'


/**
 * returns the relevant attributes of a scryfall card json object
 *
 * keywords aren't attached to the front or back of cards
 * you have to check if their lowercase version exists within their front/back oracle text
 *
 */
const create_card_obj = (scryfall_card_json) => {

	/* if dfc */
	if (scryfall_card_json.card_faces && scryfall_card_json.layout !== 'adventure') {
		const front_keywords = []
		const back_keywords = []
		scryfall_card_json.keywords.forEach(keyword => {
			if (scryfall_card_json.card_faces[0].oracle_text.includes(keyword)) {
				front_keywords.push(keyword)
			}
			if (scryfall_card_json.card_faces[1].oracle_text.includes(keyword)) {
				back_keywords.push(keyword)
			}
		})

		/* front has a tap ability */
		if (scryfall_card_json.card_faces[0].oracle_text.includes('{T}')) {
			front_keywords.push('Tap')
		}
		/* back has an tap ability */
		if (scryfall_card_json.card_faces[1].oracle_text.includes('{T}')) {
			back_keywords.push('Tap')
		}

		return {
			is_dfc: true,
			front: {
				name: scryfall_card_json.card_faces[0].name,
				keywords: front_keywords,
				mana_cost: scryfall_card_json.card_faces[0].mana_cost,
				power: scryfall_card_json.card_faces[0].power,
				toughness: scryfall_card_json.card_faces[0].toughness,
				rarity: scryfall_card_json.rarity,
				img_url: scryfall_card_json.card_faces[0].image_uris.large,
				type_line: scryfall_card_json.card_faces[0].type_line
			},
			back: {
				name: scryfall_card_json.card_faces[1].name,
				keywords: back_keywords,
				mana_cost: scryfall_card_json.card_faces[1].mana_cost,
				power: scryfall_card_json.card_faces[1].power,
				toughness: scryfall_card_json.card_faces[1].toughness,
				rarity: scryfall_card_json.rarity,
				img_url: scryfall_card_json.card_faces[1].image_uris.large,
				type_line: scryfall_card_json.card_faces[1].type_line
			}
		}
	} 


	if (scryfall_card_json.card_faces && scryfall_card_json.layout === 'adventure') {

		const left_keywords = []
		const right_keywords = []
		scryfall_card_json.keywords.forEach(keyword => {
			if (scryfall_card_json.card_faces[0].oracle_text.includes(keyword)) {
				left_keywords.push(keyword)
			}
			if (scryfall_card_json.card_faces[1].oracle_text.includes(keyword)) {
				right_keywords.push(keyword)
			}
		})

		/* front has a tap ability */
		if (scryfall_card_json.card_faces[0].oracle_text.includes('{T}')) {
			left_keywords.push('Tap')
		}
		/* back has an tap ability */
		if (scryfall_card_json.card_faces[1].oracle_text.includes('{T}')) {
			right_keywords.push('Tap')
		}

		return {
			is_adventure: true,
			is_dfc: false,
			name: scryfall_card_json.name,
			keywords: right_keywords,
			mana_cost: scryfall_card_json.card_faces[0].mana_cost,
			power: scryfall_card_json.card_faces[0].power,
			toughness: scryfall_card_json.card_faces[0].toughness,
			rarity: scryfall_card_json.rarity,
			img_url: scryfall_card_json.image_uris.large,
			type_line: scryfall_card_json.card_faces[1].type_line
		}


	} 




	/* non-dfc */
	else {
		const keywords_with_tap = scryfall_card_json.keywords
		if (scryfall_card_json.oracle_text.includes('{T}')) {
			front_keywords.push('Tap')
		}

		return {
			is_dfc: false,
			is_adventure: false,
			name: scryfall_card_json.name,
			keywords: keywords_with_tap,
			mana_cost: scryfall_card_json.mana_cost,
			power: scryfall_card_json.power,
			toughness: scryfall_card_json.toughness,
			rarity: scryfall_card_json.rarity,
			img_url: scryfall_card_json.image_uris.large,
			type_line: scryfall_card_json.type_line,
		}
	}
}

const scryfall_mana_symbol_2_tailwind = (scryfall_mana_symbol) => {
  /* Remove the braces */
  const symbol = scryfall_mana_symbol.slice(1, -1)
  
  /* Base classes for all mana symbols */
  let classes = "ms ms-cost"
  
  /* Handle different types of mana symbols */
  if (/^[WUBRG]$/.test(symbol)) {
    /* Basic colored mana */
    classes += ` ms-${symbol.toLowerCase()}`
  } 
  else if (/^C$/.test(symbol)) {
    /* Colorless mana */
    classes += " ms-c"
  }
  else if (/^[0-9]+$/.test(symbol)) {
    /* Generic mana cost */
    classes += ` ms-${symbol}`
  }
  else if (/^[XYZ]$/.test(symbol)) {
    /* Variable mana */
    classes += ` ms-${symbol.toLowerCase()}`
  }
  else if (/^S$/.test(symbol)) {
    /* Snow mana */
    classes += " ms-s"
  }
  else if (/^[WUBRG]\/P$/.test(symbol)) {
    /* Phyrexian mana */
    const color = symbol.charAt(0).toLowerCase()
    classes += ` ms-${color}p`
  }
  else if (/^2\/[WUBRG]$/.test(symbol)) {
    /* 2/Color hybrid mana */
    const color = symbol.charAt(2).toLowerCase()
    classes += ` ms-2${color}`
  }
  else if (/^[WUBRG]\/[WUBRG]$/.test(symbol)) {
    /* Color/Color hybrid mana */
    const color1 = symbol.charAt(0).toLowerCase()
    const color2 = symbol.charAt(2).toLowerCase()
    classes += ` ms-${color1}${color2}`
  }
  
  /* Add the shadow class for most mana symbols */
  classes += " ms-shadow"
  
  return classes
}

const get_mana_cost_tailwinds = (scryfall_mana_cost) => {
	const tailwinds = []

	/* extract each symbol */
  const regex = /{([WUBRGC]|[0-9]+|[XYZ]|[WUBRG2]\/[WUBRG]|[WUBRG]\/P|S)}/g
  const matches = [...scryfall_mana_cost.matchAll(regex)].map(match => match[0])

	matches.forEach(symbol => {
		tailwinds.push(scryfall_mana_symbol_2_tailwind(symbol))
	})

	return tailwinds 
}



/**
 * TODO: 
 * refactor power, toughness, mana symbols, and abilitiy icons to be pulled from scryfall data (combine props into a card_info object prop)
 * refactor mana symbols to only be displayed when card is in-hand
 *
 *
 */
const Card = ({ card_obj }) => {

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





	/* if not a card object */
	if (!card_obj) {
		return (
			<div ref={ref} style={container_style}>
				<img style={card_image_style}
					src={cardback_url}
				/>
			</div>
		)
	}

	const is_hand = true
	const mana_cost_tailwinds = get_mana_cost_tailwinds(card_obj.mana_cost)
	mana_cost_tailwinds.push('/')
	mana_cost_tailwinds.push(mana_cost_tailwinds[0])
	console.log(mana_cost_tailwinds)

	/* needs to also handle when there are split cards / adventure cards */
	/* this needs to be done at the mana cost parsing level */

	/* multi-cost cards */

	
	return (
		<div ref={ref} style={container_style}>
			<img style={card_image_style}
				src={card_obj.img_url}
			/>

			{/* https://mana.andrewgioia.com/attributes.html */}
			{is_hand && 
				<div style={{ display: 'flex', position: 'absolute', top: '-3%', right: '-4.5%', gap: '2%', border: '1px solid blue'}}>
					{mana_cost_tailwinds.map((tailwind, index) => (
						<AndrewGioia key={index} scale_factor={card_width} tailwind={tailwind}/>
					))}
				</div>
			}

			{is_hand && 
				<div style={{ display: 'flex', position: 'absolute', top: '-3%', right: '-4.5%', gap: '2%', border: '1px solid blue'}}>
					{mana_cost_tailwinds.map((tailwind, index) => (
						<AndrewGioia key={index} scale_factor={card_width} tailwind={tailwind}/>
					))}
				</div>
			}

			<div style={icon_row_style}>
				<AbilityIcon svg_url={'./ability-trample.svg'} />
				<AbilityIcon svg_url={'./ability-trample.svg'} />
				<AbilityIcon svg_url={'./ability-trample.svg'} />
			</div>

			<PowerToughness scale_factor={card_width}/>
		</div>
	)




}



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

	if (tailwind === '/') {
		return (
			<div style={{ fontSize: 0.25 * scale_factor, fontWeight: 'bold', fontFamily: 'belerin', color: 'red', }}>
				/
			</div>
		)
	}

	return (
		<i style={container_style} 
			className={tailwind}> 
		</i>
	)
}





/**
 * TODO: refactor this to take in a scryfall ability keyword and render the corresponding svg
 *
 */
const AbilityIcon = ({ scryfall_keyword }) => {

	const get_svg_url = (scryfall_keyword) => {
		switch (scryfall_keyword) {
			case 'Lifelink':
				return './icons/ability-lifelink.svg'
			case 'Reach':
				return './icons/ability-reach.svg'
			case 'Vigilance':
				return './icons/ability-vigilance.svg'
			case 'FirstStrike':
				return './icons/ability-firststrike.svg'
			case 'Doublestrike':
				return './icons/ability-doublestrike.svg'
			case 'Trample':
				return './icons/ability-trample.svg'
			case 'Ward':
				return './icons/ability-ward.svg'
			case 'Deathtouch':
				return './icons/ability-deathtouch.svg'
			case 'Defender':
				return './icons/ability-defender.svg'
			case 'Indestructable':
				return './icons/ability-indestructable.svg'
			case 'Flying':
				return './icons/ability-flying.svg'
			case 'Hexproof':
				return './icons/ability-hexproof.svg'
			case 'Haste':
				return './icons/ability-haste.svg'
			case 'Tap':
				return './icons/ability-tap.svg'
		}
	}

	const svg_url = get_svg_url(scryfall_keyword)

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


const PlayerBoard = ({ height_p, icon_src, card_arr }) => {

	const container_style = {
		overflow: 'hidden',
		height: height_p,
		width: '100%',
	}


	return (
		<div style={container_style}>
			{/* creatures */}
			<Row height_p={"33.3%"} card_arr={card_arr}/>

			<div style={{ display: 'flex', height: "33.3%", flexDirection: 'row' }}>
				{/* lands */}
				<Row height_p={"100%"}/>
				{/* player icon */}
				<PlayerIcon icon_src={icon_src}/>
				{/* artifacts / enchantment */}
				<Row height_p={"100%"}/>
			</div>

			<div style={{ display: 'flex', height: "33.3%", flexDirection: 'row' }}>
				{/* library, graveyard, exile */}
				<LibraryGraveyardExile width_p={'30%'}/>

				{/* hand row */}
				<Row width_p={"60%"}/>

				{/* stack */}
				<div style={{ width: '30%', border: '1px solid red'}}>
					Spell Stack
				</div>
			</div>


		</div>
	)

}



const Row = ({ height_p = '100%', width_p = '100%', card_arr }) => {
	const container_style = {
		border: '1px solid blue',
		overflow: 'hidden',
		width: width_p,
		height: height_p,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	if (!card_arr) {
		return (
			<div style={container_style}>
				Empty row 
			</div>
		)
	}

	return (
		<div style={container_style}>
			{card_arr.map((card_obj, index) => (
				<Card key={index} card_obj={card_obj} />
			))}
		</div>
	)
}


const App = () => {

	const card_obj = create_card_obj(adventure)

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
			</div>
			<PlayerBoard icon_src={'https://i.pinimg.com/236x/a8/6b/07/a86b07a7a05700c97d39768c016cd6c6.jpg'} height_p={'60%'} card_arr={[card_obj]}/>
		</div>
	)
}


export default App
