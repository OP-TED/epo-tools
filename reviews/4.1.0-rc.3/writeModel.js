import { writeFileSync } from 'fs'
import { getJson } from '../../src/epo/readEpo.js'

const sourceDirectory = 'assets/ePO/feature/4.1.0-rc.3'
const databasePath = `${sourceDirectory}/analysis_and_design/conceptual_model/ePO_CM.eap`

const eapJson = getJson({ databasePath })
writeFileSync('assets/4.1.0-rc.3.json', JSON.stringify(eapJson, null, 2))
