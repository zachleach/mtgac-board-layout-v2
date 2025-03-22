import './App.css'
import 'mana-font/css/mana.css'
import { useRef, useState, useEffect } from 'react'
import { transform, dfc, adventure, seven } from './test_cards'
import { PowerToughness } from './components'


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
  const symbol = scryfall_mana_symbol.slice(1, -1)
  
  let classes = "ms ms-cost"
  
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










const App = () => {

	const card_obj = create_card_obj(transform)

	const belerin_font = new FontFace('belerin', 'url(mplantin.woff)')
	belerin_font.load().then((font) => {
		document.fonts.add(font)
		console.log('belerin font loaded successfully')
	}).catch((error) => {
		console.error('failed to load font:', error)
	})

	return (
		<div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
			<Card card_obj={card_obj}/>
		</div>
	)
}



export default App
