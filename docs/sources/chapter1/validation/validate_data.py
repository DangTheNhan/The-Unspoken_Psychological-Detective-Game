from pathlib import Path
import json,copy,collections,itertools
O=Path(__file__).resolve().parents[1];B=O.parent
D=json.loads((O/'data/chapter1.json').read_text());SD=json.loads((O/'data/game-state.definitions.json').read_text());N={n['id']:n for n in D['nodes']}
checks=[]
def check(v,label):
 if not v:raise AssertionError(label)
 checks.append(label)
def get(obj,path):
 for p in path.strip('/').split('/'):
  if not isinstance(obj,dict) or p not in obj:return None
  obj=obj[p]
 return obj
def put(obj,path,value):
 parts=path.strip('/').split('/');o=obj
 for x in parts[:-1]:o=o.setdefault(x,{})
 o[parts[-1]]=copy.deepcopy(value)
class Runner:
 def __init__(self):self.s=copy.deepcopy(SD['initialState']);self.input={};self.history=[];self.event=0
 def context(self):
  b={'people':{},'checkpoints':{},'notebook':{'finalUpdate':'commit_ch1_final_notebook'}}
  for k,v in D['bindings']['people'].items():
   val=get(self.s,v['statePath'])
   if val is not None:b['people'][k]=val
  for k,v in D['bindings']['checkpoints'].items():
   val=get(self.s,v['statePath'])
   if val is not None:b['checkpoints'][k]=v['storageKey']
  return {'state':self.s,'bindings':b,'input':self.input}
 def ev(self,e):
  if 'literal'in e:return copy.deepcopy(e['literal'])
  if 'ref'in e:return get(self.context(),e['ref'])
  if 'predicate'in e:return self.ev(D['predicates'][e['predicate']])
  a=[self.ev(x)for x in e['args']];op=e['op']
  if op=='all':return all(a)
  if op=='any':return any(a)
  if op=='not':return not a[0]
  if op=='exists':return a[0] is not None
  if op=='contains':return a[1] in (a[0] or [])
  if op=='eq':return a[0]==a[1]
  if op=='ne':return a[0]!=a[1]
  if op=='gt':return a[0]>a[1]
  if op=='gte':return a[0]>=a[1]
  if op=='lt':return a[0]<a[1]
  if op=='lte':return a[0]<=a[1]
  if op=='add':return sum(a)
  if op=='subtract':return a[0]-a[1]
  if op=='max':return max(a)
  if op=='min':return min(a)
  raise AssertionError(('unknown expr',op))
 def effects(self,es,node):
  for e in es:
   op=e['op']
   if op=='save_checkpoint':
    if e['checkpointId']not in self.s['checkpoints'] or e['overwrite']:self.s['checkpoints'][e['checkpointId']]=copy.deepcopy({k:v for k,v in self.s.items() if k!='checkpoints'})
    continue
   val=self.ev(e['after']);path=e['path'];old=get(self.s,path)
   if op in ['set','increment']:put(self.s,path,val)
   elif op in ['upsert_record','collect_evidence']:
    if old is None:
     if path.startswith(('/statements/','/observations/','/evidence_records/','/timeline/')):val.update(source_node=e.get('sourceNode',node),source_step=node,collected_phase=self.s['current_phase'],source_kind='professional_record' if node.startswith('P3_') and ('POLICE' in node or 'REPORT' in node or 'RECOVER' in node) or node.startswith('P4_COIN_RECORD') or node.startswith('P4_SURVEY_FIRST') else 'observed' if path.startswith('/observations/') else 'source_node')
     put(self.s,path,val)
    if op=='collect_evidence'and e['evidenceId']not in self.s['evidence_collected']:self.s['evidence_collected'].append(e['evidenceId'])
   elif op=='merge_record':
    if old is not None:put(self.s,path,{**old,**val})
   else:raise AssertionError(('unknown effect',op))
 def run(self,id,stop=None):
  for _ in range(500):
   if id==stop:return id
   if id=='CH2_ENTRY':return id
   n=N[id]
   if not self.ev(n.get('conditions',{'literal':True})):raise AssertionError(('node guarded',id))
   self.s['current_node']=id;self.history.append(id)
   if n['type']=='checkpoint_restore':
    cps=self.s['checkpoints'];self.s=copy.deepcopy(cps[n['checkpointId']]);self.s['checkpoints']=cps;id=self.s['current_node'];continue
   self.s['credibility']=max(0,self.s['credibility']-n.get('credibilityPenalty',0))
   self.effects(n.get('effects',[]),id)
   if n['type']in ['choice','investigation','cross_examination','deduction','checklist']:return id
   if n['type']in ['source_view','record_view']:
    if 'evidenceId'in n:check(n['evidenceId']in self.s['evidence_collected'],'view only collected '+id)
    if 'statementId'in n:check(n['statementId']in self.s['statements'],'view only acquired statement '+id)
   nxt=n.get('next')
   if isinstance(nxt,list):
    candidates=[r for r in nxt if self.ev(r['conditions'])]
    check(bool(candidates),'router has true route '+id);id=candidates[0]['targetNode']
   elif isinstance(nxt,str):id=nxt
   else:raise AssertionError(('no next',id))
  raise AssertionError('run exceeds limit')
 def choose(self,target):
  n=N[self.s['current_node']];cs=n.get('choices',[])+n.get('hotspots',[])
  matches=[c for c in cs if c['targetNode']==target]
  check(any(self.ev(c.get('condition',{'literal':True}))for c in matches),'choice available '+n['id']+' -> '+target)
  return self.run(target)
 def press(self,sid):
  check(sid in self.s['statements'],'Press acquired '+sid)
  rule=D['statementRules'][sid];r=next(r for r in rule['press']['routes']if self.ev(r['conditions']))
  return self.run(r['targetNode'])
 def present(self,sid,eid):
  check(sid in self.s['statements'],'Present acquired statement '+sid)
  rule=D['statementRules'][sid]['present']
  check(rule['enabled']and self.ev(rule.get('condition',{'literal':True})),'Present active '+sid)
  check(eid in self.s['evidence_collected'],'Present collected '+eid)
  rs=[r for r in rule['routes']if r['evidenceId']==eid and self.ev(r['condition'])]
  check(bool(rs),'Present route '+sid+' '+eid)
  r=rs[0];self.s['credibility']=max(0,self.s['credibility']-r['credibilityPenalty']);self.event+=1
  self.run(r['targetNode']);return r['result']

