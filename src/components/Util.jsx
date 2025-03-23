
export const util = {
	/* andrew gioia mana symbols */
	andrew_gioia: {
		/* returns tailwind css for a singular scryfall cost token (e.g., '{W}' --> 'ms ms-cost ms-w -ms-shadow') */
		scryfall_mana_cost_token_to_tailwind_str: (scryfall_mana_cost_token) => {
			const symbol = scryfall_mana_cost_token.slice(1, -1)
			let classes = "ms ms-cost"

			/* basic colored mana */
			if (/^[WUBRG]$/.test(symbol)) {
				classes += ` ms-${symbol.toLowerCase()}`
			} 
			/* colorless mana */
			else if (/^C$/.test(symbol)) {
				classes += " ms-c"
			}
			/* generic mana cost */
			else if (/^[0-9]+$/.test(symbol)) {
				classes += ` ms-${symbol}`
			}
			/* variable mana */
			else if (/^[XYZ]$/.test(symbol)) {
				classes += ` ms-${symbol.toLowerCase()}`
			}
			/* snow mana */
			else if (/^S$/.test(symbol)) {
				classes += " ms-s"
			}
			/* phyrexian mana */
			else if (/^[WUBRG]\/P$/.test(symbol)) {
				const color = symbol.charAt(0).toLowerCase()
				classes += ` ms-${color}p`
			}
			/* 2/color hybrid mana */
			else if (/^2\/[WUBRG]$/.test(symbol)) {
				const color = symbol.charAt(2).toLowerCase()
				classes += ` ms-2${color}`
			}
			/* color/color hybrid mana */
			else if (/^[WUBRG]\/[WUBRG]$/.test(symbol)) {
				const color1 = symbol.charAt(0).toLowerCase()
				const color2 = symbol.charAt(2).toLowerCase()
				classes += ` ms-${color1}${color2}`
			}

			classes += " ms-shadow"
			return classes
		},

		scryfall_mana_cost_expr_to_tailwind_str_arr: (scryfall_mana_cost_expr) => {
			const tailwinds = []

			/* extract each token into an iterator (e.g., ['{W}', '{2/W}', '{B/P}']) */
			const regex = /{([WUBRGC]|[0-9]+|[XYZ]|[WUBRG2]\/[WUBRG]|[WUBRG]\/P|S)}/g
			const matches = [...scryfall_mana_cost_expr.matchAll(regex)].map(match => match[0])
			
			/* iterate over each scryfall mana cost token and produce corresponding tailwind */
			matches.forEach(mana_cost_token => {
				tailwinds.push(scryfall_mana_cost_token_to_tailwind_str(mana_cost_token))
			})

			return tailwinds 
		},
	},

	scryfall: {
		json: {
			/* returns the base power from the front of the card unless face !== "front", in which case it parses the base power from the back; or undefined if there isn't one */
			parse_base_power: (scryfall_json, face="front") => { 
				/* DOUBLE SIDED */
				if (util.scryfall.json.has_back(scryfall_json)) {
					const index = (face === "front" ? 0 : 1)
					return scryfall_json.card_faces[index].power
				}

				/* SINGLE SIDED */
				return scryfall_json.power
			},

			/* returns the base toughness from the front of the card unless face !== "front", in which case it parses the base toughness from the back; or undefined if there isn't one */
			parse_base_toughness: (scryfall_json, face="front") => { 
				/* DOUBLE SIDED */
				if (util.scryfall.json.has_back(scryfall_json)) {
					const index = (face === "front" ? 0 : 1)
					return scryfall_json.card_faces[index].toughness
				}

				/* SINGLE SIDED */
				return scryfall_json.toughness
			},

			/* returns the image url from the front of the card unless face !== "front", in which case it parses the image url from the back */
			parse_img_url: (scryfall_json, face="front") => { 
				/* DOUBLE SIDED */
				if (util.scryfall.json.has_back(scryfall_json)) {
					const index = (face === "front" ? 0 : 1)
					return scryfall_json.card_faces[index].image_uris.large
				}

				/* SINGLE SIDED */
				return scryfall_json.image_uris.large
			},

			/* returns the ability keywords from the front of the card unless face !== "front", in which case it parses the ability keywords from the back */
			parse_ability_keywords: (scryfall_json, face="front") => { 
				/* only consider keywords that will be rendered */
				const ability_keywords = [ 'Menace', 'Lifelink', 'Reach', 'Vigilance', 'First strike', 'Double strike', 'Trample', 'Ward', 'Deathtouch', 'Defender', 'Indestructable', 'Flying', 'Hexproof', 'Haste', 'Tap' ]
				const base_keywords = scryfall_json.keywords.filter(keyword => ability_keywords.includes(keyword))

				/* DOUBLE SIDED */
				if (util.scryfall.json.has_back(scryfall_json)) {
					const index = (face === "front" ? 0 : 1)
					console.log('index', index)
					
					/* search oracle text for face specific keywords */
					const face_specific_keywords = []
					const oracle_text = scryfall_json.card_faces[index].oracle_text
					if (oracle_text) {
						base_keywords.forEach(keyword => {
							if (oracle_text.includes(keyword)) {
								face_specific_keywords.push(keyword)
							}
						})

						/* add custom 'Tap' ability if card has a tap ability (this doesn't appear in keywords) */
						if (oracle_text.includes('{T}')) {
							face_specific_keywords.push('Tap')
						}
					}

					return face_specific_keywords
				}

				/* SINGLE SIDED */

				/* add custom 'Tap' ability if card has a tap ability (this doesn't appear in keywords) */
				const oracle_text = scryfall_json.oracle_text
				if (oracle_text && oracle_text.includes('{T}')) {
					base_keywords.push('Tap')
				}

				return base_keywords
			},

			/* returns whether a card has a back side */
			has_back: (scryfall_json) => {
				return scryfall_json.layout === 'modal_dfc' || scryfall_json.layout === 'transform'
			},

		},

		/* TODO */
		api: {
			/* makes a get request to /cards/search and returns an array of scryfall json card objects */
			get_json_arr_by_search_expr: (search_expr) => { 
				return []
			},

			/* makes a post request to /cards/collection can retrieves an array of scryfall json objects */
			get_json_arr_by_mtga_decklist: (mtga_formatted_decklist) => {
				return []
			}
		}
	}
}


