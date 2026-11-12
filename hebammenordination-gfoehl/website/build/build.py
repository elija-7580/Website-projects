#!/usr/bin/env python3
"""Baut die statische Website der Hebammenordination Gföhl nach /home/claude/site."""
import os, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
YEAR = 2026
TEL = "0676 / 743 08 39"
TEL_HREF = "tel:+436767430839"
MAIL = "e.schwarz-blamauer@aon.at"
ADDR = "Kirchengasse 2 / 1. Stock<br>3542 Gföhl"

ICON_CHECK = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10"/></svg>'

# ------------------------------------------------------------------ Leistungen
# phase: schwanger | geburt | wochenbett | therapie
S = [
 dict(slug="mutter-kind-pass-beratung", title="Mutter-Kind-Pass-Beratung", phase="schwanger",
  short="Kostenloses, einstündiges Hebammengespräch zwischen der 18. und 22. Schwangerschaftswoche.",
  badge="Kostenlos · 18.–22. SSW", img="hebammenberatung.jpg", img_alt="Formular der Hebammenberatung im Mutter-Kind-Pass",
  lead="Seit März 2014 hat jede Frau zwischen der 18. und 22. Schwangerschaftswoche im Rahmen des Mutter-Kind-Passes das Recht auf ein einstündiges Gratisgespräch mit einer Hebamme.",
  body="""
<p>Das kostenlose Beratungsgespräch ist im Mutter-Kind-Pass enthalten. Viele werdende Mütter wünschen sich während der Schwangerschaft die Unterstützung durch eine Hebamme, um die nötige Sicherheit im Umgang mit der neuen Lebenssituation zu erhalten. Die Mutter-Kind-Pass-Beratung durch die Hebamme soll diesem Wunsch entgegenkommen.</p>
<h2>Diese Themen besprechen wir</h2>
<ul class="checklist">
<li>Informationen über Schwangerschaftsverlauf, Geburt, Wochenbettzeit und Stillen</li>
<li>Möglichkeiten der Geburtsvorbereitung, Schwangerschaftsgymnastik</li>
<li>Information über verschiedene Formen der Geburt – wie und wo möchtest du gebären?</li>
<li>Beratung über gesundheitsförderndes und vorbeugendes Verhalten</li>
<li>Ernährung und Bewegung</li>
<li>Eingehen auf das psychosoziale Umfeld, Information über Unterstützungsmöglichkeiten</li>
</ul>
<p>Ich berate dich gerne ausführlich und nehme mir Zeit für deine Anliegen, Fragen und vielleicht auch Sorgen.</p>
""",
  aside=("Information zur Abrechnung", "Als Hebamme mit Kassenvertrag laut Mutter-Kind-Pass-Verordnung rechne ich direkt mit der Krankenkasse ab. Für dich entstehen keine Kosten für das Beratungsgespräch.")),

 dict(slug="schwangerenvorsorge", title="Schwangerenvorsorge &amp; Stillberatung", nav="Schwangerenvorsorge", phase="schwanger",
  short="Zeit für deine Fragen – mit Kontrolle von Gewicht, Harn, Blutdruck, Herztönen und Kindslage.",
  img="vorsorge-instrumente.jpg", img_alt="Instrumente für die Schwangerenvorsorge: Doppler, Blutdruckmessgerät, Hörrohr, Maßband",
  lead="In der Sprechstunde nehmen wir uns Zeit, auf deine Fragen rund um Schwangerschaft, Geburt und Wochenbett genau einzugehen – ebenso auf Unsicherheiten, Ängste und Beschwerden.",
  body="""
<h2>Vorsorge in der Sprechstunde</h2>
<ul class="checklist">
<li>Beratungsgespräch zu allen Fragen rund um Schwangerschaft, Geburt und Wochenbett</li>
<li>Kontrolle von Gewicht, Harn und Blutdruck</li>
<li>Kontrolle der Herztöne und der Lage des Kindes</li>
</ul>
<h2>Stillberatung</h2>
<p>Für Fragen rund um das Thema Stillen oder bei bereits eingetretenen Stillproblemen bin ich gerne für dich da. Auch Hausbesuche im Wochenbett sind möglich.</p>
""",
  aside=("Gut zu wissen", "Bei schwangerschaftsbedingten Beschwerden wie Übelkeit, Rückenschmerzen oder Schlafproblemen kann ergänzend die APM unterstützen.")),

 dict(slug="geburtsvorbereitungskurs", title="Geburtsvorbereitungskurs", phase="schwanger",
  short="Im Team mit erfahrenen Kolleginnen und Kollegen – Einstieg in jeder Schwangerschaftswoche möglich.",
  badge="Einstieg jederzeit", img="beratung-tisch.jpg", img_alt="Kursunterlagen und Schwangerschaftsmodell in der Ordination",
  lead="Gemeinsam im Team mit erfahrenen Kolleginnen und Kollegen freue ich mich von Herzen, mich mit euch auf eine wundervolle Reise zu begeben – von der Schwangerschaft über die Geburt bis hin zur aufregenden ersten Zeit mit eurem Baby.",
  body="""
<p>In gemütlicher Atmosphäre und im intimen Rahmen möchten wir euch Gelegenheit geben, ganz viel rund ums Familie-Werden zu erfahren. Wir wollen euch sicher, bestärkt und selbstbestimmt auf eurem Weg unterstützen.</p>
<p>Neben vielen Informationen und Wissen über diese spannende Zeit ist selbstverständlich auch genügend Raum für eure persönlichen Fragen.</p>
<p><strong>Der Einstieg ist in jeder Schwangerschaftswoche möglich – wir freuen uns auf euch!</strong></p>
<p>Auf Wunsch ist Geburtsvorbereitung auch in Form von Einzelsprechstunden möglich.</p>
""",
  aside=("Kurstermine &amp; Folder", "Aktuelle Termine und den Kursfolder erhältst du telefonisch oder per E-Mail.")),

 dict(slug="beckenendlage-steisslage", title="Beckenendlage / Steißlage", nav="Steißlage &amp; Querlage", phase="schwanger",
  short="Sanfte Unterstützung mit Moxibustion, Dehnung und APM – empfohlen ab der 31./32. SSW.",
  badge="ab 31./32. SSW", img="schwangerschaftsmodell.jpg", img_alt="Anatomisches Modell eines Babys im Mutterleib",
  lead="Die meisten Kinder werden mit dem Köpfchen zuerst geboren. Einige entscheiden sich jedoch dafür, lieber in Mamas Bauch zu sitzen – man spricht dann von Steißlage bzw. Beckenendlage (BEL).",
  body="""
<p>Viele Kinder drehen sich selbständig in die Schädellage, meistens bis zur 34. Schwangerschaftswoche. Ist dies nicht der Fall, gibt es Möglichkeiten, das Kind auf sanfte Art und Weise zu unterstützen, die optimale Lage für eine Spontangeburt (vaginale Geburt) einzunehmen. Das Gleiche gilt für Kinder, die sich in Querlage befinden.</p>
<h2>Moxibustion</h2>
<p>Eine mögliche Methode ist die Moxibustion (Moxa) aus der Traditionellen Chinesischen Medizin. Dabei wird mittels einer Beifußzigarre ein Akupunkturpunkt an der kleinen Zehe erwärmt. Durch die Wärme werden Baby und Gebärmutter gut mit Energie versorgt und zu Bewegungen angeregt. Das Baby erhält die Information, dass es gut wäre, sich zu drehen – darf aber selbst entscheiden, ob es das will oder ob es für das Kind möglich ist.</p>
<h2>Ablauf einer Sitzung</h2>
<ul class="checklist">
<li>Kontrolle der Kindslage durch Abtasten des Bauches</li>
<li>Moxibustion</li>
<li>Dehnung der Beckenmuskulatur, um Raum für die Drehung zu schaffen</li>
<li>Abschließend eine entspannende APM (Akupunktmassage)</li>
<li>Übungen für zu Hause werden besprochen und erklärt</li>
</ul>
<p>So können Mutter und Kind auf körperlicher und geistig-seelischer Ebene gut entspannen und in Einklang gehen.</p>
""",
  aside=("Empfehlung", "Erstgebärenden empfehle ich diese sanfte Methode ab der 31./32. Schwangerschaftswoche, da das Kind dann noch ausreichend Platz hat, sich zu drehen. Optimal sind 3–4 Sitzungen im Abstand von 2–3 Tagen.")),

 dict(slug="geburtsbegleitung", title="Geburtsbegleitung", phase="geburt",
  short="Deine selbst gewählte Hebamme begleitet dich zur Geburt ins Krankenhaus.",
  img="elisabeth-ordination.jpg", img_alt="Elisabeth Schwarz-Blamauer in ihrer Ordination",
  lead="Die Geburtsbegleitung in das Krankenhaus bietet Frauen die Möglichkeit, sich „ihre Hebamme“ selbst auszusuchen. Entscheidend dafür sind das persönliche Vertrauensverhältnis und die Rundumbetreuung – von der Frühschwangerschaft über die Geburt bis ins Wochenbett.",
  body="""
<p>Unsicherheiten, Fragen, Ängste und Sorgen können jederzeit besprochen und in Vertrauen und Sicherheit umgewandelt werden.</p>
<h2>Mein Ansatz</h2>
<p>Als geburtsbegleitende Hebamme sehe ich mich in erster Linie als Wegbegleiterin: Raum geben, damit Mutter und Kind gut durch den Prozess von Schwangerschaft und Geburt gehen können – in ihrem Tempo und nach ihren Vorstellungen.</p>
<ul class="checklist">
<li>Dem eigenen Körper vertrauen lernen und sich einlassen</li>
<li>Schwangerschaft und Geburt selbstbewusst, selbstbestimmt und freudvoll erleben</li>
<li>Aktiv und aus eigener Kraft dein Kind gebären</li>
<li>Den geistig-seelischen Aspekt miteinbeziehen</li>
<li>Jede Familie in ihrer Individualität unterstützen</li>
</ul>
<p>Neues Leben ins Leben zu begleiten ist der kraftvollste und tiefgreifendste Prozess im Leben eines Menschen. Es ist mir eine große Freude, euch als werdende Eltern liebevoll zu unterstützen und die Bindung und Kommunikation mit eurem Kind umsichtig zu stärken. Mit jedem neugeborenen Kind werden auch eine Mutter und ein Vater geboren.</p>
<figure class="infobox infobox--alt">
<blockquote style="margin:0;font-family:var(--font-display);font-size:1.2rem;line-height:1.5;color:var(--color-text)">„… in der Form, wie eine Gesellschaft ein Neugeborenes empfängt, zeigt sie ihre tiefen Ressourcen und ihr Wissen vom Leben.“</blockquote>
<figcaption class="eyebrow">Jacques Gélis</figcaption>
</figure>
""",
  aside=("Rechtzeitig anfragen", "Für eine Geburtsbegleitung melde dich am besten bereits in der Frühschwangerschaft, damit wir uns gut kennenlernen können.")),

 dict(slug="nachsorge", title="Ambulante Nachsorge &amp; Wochenbett", nav="Nachsorge im Wochenbett", phase="wochenbett",
  short="Wochenbettbetreuung bei euch daheim – Stillen, Gewichtskontrolle, Screening und viel Zeit für Fragen.",
  badge="Hausbesuch", img="wickelplatz.jpg", img_alt="Wickelplatz mit Babywaage",
  lead="Das Leben mit einem Neugeborenen bringt neben Freude und unbeschreiblicher Liebe auch viele Fragen mit sich. Jedes Familienmitglied muss seinen Platz neu finden – als Frau und Mann werden wir zu Eltern, Geschwister werden zur „großen Schwester“ oder zum „großen Bruder“.",
  body="""
<p>Die ambulante Nachsorge oder Wochenbettbegleitung ist eine wundervolle, individuelle Begleitung, die auf die Bedürfnisse der jeweiligen Familie eingeht. In ruhigem, vertrautem Umfeld besuche ich „meine Familien“ daheim, um Fragen zu beantworten, Ängste und Sorgen zu besprechen und Eltern und Kinder beim Ankommen zu unterstützen.</p>
<h2>Das umfasst die Nachsorge</h2>
<ul class="checklist checklist--2col">
<li>Stillen oder Flaschennahrung</li>
<li>Gewichtskontrollen beim Baby</li>
<li>Fersenblutabnahme (Neugeborenen-Screening)</li>
<li>Verabreichung von Vitamin K</li>
<li>Stillberatung</li>
<li>Laserbehandlung bei wunden Brustwarzen, Dammwunden oder Kaiserschnittnarben</li>
</ul>
<p>Die Laserbehandlung unterstützt eine schnelle Abheilung und Regeneration – völlig schmerzlos und ohne Nebenwirkungen.</p>
<p>Für Fragen nehme ich mir gerne ausreichend Zeit. Ein ruhiges Ankommen daheim schafft eine gute Grundlage für einen entspannten Wochenbettverlauf. Fühlt ihr euch als Eltern sicher und gut aufgehoben, gebt ihr dieses Gefühl an euer Kind weiter.</p>
""",
  aside=("Nach der Geburt", "Melde dich am besten schon in der Schwangerschaft, damit wir die Wochenbettbetreuung gut planen können.")),

 dict(slug="apm", title="APM – Akupunktmassage nach Penzel", nav="APM nach Penzel", phase="therapie",
  short="Sanfte Massage entlang der Meridiane – bei Kinderwunsch, Schwangerschaftsbeschwerden und im Wochenbett.",
  img="elisabeth-ordination.jpg", img_alt="Behandlungsliege in der Hebammenordination",
  lead="APM bedeutet AkuPunktMassage nach Penzel – eine ganzheitliche Methode zum Ausgleichen der Energie im Körper.",
  body="""
<p>Mit einem Massagestäbchen werden die Meridiane (Energiebahnen im Körper) entlanggezogen. Das ist sehr angenehm und entspannend. Ziel ist, Energieblockaden aufzulösen und die Harmonie des Körpers wiederherzustellen – ihn „ins Fließen“ zu bringen.</p>
<h2>In der Schwangerschaft</h2>
<p>Die APM unterstützt von Beginn an. Erste Beschwerden wie Übelkeit, Erbrechen, Unwohlsein oder Stimmungsschwankungen können gut begleitet werden, ebenso Rückenschmerzen, Schlafprobleme, unruhige Beine und Wassereinlagerungen ab Mitte der Schwangerschaft. Zur Vorbereitung auf die Geburt eignet sich die APM hervorragend ab der 34. Schwangerschaftswoche, um Mutter und Kind gut auf das Ereignis Geburt einzustimmen.</p>
<h2>Nach der Geburt</h2>
<p>Stimmungsschwankungen, Stillprobleme und Geburts- oder Kaiserschnittnarben können durch blockierte Energiebahnen Probleme bereiten. Auch hier ist die APM ein guter Begleiter.</p>
<h2>Bei Kinderwunsch</h2>
<p>Unerfüllter Kinderwunsch kann auch eine Frage der Energie sein. APM ist eine gute Unterstützung bei Problemen, schwanger zu werden.</p>
<h2>APM unterstützt bei</h2>
<ul class="checklist checklist--2col">
<li>Kinderwunsch</li>
<li>Beschwerden in der Schwangerschaft</li>
<li>Beckenendlage (Steißlage des Kindes)</li>
<li>Geburtsvorbereitung ab der 34. SSW</li>
<li>Stillproblemen im Wochenbett</li>
<li>Narbenentstörung (Dammverletzungen, Kaiserschnittnarben)</li>
</ul>
""",
  aside=("Ausbildung", "Ausgebildet bei Günther Hankowetz (Österreich) und an der Penzel Akademie in Heyen (Deutschland).")),

 dict(slug="narbenentstoerung", title="Narbenentstörung", phase="therapie",
  short="Nach Kaiserschnitt oder Dammverletzung – schmerzfrei mit Händen, APM-Stäbchen und Laser.",
  img=None,
  lead="Nach über 20 Jahren Berufserfahrung konnte ich viele Eindrücke sammeln, wie sich Narben auf unser Leben auswirken können. Nicht jede Narbe verursacht Probleme – aber doch die meisten.",
  body="""
<p>Durch meine Ausbildung zur APM-Therapeutin und in der täglichen Praxis habe ich mich auf Narbenentstörung spezialisiert und kann auf reichlich Erfahrung zurückgreifen.</p>
<h2>Narben ganzheitlich wahrnehmen</h2>
<p>Narben können schmerzen, gerötet oder entzündet sein, wulstig oder eingezogen erscheinen, ein Taubheitsgefühl auslösen oder sich völlig unscheinbar präsentieren. Wichtig ist, die Narbe in ihrer Ganzheit wahrzunehmen: tiefer zu fühlen und nachzuspüren, was sich unter der Narbe tut, wie sich die einzelnen Gewebsschichten anfühlen und wie das Gewebe kommuniziert.</p>
<h2>Wirkung über den Ort hinaus</h2>
<p>Narben bereiten nicht nur an ihrem Erscheinungsort Probleme. Sie können den Energiefluss stören und auf andere Körperregionen Einfluss nehmen. So kann etwa eine Kaiserschnittnarbe starke Kopfschmerzen auslösen oder eine Dammverletzung Rückenschmerzen verursachen.</p>
<p>Vor allem Dammverletzungen sind noch immer ein Tabuthema, über das sich viele Betroffene nicht austauschen. Es sind jedoch nicht wenige Frauen betroffen, die still leiden in der Hoffnung, dass sich die Situation von alleine löst. Viele körperliche Beschwerden lassen sich durch das Aufspüren von Störfeldern – den Narben – wieder gut beseitigen. Vor allem Kaiserschnittnarben sollten im Hinblick auf weitere Schwangerschaften gut entstört werden.</p>
<h2>Die Behandlung</h2>
<p>Narbenentstörung ist nicht schmerzhaft. Ich arbeite mit meinen Händen, dem APM-Stäbchen und dem Laser. Je nach Größe und Beschaffenheit der Narbe können mehrere Sitzungen notwendig sein, bis sich wieder Wohlbefinden einstellt.</p>
""",
  aside=("Ausbildung", "Ausgebildet nach dem Liedler-Konzept bei Michaela Liedler (Wien) und an der Penzel Akademie (Deutschland).")),

 dict(slug="lasertherapie", title="Lasertherapie", phase="therapie",
  short="Schmerz- und nebenwirkungsfrei: fördert die Wundheilung und lindert Entzündungen.",
  badge="schmerzfrei", img=None,
  lead="Der Einsatz des Therapielasers bringt viele Vorteile mit sich: Er ist schnell und unkompliziert in der Anwendung und schafft rasche Linderung in vielen Bereichen.",
  body="""
<p>Lasertherapie beeinflusst durch die Bestrahlung den Stoffwechsel der Zellen, wodurch die Abwehr der Erkrankung bzw. die Heilung durch biochemische Vorgänge unterstützt wird. Sie ist eine Regulationstherapie und absolut schmerz- und nebenwirkungsfrei.</p>
<h2>Anwendungsbeispiele</h2>
<ul class="checklist checklist--2col">
<li>Brustabszesse</li>
<li>Wunde, schmerzende Brustwarzen bei stillenden Müttern</li>
<li>Ödematöse und aufgehende Nähte nach Kaiserschnitt oder Dammschnitt/-riss</li>
<li>Wundheilungsstörungen</li>
<li>Narbenschmerzen</li>
<li>Hämorrhoiden</li>
<li>Fieberblasen</li>
<li>Schlecht heilender Nabel beim Baby</li>
<li>Windeldermatitis / wunder Popo</li>
</ul>
<h2>Lasertherapie …</h2>
<ul class="checklist checklist--2col">
<li>fördert die Durchblutung</li>
<li>hemmt Entzündungen</li>
<li>lindert Schmerzen</li>
<li>vermindert das Infektionsrisiko</li>
<li>beschleunigt die Wundheilung</li>
</ul>
""",
  aside=("Auch als Hausbesuch", "Im Wochenbett kann die Laserbehandlung im Rahmen der Nachsorge direkt bei dir zu Hause erfolgen.")),

 dict(slug="klangmassage", title="Klangmassage &amp; Gong", phase="therapie",
  short="Tiefe Entspannung mit Klangschalen und Gong – auch in der Schwangerschaft.",
  img="klangschalen-gong.jpg", img_alt="Gong, Klangschalen und Koshi-Klangspiele",
  lead="Mit Hilfe von Klangschalen und Gong kannst du dich vom Alltagsstress lösen, neue Energie und Kraft tanken, die Selbstheilungskräfte aktivieren und das Selbstvertrauen stärken.",
  body="""
<p>Da Klang das ursprüngliche Vertrauen des Menschen anspricht, kommt es schnell zu tiefer Entspannung. In diesem Zustand werden Probleme losgelassen, Verspannungen und Blockaden gelöst und jede Körperzelle sanft massiert und harmonisiert.</p>
<p>Der menschliche Körper besteht überwiegend aus Wasser, das durch die Schallwellen in Bewegung versetzt wird. Das wirkt wie eine innerliche Massage der Körperzellen – ähnlich den konzentrischen Wellen, die entstehen, wenn ein Stein ins Wasser fällt.</p>
<h2>Anwendungsgebiete</h2>
<ul class="checklist checklist--2col">
<li>Schlafprobleme</li>
<li>Kopfschmerzen</li>
<li>Unterleibskrämpfe</li>
<li>Verdauungsprobleme</li>
<li>Nacken- und Schulterverspannungen</li>
<li>Rückenschmerzen</li>
<li>Unruhe, Nervosität, Ängste</li>
<li>Konzentrationsprobleme</li>
<li>Stress, seelische und körperliche Überlastung</li>
<li>Schwangerschaft</li>
</ul>
<h2>In der Schwangerschaft</h2>
<p>Die Klangmassage kann helfen, sich besser an die Veränderungen im Körper zu gewöhnen. Sie wirkt ganzheitlich, reduziert Stress und Ängste und kann emotionale Unterstützung geben. Das Gefühl von Sicherheit, Geborgenheit und Urvertrauen wird genährt, Muskelverspannungen werden sanft gelöst und die Körperwahrnehmung unterstützt. Auch das Baby freut sich über die Klänge und darf sich gemeinsam mit Mama entspannen.</p>
""",
  aside=("Für alle", "Klangmassage fördert Entspannung und Gesunderhaltung – nicht nur in der Schwangerschaft.")),
]
BY = {s["slug"]: s for s in S}
PHASES = [("schwanger", "In der Schwangerschaft"), ("geburt", "Bei der Geburt"), ("wochenbett", "Im Wochenbett"), ("therapie", "Therapien &amp; Methoden")]

