import { writeFileSync } from 'fs'
import { toJson } from '../../src/epo/readEpo.js'

const databasePath = `assets/ePO/feature/4.2.0-rc.2/analysis_and_design/conceptual_model/ePO_CM.qea`

const eapJson = toJson({ databasePath })
writeFileSync(`assets/4.2.0-rc.2.json`, JSON.stringify(eapJson, null, 2))
