#!/usr/bin/env python3
"""Refresh the school lookup files in src/assets/schools/ from the NCES Common Core of Data
(public and public charter schools) via the Urban Institute Education Data Portal.
    python3 scripts/update-schools.py [year]      # default 2024
Keeps open schools only (status open, new, added, changed agency, reopened)."""
import json, sys, time, re, collections, urllib.request, concurrent.futures as cf
YEAR = sys.argv[1] if len(sys.argv) > 1 else '2024'
OUT = 'src/assets/schools'
FIPS = [1,2,4,5,6,8,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,44,45,46,47,48,49,50,51,53,54,55,56,60,66,69,72,78]
OPEN = {1, 3, 4, 5, 8}
def get(url):
    for i in range(5):
        try:
            with urllib.request.urlopen(url, timeout=120) as r: return json.load(r)
        except Exception as e:
            err = e; time.sleep(2 ** i)
    raise err
def state(f):
    url, rows = f'https://educationdata.urban.org/api/v1/schools/ccd/directory/{YEAR}/?fips={f}', []
    while url:
        d = get(url); rows += d['results']; url = d.get('next')
    return rows
def city(c):
    c = re.sub(r"\bMc([a-z])", lambda m: 'Mc' + m.group(1).upper(), c.strip().title())
    return re.sub(r"'S\b", "'s", c)
def grade(g):
    return None if g is None or g < -1 else {-1: 'PK', 0: 'K', 13: 'Adult', 14: 'UG'}.get(g, str(g))
by = collections.defaultdict(list)
with cf.ThreadPoolExecutor(6) as ex:
    for rows in ex.map(state, FIPS):
        for r in rows:
            if r['school_status'] not in OPEN or not r.get('city_location'): continue
            lo, hi = grade(r['lowest_grade_offered']), grade(r['highest_grade_offered'])
            by[r['state_location']].append([r['ncessch'], r['school_name'].strip(), city(r['city_location']), (r['lea_name'] or '').strip(), 1 if r['charter'] == 1 else 0, f'{lo}-{hi}' if lo and hi else ''])
for st, rows in by.items():
    rows.sort(key=lambda x: (x[2], x[1]))
    json.dump({'source': f'NCES Common Core of Data {YEAR} via Urban Institute Education Data Portal', 'fields': ['nces_id', 'name', 'city', 'district', 'charter', 'grades'], 'schools': rows}, open(f'{OUT}/{st}.json', 'w'), separators=(',', ':'))
print(len(by), 'states/territories,', sum(map(len, by.values())), 'schools')