check(len(N)==len(D['nodes']),'unique dialogue node IDs')
schema=json.loads((O/'data/chapter.schema.json').read_text());allowed=set(schema['$defs']['node']['properties'])
for n in N.values():
 check(set(n)<=allowed,'contract node fields '+n['id'])
 check(n['type']in schema['$defs']['node']['properties']['type']['enum'],'contract node type '+n['id'])
 if n['type']=='dialogue':check(all(k in n for k in ['speaker','expression','text','next']),'dialogue fields '+n['id'])
 if n['type']in ['narration','action','ui']:check(all(k in n for k in ['text','next']),'text node fields '+n['id'])
def refs(v,key):
 out=[]
 if isinstance(v,dict):
  for k,x in v.items():
   if k==key and isinstance(x,str):out.append(x)
   out+=refs(x,key)
 elif isinstance(v,list):
  for x in v:out+=refs(x,key)
 return out
for target in refs(D,'targetNode')+refs(D,'next'):check(target in N or target=='CH2_ENTRY','valid target '+target)
for p in refs(D,'predicate'):check(p in D['predicates'],'valid predicate '+p)
for eid in refs(D,'evidenceId'):check(eid in {e['id'] for e in json.loads((O/'data/evidence.json').read_text())['records']},'valid evidence ID '+eid)
sm=json.loads((O/'data/source-map.json').read_text())['runtimeText']
all_source='\n'.join((O/f'scripts/{x}').read_text()for x in ['CHAPTER_1_PHASE_1.md','CHAPTER_1_PHASE_2.md','CHAPTER_1_PHASE_3.md','CHAPTER_1_PHASE_4.md','CHAPTER_1_FINAL_DEDUCTION.md'])
for id,m in sm.items():
 if N[id]['type']=='dialogue':check(m['text']in all_source,'verbatim NPC/detective speech '+id)
