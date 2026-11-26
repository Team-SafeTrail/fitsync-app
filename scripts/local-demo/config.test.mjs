import test from 'node:test';
import assert from 'node:assert/strict';
import {demoConfig,demoProject,runtimeRoot,privateRoot,repoRoot} from './config.mjs';
import {sep} from 'node:path';
test('isolated configuration cannot seed baseline data or inherit an AI key',()=>{
 const result=demoConfig('project_id = "fitsync-app"\n[db.seed]\nenabled = true\nsql_paths = ["./seed.sql"]\n[studio]\nopenai_api_key = "env(OPENAI_API_KEY)"\n');
 assert.match(result,new RegExp(`project_id = "${demoProject}"`));assert.match(result,/enabled = false/);assert.match(result,/sql_paths = \[\]/);assert.match(result,/openai_api_key = ""/);assert.doesNotMatch(result,/env\(OPENAI_API_KEY\)/);
});
test('unknown source configuration is rejected instead of silently targeting another stack',()=>{
 assert.throws(()=>demoConfig('project_id="other-project"\n[db.seed]\nenabled=true'),/Unexpected/);
 assert.throws(()=>demoConfig('project_id="fitsync-app"'),/Missing seed/);
});
test('runtime and credential handoff stay outside the application Git tree',()=>{
 assert.equal(runtimeRoot.startsWith(repoRoot+sep),false);assert.equal(privateRoot.startsWith(repoRoot+sep),false);
});