def nav_label(s): return s.get("nav", s["title"])

# ------------------------------------------------------------------ Layout
def header(current):
    def cur(slug): return ' aria-current="page"' if slug == current else ''
    drop = []
    for ph, label in PHASES:
        drop.append(f'<li class="nav__menu-label">{label}</li>')
        for s in S:
            if s["phase"] == ph:
                drop.append(f'<li><a href="{s["slug"]}.html"{cur(s["slug"])}>{nav_label(s)}</a></li>')
    drop.append(f'<li><a href="angebote.html"{cur("angebote")}><strong>Alle Angebote im Überblick</strong></a></li>')
    mob = "".join(f'<li><a href="{s["slug"]}.html"{cur(s["slug"])}>{nav_label(s)}</a></li>' for s in S)
    leist_cur = current in BY or current == "angebote"
    return f'''<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
<header class="site-header">
<div class="container site-header__inner" style="position:relative">
<a class="brand" href="index.html" aria-label="Hebammenordination Gföhl – Startseite">
<img src="assets/img/logo.png" alt="" width="26" height="44">
<span><span class="brand__name">Elisabeth Schwarz-Blamauer</span><span class="brand__role">Hebamme in Gföhl</span></span>
</a>
<nav class="nav" aria-label="Hauptnavigation">
<ul class="nav__list">
<li><a class="nav__link" href="index.html"{cur("index")}>Start</a></li>
<li><details class="nav__drop"><summary class="nav__link"{' aria-current="page"' if leist_cur else ''}>Leistungen</summary><ul class="nav__menu">{"".join(drop)}</ul></details></li>
<li><a class="nav__link" href="ueber-mich.html"{cur("ueber-mich")}>Über mich</a></li>
<li><a class="nav__link" href="impressionen.html"{cur("impressionen")}>Impressionen</a></li>
</ul>
<a class="btn btn--secondary" href="kontakt.html"{cur("kontakt")}>Kontakt</a>
</nav>
<details class="mobile-nav">
<summary aria-label="Menü öffnen">Menü</summary>
<div class="mobile-nav__panel">
<ul>
<li><a href="index.html"{cur("index")}>Start</a></li>
<li><a href="angebote.html"{cur("angebote")}>Alle Angebote</a></li>
{mob}
<li><a href="ueber-mich.html"{cur("ueber-mich")}>Über mich</a></li>
<li><a href="impressionen.html"{cur("impressionen")}>Impressionen</a></li>
<li><a href="links.html"{cur("links")}>Links</a></li>
</ul>
<a class="btn btn--primary" href="kontakt.html" style="width:100%">Kontakt &amp; Termin</a>
</div>
</details>
</div>
</header>'''

