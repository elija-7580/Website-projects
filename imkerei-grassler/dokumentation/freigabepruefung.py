from pathlib import Path
import json,sys
p=Path(__file__).resolve().parents[1]/'website'/'release-config.json'
c=json.loads(p.read_text())
missing=[k for k,v in c.items() if not v]
if missing:
 print('NICHT FREIGEGEBEN. Offen: '+', '.join(missing));sys.exit(1)
print('Checkliste vollständig. Rechtstexte, Backendtest und ausdrückliche Freigabe müssen real vorliegen. Keine automatische Veröffentlichung.')