# Graph edges include handlers invoked by the Statement and Notebook UI.
edges={id:set(refs(n,'targetNode')+refs(n,'next')+n.get('possibleTargets',[]))for id,n in N.items()}
for id,n in N.items():
 for sid in n.get('statementRules',[]):
  edges[id].update(refs(D['statementRules'][sid],'targetNode'))
reachable=set();pending=['P1_001']
while pending:
 id=pending.pop()
 if id in reachable:continue
 reachable.add(id);pending.extend(edges.get(id,set())-reachable)
unreachable=set(N)-reachable
print('Unreachable',sorted(unreachable))
check(not unreachable,'no unreachable nodes including Press/Present UI edges')

def play(optional=False):
 r=Runner();check(r.run('P1_001')=='P1_HOA_MENU','P1 starts in 201 then Hòa')
 r.choose('P1_HOA_04');r.choose('P1_LINH_DISPATCH');r.choose('P1_LINH_04');r.choose('P1_HAO_DISPATCH');r.choose('P1_HAO_04');r.choose('P1_MINH_DISPATCH');r.choose('P1_MINH_04')
 check('ST_P1_MINH_WASH'not in r.s['statements'],'optional Phase1 wash not auto recorded')
 check(not r.s['evidence_collected'],'Phase1 collects no physical evidence')
 r.choose('P1_END_CHECK');check(r.s['current_node']=='P2_ROOM_UI','P1 police opens Phase2')
 hps=['P2_LOCK_DISPATCH','P2_NECK_DISPATCH','P2_INHALER_DISPATCH','P2_RECEIPT_DISPATCH','P2_WATCH_DISPATCH']
 for hp in reversed(hps):r.choose(hp)
 check(len(r.s['evidence_collected'])==5,'P2 five core in arbitrary order')
 if optional:
  for hp in ['P2_TOWEL_DISPATCH','P2_BOX_DISPATCH','P2_SURVEY_DISPATCH','P2_COIN_DISPATCH']:
   r.choose(hp)
   if hp=='P2_COIN_DISPATCH':r.choose('P2_COIN_DETAIL')
 r.choose('P2_EXIT_CHECK')
 if not optional:r.choose('P2_EXIT')
 check(r.s['current_node']=='P3_HUB','Phase2 core opens Phase3')
 check('ch1_phase3_start'in r.s['checkpoints'],'actual Phase3 start checkpoint saved')
 if not optional:
  check('EV_WetTowel'not in r.s['evidence_collected'],'uncollected towel stays absent')
  r.choose('P3_ROOM_RETURN');r.choose('P2_TOWEL_DISPATCH');r.choose('P2_BOX_DISPATCH');r.choose('P2_EXIT_CHECK')
 check(not r.s['flags']['deduction_unlocked'],'Final not open just seven inspections')
 r.choose('P3_MINH_START');r.press('ST_P1_MINH_INITIAL')
 check(r.s['statements']['ST_P1_MINH_WASH']['collected_phase']==3,'skipped wash statement first acquired Phase3')
 r.present('ST_P1_MINH_WASH','EV_WetTowel');r.present('ST_P3_MINH_VISIT_DETAIL','EV_Inhaler');r.present('ST_P3_MINH_MEDICINE','EV_InhalerBox')
 r.choose('P3_HUB');r.choose('P3_HAO_START');r.press('ST_P1_HAO_INITIAL');r.choose('P3_A3');r.choose('P3_A2');r.choose('P3_203_REQUEST');r.choose('P3_A4')
 r.choose('P3_LINH_START');r.press('ST_P1_LINH_INITIAL');r.present('ST_P3_LINH_REPEAT','EV_MissingWatch');r.press('ST_P3_LINH_WATCH_DEFENSE');r.choose('P3_L4')
 r.choose('P3_HOA_START');r.press('ST_P1_HOA_INITIAL')
 c=r.s['credibility'];check(r.present('ST_P3_HOA_REPEAT','EV_Inhaler')=='wrong','distinct wrong reply chosen');check(r.s['credibility']==c-15,'wrong Present one penalty 15')
 r.present('ST_P3_HOA_REPEAT','EV_LooseLock');check(r.s['credibility']==c-15,'lock support no penalty and no confession')
 check(not r.s['flags']['hoa_entry_admitted'],'loose lock alone cannot identify entry')
 r.present('ST_P3_HOA_REPEAT','EV_RentReceipt');r.choose('P3_H3');r.choose('P3_H4')
 if optional:r.choose('P3_CERTIFICATE')
 check(r.ev({'predicate':'ROLES_DONE'}),'three different NPCs resolved')
 r.choose('P3_MINH_START');r.choose('P3_MINH_R4');r.choose('P3_R4_HAO');r.choose('P3_R4_HOA');r.choose('P3_R4_LINH')
 r.choose('P3_POLICE_CHECK');r.choose('P3_MINH_START');r.present('ST_P3_MINH_NO_HANDLING','EV_PackagingMatch')
 check(not r.s['flags']['deduction_unlocked'],'partial admission cannot open Final')
 r.press('ST_P3_MINH_PARTIAL');r.choose('P3_RECOVER');r.choose('P3_MINH_START');r.present('ST_P3_MINH_OLD_LOCATION','EV_OriginalInhaler');r.choose('P3_HUB');r.choose('P3_SEND');r.choose('P3_SEND_CONFIRM')
 check(r.s['current_node']=='P3_HUB','professional report after explicit time skip')
 check(r.s['flags']['victim_link_confirmed'],'report contains victim link')
 check(not r.s['flags']['scene_revisit_available'],'scene revisits closed after samples')
 r.choose('P3_MINH_START');r.present('ST_P3_MINH_NORMAL_REPLACEMENT','EV_MedicineAnalysis');r.press('ST_P3_MINH_ACT')
 check(r.s['flags']['minh_act_admitted'],'act not merely opportunity')
 check('ST_P4_MINH_HOSTAGE'not in r.s['statements'],'hostage detail not revealed before Phase4')
 r.choose('P3_READY');r.choose('P3_END')
 check(r.s['current_node']=='FD_BOARD','Final correctly opened')
 return r