def footer():
    leist = "".join(f'<li><a href="{s["slug"]}.html">{nav_label(s)}</a></li>' for s in S)
    return f'''<footer class="site-footer">
<div class="container site-footer__grid">
<div>
<h2>Hebammenordination Gföhl</h2>
<p>Elisabeth Schwarz-Blamauer<br>{ADDR}</p>
<p class="mt-4"><a href="{TEL_HREF}">{TEL}</a><br><a href="mailto:{MAIL}">{MAIL}</a></p>
<p class="mt-4">Termine nach telefonischer Vereinbarung.</p>
</div>
<div><h2>Leistungen</h2><ul>{leist}</ul></div>
<div><h2>Ordination</h2><ul>
<li><a href="angebote.html">Alle Angebote</a></li>
<li><a href="ueber-mich.html">Über mich</a></li>
<li><a href="impressionen.html">Impressionen</a></li>
<li><a href="links.html">Links</a></li>
<li><a href="kontakt.html">Kontakt</a></li>
</ul></div>
</div>
<div class="container site-footer__bottom">
<span>© {YEAR} Hebammenordination Gföhl · www.insLeben.at</span>
<span><a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></span>
</div>
</footer>'''

def page(fname, title, desc, current, body):
    full_title = f"{title} – Hebammenordination Gföhl" if current != "index" else "Hebammenordination Gföhl – Elisabeth Schwarz-Blamauer, Hebamme"
    html = f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{full_title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#FBF6F4">
<link rel="icon" href="assets/img/logo.png">
<link rel="preload" href="assets/fonts/fraunces-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/components.css">
</head>
<body>
{header(current)}
<main id="inhalt">
{body}
</main>
{footer()}
</body>
</html>
'''
    with open(os.path.join(OUT, fname), "w", encoding="utf-8") as f:
        f.write(html)

def crumbs(items):
    lis = "".join(f'<li><a href="{h}">{t}</a></li>' if h else f'<li aria-current="page">{t}</li>' for t, h in items)
    return f'<nav class="breadcrumb" aria-label="Brotkrumen"><ol>{lis}</ol></nav>'

def page_hero(eyebrow, title, lead, crumb_items):
    return f'''<section class="page-hero"><div class="container"><div class="page-hero__inner">
{crumbs(crumb_items)}
<span class="eyebrow">{eyebrow}</span>
<h1>{title}</h1>
<p class="lead">{lead}</p>
</div></div></section>'''

def cta_band():
    return f'''<section class="section" style="padding-top:0"><div class="container">
<div class="cta-band">
<div class="stack stack--sm"><h2>Ich freue mich auf ein persönliches Kennenlernen.</h2><p>Termine nach telefonischer Vereinbarung.</p></div>
<div class="btn-row"><a class="btn btn--light" href="{TEL_HREF}">{TEL}</a><a class="btn btn--secondary" style="border-color:#fff;color:#fff" href="mailto:{MAIL}">E-Mail schreiben</a></div>
</div></div></section>'''

# ------------------------------------------------------------------ Startseite
def build_index():
    rows = "".join(f'''<li><a class="index-row" href="{s["slug"]}.html"><span class="index-row__num">{i+1:02d}</span><h3>{nav_label(s)}</h3><p>{s["short"]}</p></a></li>''' for i, s in enumerate(S))
    body = f'''
<section class="hero"><div class="container split">
<div class="stack" style="flex:1.15 1 460px">
<span class="eyebrow">Hebammenordination Gföhl</span>
<h1>Neues Leben <em>ins Leben</em> begleiten.</h1>
<p class="lead">Herzlich willkommen! Fachlich fundiert, ganzheitlich und mit viel Zeit begleite ich dich durch Schwangerschaft, Geburt und Wochenbett – in deinem Tempo und nach deinen Vorstellungen.</p>
<div class="btn-row"><a class="btn btn--primary" href="kontakt.html">Kennenlernen vereinbaren</a><a class="btn btn--ghost" href="{TEL_HREF}">{TEL}</a></div>
</div>
<div><div class="arch"><img src="assets/img/elisabeth-hero.jpg" alt="Elisabeth Schwarz-Blamauer, Hebamme in Gföhl" width="520" height="721"></div></div>
</div></section>

<section class="trust" aria-label="Auf einen Blick"><div class="container"><ul>
<li>{ICON_CHECK}Hebamme mit Kassenvertrag</li>
<li>{ICON_CHECK}Ausbildung Semmelweis-Frauenklinik Wien</li>
<li>{ICON_CHECK}Über 20 Jahre Berufserfahrung</li>
<li>{ICON_CHECK}Hausbesuche im Wochenbett</li>
</ul></div></section>

<section class="section"><div class="container">
<div class="section-head section-head--center"><span class="eyebrow">Rundumbetreuung</span><h2>Ein Stück des Weges gemeinsam gehen</h2></div>
<div class="grid-3">
<div class="step"><span class="step__num">I</span><h3>Schwangerschaft</h3><p class="muted">Mutter-Kind-Pass-Beratung, Vorsorge mit Harn- und Blutdruckkontrolle und Lagekontrolle, APM bei Beschwerden, Moxen bei Steißlage und Geburtsvorbereitung – im Kurs oder in Einzelsprechstunden.</p><a class="link-arrow" href="angebote.html#schwanger">Zu den Angeboten</a></div>
<div class="step"><span class="step__num">II</span><h3>Geburt</h3><p class="muted">Geburtsbegleitung in das Krankenhaus – mit „deiner“ Hebamme, die du selbst ausgesucht hast. Selbstbewusst, selbstbestimmt und aus eigener Kraft.</p><a class="link-arrow" href="geburtsbegleitung.html">Geburtsbegleitung</a></div>
<div class="step"><span class="step__num">III</span><h3>Wochenbett</h3><p class="muted">Nachbetreuung daheim, Stillberatung, Narbenentstörung und Lasertherapie – für ein ruhiges, sicheres Ankommen als Familie.</p><a class="link-arrow" href="nachsorge.html">Nachsorge</a></div>
</div>
</div></section>

<section class="section" style="padding-top:0"><div class="container">
<div class="card">
<img class="card__media" src="assets/img/schwangerschaftsmodell.jpg" alt="Anatomisches Schwangerschaftsmodell in der Ordination" loading="lazy">
<div class="card__body">
<span class="badge">Kostenlos · 18.–22. SSW</span>
<h2>Mutter-Kind-Pass-Beratung</h2>
<p class="muted">Jede Frau hat im Rahmen des Mutter-Kind-Passes Anspruch auf ein einstündiges Gratisgespräch mit einer Hebamme. Wir sprechen über Schwangerschaftsverlauf, Geburt, Wochenbett und Stillen, Geburtsformen, Ernährung und Bewegung sowie dein psychosoziales Umfeld.</p>
<p class="muted">Ich rechne direkt mit der Krankenkasse ab – für dich entstehen keine Kosten.</p>
<div class="btn-row"><a class="btn btn--primary" href="kontakt.html">Gespräch vereinbaren</a><a class="link-arrow" href="mutter-kind-pass-beratung.html">Mehr erfahren</a></div>
</div>
</div>
</div></section>

<section class="section section--inverse"><div class="container">
<div class="section-head section-head--split"><h2>Leistungen &amp; Methoden</h2><p>Klassische Hebammenarbeit, ergänzt durch Methoden aus Zusatzausbildungen – über viele Jahre in der Praxis verfeinert.</p></div>
<ul class="index-list">{rows}</ul>
</div></section>

<section class="section"><figure class="container quote">
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C29B9E" stroke-width="1.5" aria-hidden="true"><path d="M7 7h4v4c0 3-2 5-4 6M15 7h4v4c0 3-2 5-4 6"/></svg>
<blockquote>Mit jedem neugeborenen Kind werden auch eine Mutter und ein Vater geboren.</blockquote>
<figcaption>Elisabeth Schwarz-Blamauer</figcaption>
</figure></section>

<section class="section section--alt"><div class="container split">
<div><img src="assets/img/elisabeth-ordination.jpg" alt="Elisabeth Schwarz-Blamauer in ihrer Ordination" style="width:100%;aspect-ratio:4/5;max-height:560px;object-fit:cover;border-radius:var(--radius-md)" loading="lazy"></div>
<div class="stack" style="flex:1.2 1 460px">
<span class="eyebrow">Über mich</span>
<h2>Meine Ordination ist mein Herzensprojekt.</h2>
<p class="muted">Nach der Ausbildung an der Ignaz-Semmelweis-Frauenklinik in Wien arbeitete ich in den Krankenhäusern Tulln und Krems. Seit 2012 bin ich ganz selbständig – und habe es nie bereut. Als Mutter von zwei Söhnen weiß ich, wie groß die Veränderung ist, die neues Leben mit sich bringt.</p>
<ul class="chip-list" aria-label="Zusatzausbildungen">
<li class="chip">APM nach Penzel</li><li class="chip">Narbenentstörung (Liedler-Konzept)</li><li class="chip">HARA</li><li class="chip">Klassische Homöopathie</li><li class="chip">Energetische Methoden</li>
</ul>
<a class="link-arrow" href="ueber-mich.html">Mehr über mich</a>
</div>
</div></section>

<section class="section"><div class="container split" style="align-items:flex-start">
<div class="stack" style="flex:1 1 380px"><h2>Ich freue mich auf <em class="accent">dich.</em></h2><p class="muted">Termine nach telefonischer Vereinbarung.</p></div>
<div class="contact-grid" style="flex:1.2 1 440px">
<div class="contact-item"><span class="eyebrow">Ordination</span><span>{ADDR}</span></div>
<div class="contact-item"><span class="eyebrow">Telefon</span><a class="contact-item__big" href="{TEL_HREF}">{TEL}</a></div>
<div class="contact-item"><span class="eyebrow">E-Mail</span><a href="mailto:{MAIL}">{MAIL}</a></div>
</div>
</div></section>
'''
    page("index.html", "Start", "Hebammenordination Gföhl – Elisabeth Schwarz-Blamauer begleitet dich ganzheitlich durch Schwangerschaft, Geburt und Wochenbett. Hebamme mit Kassenvertrag.", "index", body)

# ------------------------------------------------------------------ Leistungsseiten
def build_service(s):
    phase_label = dict(PHASES)[s["phase"]]
    fig = f'<figure class="figure"><img src="assets/img/{s["img"]}" alt="{s["img_alt"]}" loading="lazy"></figure>' if s.get("img") else ""
    badge = f'<span class="badge">{s["badge"]}</span>' if s.get("badge") else ""
    others = [o for o in S if o["phase"] == s["phase"] and o is not s][:3] or [o for o in S if o is not s][:3]
    rel = "".join(f'<li><a href="{o["slug"]}.html">{nav_label(o)}</a></li>' for o in others)
    a_t, a_p = s["aside"]
    body = page_hero(phase_label, s["title"], s["lead"], [("Start", "index.html"), ("Leistungen", "angebote.html"), (nav_label(s), None)]) + f'''
<section class="section" style="padding-top:0"><div class="container detail">
<article class="detail__main prose">{s["body"]}</article>
<aside class="detail__aside" aria-label="Auf einen Blick">
{fig}
<div class="infobox">{badge}<h2>{a_t}</h2><p class="muted">{a_p}</p>
<div class="btn-row mt-4"><a class="btn btn--primary" href="{TEL_HREF}">{TEL}</a></div>
<a class="link-arrow" href="mailto:{MAIL}">E-Mail schreiben</a></div>
<div class="infobox infobox--alt"><h2 style="font-size:1.15rem">Weitere Angebote</h2><ul class="stack stack--sm" style="list-style:none;margin:0;padding:0">{rel}</ul></div>
</aside>
</div></section>
''' + cta_band()
    page(s["slug"] + ".html", nav_label(s).replace("&amp;", "&"), s["short"], s["slug"], body)

# ------------------------------------------------------------------ Angebote
def build_angebote():
    blocks = []
    lists = {
     "schwanger": ["Mutter-Kind-Pass-Beratung (zwischen der 18. und 22. SSW), kostenlos – direkte Abrechnung mit der Krankenkasse",
                   "Vorsorge mit Beratungsgesprächen, Harn- und Blutdruckkontrollen und Lagekontrolle des Kindes",
                   "APM bei Schwangerschaftsbeschwerden wie Übelkeit, Erbrechen, Kreislaufproblemen, Juckreiz, Schlafproblemen, Rückenschmerzen und Wassereinlagerungen",
                   "APM und Moxen bei Beckenendlage (Steißlage)",
                   "APM zur Geburtsvorbereitung ab der 34. SSW",
                   "Geburtsvorbereitung im Kurs oder in Einzelsprechstunden"],
     "geburt": ["Geburtsbegleitung in das Krankenhaus"],
     "wochenbett": ["Nachbetreuung daheim (ambulante Nachsorge / Wochenbettbetreuung)", "Stillberatung",
                    "Narbenentstörung bei Dammverletzungen oder nach Kaiserschnitt",
                    "Laserbestrahlung bei wunden, schmerzenden Brustwarzen, Dammverletzungen und Kaiserschnittnarben"],
     "therapie": ["APM – Akupunktmassage nach Penzel", "Narbenentstörung", "Lasertherapie", "Klangmassage &amp; Gong"],
    }
    for i, (ph, label) in enumerate(PHASES):
        items = "".join(f"<li>{t}</li>" for t in lists[ph])
        links = "".join(f'<a class="btn btn--secondary" href="{s["slug"]}.html">{nav_label(s)}</a>' for s in S if s["phase"] == ph)
        alt = " section--alt" if i % 2 else ""
        blocks.append(f'''<section class="section{alt}" id="{ph}"><div class="container split" style="align-items:flex-start">
<div class="stack" style="flex:1 1 320px"><span class="step__num">{["I","II","III","IV"][i]}</span><h2>{label}</h2></div>
<div class="stack" style="flex:2 1 520px"><ul class="checklist">{items}</ul><div class="btn-row mt-4">{links}</div></div>
</div></section>''')
    body = page_hero("Meine Angebote", "Als Hebamme bin ich gerne für dich da.", "Von der Mutter-Kind-Pass-Beratung bis zur Nachsorge daheim – alle Leistungen der Hebammenordination Gföhl im Überblick.", [("Start", "index.html"), ("Alle Angebote", None)]) + "".join(blocks) + '<div class="mt-7"></div>' + cta_band()
    page("angebote.html", "Meine Angebote", "Alle Leistungen der Hebammenordination Gföhl: Schwangerschaft, Geburt, Wochenbett und ergänzende Therapien.", "angebote", body)

# ------------------------------------------------------------------ Über mich
def build_ueber():
    edu = [("APM", "AkuPunktMassage nach Penzel – ausgebildet bei Günther Hankowetz (Österreich) und an der Penzel Akademie, Heyen (Deutschland)"),
           ("Narbenentstörung", "Ausgebildet nach dem Liedler-Konzept bei Michaela Liedler, Wien, und an der Penzel Akademie (Deutschland)"),
           ("HARA", "Die professionelle manuelle Arbeit mit den Bauch- und Beckenorganen – Fortbildung bei Mag. Anja Bader, Innsbruck"),
           ("Homöopathie", "CHIRON – Bildungs- und Gesundheitszentrum für Klassische Homöopathie, Werner Schade (Cunewalde, Deutschland)"),
           ("Energetische Methoden nach Thaddäus Starek", "Ausgebildet bei Thaddäus Starek und Dr. Slawomir Sówka (Seeboden, Techendorf am Weißensee und Wien)")]
    cards = "".join(f'<div class="infobox"><h3>{t}</h3><p class="muted">{d}</p></div>' for t, d in edu)
    body = page_hero("Über mich", "Elisabeth Schwarz-Blamauer", "Hebamme mit Herz und klinischer Erfahrung – seit 2012 selbständig in meiner Hebammenordination in Gföhl.", [("Start", "index.html"), ("Über mich", None)]) + f'''
<section class="section" style="padding-top:0"><div class="container split" style="align-items:flex-start">
<div style="flex:1 1 360px"><div class="arch"><img src="assets/img/elisabeth-ordination.jpg" alt="Elisabeth Schwarz-Blamauer" loading="lazy"></div></div>
<div class="prose" style="flex:1.4 1 480px">
<p>Meine Ausbildung zur Hebamme habe ich an der Ignaz-Semmelweis-Frauenklinik in Wien absolviert. Nach meiner Zeit in Wien zog es mich zuerst in das Krankenhaus Tulln und nach der ersten Karenz in das Krankenhaus Krems, während ich gleichzeitig schon freiberuflich tätig war.</p>
<p>Dankbar für die Erfahrungen im Klinikbereich und nach der Geburt meiner beiden Söhne habe ich mich 2012 in die reine Selbständigkeit gewagt – und es bis heute nicht bereut. Meine Hebammenordination in Gföhl ist mein Herzensprojekt. Ich empfinde es als großes Privileg, nach meinen Vorstellungen arbeiten zu dürfen.</p>
<p>Neugierig geworden, was mir bei der Begleitung „meiner Frauen“ noch hilfreich sein könnte, habe ich zusätzliche Ausbildungen in APM, Narbenentstörung, HARA, Homöopathie und energetischen Methoden absolviert.</p>
<h2>Ganzheitliche Begleitung</h2>
<p>Meine Begleitung sehe ich ganzheitlich. Es gibt kein Standardkonzept, sondern eine Betreuung, die individuell auf die jeweilige Situation und die persönlichen Bedürfnisse von Mutter und Kind abgestimmt ist.</p>
<p>Neues Leben in sich zu spüren bedeutet eine große Veränderung und Herausforderung im Leben einer Frau, einer Familie. Mit jeder Geburt wird ein neues Kapitel Familiengeschichte aufgeschlagen. Als Mutter von zwei Söhnen kann ich das persönlich gut nachvollziehen. Daher ist es mir sehr wichtig, dass werdende Familien in dieser besonderen Lebensphase ihren Wünschen entsprechend umsichtig und liebevoll betreut werden.</p>
<p><strong>Ich freue mich sehr darauf, ein Stück gemeinsam mit euch zu gehen!</strong></p>
</div>
</div></section>
<section class="section section--alt"><div class="container">
<div class="section-head"><span class="eyebrow">Qualifikation</span><h2>Zusatzausbildungen</h2></div>
<div class="grid-3">{cards}</div>
</div></section>
<div class="mt-7"></div>''' + cta_band()
    page("ueber-mich.html", "Über mich", "Elisabeth Schwarz-Blamauer – Hebamme, ausgebildet an der Semmelweis-Frauenklinik Wien, seit 2012 selbständig in Gföhl.", "ueber-mich", body)

# ------------------------------------------------------------------ Kontakt
def build_kontakt():
    body = page_hero("Kontakt", "Ich freue mich auf <em class=\"accent\">dich.</em>", "Termine nach telefonischer Vereinbarung. Am besten erreichst du mich telefonisch – gerne auch per E-Mail.", [("Start", "index.html"), ("Kontakt", None)]) + f'''
<section class="section" style="padding-top:0"><div class="container split" style="align-items:stretch">
<div class="infobox" style="flex:1 1 420px;gap:var(--space-6)">
<div class="contact-item"><span class="eyebrow">Hebammenordination Gföhl</span><span class="contact-item__big">Elisabeth Schwarz-Blamauer</span></div>
<div class="contact-item"><span class="eyebrow">Adresse</span><span>{ADDR}</span></div>
<div class="contact-item"><span class="eyebrow">Telefon</span><a class="contact-item__big" href="{TEL_HREF}">{TEL}</a></div>
<div class="contact-item"><span class="eyebrow">E-Mail</span><a href="mailto:{MAIL}">{MAIL}</a></div>
<div class="btn-row"><a class="btn btn--primary" href="{TEL_HREF}">Jetzt anrufen</a><a class="btn btn--secondary" href="https://www.google.com/maps/search/?api=1&amp;query=Kirchengasse+2,+3542+G%C3%B6hl" rel="noopener" target="_blank">Route planen</a></div>
</div>
<div style="flex:1 1 420px"><img src="assets/img/elisabeth-hero.jpg" alt="Elisabeth Schwarz-Blamauer" style="width:100%;height:100%;min-height:360px;object-fit:cover;border-radius:var(--radius-lg)" loading="lazy"></div>
</div></section>'''
    page("kontakt.html", "Kontakt", "Kontakt zur Hebammenordination Gföhl: Kirchengasse 2, 3542 Gföhl, Tel. 0676 / 743 08 39.", "kontakt", body)

# ------------------------------------------------------------------ Impressionen
def build_impressionen():
    imgs = [("elisabeth-portraet.jpg", "Elisabeth Schwarz-Blamauer in der Ordination"), ("elisabeth-ordination.jpg", "Behandlungsraum"),
            ("beratung-tisch.jpg", "Beratungsplatz"), ("schwangerschaftsmodell.jpg", "Schwangerschaftsmodell"),
            ("vorsorge-instrumente.jpg", "Instrumente für die Vorsorge"), ("wickelplatz.jpg", "Wickelplatz mit Babywaage"),
            ("klangschalen-gong.jpg", "Gong und Klangschalen"), ("gong.jpg", "Gong"), ("koshi-klangspiele.jpg", "Koshi-Klangspiele"),
            ("mutter-kind-pass.jpg", "Mutter-Kind-Pass"), ("beratungsplatz.jpg", "Schreibtisch in der Ordination")]
    g = "".join(f'<figure class="figure"><img src="assets/img/{f}" alt="{a}" loading="lazy"><figcaption>{a}</figcaption></figure>' for f, a in imgs)
    body = page_hero("Impressionen", "Eindrücke aus der Ordination", "Ein Blick in die Hebammenordination in der Kirchengasse in Gföhl.", [("Start", "index.html"), ("Impressionen", None)]) + f'<section class="section" style="padding-top:0"><div class="container gallery">{g}</div></section>' + cta_band()
    page("impressionen.html", "Impressionen", "Eindrücke aus der Hebammenordination Gföhl.", "impressionen", body)

# ------------------------------------------------------------------ Links
def build_links():
    body = page_hero("Links", "Empfehlenswerte Seiten", "Partnerinnen und Partner, mit denen ich gerne zusammenarbeite.", [("Start", "index.html"), ("Links", None)]) + '''
<section class="section" style="padding-top:0"><div class="container container--narrow stack">
<div class="infobox"><h2>Energethiker Dietmar Schwarz</h2><a class="link-arrow" href="https://www.insLicht.at" rel="noopener" target="_blank">www.insLicht.at</a></div>
<div class="infobox"><h2>Die Frauenärztinnen</h2><a class="link-arrow" href="https://www.frauenärztinnen.at" rel="noopener" target="_blank">www.frauenärztinnen.at</a></div>
<p class="muted" style="font-size:var(--text-sm)">Obige Links verweisen auf externe Webseiten Dritter, auf deren Inhalt wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
</div></section>'''
    page("links.html", "Links", "Empfohlene Links der Hebammenordination Gföhl.", "links", body)

# ------------------------------------------------------------------ Impressum / Datenschutz
def build_legal():
    imp = page_hero("Rechtliches", "Impressum", "Informationspflicht laut § 5 E-Commerce-Gesetz und Offenlegungspflicht laut § 25 Mediengesetz.", [("Start", "index.html"), ("Impressum", None)]) + f'''
<section class="section" style="padding-top:0"><div class="container container--narrow prose">
<p><strong>Elisabeth Schwarz-Blamauer</strong><br>Hebamme – Hebammenordination Gföhl<br>{ADDR}<br>Österreich</p>
<p>Telefon: <a href="{TEL_HREF}">{TEL}</a><br>E-Mail: <a href="mailto:{MAIL}">{MAIL}</a></p>
<p><strong>Berufsbezeichnung:</strong> Hebamme (verliehen in Österreich)<br>
<strong>Berufsrecht:</strong> Hebammengesetz (HebG), abrufbar unter <a href="https://www.ris.bka.gv.at" rel="noopener" target="_blank">www.ris.bka.gv.at</a><br>
<strong>Kammer:</strong> Österreichisches Hebammengremium, <a href="https://www.hebammen.at" rel="noopener" target="_blank">www.hebammen.at</a></p>
<div class="infobox infobox--alt"><p class="muted"><strong>Hinweis vor Veröffentlichung:</strong> Bitte Angaben prüfen und ggf. ergänzen (z.&#160;B. UID-Nummer, falls vorhanden).</p></div>
<h2>Haftung für Inhalte</h2>
<p>Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Die Informationen ersetzen keine persönliche Beratung oder ärztliche Behandlung.</p>
<h2>Bildnachweis</h2>
<p>Alle Fotos: Hebammenordination Gföhl.</p>
</div></section>'''
    page("impressum.html", "Impressum", "Impressum der Hebammenordination Gföhl.", "impressum", imp)
    ds = page_hero("Rechtliches", "Datenschutz", "Der Schutz deiner persönlichen Daten ist mir ein besonderes Anliegen.", [("Start", "index.html"), ("Datenschutz", None)]) + f'''
<section class="section" style="padding-top:0"><div class="container container--narrow prose">
<h2>Verantwortliche</h2>
<p>Elisabeth Schwarz-Blamauer, {ADDR.replace("<br>", ", ")}, <a href="mailto:{MAIL}">{MAIL}</a></p>
<h2>Keine Cookies, kein Tracking</h2>
<p>Diese Website verwendet keine Cookies, keine Analyse- oder Tracking-Werkzeuge und bindet keine externen Inhalte ein. Die Schriften werden direkt von diesem Server geladen; es werden dabei keine Daten an Dritte übertragen.</p>
<h2>Hosting</h2>
<p>Beim Aufruf der Website werden technisch notwendige Daten (z.&#160;B. IP-Adresse, Zeitpunkt, aufgerufene Seite) vom Hosting-Anbieter in Server-Logfiles verarbeitet, um den sicheren Betrieb zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).</p>
<h2>Kontaktaufnahme</h2>
<p>Wenn du per Telefon oder E-Mail Kontakt aufnimmst, werden deine Angaben zur Bearbeitung der Anfrage und für Anschlussfragen verarbeitet. Gesundheitsdaten im Rahmen der Betreuung unterliegen der beruflichen Verschwiegenheitspflicht.</p>
<h2>Deine Rechte</h2>
<p>Dir stehen die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch zu. Beschwerden kannst du bei der Österreichischen Datenschutzbehörde einbringen (<a href="https://www.dsb.gv.at" rel="noopener" target="_blank">www.dsb.gv.at</a>).</p>
<div class="infobox infobox--alt"><p class="muted"><strong>Hinweis vor Veröffentlichung:</strong> Hosting-Anbieter eintragen, sobald die endgültige Domain feststeht.</p></div>
</div></section>'''
    page("datenschutz.html", "Datenschutz", "Datenschutzerklärung der Hebammenordination Gföhl.", "datenschutz", ds)

if __name__ == "__main__":
    build_index()
    for s in S: build_service(s)
    build_angebote(); build_ueber(); build_kontakt(); build_impressionen(); build_links(); build_legal()
    print("ok", len(os.listdir(OUT)))
