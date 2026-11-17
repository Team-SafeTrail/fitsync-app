import {defineConfig} from "@playwright/test";
import main from "./playwright.config";
const servers=main.webServer?(Array.isArray(main.webServer)?main.webServer:[main.webServer]):[];

export default defineConfig({
 ...main,
 testDir:"./tests/local-demo",
 outputDir:"./test-results/local-demo",
 retries:0,
 use:{...main.use,trace:"off",viewport:{width:1280,height:900},video:{mode:"on",size:{width:1280,height:900}}},
 webServer:servers.map(server=>({...server,reuseExistingServer:false,env:{...server.env,FITSYNC_DEMO_MODE:"true"}})),
});