r=play(False);saved_pre_final=copy.deepcopy(r.s)
check(r.ev({'predicate':'ENTRY_READY'}),'all Final bindings and records accessible')
c=r.s['credibility'];r.choose('FD_SUBMIT');check(r.s['credibility']==c,'incomplete Final no penalty')
r.s['deduction']['draft']=copy.deepcopy(D['deduction']['answerKey']);r.s['deduction']['draft']['who']='DC_WHO_HOA';r.choose('FD_SUBMIT')
check(r.s['credibility']==c-20,'wrong complete Final one penalty 20');check(not r.s['flags']['deduction_solved'],'wrong Final never reconstructs')
r.s['deduction']['draft']=copy.deepcopy(D['deduction']['answerKey']);r.choose('FD_SUBMIT')
check(r.s['current_node']=='FD_HANDOFF_MENU','correct answer reconstructs and hands off')
check(r.s['flags']['final_notebook_updated'],'final Notebook handler commits')
check(r.s['case_conclusions']['CH1']['when_precision']=='relation','Player timeline remains relation not author exact minute')
r.choose('FD_PHASE_TRANSITION');check(r.s['current_node']=='P4_MINH_MENU','Phase4 fully implemented')
r.choose('P4_MINH_HOSTAGE');r.choose('P4_MINH_DEBT');r.choose('P4_HUB');r.choose('P4_CLOSE_GATE')
check(r.s['current_node']=='P4_INCOMPLETE','Phase4 completion not automatic before mystery sources')
r.run('P4_HUB');r.choose('P4_COIN_OPEN');check(r.s['evidence_records']['EV_BoundaryCoin']['collected_phase']==4,'late coin source Phase4 not backdated')
r.choose('P4_HAO_COIN');r.choose('P4_SURVEY_RECORD');r.choose('P4_LINH_SURVEY');r.choose('P4_CERTIFICATE');r.choose('P4_CLOSE_GATE')
check(r.s['current_node']=='CH2_ENTRY','Chapter1 ends at explicit Chapter2 boundary')
check(r.s['flags']['chapter1_complete'],'Chapter1 truly complete')
check('EV_Survey'not in r.s['evidence_collected'],'survey stays environmental observation')
check(r.s['statements']['ST_P4_MINH_HOSTAGE']['status']=='claimed','hostage is sourced claim not independently proved')

