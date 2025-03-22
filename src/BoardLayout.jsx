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



const test_dfc = {
  "object": "card",
  "id": "8093f8b0-5d50-48ca-b616-e92535a47138",
  "oracle_id": "80b07882-e144-4815-8b6f-04b3ab343d97",
  "multiverse_ids": [
    409843,
    409844
  ],
  "mtgo_id": 60370,
  "mtgo_foil_id": 60371,
  "tcgplayer_id": 116486,
  "cardmarket_id": 289120,
  "name": "Accursed Witch // Infectious Curse",
  "lang": "en",
  "released_at": "2016-04-08",
  "uri": "https://api.scryfall.com/cards/8093f8b0-5d50-48ca-b616-e92535a47138",
  "scryfall_uri": "https://scryfall.com/card/soi/97/accursed-witch-infectious-curse?utm_source=api",
  "layout": "transform",
  "highres_image": true,
  "image_status": "highres_scan",
  "cmc": 4.0,
  "type_line": "Creature — Human Shaman // Enchantment — Aura Curse",
  "color_identity": [
    "B"
  ],
  "keywords": [
    "Transform",
    "Enchant"
  ],
  "card_faces": [
    {
      "object": "card_face",
      "name": "Accursed Witch",
      "mana_cost": "{3}{B}",
      "type_line": "Creature — Human Shaman",
      "oracle_text": "Spells your opponents cast that target this creature cost {1} less to cast.\nWhen this creature dies, return it to the battlefield transformed under your control attached to target opponent.",
      "colors": [
        "B"
      ],
      "power": "4",
      "toughness": "2",
      "artist": "Wesley Burt",
      "artist_id": "b98c9d94-8bdb-49af-871d-7bac92274535",
      "illustration_id": "e648ea98-8935-4b00-b3d9-d4d1e98026d8",
      "image_uris": {
        "small": "https://cards.scryfall.io/small/front/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328",
        "normal": "https://cards.scryfall.io/normal/front/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328",
        "large": "https://cards.scryfall.io/large/front/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328",
        "png": "https://cards.scryfall.io/png/front/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.png?1576384328",
        "art_crop": "https://cards.scryfall.io/art_crop/front/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328",
        "border_crop": "https://cards.scryfall.io/border_crop/front/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328"
      }
    },
    {
      "object": "card_face",
      "name": "Infectious Curse",
      "mana_cost": "",
      "type_line": "Enchantment — Aura Curse",
      "oracle_text": "Enchant player\nSpells you cast that target enchanted player cost {1} less to cast.\nAt the beginning of enchanted player's upkeep, that player loses 1 life and you gain 1 life.",
      "colors": [
        "B"
      ],
      "color_indicator": [
        "B"
      ],
      "artist": "Wesley Burt",
      "artist_id": "b98c9d94-8bdb-49af-871d-7bac92274535",
      "illustration_id": "828863bf-ddb7-4719-bcfd-2a20c667829f",
      "image_uris": {
        "small": "https://cards.scryfall.io/small/back/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328",
        "normal": "https://cards.scryfall.io/normal/back/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328",
        "large": "https://cards.scryfall.io/large/back/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328",
        "png": "https://cards.scryfall.io/png/back/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.png?1576384328",
        "art_crop": "https://cards.scryfall.io/art_crop/back/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328",
        "border_crop": "https://cards.scryfall.io/border_crop/back/8/0/8093f8b0-5d50-48ca-b616-e92535a47138.jpg?1576384328"
      }
    }
  ],
  "all_parts": [
    {
      "object": "related_card",
      "id": "8093f8b0-5d50-48ca-b616-e92535a47138",
      "component": "combo_piece",
      "name": "Accursed Witch // Infectious Curse",
      "type_line": "Creature — Human Shaman // Enchantment — Aura Curse",
      "uri": "https://api.scryfall.com/cards/8093f8b0-5d50-48ca-b616-e92535a47138"
    },
    {
      "object": "related_card",
      "id": "4d323ead-24f5-42e4-9e23-aa14eb66264d",
      "component": "combo_piece",
      "name": "Shadows Over Innistrad Checklist 1",
      "type_line": "Card",
      "uri": "https://api.scryfall.com/cards/4d323ead-24f5-42e4-9e23-aa14eb66264d"
    }
  ],
  "legalities": {
    "standard": "not_legal",
    "future": "not_legal",
    "historic": "legal",
    "timeless": "legal",
    "gladiator": "legal",
    "pioneer": "legal",
    "explorer": "legal",
    "modern": "legal",
    "legacy": "legal",
    "pauper": "not_legal",
    "vintage": "legal",
    "penny": "not_legal",
    "commander": "legal",
    "oathbreaker": "legal",
    "standardbrawl": "not_legal",
    "brawl": "legal",
    "alchemy": "not_legal",
    "paupercommander": "not_legal",
    "duel": "legal",
    "oldschool": "not_legal",
    "premodern": "not_legal",
    "predh": "not_legal"
  },
  "games": [
    "paper",
    "mtgo"
  ],
  "reserved": false,
  "game_changer": false,
  "foil": true,
  "nonfoil": true,
  "finishes": [
    "nonfoil",
    "foil"
  ],
  "oversized": false,
  "promo": false,
  "reprint": false,
  "variation": false,
  "set_id": "5e914d7e-c1e9-446c-a33d-d093c02b2743",
  "set": "soi",
  "set_name": "Shadows over Innistrad",
  "set_type": "expansion",
  "set_uri": "https://api.scryfall.com/sets/5e914d7e-c1e9-446c-a33d-d093c02b2743",
  "set_search_uri": "https://api.scryfall.com/cards/search?order=set&q=e%3Asoi&unique=prints",
  "scryfall_set_uri": "https://scryfall.com/sets/soi?utm_source=api",
  "rulings_uri": "https://api.scryfall.com/cards/8093f8b0-5d50-48ca-b616-e92535a47138/rulings",
  "prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3A80b07882-e144-4815-8b6f-04b3ab343d97&unique=prints",
  "collector_number": "97",
  "digital": false,
  "rarity": "uncommon",
  "artist": "Wesley Burt",
  "artist_ids": [
    "b98c9d94-8bdb-49af-871d-7bac92274535"
  ],
  "border_color": "black",
  "frame": "2015",
  "frame_effects": [
    "sunmoondfc"
  ],
  "full_art": false,
  "textless": false,
  "booster": true,
  "story_spotlight": false,
  "edhrec_rank": 8916,
  "penny_rank": 4712,
  "prices": {
    "usd": "0.25",
    "usd_foil": "1.85",
    "usd_etched": null,
    "eur": "0.22",
    "eur_foil": "0.83",
    "tix": "0.03"
  },
  "related_uris": {
    "gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=409843&printed=false",
    "tcgplayer_infinite_articles": "https://partner.tcgplayer.com/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Darticle%26game%3Dmagic%26q%3DAccursed%2BWitch%2B%252F%252F%2BInfectious%2BCurse",
    "tcgplayer_infinite_decks": "https://partner.tcgplayer.com/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Ddeck%26game%3Dmagic%26q%3DAccursed%2BWitch%2B%252F%252F%2BInfectious%2BCurse",
    "edhrec": "https://edhrec.com/route/?cc=Accursed+Witch"
  },
  "purchase_uris": {
    "tcgplayer": "https://partner.tcgplayer.com/c/4931599/1830156/21018?subId1=api&u=https%3A%2F%2Fwww.tcgplayer.com%2Fproduct%2F116486%3Fpage%3D1",
    "cardmarket": "https://www.cardmarket.com/en/Magic/Products/Singles/Shadows-over-Innistrad/Accursed-Witch-Infectious-Curse?referrer=scryfall&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall",
    "cardhoarder": "https://www.cardhoarder.com/cards/60370?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall"
  }
}


