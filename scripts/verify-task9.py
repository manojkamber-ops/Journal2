"""Task ID 9 closure verification: current issue = Vol 9 Issue 3, first paper = uploaded manuscript."""
import json
import urllib.request

BASE = 'http://localhost:3000'

d = json.load(urllib.request.urlopen(f'{BASE}/api/journal'))
li = d['latestIssue']
print('latestIssue:', li.get('id'), '| Vol', li.get('volume'), 'Issue', li.get('number'), '|', li.get('month'), li.get('year'))

arts = d.get('latestArticles') or []
print('latestArticles n:', len(arts))
if arts:
    a0 = arts[0]
    print('first latest:', a0.get('id'), '| pp', a0.get('pageStart'), '-', a0.get('pageEnd'))
    print('  title:', (a0.get('title') or '')[:90])
    print('  authors:', json.dumps(a0.get('authors'), ensure_ascii=False)[:160])

iid = li['id']
j = json.load(urllib.request.urlopen(f'{BASE}/api/issues/{iid}'))
lst = j.get('articles') or (j.get('issue') or {}).get('articles') or []
print('\nissue detail n:', len(lst))
for a in lst[:4]:
    print(' ', a.get('id'), '| pp', a.get('pageStart'), '-', a.get('pageEnd'), '|', (a.get('title') or '')[:60])

first = lst[0] if lst else None
ok = bool(first) and first.get('id') == 'IJCS-2026-0247' and str(first.get('pageStart')) == '1'
print('\nRESULT:', 'PASS — uploaded manuscript is first paper of current issue' if ok else 'CHECK SHAPE — inspect manually')