# Alternative path: optional material collected earlier preserves source history.
q=play(True);q.s['deduction']['draft']=copy.deepcopy(D['deduction']['answerKey']);q.choose('FD_SUBMIT');q.choose('FD_PHASE_TRANSITION');q.choose('P4_MINH_DEBT');q.choose('P4_MINH_HOSTAGE');q.choose('P4_HUB');q.choose('P4_COIN_OPEN');q.choose('P4_HAO_COIN');q.choose('P4_LINH_SURVEY');q.choose('P4_CERTIFICATE');q.choose('P4_CLOSE_GATE')
check(q.s['current_node']=='CH2_ENTRY','full optional path also finishes Chapter1')
check(q.s['evidence_records']['EV_BoundaryCoin']['collected_phase']==2,'coin acquired Phase2 provenance retained')
check(q.s['evidence_records']['EV_KhangCertificate']['collected_phase']==3,'certificate acquired Phase3 provenance retained')
check(q.s['observations']['OBS_P2_SURVEY']['collected_phase']==2,'environment observed Phase2 not overwritten')

# Credibility zero restores the real snapshot rather than inventing a score.
z=Runner();z.s=copy.deepcopy(saved_pre_final);z.s['credibility']=20;z.s['deduction']['draft']=copy.deepcopy(D['deduction']['answerKey']);z.s['deduction']['draft']['who']='DC_WHO_HOA';z.run('FD_SUBMIT');check(z.s['current_node']=='FD_BAD_MENU','zero credibility causes Bad Ending');z.choose('CHECKPOINT_PRE_FINAL');check(z.s['credibility']==saved_pre_final['credibility'],'checkpoint restores actual score');check(z.s['deduction']['draft']['who']is None,'checkpoint restores actual draft')

result={'status':'passed','assertions':len(checks),'nodes':len(N),'statements':len(json.loads((O/'data/statements.json').read_text())['records']),'evidence':12,'unreachableNodes':[],'brokenTargets':[],'tested':['structural data contract','UTF-8 JSON parsing','unique node/reference IDs','verbatim speech provenance','graph including Press/Present handlers','five-core exit + valid return for towel/box','Phase1 optional question first acquired in Phase3','nonlinear NPC and R4 order','wrong/support Present scoring','professional report victim link','incomplete/wrong/correct Final','actual checkpoint restoration','Phase4 late optional evidence fallbacks','preserved provenance when optional items collected early','end-to-end Chapter1 to explicit CH2 boundary'],'notTested':['existing user Phaser/React code unavailable','actual UI event de-duplication and file IO to be implemented in engine','hotspot coordinates and visual assets need mapping to existing demo']}
(O/'validation/validation.results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