const test_json = {
  "object": "card",
  "id": "8d8432a7-1c8a-4cfb-947c-ecf9791063eb",
  "oracle_id": "a15547d0-bbcb-41ee-a9ae-8325a9e7fe1f",
  "multiverse_ids": [
    679078
  ],
  "mtgo_id": 133570,
  "arena_id": 93714,
  "tcgplayer_id": 591199,
  "cardmarket_id": 796513,
  "name": "Sire of Seven Deaths",
  "lang": "en",
  "released_at": "2024-11-15",
  "uri": "https://api.scryfall.com/cards/8d8432a7-1c8a-4cfb-947c-ecf9791063eb",
  "scryfall_uri": "https://scryfall.com/card/fdn/1/sire-of-seven-deaths?utm_source=api",
  "layout": "normal",
  "highres_image": true,
  "image_status": "highres_scan",
  "image_uris": {
    "small": "https://cards.scryfall.io/small/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490",
    "normal": "https://cards.scryfall.io/normal/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490",
    "large": "https://cards.scryfall.io/large/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490",
    "png": "https://cards.scryfall.io/png/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.png?1730657490",
    "art_crop": "https://cards.scryfall.io/art_crop/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490",
    "border_crop": "https://cards.scryfall.io/border_crop/front/8/d/8d8432a7-1c8a-4cfb-947c-ecf9791063eb.jpg?1730657490"
  },
  "mana_cost": "{7}",
  "cmc": 7.0,
  "type_line": "Creature — Eldrazi",
  "oracle_text": "First strike, vigilance\nMenace, trample\nReach, lifelink\nWard—Pay 7 life.",
  "power": "7",
  "toughness": "7",
  "colors": [],
  "color_identity": [],
  "keywords": [
    "Lifelink",
    "Reach",
    "Vigilance",
    "First strike",
    "Trample",
    "Menace",
    "Ward"
  ],
  "legalities": {
    "standard": "legal",
    "future": "legal",
    "historic": "legal",
    "timeless": "legal",
    "gladiator": "legal",
    "pioneer": "legal",
    "explorer": "legal",
    "modern": "legal",
    "legacy": "legal",
    "pauper": "not_legal",
    "vintage": "legal",
    "penny": "not_legal",
    "commander": "legal",
    "oathbreaker": "legal",
    "standardbrawl": "legal",
    "brawl": "legal",
    "alchemy": "legal",
    "paupercommander": "not_legal",
    "duel": "legal",
    "oldschool": "not_legal",
    "premodern": "not_legal",
    "predh": "not_legal"
  },
  "games": [
    "paper",
    "arena",
    "mtgo"
  ],
  "reserved": false,
  "game_changer": false,
  "foil": true,
  "nonfoil": true,
  "finishes": [
    "nonfoil",
    "foil"
  ],
  "oversized": false,
  "promo": false,
  "reprint": false,
  "variation": false,
  "set_id": "a7ecb771-d1b6-4dec-8cf5-8d45179f21e0",
  "set": "fdn",
  "set_name": "Foundations",
  "set_type": "core",
  "set_uri": "https://api.scryfall.com/sets/a7ecb771-d1b6-4dec-8cf5-8d45179f21e0",
  "set_search_uri": "https://api.scryfall.com/cards/search?order=set&q=e%3Afdn&unique=prints",
  "scryfall_set_uri": "https://scryfall.com/sets/fdn?utm_source=api",
  "rulings_uri": "https://api.scryfall.com/cards/8d8432a7-1c8a-4cfb-947c-ecf9791063eb/rulings",
  "prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3Aa15547d0-bbcb-41ee-a9ae-8325a9e7fe1f&unique=prints",
  "collector_number": "1",
  "digital": false,
  "rarity": "mythic",
  "flavor_text": "Born of the infinite void between realities, the Eldrazi have one goal: to consume.",
  "card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
  "artist": "Lius Lasahido",
  "artist_ids": [
    "0a0e9093-ce44-4a69-93a7-09b63e7c330d"
  ],
  "illustration_id": "00f2c4ad-1a32-489b-8a30-c87e29914f69",
  "border_color": "black",
  "frame": "2015",
  "security_stamp": "oval",
  "full_art": false,
  "textless": false,
  "booster": true,
  "story_spotlight": false,
  "edhrec_rank": 4803,
  "preview": {
    "source": "Geekculture",
    "source_uri": "https://geekculture.co/mtg-foundations-sire-of-seven-deaths-card-preview/",
    "previewed_at": "2024-10-29"
  },
  "prices": {
    "usd": "19.66",
    "usd_foil": "20.37",
    "usd_etched": null,
    "eur": "18.93",
    "eur_foil": "19.54",
    "tix": "3.48"
  },
  "related_uris": {
    "gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=679078&printed=false",
    "tcgplayer_infinite_articles": "https://partner.tcgplayer.com/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Darticle%26game%3Dmagic%26q%3DSire%2Bof%2BSeven%2BDeaths",
    "tcgplayer_infinite_decks": "https://partner.tcgplayer.com/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Ddeck%26game%3Dmagic%26q%3DSire%2Bof%2BSeven%2BDeaths",
    "edhrec": "https://edhrec.com/route/?cc=Sire+of+Seven+Deaths"
  },
  "purchase_uris": {
    "tcgplayer": "https://partner.tcgplayer.com/c/4931599/1830156/21018?subId1=api&u=https%3A%2F%2Fwww.tcgplayer.com%2Fproduct%2F591199%3Fpage%3D1",
    "cardmarket": "https://www.cardmarket.com/en/Magic/Products/Singles/Magic-The-Gathering-Foundations/Sire-of-Seven-Deaths?referrer=scryfall&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall",
    "cardhoarder": "https://www.cardhoarder.com/cards/133570?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall"
  }
}


