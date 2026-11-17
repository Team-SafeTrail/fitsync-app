import {prepareRuntime,runtimeRoot} from './config.mjs';
const manifest=await prepareRuntime();
console.log(JSON.stringify({prepared:true,directory:runtimeRoot,projectId:manifest.projectId,migrations:manifest.migrations.length,syntheticOnly:true,cloudEnvCopied:false,databaseStarted:false}));
