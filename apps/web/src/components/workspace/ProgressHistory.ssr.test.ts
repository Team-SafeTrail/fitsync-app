import React from "react";
import {renderToString} from "react-dom/server";
import {expect,it,vi} from "vitest";
import {readFileSync} from "node:fs";
import ts from "typescript";
import * as jsxRuntime from "react/jsx-runtime";
import * as progressData from "./progress-data";
import type {InBodyRecord} from "../../features/workspace/data";

// Next keeps JSX for its own compiler. Compile this isolated, dependency-bounded
// component for SSR rather than changing the app's tsconfig/test-wide transform.
const source=readFileSync(new URL("./ProgressHistory.tsx",import.meta.url),"utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const modules:Record<string,unknown>={react:React,"react/jsx-runtime":jsxRuntime,"./progress-data":progressData};
const componentModule:{exports:{default?:React.ComponentType<{records:InBodyRecord[]}>}}={exports:{}};
new Function("require","module","exports",compiled)((id:string)=>{if(!(id in modules))throw new Error("Unexpected SSR test dependency");return modules[id];},componentModule,componentModule.exports);
const ProgressHistory=componentModule.exports.default!;

it("server-renders multi-point SVG titles as plain text without hydration warnings",()=>{
 const rows=[70,69].map((weight,index)=>({id:`synthetic-${index}`,recorded_at:`2026-10-${29+index}T12:00:00Z`,weight_kg:weight,skeletal_muscle_mass_kg:30,percent_body_fat:20} as InBodyRecord));
 const errors=vi.spyOn(console,"error").mockImplementation(()=>{});
 try {
  const html=renderToString(React.createElement(ProgressHistory,{records:rows}));
  expect(errors).not.toHaveBeenCalled();
  const titles=Array.from(html.matchAll(/<title>([\s\S]*?)<\/title>/g),match=>match[1]);
  expect(titles).toHaveLength(2);expect(titles.every(title=>!title.includes("<!--")&&title.includes("kg"))).toBe(true);
 } finally {errors.mockRestore();}
});