const adventure = {
  "object": "card",
  "id": "f1e5cafb-b0e6-4ee5-8c58-6f8e5ef2b9da",
  "oracle_id": "fae36da0-bf9c-484f-b2fe-dd8ab2effc5c",
  "multiverse_ids": [
    629616
  ],
  "mtgo_id": 116546,
  "arena_id": 86811,
  "tcgplayer_id": 512610,
  "cardmarket_id": 728413,
  "name": "Virtue of Persistence // Locthwain Scorn",
  "lang": "en",
  "released_at": "2023-09-08",
  "uri": "https://api.scryfall.com/cards/f1e5cafb-b0e6-4ee5-8c58-6f8e5ef2b9da",
  "scryfall_uri": "https://scryfall.com/card/woe/115/virtue-of-persistence-locthwain-scorn?utm_source=api",
  "layout": "adventure",
  "highres_image": true,
  "image_status": "highres_scan",
  "image_uris": {
    "small": "https://cards.scryfall.io/small/front/f/1/f1e5cafb-b0e6-4ee5-8c58-6f8e5ef2b9da.jpg?1692937996",
    "normal": "https://cards.scryfall.io/normal/front/f/1/f1e5cafb-b0e6-4ee5-8c58-6f8e5ef2b9da.jpg?1692937996",
    "large": "https://cards.scryfall.io/large/front/f/1/f1e5cafb-b0e6-4ee5-8c58-6f8e5ef2b9da.jpg?1692937996",
    "png": "https://cards.scryfall.io/png/front/f/1/f1e5cafb-b0e6-4ee5-8c58-6f8e5ef2b9da.png?1692937996",
    "art_crop": "https://cards.scryfall.io/art_crop/front/f/1/f1e5cafb-b0e6-4ee5-8c58-6f8e5ef2b9da.jpg?1692937996",
    "border_crop": "https://cards.scryfall.io/border_crop/front/f/1/f1e5cafb-b0e6-4ee5-8c58-6f8e5ef2b9da.jpg?1692937996"
  },
  "mana_cost": "{5}{B}{B} // {1}{B}",
  "cmc": 7.0,
  "type_line": "Enchantment // Sorcery — Adventure",
  "colors": [
    "B"
  ],
  "color_identity": [
    "B"
  ],
  "keywords": [],
  "card_faces": [
    {
      "object": "card_face",
      "name": "Virtue of Persistence",
      "mana_cost": "{5}{B}{B}",
      "type_line": "Enchantment",
      "oracle_text": "At the beginning of your upkeep, put target creature card from a graveyard onto the battlefield under your control.",
      "artist": "Piotr Dura",
      "artist_id": "aff176e8-1d15-432e-ad1d-207a474decba",
      "illustration_id": "f3ab7d03-dcf7-4112-acfe-2377fa93fddd"
    },
    {
      "object": "card_face",
      "name": "Locthwain Scorn",
      "mana_cost": "{1}{B}",
      "type_line": "Sorcery — Adventure",
      "oracle_text": "Target creature gets -3/-3 until end of turn. You gain 2 life.",
      "artist": "Piotr Dura",
      "artist_id": "aff176e8-1d15-432e-ad1d-207a474decba"
    }
  ],
  "all_parts": [
    {
      "object": "related_card",
      "id": "fcf4c7fb-7859-4c11-8552-6817f5119d2e",
      "component": "combo_piece",
      "name": "On an Adventure",
      "type_line": "Card",
      "uri": "https://api.scryfall.com/cards/fcf4c7fb-7859-4c11-8552-6817f5119d2e"
    },
    {
      "object": "related_card",
      "id": "337393e3-9081-4251-b4ca-afd7ce10dc99",
      "component": "combo_piece",
      "name": "Virtue of Persistence // Locthwain Scorn",
      "type_line": "Enchantment // Sorcery — Adventure",
      "uri": "https://api.scryfall.com/cards/337393e3-9081-4251-b4ca-afd7ce10dc99"
    }
  ],
  "legalities": {
    "standard": "legal",
    "future": "legal",
    "historic": "legal",
    "timeless": "legal",
    "gladiator": "legal",
    "pioneer": "legal",
    "explorer": "legal",
    "modern": "legal",
    "legacy": "legal",
    "pauper": "not_legal",
    "vintage": "legal",
    "penny": "not_legal",
    "commander": "legal",
    "oathbreaker": "legal",
    "standardbrawl": "legal",
    "brawl": "legal",
    "alchemy": "legal",
    "paupercommander": "not_legal",
    "duel": "legal",
    "oldschool": "not_legal",
    "premodern": "not_legal",
    "predh": "not_legal"
  },
  "games": [
    "paper",
    "arena",
    "mtgo"
  ],
  "reserved": false,
  "game_changer": false,
  "foil": true,
  "nonfoil": true,
  "finishes": [
    "nonfoil",
    "foil"
  ],
  "oversized": false,
  "promo": false,
  "reprint": false,
  "variation": false,
  "set_id": "79139661-13ee-43c4-8bad-a8c069f1a1df",
  "set": "woe",
  "set_name": "Wilds of Eldraine",
  "set_type": "expansion",
  "set_uri": "https://api.scryfall.com/sets/79139661-13ee-43c4-8bad-a8c069f1a1df",
  "set_search_uri": "https://api.scryfall.com/cards/search?order=set&q=e%3Awoe&unique=prints",
  "scryfall_set_uri": "https://scryfall.com/sets/woe?utm_source=api",
  "rulings_uri": "https://api.scryfall.com/cards/f1e5cafb-b0e6-4ee5-8c58-6f8e5ef2b9da/rulings",
  "prints_search_uri": "https://api.scryfall.com/cards/search?order=released&q=oracleid%3Afae36da0-bf9c-484f-b2fe-dd8ab2effc5c&unique=prints",
  "collector_number": "115",
  "digital": false,
  "rarity": "mythic",
  "card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
  "artist": "Piotr Dura",
  "artist_ids": [
    "aff176e8-1d15-432e-ad1d-207a474decba"
  ],
  "illustration_id": "f3ab7d03-dcf7-4112-acfe-2377fa93fddd",
  "border_color": "black",
  "frame": "2015",
  "security_stamp": "oval",
  "full_art": false,
  "textless": false,
  "booster": true,
  "story_spotlight": false,
  "edhrec_rank": 1552,
  "preview": {
    "source": "Wizards of the Coast",
    "source_uri": "",
    "previewed_at": "2023-08-17"
  },
  "prices": {
    "usd": "9.33",
    "usd_foil": "12.90",
    "usd_etched": null,
    "eur": "15.32",
    "eur_foil": "16.94",
    "tix": "0.69"
  },
  "related_uris": {
    "gatherer": "https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=629616&printed=false",
    "tcgplayer_infinite_articles": "https://partner.tcgplayer.com/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Darticle%26game%3Dmagic%26q%3DVirtue%2Bof%2BPersistence%2B%252F%252F%2BLocthwain%2BScorn",
    "tcgplayer_infinite_decks": "https://partner.tcgplayer.com/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Ddeck%26game%3Dmagic%26q%3DVirtue%2Bof%2BPersistence%2B%252F%252F%2BLocthwain%2BScorn",
    "edhrec": "https://edhrec.com/route/?cc=Virtue+of+Persistence"
  },
  "purchase_uris": {
    "tcgplayer": "https://partner.tcgplayer.com/c/4931599/1830156/21018?subId1=api&u=https%3A%2F%2Fwww.tcgplayer.com%2Fproduct%2F512610%3Fpage%3D1",
    "cardmarket": "https://www.cardmarket.com/en/Magic/Products/Singles/Wilds-of-Eldraine/Virtue-of-Persistence-Locthwain-Scorn?referrer=scryfall&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall",
    "cardhoarder": "https://www.cardhoarder.com/cards/116546?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall"
  }
}


export default App
